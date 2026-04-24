#!/usr/bin/env python3
"""
update_data.py  —  MCA Facebook Ads Dashboard
──────────────────────────────────────────────────────────────────────────────
Fetches live data from Windsor.ai and overwrites data.js ready for the
GitHub Pages dashboard.

Usage:
    python update_data.py
    python update_data.py --weeks 4
    python update_data.py --account 1427075252328347 --weeks 6
    python update_data.py --dry-run   # Print data.js to stdout without saving

Requirements:
    pip install requests

Windsor.ai API key:  set env var WINDSOR_API_KEY  or pass --api-key
──────────────────────────────────────────────────────────────────────────────
"""

import argparse, json, os, sys, datetime, re
from collections import defaultdict
try:
    import requests
except ImportError:
    print("ERROR: pip install requests"); sys.exit(1)

CONNECTOR   = "facebook"
ACCOUNT_ID  = "1427075252328347"
FIELDS      = [
    "date","campaign_name","spend","impressions","reach","frequency",
    "actions_lead","cost_per_action_type_lead",
    "cpm","cpc","ctr","link_clicks","actions_landing_page_view",
    "video_p25_watched_actions_video_view","video_p50_watched_actions_video_view",
    "video_p75_watched_actions_video_view","video_p95_watched_actions_video_view",
]
TYPE_MAP = {
    "lead_gen":  ["quiz","instant form","instant forms"],
    "traffic":   ["job portal","traffic"],
    "awareness": ["awareness","creative refresh","ethnic","tax","regional",
                  "organic video","canberra","seg 2","seg 3","seg 4","seg 6"],
}

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--api-key",  default=os.environ.get("WINDSOR_API_KEY",""))
    p.add_argument("--account",  default=ACCOUNT_ID)
    p.add_argument("--weeks",    type=int, default=5)
    p.add_argument("--dry-run",  action="store_true")
    p.add_argument("--output",   default="data.js")
    return p.parse_args()

def monday(d): return d - datetime.timedelta(days=d.weekday())

def week_ranges(n):
    today = datetime.date.today()
    mon   = monday(today)
    out   = []
    for i in range(n-1, -1, -1):
        s = mon - datetime.timedelta(weeks=i)
        e = s + datetime.timedelta(days=6)
        if i == 0:
            lbl = f"This Week ({s.strftime('%b %-d')}–{today.strftime('%-d')})"
            e   = today - datetime.timedelta(days=1)
        else:
            lbl = f"Week {n-i} ({s.strftime('%b %-d')}–{e.strftime('%-d')})"
        out.append((s, min(e, today-datetime.timedelta(days=1)), lbl))
    return out

def week_key(date_str, ranges):
    d = datetime.datetime.strptime(date_str,"%Y-%m-%d").date()
    n = len(ranges)
    for i,(s,e,_) in enumerate(ranges):
        if s <= d <= e:
            return "tw" if i==n-1 else f"w{i+1}"
    return None

def classify(name):
    n = name.lower()
    for t, kws in TYPE_MAP.items():
        if any(k in n for k in kws): return t
    return "awareness"

def fetch(api_key, account, date_from, date_to):
    if not api_key:
        print("⚠️  No WINDSOR_API_KEY — no live fetch. Keeping existing data.js.")
        return []
    url  = "https://api.windsor.ai/v1/data"
    hdrs = {"Authorization":f"Bearer {api_key}","Content-Type":"application/json"}
    body = {"connector":CONNECTOR,"accounts":[account],"date_from":date_from,"date_to":date_to,"fields":FIELDS}
    r = requests.post(url, json=body, headers=hdrs, timeout=90)
    r.raise_for_status()
    rows = r.json()
    rows = rows.get("result", rows) if isinstance(rows, dict) else rows
    print(f"✅  {len(rows)} rows ({date_from}→{date_to})")
    return rows

def aggregate(rows, ranges):
    wsum = defaultdict(lambda: dict(spend=0,imps=0,reach=0,leads=0,lc=0,lpv=0,
                                     cpm_n=0,cpm_d=0,cpl_n=0,cpl_d=0))
    camp = defaultdict(lambda: defaultdict(lambda: dict(spend=0,imps=0,reach=0,leads=0,lc=0,lpv=0,
                                                         cpm_n=0,cpm_d=0,cpl_n=0,cpl_d=0)))
    def g(row, k): v=row.get(k); return float(v) if v else 0.0

    for row in rows:
        ds = row.get("date") or row.get("date_start","")
        if not ds: continue
        wk = week_key(ds, ranges)
        if not wk: continue
        cn   = row.get("campaign_name","Unknown")
        sp   = g(row,"spend");   im = g(row,"impressions"); re_= g(row,"reach")
        ld   = g(row,"actions_lead"); cpl = g(row,"cost_per_action_type_lead")
        cpm  = g(row,"cpm");     lc = g(row,"link_clicks"); lpv = g(row,"actions_landing_page_view")
        for d in [wsum[wk], camp[cn][wk]]:
            d["spend"]+=sp; d["imps"]+=im; d["reach"]+=re_
            d["leads"]+=ld; d["lc"]+=lc;   d["lpv"]+=lpv
            if cpm>0: d["cpm_n"]+=cpm; d["cpm_d"]+=1
            if cpl>0 and ld>0: d["cpl_n"]+=cpl*ld; d["cpl_d"]+=ld

    def fin(d):
        cpm = d["cpm_n"]/d["cpm_d"] if d["cpm_d"] else None
        cpl = d["cpl_n"]/d["cpl_d"] if d["cpl_d"] else None
        bcp = d["spend"]/d["leads"] if d["leads"] else None
        return dict(spend=round(d["spend"],2),impressions=round(d["imps"]),
                    reach=round(d["reach"]),leads=round(d["leads"]),
                    blendedCPL=round(bcp,2) if bcp else None,
                    trueLeadGenCPL=round(cpl,2) if cpl else None,
                    cpm=round(cpm,2) if cpm else None,
                    linkClicks=round(d["lc"]),lpv=round(d["lpv"]))

    fw = {wk: fin(d) for wk,d in wsum.items()}
    fc = []
    for cn, wkd in camp.items():
        wd = {}
        for wk,d in wkd.items():
            cpm = d["cpm_n"]/d["cpm_d"] if d["cpm_d"] else None
            cpl = d["cpl_n"]/d["cpl_d"] if d["cpl_d"] else None
            wd[wk] = dict(spend=round(d["spend"],2),impressions=round(d["imps"]),
                          reach=round(d["reach"]),leads=round(d["leads"]),
                          cpl=round(cpl,2) if cpl else None,cpm=round(cpm,2) if cpm else None,
                          linkClicks=round(d["lc"]),lpv=round(d["lpv"]))
        fc.append(dict(id=re.sub(r'[^a-z0-9_]','_',cn.lower())[:40],
                       name=cn, type=classify(cn), status="Active", weekly=wd))
    fc.sort(key=lambda c: sum(w.get("spend",0) for w in c["weekly"].values()), reverse=True)
    return fw, fc

def build_js(fw, fc, ranges, account):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    wks = [f"w{i+1}" if i<len(ranges)-1 else "tw" for i in range(len(ranges))]
    weekly_block = {}
    for i,(s,e,lbl) in enumerate(ranges):
        wk = wks[i]
        d  = fw.get(wk,{})
        weekly_block[wk] = dict(label=lbl, dateRange=f"{s.strftime('%b %-d')}–{e.strftime('%-d')}",
            **{k: d.get(k,0) for k in ["spend","impressions","reach","leads","linkClicks","lpv"]},
            frequency=d.get("frequency"), blendedCPL=d.get("blendedCPL"),
            trueLeadGenCPL=d.get("trueLeadGenCPL"), cpm=d.get("cpm"))
        if i==len(ranges)-1: weekly_block[wk]["partial"]=True
    obj = dict(meta=dict(account=account,accountId=ACCOUNT_ID,currency="AUD",
                         generatedAt=now,lastSync=now,weeks=[r[2] for r in ranges],
                         weekKeys=wks,currentWeek=wks[-1],
                         priorWeek=wks[-2] if len(wks)>1 else wks[0],
                         baselineWeek=wks[-3] if len(wks)>2 else wks[0]),
               weekly=weekly_block, campaigns=fc)
    body = json.dumps(obj, indent=2, ensure_ascii=False)
    return f"""// data.js — MCA Facebook Ads Dashboard
// Auto-generated by update_data.py on {now}
// Account: {account}

const dashboardData = {body};

if (typeof module !== "undefined") module.exports = dashboardData;
"""

def main():
    args = parse_args()
    print(f"📡  Windsor.ai Refresher | Account {args.account} | {args.weeks} weeks")
    ranges = week_ranges(args.weeks)
    rows   = fetch(args.api_key, args.account, ranges[0][0].isoformat(), ranges[-1][1].isoformat())
    if rows:
        fw, fc = aggregate(rows, ranges)
    else:
        fw, fc = {}, []
    js = build_js(fw, fc, ranges, args.account)
    if args.dry_run:
        print(js[:3000]); return
    with open(args.output,"w") as f: f.write(js)
    print(f"✅  {args.output} updated ({os.path.getsize(args.output):,} bytes)")
    print("Cron (weekly Monday 8am): 0 8 * * 1 cd /path/to/dashboard && python update_data.py")

if __name__=="__main__": main()
