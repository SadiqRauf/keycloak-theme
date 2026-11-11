<#ftl output_format="plainText">
Reset your password

Hi${(user.firstName)?has_content?then(" " + user.firstName, "")},

We received a request to reset the password for your rareDepot account. Use this link to choose a new one:

${link}

This link expires in ${linkExpirationFormatter(linkExpiration)}.

If you didn't ask to reset your password, you can safely ignore this email. Your password won't change.

rareDepot by rareOS
