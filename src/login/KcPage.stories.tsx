import type { Meta, StoryObj } from "@storybook/react";
import type { KcContext } from "./KcContext";
import KcPage from "./KcPage";
import { getKcContextMock } from "./KcPageStory";

/**
 * One story per Keycloak login theme page (same surface as `npx keycloakify add-story`).
 * Custom routes: login.ftl, register.ftl, login-reset-password.ftl; all others use DefaultPage.
 */
const meta = {
    title: "keycloakify/login",
    component: KcPage
} satisfies Meta<typeof KcPage>;

export default meta;

type Story = StoryObj<typeof meta>;

function pageStory(pageId: KcContext["pageId"]): Story {
    return {
        name: pageId,
        args: {
            kcContext: getKcContextMock({ pageId })
        }
    };
}

export const Code_ftl = pageStory("code.ftl");
export const DeleteAccountConfirm_ftl = pageStory("delete-account-confirm.ftl");
export const DeleteCredential_ftl = pageStory("delete-credential.ftl");
export const Error_ftl = pageStory("error.ftl");
export const FrontchannelLogout_ftl = pageStory("frontchannel-logout.ftl");
export const IdpReviewUserProfile_ftl = pageStory("idp-review-user-profile.ftl");
export const Info_ftl = pageStory("info.ftl");
export const LinkIdpAction_ftl = pageStory("link-idp-action.ftl");
export const Login_ftl = pageStory("login.ftl");
export const LoginConfigTotp_ftl = pageStory("login-config-totp.ftl");
export const LoginIdpLinkConfirm_ftl = pageStory("login-idp-link-confirm.ftl");
export const LoginIdpLinkConfirmOverride_ftl = pageStory("login-idp-link-confirm-override.ftl");
export const LoginIdpLinkEmail_ftl = pageStory("login-idp-link-email.ftl");
export const LoginOauth2DeviceVerifyUserCode_ftl = pageStory("login-oauth2-device-verify-user-code.ftl");
export const LoginOauthGrant_ftl = pageStory("login-oauth-grant.ftl");
export const LoginOtp_ftl = pageStory("login-otp.ftl");
export const LoginPageExpired_ftl = pageStory("login-page-expired.ftl");
export const LoginPasskeysConditionalAuthenticate_ftl = pageStory("login-passkeys-conditional-authenticate.ftl");
export const LoginPassword_ftl = pageStory("login-password.ftl");
export const LoginRecoveryAuthnCodeConfig_ftl = pageStory("login-recovery-authn-code-config.ftl");
export const LoginRecoveryAuthnCodeInput_ftl = pageStory("login-recovery-authn-code-input.ftl");
export const LoginResetOtp_ftl = pageStory("login-reset-otp.ftl");
export const LoginResetPassword_ftl = pageStory("login-reset-password.ftl");
export const LoginUpdatePassword_ftl = pageStory("login-update-password.ftl");
export const LoginUpdateProfile_ftl = pageStory("login-update-profile.ftl");
export const LoginUsername_ftl = pageStory("login-username.ftl");
export const LoginVerifyEmail_ftl = pageStory("login-verify-email.ftl");
export const LoginX509Info_ftl = pageStory("login-x509-info.ftl");
export const LogoutConfirm_ftl = pageStory("logout-confirm.ftl");
export const Register_ftl = pageStory("register.ftl");
export const SamlPostForm_ftl = pageStory("saml-post-form.ftl");
export const SelectAuthenticator_ftl = pageStory("select-authenticator.ftl");
export const SelectOrganization_ftl = pageStory("select-organization.ftl");
export const Terms_ftl = pageStory("terms.ftl");
export const UpdateEmail_ftl = pageStory("update-email.ftl");
export const WebauthnAuthenticate_ftl = pageStory("webauthn-authenticate.ftl");
export const WebauthnError_ftl = pageStory("webauthn-error.ftl");
export const WebauthnRegister_ftl = pageStory("webauthn-register.ftl");
