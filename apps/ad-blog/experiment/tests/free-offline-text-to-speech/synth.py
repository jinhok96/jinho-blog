"""Synthesize the test sentences with one sherpa-onnx TTS model and time it.

Usage: python synth.py <model_key> <models_dir> <out_dir> <num_threads>
Model archives: https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/<dir>.tar.bz2
(Matcha also needs vocoder-models/vocos-22khz-univ.onnx)
"""
import json, os, resource, sys, time
import sherpa_onnx, soundfile as sf
sys.path.insert(0, os.path.dirname(__file__))
from sentences import HARVARD, TRICKY

key, M, OUT, THREADS = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])

def piper(d):
    return dict(model_file=f"{M}/{d}/{d.replace('vits-piper-','')}.onnx",
                cfg=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=f"{M}/{d}/{d.replace('vits-piper-','')}.onnx", tokens=f"{M}/{d}/tokens.txt",
                    data_dir=f"{M}/{d}/espeak-ng-data")), sid=0)

def kokoro(d, sid, lexicon=""):
    return dict(model_file=f"{M}/{d}/model.onnx",
                cfg=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
                    model=f"{M}/{d}/model.onnx", voices=f"{M}/{d}/voices.bin", tokens=f"{M}/{d}/tokens.txt",
                    data_dir=f"{M}/{d}/espeak-ng-data", lexicon=lexicon)), sid=sid)

def kitten(d, f):
    return dict(model_file=f"{M}/{d}/{f}",
                cfg=sherpa_onnx.OfflineTtsModelConfig(kitten=sherpa_onnx.OfflineTtsKittenModelConfig(
                    model=f"{M}/{d}/{f}", voices=f"{M}/{d}/voices.bin", tokens=f"{M}/{d}/tokens.txt",
                    data_dir=f"{M}/{d}/espeak-ng-data")), sid=0)

ST = "sherpa-onnx-supertonic-3-tts-int8-2026-05-11"
MODELS = {
    "piper-lessac-low": lambda: piper("vits-piper-en_US-lessac-low"),
    "piper-lessac-medium": lambda: piper("vits-piper-en_US-lessac-medium"),
    "piper-lessac-high": lambda: piper("vits-piper-en_US-lessac-high"),
    "piper-amy-medium": lambda: piper("vits-piper-en_US-amy-medium"),
    "piper-ryan-high": lambda: piper("vits-piper-en_US-ryan-high"),
    "kokoro-v0_19-af": lambda: kokoro("kokoro-en-v0_19", 0),
    "kokoro-v1_0-af_heart": lambda: kokoro("kokoro-multi-lang-v1_0", 3,
        f"{M}/kokoro-multi-lang-v1_0/lexicon-us-en.txt"),
    "kitten-nano-v0_8-int8": lambda: kitten("kitten-nano-en-v0_8-int8", "model.int8.onnx"),
    "kitten-mini-v0_8": lambda: kitten("kitten-mini-en-v0_8", "model.onnx"),
    "matcha-ljspeech": lambda: dict(model_file=f"{M}/matcha-icefall-en_US-ljspeech/model-steps-3.onnx",
        cfg=sherpa_onnx.OfflineTtsModelConfig(matcha=sherpa_onnx.OfflineTtsMatchaModelConfig(
            acoustic_model=f"{M}/matcha-icefall-en_US-ljspeech/model-steps-3.onnx",
            vocoder=f"{M}/vocos-22khz-univ.onnx", tokens=f"{M}/matcha-icefall-en_US-ljspeech/tokens.txt",
            data_dir=f"{M}/matcha-icefall-en_US-ljspeech/espeak-ng-data")), sid=0),
    "supertonic-3-int8": lambda: dict(model_file=None,
        cfg=sherpa_onnx.OfflineTtsModelConfig(supertonic=sherpa_onnx.OfflineTtsSupertonicModelConfig(
            duration_predictor=f"{M}/{ST}/duration_predictor.int8.onnx", text_encoder=f"{M}/{ST}/text_encoder.int8.onnx",
            vector_estimator=f"{M}/{ST}/vector_estimator.int8.onnx", vocoder=f"{M}/{ST}/vocoder.int8.onnx",
            tts_json=f"{M}/{ST}/tts.json", unicode_indexer=f"{M}/{ST}/unicode_indexer.bin",
            voice_style=f"{M}/{ST}/voice.bin")), sid=0, supertonic=True),
}

spec = MODELS[key]()
spec["cfg"].num_threads = THREADS
spec["cfg"].provider = "cpu"
cfg = sherpa_onnx.OfflineTtsConfig(model=spec["cfg"], max_num_sentences=1)
assert cfg.validate(), key

def gen(tts, text):
    if spec.get("supertonic"):
        g = sherpa_onnx.GenerationConfig(); g.sid = 0; g.num_steps = 8; g.speed = 1.0; g.extra["lang"] = "en"
        return tts.generate(text, g)
    return tts.generate(text, sid=spec["sid"], speed=1.0)

t0 = time.perf_counter(); tts = sherpa_onnx.OfflineTts(cfg); load = time.perf_counter() - t0
gen(tts, "This is a warm up sentence.")
os.makedirs(f"{OUT}/{key}", exist_ok=True)
rows, tot_t, tot_d = [], 0.0, 0.0
for i, text in enumerate(HARVARD + TRICKY):
    t0 = time.perf_counter(); a = gen(tts, text); dt = time.perf_counter() - t0
    dur = len(a.samples) / a.sample_rate
    sf.write(f"{OUT}/{key}/{i:02d}.wav", a.samples, a.sample_rate)
    rows.append(dict(i=i, text=text, sec=round(dt, 4), audio_sec=round(dur, 3)))
    tot_t += dt; tot_d += dur
res = dict(model=key, threads=THREADS, sherpa_onnx=sherpa_onnx.__version__, load_sec=round(load, 3),
           synth_sec=round(tot_t, 3), audio_sec=round(tot_d, 3), rtf=round(tot_t / tot_d, 4),
           sample_rate=a.sample_rate, max_rss_mb=round(resource.getrusage(resource.RUSAGE_SELF).ru_maxrss / 1024, 1),
           model_file_mb=round(os.path.getsize(spec["model_file"]) / 1e6, 1) if spec["model_file"] else None,
           rows=rows)
json.dump(res, open(f"{OUT}/{key}/timing-t{THREADS}.json", "w"), indent=1)
print(key, THREADS, "load", res["load_sec"], "rtf", res["rtf"], "rss", res["max_rss_mb"])
