<#ftl output_format="plainText">
Verify your email

Hi${(user.firstName)?has_content?then(" " + user.firstName, "")},

Thanks for signing up for rareDepot. Please confirm your email address to activate your account:

${link}

This link expires in ${linkExpirationFormatter(linkExpiration)}.

If you didn't create a rareDepot account, you can safely ignore this email.

rareDepot by rareOS
