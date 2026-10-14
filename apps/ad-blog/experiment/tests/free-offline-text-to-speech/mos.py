"""Predicted naturalness (UTMOS22 strong learner, via tarepan/SpeechMOS v1.2.0) for each model's Harvard clips.

Usage: python mos.py <speechmos_repo_dir> <weights.pt> <out_dir> <model_key>...
Code: https://raw.githubusercontent.com/tarepan/SpeechMOS/v1.2.0/...
Weights: https://github.com/tarepan/SpeechMOS/releases/download/v1.0.0/utmos22_strong_step7459_v1.pt
"""
import json, statistics, sys
import soundfile as sf, torch
sys.path.insert(0, sys.argv[1])
from speechmos.utmos22.strong.model import UTMOS22Strong

model = UTMOS22Strong(); model.load_state_dict(torch.load(sys.argv[2], map_location="cpu")); model.eval()
torch.set_num_threads(4)
OUT = sys.argv[3]
for key in sys.argv[4:]:
    scores = []
    for i in range(30):
        a, sr = sf.read(f"{OUT}/{key}/{i:02d}.wav", dtype="float32")
        with torch.no_grad():
            scores.append(float(model(torch.from_numpy(a).unsqueeze(0), sr)))
    res = dict(model=key, utmos_mean=round(statistics.mean(scores), 3), utmos_min=round(min(scores), 3),
               utmos_max=round(max(scores), 3), scores=[round(s, 3) for s in scores])
    json.dump(res, open(f"{OUT}/{key}/utmos.json", "w"), indent=1)
    print(key, res["utmos_mean"], res["utmos_min"], res["utmos_max"])
