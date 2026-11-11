import type { PasswordPolicies } from "keycloakify/login/KcContext";

/**
 * RareOS baseline for a strong password. The realm's own Password Policy (Authentication → Policies)
 * is merged on top: whichever is stricter wins. Keycloak itself only enforces its realm policy,
 * so keep the realm policy at least this strict.
 */
export const RAREOS_PASSWORD_POLICY_DEFAULTS = {
    length: 8,
    upperCase: 1,
    lowerCase: 1,
    digits: 1,
    specialChars: 1,
    notUsername: true,
    notEmail: true
} as const satisfies PasswordPolicies;

export function withRareosPasswordDefaults(realm: PasswordPolicies | undefined): PasswordPolicies {
    const d = RAREOS_PASSWORD_POLICY_DEFAULTS;
    const max = (a: number | undefined, b: number) => Math.max(a ?? 0, b);
    return {
        ...realm,
        length: max(realm?.length, d.length),
        upperCase: max(realm?.upperCase, d.upperCase),
        lowerCase: max(realm?.lowerCase, d.lowerCase),
        digits: max(realm?.digits, d.digits),
        specialChars: max(realm?.specialChars, d.specialChars),
        notUsername: realm?.notUsername ?? d.notUsername,
        notEmail: realm?.notEmail ?? d.notEmail
    };
}

export type PasswordRuleResult = { id: string; label: string; ok: boolean };

const count = (s: string, re: RegExp) => s.split("").filter(c => re.test(c)).length;
const plural = (n: number, one: string, many: string) => (n === 1 ? one : `${n} ${many}`);

export function evaluatePassword(
    password: string,
    policies: PasswordPolicies,
    identity: { username?: string; email?: string } = {}
): PasswordRuleResult[] {
    const rules: PasswordRuleResult[] = [];
    const { length, maxLength, upperCase, lowerCase, digits, specialChars, notUsername, notEmail } = policies;

    if (length) rules.push({ id: "length", label: `At least ${length} characters`, ok: password.length >= length });
    if (maxLength) rules.push({ id: "maxLength", label: `No more than ${maxLength} characters`, ok: password.length <= maxLength });
    if (digits) rules.push({ id: "digits", label: plural(digits, "A number", "numbers"), ok: count(password, /[0-9]/) >= digits });
    if (upperCase)
        rules.push({ id: "upperCase", label: plural(upperCase, "An uppercase letter", "uppercase letters"), ok: count(password, /[A-Z]/) >= upperCase });
    if (lowerCase)
        rules.push({ id: "lowerCase", label: plural(lowerCase, "A lowercase letter", "lowercase letters"), ok: count(password, /[a-z]/) >= lowerCase });
    if (specialChars)
        rules.push({
            id: "specialChars",
            label: plural(specialChars, "A special character (!@#$)", "special characters (!@#$)"),
            ok: count(password, /[^a-zA-Z0-9]/) >= specialChars
        });

    const same = (a: string, b: string | undefined) => !!b && a.toLowerCase() === b.trim().toLowerCase();
    if (notUsername && identity.username)
        rules.push({ id: "notUsername", label: "Not your username", ok: password !== "" && !same(password, identity.username) });
    if (notEmail && identity.email)
        rules.push({ id: "notEmail", label: "Not your email", ok: password !== "" && !same(password, identity.email) });

    return rules;
}
