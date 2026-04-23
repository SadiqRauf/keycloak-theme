import { Fragment, useState, type FormEvent } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import { clsx } from "keycloakify/tools/clsx";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useScript } from "keycloakify/login/pages/Login.useScript";
import { emailRegexp } from "keycloakify/tools/emailRegExp";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../login/KcContext";
import type { I18n } from "../../login/i18n";

type Props = PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>;

function PasswordWrapper(props: {
    kcClsx: ReturnType<typeof getKcClsx>["kcClsx"];
    i18n: I18n;
    passwordInputId: string;
    "aria-invalid"?: boolean;
    onPasswordInput?: () => void;
    tabIndex?: number;
}) {
    const { kcClsx, i18n, passwordInputId, "aria-invalid": ariaInvalid, onPasswordInput, tabIndex } = props;
    const { msgStr } = i18n;
    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <div className={kcClsx("kcInputGroup")}>
            <input
                tabIndex={tabIndex ?? 3}
                id={passwordInputId}
                className={kcClsx("kcInputClass")}
                name="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={ariaInvalid}
                onInput={onPasswordInput}
            />
            <button
                type="button"
                className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                <i
                    className={kcClsx(
                        isPasswordRevealed
                            ? "kcFormPasswordVisibilityIconHide"
                            : "kcFormPasswordVisibilityIconShow"
                    )}
                    aria-hidden={true}
                />
            </button>
        </div>
    );
}

export default function LoginPage(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const {
        social,
        realm,
        url,
        usernameHidden,
        login,
        auth,
        registrationDisabled,
        messagesPerField,
        enableWebAuthnConditionalUI,
        authenticators
    } = kcContext;
    const { msg, msgStr } = i18n;
    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);
    const [clientUsernameError, setClientUsernameError] = useState<string | null>(null);
    const [clientPasswordError, setClientPasswordError] = useState<string | null>(null);

    const webAuthnButtonId = "authenticateWebAuthnButton";
    useScript({
        webAuthnButtonId,
        kcContext,
        i18n
    });

    const serverAuthError = messagesPerField.existsError("username", "password");

    const validateClient = (form: HTMLFormElement): boolean => {
        const usernameEl = form.querySelector('[name="username"]') as HTMLInputElement | null;
        const username = usernameEl?.value?.trim() ?? "";
        const password = (form.querySelector('[name="password"]') as HTMLInputElement | null)?.value ?? "";

        let uErr: string | null = null;
        let pErr: string | null = null;

        if (!usernameHidden) {
            if (!username) {
                uErr =
                    realm.loginWithEmailAllowed && realm.registrationEmailAsUsername
                        ? msgStr("missingEmailMessage")
                        : msgStr("missingUsernameMessage");
            } else if (
                realm.loginWithEmailAllowed &&
                realm.registrationEmailAsUsername &&
                !emailRegexp.test(username)
            ) {
                uErr = msgStr("invalidEmailMessage");
            }
        }

        if (!password) {
            pErr = msgStr("missingPasswordMessage");
        }

        setClientUsernameError(uErr);
        setClientPasswordError(pErr);
        return uErr === null && pErr === null;
    };

    const handleLoginSubmit = (e: FormEvent<HTMLFormElement>) => {
        if (!validateClient(e.currentTarget)) {
            e.preventDefault();
            return;
        }
        setClientUsernameError(null);
        setClientPasswordError(null);
        setIsLoginButtonDisabled(true);
    };

    const usernameLabel =
        !realm.loginWithEmailAllowed
            ? msg("username")
            : !realm.registrationEmailAsUsername
              ? msg("usernameOrEmail")
              : msg("email");

    const usernameAriaInvalid = serverAuthError || !!clientUsernameError;
    const passwordAriaInvalid = serverAuthError || !!clientPasswordError;

    const selectedCredential =
        auth && typeof auth === "object" && "selectedCredential" in auth
            ? String((auth as { selectedCredential?: string }).selectedCredential ?? "")
            : "";

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <Fragment>
                    {realm.password &&
                        social?.providers !== undefined &&
                        social.providers.length !== 0 && (
                            <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                                <hr />
                                <h2>{msg("identity-provider-login-label")}</h2>
                                <ul
                                    className={kcClsx(
                                        "kcFormSocialAccountListClass",
                                        social.providers.length > 3 && "kcFormSocialAccountListGridClass"
                                    )}
                                >
                                    {social.providers.map((p, _i, providers) => (
                                        <li key={p.alias}>
                                            <a
                                                id={`social-${p.alias}`}
                                                className={kcClsx(
                                                    "kcFormSocialAccountListButtonClass",
                                                    providers.length > 3 && "kcFormSocialAccountGridItem"
                                                )}
                                                href={p.loginUrl}
                                            >
                                                {p.iconClasses && (
                                                    <i
                                                        className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)}
                                                        aria-hidden={true}
                                                    />
                                                )}
                                                <span
                                                    className={clsx(
                                                        kcClsx("kcFormSocialAccountNameClass"),
                                                        p.iconClasses && "kc-social-icon-text"
                                                    )}
                                                    dangerouslySetInnerHTML={{
                                                        __html: kcSanitize(p.displayName)
                                                    }}
                                                />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                </Fragment>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={handleLoginSubmit}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <label htmlFor="username" className={kcClsx("kcLabelClass")}>
                                        {usernameLabel}
                                    </label>
                                    <input
                                        tabIndex={2}
                                        id="username"
                                        className={kcClsx("kcInputClass")}
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        type="text"
                                        autoFocus
                                        autoComplete={
                                            enableWebAuthnConditionalUI ? "username webauthn" : "username"
                                        }
                                        aria-invalid={usernameAriaInvalid}
                                        onInput={() => clientUsernameError && setClientUsernameError(null)}
                                    />
                                    {!usernameHidden && serverAuthError && (
                                        <span
                                            id="input-error-username"
                                            className={kcClsx("kcInputErrorMessageClass")}
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(
                                                    messagesPerField.getFirstError("username", "password")
                                                )
                                            }}
                                        />
                                    )}
                                    {!usernameHidden && !serverAuthError && clientUsernameError && (
                                        <span
                                            id="input-error-username"
                                            className={kcClsx("kcInputErrorMessageClass")}
                                            aria-live="polite"
                                        >
                                            {clientUsernameError}
                                        </span>
                                    )}
                                </div>
                            )}
                            <div className={kcClsx("kcFormGroupClass")}>
                                <label htmlFor="password" className={kcClsx("kcLabelClass")}>
                                    {msg("password")}
                                </label>
                                <PasswordWrapper
                                    kcClsx={kcClsx}
                                    i18n={i18n}
                                    passwordInputId="password"
                                    aria-invalid={passwordAriaInvalid}
                                    onPasswordInput={() => clientPasswordError && setClientPasswordError(null)}
                                    tabIndex={3}
                                />
                                {usernameHidden && serverAuthError && (
                                    <span
                                        id="input-error"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(
                                                messagesPerField.getFirstError("username", "password")
                                            )
                                        }}
                                    />
                                )}
                                {!serverAuthError && clientPasswordError && (
                                    <span
                                        id="input-error-password"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite"
                                    >
                                        {clientPasswordError}
                                    </span>
                                )}
                            </div>
                            <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="checkbox">
                                            <label>
                                                <input
                                                    tabIndex={5}
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    type="checkbox"
                                                    defaultChecked={!!login.rememberMe}
                                                />{" "}
                                                {msg("rememberMe")}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={selectedCredential} />
                                <input
                                    tabIndex={7}
                                    disabled={isLoginButtonDisabled}
                                    className={kcClsx(
                                        "kcButtonClass",
                                        "kcButtonPrimaryClass",
                                        "kcButtonBlockClass",
                                        "kcButtonLargeClass"
                                    )}
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                    value={msgStr("doLogIn")}
                                />
                            </div>
                        </form>
                    )}
                    {enableWebAuthnConditionalUI && (
                        <Fragment>
                            <form id="webauth" action={url.loginAction} method="post">
                                <input type="hidden" id="clientDataJSON" name="clientDataJSON" />
                                <input type="hidden" id="authenticatorData" name="authenticatorData" />
                                <input type="hidden" id="signature" name="signature" />
                                <input type="hidden" id="credentialId" name="credentialId" />
                                <input type="hidden" id="userHandle" name="userHandle" />
                                <input type="hidden" id="error" name="error" />
                            </form>
                            {authenticators !== undefined && authenticators.authenticators.length !== 0 && (
                                <form id="authn_select" className={kcClsx("kcFormClass")}>
                                    {authenticators.authenticators.map((authenticator, i) => (
                                        <input
                                            key={i}
                                            type="hidden"
                                            name="authn_use_chk"
                                            readOnly
                                            value={authenticator.credentialId}
                                        />
                                    ))}
                                </form>
                            )}
                            <br />
                            <input
                                id={webAuthnButtonId}
                                type="button"
                                className={kcClsx(
                                    "kcButtonClass",
                                    "kcButtonDefaultClass",
                                    "kcButtonBlockClass",
                                    "kcButtonLargeClass"
                                )}
                                value={msgStr("passkey-doAuthenticate")}
                            />
                        </Fragment>
                    )}
                </div>
            </div>
        </Template>
    );
}
