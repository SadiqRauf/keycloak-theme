import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { KcPage } from "./kc.gen";
import "./pages/login/rareos.css";

// Mock Keycloak context in dev so `yarn dev` shows a theme page (not "No Keycloak Context").
// Comment this out before release builds if you care about dev-only bundle size.
import { getKcContextMock } from "./login/KcPageStory";
import type { KcContext } from "./login/KcContext";
import { withRareosRegisterFieldOrder } from "./pages/register/registerFieldOrder";

if (import.meta.env.DEV) {
    // Keycloakify mocks use registrationUrl: "#" / loginUrl: "#", so Sign Up / Login do nothing.
    // Use ?page=register | ?page=login to switch mocks in the browser (full navigation).
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get("page");
    const pageIdByParam: Record<string, KcContext["pageId"]> = {
        register: "register.ftl",
        "forgot-password": "login-reset-password.ftl",
        "verify-email": "login-verify-email.ftl",
        info: "info.ftl",
        "update-password": "login-update-password.ftl",
        "page-expired": "login-page-expired.ftl",
        error: "error.ftl",
        terms: "terms.ftl"
    };
    const pageId = (pageParam && pageIdByParam[pageParam]) || "login.ftl";

    const path = window.location.pathname || "/";
    const registrationUrl = (() => {
        const p = new URLSearchParams(window.location.search);
        p.set("page", "register");
        const q = p.toString();
        return q ? `${path}?${q}` : `${path}?page=register`;
    })();
    const loginUrl = (() => {
        const p = new URLSearchParams(window.location.search);
        p.set("page", "login");
        const q = p.toString();
        return q ? `${path}?${q}` : `${path}?page=login`;
    })();
    const forgotPasswordUrl = (() => {
        const p = new URLSearchParams(window.location.search);
        p.set("page", "forgot-password");
        const q = p.toString();
        return q ? `${path}?${q}` : `${path}?page=forgot-password`;
    })();

    // pageId is chosen at runtime, so use a loose signature (overrides differ per page).
    const getMock = getKcContextMock as (params: {
        pageId: KcContext["pageId"];
        overrides?: Record<string, unknown>;
    }) => KcContext;

    let kcContext = getMock({
        pageId,
        overrides: {
            realm: {
                displayName: "RareOS",
                loginWithEmailAllowed: true,
                registrationEmailAsUsername: true,
                rememberMe: true,
                resetPasswordAllowed: true,
                registrationAllowed: true,
                password: true
            },
            url: {
                registrationUrl,
                loginUrl,
                loginResetCredentialsUrl: forgotPasswordUrl
            },
            // Dev mock forces gmail-only email pattern; remove it so normal emails validate.
            // Mimics the page Keycloak shows when an email verification link is opened.
            ...(pageId === "error.ftl"
                ? {
                      message: {
                          type: "error",
                          summary: "Cookie not found. Please make sure cookies are enabled in your browser."
                      },
                      client: { baseUrl: loginUrl }
                  }
                : {}),
            // ?page=info&variant=account-updated: the "Account updated" page that comes with no link from Keycloak.
            ...(pageId === "info.ftl" && params.get("variant") === "account-updated"
                ? {
                      messageHeader: "Account updated",
                      message: { type: "success", summary: "Your account has been updated." },
                      actionUri: undefined,
                      pageRedirectUri: undefined,
                      skipLink: true,
                      client: { baseUrl: undefined },
                      url: { loginUrl }
                  }
                : {}),
            ...(pageId === "info.ftl" && params.get("variant") !== "account-updated"
                ? {
                      messageHeader: "Email address validation",
                      message: { type: "info", summary: "Confirm validity of e-mail address john.doe@gmail.com." },
                      actionUri: "#",
                      skipLink: false
                  }
                : {}),
            ...(pageId === "login-verify-email.ftl" || pageId === "login-update-password.ftl"
                ? {
                      message: {
                          type: "warning",
                          summary:
                              pageId === "login-verify-email.ftl"
                                  ? "You need to verify your email address to activate your account."
                                  : "You need to change your password to activate your account."
                      }
                  }
                : {}),
            ...(pageId === "register.ftl"
                ? {
                      profile: {
                          attributesByName: {
                              email: {
                                  validators: {
                                      pattern: undefined
                                  }
                              }
                          }
                      }
                  }
                : {})
        }
    });

    // After merge, `attributesByName` key order can differ from Storybook’s fresh mock — align with RegisterPage.
    if (pageId === "register.ftl") {
        kcContext = withRareosRegisterFieldOrder(kcContext as Extract<KcContext, { pageId: "register.ftl" }>);
    }

    window.kcContext = kcContext;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        {!window.kcContext ? (
            <h1>No Keycloak Context</h1>
        ) : (
            <KcPage kcContext={window.kcContext} />
        )}
    </StrictMode>
);
