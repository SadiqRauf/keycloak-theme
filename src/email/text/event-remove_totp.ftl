<#ftl output_format="plainText">
<#-- Security alert. Same as Keycloak's base template, plus the brand's support email as the last message argument. -->
<#import "/brand.ftl" as brandCfg>
<#assign brand = brandCfg.forEmail("", event)>
${msg("eventRemoveTotpBody", event.date, event.ipAddress, brand.supportEmail)}

${brand.signoff}
