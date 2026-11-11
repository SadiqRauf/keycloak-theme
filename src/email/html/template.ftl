<#--
  rareDepot layout used by every HTML email (Keycloak's own emails import "template.ftl" too).
  Table-based with inline styles so it renders in Gmail, Outlook and Apple Mail.
-->
<#macro emailLayout>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>rareDepot</title>
</head>
<body style="margin:0; padding:0; background-color:#f9fafb; -webkit-text-size-adjust:100%;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f9fafb;">
    <tr>
        <td align="center" style="padding:40px 16px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
                <tr>
                    <td align="center" style="padding:0 0 24px; font-family:Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:30px; font-weight:700; letter-spacing:-0.5px; line-height:1;">
                        <span style="color:#2563eb;">rare</span><span style="color:#111827;">Depot</span>
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#ffffff; border:1px solid #e5e7eb; border-radius:12px; padding:36px 32px; font-family:Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:1.6; color:#111827;">
                        <#nested>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="padding:24px 16px 0; font-family:Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; line-height:1.6; color:#6b7280;">
                        &copy; rareOS
                        &nbsp;&bull;&nbsp;
                        <a href="https://raredepot.com/legal/terms" style="color:#6b7280; text-decoration:underline;">Terms of Service</a>
                        &nbsp;&bull;&nbsp;
                        <a href="https://raredepot.com/legal/privacy" style="color:#6b7280; text-decoration:underline;">Privacy Policy</a>
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
        <td align="center" style="border-radius:6px; background-color:#2563eb;">
            <a href="${href}" target="_blank" style="display:block; padding:13px 24px; font-family:Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:16px; font-weight:600; color:#ffffff; text-decoration:none; border-radius:6px;">${label}</a>
        </td>
    </tr>
</table>
</#macro>

<#-- "Button not working?" fallback link shown under the button. -->
<#macro fallbackLink href>
<p style="margin:20px 0 0; font-size:13px; line-height:1.5; color:#6b7280;">
    Button not working? Copy and paste this link into your browser:<br>
    <a href="${href}" target="_blank" style="color:#2563eb; word-break:break-all;">${href}</a>
</p>
</#macro>
