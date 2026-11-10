import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../../login/KcContext";
import type { I18n } from "../../../login/i18n";
import "../info/info.css";

type Props = PageProps<Extract<KcContext, { pageId: "login-page-expired.ftl" }>, I18n>;

/** login-page-expired.ftl: shown when a sign-in tab sat too long or the back button was used. */
export default function PageExpiredPage(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url } = kcContext;
    const { msg } = i18n;

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={msg("pageExpiredTitle")}
        >
            <div className="info-page">
                <div className="info-page__icon" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                    </svg>
                </div>

                <p className="info-page__text">This page was open for too long, so your session timed out.</p>
                <p className="info-page__subtext">Continue where you left off, or start the sign-in again.</p>

                <div className="info-page__actions">
                    <a id="loginContinueLink" href={url.loginAction} className="info-page__btn">
                        Continue
                    </a>
                    <a
                        id="loginRestartLink"
                        href={url.loginRestartFlowUrl}
                        className="info-page__btn info-page__btn--secondary"
                    >
                        Start over
                    </a>
                </div>
            </div>
        </Template>
    );
}
