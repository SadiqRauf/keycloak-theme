<#--
  Shared layout used by every HTML email (Keycloak's own emails import "template.ftl" too).
  Branding (wordmark, legal links) is picked per client in ../brand.ftl.
  Table-based with inline styles so it renders in Gmail, Outlook and Apple Mail.
-->
<#import "/brand.ftl" as brandCfg>
<#assign c = brandCfg.colors>

<#-- `brand` defaults to the brand of the client in `link`, so callers can omit it. -->
<#macro emailLayout brand=brandCfg.forLink(link!"")>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${brand.name}</title>
</head>
<body style="margin:0; padding:0; background-color:${c.background}; -webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${c.background};">
    <tr>
        <td align="center" style="padding:40px 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
                <tr>
                    <td align="center" style="padding:0 0 24px; font-family:Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:30px; font-weight:700; letter-spacing:-0.5px; line-height:1;">
                        <span style="color:${c.accent};">${brand.wordmarkPrimary}</span><#if brand.wordmarkSecondary?has_content><span style="color:${c.text};">${brand.wordmarkSecondary}</span></#if>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:${c.card}; border:1px solid ${c.border}; border-radius:12px; padding:36px 32px; font-family:Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:1.6; color:${c.text};">
                        <#nested>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:24px 16px 0; font-family:Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; line-height:1.6; color:${c.muted};">
                        &copy; rareOS
                        &nbsp;&bull;&nbsp;
                        <a href="${brand.termsUrl}" style="color:${c.muted}; text-decoration:underline;">Terms of Service</a>
                        &nbsp;&bull;&nbsp;
                        <a href="${brand.privacyUrl}" style="color:${c.muted}; text-decoration:underline;">Privacy Policy</a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
</#macro>

<#-- Blue call-to-action button (bulletproof table version for email clients). -->
<#macro button href label>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:28px 0 8px;">
    <tr>
        <td align="center" style="border-radius:6px; background-color:${c.accent};">
            <a href="${href}" target="_blank" style="display:block; padding:13px 24px; font-family:Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:16px; font-weight:600; color:${c.card}; text-decoration:none; border-radius:6px;">${label}</a>
        </td>
    </tr>
</table>
</#macro>

<#-- "Button not working?" fallback link shown under the button. -->
<#macro fallbackLink href>
<p style="margin:20px 0 0; font-size:13px; line-height:1.5; color:${c.muted};">
    Button not working? Copy and paste this link into your browser:<br>
    <a href="${href}" target="_blank" style="color:${c.accent}; word-break:break-all;">${href}</a>
</p>
</#macro>
