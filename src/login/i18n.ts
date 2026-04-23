/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            loginAccountTitle: "Sign In to your account",
            rememberMe: "Stay Signed In",
            doForgotPassword: "Forgot password?",
            noAccount: "Don't have an account?",
            doRegister: "Sign Up",
            registerTitle: "Create an account",
            registerSubmit: "Create Account",
            alreadyHaveAccount: "Already have an account?",
            loginShort: "Login",
            invalidPasswordConfirmMessage: "Passwords do not match.",
            invalidEmailMessage: "Enter a valid email address.",
            emailForgotTitle: "Reset Your Password",
            forgotPasswordEmailLabel: "Enter your email",
            sendResetLink: "Send Reset Link",
            backToLogin: "Back to Login"
        }
    })
    .build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
