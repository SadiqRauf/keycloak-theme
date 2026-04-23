import type { Meta, StoryObj } from "@storybook/react";
import type { KcContext } from "../../login/KcContext";
import KcPage from "../../login/KcPage";
import { getKcContextMock } from "../../login/KcPageStory";

const meta = {
    title: "Pages/Register",
    component: KcPage
} satisfies Meta<typeof KcPage>;

export default meta;

type Story = StoryObj<typeof meta>;

type RegisterKc = Extract<KcContext, { pageId: "register.ftl" }>;

/** Same attribute map as the mock, but insertion order matches typical Keycloak / staging payloads. */
const KEYCLOAK_LIKE_ATTRIBUTE_ORDER = [
    "username",
    "password",
    "password-confirm",
    "email",
    "firstName",
    "lastName"
] as const;

function registerContextWithAttributeKeyOrder(order: readonly string[]): RegisterKc {
    const base = getKcContextMock({ pageId: "register.ftl" }) as RegisterKc;
    const { attributesByName } = base.profile;
    const keys: string[] = [];
    for (const k of order) {
        if (k in attributesByName) {
            keys.push(k);
        }
    }
    for (const k of Object.keys(attributesByName)) {
        if (!keys.includes(k)) {
            keys.push(k);
        }
    }
    const next = Object.fromEntries(
        keys.map(name => [name, attributesByName[name as keyof typeof attributesByName]] as const)
    ) as typeof attributesByName;

    return {
        ...base,
        profile: {
            ...base.profile,
            attributesByName: next
        }
    };
}

/** Default Keycloakify mock order (often already close to RareOS in dev). */
export const Default: Story = {
    args: {
        kcContext: getKcContextMock({ pageId: "register.ftl" })
    }
};

/**
 * `RegisterPage` should still show first/last → username → passwords → email (email last)
 * even when `profile.attributesByName` key order matches typical Keycloak / staging payloads.
 */
export const RareOsOrderAfterKeycloakPayload: Story = {
    name: "RareOS order (Keycloak-style key order)",
    args: {
        kcContext: registerContextWithAttributeKeyOrder(KEYCLOAK_LIKE_ATTRIBUTE_ORDER)
    }
};
