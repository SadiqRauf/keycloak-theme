import { useState, type FormEvent, type ReactNode } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import { useIsPasswordRevealed } from "keycloakify/tools/useIsPasswordRevealed";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../../login/KcContext";
import type { I18n } from "../../../login/i18n";
import { evaluatePassword, withRareosPasswordDefaults } from "../../shared/password/passwordRules";
import { PasswordChecklist } from "../../shared/password/PasswordChecklist";
import "./update-password.css";

type Props = PageProps<Extract<KcContext, { pageId: "login-update-password.ftl" }>, I18n>;

/** Keycloak doesn't pass the realm password policy to this page, so the RareOS baseline is used. */
const POLICIES = withRareosPasswordDefaults(undefined);

export default function UpdatePasswordPage(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { msg, msgStr } = i18n;
    const { url, messagesPerField, isAppInitiatedAction, auth } = kcContext;

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [triedSubmit, setTriedSubmit] = useState(false);

    const rules = evaluatePassword(password, POLICIES, { username: auth?.attemptedUsername });
    const isStrong = rules.every(r => r.ok);
    const matches = password === confirm;
    const showMismatch = confirm !== "" && !matches;
    const serverError = messagesPerField.existsError("password", "password-confirm");

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        // Let "Cancel" through without validation.
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        if (submitter?.name === "cancel-aia") return;
        if (!isStrong || !matches) {
            e.preventDefault();
            setTriedSubmit(true);
        }
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!serverError}
            headerNode={msg("updatePasswordTitle")}
        >
            <form
                id="kc-passwd-update-form"
                className={kcClsx("kcFormClass")}
                action={url.loginAction}
                method="post"
                onSubmit={handleSubmit}
                noValidate
            >
                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="password-new" className={kcClsx("kcLabelClass")}>
                            {msg("passwordNew")}
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-new">
                            <input
                                type="password"
                                id="password-new"
                                name="password-new"
                                className={kcClsx("kcInputClass")}
                                autoFocus
                                autoComplete="new-password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                aria-invalid={serverError || (triedSubmit && !isStrong)}
                                aria-describedby="password-requirements"
                            />
                        </PasswordWrapper>
                        {messagesPerField.existsError("password") && (
                            <span
                                id="input-error-password"
                                className={kcClsx("kcInputErrorMessageClass")}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password")) }}
                            />
                        )}
                        <PasswordChecklist rules={rules} id="password-requirements" />
                        {triedSubmit && !isStrong && (
                            <span className={kcClsx("kcInputErrorMessageClass")} aria-live="polite">
                                Please choose a password that meets all the requirements.
                            </span>
                        )}
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="password-confirm" className={kcClsx("kcLabelClass")}>
                            {msg("passwordConfirm")}
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password-confirm">
                            <input
                                type="password"
                                id="password-confirm"
                                name="password-confirm"
                                className={kcClsx("kcInputClass")}
                                autoComplete="new-password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                aria-invalid={serverError || showMismatch || (triedSubmit && !matches)}
                            />
                        </PasswordWrapper>
                        {messagesPerField.existsError("password-confirm") && (
                            <span
                                id="input-error-password-confirm"
                                className={kcClsx("kcInputErrorMessageClass")}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{ __html: kcSanitize(messagesPerField.get("password-confirm")) }}
                            />
                        )}
                        {(showMismatch || (triedSubmit && !matches)) && (
                            <span className={kcClsx("kcInputErrorMessageClass")} aria-live="polite">
                                Passwords don't match.
                            </span>
                        )}
                    </div>
                </div>

                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" id="logout-sessions" name="logout-sessions" value="on" defaultChecked />
                                    {msg("logoutOtherSessions")}
                                </label>
                            </div>
                        </div>
                    </div>
                    <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                        <input
                            className={kcClsx(
                                "kcButtonClass",
                                "kcButtonPrimaryClass",
                                !isAppInitiatedAction && "kcButtonBlockClass",
                                "kcButtonLargeClass"
                            )}
                            type="submit"
                            value={msgStr("doSubmit")}
                            disabled={!isStrong || !matches}
                        />
                        {isAppInitiatedAction && (
                            <button
                                className={kcClsx("kcButtonClass", "kcButtonDefaultClass", "kcButtonLargeClass")}
                                type="submit"
                                name="cancel-aia"
                                value="true"
                            >
                                {msg("doCancel")}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </Template>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: ReactNode }) {
    const { kcClsx, i18n, passwordInputId, children } = props;
    const { msgStr } = i18n;
    const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({ passwordInputId });

    return (
        <div className={kcClsx("kcInputGroup")}>
            {children}
            <button
                type="button"
                className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                <i
                    className={kcClsx(isPasswordRevealed ? "kcFormPasswordVisibilityIconHide" : "kcFormPasswordVisibilityIconShow")}
                    aria-hidden
                />
            </button>
        </div>
    );
}
