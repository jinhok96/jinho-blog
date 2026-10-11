"""Check every transformed file with c2patool (CLI) and c2pa-python (SDK).

Usage: python -I check.py <c2patool> <trust_anchors.pem> <store.cfg> <out_json> <dir> [<dir> ...]

Both checkers are configured to trust the C2PA *test* root (sample/trust_anchors.pem),
which plays the role a real checker's trust list plays for real signers.
"""
import json
import subprocess
import sys
from pathlib import Path

import c2pa

tool, anchors, store_cfg, out_json = sys.argv[1:5]
dirs = [Path(d) for d in sys.argv[5:]]

MIME = {".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}
anchors_pem = Path(anchors).read_text()
trust_cfg = Path(store_cfg).read_text()
ctx = c2pa.Context.from_dict(
    {"verify": {"verify_trust": True}, "trust": {"trust_anchors": anchors_pem, "trust_config": trust_cfg}}
)


def summarize(store: dict) -> dict:
    active = store.get("active_manifest")
    m = store.get("manifests", {}).get(active, {})
    dst = []
    for a in m.get("assertions", []):
        if a.get("label", "").startswith("c2pa.actions"):
            for act in a["data"].get("actions", []):
                if act.get("digitalSourceType"):
                    dst.append(act["digitalSourceType"].rsplit("/", 1)[-1])
    ingr = [
        {
            "title": i.get("title"),
            "relationship": i.get("relationship"),
            "ingredient_validation": (i.get("validation_results") or {}).get("activeManifest", {}).get("failure", []),
        }
        for i in m.get("ingredients", [])
    ]
    all_dst = sorted(
        {
            act["digitalSourceType"].rsplit("/", 1)[-1]
            for mm in store.get("manifests", {}).values()
            for a in mm.get("assertions", [])
            if a.get("label", "").startswith("c2pa.actions")
            for act in a["data"].get("actions", [])
            if act.get("digitalSourceType")
        }
    )
    failures = [s["code"] for s in (store.get("validation_results") or {}).get("activeManifest", {}).get("failure", [])]
    if not failures:
        failures = [s["code"] for s in store.get("validation_status", []) or []]
    return {
        "manifest_count": len(store.get("manifests", {})),
        "validation_state": store.get("validation_state"),
        "failure_codes": failures,
        "digital_source_type": dst,
        "digital_source_type_any_manifest": all_dst,
        "issuer": (m.get("signature_info") or {}).get("issuer"),
        "ingredients": ingr,
    }


rows = []
for d in dirs:
    for f in sorted(d.iterdir()):
        if f.suffix not in MIME or f.name.startswith("_"):
            continue
        row = {"file": str(f.relative_to(f.parents[2])), "bytes": f.stat().st_size}
        # c2patool
        p = subprocess.run(
            [tool, str(f), "trust", "--trust_anchors", anchors, "--trust_config", store_cfg],
            capture_output=True,
            text=True,
            cwd="/tmp",
        )
        if p.returncode == 0 and p.stdout.strip().startswith("{"):
            row["c2patool"] = summarize(json.loads(p.stdout))
        else:
            row["c2patool"] = {"error": (p.stderr or p.stdout).strip().splitlines()[:1]}
        # c2pa-python
        try:
            with open(f, "rb") as fh:
                r = c2pa.Reader(MIME[f.suffix], fh, context=ctx)
                row["c2pa_python"] = summarize(json.loads(r.json()))
        except c2pa.C2paError as e:
            row["c2pa_python"] = {"error": f"{type(e).__name__}: {e}"}
        rows.append(row)

Path(out_json).write_text(json.dumps(rows, indent=2))
for r in rows:
    a, b = r["c2patool"], r["c2pa_python"]
    fmt = lambda x: x.get("error") or f'{x["validation_state"]} manifests={x["manifest_count"]} fail={x["failure_codes"]} dst={x["digital_source_type"]} dst_any={x["digital_source_type_any_manifest"]} ingr={x["ingredients"]}'
    print(f'{r["file"]}\n  c2patool:    {fmt(a)}\n  c2pa-python: {fmt(b)}')
