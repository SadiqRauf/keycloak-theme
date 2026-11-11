import type { PasswordRuleResult } from "./passwordRules";
import "./password-checklist.css";

/** Live list of password requirements; each turns green as it is met. */
export function PasswordChecklist(props: { rules: PasswordRuleResult[]; id?: string }) {
    const { rules, id } = props;
    if (rules.length === 0) return null;

    return (
        <ul className="rareos-pw-checklist" id={id} aria-label="Password requirements">
            {rules.map(r => (
                <li key={r.id} className={r.ok ? "is-met" : undefined}>
                    <span className="rareos-pw-checklist__icon" aria-hidden="true">
                        {r.ok ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m5 12 5 5 9-10" />
                            </svg>
                        ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="4" />
                            </svg>
                        )}
                    </span>
                    <span>
                        {r.label}
                        <span className="rareos-sr-only">{r.ok ? " (met)" : " (not met)"}</span>
                    </span>
                </li>
            ))}
        </ul>
    );
}
