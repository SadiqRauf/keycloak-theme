<#import "template.ftl" as layout>
<@layout.emailLayout>
<h1 style="margin:0 0 16px; font-size:22px; line-height:1.3; font-weight:700; color:#111827;">Verify your email</h1>
<p style="margin:0 0 12px;">Hi${(user.firstName)?has_content?then(" " + user.firstName, "")},</p>
<p style="margin:0;">Thanks for signing up for rareDepot. Please confirm your email address to activate your account.</p>
<@layout.button href=link label="Verify email address" />
<p style="margin:0; font-size:13px; color:#6b7280; text-align:center;">This link expires in ${linkExpirationFormatter(linkExpiration)}.</p>
<@layout.fallbackLink href=link />
<p style="margin:24px 0 0; padding-top:20px; border-top:1px solid #e5e7eb; font-size:13px; line-height:1.5; color:#6b7280;">
    If you didn't create a rareDepot account, you can safely ignore this email.
</p>
</@layout.emailLayout>
