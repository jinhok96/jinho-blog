"""Combine timing reruns (median of 3 passes at 4 threads, 1 pass at 1 thread), WER and UTMOS into summary.json.

Usage: python summarize.py <work_root> <first_pass_out_dir>
"""
import json, statistics, sys
W, OUT = sys.argv[1], sys.argv[2]
KEYS = ["piper-lessac-low", "piper-lessac-medium", "piper-lessac-high", "piper-amy-medium", "piper-ryan-high",
        "kokoro-v0_19-af", "kokoro-v1_0-af_heart", "kitten-nano-v0_8-int8", "kitten-mini-v0_8",
        "supertonic-3-int8", "matcha-ljspeech"]
rows = []
for k in KEYS:
    t4 = [json.load(open(f"{W}/rerun{r}/{k}/timing-t4.json")) for r in (1, 2, 3)]
    t1 = json.load(open(f"{W}/t1/{k}/timing-t1.json"))
    asr = json.load(open(f"{OUT}/{k}/asr.json")); mos = json.load(open(f"{OUT}/{k}/utmos.json"))
    rows.append(dict(model=k, rtf_t4_median=statistics.median(x["rtf"] for x in t4), rtf_t4_runs=[x["rtf"] for x in t4],
                     rtf_t1=t1["rtf"], audio_sec=t4[0]["audio_sec"], load_sec_median=statistics.median(x["load_sec"] for x in t4),
                     max_rss_mb_t4=max(x["max_rss_mb"] for x in t4), model_file_mb=t4[0]["model_file_mb"],
                     sample_rate=t4[0]["sample_rate"], wer_harvard=asr["harvard"], wer_tricky=asr["tricky"],
                     utmos_mean=mos["utmos_mean"], utmos_min=mos["utmos_min"]))
json.dump(rows, open(f"{W}/summary.json", "w"), indent=1)
print(f"{'model':24s} rtf4  rtf1  x-realtime4  load  rssMB  fileMB  WER_h  utmos(min)")
for r in rows:
    print(f"{r['model']:24s} {r['rtf_t4_median']:.3f} {r['rtf_t1']:.3f} {1/r['rtf_t4_median']:6.1f}x  {r['load_sec_median']:.2f} {r['max_rss_mb_t4']:6.0f} {r['model_file_mb']} {r['wer_harvard']['wer']:5.2f} {r['utmos_mean']:.2f} ({r['utmos_min']:.2f})")
