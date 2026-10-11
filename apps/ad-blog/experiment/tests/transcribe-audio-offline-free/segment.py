"""Split a 16 kHz WAV into speech segments (<= 20 s) with Silero VAD; save sample offsets."""
import sys, json, numpy as np, soundfile as sf, sherpa_onnx
wav, vad_model, out = sys.argv[1], sys.argv[2], sys.argv[3]
audio, sr = sf.read(wav, dtype="float32")
assert sr == 16000
cfg = sherpa_onnx.VadModelConfig()
cfg.silero_vad.model = vad_model
cfg.silero_vad.min_silence_duration = 0.4
cfg.silero_vad.min_speech_duration = 0.25
cfg.silero_vad.max_speech_duration = 20
cfg.sample_rate = 16000
vad = sherpa_onnx.VoiceActivityDetector(cfg, buffer_size_in_seconds=120)
win = cfg.silero_vad.window_size
segs = []
for i in range(0, len(audio), win):
    vad.accept_waveform(audio[i:i + win])
    while not vad.empty():
        s = vad.front
        segs.append([s.start, s.start + len(s.samples)])
        vad.pop()
vad.flush()
while not vad.empty():
    s = vad.front
    segs.append([s.start, s.start + len(s.samples)])
    vad.pop()
json.dump(segs, open(out, "w"))
speech = sum(e - s for s, e in segs) / sr
print(len(segs), "segments,", round(speech, 1), "s speech of", round(len(audio) / sr, 1), "s; max",
      round(max(e - s for s, e in segs) / sr, 1), "s")
