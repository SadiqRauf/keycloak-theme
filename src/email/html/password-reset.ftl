<#import "template.ftl" as layout>
<#import "/brand.ftl" as brandCfg>
<#assign brand = brandCfg.forLink(link)>
<#assign c = brandCfg.colors>
<@layout.emailLayout brand=brand>
<h1 style="margin:0 0 16px; font-size:22px; line-height:1.3; font-weight:700; color:${c.text};">Reset your password</h1>
<p style="margin:0 0 12px;">Hi${(user.firstName)?has_content?then(" " + user.firstName, "")},</p>
<p style="margin:0;">We received a request to reset the password for your ${brand.name} account. Click the button below to choose a new one.</p>
<@layout.button href=link label="Reset password" />
<p style="margin:0; font-size:13px; color:${c.muted}; text-align:center;">This link expires in ${linkExpirationFormatter(linkExpiration)}.</p>
<@layout.fallbackLink href=link />
<p style="margin:24px 0 0; padding-top:20px; border-top:1px solid ${c.border}; font-size:13px; line-height:1.5; color:${c.muted};">
    If you didn't ask to reset your password, you can safely ignore this email. Your password won't change.
</p>
</@layout.emailLayout>
