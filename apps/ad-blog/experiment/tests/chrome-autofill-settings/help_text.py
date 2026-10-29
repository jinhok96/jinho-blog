"""Google 도움말 HTML에서 본문(class="cc") 글자만 뽑아 source-*.txt로 저장한다.

사용: python3 -I help_text.py {html 파일} {원래 URL} > source-....txt
- 접힌 단락(zippy)도 HTML 안에 있으므로 함께 뽑힘
"""
import sys
from html.parser import HTMLParser

BLOCK = {"p", "li", "h1", "h2", "h3", "h4", "div", "tr", "br", "section"}


class CC(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.lines = []
        self.buf = []

    def handle_starttag(self, tag, attrs):
        cls = dict(attrs).get("class") or ""
        if self.depth == 0 and tag == "div" and "cc" in cls.split():
            self.depth = 1
            return
        if self.depth:
            if tag in ("div", "section"):
                self.depth += 1
            if tag in BLOCK:
                self.flush()

    def handle_endtag(self, tag):
        if self.depth:
            if tag in BLOCK:
                self.flush()
            if tag in ("div", "section"):
                self.depth -= 1

    def handle_data(self, data):
        if self.depth:
            self.buf.append(data)

    def flush(self):
        s = " ".join("".join(self.buf).split())
        if s:
            self.lines.append(s)
        self.buf = []


p = CC()
p.feed(open(sys.argv[1], encoding="utf-8").read())
p.flush()
print(f"# {sys.argv[2]} (fetched 2026-10-29 UTC)")
print("\n".join(p.lines))
