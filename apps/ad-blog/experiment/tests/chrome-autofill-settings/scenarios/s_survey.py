pg.goto("chrome://settings/autofill"); time.sleep(5)
print("URL", pg.url)
t = deep(pg); print("TEXT", t[:4000])
shot("survey_top")
print("TOGGLES", toggles(pg))
# 하위 페이지 링크 찾기
for label in ["Google Password Manager", "Payment methods", "Payments", "Contact info", "Identity docs", "Travel"]:
    try:
        pg.goto("chrome://settings/autofill"); time.sleep(3)
        el = pg.get_by_text(label, exact=True).first
        el.click(timeout=4000); time.sleep(3)
        print("SUB", label, "->", pg.url)
        print("SUBTEXT", deep(pg)[:2500])
        print("SUBTOG", toggles(pg))
        shot("survey_sub_" + label.replace(" ", "_"))
    except Exception as e:
        print("ERR", label, e)
