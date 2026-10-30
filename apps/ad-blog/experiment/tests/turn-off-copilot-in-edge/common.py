# Edge 설정 화면의 스위치(FLUENT-SWITCH, shadow DOM 안)를 찾아 이름·상태·화면 좌표를 돌려줌
TOGJS = """() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1 && n.tagName==='FLUENT-SWITCH'){ const r=n.getBoundingClientRect(); res.push({label:n.getAttribute('aria-label'), checked:!!n.checked, disabled:!!n.disabled || n.hasAttribute('disabled'), visible:r.width>0, x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2)}); } if(n.nodeType===1 && n.shadowRoot) walk(n.shadowRoot); for(const c of (n.childNodes||[])) walk(c);}; walk(document.documentElement); return res; }"""


def toggles(pg):
    return pg.evaluate(TOGJS)


def click_toggle(pg, label):
    for t in toggles(pg):
        if t["label"] == label and t["visible"]:
            pg.mouse.click(t["x"], t["y"])
            time.sleep(2)
            return True
    raise RuntimeError("toggle not found: " + label)
