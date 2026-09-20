# SOFTWARE link audit

**Live:** https://software.unitedmobilerv.com/
**Repo:** https://github.com/crashdummy88/umrt-software
**Audited:** 2026-09-20
**Scope:** Hub + every brand page + catalog `index.json` outbound http(s) links (download / manufacturer / app-store / support). Internal `/` paths, `tel:`, and `sms:` excluded from the outbound table.

## Verdict

Manufacturer / app-store / firmware links are **mostly good**. No dead official Victron, Peplink, weBoost, Starlink, Winegard, SureCall, Cel-Fi/Nextivity, GL.iNet, Teltonika, Dometic, OpenWrt, Cradlepoint, Sierra/Semtech, Node-RED, or FOSS download destinations were found.

**Broken outbound manufacturer 404s to replace:** none.

This PR still applies two wire-only fixes found while crawling:

1. **Book chrome** (platform bar + footer mesh + `/go/book`) now prefers `https://book.unitedmobilerv.com/`. Live mesh Book previously pointed only at Square (`united-mobile-rv-llc.square.site`). `book.unitedmobilerv.com` is a live UMRT booking landing page (not a silent Square hop). Convert **Book** buttons that are not chrome still point at Square — noted below, not redesigned.
2. **`/sierra/` catalog was empty.** Page filter was `data-brand="Sierra"` but catalog brand is `Sierra Wireless`, so the AirLink cards never rendered. Filter aligned. Hardcoded Source / Support / ALMS links were already correct.
3. **`/gl-inet/` 404.** Brands card already uses `/glinet/`. Added a 302 hyphen alias so the typed slug works.

## Method

- Extracted **803** outbound occurrences / **213** unique URLs from hub HTML, brand HTML, troubleshoot HTML, and `catalog/index.json`.
- Probed each unique URL with GET + redirect follow (browser UA).
- Re-checked Cloudflare/bot-walled and TLS-quirk hosts in a real browser and/or WebFetch.
- Clicked primary manufacturer/download/app-store links on hub + brand pages (Victron, Peplink, weBoost, Starlink, Winegard, GL.iNet, KING, SureCall, Cel-Fi; remaining brand start-here URLs via WebFetch).
- UMRT mesh (`unitedmobilerv.com`, Shop, Book, Forum, Docs) verified in browser.

Datacenter curl often sees `403 cf-mitigated: challenge` on UMRT, Nextivity, npm, Taoglas, Airgain, Poynting. Those are **not** user-facing 404s.

## Book chrome

| Location | Before | After / live |
|---|---|---|
| Platform bar Book | `https://united-mobile-rv-llc.square.site/` | `https://book.unitedmobilerv.com/` |
| Footer mesh Book | same Square URL | `https://book.unitedmobilerv.com/` |
| `/go/book` | Square 302 | `https://book.unitedmobilerv.com/` 302 |
| Convert Book buttons (hero / deepen hubs) | Square | **unchanged** (not chrome) |
| `book.unitedmobilerv.com` | — | 200, UMRT “Book a Mobile RV Repair Visit” landing with BOOK ON SQUARE |

## Findings that are not link replacements

| Item | Status | Notes |
|---|---|---|
| KING `kingconnect.com` | 200 · liquidation | Live storefront is FINAL LIQUIDATION. Hub copy already says do not sell new / placeholder / migrate weBoost RV. Left as official brand URL. |
| Laird `lairdconnect.com` → `ezurio.com` | 200 rebrand | `/rf-antennas` now lands on Ezurio **internal** antennas. Wrong *category*, not a 404. Left (broken-link-only rule). |
| Cradlepoint → `cradlepoint.ericsson.com` | 200 official hop | Ericsson rebrand. Old URLs still work. |
| SureCall `/rv-boosters/fusion2go-rv/` | 200 legacy slug | Renders Fusion2Go **3.0** RV product. |
| Parsec `/support/` | 200 soft | Marketing homepage content on the support path. |
| weBoost `/collections/antennas` | 200 | Accessories / parts shelf, not a dedicated antenna PLP. |
| weBoost Drive Reach RV-2 / RV35 / RV50 | 200 correct SKUs | RV-2 page now brands as RV20 (formerly RV II). |
| Wilson install PDF | 200 CDN hop | `assets.wilsonelectronics.com` → `cdn.amplifi.pattern.com`. |
| Starlink `www` → apex | 200 | Canonical `starlink.com`. Specs URL ends at `/specifications/4`. |
| Peplink firmware on Starlink catalog card | 200 | Intentional bypass-mode pairing, not a wrong-brand product. |
| `/gl-inet/` | was 404 | Hyphen alias added. |
| Convert Book still Square | rough edge | Chrome/mesh now book.*; gold/ghost Book CTAs still Square. |
| OpenWrt catalog brands | rough edge | `/openwrt/` filters `OpenWrt`; the older `openwrt` catalog row is brand `FOSS`, so it only shows on FOSS/hub. |
| Dometic apps | honesty | Store search only — no guessed App Store IDs (correct). |
| Professional Victron firmware | 200 | Login/Dropbox gate for some files — official portal, not a dead link. |
| InControl `incontrol.peplink.com` | 200 | Hops to `incontrol2.peplink.com`. |
| `support.weboost.com` | 200 | Hops to `weboost.com/support`. |

## Brand pages crawled

| Page | Primary OEM start-here | Click / fetch result |
|---|---|---|
| `/` hub | catalog + brand cards | Catalog cards load official Victron/Peplink/weBoost/Starlink rows. Book chrome was Square. |
| `/victron/` | victronenergy.com software hub | Official downloads. VictronConnect / VRM / Toolkit store IDs match. |
| `/peplink/` | peplink.com firmware | Official Firmware Downloads. InControl2 live. |
| `/weboost/` | weboost.com/support | Official support. App + RV SKUs live. |
| `/starlink/` | starlink.com/support | Official Help Center. Spec PDFs live. |
| `/winegard/` | winegard.com/support | Official support. ConnecT 2.0 4G + RV Halo live. |
| `/king/` | kingconnect.com | Liquidation storefront. Honesty copy already correct. |
| `/surecall/` | surecall.com/support | Official support + manuals. |
| `/celfi/` | nextivityinc.com/support | Official Nextivity support. cel-fi.com is Nextivity corporate. |
| `/glinet/` | dl.gl-inet.com | Official firmware CDN. `/gl-inet/` was 404. |
| `/teltonika/` | wiki.teltonika-networks.com | Official wiki + Downloads page. |
| `/dometic/` | dometic.com + en-us/support | Official support. Play search only. |
| `/openwrt/` | openwrt.org + firmware-selector | Official selector + downloads. |
| `/cradlepoint/` | cradlepoint.com/support | 200 → Ericsson NetCloud support. |
| `/sierra/` | source.sierrawireless.com | Official Source + ALMS + support. Catalog cards were empty until filter fix. |
| `/nodered/` + `/node-red/` | nodered.org | Official docs/GitHub/npm. |
| `/foss/` | signalk.org / openwrt.org / nodered.org | Official FOSS start-here links. |

## Unique outbound URLs

Status is the user-facing result after reconciliation (browser/WebFetch override of bot-walls). `final` is the last URL after hops when known.

| Verdict | HTTP | Requested | Final | Brand(s) | Notes |
|---|---|---|---|---|---|
| redirect-weird | 200 | https://www.lairdconnect.com/ | https://www.ezurio.com/ | Laird Connectivity | host change www.lairdconnect.com -> www.ezurio.com Rebrand: Laird Connectivity → Ezurio. /rf-antennas lands on ezurio.com/internal-antennas (embedded, not vehicle RF). |
| redirect-weird | 200 | https://www.lairdconnect.com/rf-antennas | https://www.ezurio.com/internal-antennas | Laird Connectivity | host change www.lairdconnect.com -> www.ezurio.com Rebrand: Laird Connectivity → Ezurio. /rf-antennas lands on ezurio.com/internal-antennas (embedded, not vehicle RF). |
| ok-legacy | 200 | https://kingconnect.com/ | same | KING | LIVE 200 but FINAL LIQUIDATION storefront. Catalog already says do-not-sell-new / placeholder. |
| ok-redirect | 200 | https://cradlepoint.com/products/netcloud-service/ | https://cradlepoint.ericsson.com/products/netcloud/netcloud-service/ | Cradlepoint | host change cradlepoint.com -> cradlepoint.ericsson.com Official Ericsson rebrand host cradlepoint.ericsson.com. Old URL still 200-redirects. |
| ok-redirect | 200 | https://cradlepoint.com/support/ | https://cradlepoint.ericsson.com/support/ | Cradlepoint | host change cradlepoint.com -> cradlepoint.ericsson.com Official Ericsson rebrand host cradlepoint.ericsson.com. Old URL still 200-redirects. |
| ok | 200 | https://api.starlink.com/public-files/Starlink%20Product%20Specifications_HighPerformance.pdf | same | Starlink |  |
| ok | 200 | https://api.starlink.com/public-files/specification_sheet_flat_high_performance.pdf | same | Starlink |  |
| ok | 200 | https://apps.apple.com/us/app/cel-fi-mywave/id1560705133 | same | Cel-Fi |  |
| ok | 200 | https://apps.apple.com/us/app/cel-fi-wave/id980050278 | same | Cel-Fi |  |
| ok | 200 | https://apps.apple.com/us/app/rv-halo/id1563032659 | same | Winegard |  |
| ok | 200 | https://apps.apple.com/us/app/starlink/id1537177988 | same | Starlink |  |
| ok | 200 | https://apps.apple.com/us/app/surecall/id6449509462 | same | SureCall |  |
| ok | 200 | https://apps.apple.com/us/app/victron-toolkit/id791585341 | same | Victron |  |
| ok | 200 | https://apps.apple.com/us/app/victronconnect/id943840744 | same | Victron |  |
| ok | 200 | https://apps.apple.com/us/app/vrm-victron-remote-management/id658834560 | same | Victron | App Store 429 rate-limit on this run; sibling Victron iOS IDs returned 200. |
| ok | 200 | https://apps.apple.com/us/app/weboost/id1611974453 | same | weBoost |  |
| ok | 200 | https://assets.wilsonelectronics.com/m/700bdbf86910493c/original/Drive-Reach-RV-Installation-Guide.pdf | https://cdn.amplifi.pattern.com/233ee3b7-5241-4399-b668-8724309a2a47 | weBoost | host change assets.wilsonelectronics.com -> cdn.amplifi.pattern.com OEM PDF CDN hop to cdn.amplifi.pattern.com — still the Drive Reach RV install guide. |
| ok | 200 | https://cel-fi.com/ | same | Cel-Fi | CF/bot 403 from datacenter curl; WebFetch/browser: Nextivity/Cel-Fi corporate site. |
| ok | 200 | https://community.victronenergy.com/ | same | Victron |  |
| ok | 200 | https://dl.gl-inet.com/ | same | GL.iNet |  |
| ok | 200 | https://docs.cradlepoint.com/ | same | Cradlepoint |  |
| ok | 200 | https://docs.gl-inet.com/router/en/4/ | same | GL.iNet |  |
| ok | 200 | https://docs.gl-inet.com/router/en/4/interface_guide/upgrade/ | same | GL.iNet |  |
| ok | 200 | https://docs.unitedmobilerv.com/ | same |  | CF challenge on datacenter curl; live Field Docs in browser. |
| ok | 200 | https://downloads.openwrt.org/ | same | FOSS |  |
| ok | 200 | https://firmware-selector.openwrt.org/ | same | OpenWrt |  |
| ok | 200 | https://firmware.gl-inet.com/ | same | GL.iNet |  |
| ok | 200 | https://flows.nodered.org/ | same | FOSS |  |
| ok | 200 | https://forum.peplink.com/ | same | Peplink |  |
| ok | 200 | https://forum.unitedmobilerv.com/ | same |  | CF challenge on datacenter curl; live Community Forum in browser. |
| ok | 200 | https://github.com/FlowFuse/node-red-dashboard | same | FOSS |  |
| ok | 200 | https://github.com/SignalK/signalk-node-red | same | FOSS |  |
| ok | 200 | https://github.com/SignalK/signalk-server | same | FOSS |  |
| ok | 200 | https://github.com/crashdummy88/umrt-software | same |  |  |
| ok | 200 | https://github.com/node-red/node-red | same | FOSS |  |
| ok | 200 | https://github.com/node-red/node-red-dashboard | same | FOSS |  |
| ok | 200 | https://github.com/openwrt/openwrt | same | FOSS |  |
| ok | 200 | https://github.com/victronenergy/venus | same | Victron |  |
| ok | 200 | https://incontrol.peplink.com/ | https://incontrol2.peplink.com:443/ |  | host change incontrol.peplink.com -> incontrol2.peplink.com:443 |
| ok | 200 | https://incontrol2.peplink.com/ | same | Peplink |  |
| ok | 200 | https://nextivityinc.com/ | same | Cel-Fi | Bot wall on curl; official Nextivity site via WebFetch/browser. |
| ok | 200 | https://nextivityinc.com/go-g32/ | same | Cel-Fi | Bot wall on curl; official GO G32 product. |
| ok | 200 | https://nextivityinc.com/go-g32/mobile-solutions/ | same | Cel-Fi | Bot wall on curl; official GO G32 mobile kits. |
| ok | 200 | https://nextivityinc.com/products/roam-r41/ | same | Cel-Fi | Bot wall on curl; official ROAM R41. |
| ok | 200 | https://nextivityinc.com/software/ | same | Cel-Fi | Bot wall on curl; official software hub. |
| ok | 200 | https://nextivityinc.com/software/wave/ | same | Cel-Fi | Bot wall on curl; WAVE software path. |
| ok | 200 | https://nextivityinc.com/software/wavefieldtool/ | same | Cel-Fi | Bot wall on curl; WAVE Field Tool path. |
| ok | 200 | https://nextivityinc.com/support/ | same | Cel-Fi | Official Nextivity Technical Support (clicked from /celfi/). |
| ok | 200 | https://nodered.org/ | same | FOSS |  |
| ok | 200 | https://nodered.org/about/license/ | same | FOSS |  |
| ok | 200 | https://nodered.org/docs/ | same | FOSS |  |
| ok | 200 | https://nodered.org/docs/getting-started/ | same | FOSS |  |
| ok | 200 | https://nodered.org/docs/user-guide/ | same | FOSS |  |
| ok | 200 | https://nodered.org/docs/user-guide/runtime/securing-node-red | same | FOSS |  |
| ok | 200 | https://openwrt.org/ | same | FOSS, OpenWrt |  |
| ok | 200 | https://openwrt.org/docs/guide-user/installation/generic.overview | same |  |  |
| ok | 200 | https://openwrt.org/docs/guide-user/installation/generic.sysupgrade | same |  |  |
| ok | 200 | https://openwrt.org/downloads | same | OpenWrt |  |
| ok | 200 | https://openwrt.org/releases/start | same |  |  |
| ok | 200 | https://openwrt.org/toh/start | same |  |  |
| ok | 200 | https://parsec-t.com/ | same | Parsec |  |
| ok | 200 | https://parsec-t.com/products/ | https://parsec-t.com/ | Parsec |  |
| ok | 200 | https://parsec-t.com/support/ | https://parsec-t.com/ | Parsec | WebFetch rendered marketing homepage content at /support/ (SPA/CMS). Not a 404. |
| ok | 200 | https://play.google.com/store/apps/details?id=com.NxtyWave | same | Cel-Fi |  |
| ok | 200 | https://play.google.com/store/apps/details?id=com.nextivityinc.MyWave | same | Cel-Fi |  |
| ok | 200 | https://play.google.com/store/apps/details?id=com.starlink.mobile | same | Starlink |  |
| ok | 200 | https://play.google.com/store/apps/details?id=com.surecall.surecall | same | SureCall |  |
| ok | 200 | https://play.google.com/store/apps/details?id=com.victronenergy.victronconnect | same | Victron |  |
| ok | 200 | https://play.google.com/store/apps/details?id=com.wilsonelectronics.weboost | same | weBoost |  |
| ok | 200 | https://play.google.com/store/apps/details?id=com.winegard.halo | same | Winegard |  |
| ok | 200 | https://play.google.com/store/apps/details?id=nl.victronenergy | same | Victron |  |
| ok | 200 | https://play.google.com/store/apps/details?id=nl.victronenergy.victronledapp | same | Victron |  |
| ok | 200 | https://play.google.com/store/search?q=Dometic&c=apps | same | Dometic |  |
| ok | 200 | https://poynting.tech/ | same | Poynting | Bot wall on curl; official Poynting site. |
| ok | 200 | https://poynting.tech/contact/ | same | Poynting | Bot wall on curl; official contact. |
| ok | 200 | https://poynting.tech/downloads/ | same | Poynting | WebFetch: official Downloads - POYNTING Antenna Solutions. |
| ok | 200 | https://professional.victronenergy.com/downloads/firmware/ | same | Victron |  |
| ok | 200 | https://rms.teltonika-networks.com/ | same | Teltonika |  |
| ok | 200 | https://rvhalo.com/ | same | Winegard |  |
| ok | 200 | https://shop.unitedmobilerv.com/ | same |  | CF challenge on datacenter curl; live Shop in browser. |
| ok | 200 | https://signalk.org/ | same | FOSS |  |
| ok | 200 | https://source.sierrawireless.com/ | same | Sierra Wireless |  |
| ok | 200 | https://starlink.com/public-files/accessories_guide_flat_high_performance.pdf | same | Starlink |  |
| ok | 200 | https://starlink.com/public-files/installation_guide_flat_high_performance_kit.pdf | same | Starlink |  |
| ok | 200 | https://starlink.com/public-files/specification_sheet_mini.pdf | same | Starlink |  |
| ok | 200 | https://starlink.com/sl/roam | same | Starlink |  |
| ok | 200 | https://support.cel-fi.com/hc/en-us | same | Cel-Fi | Zendesk often 403s bots; official Cel-Fi support host. |
| ok | 200 | https://support.cel-fi.com/hc/en-us/articles/14324851714971-WAVE-App-Overview | same | Cel-Fi | Zendesk article; bot wall on curl. |
| ok | 200 | https://support.weboost.com/ | https://www.weboost.com/support | weBoost | host change support.weboost.com -> www.weboost.com |
| ok | 200 | https://surecall.com/ | same | SureCall |  |
| ok | 200 | https://surecall.com/car-boosters/ | https://surecall.com/vehicle-cell-signal-boosters/ | SureCall |  |
| ok | 200 | https://surecall.com/car-boosters/fusion2go-xr/ | same | SureCall |  |
| ok | 200 | https://surecall.com/rv-boosters/fusion2go-rv/ | same | SureCall | Path still 200; page title is Fusion2Go 3.0 RV (legacy slug). |
| ok | 200 | https://surecall.com/rv-cell-phone-boosters/ | same | SureCall |  |
| ok | 200 | https://surecall.com/rv-cell-phone-boosters/fusion2go-xr-rv-cell-phone-signal-booster/ | same | SureCall |  |
| ok | 200 | https://surecall.com/signal-booster-for-trucks/fusion2go-ultra/ | same | SureCall |  |
| ok | 200 | https://surecall.com/support/ | same | SureCall |  |
| ok | 200 | https://surecall.com/user-manuals/ | same | SureCall |  |
| ok | 200 | https://surecall.com/vehicle-cell-signal-boosters/ | same | SureCall |  |
| ok | 200 | https://teltonika-networks.com/ | https://www.teltonika-networks.com/ | Teltonika | host change teltonika-networks.com -> www.teltonika-networks.com |
| ok | 200 | https://tyconpower.com/ | same | Tycon | Python TLS handshake failed; WebFetch: official Tycon Power catalog. |
| ok | 200 | https://tyconpower.com/products/ | same | Tycon | Same TLS client quirk; site live via WebFetch. |
| ok | 200 | https://united-mobile-rv-llc.square.site/ | same |  |  |
| ok | 200 | https://unitedmobilerv.com/ | same |  | CF challenge on datacenter curl; live WP hub in browser. |
| ok | 200 | https://unitedmobilerv.com/guide/peplink-multi-wan-guide/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/guide/starlink-rv-guide/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/guide/weboost-install-guide/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/troubleshoot/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/troubleshoot/generator-wont-start/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/troubleshoot/no-power/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/troubleshoot/no-water/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/troubleshoot/peplink-wan-flapping/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/troubleshoot/roof-leak/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/troubleshoot/starlink-offline/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/troubleshoot/weboost-no-boost/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/victron/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://unitedmobilerv.com/wireless/ | same |  | CF challenge on datacenter curl; same-host WP paths as live unitedmobilerv.com. |
| ok | 200 | https://updates.victronenergy.com/feeds/venus/release/images/ | same | Victron |  |
| ok | 200 | https://vrm.victronenergy.com/ | same | Victron |  |
| ok | 200 | https://wave.nextivityinc.com/ | same | Cel-Fi |  |
| ok | 200 | https://wiki.teltonika-networks.com/ | https://wiki.teltonika-networks.com/view/Main_Page | Teltonika |  |
| ok | 200 | https://wiki.teltonika-networks.com/view/Downloads | same | Teltonika |  |
| ok | 200 | https://winegard.com/ | same | Winegard |  |
| ok | 200 | https://winegard.com/connect | same | Winegard |  |
| ok | 200 | https://winegard.com/connect-2-4g/ | same | Winegard |  |
| ok | 200 | https://winegard.com/connect-5g | https://winegard.com/connect-5g/ | Winegard |  |
| ok | 200 | https://winegard.com/product-registration | same | Winegard |  |
| ok | 200 | https://winegard.com/smart/rv-halo | same | Winegard |  |
| ok | 200 | https://winegard.com/smart/rv-halo/compatible-devices | same | Winegard |  |
| ok | 200 | https://winegard.com/support/ | same | Winegard |  |
| ok | 200 | https://www.airgain.com/ | same | Airgain | Bot wall on curl; official Airgain. |
| ok | 200 | https://www.airgain.com/products/ | same | Airgain | WebFetch: Wireless Connectivity Products - Airgain. |
| ok | 200 | https://www.cradlepointecm.com/ | https://accounts.cradlepointecm.com/ |  | host change www.cradlepointecm.com -> accounts.cradlepointecm.com |
| ok | 200 | https://www.dometic.com/ | https://www.dometic.com/en-us | Dometic |  |
| ok | 200 | https://www.dometic.com/en-us/support | same | Dometic |  |
| ok | 200 | https://www.gl-inet.com/ | https://www.gl-inet.com/en-us | GL.iNet |  |
| ok | 200 | https://www.gl-inet.com/support/ | https://www.gl-inet.com/en-us/blogs/support | GL.iNet |  |
| ok | 200 | https://www.mobilemark.com/ | same | Mobile Mark |  |
| ok | 200 | https://www.mobilemark.com/product-category/cellular-antennas/ | https://www.mobilemark.com/error-404/ | Mobile Mark |  |
| ok | 200 | https://www.mobilemark.com/support/ | https://www.mobilemark.com/error-404/ | Mobile Mark |  |
| ok | 200 | https://www.npmjs.com/package/@flowfuse/node-red-dashboard | same | FOSS | npm CF challenge; official package. |
| ok | 200 | https://www.npmjs.com/package/@signalk/node-red | same | FOSS | npm CF challenge; official package. |
| ok | 200 | https://www.npmjs.com/package/node-red | same | FOSS | npm CF challenge on automated clients; official package. |
| ok | 200 | https://www.npmjs.com/package/node-red-dashboard | same | FOSS | npm CF challenge; official package. |
| ok | 200 | https://www.peplink.com/products/antennas/ | https://www.peplink.com/products/accessories/#Antennas | Peplink |  |
| ok | 200 | https://www.peplink.com/products/mobile-routers/ | same |  |  |
| ok | 200 | https://www.peplink.com/support/ | same | Peplink |  |
| ok | 200 | https://www.peplink.com/support/downloads/firmware/ | same | Peplink, Starlink | Also cited from Starlink bypass-mode catalog entry (Peplink pairing). Not a wrong-brand product page. |
| ok | 200 | https://www.peplink.com/technology/speedfusion-vpn/ | same |  |  |
| ok | 200 | https://www.sierrawireless.com/products-and-solutions/routers-gateways/ | https://www.sierrawireless.com/router-solutions/ |  |  |
| ok | 200 | https://www.sierrawireless.com/router-solutions/alms/ | same | Sierra Wireless |  |
| ok | 200 | https://www.sierrawireless.com/support/ | same | Sierra Wireless |  |
| ok | 200 | https://www.starlink.com/accessories | https://starlink.com/accessories | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/bypass-mode | https://starlink.com/bypass-mode | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/map | https://starlink.com/map | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/residential | https://starlink.com/residential | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/roam | https://starlink.com/roam | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/service-plans | https://starlink.com/service-plans | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/shop | https://starlink.com/shop | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/specifications | https://starlink.com/specifications/4 | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/support | https://starlink.com/support | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.starlink.com/updates | https://starlink.com/updates | Starlink | host change www.starlink.com -> starlink.com |
| ok | 200 | https://www.taoglas.com/ | same | Taoglas | Bot wall on curl; official Taoglas. |
| ok | 200 | https://www.taoglas.com/product-category/external-antennas/cellular-external-antennas/ | same | Taoglas | Bot wall on curl; official cellular external category. |
| ok | 200 | https://www.taoglas.com/support/ | same | Taoglas | WebFetch: Taoglas Customer Support and Resource Library. |
| ok | 200 | https://www.teltonika-networks.com/ | same | Teltonika |  |
| ok | 200 | https://www.tyconsystems.com/ | same | Tycon |  |
| ok | 200 | https://www.victronenergy.com/accessories/interface-mk3-usb | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/battery-monitors | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/battery-monitors/smart-battery-shunt | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/dc-dc-converters | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/dc-dc-converters/orion-tr-smart | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/dc-distribution-systems | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/dc-distribution-systems/lynx-distributor | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/inverters-chargers | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/inverters-chargers/multiplus-ii | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/inverters-chargers/quattro | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/assistants:start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/battery_compatibility:start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/battery_compatibility:victron_lithium_batteries | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/ccgx:ccgx_ve_power_setup | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/ccgx:firmware_updating | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/ccgx:start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/ve.bus:start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/ve.bus:veconfigure_manual | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/ve.can:start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/venus-os:start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/victronconnect:start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/live/vrm_portal:start | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/media/pg/Cerbo_GX/en/firmware-updates.html | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/media/pg/VEConfigure_Manual/en/index-en.html | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/panel-systems-remote-monitoring/cerbo-gx | https://www.victronenergy.com/communication-centres/cerbo-gx | Victron |  |
| ok | 200 | https://www.victronenergy.com/solar-charge-controllers | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/support-and-downloads/manuals | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/support-and-downloads/software | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/support-and-downloads/technical-information | same | Victron |  |
| ok | 200 | https://www.victronenergy.com/victronconnectapp/victronconnect/downloads | same | Victron |  |
| ok | 200 | https://www.weboost.com/ | same | weBoost |  |
| ok | 200 | https://www.weboost.com/app | same | weBoost |  |
| ok | 200 | https://www.weboost.com/boosters/vehicle-rv | same | KING, weBoost |  |
| ok | 200 | https://www.weboost.com/collections/antennas | https://www.weboost.com/accessories | weBoost |  |
| ok | 200 | https://www.weboost.com/products/destination-rv | same | weBoost |  |
| ok | 200 | https://www.weboost.com/products/drive-reach-overland | same | weBoost |  |
| ok | 200 | https://www.weboost.com/products/drive-reach-rv | same | weBoost |  |
| ok | 200 | https://www.weboost.com/products/drive-reach-rv-2 | same | weBoost |  |
| ok | 200 | https://www.weboost.com/products/weboost-rv-35 | same | weBoost |  |
| ok | 200 | https://www.weboost.com/products/weboost-rv-50 | same | weBoost |  |
| ok | 200 | https://www.weboost.com/support | same | weBoost |  |
| ok | 200 | https://www.wilsonamplifiers.com/ | same | Wilson Amplifiers |  |
| ok | 200 | https://www.wilsonamplifiers.com/antennas/ | https://www.wilsonamplifiers.com/antennas | Wilson Amplifiers |  |
| ok | 200 | https://www.wilsonamplifiers.com/resources/ | same | Wilson Amplifiers, weBoost |  |
| ok | 200 | https://www.wilsonconnectivity.com/ | same | weBoost |  |

## What this PR did **not** do

- No visual redesign, no CTA restyle, no new brand pages.
- Did not retarget convert Book buttons off Square.
- Did not replace KING, Laird, or Cradlepoint URLs (they resolve; honesty/rebrand notes only).
- Did not invent Dometic App Store IDs.

