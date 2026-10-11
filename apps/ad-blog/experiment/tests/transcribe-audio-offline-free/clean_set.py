"""Concatenate clean clips into one 16 kHz file with 0.5 s gaps; segments = clip boundaries; build reference."""
import sys, json, numpy as np, soundfile as sf
from math import gcd
refs = {
 "0": "AFTER EARLY NIGHTFALL THE YELLOW LAMPS WOULD LIGHT UP HERE AND THERE THE SQUALID QUARTER OF THE BROTHELS",
 "1": "GOD AS A DIRECT CONSEQUENCE OF THE SIN WHICH MAN THUS PUNISHED HAD GIVEN HER A LOVELY CHILD WHOSE PLACE WAS ON THAT SAME DISHONOURED BOSOM TO CONNECT HER PARENT FOR EVER WITH THE RACE AND DESCENT OF MORTALS AND TO BE FINALLY A BLESSED SOUL IN HEAVEN",
 "8k": "YET THESE THOUGHTS AFFECTED HESTER PRYNNE LESS WITH HOPE THAN APPREHENSION",
 "jfk": "And so my fellow Americans, ask not what your country can do for you, ask what you can do for your country.",
}
d, out = sys.argv[1], sys.argv[2]
parts, segs, pos = [], [], 0
gap = np.zeros(8000, dtype=np.float32)
for k in refs:
    a, sr = sf.read(f"{d}/{k}.wav", dtype="float32")
    if a.ndim > 1: a = a.mean(axis=1)
    if sr != 16000:
        x = np.arange(0, len(a), sr / 16000)
        a = np.interp(x, np.arange(len(a)), a).astype(np.float32)
    segs.append([pos, pos + len(a)]); parts += [a, gap]; pos += len(a) + len(gap)
sf.write(f"{out}/clean.wav", np.concatenate(parts), 16000, subtype="PCM_16")
json.dump(segs, open(f"{out}/clean.segs.json", "w"))
open(f"{out}/clean.ref.txt", "w").write(" ".join(refs.values()) + "\n")
print(round(pos / 16000, 1), "s")
