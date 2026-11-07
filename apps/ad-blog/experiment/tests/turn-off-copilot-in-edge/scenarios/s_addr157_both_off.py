# 2026-11-07 Edge 157: s_final 뒤 프로필 r1(버튼·쓰기 도우미 모두 끔)에서 주소창 시험
exec(open("scenarios/s_extra157.py").read().split("addressbar(\"on\")")[0])
pg.goto("edge://settings/ai"); time.sleep(3)
print("ai", [(t['label'], t['checked']) for t in toggles(pg)])
pg.goto("edge://settings/languages"); time.sleep(3)
print("lang", [(t['label'], t['checked']) for t in toggles(pg)])
addressbar("both-off")
