import type { KcContext } from "../../login/KcContext";

type RegisterKc = Extract<KcContext, { pageId: "register.ftl" }>;

/** RareOS layout: names → username → passwords → email; extra Keycloak attributes last. */
export const RAREOS_REGISTER_ATTRIBUTE_ORDER = [
    "firstName",
    "lastName",
    "username",
    "password",
    "password-confirm",
    "email"
] as const;

function normalizeAttributeKeyForMatch(key: string): string {
    return key.toLowerCase().replace(/-/g, "");
}

/**
 * Map logical Keycloak attribute names to the actual keys present in `attributesByName`
 * (staging can differ from dev in letter case or hyphenation).
 */
function resolveProfileAttributeKey(actualKeys: readonly string[], logicalName: string): string | undefined {
    const wantLower = logicalName.toLowerCase();
    const wantNorm = normalizeAttributeKeyForMatch(logicalName);
    for (const k of actualKeys) {
        if (k.toLowerCase() === wantLower) {
            return k;
        }
    }
    for (const k of actualKeys) {
        if (normalizeAttributeKeyForMatch(k) === wantNorm) {
            return k;
        }
    }
    return undefined;
}

function orderedRegisterAttributeKeys(attributesByName: Record<string, unknown>): string[] {
    const keys = Object.keys(attributesByName);
    if (keys.length === 0) {
        return keys;
    }
    const placed = new Set<string>();
    const ordered: string[] = [];
    for (const logical of RAREOS_REGISTER_ATTRIBUTE_ORDER) {
        const k = resolveProfileAttributeKey(keys, logical);
        if (k !== undefined && !placed.has(k)) {
            ordered.push(k);
            placed.add(k);
        }
    }
    for (const k of keys) {
        if (!placed.has(k)) {
            ordered.push(k);
        }
    }
    return ordered;
}

/**
 * Keycloakify uses `Object.values(profile.attributesByName)` (insertion order).
 * Apply the same ordering for dev mock (`main.tsx`) and in `RegisterPage` (Keycloak / Storybook).
 */
export function withRareosRegisterFieldOrder(kcContext: RegisterKc): RegisterKc {
    const { attributesByName } = kcContext.profile;
    const orderedKeys = orderedRegisterAttributeKeys(attributesByName as Record<string, unknown>);
    if (orderedKeys.length === 0) {
        return kcContext;
    }
    const reordered = Object.fromEntries(
        orderedKeys.map(name => [name, attributesByName[name as keyof typeof attributesByName]] as const)
    ) as typeof attributesByName;

    return {
        ...kcContext,
        profile: {
            ...kcContext.profile,
            attributesByName: reordered
        }
    };
}
