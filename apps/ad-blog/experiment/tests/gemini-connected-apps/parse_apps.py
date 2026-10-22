"""Parse Google's Gemini Connected Apps table (support.google.com/gemini/table/17434654) into JSON + summary."""
import html, json, re, sys
from collections import Counter

src = open(sys.argv[1], encoding="utf-8").read()
rows = re.findall(r'<tr data-category="([^"]+)">(.*?)</tr>', src, re.S)

def text(s):
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()

GOOGLE = {"Gmail","Google Calendar","Google Drive","Google Docs","Google Keep","Google Tasks","Google Photos","Google Home",
          "YouTube Music","Google Maps","Google Play","Find Hub","Contacts","Device assistance (formerly Utilities)","Phone","Messages",
          "Google Flights","Google Hotels","YouTube","Google Sheets","Google Slides","Google Workspace","Spotify"}
apps = []
for cat, body in rows:
    cells = re.findall(r'<td class="cc">(.*?)</td>', body, re.S)
    if len(cells) < 3:
        continue
    m = re.search(r"<strong>(.*?):?</strong>", cells[0], re.S)
    name = text(m.group(1)).rstrip(":") if m else text(cells[0])[:40]
    req = text(cells[1])
    sup = text(cells[2])
    def field(label):
        mm = re.search(label + r"s?: (.*?)(?= Account type| Ages?:| Locations?:| Languages?:| Subscriptions?:| Review all|$)", req)
        return mm.group(1).strip() if mm else ""
    apps.append({
        "name": name, "category": html.unescape(cat), "description": text(cells[0]),
        "account": field("Account type"), "age": field("Age"), "location": field("Location"),
        "language": field("Language"), "subscription": field("Subscription"), "supported": sup,
    })

json.dump(apps, open(sys.argv[2], "w"), indent=1, ensure_ascii=False)
print("rows", len(apps))
print("by category", Counter(a["category"] for a in apps).most_common())
print("US only (exact)", sum(a["location"] == "US only" for a in apps))
print("US plus other places", [(a["name"], a["location"]) for a in apps if "US" in a["location"] and a["location"] != "US only"])
print("UK and US", [a["name"] for a in apps if "UK and US" in a["location"]])
print("18+", sum(a["age"].startswith("18") for a in apps), "13+", sum(a["age"].startswith("13") for a in apps))
print("personal only", sum("Personal Google Account only" in a["account"] for a in apps))
print("work/school ok", [a["name"] for a in apps if "work" in a["account"].lower()])
print("subscription", [(a["name"], a["subscription"]) for a in apps if a["subscription"]])
print("android only", [a["name"] for a in apps if "Android devices" in a["supported"]])
for a in apps:
    print("-", a["category"], "|", a["name"], "|", a["account"], "|", a["age"], "|", a["location"], "|", a["subscription"])

# Ownership groups (our classification; table itself has no owner column)
GOOGLE_OWNED = {"Contacts", "Device assistance (formerly Utilities)", "Google Home", "Find Hub", "Google Play", "Google Photos",
                "YouTube Music", "Gemini Notebook", "Google Ads", "Google Business Profile", "Google Classroom", "Google Workspace"}
PHONE_BUILTIN = {"Messages", "Phone"}  # "your phone's default messaging/calling app"
MAKER_PREFIX = ("HONOR", "Lenovo", "OnePlus", "OPPO", "Samsung", "TECNO", "vivo", "Xiaomi", "Mind Space")
def owner(a):
    if a["name"] in GOOGLE_OWNED: return "Google"
    if a["name"] in PHONE_BUILTIN or a["name"].startswith(MAKER_PREFIX): return "Phone maker / built-in"
    return "Other company"
for a in apps: a["owner"] = owner(a)
json.dump(apps, open(sys.argv[2], "w"), indent=1, ensure_ascii=False)
print("owner", Counter(a["owner"] for a in apps))
other = [a for a in apps if a["owner"] == "Other company"]
print("other US only (exact)", sum(a["location"] == "US only" for a in other), "brazil", sum("Brazil" in a["location"] for a in other), "india", sum("India" in a["location"] for a in other))
print("other 18+", sum(a["age"].startswith("18") for a in other), "of", len(other))
print("other by cat", Counter(a["category"] for a in other).most_common())
print([a["name"] for a in other])
