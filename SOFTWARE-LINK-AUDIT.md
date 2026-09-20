# SOFTWARE link audit — Stage-4

**Live:** https://software.unitedmobilerv.com/  
**Repo:** https://github.com/crashdummy88/umrt-software  
**Audited:** 2026-09-20 (Apps lane, this PR)  
**Scope:** Every firmware / app / store / manufacturer-download URL on hub HTML, brand HTML, troubleshoot HTML, and `catalog/index.json`. Chrome mesh (Home / Services / Shop / Book / Forum / Software / Docs) excluded from the outbound table. Internal `/` paths, `tel:`, and `sms:` excluded.

## Verdict

Manufacturer / app-store / firmware links are **mostly good**. This Stage-4 tip’s matrix is **208 unique** download/app/store URLs (repo HTML + catalog + 3 live leftover FAILs still on production until merge).

**ADMIN QA follow-up (folded into this same draft):**

- `/dometic/` deepened to Victron-class depth: Dometic Power + legacy Mobile Cooling / Climate, official store IDs, in-app firmware honesty, support + documents database.
- `/troubleshoot/` now has a manufacturer apps/firmware/support outbound list (Victron, Peplink, weBoost, Starlink, Dometic, Winegard, OpenWrt) — not Field Guide essays.
- New real `/antennas/` page; home card href is `/antennas/` (not `/#catalog`).
- P2 polish: sticky mobile Call/Text/Book bar, Book `target="_blank" rel="noopener"`, catalog `<noscript>` fallback, `#paste-pack` / `#text-now` moved inside `<main>`.
- Spot-check still green: Victron software hub, Peplink firmware, weBoost support, Starlink support — HTTP 200 Pass.

**Fixed in this PR (were FAIL on live):**

1. **Mobile Mark** ` /product-category/cellular-antennas/` and `/support/` → official 404 page. Replaced with [`/product-category/cellular-iot-m2m/mobile/`](https://www.mobilemark.com/product-category/cellular-iot-m2m/mobile/) and [`/contact-us/`](https://www.mobilemark.com/contact-us/).
2. **Laird** `lairdconnect.com/rf-antennas` hops to Ezurio **internal** antennas (wrong product). Replaced with official [`ezurio.com`](https://www.ezurio.com/) + [`/products/connectivity`](https://www.ezurio.com/products/connectivity). Honesty: Ezurio’s public catalog is now modules / internal antennas, not a vehicle RF PLP.

**Left FAIL for Matt (uncertain official replacement):**

- Parsec `parsec-t.com/products/` and `/support/` — HTTP 200 but both render the marketing homepage (soft-404). No clear official product/support index found.

**Not failures:** App Store `429` rate-limits, npm/Taoglas/Cel-Fi Zendesk datacenter `403` bot-walls, Tycon TLS handshake quirk from this client (WebFetch: official). Victron Professional firmware remains an official login/Dropbox gate. KING `kingconnect.com` is a live liquidation/placeholder — honesty copy already says do not sell new.

**QGPS:** no customer page. `/qgps` is an explicit HTTP 404 (`_redirects`). No firmware/app URLs to audit.

## Chrome / convert locks (this tip)

| Check | Result |
|---|---|
| `book.unitedmobilerv.com` in `*.html` / `*.js` / `*.json` | **0** |
| `MAIN HUB` / `Main Hub` | **0** |
| Book customer href | `https://united-mobile-rv-llc.square.site/` only |
| `united-mobile-rv.pages.dev` in HTML | **0** |
| Convert CTAs | Call `tel:+16166065277` · Text Now `sms:+16166065277` · Book Square (`target="_blank" rel="noopener"`) · Troubleshoot `/troubleshoot/` · sticky mobile bar |
| Prefer Text | **0** |
| Portal / Status in customer chrome | **0** |
| Credentials (stacked footer) | Victron Professional Certified Installer · weBoost Authorized · Peplink Certified Associate · Starlink installs only (never Certified) |
| NAP | St. Ignace not present as a customer claim here; no Alpine WY / Royal Oak |

## Old drafts harvested (not merged)

| PR | Keep / drop |
|---|---|
| #64 hero fluff | DROP Book→`book.*`. Hero CTA strip already on main as Call / Text Now / Book / Troubleshoot. |
| #62 Call/Text/Book/Troubleshoot + substance | DROP Book→`book.*`. Kept convert-set direction (Square) on brand pages that lacked it. |
| #61 firmware/apps by brand | **KEEP direction.** Rebased substance onto current chrome (Home · Services · Shop · Book Square · Forum · Software · Docs). Sierra catalog filter stays `Sierra Wireless` (#65). |
| #55 Prefer Text + Square | DROP Prefer Text (main is Text Now). Square / public-host guides already on main. |
| #54 Text Now lock | Already on main. |
| #53 pages.dev guide scrub | Already on main (`rg` = 0). |
| #49 Book→`book.*` | **DROP** (wrong Book destination). |

## Unique outbound firmware / app / store / download URLs

Status is the HTTP code after redirect follow (browser UA). Pass/Fail is user-facing: official manufacturer / app-store page = Pass; 404 / soft-404 / wrong product / customer pages.dev = Fail. Bot-walls and App Store rate-limits on official hosts = Pass with a note.

<!-- MATRIX_BEGIN -->
| Brand | Label | URL | Status | Pass/Fail | Notes |
|---|---|---|---|---|---|
| Laird Connectivity | Laird RF antennas · rf_antennas | https://www.lairdconnect.com/rf-antennas | 200 | Fail | LIVE leftover hops to ezurio.com/internal-antennas (wrong product). This PR retargets to ezurio.com + /products/connectivity; present on live catalog/HTML only |
| Mobile Mark | Mobile Mark antennas · cellular | https://www.mobilemark.com/product-category/cellular-antennas/ | 200 | Fail | LIVE leftover 404 (`/error-404/`). This PR retargets catalog to `/product-category/cellular-iot-m2m/mobile/`; present on live catalog/HTML only |
| Mobile Mark | Mobile Mark antennas · support | https://www.mobilemark.com/support/ | 200 | Fail | LIVE leftover 404 (`/error-404/`). This PR retargets catalog to `/contact-us/`; present on live catalog/HTML only |
| Parsec | Parsec antennas · products | https://parsec-t.com/products/ | 200 | Fail | FAIL for Matt: /products/ is a soft homepage, not a product index |
| Parsec | Parsec antennas · support | https://parsec-t.com/support/ | 200 | Fail | FAIL for Matt: /support/ is a soft homepage, not a support desk |
| Airgain | Airgain antennas · site | https://www.airgain.com/ | 200 | Pass | final https://airgain.com/ |
| Airgain | Airgain antennas · products | https://www.airgain.com/products/ | 200 | Pass | final https://airgain.com/products/ |
| Cel-Fi | Cel-Fi / Nextivity support · cel_fi_site | https://cel-fi.com/ | 200 | Pass | final https://nextivityinc.com/ |
| Cel-Fi | Cel-Fi / Nextivity support · site | https://nextivityinc.com/ | 200 | Pass |  |
| Cel-Fi | Cel-Fi GO / ROAM mobile lines · go_g32 | https://nextivityinc.com/go-g32/ | 200 | Pass |  |
| Cel-Fi | Cel-Fi GO / ROAM mobile lines · go_g32_mobile | https://nextivityinc.com/go-g32/mobile-solutions/ | 200 | Pass |  |
| Cel-Fi | Cel-Fi GO / ROAM mobile lines · roam_r41 | https://nextivityinc.com/products/roam-r41/ | 200 | Pass |  |
| Cel-Fi | CEL-FI WAVE app · wavefieldtool | https://nextivityinc.com/software/wavefieldtool/ | 200 | Pass |  |
| Cel-Fi | Cel-Fi / Nextivity support · cel_fi_support | https://support.cel-fi.com/hc/en-us | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| Cel-Fi | CEL-FI WAVE app · overview | https://support.cel-fi.com/hc/en-us/articles/14324851714971-WAVE-App-Overview | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| celfi | App Store id1560705133 | https://apps.apple.com/us/app/cel-fi-mywave/id1560705133 | 429 | Pass | App Store 429 rate-limit this run; official store listing (WebFetch confirmed sibling IDs) |
| celfi | App Store id980050278 | https://apps.apple.com/us/app/cel-fi-wave/id980050278 | 200 | Pass |  |
| celfi | nextivityinc.com/software | https://nextivityinc.com/software/ | 200 | Pass |  |
| celfi | WAVE | https://nextivityinc.com/software/wave/ | 200 | Pass |  |
| celfi | nextivityinc.com/support | https://nextivityinc.com/support/ | 200 | Pass |  |
| celfi | Play com.NxtyWave | https://play.google.com/store/apps/details?id=com.NxtyWave | 200 | Pass |  |
| celfi | Play com.nextivityinc.MyWave | https://play.google.com/store/apps/details?id=com.nextivityinc.MyWave | 200 | Pass |  |
| celfi | wave.nextivityinc.com | https://wave.nextivityinc.com/ | 200 | Pass |  |
| cradlepoint | NetCloud Service | https://cradlepoint.com/products/netcloud-service/ | 200 | Pass | final https://cradlepoint.ericsson.com/products/netcloud/netcloud-service/ |
| cradlepoint | cradlepoint.com/support | https://cradlepoint.com/support/ | 200 | Pass | final https://cradlepoint.ericsson.com/support/ |
| cradlepoint | docs.cradlepoint.com | https://docs.cradlepoint.com/ | 200 | Pass |  |
| cradlepoint | cradlepointecm.com | https://www.cradlepointecm.com/ | 200 | Pass | final https://accounts.cradlepointecm.com/ |
| dometic | Play “Dometic” | https://play.google.com/store/search?q=Dometic&c=apps | 200 | Pass |  |
| dometic | Dometic Power App Store | https://apps.apple.com/us/app/dometic-power/id6648772769 | 200 | Pass | official Dometic Group listing (current app) |
| dometic | Mobile Cooling App Store | https://apps.apple.com/us/app/mobile-cooling/id1495660690 | 200 | Pass | official; still required for CFX2 |
| dometic | Dometic Climate App Store | https://apps.apple.com/us/app/dometic-climate/id1660906196 | 200 | Pass | official; still required for TwinBoost |
| Dometic | Dometic Power / official apps · documents | https://documents.dometic.com/search | 202 | Pass | official documents host; datacenter AWS WAF challenge (202) |
| Dometic | Dometic Power / official apps · power_android | https://play.google.com/store/apps/details?id=com.dometic.app | 200 | Pass |  |
| Dometic | Dometic Power / official apps · cooling_android | https://play.google.com/store/apps/details?id=com.dometic.cfx3 | 200 | Pass |  |
| Dometic | Dometic Power / official apps · climate_android | https://play.google.com/store/apps/details?id=com.dometic.outdoor | 200 | Pass |  |
| dometic | dometic.com | https://www.dometic.com/ | 200 | Pass | final https://www.dometic.com/en-us |
| Dometic | Dometic support & documents · documents_lp | https://www.dometic.com/en-us/lp/documents-database | 200 | Pass |  |
| dometic | dometic.com/en-us/support | https://www.dometic.com/en-us/support | 200 | Pass |  |
| Dometic | Dometic Power / official apps · apps | https://www.dometic.com/en-us/support/apps | 200 | Pass | official apps hub (firmware-in-app start) |
| Dometic | Dometic Power / official apps · migration | https://www.dometic.com/en-us/support/dometic-app-migration | 200 | Pass |  |
| FOSS | FlowFuse Node-RED Dashboard 2.0 · github | https://github.com/FlowFuse/node-red-dashboard | 200 | Pass |  |
| foss | SignalK/signalk-node-red | https://github.com/SignalK/signalk-node-red | 200 | Pass |  |
| FOSS | Node-RED · user_guide | https://nodered.org/docs/user-guide/ | 200 | Pass |  |
| FOSS | Node-RED · securing | https://nodered.org/docs/user-guide/runtime/securing-node-red | 200 | Pass |  |
| FOSS | FlowFuse Node-RED Dashboard 2.0 · npm | https://www.npmjs.com/package/@flowfuse/node-red-dashboard | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| FOSS | Node-RED flows library · npm_signalk | https://www.npmjs.com/package/@signalk/node-red | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| FOSS | Node-RED Dashboard (classic) · npm | https://www.npmjs.com/package/node-red-dashboard | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| GL.iNet | GL.iNet router docs · site | https://www.gl-inet.com/ | 200 | Pass |  |
| glinet | dl.gl-inet.com | https://dl.gl-inet.com/ | 200 | Pass |  |
| glinet | docs.gl-inet.com/router/en/4 | https://docs.gl-inet.com/router/en/4/ | 200 | Pass |  |
| glinet | upgrade | https://docs.gl-inet.com/router/en/4/interface_guide/upgrade/ | 200 | Pass |  |
| glinet | firmware.gl-inet.com | https://firmware.gl-inet.com/ | 200 | Pass |  |
| glinet | gl-inet.com/support | https://www.gl-inet.com/support/ | 200 | Pass | final https://www.gl-inet.com/blogs/support |
| king | kingconnect.com | https://kingconnect.com/ | 200 | Pass | official KING host; liquidation / placeholder storefront |
| Laird Connectivity | Ezurio (formerly Laird) antennas · site | https://www.ezurio.com/ | 200 | Pass |  |
| Laird Connectivity | Ezurio (formerly Laird) antennas · connectivity | https://www.ezurio.com/products/connectivity | 200 | Pass |  |
| Laird Connectivity | Laird RF antennas · site | https://www.lairdconnect.com/ | 200 | Pass | final https://www.ezurio.com/; present on live catalog/HTML only |
| Mobile Mark | Mobile Mark antennas · site | https://www.mobilemark.com/ | 200 | Pass |  |
| Mobile Mark | Mobile Mark antennas · contact | https://www.mobilemark.com/contact-us/ | 200 | Pass |  |
| Mobile Mark | Mobile Mark antennas · mobile | https://www.mobilemark.com/product-category/cellular-iot-m2m/mobile/ | 200 | Pass |  |
| nodered | flows.nodered.org | https://flows.nodered.org/ | 200 | Pass |  |
| nodered | SignalK/signalk-server | https://github.com/SignalK/signalk-server | 200 | Pass |  |
| nodered | node-red/node-red | https://github.com/node-red/node-red | 200 | Pass |  |
| nodered | node-red/node-red-dashboard | https://github.com/node-red/node-red-dashboard | 200 | Pass |  |
| nodered | nodered.org | https://nodered.org/ | 200 | Pass |  |
| nodered | Apache-2.0 | https://nodered.org/about/license/ | 200 | Pass |  |
| nodered | nodered.org/docs | https://nodered.org/docs/ | 200 | Pass |  |
| nodered | nodered.org/docs/getting-started | https://nodered.org/docs/getting-started/ | 200 | Pass |  |
| nodered | signalk.org | https://signalk.org/ | 200 | Pass |  |
| nodered | node-red | https://www.npmjs.com/package/node-red | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| openwrt | downloads.openwrt.org | https://downloads.openwrt.org/ | 200 | Pass |  |
| openwrt | firmware-selector.openwrt.org | https://firmware-selector.openwrt.org/ | 200 | Pass |  |
| openwrt | github.com/openwrt/openwrt | https://github.com/openwrt/openwrt | 200 | Pass |  |
| openwrt | openwrt.org | https://openwrt.org/ | 200 | Pass |  |
| openwrt | generic.overview | https://openwrt.org/docs/guide-user/installation/generic.overview | 200 | Pass |  |
| openwrt | generic.sysupgrade | https://openwrt.org/docs/guide-user/installation/generic.sysupgrade | 200 | Pass |  |
| openwrt | openwrt.org/downloads | https://openwrt.org/downloads | 200 | Pass |  |
| openwrt | openwrt.org/releases/start | https://openwrt.org/releases/start | 200 | Pass |  |
| openwrt | openwrt.org/toh/start | https://openwrt.org/toh/start | 200 | Pass |  |
| Parsec | Parsec antennas · site | https://parsec-t.com/ | 200 | Pass |  |
| peplink | incontrol2.peplink.com | https://incontrol2.peplink.com/ | 200 | Pass |  |
| Peplink | Peplink antennas · antennas | https://www.peplink.com/products/antennas/ | 200 | Pass | final https://www.peplink.com/products/accessories/#Antennas |
| peplink | peplink.com/products/mobile-routers | https://www.peplink.com/products/mobile-routers/ | 200 | Pass |  |
| peplink | peplink.com/support | https://www.peplink.com/support/ | 200 | Pass |  |
| peplink | peplink.com/support/downloads/firmware | https://www.peplink.com/support/downloads/firmware/ | 200 | Pass |  |
| peplink | peplink.com/technology/speedfusion-vpn | https://www.peplink.com/technology/speedfusion-vpn/ | 200 | Pass |  |
| Poynting | Poynting antennas · site | https://poynting.tech/ | 200 | Pass |  |
| Poynting | Poynting antennas · contact | https://poynting.tech/contact/ | 200 | Pass | final https://poynting.tech/contact-us/ |
| Poynting | Poynting antennas · downloads | https://poynting.tech/downloads/ | 200 | Pass |  |
| sierra | source.sierrawireless.com | https://source.sierrawireless.com/ | 200 | Pass |  |
| sierra | routers & gateways | https://www.sierrawireless.com/products-and-solutions/routers-gateways/ | 200 | Pass | final https://www.sierrawireless.com/router-solutions/ |
| sierra | ALMS | https://www.sierrawireless.com/router-solutions/alms/ | 200 | Pass |  |
| sierra | sierrawireless.com/support | https://www.sierrawireless.com/support/ | 200 | Pass |  |
| Starlink | Starlink hardware specs (official PDFs) · hp_pdf | https://api.starlink.com/public-files/Starlink%20Product%20Specifications_HighPerformance.pdf | 200 | Pass |  |
| Starlink | Starlink hardware specs (official PDFs) · flat_hp_pdf | https://api.starlink.com/public-files/specification_sheet_flat_high_performance.pdf | 200 | Pass |  |
| starlink | App Store id1537177988 | https://apps.apple.com/us/app/starlink/id1537177988 | 429 | Pass | App Store 429 rate-limit this run; official store listing (WebFetch confirmed sibling IDs) |
| starlink | Play com.starlink.mobile | https://play.google.com/store/apps/details?id=com.starlink.mobile | 200 | Pass |  |
| Starlink | Starlink hardware specs (official PDFs) · flat_hp_accessories_pdf | https://starlink.com/public-files/accessories_guide_flat_high_performance.pdf | 200 | Pass |  |
| Starlink | Starlink hardware specs (official PDFs) · flat_hp_install_pdf | https://starlink.com/public-files/installation_guide_flat_high_performance_kit.pdf | 200 | Pass |  |
| Starlink | Starlink hardware specs (official PDFs) · mini_pdf | https://starlink.com/public-files/specification_sheet_mini.pdf | 200 | Pass |  |
| Starlink | Starlink plans (Residential vs Roam) · roam_alt | https://starlink.com/sl/roam | 200 | Pass |  |
| starlink | official mounts/cables | https://www.starlink.com/accessories | 200 | Pass | final https://starlink.com/accessories |
| starlink | bypass mode | https://www.starlink.com/bypass-mode | 200 | Pass | final https://starlink.com/bypass-mode |
| Starlink | Starlink support · map | https://www.starlink.com/map | 200 | Pass | final https://starlink.com/map |
| starlink | Residential | https://www.starlink.com/residential | 200 | Pass | final https://starlink.com/residential |
| starlink | Roam | https://www.starlink.com/roam | 200 | Pass | final https://starlink.com/roam |
| starlink | service-plans | https://www.starlink.com/service-plans | 200 | Pass | final https://starlink.com/service-plans |
| Starlink | Starlink accessories & shop · shop | https://www.starlink.com/shop | 200 | Pass | final https://starlink.com/shop |
| starlink | specifications | https://www.starlink.com/specifications | 200 | Pass | final https://starlink.com/specifications/4 |
| starlink | starlink.com/support | https://www.starlink.com/support | 200 | Pass | final https://starlink.com/support |
| Starlink | Starlink support · updates | https://www.starlink.com/updates | 200 | Pass | final https://starlink.com/updates |
| surecall | App Store id6449509462 | https://apps.apple.com/us/app/surecall/id6449509462 | 429 | Pass | App Store 429 rate-limit this run; official store listing (WebFetch confirmed sibling IDs) |
| surecall | Play com.surecall.surecall | https://play.google.com/store/apps/details?id=com.surecall.surecall | 200 | Pass |  |
| SureCall | SureCall support & manuals · site | https://surecall.com/ | 200 | Pass |  |
| SureCall | SureCall support & manuals · vehicle | https://surecall.com/car-boosters/ | 200 | Pass | final https://surecall.com/vehicle-cell-signal-boosters/ |
| SureCall | SureCall RV / vehicle product lines · fusion2go_xr | https://surecall.com/car-boosters/fusion2go-xr/ | 200 | Pass |  |
| SureCall | SureCall RV / vehicle product lines · fusion2go_rv | https://surecall.com/rv-boosters/fusion2go-rv/ | 200 | Pass |  |
| surecall | surecall.com/rv-cell-phone-boosters | https://surecall.com/rv-cell-phone-boosters/ | 200 | Pass |  |
| SureCall | SureCall RV / vehicle product lines · fusion2go_xr_rv | https://surecall.com/rv-cell-phone-boosters/fusion2go-xr-rv-cell-phone-signal-booster/ | 200 | Pass |  |
| SureCall | SureCall RV / vehicle product lines · fusion2go_ultra | https://surecall.com/signal-booster-for-trucks/fusion2go-ultra/ | 200 | Pass |  |
| surecall | surecall.com/support | https://surecall.com/support/ | 200 | Pass |  |
| surecall | surecall.com/user-manuals | https://surecall.com/user-manuals/ | 200 | Pass |  |
| SureCall | SureCall RV / vehicle product lines · vehicle_category | https://surecall.com/vehicle-cell-signal-boosters/ | 200 | Pass |  |
| Taoglas | Taoglas cellular antennas · site | https://www.taoglas.com/ | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| Taoglas | Taoglas cellular antennas · cellular_external | https://www.taoglas.com/product-category/external-antennas/cellular-external-antennas/ | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| Taoglas | Taoglas cellular antennas · support | https://www.taoglas.com/support/ | 403 | Pass | datacenter 403 / bot-wall; official manufacturer or registry host |
| teltonika | rms.teltonika-networks.com | https://rms.teltonika-networks.com/ | 200 | Pass |  |
| Teltonika | Teltonika firmware wiki downloads · site | https://teltonika-networks.com/ | 200 | Pass | final https://www.teltonika-networks.com/ |
| teltonika | wiki.teltonika-networks.com | https://wiki.teltonika-networks.com/ | 200 | Pass | final https://wiki.teltonika-networks.com/view/Main_Page |
| teltonika | wiki … /Downloads | https://wiki.teltonika-networks.com/view/Downloads | 200 | Pass |  |
| teltonika | teltonika-networks.com | https://www.teltonika-networks.com/ | 200 | Pass |  |
| troubleshoot | Forum | https://forum.peplink.com/ | 200 | Pass |  |
| troubleshoot | InControl | https://incontrol.peplink.com/ | 200 | Pass | final https://incontrol2.peplink.com:443/ |
| Tycon | Tycon PoE / power · tyconpower | https://tyconpower.com/ | 000 | Pass | TLS handshake failed from this client; WebFetch: official Tycon Power catalog |
| Tycon | Tycon PoE / power · products | https://tyconpower.com/products/ | 000 | Pass | TLS handshake failed from this client; WebFetch: official Tycon Power catalog |
| Tycon | Tycon PoE / power · site | https://www.tyconsystems.com/ | 200 | Pass |  |
| victron | iOS id791585341 | https://apps.apple.com/us/app/victron-toolkit/id791585341 | 429 | Pass | App Store 429 rate-limit this run; official store listing (WebFetch confirmed sibling IDs) |
| victron | App Store | https://apps.apple.com/us/app/victronconnect/id943840744 | 429 | Pass | App Store 429 rate-limit this run; official store listing (WebFetch confirmed sibling IDs) |
| victron | iOS id658834560 | https://apps.apple.com/us/app/vrm-victron-remote-management/id658834560 | 429 | Pass | App Store 429 rate-limit this run; official store listing (WebFetch confirmed sibling IDs) |
| victron | Community | https://community.victronenergy.com/ | 200 | Pass |  |
| victron | victronenergy/venus on GitHub | https://github.com/victronenergy/venus | 200 | Pass |  |
| victron | Google Play | https://play.google.com/store/apps/details?id=com.victronenergy.victronconnect | 200 | Pass |  |
| victron | Android nl.victronenergy | https://play.google.com/store/apps/details?id=nl.victronenergy | 200 | Pass |  |
| victron | Android nl.victronenergy.victronledapp | https://play.google.com/store/apps/details?id=nl.victronenergy.victronledapp | 200 | Pass |  |
| victron | Professional firmware | https://professional.victronenergy.com/downloads/firmware/ | 200 | Pass | official Professional portal (login/Dropbox gate for some files) |
| victron | Venus release images feed | https://updates.victronenergy.com/feeds/venus/release/images/ | 200 | Pass |  |
| victron | VRM portal | https://vrm.victronenergy.com/ | 200 | Pass |  |
| Victron | MK3-USB (VE.Bus interface) · product | https://www.victronenergy.com/accessories/interface-mk3-usb | 200 | Pass |  |
| Victron | SmartShunt / battery monitors · family | https://www.victronenergy.com/battery-monitors | 200 | Pass |  |
| Victron | SmartShunt / battery monitors · smartshunt | https://www.victronenergy.com/battery-monitors/smart-battery-shunt | 200 | Pass |  |
| Victron | Orion-class DC-DC (e.g. Orion-Tr Smart) · family | https://www.victronenergy.com/dc-dc-converters | 200 | Pass |  |
| Victron | Orion-class DC-DC (e.g. Orion-Tr Smart) · orion_tr_smart | https://www.victronenergy.com/dc-dc-converters/orion-tr-smart | 200 | Pass |  |
| Victron | Lynx DC distribution · family | https://www.victronenergy.com/dc-distribution-systems | 200 | Pass |  |
| Victron | Lynx DC distribution · lynx_distributor | https://www.victronenergy.com/dc-distribution-systems/lynx-distributor | 200 | Pass |  |
| Victron | MultiPlus / MultiPlus-II · family | https://www.victronenergy.com/inverters-chargers | 200 | Pass |  |
| Victron | MultiPlus / MultiPlus-II · multiplus_ii | https://www.victronenergy.com/inverters-chargers/multiplus-ii | 200 | Pass |  |
| Victron | Quattro inverter-chargers · product | https://www.victronenergy.com/inverters-chargers/quattro | 200 | Pass |  |
| victron | Assistants | https://www.victronenergy.com/live/assistants:start | 200 | Pass |  |
| Victron | Battery compatibility (LiFePO4) · compatibility | https://www.victronenergy.com/live/battery_compatibility:start | 200 | Pass |  |
| Victron | Battery compatibility (LiFePO4) · victron_lithium | https://www.victronenergy.com/live/battery_compatibility:victron_lithium_batteries | 200 | Pass |  |
| victron | VE Power Setup | https://www.victronenergy.com/live/ccgx:ccgx_ve_power_setup | 200 | Pass |  |
| victron | Firmware updating | https://www.victronenergy.com/live/ccgx:firmware_updating | 200 | Pass |  |
| victron | Venus / GX docs | https://www.victronenergy.com/live/ccgx:start | 200 | Pass |  |
| victron | Live wiki | https://www.victronenergy.com/live/start | 200 | Pass |  |
| Victron | MultiPlus / MultiPlus-II · ve_bus | https://www.victronenergy.com/live/ve.bus:start | 200 | Pass |  |
| victron | VEConfigure live docs | https://www.victronenergy.com/live/ve.bus:veconfigure_manual | 200 | Pass |  |
| Victron | Lynx DC distribution · ve_can | https://www.victronenergy.com/live/ve.can:start | 200 | Pass |  |
| Victron | Cerbo GX / GX devices · venus_os | https://www.victronenergy.com/live/venus-os:start | 200 | Pass |  |
| victron | VictronConnect docs | https://www.victronenergy.com/live/victronconnect:start | 200 | Pass |  |
| victron | VRM docs | https://www.victronenergy.com/live/vrm_portal:start | 200 | Pass |  |
| victron | Cerbo GX firmware updates manual | https://www.victronenergy.com/media/pg/Cerbo_GX/en/firmware-updates.html | 200 | Pass |  |
| victron | VEConfigure manual | https://www.victronenergy.com/media/pg/VEConfigure_Manual/en/index-en.html | 200 | Pass |  |
| Victron | Cerbo GX / GX devices · product | https://www.victronenergy.com/panel-systems-remote-monitoring/cerbo-gx | 200 | Pass | final https://www.victronenergy.com/communication-centres/cerbo-gx |
| Victron | SmartSolar / BlueSolar MPPT · family | https://www.victronenergy.com/solar-charge-controllers | 200 | Pass |  |
| victron | Manuals | https://www.victronenergy.com/support-and-downloads/manuals | 200 | Pass |  |
| victron | victronenergy.com/support-and-downloads/software | https://www.victronenergy.com/support-and-downloads/software | 200 | Pass |  |
| victron | Technical information | https://www.victronenergy.com/support-and-downloads/technical-information | 200 | Pass |  |
| victron | Downloads | https://www.victronenergy.com/victronconnectapp/victronconnect/downloads | 200 | Pass |  |
| weboost | App Store id1611974453 | https://apps.apple.com/us/app/weboost/id1611974453 | 429 | Pass | App Store 429 rate-limit this run; official store listing (WebFetch confirmed sibling IDs) |
| weBoost | weBoost RV / vehicle product lines · install_guide_pdf | https://assets.wilsonelectronics.com/m/700bdbf86910493c/original/Drive-Reach-RV-Installation-Guide.pdf | 200 | Pass | final https://cdn.amplifi.pattern.com/233ee3b7-5241-4399-b668-8724309a2a47 |
| weboost | Play com.wilsonelectronics.weboost | https://play.google.com/store/apps/details?id=com.wilsonelectronics.weboost | 200 | Pass |  |
| weboost | support.weboost.com | https://support.weboost.com/ | 200 | Pass | final https://www.weboost.com/support |
| weboost | weboost.com | https://www.weboost.com/ | 200 | Pass |  |
| weboost | weboost.com/app | https://www.weboost.com/app | 200 | Pass |  |
| weboost | weboost.com/boosters/vehicle-rv | https://www.weboost.com/boosters/vehicle-rv | 200 | Pass |  |
| weBoost | weBoost antennas & accessories · antennas | https://www.weboost.com/collections/antennas | 200 | Pass | final https://www.weboost.com/accessories |
| weBoost | weBoost RV / vehicle product lines · destination_rv | https://www.weboost.com/products/destination-rv | 200 | Pass |  |
| weBoost | weBoost RV / vehicle product lines · drive_reach_overland | https://www.weboost.com/products/drive-reach-overland | 200 | Pass |  |
| weBoost | weBoost RV / vehicle product lines · drive_reach_rv | https://www.weboost.com/products/drive-reach-rv | 200 | Pass |  |
| weBoost | weBoost RV / vehicle product lines · rv20 | https://www.weboost.com/products/drive-reach-rv-2 | 200 | Pass |  |
| weBoost | weBoost RV / vehicle product lines · rv35 | https://www.weboost.com/products/weboost-rv-35 | 200 | Pass |  |
| weBoost | weBoost RV / vehicle product lines · rv50 | https://www.weboost.com/products/weboost-rv-50 | 200 | Pass |  |
| weboost | weboost.com/support | https://www.weboost.com/support | 200 | Pass |  |
| weboost | wilsonamplifiers.com/resources | https://www.wilsonamplifiers.com/resources/ | 200 | Pass |  |
| weBoost | weBoost support · parent | https://www.wilsonconnectivity.com/ | 200 | Pass |  |
| Wilson Amplifiers | Wilson Amplifiers antennas · site | https://www.wilsonamplifiers.com/ | 200 | Pass |  |
| Wilson Amplifiers | Wilson Amplifiers antennas · antennas | https://www.wilsonamplifiers.com/antennas/ | 200 | Pass |  |
| winegard | App Store id1563032659 | https://apps.apple.com/us/app/rv-halo/id1563032659 | 429 | Pass | App Store 429 rate-limit this run; official store listing (WebFetch confirmed sibling IDs) |
| winegard | Play com.winegard.halo | https://play.google.com/store/apps/details?id=com.winegard.halo | 200 | Pass |  |
| Winegard | Winegard RV Halo app · rvhalo_alias | https://rvhalo.com/ | 200 | Pass |  |
| Winegard | Winegard support · site | https://winegard.com/ | 200 | Pass |  |
| Winegard | Winegard support · connect | https://winegard.com/connect | 200 | Pass |  |
| winegard | winegard.com/connect-2-4g | https://winegard.com/connect-2-4g/ | 200 | Pass |  |
| winegard | winegard.com/connect-5g | https://winegard.com/connect-5g | 200 | Pass |  |
| Winegard | Winegard support · registration | https://winegard.com/product-registration | 200 | Pass |  |
| winegard | winegard.com/smart/rv-halo | https://winegard.com/smart/rv-halo | 200 | Pass |  |
| Winegard | Winegard RV Halo app · compatible_devices | https://winegard.com/smart/rv-halo/compatible-devices | 200 | Pass |  |
| winegard | winegard.com/support | https://winegard.com/support/ | 200 | Pass |  |
<!-- MATRIX_END -->
---

## What this PR did **not** do

- Did not merge old drafts #49 / #53 / #54 / #55 / #61 / #62 / #64.
- Did not retarget Book off Square.
- Did not invent Dometic App Store IDs — Power / Mobile Cooling / Climate IDs are official Dometic Group listings.
- Did not replace Parsec `/products/` or `/support/` (soft homepage — Matt).
- Did not revive Portal / Status / MAIN HUB / Prefer Text / book.*.
