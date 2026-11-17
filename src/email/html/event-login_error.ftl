<#-- Security alert. Same as Keycloak's base template, plus the brand's support email as the last message argument. -->
<#import "template.ftl" as layout>
<#import "/brand.ftl" as brandCfg>
<#assign brand = brandCfg.forEmail("", event)>
<@layout.emailLayout brand=brand>
${kcSanitize(msg("eventLoginErrorBodyHtml", event.date, event.ipAddress, brand.supportEmail))?no_esc}
</@layout.emailLayout>
