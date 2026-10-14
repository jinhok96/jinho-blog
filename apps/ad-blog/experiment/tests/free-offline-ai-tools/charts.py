"""summary.json → 오프라인 챗봇 그래프, 허브용 작업별 메모리 그래프, 실제 요약 출력 비교 (webp)."""
import io
import os
import json
import textwrap

import matplotlib

matplotlib.use('Agg')
import matplotlib.pyplot as plt  # noqa: E402
from PIL import Image  # noqa: E402

os.makedirs('img', exist_ok=True)  # 생성 후 content/posts/images/free-offline-ai-tools/로 복사
S = json.load(open('summary.json'))
ORDER = ['Qwen3.5-0.8B', 'Qwen3.5-2B', 'gemma-4-E2B-it', 'Llama-3.2-3B-Instruct', 'Phi-4-mini-instruct', 'Qwen3.5-4B', 'gemma-4-E4B-it']
LAB = {'Qwen3.5-0.8B': 'Qwen3.5 0.8B', 'Qwen3.5-2B': 'Qwen3.5 2B', 'gemma-4-E2B-it': 'Gemma 4 E2B', 'Llama-3.2-3B-Instruct': 'Llama 3.2 3B',
       'Phi-4-mini-instruct': 'Phi-4-mini', 'Qwen3.5-4B': 'Qwen3.5 4B', 'gemma-4-E4B-it': 'Gemma 4 E4B'}
SURF, INK, INK2, GRID, BLUE, GRAY = '#fcfcfb', '#0b0b0b', '#52514e', '#e4e3df', '#2a78d6', '#a9a8a3'
plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 15, 'text.color': INK, 'axes.labelcolor': INK2, 'xtick.color': INK2, 'ytick.color': INK})
FOOT = 'ToolProof test, Oct 2026 · llama.cpp (llama-cpp-python 0.3.36) · Q4_K_M files · 4-core CPU, no GPU'


def save(fig, path):
    b = io.BytesIO()
    fig.savefig(b, format='png', dpi=100, facecolor=SURF)
    Image.open(b).convert('RGB').save(path, 'WEBP', quality=90)
    print(path)


def bars(ax, labels, vals, fmt, title, xmax, colors=None):
    y = list(range(len(labels)))[::-1]
    ax.barh(y, vals, color=colors or BLUE, height=0.62)
    for yi, v in zip(y, vals):
        ax.text(v + xmax * 0.015, yi, fmt(v), va='center', fontsize=14, color=INK)
    ax.set_yticks(y)
    ax.set_yticklabels(labels)
    ax.set_xlim(0, xmax)
    ax.set_title(title, loc='left', fontsize=16, color=INK, pad=12)
    ax.set_facecolor(SURF)
    ax.grid(axis='x', color=GRID, lw=1)
    ax.set_axisbelow(True)
    for s in ['top', 'right', 'left']:
        ax.spines[s].set_visible(False)
    ax.spines['bottom'].set_color(GRID)
    ax.tick_params(axis='y', length=0)


labels = [LAB[m] for m in ORDER]

# 1. 대표 이미지: 요약 시간 + 정답 수
fig, (a, b) = plt.subplots(1, 2, figsize=(12, 6.75), sharey=True, gridspec_kw={'wspace': 0.08})
bars(a, labels, [S[m]['summary_total_s_median'] for m in ORDER], lambda v: f'{v:.0f} s', 'Seconds to summarize a 250-word email', 26)
bars(b, labels, [S[m]['score_20'] for m in ORDER], lambda v: f'{v}/20', 'Correct answers (20 short questions)', 23)
fig.suptitle('Free offline AI chatbots: 7 small models tested on a 4-core CPU', x=0.012, ha='left', fontsize=20, fontweight='bold', color=INK, y=0.985)
fig.text(0.012, 0.015, FOOT, fontsize=12, color=INK2)
fig.subplots_adjust(left=0.15, right=0.98, top=0.83, bottom=0.08)
save(fig, 'img/offline-chatbot-speed-accuracy.webp')

# 2. 모델별 최대 메모리
fig, ax = plt.subplots(figsize=(12, 6))
bars(ax, labels, [S[m]['peak_rss_gb'] for m in ORDER], lambda v: f'{v:.1f} GB', 'Peak RAM while chatting (4,096-token context)', 9.5)
ax.axvline(8, color=GRAY, lw=1.5, ls='--')
ax.text(8.05, 6.45, '8 GB', color=INK2, fontsize=13)
fig.text(0.012, 0.02, FOOT, fontsize=12, color=INK2)
fig.subplots_adjust(left=0.15, right=0.97, top=0.88, bottom=0.12)
save(fig, 'img/offline-chatbot-memory.webp')

# 3. 허브: 작업별 추천 도구의 최대 메모리 (각 글의 측정값)
jobs = [
    ('Text to speech: Piper medium', 0.31, 'free-offline-text-to-speech'),
    ('Text to speech: Kokoro v1.0', 0.64, 'free-offline-text-to-speech'),
    ('Background removal: IS-Net', 1.1, 'remove-background-from-image-free-offline'),
    ('Transcription: Parakeet TDT v2', 1.3, 'transcribe-audio-offline-free'),
    ('Transcription: Whisper turbo', 2.3, 'transcribe-audio-offline-free'),
    ('Chatbot: Qwen3.5 2B', S['Qwen3.5-2B']['peak_rss_gb'], 'this test'),
    ('Chatbot: Gemma 4 E4B', S['gemma-4-E4B-it']['peak_rss_gb'], 'this test'),
    ('Background removal: BiRefNet', 9.6, 'remove-background-from-image-free-offline'),
]
fig, ax = plt.subplots(figsize=(12, 6.75))
bars(ax, [j[0] for j in jobs], [j[1] for j in jobs], lambda v: f'{v:.1f} GB', 'Peak RAM of our top picks for each offline AI job', 11.5)
fig.text(0.012, 0.015, 'ToolProof tests, Oct 11–14, 2026 · each tool run alone on a 4-core Linux server, no GPU', fontsize=12, color=INK2)
fig.subplots_adjust(left=0.3, right=0.97, top=0.9, bottom=0.1)
save(fig, 'img/offline-ai-tools-memory.webp')

# 4. 같은 이메일 요약: 0.8B vs 2B 실제 출력
outs = {m: json.load(open(f'results/{m}.json'))['speed'][0]['text'] for m in ['Qwen3.5-0.8B', 'gemma-4-E2B-it']}
fig, axes = plt.subplots(1, 2, figsize=(12, 6.75))
for ax, (m, t) in zip(axes, outs.items()):
    ax.axis('off')
    lines = [l.strip().lstrip('*').strip() for l in t.splitlines() if l.strip()]
    lines = [l for l in lines if not l.lower().startswith('here is')]
    body = '\n'.join(textwrap.fill('• ' + l, 46, subsequent_indent='   ') for l in lines)
    n = len(lines)
    ax.set_title(f'{LAB[m]}: {n} bullets', loc='left', fontsize=16, color=INK, pad=10)
    ax.text(0, 1, body, va='top', fontsize=10.5 if n > 8 else 12.5, family='DejaVu Sans', color=INK, linespacing=1.35, transform=ax.transAxes)
fig.suptitle('Same prompt: "Summarize this email in exactly 5 short bullet points"', x=0.012, ha='left', fontsize=17, fontweight='bold', color=INK, y=0.985)
fig.text(0.012, 0.015, 'Unedited output · ' + FOOT, fontsize=11, color=INK2)
fig.subplots_adjust(left=0.02, right=0.98, top=0.88, bottom=0.06, wspace=0.08)
save(fig, 'img/offline-chatbot-summary-output.webp')
