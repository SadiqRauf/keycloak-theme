import {
    useState,
    useLayoutEffect,
    Fragment,
    useCallback,
    useMemo,
    type FormEvent,
    type ReactNode
} from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { getUserProfileApi } from "keycloakify/login/lib/getUserProfileApi";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../../login/KcContext";
import type { I18n } from "../../login/i18n";
import { withRareosRegisterFieldOrder } from "./registerFieldOrder";
import "./register.css";

type Props = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => ReactNode>;
    doMakeUserConfirmPassword: boolean;
};

function markAllRegisterFieldsTouched(
    kcContext: Extract<KcContext, { pageId: "register.ftl" }>,
    doMakeUserConfirmPassword: boolean
) {
    const api = getUserProfileApi({ kcContext, doMakeUserConfirmPassword });
    const names = api
        .getFormState()
        .formFieldStates.filter(({ attribute }) => attribute.annotations?.inputType !== "hidden")
        .map(({ attribute }) => attribute.name);
    for (const name of names) {
        api.dispatchFormAction({
            action: "focus lost",
            name,
            fieldIndex: undefined
        });
    }
}

export default function RegisterPage(props: Props) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } =
        props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;
    const { msg, msgStr, advancedMsg } = i18n;
    const [isFormSubmittable, setIsFormSubmittable] = useState(false);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);

    /** Profile with RareOS field order; always applied when `attributesByName` is non-empty (avoids staging vs local key mismatches). */
    const registerFormKcContext = useMemo(() => withRareosRegisterFieldOrder(kcContext), [kcContext]);

    const handleFormSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            if (recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined) {
                return;
            }
            if (termsAcceptanceRequired && !areTermsAccepted) {
                e.preventDefault();
                return;
            }
            if (!isFormSubmittable) {
                e.preventDefault();
                markAllRegisterFieldsTouched(registerFormKcContext, doMakeUserConfirmPassword);
            }
        },
        [
            areTermsAccepted,
            doMakeUserConfirmPassword,
            isFormSubmittable,
            recaptchaAction,
            recaptchaRequired,
            recaptchaVisible,
            registerFormKcContext,
            termsAcceptanceRequired
        ]
    );

    useLayoutEffect(() => {
        const g = window as typeof window & { onSubmitRecaptcha?: () => void };
        g.onSubmitRecaptcha = () => {
            (document.getElementById("kc-register-form") as HTMLFormElement | null)?.requestSubmit();
        };
        return () => {
            delete g.onSubmitRecaptcha;
        };
    }, []);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={
                messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")
            }
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields={false}
        >
            <form
                id="kc-register-form"
                className={clsx(kcClsx("kcFormClass"), "register-rareos")}
                action={url.registrationAction}
                method="post"
                onSubmit={handleFormSubmit}
            >
                <UserProfileFormFields
                    kcContext={registerFormKcContext}
                    i18n={i18n}
                    kcClsx={kcClsx}
                    onIsFormSubmittableValueChange={setIsFormSubmittable}
                    doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                />
                {termsAcceptanceRequired && (
                    <TermsAcceptance
                        i18n={i18n}
                        kcClsx={kcClsx}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="form-group">
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <div
                                className="g-recaptcha"
                                data-size="compact"
                                data-sitekey={recaptchaSiteKey}
                                data-action={recaptchaAction}
                            />
                        </div>
                    </div>
                )}
                <div className={kcClsx("kcFormGroupClass")}>
                  
                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <button
                                type="submit"
                                className={clsx(
                                    kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                    "g-recaptcha"
                                )}
                                data-sitekey={recaptchaSiteKey}
                                data-callback="onSubmitRecaptcha"
                                data-action={recaptchaAction}
                            >
                                {msgStr("registerSubmit")}
                            </button>
                        </div>
                    ) : (
                        <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <input
                                disabled={termsAcceptanceRequired && !areTermsAccepted}
                                className={kcClsx(
                                    "kcButtonClass",
                                    "kcButtonPrimaryClass",
                                    "kcButtonBlockClass",
                                    "kcButtonLargeClass"
                                )}
                                type="submit"
                                value={msgStr("registerSubmit")}
                            />
                        </div>
                    )}
                      <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            <span className="register-rareos-account-hint">
                                {msg("alreadyHaveAccount")}{" "}
                                <a href={url.loginUrl} className="register-rareos-login-link">
                                    {msg("loginShort")}
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </form>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: ReturnType<typeof getKcClsx>["kcClsx"];
    messagesPerField: Extract<KcContext, { pageId: "register.ftl" }>["messagesPerField"];
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (v: boolean) => void;
}) {
    const { i18n, kcClsx, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;
    const { msg } = i18n;

    return (
        <Fragment>
            <div className="form-group">
                <div className={kcClsx("kcInputWrapperClass")}>
                    {msg("termsTitle")}
                    <div id="kc-registration-terms-text">{msg("termsText")}</div>
                </div>
            </div>
            <div className="form-group">
                <div className={kcClsx("kcLabelWrapperClass")}>
                    <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        className={kcClsx("kcCheckboxInputClass")}
                        checked={areTermsAccepted}
                        onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                    />
                    <label htmlFor="termsAccepted" className={kcClsx("kcLabelClass")}>
                        {msg("acceptTerms")}
                    </label>
                </div>
                {messagesPerField.existsError("termsAccepted") && (
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <span
                            id="input-error-terms-accepted"
                            className={kcClsx("kcInputErrorMessageClass")}
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("termsAccepted"))
                            }}
                        />
                    </div>
                )}
            </div>
        </Fragment>
    );
}
