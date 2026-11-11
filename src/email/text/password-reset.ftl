<#ftl output_format="plainText">
<#import "/brand.ftl" as brandCfg>
<#assign brand = brandCfg.forLink(link)>
Reset your password

Hi${(user.firstName)?has_content?then(" " + user.firstName, "")},

We received a request to reset the password for your ${brand.name} account. Use this link to choose a new one:

${link}

This link expires in ${linkExpirationFormatter(linkExpiration)}.

If you didn't ask to reset your password, you can safely ignore this email. Your password won't change.

${brand.signoff}
