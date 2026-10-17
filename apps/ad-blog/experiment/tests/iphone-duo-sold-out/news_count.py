"""Google News RSS 기사 수 (화제성 신호). 실행: python3 -I news_count.py 48h '"iPhone Duo"' '"Gmail" "AI Inbox"' ...

RSS는 최대 100건까지만 돌려주므로 100은 "100건 이상"으로 읽는다.
"""
import sys, urllib.parse, urllib.request, xml.etree.ElementTree as ET
UA = "Mozilla/5.0 (X11; Linux x86_64)"
win = sys.argv[1]
for q in sys.argv[2:]:
    url = "https://news.google.com/rss/search?" + urllib.parse.urlencode({"q": f"{q} when:{win}", "hl": "en-US", "gl": "US", "ceid": "US:en"})
    try:
        x = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=20).read()
        items = ET.fromstring(x).findall(".//item")
        print(f"{len(items):4d}  {q}")
        for it in items[:4]:
            print("      -", it.findtext("title")[:110], "|", it.findtext("pubDate")[5:16])
    except Exception as e:
        print("ERR", q, e)
