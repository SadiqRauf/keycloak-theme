<#ftl output_format="plainText">
<#import "/brand.ftl" as brandCfg>
<#assign brand = brandCfg.forLink(link)>
Verify your email

Hi${(user.firstName)?has_content?then(" " + user.firstName, "")},

Please confirm your email address to activate your account.

${link}

This link expires in ${linkExpirationFormatter(linkExpiration)}.

If you didn't create a ${brand.name} account, you can safely ignore this email.

${brand.signoff}
