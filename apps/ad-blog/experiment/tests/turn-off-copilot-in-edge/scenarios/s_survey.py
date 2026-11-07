shot("00-start")
print("PAGES", [x.url for x in ctx.pages])
for i, u in enumerate(["edge://settings/", "edge://settings/copilotAndSidebar", "edge://settings/sidebar", "edge://settings/privacy", "edge://version"]):
    pg.goto(u)
    time.sleep(4)
    shot(f"0{i+1}-" + u.split("/")[-1].replace(":", "") or "root")
    print("=====", u, pg.url)
    print(deep(pg)[:3000])
