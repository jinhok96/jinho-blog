"""오프라인 챗봇(GGUF) 속도·메모리·간단 정답률 측정.

사용: /tmp/llm/bin/python chat_bench.py MODEL.gguf OUT.json
모델마다 새 프로세스로 실행 (최대 RSS를 모델별로 분리).
"""

import json
import os
import re
import sys
import time

from llama_cpp import Llama

EMAIL = """Hi team,

Quick update on the office move. The movers are now booked for Saturday, November 7, starting at 8 a.m., not Friday as we planned earlier. Please pack your desk into the labeled boxes by 5 p.m. on Thursday, November 5. Boxes and tape are in the supply room on the second floor, and each box needs a label with your name and new desk number. Your new desk number is in the seating chart attached to this email.

Laptops, chargers, and anything valuable should go home with you on Thursday. The movers are not insured for personal items, and IT will not move computers this time. Monitors and docking stations stay at your current desk; IT will set up new ones at the new office before Monday.

The new office is at 410 Harbor Street, fourth floor. Parking in the garage is free for the first month. After that it costs $85 a month, and you can sign up at the front desk. The building opens at 7 a.m. and your current badge will not work there, so pick up a new badge from reception on Monday, November 9, between 8 and 10 a.m.

If you have a standing desk, a special chair, or anything else that needs extra care, tell Dana by Wednesday so she can add it to the movers' list. Questions about the move go to Dana; questions about computers and network access go to the IT help desk.

Thanks, and see you in the new space,
Priya"""

SPEED_PROMPT = "Summarize this email in exactly 5 short bullet points. Include every date and deadline.\n\n" + EMAIL

# (질문, 채점 함수) — 답은 코드로 확인 가능한 것만
def last_number(s):
    nums = re.findall(r"-?\d[\d,]*\.?\d*", s)
    return nums[-1].replace(",", "").rstrip(".") if nums else None

def num_eq(ans):
    def f(s):
        n = last_number(s)
        try:
            return n is not None and abs(float(n) - ans) < 1e-6
        except ValueError:
            return False
    return f

def has(*words):
    return lambda s: all(w.lower() in s.lower() for w in words)

def json_check(s):
    m = re.search(r"\{.*\}", s, re.S)
    if not m:
        return False
    try:
        d = json.loads(m.group(0))
    except json.JSONDecodeError:
        return False
    return d.get("name") == "Maria Lopez" and d.get("email") == "maria.lopez@example.com"

def three_items(s):
    line = s.strip().splitlines()[0] if s.strip() else ""
    items = [x.strip() for x in line.split(",") if x.strip()]
    return len(items) == 3

def sugar(s):
    # 1.875 = 15/8 = 1 7/8 (분수 답도 정답)
    return num_eq(1.875)(s) or re.search(r"1\s+7/8|15/8|\\frac\{15\}\{8\}", s) is not None

def yes_only(s):
    return s.strip().strip(".").upper() == "YES"

QUESTIONS = [
    ("A shirt costs $40 and is 25% off. What is the sale price in dollars?", num_eq(30)),
    ("I have 3 boxes with 12 pens each and give away 7 pens. How many pens are left?", num_eq(29)),
    ("A train leaves at 9:40 a.m. and the trip takes 2 hours 35 minutes. At what time does it arrive? Give the time only.", has("12:15")),
    ("Sara is 3 times as old as her son. In 12 years she will be twice as old as him. How old is Sara now?", num_eq(36)),
    ("A recipe needs 3/4 cup of sugar for 12 cookies. How many cups of sugar are needed for 30 cookies?", sugar),
    ("What is 17 multiplied by 23?", num_eq(391)),
    ("A phone plan costs $15 a month plus $0.10 per text. How much is a month with 240 texts, in dollars?", num_eq(39)),
    ("If 5 printers print 5 pages in 5 minutes, how many minutes do 100 printers need to print 100 pages?", num_eq(5)),
    ("What is the capital of Australia?", has("canberra")),
    ("What is the chemical symbol for gold?", lambda s: re.search(r"\bAu\b", s) is not None),
    ("Which planet is closest to the sun?", has("mercury")),
    ("Who wrote the novel Pride and Prejudice?", has("austen")),
    ("At sea level, what is the boiling point of water in degrees Fahrenheit?", num_eq(212)),
    ("How many days are in a leap year?", num_eq(366)),
    ("Is 17 a prime number? Reply with only the word YES or NO.", yes_only),
    ("Convert 3 hours 45 minutes to minutes. Reply with the number only.", num_eq(225)),
    ("List exactly three fruits, separated by commas, with nothing else in your reply.", three_items),
    ("Sort these words alphabetically and reply with them separated by commas: pear, apple, mango", lambda s: re.sub(r"\s", "", s.lower()).rstrip(".") == "apple,mango,pear"),
    ('Return only a JSON object with keys "name" and "email" for this text: Contact Maria Lopez at maria.lopez@example.com about the invoice.', json_check),
    ("From the email below, on what date do the movers come? Answer with the date only.\n\n" + EMAIL, has("november 7")),
]

SYSTEM_SHORT = "Answer the question. Be brief; give the final answer at the end."


def peak_rss_gb():
    with open("/proc/self/status") as f:
        for line in f:
            if line.startswith("VmHWM"):
                return int(line.split()[1]) / 1024 / 1024
    return None


def stream_once(m, messages, max_tokens):
    m.reset()
    t0 = time.perf_counter()
    first = None
    text = ""
    n = 0
    for chunk in m.create_chat_completion(messages=messages, max_tokens=max_tokens, temperature=0, stream=True):
        delta = chunk["choices"][0]["delta"].get("content")
        if delta:
            if first is None:
                first = time.perf_counter()
            text += delta
            n += 1
    t1 = time.perf_counter()
    gen_tokens = len(m.tokenize(text.encode(), add_bos=False, special=False)) if text else 0
    return {
        "first_token_s": (first - t0) if first else None,
        "total_s": t1 - t0,
        "gen_tokens": gen_tokens,
        "gen_tok_per_s": (gen_tokens - 1) / (t1 - first) if first and gen_tokens > 1 and t1 > first else None,
        "text": text,
    }


def main():
    path, out = sys.argv[1], sys.argv[2]
    t = time.perf_counter()
    m = Llama(path, n_ctx=4096, n_threads=4, n_batch=512, verbose=False, seed=0)
    load_s = time.perf_counter() - t
    prompt_tokens = len(m.tokenize(SPEED_PROMPT.encode()))

    speed = [stream_once(m, [{"role": "user", "content": SPEED_PROMPT}], 300) for _ in range(3)]

    answers = []
    for q, check in QUESTIONS:
        r = stream_once(m, [{"role": "system", "content": SYSTEM_SHORT}, {"role": "user", "content": q}], 400)
        answers.append({"q": q[:80], "answer": r["text"], "ok": bool(check(r["text"])), "total_s": r["total_s"]})

    res = {
        "model": os.path.basename(path),
        "file_gb": os.path.getsize(path) / 1e9,
        "arch": m.metadata.get("general.architecture"),
        "load_s": load_s,
        "speed_prompt_tokens": prompt_tokens,
        "speed": speed,
        "answers": answers,
        "score": sum(a["ok"] for a in answers),
        "peak_rss_gb": peak_rss_gb(),
        "llama_cpp_python": __import__("llama_cpp").__version__,
    }
    with open(out, "w") as f:
        json.dump(res, f, indent=1)
    med = sorted(s["gen_tok_per_s"] for s in speed)[1]
    print(res["model"], f"score {res['score']}/20 gen {med:.1f} tok/s rss {res['peak_rss_gb']:.2f}GB")


if __name__ == "__main__":
    main()
