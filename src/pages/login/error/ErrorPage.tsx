import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../../login/KcContext";
import type { I18n } from "../../../login/i18n";
import "../info/info.css";

type Props = PageProps<Extract<KcContext, { pageId: "error.ftl" }>, I18n>;

/** error.ftl: generic Keycloak error ("We are sorry...", e.g. "Cookie not found"). */
export default function ErrorPage(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { message, client, url } = kcContext;
    const { msg } = i18n;

    // The app's Home URL is the reliable way back in: the app sees no session and starts a fresh sign-in
    // (new cookies), which is what fixes errors like "Cookie not found". Fall back to the realm sign-in page.
    const signInHref = client?.baseUrl || url.loginUrl;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={msg("errorTitle")}
        >
            <div id="kc-error-message" className="info-page">
                <div className="info-page__icon info-page__icon--error" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v5M12 16h.01" />
                    </svg>
                </div>

                <p className="info-page__text" dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />

                {signInHref && (
                    <a id="backToApplication" href={signInHref} className="info-page__btn">
                        Sign In
                    </a>
                )}
            </div>
        </Template>
    );
}
