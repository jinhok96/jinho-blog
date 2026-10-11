#!/usr/bin/env bash
# Reproduce the ToolProof C2PA strip test (run 2026-10-11). Downloads live in ../downloads (untrusted data).
set -euo pipefail
W="${W:?set W to a work dir that contains scripts/ (this folder) and downloads/}"
PY="$W/venv/bin/python -I"
T=$W/downloads/c2patool/c2patool/c2patool          # c2patool 0.27.22 (GitHub release c2patool-v0.27.22, x86_64-unknown-linux-gnu)
S=$W/downloads/c2patool/c2patool/sample             # c2patool sample TEST certs / test trust anchors
PW=$W/../tools/node_modules/playwright-core         # playwright-core 1.56.0
CH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome  # Chromium 141.0.7390.37

# setup (once): python3 -m venv $W/venv && $W/venv/bin/pip install c2pa-python pillow   -> c2pa-python 0.38.0 (SDK 0.91.0), Pillow 12.3.0
# fixture: curl -sSL -o $W/downloads/fixtures/C.jpg https://raw.githubusercontent.com/contentauth/c2pa-rs/main/sdk/tests/fixtures/C.jpg  (main @ 58b9a092)

# 1. own source image, signed with TEST certificate, digitalSourceType=trainedAlgorithmicMedia
$PY $W/scripts/make_source.py $S/es256_certs.pem $S/es256_private.key $W/out/own

# 2. everyday edits (Pillow, ImageMagick 6.9.12-98, byte-level edits)
$PY $W/scripts/transforms.py $W/out/own/source_signed.jpg $W/out/own/t
$PY $W/scripts/transforms.py $W/downloads/fixtures/C.jpg   $W/out/fixtureC/t

# 3. screenshot in headless Chromium (file:// page, element screenshot, PNG, DPR 1)
for s in own fixtureC; do
  node $W/scripts/screenshot.js $PW $CH $W/out/$s/t/t00_original.jpg $W/out/$s/t/t10_chromium_screenshot.png
done

# 4. C2PA-aware edit: re-sign the 50% resize with the original as parent ingredient
for s in own fixtureC; do
  (cd /tmp && $T $W/out/$s/t/t02_resize50.jpg -m $W/scripts/edit_manifest.json -p $W/out/$s/t/t00_original.jpg \
     -o $W/out/$s/t/t11_resize50_c2pa_aware.jpg -f trust --trust_anchors $S/trust_anchors.pem --trust_config $S/store.cfg >/dev/null)
done

# 5. check every file with c2patool and c2pa-python (both trusting the C2PA TEST root only)
$PY $W/scripts/check.py $T $S/trust_anchors.pem $S/store.cfg $W/out/results.json $W/out/own/t $W/out/fixtureC/t > $W/out/results.txt
$PY $W/scripts/segments.py $W/out/own/t/t00_original.jpg $W/out/own/t/t07b_im_resave_q85.jpg $W/out/own/t/t07_im_strip.jpg $W/out/own/t/t08_exif_removed_only.jpg $W/out/own/t/t01_resave_q85.jpg > $W/out/segments.txt
