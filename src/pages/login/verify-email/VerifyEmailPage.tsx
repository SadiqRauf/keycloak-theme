import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../../login/KcContext";
import type { I18n } from "../../../login/i18n";
import "./verify-email.css";

type Props = PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>;

export default function VerifyEmailPage(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, user } = kcContext;
    const email = user?.email ?? "";

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayInfo={false}
            // Keycloak's "You need to verify your email address" warning repeats what this page says; still show errors/info.
            displayMessage={kcContext.message?.type !== "warning"}
            headerNode="Check your email"
        >
            <div className="verify-email-page">
                <div className="verify-email-page__icon" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <path d="m3 7 9 6 9-6" />
                    </svg>
                </div>

                <p className="verify-email-page__lead">
                    We sent a verification link to
                    {email ? (
                        <strong className="verify-email-page__email">{email}</strong>
                    ) : (
                        " your email address."
                    )}
                </p>
                <p className="verify-email-page__text">
                    Click the link in that email to activate your account.
                </p>

                <div className="verify-email-page__hint">
                    Didn't get the email? Check your spam or junk folder, or resend it below.
                </div>

                <div className="verify-email-page__actions">
                    <a href={url.loginAction} className="verify-email-page__btn verify-email-page__btn--primary">
                        Resend verification email
                    </a>
                    <a href={url.loginUrl} className="verify-email-page__btn verify-email-page__btn--secondary">
                        Back to Sign In
                    </a>
                </div>
            </div>
        </Template>
    );
}
