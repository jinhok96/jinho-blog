"""Decode earnings21 call to 16 kHz mono WAV and build reference text."""
import sys, csv, numpy as np, av, soundfile as sf
root, file_id, out = sys.argv[1], sys.argv[2], sys.argv[3]
c = av.open(f"{root}/media/{file_id}.mp3")
r = av.AudioResampler(format="flt", layout="mono", rate=16000)
chunks = []
for frame in c.decode(audio=0):
    for f in r.resample(frame):
        chunks.append(f.to_ndarray().reshape(-1))
for f in r.resample(None):
    chunks.append(f.to_ndarray().reshape(-1))
audio = np.concatenate(chunks)
sf.write(f"{out}/{file_id}.wav", audio, 16000, subtype="PCM_16")
words = []
with open(f"{root}/transcripts/nlp_references/{file_id}.nlp") as fh:
    for row in csv.DictReader(fh, delimiter="|"):
        words.append(row["token"] + (row["punctuation"] or ""))
open(f"{out}/{file_id}.ref.txt", "w").write(" ".join(words) + "\n")
print(file_id, round(len(audio) / 16000, 1), "s", len(words), "words")
