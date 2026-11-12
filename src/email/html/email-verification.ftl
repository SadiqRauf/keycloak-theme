<#import "template.ftl" as layout>
<#import "/brand.ftl" as brandCfg>
<#assign brand = brandCfg.forLink(link)>
<#assign c = brandCfg.colors>
<@layout.emailLayout brand=brand>
<h1 style="margin:0 0 16px; font-size:22px; line-height:1.3; font-weight:700; color:${c.text};">Verify your email</h1>
<p style="margin:0 0 12px;">Hi${(user.firstName)?has_content?then(" " + user.firstName, "")},</p>
<p style="margin:0;">Please confirm your email address to activate your account.</p>
<@layout.button href=link label="Verify email address" />
<p style="margin:0; font-size:13px; color:${c.muted}; text-align:center;">This link expires in ${linkExpirationFormatter(linkExpiration)}.</p>
<@layout.fallbackLink href=link />
<p style="margin:24px 0 0; padding-top:20px; border-top:1px solid ${c.border}; font-size:13px; line-height:1.5; color:${c.muted};">
    If you didn't create a ${brand.name} account, you can safely ignore this email.
</p>
</@layout.emailLayout>
