"""Second opinion on the number/date sentences with Whisper small.en (sherpa-onnx-whisper-small.en)."""
import json, os, sys
import sherpa_onnx, soundfile as sf
sys.path.insert(0, os.path.dirname(__file__))
from sentences import HARVARD, TRICKY
M, OUT, keys = sys.argv[1], sys.argv[2], sys.argv[3:]
d = f"{M}/sherpa-onnx-whisper-small.en"
rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=f"{d}/small.en-encoder.int8.onnx",
    decoder=f"{d}/small.en-decoder.int8.onnx", tokens=f"{d}/small.en-tokens.txt", num_threads=4)
for key in keys:
    out = []
    for j, ref in enumerate(TRICKY):
        a, sr = sf.read(f"{OUT}/{key}/{30 + j:02d}.wav", dtype="float32")
        s = rec.create_stream(); s.accept_waveform(sr, a); rec.decode_stream(s)
        out.append(dict(ref=ref, hyp=s.result.text.strip()))
    json.dump(out, open(f"{OUT}/{key}/asr-whisper-small-tricky.json", "w"), indent=1)
    print(key, "done")
