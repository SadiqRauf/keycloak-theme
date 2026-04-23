import { useState, type FormEvent } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { emailRegexp } from "keycloakify/tools/emailRegExp";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../../login/KcContext";
import type { I18n } from "../../../login/i18n";
import "./forgot-password.css";

type Props = PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>;

export default function ForgotPasswordPage(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template: TemplateProp, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { url, auth, messagesPerField, realm } = kcContext;
    const { msg, msgStr } = i18n;
    const [clientUsernameError, setClientUsernameError] = useState<string | null>(null);

    const serverUsernameError = messagesPerField.existsError("username");
    const fieldAriaInvalid = serverUsernameError || !!clientUsernameError;

    const validateClient = (form: HTMLFormElement): boolean => {
        const username =
            (form.querySelector('[name="username"]') as HTMLInputElement | null)?.value?.trim() ?? "";

        let err: string | null = null;
        if (!username) {
            err =
                realm.loginWithEmailAllowed && realm.registrationEmailAsUsername
                    ? msgStr("missingEmailMessage")
                    : msgStr("missingUsernameMessage");
        } else if (
            realm.loginWithEmailAllowed &&
            realm.registrationEmailAsUsername &&
            !emailRegexp.test(username)
        ) {
            err = msgStr("invalidEmailMessage");
        }

        setClientUsernameError(err);
        return err === null;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        if (!validateClient(e.currentTarget)) {
            e.preventDefault();
            return;
        }
        setClientUsernameError(null);
    };

    const hideTemplateMessage = serverUsernameError || !!clientUsernameError;

    return (
        <TemplateProp
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={false}
            displayMessage={!hideTemplateMessage}
            headerNode={msg("emailForgotTitle")}
        >
            <form
                id="kc-reset-password-form"
                className={clsx(kcClsx("kcFormClass"), "forgot-password-page")}
                action={url.loginAction}
                method="post"
                onSubmit={handleSubmit}
            >
                <div className={kcClsx("kcFormGroupClass")}>
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <label htmlFor="username" className={kcClsx("kcLabelClass")}>
                            {msg("forgotPasswordEmailLabel")}
                        </label>
                    </div>
                    <div className={kcClsx("kcInputWrapperClass")}>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className={kcClsx("kcInputClass")}
                            autoFocus
                            defaultValue={auth?.attemptedUsername ?? ""}
                            autoComplete="username"
                            aria-invalid={fieldAriaInvalid}
                            onInput={() => clientUsernameError && setClientUsernameError(null)}
                        />
                        {serverUsernameError && (
                            <span
                                id="input-error-username"
                                className={kcClsx("kcInputErrorMessageClass")}
                                aria-live="polite"
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(messagesPerField.get("username"))
                                }}
                            />
                        )}
                        {!serverUsernameError && clientUsernameError && (
                            <span
                                id="input-error-username"
                                className={kcClsx("kcInputErrorMessageClass")}
                                aria-live="polite"
                            >
                                {clientUsernameError}
                            </span>
                        )}
                    </div>
                </div>
                <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                    <input
                        type="submit"
                        className={kcClsx(
                            "kcButtonClass",
                            "kcButtonPrimaryClass",
                            "kcButtonBlockClass",
                            "kcButtonLargeClass"
                        )}
                        value={msgStr("sendResetLink")}
                    />
                </div>
                <div className="forgot-password-page__secondary">
                    <a href={url.loginUrl}>{msg("backToLogin")}</a>
                </div>
            </form>
        </TemplateProp>
    );
}
