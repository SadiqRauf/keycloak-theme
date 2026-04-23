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
    const pageId =
        pageParam === "register"
            ? "register.ftl"
            : pageParam === "forgot-password"
              ? "login-reset-password.ftl"
              : "login.ftl";

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

    let kcContext = getKcContextMock({
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
