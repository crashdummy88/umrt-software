# Mirrors

Only **open-source** artifacts with redistribution rights go here.

## Add a release
1. Confirm license allows redistribution (MIT, Apache-2.0, BSD, GPL with compliance, etc.).
2. Download from upstream release tag (not a random fork commit).
3. Record in `catalog/index.json`: `policy: "mirror"`, `license`, `version`, `sha256`, `upstream`.
4. Store the file under `mirrors/<id>/<version>/` and keep the upstream URL in the catalog.
5. Never place Victron/Peplink/weBoost/Starlink/Dometic **proprietary** firmware here — link out only.
