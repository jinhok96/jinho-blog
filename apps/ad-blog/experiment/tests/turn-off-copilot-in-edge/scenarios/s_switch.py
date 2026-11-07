exec(open("common.py").read())
exec(open("probe.py").read())
# 0 기본값
probe("50")
# A Copilot 버튼 끄기
pg.goto("edge://settings/ai"); time.sleep(3)
click_toggle(pg, "Show Copilot button in toolbar")
print("A", [(t['label'], t['checked']) for t in toggles(pg)])
shot("51-0-settings")
probe("51")
# B 글쓰기 도우미 끄기
pg.goto("edge://settings/languages"); time.sleep(3)
click_toggle(pg, "Use writing assistance")
print("B", [(t['label'], t['checked'], t['disabled']) for t in toggles(pg)])
shot("52-0-settings")
probe("52")
# C 미니 메뉴 끄기
pg.goto("edge://settings/appearance/contextMenus"); time.sleep(3)
click_toggle(pg, "Show mini menu when selecting text")
print("C", [(t['label'], t['checked']) for t in toggles(pg)])
probe("53")
