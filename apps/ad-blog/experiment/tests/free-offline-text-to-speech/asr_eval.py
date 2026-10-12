"""Intelligibility check: transcribe synthesized clips with Parakeet TDT 0.6B v2 and compute WER.

Usage: python asr_eval.py <models_dir> <out_dir> <model_key>...
ASR model: asr-models/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8.tar.bz2
"""
import json, os, sys
import jiwer, sherpa_onnx, soundfile as sf
from whisper_normalizer.english import EnglishTextNormalizer
sys.path.insert(0, os.path.dirname(__file__))
from sentences import HARVARD, TRICKY

M, OUT, keys = sys.argv[1], sys.argv[2], sys.argv[3:]
d = f"{M}/sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8"
rec = sherpa_onnx.OfflineRecognizer.from_transducer(
    encoder=f"{d}/encoder.int8.onnx", decoder=f"{d}/decoder.int8.onnx", joiner=f"{d}/joiner.int8.onnx",
    tokens=f"{d}/tokens.txt", model_type="nemo_transducer", num_threads=4)
norm = EnglishTextNormalizer()

def transcribe(path):
    a, sr = sf.read(path, dtype="float32")
    s = rec.create_stream(); s.accept_waveform(sr, a); rec.decode_stream(s)
    return s.result.text.strip()

for key in keys:
    hyps = [transcribe(f"{OUT}/{key}/{i:02d}.wav") for i in range(len(HARVARD) + len(TRICKY))]
    def wer(refs, hs):
        o = jiwer.process_words([norm(r) for r in refs], [norm(h) for h in hs])
        return dict(wer=round(o.wer * 100, 2), sub=o.substitutions, dele=o.deletions, ins=o.insertions)
    res = dict(model=key, harvard=wer(HARVARD, hyps[:30]), tricky=wer(TRICKY, hyps[30:]),
               transcripts=[dict(ref=r, hyp=h) for r, h in zip(HARVARD + TRICKY, hyps)])
    json.dump(res, open(f"{OUT}/{key}/asr.json", "w"), indent=1)
    print(key, "harvard WER", res["harvard"]["wer"], "tricky WER", res["tricky"]["wer"])
