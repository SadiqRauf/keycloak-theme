import { useEffect } from "react";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import KeycloakifyTemplate from "keycloakify/login/Template";
import type { KcContext } from "../../login/KcContext";
import type { I18n } from "../../login/i18n";

const RAREOS_FAVICON_LINK_ID = "rareos-theme-favicon";
const RAREOS_FAVICON_SHORTCUT_ID = `${RAREOS_FAVICON_LINK_ID}-shortcut`;

/**
 * Keycloakify outputs `public/favicon-32x32.png` as `login/resources/dist/favicon-32x32.png` in the theme JAR.
 * `url.resourcesPath` is the `…/resources/` base URL, so the tab icon must include the `dist/` segment.
 *
 * **If the icon is still wrong in production:** open `{resourcesPath}/dist/favicon-32x32.png` in the browser —
 * 404 ⇒ JAR not deployed / wrong path; image loads ⇒ caching or `<head>` not updated. Then verify Realm →
 * Themes → Login uses this theme, run `kc.sh build` + restart (Docker: new JAR under `providers/` + rebuild),
 * and try disabling theme cache once (`--spi-theme-cache-themes=false`, `--spi-theme-cache-templates=false`).
 */
function faviconHrefForKcContext(kcContext: KcContext): string {
    const resourcesPath =
        "url" in kcContext &&
        kcContext.url &&
        typeof (kcContext.url as { resourcesPath?: string }).resourcesPath === "string"
            ? (kcContext.url as { resourcesPath: string }).resourcesPath.trim()
            : "";
    const base = resourcesPath.replace(/\/$/, "");
    const path = base ? `${base}/dist/favicon-32x32.png` : "/favicon-32x32.png";
    const themeV = "themeVersion" in kcContext ? kcContext.themeVersion : "";
    const kcifyV = "keycloakifyVersion" in kcContext ? kcContext.keycloakifyVersion : "";
    const v = [themeV, kcifyV].filter(Boolean).join("-");
    return v ? `${path}?v=${encodeURIComponent(v)}` : path;
}

/**
 * Wraps the stock Keycloakify template with RareOS shell (logo + footer)
 * and relies on rareos.css for layout and visuals.
 */
export default function Template(props: TemplateProps<KcContext, I18n>) {
    const { kcContext } = props;

    useEffect(() => {
        const href = faviconHrefForKcContext(kcContext);

        const upsertLink = (id: string, rel: "icon" | "shortcut icon") => {
            let el = document.getElementById(id) as HTMLLinkElement | null;
            if (!el) {
                el = document.createElement("link");
                el.id = id;
                el.rel = rel;
                el.type = "image/png";
                if (rel === "icon") {
                    el.setAttribute("sizes", "32x32");
                }
            }
            el.href = href;
            document.head.prepend(el);
        };

        upsertLink(RAREOS_FAVICON_SHORTCUT_ID, "shortcut icon");
        upsertLink(RAREOS_FAVICON_LINK_ID, "icon");
    }, [kcContext]);

    return (
        <div className="rareos-app">
            <div>
                <p>Your Comprehensive Guide To Legislative Success</p>
                <p>People who have committed to a service/advocacy role will tell you that some of the sublimest pleasure they have ever experienced comes in the context of that work. You get way more than you give. - Charles Garfield</p>
            </div>

            <div>
            <img 
                className="rareos-brand" 
                src="https://app.govbuddy.com/static/img/logo-govbuddy-black.svg" 
                alt="GovBuddy"
            />
            <KeycloakifyTemplate {...props} />
            <footer className="rareos-footer">
            <p className="rareos-copyright">Copyright © 2026 Capitol Enquiry</p>
            <div className="rareos-footer-links">

                <a
                    href="https://app.govbuddy.com/about/tos/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Terms of Service
                </a>
                <span className="rareos-footer-sep" aria-hidden="true">
                    •
                </span>
                <a
                    href="https://app.govbuddy.com/about/privacy/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                   Privacy Policy
                </a>
                <span className="rareos-footer-sep" aria-hidden="true">
                    •
                </span>
                <a
                    href="https://app.govbuddy.com/contact/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Contact
                </a>
                </div>
            </footer>
            </div>
        </div>
    );
}
