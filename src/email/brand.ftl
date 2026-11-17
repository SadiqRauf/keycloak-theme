<#--
  Per-client email branding.

  Keycloak only lets you pick ONE email theme per realm (there is no per-client email theme
  setting), so this theme picks the branding at render time instead. Verify-email and
  reset-password links that Keycloak generates carry a `client_id=` query parameter, which is
  what we read here. Security-alert emails (password changed, failed login, lockout...) have no
  link, so for those we use the client ID Keycloak puts on the event (`event.client`).

  To add or change a client: edit `clientBrands` below. Unknown or missing client -> defaultBrand.
-->

<#-- Keycloak client ID -> brand key. Same client IDs in the rare, rare-stage and rare-dev realms. -->
<#assign clientBrands = {
    "raredepot-frontend": "raredepot",
    "rareos-frontend": "rareos"
}>

<#-- Used when there is no client ID or it isn't listed above (e.g. admin-triggered emails, account console). -->
<#assign defaultBrand = "rareos">

<#assign brands = {
    "raredepot": {
        "name": "rareDepot",
        "wordmarkPrimary": "rare",
        "wordmarkSecondary": "Depot",
        "signoff": "rareDepot by rareOS",
        "supportEmail": "support@raredepot.com",
        "termsUrl": "https://raredepot.com/legal/terms",
        "privacyUrl": "https://raredepot.com/legal/privacy"
    },
    "rareos": {
        "name": "rareOS",
        "wordmarkPrimary": "rareOS",
        "wordmarkSecondary": "",
        "signoff": "rareOS",
        "supportEmail": "support@rareos.com",
        "termsUrl": "https://app.rareos.com/terms",
        "privacyUrl": "https://app.rareos.com/privacy"
    }
}>

<#-- Shared palette (both brands currently use the same colors). -->
<#assign colors = {
    "accent": "#2563eb",
    "text": "#111827",
    "muted": "#6b7280",
    "border": "#e5e7eb",
    "background": "#f9fafb",
    "card": "#ffffff"
}>

<#-- Returns the client ID embedded in a Keycloak action link, or "" if there is none. -->
<#function clientIdFromLink link>
    <#if !link?has_content || !link?matches(r".*[?&]client_id=.*", "s")>
        <#return "">
    </#if>
    <#return link?keep_after(r"[?&]client_id=", "r")?keep_before("&")?keep_before("#")>
</#function>

<#-- Returns the brand hash for a Keycloak client ID. -->
<#function forClient clientId>
    <#local key = clientBrands[clientId!""]!defaultBrand>
    <#return brands[key]!brands[defaultBrand]>
</#function>

<#-- Returns the brand hash for a Keycloak action link. -->
<#function forLink link>
    <#return forClient(clientIdFromLink(link))>
</#function>

<#-- Brand for any email: the action link's client if there is a link, else the event's client. -->
<#function forEmail link event>
    <#local clientId = clientIdFromLink(link)>
    <#if !clientId?has_content>
        <#local clientId = (event.client)!"">
    </#if>
    <#return forClient(clientId)>
</#function>
