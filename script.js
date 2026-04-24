// ============================================================
// CL META ADS DASHBOARD — script.js
// Data Period: Apr 1–24, 2026 | Currency: AUD
// Attribution: 7-day click / 1-day view
// ============================================================

const dashboardData = {
  meta: {
    account: "CL",
    period: "Apr 1 – Apr 24, 2026",
    currency: "AUD",
    attribution: "7-day click or 1-day view",
    geography: "Australia",
    wow_available: false,
    wow_note: "Single-period export only. Upload a day-by-day export for WoW comparisons."
  },

  benchmarks: {
    cpl: { green: 5, yellow_max: 12 },       // derived from data
    cpm: { green: 10, yellow_max: 20 },       // derived from data
    frequency: { warn: 3.5 },
    lpv_rate: { warn: 0.70 }
  },

  account: {
    spend:         112718.02,
    impressions:   17437794,
    reach:         8620659,
    cpm:           9.76,
    frequency:     2.02,
    link_clicks:   53510,
    landing_page_views: 34207,
    lpv_rate:      0.639,
    total_results: 3882,     // leads + GTM conversions
    blended_cpl:   3.75,
    total_campaigns: 34
  },

  // Validation flags
  flags: [
    { type: "warning", icon: "⚠️", title: "No WoW Data Available", msg: "Export is a single aggregated period (Apr 1–24). Upload a daily breakdown for week-over-week analysis." },
    { type: "critical", icon: "🚨", title: "166 / 271 Ads: Below Average Quality Ranking", msg: "61% of ads carry a Below Average quality ranking. This suppresses delivery and inflates CPM across the board. Priority: refresh creatives." },
    { type: "warning", icon: "📉", title: "LPV Rate: 63.9%", msg: "Account-wide landing page view rate is below the 70% threshold. Many regional content ads are 20–55% — severe ad-to-page relevance or mobile load issues." },
    { type: "flag",    icon: "🔁", title: "4 Ad Sets: Frequency > 3.5", msg: "La Trobe 01 (3.70), Dobell 01 (3.66), McEwen 01 (3.56), Hawke 01 (3.55). Creative refresh needed for these audiences." },
    { type: "flag",    icon: "💸", title: "Seg 4 Quiz: $17.00 CPL (3× benchmark)", msg: "Seg 4 - Quiz (Instant Forms) has only 75 leads at $17/lead vs $3–5 average. Below-average quality ranking. Pause or rebuild." },
    { type: "flag",    icon: "💸", title: "Seg 2 Quiz: $14.78 CPL", msg: "54 leads at $14.78/lead. Now inactive but flagged for review. Campaign may have exhausted audience." }
  ],

  campaigns: [
    { name: "Seg 4 – Mar Creative Refresh – Awareness",  type: "Reach",              spend: 17824.10, results: 1635402, cpr: 10.90,  cpm: 5.56,  freq: 1.96, link_clicks: 4056,  lpv: 1588,  status: "active" },
    { name: "Seg 6 – Mar Creative Refresh – Awareness",  type: "Reach",              spend: 11376.65, results: 1322425, cpr: 8.60,   cpm: 3.67,  freq: 2.34, link_clicks: 2105,  lpv: 1588,  status: "active" },
    { name: "Seg 3 – Mar Creative Refresh – April",      type: "Reach",              spend: 9114.05,  results: 1405160, cpr: 6.49,   cpm: 3.16,  freq: 2.05, link_clicks: 1674,  lpv: 1948,  status: "active" },
    { name: "Seg 8 - Job Portal (Conversions)",          type: "[GTM] Job Ad Conv",  spend: 5970.35,  results: 2051,    cpr: 2.91,   cpm: 14.78, freq: 2.54, link_clicks: 7590,  lpv: 6890,  status: "active" },
    { name: "Seg 3 – VIC Apr Regional Content",          type: "Post engagements",   spend: 5358.54,  results: 4149,    cpr: 1.29,   cpm: 14.27, freq: 3.35, link_clicks: 3565,  lpv: 2280,  status: "active" },
    { name: "Seg 8 - Job Portal (Traffic)",              type: "Landing page views",  spend: 5313.41,  results: 9744,    cpr: 0.55,   cpm: 7.29,  freq: 1.79, link_clicks: 11130, lpv: 9744,  status: "active" },
    { name: "Seg 4 – VIC Apr Regional – Relaunch",       type: "Post engagements",   spend: 5263.56,  results: 2579,    cpr: 2.04,   cpm: 14.29, freq: 3.90, link_clicks: 2326,  lpv: 942,   status: "active" },
    { name: "Seg 4 – NSW Apr Regional Content",          type: "Post engagements",   spend: 4508.10,  results: 2691,    cpr: 1.67,   cpm: 13.97, freq: 3.49, link_clicks: 2117,  lpv: 884,   status: "active" },
    { name: "Seg 3 – NSW Apr Regional Content",          type: "Post engagements",   spend: 4498.27,  results: 4056,    cpr: 1.11,   cpm: 11.07, freq: 3.13, link_clicks: 3272,  lpv: 1842,  status: "active" },
    { name: "Seg 4 – QLD Apr Regional Content",          type: "Post engagements",   spend: 4491.86,  results: 2846,    cpr: 1.58,   cpm: 14.91, freq: 3.44, link_clicks: 2049,  lpv: 835,   status: "active" },
    { name: "Seg 3 – QLD Apr Regional Content",          type: "Post engagements",   spend: 4486.80,  results: 3339,    cpr: 1.34,   cpm: 13.95, freq: 3.15, link_clicks: 2875,  lpv: 1423,  status: "active" },
    { name: "Seg 3 - Quiz (Instant Forms) – Correct",   type: "Leads (form)",        spend: 4188.49,  results: 981,     cpr: 4.27,   cpm: 21.19, freq: 2.67, link_clicks: 1982,  lpv: 245,   status: "active" },
    { name: "Seg 3 – Ethnic Arabic Apr $240/day",        type: "Reach",              spend: 3530.77,  results: 285997,  cpr: 12.35,  cpm: 12.35, freq: 2.24, link_clicks: 431,   lpv: 198,   status: "active" },
    { name: "Seg 3 – Ethnic Chinese Apr $240/day",       type: "Reach",              spend: 3502.19,  results: 297702,  cpr: 11.76,  cpm: 11.76, freq: 2.21, link_clicks: 403,   lpv: 209,   status: "active" },
    { name: "Seg 3 – Ethnic Hindi March $240/day",       type: "Reach",              spend: 3497.52,  results: 276503,  cpr: 12.65,  cpm: 12.65, freq: 2.29, link_clicks: 448,   lpv: 224,   status: "active" },
    { name: "Seg 6 - Quiz (Instant Forms)",              type: "Leads (form)",        spend: 1646.70,  results: 576,     cpr: 2.86,   cpm: 26.56, freq: 2.69, link_clicks: 1269,  lpv: 170,   status: "active" },
    { name: "Seg 4 - Quiz (Instant Forms) No Cap",       type: "Leads (form)",        spend: 1274.99,  results: 75,      cpr: 17.00,  cpm: 44.17, freq: 2.04, link_clicks: 351,   lpv: 30,    status: "active" },
    { name: "Seg 2 – Mar Batch – Awareness",             type: "Reach",              spend: 2267.62,  results: 342617,  cpr: 6.62,   cpm: 6.62,  freq: 1.87, link_clicks: 659,   lpv: 191,   status: "active" },
    { name: "Seg 3 – Tax Awareness",                     type: "Reach",              spend: 2095.29,  results: 545231,  cpr: 3.84,   cpm: 3.84,  freq: 1.91, link_clicks: 1032,  lpv: 554,   status: "active" },
    { name: "Seg 4 – Tax Awareness",                     type: "Reach",              spend: 2091.74,  results: 478294,  cpr: 4.37,   cpm: 4.37,  freq: 1.98, link_clicks: 891,   lpv: 374,   status: "active" },
    { name: "Seg 2 - Quiz (Instant Forms) No caps",      type: "Leads (form)",        spend: 797.98,   results: 54,      cpr: 14.78,  cpm: 17.18, freq: 2.03, link_clicks: 233,   lpv: 13,    status: "inactive" },
    { name: "Seg 8 - Job Portal (Instant Form)",         type: "Leads (form)",        spend: 693.38,   results: 145,     cpr: 4.78,   cpm: 17.06, freq: 2.22, link_clicks: 491,   lpv: 85,    status: "inactive" }
  ],

  // Ad-level: conversion + lead campaigns only (ad-level, with results)
  ads: [
    { campaign: "Seg 3 - Quiz (Instant Forms)", ad: "Seg 3 - Quiz 24 Mar 2026 – Copy",  results: 860,  cpr: 4.32,   spend: 3713.25, freq: 2.81, cpm: 21.20, link_clicks: 1733, lpv: 211,  quality: "Average",        conv_rank: "Above average" },
    { campaign: "Job Portal (Conversions)",     ad: "Ad 03",                             results: 663,  cpr: 2.89,   spend: 1919.13, freq: 1.86, cpm: 15.38, link_clicks: 2135, lpv: 1935, quality: "Average",        conv_rank: "-" },
    { campaign: "Seg 6 - Quiz (Instant Forms)", ad: "Seg 6 - Quiz 06 Mar 2026",          results: 576,  cpr: 2.86,   spend: 1646.70, freq: 2.69, cpm: 26.56, link_clicks: 1269, lpv: 170,  quality: "-",              conv_rank: "-" },
    { campaign: "Job Portal (Conversions)",     ad: "Ad 06 - Copy",                      results: 439,  cpr: 2.81,   spend: 1234.98, freq: 1.84, cpm: 14.82, link_clicks: 1937, lpv: 1756, quality: "Average",        conv_rank: "-" },
    { campaign: "Job Portal (Conversions)",     ad: "Ad 02 - Copy",                      results: 366,  cpr: 2.41,   spend: 882.90,  freq: 1.69, cpm: 13.64, link_clicks: 1482, lpv: 1361, quality: "Above average",   conv_rank: "-" },
    { campaign: "Job Portal (Conversions)",     ad: "Ad 07",                             results: 294,  cpr: 3.53,   spend: 1036.40, freq: 1.35, cpm: 14.84, link_clicks: 1071, lpv: 956,  quality: "Average",        conv_rank: "-" },
    { campaign: "Job Portal (Conversions)",     ad: "Ad 04",                             results: 123,  cpr: 3.35,   spend: 411.67,  freq: 1.69, cpm: 14.75, link_clicks: 408,  lpv: 369,  quality: "Average",        conv_rank: "-" },
    { campaign: "Seg 3 - Quiz (Instant Forms)", ad: "Seg 3 - Quiz 19 Mar 2026",          results: 121,  cpr: 3.93,   spend: 475.24,  freq: 1.87, cpm: 21.41, link_clicks: 249,  lpv: 34,   quality: "Average",        conv_rank: "Above average" },
    { campaign: "Seg 8 - Job Portal Instant",   ad: "Ad 01 – Copy",                      results: 106,  cpr: 4.97,   spend: 527.18,  freq: 2.02, cpm: 16.99, link_clicks: 361,  lpv: 64,   quality: "Average",        conv_rank: "Above average" },
    { campaign: "Job Portal (Conversions)",     ad: "Ad 06 (inactive)",                  results: 88,   cpr: 3.45,   spend: 303.66,  freq: 1.24, cpm: 13.92, link_clicks: 330,  lpv: 292,  quality: "Average",        conv_rank: "-" },
    { campaign: "Job Portal (Conversions)",     ad: "Ad 01 - Copy",                      results: 77,   cpr: 2.19,   spend: 168.84,  freq: 1.60, cpm: 15.79, link_clicks: 220,  lpv: 215,  quality: "Average",        conv_rank: "-" },
    { campaign: "Seg 4 - Quiz No Cap",          ad: "Seg 4 - Quiz Shorter Form",         results: 75,   cpr: 17.00,  spend: 1274.99, freq: 2.04, cpm: 44.17, link_clicks: 351,  lpv: 30,   quality: "Below average",   conv_rank: "Above average" },
    { campaign: "Seg 2 - Quiz (No caps)",       ad: "Seg 2 - Quiz 06 Mar 2026",          results: 54,   cpr: 14.78,  spend: 797.98,  freq: 2.03, cpm: 17.18, link_clicks: 233,  lpv: 13,   quality: "Below average",   conv_rank: "Above average" },
    { campaign: "Seg 8 - Job Portal Instant",   ad: "Ad 04 – Copy",                      results: 21,   cpr: 3.00,   spend: 63.05,   freq: 1.20, cpm: 16.80, link_clicks: 53,   lpv: 14,   quality: "Average",        conv_rank: "Above average" },
    { campaign: "Seg 8 - Job Portal Instant",   ad: "Ad 03 – Copy",                      results: 14,   cpr: 3.96,   spend: 55.50,   freq: 1.27, cpm: 17.46, link_clicks: 52,   lpv: 6,    quality: "Average",        conv_rank: "Above average" },
    { campaign: "Seg 8 - Job Portal Instant",   ad: "Ad 05 – Copy",                      results: 4,    cpr: 11.68,  spend: 46.73,   freq: 1.53, cpm: 17.76, link_clicks: 25,   lpv: 1,    quality: "Average",        conv_rank: "Above average" }
  ],

  // Traffic ads (Job Portal Traffic)
  trafficAds: [
    { ad: "Ad 06", results: 4537, cpr: 0.578, spend: 2623.60, freq: 1.51, cpm: 7.01, link_clicks: 5202, lpv: 4537, quality: "Average" },
    { ad: "Ad 07", results: 2865, cpr: 0.525, spend: 1505.31, freq: 1.54, cpm: 8.45, link_clicks: 3275, lpv: 2865, quality: "Average" },
    { ad: "Ad 04", results: 1302, cpr: 0.540, spend: 703.47,  freq: 1.44, cpm: 7.01, link_clicks: 1482, lpv: 1302, quality: "Average" },
    { ad: "Ad 03", results: 571,  cpr: 0.461, spend: 263.03,  freq: 1.24, cpm: 7.35, link_clicks: 649,  lpv: 571,  quality: "Below average" },
    { ad: "Ad 05", results: 283,  cpr: 0.385, spend: 109.08,  freq: 1.09, cpm: 4.86, link_clicks: 299,  lpv: 283,  quality: "Below average" },
    { ad: "Ad 01", results: 143,  cpr: 0.602, spend: 86.12,   freq: 1.10, cpm: 6.12, link_clicks: 170,  lpv: 143,  quality: "Below average" },
    { ad: "Ad 02", results: 42,   cpr: 0.543, spend: 22.80,   freq: 1.33, cpm: 6.57, link_clicks: 52,   lpv: 42,   quality: "Below average" }
  ],

  insights: [
    {
      priority: 1,
      type: "critical",
      title: "🚨 Creative Quality Crisis: 61% Below-Average Ads",
      body: "166 of 271 ads carry a 'Below Average' quality ranking. This is a systemic issue suppressing delivery scores and inflating CPM. Hypothesis: Run a creative audit — replace static carousel Seg 04 (LPV rate 39.2%) and all bottom-ranked regional ads. Prioritise formats that have Above Average rankings."
    },
    {
      priority: 2,
      type: "critical",
      title: "📉 LPV Rate 63.9% — Landing Page Drop-off at Scale",
      body: "Account-wide LPV rate is 63.9% (below 70% threshold). Regional content ads are worse — Corio, La Trobe, McEwen, Bendigo, Ballarat all under 45% LPV rate. This indicates ad-to-page mismatch, slow mobile load time, or broken URLs. Test: Run PageSpeed Insights on destination URLs and ensure mobile experience matches ad creative."
    },
    {
      priority: 3,
      type: "opportunity",
      title: "✅ Job Portal (Conversions) is Your Best Performer",
      body: "Seg 8 Job Portal Conversions delivered 2,051 GTM conversions at $2.91/conversion — well below the $5 green threshold. Ad 02 (Above Average quality, $2.41/conv) and Ad 01 Copy ($2.19/conv) are the standout creatives. Hypothesis: Increase budget allocation to this campaign and test new ad variants modelled on Ad 02."
    },
    {
      priority: 4,
      type: "opportunity",
      title: "✅ Seg 6 Quiz: Best CPL at $2.86 Among Form Leads",
      body: "Seg 6 Quiz (Instant Forms) achieved 576 form leads at $2.86 CPL with $1,646 spend. This is the most efficient lead form. Hypothesis: Scale budget from Seg 4 Quiz ($17 CPL) into Seg 6 to capture more volume at proven efficiency."
    },
    {
      priority: 5,
      type: "pause",
      title: "🛑 Pause Seg 4 Quiz (Instant Forms) — $17.00 CPL",
      body: "75 leads at $17.00/lead — 3× the account average, 5× the green benchmark ($5). Below-average quality ranking. CPM of $44.17 is 4.5× the account average. Action: Pause immediately and reallocate budget. Rebuild with improved creative or test a different audience."
    },
    {
      priority: 6,
      type: "warning",
      title: "⚠️ Frequency Creep: 4 Ad Sets Approaching Burnout",
      body: "La Trobe 01 (3.70), Dobell 01 (3.66), McEwen 01 (3.56), Hawke 01 (3.55) all above 3.5 frequency threshold. Audiences are seeing these ads too many times. Action: Swap in new creative variants within the same ad sets to reset frequency without losing learnings."
    },
    {
      priority: 7,
      type: "info",
      title: "ℹ️ Regional Content: Engagement Cheap, but Low LPV Conversion",
      body: "VIC, NSW, QLD regional campaigns are generating post engagements at $1–2 CPE but landing page view rates average 35–50%. If the goal is driving traffic or leads, engagement campaigns are not converting to site visits efficiently. Consider switching to Traffic objective with LPV optimisation for these segments."
    }
  ]
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
function fmt(n, prefix = "", decimals = 2) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return prefix + Number(n).toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function fmtInt(n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return Number(n).toLocaleString("en-AU");
}
function fmtPct(n, decimals = 1) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return (Number(n) * 100).toFixed(decimals) + "%";
}

function cplColor(v) {
  if (v === null || isNaN(v)) return "";
  if (v < dashboardData.benchmarks.cpl.green) return "status-green";
  if (v <= dashboardData.benchmarks.cpl.yellow_max) return "status-amber";
  return "status-red";
}
function cpmColor(v) {
  if (v === null || isNaN(v)) return "";
  if (v < dashboardData.benchmarks.cpm.green) return "status-green";
  if (v <= dashboardData.benchmarks.cpm.yellow_max) return "status-amber";
  return "status-red";
}
function freqColor(v) {
  if (v >= dashboardData.benchmarks.frequency.warn) return "status-red";
  if (v >= 2.5) return "status-amber";
  return "status-green";
}
function lpvColor(v) {
  if (v < 0.5) return "status-red";
  if (v < dashboardData.benchmarks.lpv_rate.warn) return "status-amber";
  return "status-green";
}

// ============================================================
// COUNT-UP ANIMATION
// ============================================================
function countUp(el, target, prefix = "", suffix = "", decimals = 0, duration = 1200) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    el.textContent = prefix + current.toLocaleString("en-AU", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ============================================================
// KPI CARDS
// ============================================================
function renderKPICards() {
  const d = dashboardData.account;
  const cards = [
    { label: "Total Spend", value: d.spend,           prefix: "$", suffix: "",    decimals: 0, sub: "Apr 1 – 24, 2026",         icon: "💰", colorClass: "" },
    { label: "Leads & Convs", value: d.total_results,  prefix: "",  suffix: "",    decimals: 0, sub: "GTM + Form leads combined",  icon: "🎯", colorClass: cplColor(d.blended_cpl) },
    { label: "Cost per Lead", value: d.blended_cpl,    prefix: "$", suffix: "",    decimals: 2, sub: "Blended across conv campaigns",icon: "📊", colorClass: cplColor(d.blended_cpl) },
    { label: "Avg CPM",       value: d.cpm,            prefix: "$", suffix: "",    decimals: 2, sub: "Weighted by spend",           icon: "👁️",  colorClass: cpmColor(d.cpm) },
    { label: "Total Reach",   value: d.reach,          prefix: "",  suffix: "",    decimals: 0, sub: "Unique accounts center",      icon: "📡", colorClass: "" },
  ];

  const container = document.getElementById("kpi-cards");
  container.innerHTML = "";
  cards.forEach((c, i) => {
    const card = document.createElement("div");
    card.className = `kpi-card stagger-${i + 1}`;
    card.innerHTML = `
      <div class="kpi-icon">${c.icon}</div>
      <div class="kpi-label">${c.label}</div>
      <div class="kpi-value ${c.colorClass}" id="kpi-val-${i}">—</div>
      <div class="kpi-sub">${c.sub}</div>
      <div class="kpi-wow">— No WoW data</div>
    `;
    container.appendChild(card);
    setTimeout(() => {
      countUp(document.getElementById(`kpi-val-${i}`), c.value, c.prefix, c.suffix, c.decimals);
    }, i * 150);
  });
}

// ============================================================
// CHARTS
// ============================================================
let charts = {};
function destroyCharts() {
  Object.values(charts).forEach(c => { if (c) c.destroy(); });
  charts = {};
}

const CHART_COLORS = {
  blue:   "#4F6EF7",
  purple: "#8B5CF6",
  cyan:   "#06B6D4",
  green:  "#10B981",
  amber:  "#F59E0B",
  red:    "#EF4444",
  muted:  "#2D2D3A"
};

function initCharts() {
  destroyCharts();

  // 1. Campaign Spend Breakdown (horizontal bar)
  const campSpend = dashboardData.campaigns.filter(c => c.spend > 500).slice(0, 10);
  const ctx1 = document.getElementById("chart-campaign-spend")?.getContext("2d");
  if (ctx1) {
    charts.campSpend = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: campSpend.map(c => c.name.length > 32 ? c.name.slice(0, 32) + "…" : c.name),
        datasets: [{
          label: "Spend (AUD)",
          data: campSpend.map(c => c.spend),
          backgroundColor: campSpend.map(c => {
            if (c.type.includes("Lead") || c.type.includes("Conv")) return CHART_COLORS.cyan;
            if (c.type.includes("Landing")) return CHART_COLORS.purple;
            if (c.type === "Reach") return CHART_COLORS.blue;
            return CHART_COLORS.amber;
          }),
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: "y",
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: ctx => ` $${ctx.raw.toLocaleString("en-AU", {minimumFractionDigits: 2})}` }
          }
        },
        scales: {
          x: { grid: { color: "#1E1E28" }, ticks: { color: "#888", callback: v => "$" + v.toLocaleString() } },
          y: { grid: { display: false }, ticks: { color: "#CCC", font: { size: 11 } } }
        }
      }
    });
  }

  // 2. CPL by Lead Campaign (bar)
  const leadCamps = dashboardData.campaigns.filter(c => c.type.includes("Lead") || c.type.includes("Conv"));
  const ctx2 = document.getElementById("chart-cpl")?.getContext("2d");
  if (ctx2) {
    charts.cpl = new Chart(ctx2, {
      type: "bar",
      data: {
        labels: leadCamps.map(c => c.name.length > 28 ? c.name.slice(0, 28) + "…" : c.name),
        datasets: [{
          label: "Cost per Result (AUD)",
          data: leadCamps.map(c => c.cpr),
          backgroundColor: leadCamps.map(c => {
            if (c.cpr < 5) return CHART_COLORS.green;
            if (c.cpr <= 12) return CHART_COLORS.amber;
            return CHART_COLORS.red;
          }),
          borderRadius: 4, borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: ctx => ` $${ctx.raw.toFixed(2)}` }
          },
          annotation: {}
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#888", font: { size: 10 } } },
          y: { grid: { color: "#1E1E28" }, ticks: { color: "#888", callback: v => "$" + v } }
        }
      }
    });
  }

  // 3. Reach vs Frequency bubble (scatter)
  const ctx3 = document.getElementById("chart-freq")?.getContext("2d");
  if (ctx3) {
    const scatterData = dashboardData.campaigns.map(c => ({
      x: c.freq,
      y: c.cpm,
      r: Math.sqrt(c.spend) / 4,
      label: c.name.slice(0, 25)
    }));
    charts.freq = new Chart(ctx3, {
      type: "bubble",
      data: {
        datasets: [{
          label: "Campaigns",
          data: scatterData,
          backgroundColor: scatterData.map(d =>
            d.x >= 3.5 ? "rgba(239,68,68,0.6)" :
            d.x >= 2.5 ? "rgba(245,158,11,0.6)" :
            "rgba(79,110,247,0.6)"
          ),
          borderColor: "transparent"
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => {
                const d = ctx.raw;
                return `${d.label} | Freq: ${d.x.toFixed(2)} | CPM: $${d.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: "Frequency", color: "#888" },
            grid: { color: "#1E1E28" }, ticks: { color: "#888" }
          },
          y: {
            title: { display: true, text: "CPM (AUD)", color: "#888" },
            grid: { color: "#1E1E28" }, ticks: { color: "#888", callback: v => "$" + v }
          }
        }
      }
    });
  }

  // 4. CPM by Campaign Type (doughnut)
  const ctx4 = document.getElementById("chart-cpm-type")?.getContext("2d");
  if (ctx4) {
    const spendByType = {};
    dashboardData.campaigns.forEach(c => {
      const t = c.type === "[GTM] Job Ad Conv" ? "Conversions" :
                c.type === "Leads (form)" ? "Lead Forms" :
                c.type === "Landing page views" ? "Traffic (LPV)" :
                c.type === "Post engagements" ? "Engagement" : "Reach";
      spendByType[t] = (spendByType[t] || 0) + c.spend;
    });
    charts.cpmType = new Chart(ctx4, {
      type: "doughnut",
      data: {
        labels: Object.keys(spendByType),
        datasets: [{
          data: Object.values(spendByType),
          backgroundColor: [CHART_COLORS.cyan, CHART_COLORS.green, CHART_COLORS.purple, CHART_COLORS.amber, CHART_COLORS.blue],
          borderWidth: 2,
          borderColor: "#111118"
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { position: "bottom", labels: { color: "#AAA", padding: 12, font: { size: 11 } } },
          tooltip: {
            callbacks: { label: ctx => ` $${ctx.raw.toLocaleString("en-AU", {minimumFractionDigits: 0, maximumFractionDigits: 0})} (${(ctx.raw / 112718 * 100).toFixed(1)}%)` }
          }
        }
      }
    });
  }
}

// ============================================================
// AD TABLE
// ============================================================
let adSortCol = "results";
let adSortDir = -1; // -1 = desc

function renderAdTable(filter = "") {
  const tbody = document.getElementById("ad-tbody");
  if (!tbody) return;

  let data = [...dashboardData.ads];
  if (filter) {
    const f = filter.toLowerCase();
    data = data.filter(a => a.ad.toLowerCase().includes(f) || a.campaign.toLowerCase().includes(f));
  }

  data.sort((a, b) => {
    const va = a[adSortCol], vb = b[adSortCol];
    return adSortDir * (va > vb ? 1 : va < vb ? -1 : 0);
  });

  tbody.innerHTML = data.map(a => {
    const lpvRate = a.lpv / a.link_clicks;
    return `<tr>
      <td class="td-campaign">${a.campaign}</td>
      <td class="td-ad">${a.ad}</td>
      <td class="num"><strong>${fmtInt(a.results)}</strong></td>
      <td class="num ${cplColor(a.cpr)}"><strong>$${fmt(a.cpr, "", 2)}</strong></td>
      <td class="num">$${fmt(a.spend, "", 0)}</td>
      <td class="num ${freqColor(a.freq)}">${fmt(a.freq, "", 2)}</td>
      <td class="num ${cpmColor(a.cpm)}">$${fmt(a.cpm, "", 2)}</td>
      <td class="num ${lpvColor(lpvRate)}">${fmtPct(lpvRate)}</td>
      <td><span class="badge ${a.quality.includes("Above") ? "badge-green" : a.quality.includes("Below") ? "badge-red" : "badge-neutral"}">${a.quality === "-" ? "N/A" : a.quality.replace("Below average - ", "")}</span></td>
    </tr>`;
  }).join("");
}

function setupTableSort() {
  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const col = th.dataset.sort;
      if (adSortCol === col) adSortDir *= -1;
      else { adSortCol = col; adSortDir = -1; }
      document.querySelectorAll("th[data-sort]").forEach(t => t.classList.remove("sort-asc", "sort-desc"));
      th.classList.add(adSortDir === 1 ? "sort-asc" : "sort-desc");
      renderAdTable(document.getElementById("ad-search")?.value || "");
    });
  });
}

// ============================================================
// FLAGS
// ============================================================
function renderFlags() {
  const container = document.getElementById("flags-container");
  if (!container) return;
  container.innerHTML = dashboardData.flags.map(f => `
    <div class="flag-card flag-${f.type}">
      <span class="flag-icon">${f.icon}</span>
      <div>
        <div class="flag-title">${f.title}</div>
        <div class="flag-msg">${f.msg}</div>
      </div>
    </div>
  `).join("");
}

// ============================================================
// INSIGHTS
// ============================================================
function renderInsights() {
  const container = document.getElementById("insights-container");
  if (!container) return;
  container.innerHTML = dashboardData.insights.map((ins, i) => `
    <div class="insight-card insight-${ins.type} stagger-${Math.min(i + 1, 6)}">
      <div class="insight-priority">#${ins.priority}</div>
      <div class="insight-title">${ins.title}</div>
      <div class="insight-body">${ins.body}</div>
    </div>
  `).join("");
}

// ============================================================
// CAMPAIGN TABLE
// ============================================================
function renderCampaignTable() {
  const tbody = document.getElementById("campaign-tbody");
  if (!tbody) return;
  const sorted = [...dashboardData.campaigns].sort((a, b) => b.spend - a.spend);
  tbody.innerHTML = sorted.map(c => {
    const lpvRate = c.lpv / c.link_clicks;
    const typeLabel = c.type === "[GTM] Job Ad Conv" ? "Conversions" :
                      c.type === "Leads (form)" ? "Lead Form" :
                      c.type === "Landing page views" ? "Traffic" :
                      c.type === "Post engagements" ? "Engagement" : "Reach";
    const typeClass = typeLabel === "Conversions" ? "badge-cyan" :
                      typeLabel === "Lead Form" ? "badge-green" :
                      typeLabel === "Traffic" ? "badge-purple" :
                      typeLabel === "Engagement" ? "badge-amber" : "badge-blue";
    return `<tr>
      <td>${c.name.length > 40 ? c.name.slice(0, 40) + "…" : c.name}</td>
      <td><span class="badge ${typeClass}">${typeLabel}</span></td>
      <td class="num">$${fmt(c.spend, "", 0)}</td>
      <td class="num">${fmtInt(c.results)}</td>
      <td class="num ${cplColor(c.cpr)}">$${fmt(c.cpr, "", 2)}</td>
      <td class="num ${cpmColor(c.cpm)}">$${fmt(c.cpm, "", 2)}</td>
      <td class="num ${freqColor(c.freq)}">${fmt(c.freq, "", 2)}</td>
      <td class="num ${lpvColor(lpvRate)}">${fmtPct(lpvRate)}</td>
      <td><span class="badge ${c.status === 'active' ? 'badge-green' : 'badge-neutral'}">${c.status}</span></td>
    </tr>`;
  }).join("");
}

// ============================================================
// NAV
// ============================================================
function setupNav() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      const target = item.dataset.section;
      document.querySelectorAll(".section").forEach(s => s.classList.remove("active-section"));
      const sec = document.getElementById("section-" + target);
      if (sec) {
        sec.classList.add("active-section");
        sec.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Populate meta
  document.getElementById("account-name").textContent = dashboardData.meta.account;
  document.getElementById("period-label").textContent = dashboardData.meta.period;
  document.getElementById("attr-label").textContent = dashboardData.meta.attribution;

  renderKPICards();
  renderFlags();
  renderInsights();
  renderCampaignTable();
  renderAdTable();
  setupTableSort();
  setupNav();

  // Charts after small delay for layout
  setTimeout(initCharts, 200);

  // Search
  document.getElementById("ad-search")?.addEventListener("input", e => {
    renderAdTable(e.target.value);
  });
});
