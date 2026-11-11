<#import "template.ftl" as layout>
<@layout.emailLayout>
<h1 style="margin:0 0 16px; font-size:22px; line-height:1.3; font-weight:700; color:#111827;">Reset your password</h1>
<p style="margin:0 0 12px;">Hi${(user.firstName)?has_content?then(" " + user.firstName, "")},</p>
<p style="margin:0;">We received a request to reset the password for your rareDepot account. Click the button below to choose a new one.</p>
<@layout.button href=link label="Reset password" />
<p style="margin:0; font-size:13px; color:#6b7280; text-align:center;">This link expires in ${linkExpirationFormatter(linkExpiration)}.</p>
<@layout.fallbackLink href=link />
<p style="margin:24px 0 0; padding-top:20px; border-top:1px solid #e5e7eb; font-size:13px; line-height:1.5; color:#6b7280;">
    If you didn't ask to reset your password, you can safely ignore this email. Your password won't change.
</p>
</@layout.emailLayout>
