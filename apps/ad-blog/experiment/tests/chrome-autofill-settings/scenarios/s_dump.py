import json
pg.bring_to_front()
out=open("/home/user/jinho-blog/apps/ad-blog/experiment/tests/chrome-autofill-settings/source-chrome-156-settings-text.txt","w")
out.write("# Google Chrome 156.0.8078.73 Linux, new profile /tmp/cr/p1, signed out, settings page text and switch states (cr-toggle checked/disabled), dumped 2026-10-29 UTC\n")
for u in ["chrome://settings/autofill","chrome://settings/payments","chrome://settings/contactInfo","chrome://settings/identityDocs","chrome://settings/travel","chrome://password-manager/settings"]:
    pg.goto(u); time.sleep(4)
    out.write(f"\n## {u}\n"+deep(pg)+"\n")
    out.write("TOGGLES "+json.dumps([t for t in toggles(pg) if t['visible'] or 'autofill' in u])+"\n")
out.close()
