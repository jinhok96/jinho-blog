"""bench.py 결과를 채점해 summary.json 생성.

사용: python score.py <이미지 폴더> <results 폴더>
지표 (모두 대소문자 무시, 따옴표·공백 정규화)
- cer: 문자 오류율 (jiwer). 줄 순서가 정답과 다르면 오류로 셈
- word_recall: 정답 단어(구두점 제거) 중 결과에 있는 비율, 순서 무시 (다중 집합)
- num_recall: 숫자가 들어간 정답 토큰(가격·날짜·전화번호) 중 결과에 그대로 있는 비율 (영수증용)
- 이미지별 처리 시간 중앙값(sec), 최대 메모리(GB, /usr/bin/time -v)
"""

import json
import re
import statistics
import sys
from collections import Counter
from pathlib import Path

import jiwer

img_dir, res_dir = Path(sys.argv[1]), Path(sys.argv[2])
truth = {t["file"]: t for t in json.loads((img_dir / "truth.json").read_text())}
CONDS = ["screenshot", "small", "scan", "photo", "receipt"]


def norm(t: str) -> str:
    t = t.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    t = t.replace("—", " - ").replace("–", "-")
    return re.sub(r"\s+", " ", t).strip().lower()


def words(t: str):
    return [w for w in (re.sub(r"[^\w*%/.:$()-]", "", x).strip(".,;:!?\"'()") for x in norm(t).split()) if w]


def recall(ref, hyp):
    rc, hc = Counter(ref), Counter(hyp)
    total = sum(rc.values())
    return sum(min(c, hc[w]) for w, c in rc.items()) / total if total else 1.0


summary = {}
for f in sorted(res_dir.glob("*.jsonl")):
    lines = [json.loads(x) for x in f.read_text().splitlines()]
    head, rows = lines[0], lines[1:]
    mem = None
    tf = f.with_suffix(".time")
    if tf.exists():
        m = re.search(r"Maximum resident set size \(kbytes\): (\d+)", tf.read_text())
        mem = round(int(m.group(1)) / 1024 / 1024, 2) if m else None
    per = {c: {"cer": [], "word_recall": [], "num_recall": [], "sec": []} for c in CONDS}
    detail = []
    for r in rows:
        ref, hyp = norm(truth[r["file"]]["text"]), norm(r["text"])
        cer = jiwer.cer(ref, hyp) if hyp else 1.0
        wr = recall(words(ref), words(hyp))
        nums_ref = [w for w in words(ref) if re.search(r"\d", w)]
        nr = recall(nums_ref, words(hyp)) if nums_ref else None
        d = per[r["cond"]]
        d["cer"].append(min(cer, 1.0))
        d["word_recall"].append(wr)
        if nr is not None:
            d["num_recall"].append(nr)
        d["sec"].append(r["sec"])
        detail.append({"file": r["file"], "cer": round(cer, 4), "word_recall": round(wr, 4),
                       "num_recall": None if nr is None else round(nr, 4), "sec": r["sec"]})
    out = {"load_s": head["load_s"], "max_rss_gb": mem, "by_cond": {}}
    all_cer, all_wr, all_sec = [], [], []
    for c in CONDS:
        d = per[c]
        out["by_cond"][c] = {
            "cer_mean": round(statistics.mean(d["cer"]), 4),
            "word_recall_mean": round(statistics.mean(d["word_recall"]), 4),
            "num_recall_mean": round(statistics.mean(d["num_recall"]), 4) if d["num_recall"] else None,
            "sec_median": round(statistics.median(d["sec"]), 3),
            "clean_images": sum(1 for x in d["cer"] if x <= 0.02),
        }
        all_cer += d["cer"]
        all_wr += d["word_recall"]
        all_sec += d["sec"]
    out["overall"] = {
        "cer_mean": round(statistics.mean(all_cer), 4),
        "word_recall_mean": round(statistics.mean(all_wr), 4),
        "sec_median": round(statistics.median(all_sec), 3),
        "clean_images": sum(1 for x in all_cer if x <= 0.02),
    }
    out["images"] = detail
    summary[head["engine"]] = out

(res_dir.parent / "summary.json").write_text(json.dumps(summary, indent=1))
print(f"{'engine':<16}{'CER':>7}{'words':>8}{'clean':>7}{'s/img':>7}{'RAM':>6}  " + " ".join(f"{c[:6]:>14}" for c in CONDS))
for e, o in summary.items():
    cells = " ".join(f"{o['by_cond'][c]['cer_mean']*100:6.1f}%/{o['by_cond'][c]['clean_images']:>2}c" + "   " for c in CONDS)
    print(f"{e:<16}{o['overall']['cer_mean']*100:6.1f}%{o['overall']['word_recall_mean']*100:7.1f}%"
          f"{o['overall']['clean_images']:>7}{o['overall']['sec_median']:7.2f}{o['max_rss_gb'] or 0:6.2f}  {cells}")
