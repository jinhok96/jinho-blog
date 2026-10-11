"""WER of hypothesis vs reference after Whisper English text normalization."""
import sys, json, jiwer
from whisper_normalizer.english import EnglishTextNormalizer
norm = EnglishTextNormalizer()
ref = norm(open(sys.argv[1]).read())
hyp = norm(open(sys.argv[2]).read().replace("\n", " "))
o = jiwer.process_words(ref, hyp)
print(json.dumps({"wer": round(o.wer * 100, 2), "sub": o.substitutions, "del": o.deletions, "ins": o.insertions,
                  "ref_words": len(ref.split())}))
