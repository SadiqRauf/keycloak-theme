import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../../login/KcContext";
import type { I18n } from "../../../login/i18n";
import "./info.css";

type Props = PageProps<Extract<KcContext, { pageId: "info.ftl" }>, I18n>;

/**
 * Generic Keycloak info page (info.ftl). Shown e.g. when an email verification link is opened
 * ("Email address validation"), after verifying, or after other one-off actions.
 */
export default function InfoPage(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { advancedMsgStr } = i18n;
    const { messageHeader, message, requiredActions, skipLink, pageRedirectUri, actionUri, client, url } = kcContext;

    const summaryHtml = (() => {
        let html = message.summary?.trim() ?? "";
        if (requiredActions) {
            html += " <b>";
            html += requiredActions.map(a => advancedMsgStr(`requiredAction.${a}`)).join(", ");
            html += "</b>";
        }
        return html;
    })();

    const action: { href: string; label: string } | undefined = (() => {
        if (!skipLink) {
            if (pageRedirectUri) return { href: pageRedirectUri, label: "Back to application" };
            if (actionUri) return { href: actionUri, label: "Continue" };
        }
        // Keycloak shows no link here (e.g. "Account updated" after a reset link opened in a new browser,
        // or the client has no Home URL), which leaves the user stuck. Always offer a way back to sign in:
        // the app's Home URL if set (the app then starts sign-in), otherwise the realm's sign-in page.
        if (client.baseUrl) return { href: client.baseUrl, label: "Sign In" };
        if (url.loginUrl) return { href: url.loginUrl, label: "Sign In" };
        return undefined;
    })();

    const isError = message.type === "error";

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={false}
            headerNode={
                <span
                    dangerouslySetInnerHTML={{
                        __html: kcSanitize(messageHeader ? advancedMsgStr(messageHeader) : message.summary)
                    }}
                />
            }
        >
            <div id="kc-info-message" className="info-page">
                <div className={`info-page__icon${isError ? " info-page__icon--error" : ""}`} aria-hidden="true">
                    {isError ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8v5M12 16h.01" />
                        </svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="m8 12 3 3 5-6" />
                        </svg>
                    )}
                </div>

                <p className="info-page__text" dangerouslySetInnerHTML={{ __html: kcSanitize(summaryHtml) }} />

                {action && (
                    <a href={action.href} className="info-page__btn">
                        {action.label}
                    </a>
                )}
            </div>
        </Template>
    );
}
