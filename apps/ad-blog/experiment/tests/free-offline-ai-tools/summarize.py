"""results/*.json → summary.json (중앙값 속도, 점수, 이메일 요약 검사)."""
import glob
import json
import re
import statistics
import sys

sys.modules['llama_cpp'] = type(sys)('llama_cpp')
sys.modules['llama_cpp'].Llama = None
from chat_bench import QUESTIONS  # noqa: E402  채점 기준을 고친 뒤 저장된 답으로 재채점

ORDER = ['Qwen3.5-0.8B', 'Qwen3.5-2B', 'gemma-4-E2B-it', 'Llama-3.2-3B-Instruct', 'Phi-4-mini-instruct', 'Qwen3.5-4B', 'gemma-4-E4B-it']
# 이메일 요약에 들어가야 하는 날짜·마감 4개
DATES = {'Nov 7 (movers)': r'(nov(ember)?\.? 7|saturday)', 'Nov 5 (pack by)': r'(nov(ember)?\.? 5|thursday)', 'Nov 9 (badge)': r'(nov(ember)?\.? 9|monday)', 'Wednesday (tell Dana)': r'wednesday'}

out = {}
for name in ORDER:
    p = f'results/{name}.json'
    try:
        d = json.load(open(p))
    except FileNotFoundError:
        continue
    texts = [s['text'] for s in d['speed']]
    t = texts[0]
    bullets = [l for l in t.splitlines() if re.match(r'\s*([-*•]|\d+[.)])\s+', l)]
    out[name] = {
        'file_gb': round(d['file_gb'], 2),
        'peak_rss_gb': round(d['peak_rss_gb'], 2),
        'load_s': round(d['load_s'], 1),
        'gen_tok_per_s_median': round(statistics.median(s['gen_tok_per_s'] for s in d['speed']), 1),
        'gen_tok_per_s_runs': [round(s['gen_tok_per_s'], 1) for s in d['speed']],
        # 일반 독자용: 첫 글자 이후 초당 단어 수
        'words_per_s_median': round(statistics.median(len(x['text'].split()) / (x['total_s'] - x['first_token_s']) for x in d['speed']), 1),
        'summary_total_s_median': round(statistics.median(x['total_s'] for x in d['speed']), 1),
        'first_token_s_median': round(statistics.median(s['first_token_s'] for s in d['speed']), 1),
        'speed_prompt_tokens': d['speed_prompt_tokens'],
        'summary_gen_tokens': d['speed'][0]['gen_tokens'],
        'summary_bullets': len(bullets),
        'summary_dates_found': [k for k, rx in DATES.items() if re.search(rx, t, re.I)],
        'summary_same_all_runs': len(set(texts)) == 1,
        'score_20_at_run': d['score'],
        'score_20': sum(bool(chk(a['answer'])) for (_, chk), a in zip(QUESTIONS, d['answers'])),
        'wrong': [a['q'] for (_, chk), a in zip(QUESTIONS, d['answers']) if not chk(a['answer'])],
        'avg_answer_s': round(statistics.mean(a['total_s'] for a in d['answers']), 1),
    }
json.dump(out, open('summary.json', 'w'), indent=1)
for k, v in out.items():
    print(k, {x: v[x] for x in ['file_gb', 'peak_rss_gb', 'gen_tok_per_s_median', 'first_token_s_median', 'score_20', 'summary_bullets', 'summary_dates_found', 'avg_answer_s']})
