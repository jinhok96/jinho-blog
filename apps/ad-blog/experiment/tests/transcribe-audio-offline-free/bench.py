"""Transcribe pre-segmented audio with one model; report load time, decode time, RTF, peak RSS."""
import sys, os, json, time, resource, numpy as np, soundfile as sf, sherpa_onnx

M = sys.argv[1]  # model key
wav, segs_path, out_txt = sys.argv[2], sys.argv[3], sys.argv[4]
threads = int(os.environ.get("THREADS", "4"))
D = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")

def whisper(d, p):
    return sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=f"{D}/{d}/{p}-encoder.int8.onnx", decoder=f"{D}/{d}/{p}-decoder.int8.onnx",
        tokens=f"{D}/{d}/{p}-tokens.txt", language="en", num_threads=threads)

def moonshine(d):
    return sherpa_onnx.OfflineRecognizer.from_moonshine(
        preprocessor=f"{D}/{d}/preprocess.onnx", encoder=f"{D}/{d}/encode.int8.onnx",
        uncached_decoder=f"{D}/{d}/uncached_decode.int8.onnx", cached_decoder=f"{D}/{d}/cached_decode.int8.onnx",
        tokens=f"{D}/{d}/tokens.txt", num_threads=threads)

def parakeet(d):
    return sherpa_onnx.OfflineRecognizer.from_transducer(
        encoder=f"{D}/{d}/encoder.int8.onnx", decoder=f"{D}/{d}/decoder.int8.onnx", joiner=f"{D}/{d}/joiner.int8.onnx",
        tokens=f"{D}/{d}/tokens.txt", model_type="nemo_transducer", num_threads=threads)

MODELS = {
    "whisper-tiny.en": lambda: whisper("sherpa-onnx-whisper-tiny.en", "tiny.en"),
    "whisper-base.en": lambda: whisper("sherpa-onnx-whisper-base.en", "base.en"),
    "whisper-small.en": lambda: whisper("sherpa-onnx-whisper-small.en", "small.en"),
    "whisper-turbo": lambda: whisper("sherpa-onnx-whisper-turbo", "turbo"),
    "moonshine-tiny": lambda: moonshine("sherpa-onnx-moonshine-tiny-en-int8"),
    "moonshine-base": lambda: moonshine("sherpa-onnx-moonshine-base-en-int8"),
    "parakeet-v2": lambda: parakeet("sherpa-onnx-nemo-parakeet-tdt-0.6b-v2-int8"),
    "parakeet-v3": lambda: parakeet("sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8"),
}

audio, sr = sf.read(wav, dtype="float32")
segs = json.load(open(segs_path)) if segs_path != "-" else [[0, len(audio)]]
t0 = time.perf_counter()
rec = MODELS[M]()
load_s = time.perf_counter() - t0
texts = []
t1 = time.perf_counter()
for s, e in segs:
    st = rec.create_stream()
    st.accept_waveform(sr, audio[s:e])
    rec.decode_stream(st)
    texts.append(st.result.text.strip())
dec_s = time.perf_counter() - t1
open(out_txt, "w").write("\n".join(texts) + "\n")
dur = len(audio) / sr
rss_mb = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024
print(json.dumps({"model": M, "threads": threads, "audio_s": round(dur, 1), "load_s": round(load_s, 2),
                  "decode_s": round(dec_s, 1), "rtf": round(dec_s / dur, 4), "peak_rss_mb": round(rss_mb)}))
