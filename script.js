/* ─────────────────────────────────────────────────────────────────────────────
   script.js  —  MCA Facebook Ads Dashboard
   Vanilla JS: search, filters, sorting, pagination, Chart.js, week selector
   ───────────────────────────────────────────────────────────────────────────── */

/* ── GLOBALS ──────────────────────────────────────────────────────────────── */
let selectedWeek   = 'w4';     // default: last full week
let cplChartInst   = null;
let barChartInst   = null;
let trendChartInst = null;
let leadCplInst    = null;
let leadVolInst    = null;
let reachChartInst = null;
let cpmChartInst   = null;

let currentBarMetric = 'spend';
let currentCPLView   = 'daily';

let tableData        = [];
let tableSortKey     = 'spend';
let tableSortAsc     = false;
let currentPage      = 1;
const PAGE_SIZE      = 8;
const WEEK_KEYS      = ['w1','w2','w3','w4','tw'];

// Chart.js global defaults
Chart.defaults.color          = '#8A8A9A';
Chart.defaults.font.family    = 'Inter, system-ui, sans-serif';
Chart.defaults.font.size      = 11;
Chart.defaults.plugins.legend.labels.boxWidth = 10;
Chart.defaults.plugins.legend.labels.padding  = 14;

/* ── UTILS ────────────────────────────────────────────────────────────────── */
const fmt = {
  aud:   v => v == null ? '—' : `$${Number(v).toLocaleString('en-AU', {minimumFractionDigits: 0, maximumFractionDigits: 0})}`,
  aud2:  v => v == null ? '—' : `$${Number(v).toFixed(2)}`,
  num:   v => v == null ? '—' : Number(v).toLocaleString('en-AU'),
  pct:   v => v == null ? '—' : `${Number(v).toFixed(1)}%`,
  freq:  v => v == null ? '—' : `${Number(v).toFixed(2)}×`,
  delta: (cur, prev, invert) => {
    if (!cur || !prev || prev === 0) return null;
    const pct = ((cur - prev) / Math.abs(prev)) * 100;
    return { pct: pct.toFixed(1), positive: invert ? pct < 0 : pct > 0 };
  }
};

function animateNumber(el, target, prefix='', decimals=0, dur=900) {
  if (target === null || isNaN(target)) { el.textContent = prefix + '—'; return; }
  const start = 0;
  const step  = ts => {
    if (!step.startTime) step.startTime = ts;
    const p = Math.min((ts - step.startTime) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val  = start + (target - start) * ease;
    el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString('en-AU'));
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (decimals ? Number(target).toFixed(decimals) : Number(target).toLocaleString('en-AU'));
  };
  requestAnimationFrame(step);
}

function deltaClass(pct, positive) {
  if (positive) return 'up';
  return 'down';
}

function getWeekData(campaignId, weekKey) {
  const c = dashboardData.campaigns.find(c => c.id === campaignId);
  return c ? (c.weekly[weekKey] || {}) : {};
}

function getWeekSummary(weekKey) {
  return dashboardData.weekly[weekKey] || {};
}

function getPrevKey(weekKey) {
  const idx = WEEK_KEYS.indexOf(weekKey);
  return idx > 0 ? WEEK_KEYS[idx - 1] : null;
}

/* ── SECTION NAVIGATION ───────────────────────────────────────────────────── */
const sectionTitles = {
  overview:  'Account Overview',
  leadgen:   'Lead Generation',
  awareness: 'Reach & Awareness',
  campaigns: 'All Campaigns',
  alerts:    'Alerts & Actions',
  recos:     'Recommendations'
};

function showSection(name, el) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('section-' + name).classList.add('visible');
  if (el) el.classList.add('active');
  document.getElementById('pageTitle').textContent = sectionTitles[name] || name;
  renderSection(name);
}

function renderSection(name) {
  switch (name) {
    case 'overview':  renderOverview();   break;
    case 'leadgen':   renderLeadGen();    break;
    case 'awareness': renderAwareness();  break;
    case 'campaigns': renderCampaigns();  break;
    case 'alerts':    renderAlerts();     break;
    case 'recos':     renderRecos();      break;
  }
}

/* ── WEEK SELECTOR ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('weekSelector').addEventListener('change', function() {
    selectedWeek = this.value;
    const activeSec = document.querySelector('.page-section.visible');
    if (activeSec) renderSection(activeSec.id.replace('section-', ''));
  });

  document.getElementById('searchInput').addEventListener('input', function() {
    applySearchAndFilter();
  });

  document.getElementById('typeFilter').addEventListener('change', function() {
    applySearchAndFilter();
  });

  // Init
  renderOverview();
  renderAlerts();
  renderRecos();
});

/* ── OVERVIEW ─────────────────────────────────────────────────────────────── */
function renderOverview() {
  const w    = getWeekSummary(selectedWeek);
  const prev = getWeekSummary(getPrevKey(selectedWeek));

  // KPI Cards
  const kpiData = [
    { label: 'Total Spend',       value: w.spend,           prev: prev.spend,     prefix: '$', fmt: 'aud',  delta_invert: false, color: '#4F6EF7' },
    { label: 'Total Leads',       value: w.leads,           prev: prev.leads,     prefix: '',  fmt: 'num',  delta_invert: false, color: '#10B981' },
    { label: 'True CPL',          value: w.trueLeadGenCPL,  prev: prev.trueLeadGenCPL, prefix: '$', fmt: 'aud2', delta_invert: true, color: '#F59E0B' },
    { label: 'CPM',               value: w.cpm,             prev: prev.cpm,       prefix: '$', fmt: 'aud2', delta_invert: true,  color: '#8B5CF6' },
    { label: 'Total Reach',       value: w.reach,           prev: prev.reach,     prefix: '',  fmt: 'num',  delta_invert: false, color: '#06B6D4' },
  ];

  const grid = document.getElementById('kpiGrid');
  grid.innerHTML = kpiData.map((k, i) => {
    const d = fmt.delta(k.value, k.prev, k.delta_invert);
    const dClass = d ? (d.positive ? (k.delta_invert ? 'good-down' : 'up') : (k.delta_invert ? 'bad-up' : 'down')) : 'neutral';
    const dText  = d ? `${d.positive ? '▲' : '▼'} ${Math.abs(d.pct)}%` : 'N/A';
    const sparkVals = WEEK_KEYS.map(wk => {
      const ws = getWeekSummary(wk);
      return k.fmt === 'aud2' ? ws[Object.keys(ws).find(kk => kk.includes('CPL') || kk === 'cpm') || 'cpm'] : ws[k.label.toLowerCase().replace(/ /g,'')];
    });
    return `<div class="kpi-card" style="animation-delay:${i*0.05+0.05}s">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value count-animate" id="kpi-val-${i}" style="color:${k.color}">—</div>
      <div class="kpi-footer">
        <span class="kpi-delta ${dClass}">${dText}</span>
        <svg class="kpi-sparkline" id="kpi-spark-${i}" viewBox="0 0 80 28"></svg>
      </div>
    </div>`;
  }).join('');

  // Animate numbers
  kpiData.forEach((k, i) => {
    const el = document.getElementById('kpi-val-' + i);
    if (k.fmt === 'aud2') animateNumber(el, k.value, '$', 2);
    else animateNumber(el, k.value, k.fmt === 'aud' ? '$' : '');
    drawSparkline('kpi-spark-' + i, WEEK_KEYS.map(wk => {
      const s = getWeekSummary(wk);
      const keyMap = { 'Total Spend': 'spend', 'Total Leads': 'leads', 'True CPL': 'trueLeadGenCPL', 'CPM': 'cpm', 'Total Reach': 'reach' };
      return s[keyMap[k.label]];
    }), k.color);
  });

  // Stat row
  const statRow = document.getElementById('statRow');
  statRow.innerHTML = [
    { label: 'Impressions',    value: fmt.num(w.impressions),   sub: 'vs ' + fmt.num(prev.impressions) + ' prev' },
    { label: 'Avg Frequency',  value: fmt.freq(w.frequency),    sub: 'target < 3.5×' },
    { label: 'Link Clicks',    value: fmt.num(w.linkClicks),    sub: 'vs ' + fmt.num(prev.linkClicks) + ' prev' },
    { label: 'Landing Page Views', value: fmt.num(w.lpv),       sub: 'LPV rate ~' + (w.lpv && w.linkClicks ? Math.round(w.lpv/w.linkClicks*100) + '%' : '—') }
  ].map((s,i) => `
    <div class="stat-mini" style="animation-delay:${i*0.05+0.35}s">
      <div class="stat-mini-label">${s.label}</div>
      <div class="stat-mini-value">${s.value}</div>
      <div class="stat-mini-sub">${s.sub}</div>
    </div>`).join('');

  buildCPLChart();
  buildBarChart();
  buildTrendChart();
}

/* ── LEAD GEN SECTION ─────────────────────────────────────────────────────── */
function renderLeadGen() {
  const lgCampaigns = dashboardData.campaigns.filter(c => c.type === 'lead_gen');
  const w    = getWeekSummary(selectedWeek);
  const prev = getWeekSummary(getPrevKey(selectedWeek));

  // KPI grid — lead-gen specific
  const totalLeads  = lgCampaigns.reduce((s,c) => s + (c.weekly[selectedWeek]?.leads || 0), 0);
  const totalSpend  = lgCampaigns.reduce((s,c) => s + (c.weekly[selectedWeek]?.spend || 0), 0);
  const avgCPL      = totalLeads ? (totalSpend / totalLeads) : null;
  const prevLeads   = lgCampaigns.reduce((s,c) => s + (c.weekly[getPrevKey(selectedWeek)]?.leads || 0), 0);
  const prevSpend   = lgCampaigns.reduce((s,c) => s + (c.weekly[getPrevKey(selectedWeek)]?.spend || 0), 0);
  const prevCPL     = prevLeads ? prevSpend / prevLeads : null;

  const kpis = [
    { label: 'Lead-Gen Spend', value: totalSpend,  prev: prevSpend,  color: '#4F6EF7', invert: false, fmtFn: v => '$' + Math.round(v).toLocaleString() },
    { label: 'Total Leads',    value: totalLeads,  prev: prevLeads,  color: '#10B981', invert: false, fmtFn: v => Math.round(v).toLocaleString() },
    { label: 'Blended CPL',    value: avgCPL,      prev: prevCPL,    color: '#F59E0B', invert: true,  fmtFn: v => '$' + Number(v).toFixed(2) },
    { label: 'Best CPL',       value: Math.min(...lgCampaigns.map(c => c.weekly[selectedWeek]?.cpl).filter(Boolean)), prev: null, color: '#10B981', invert: true, fmtFn: v => '$' + Number(v).toFixed(2) },
    { label: 'Total Impressions (LG)', value: lgCampaigns.reduce((s,c) => s + (c.weekly[selectedWeek]?.impressions || 0), 0), prev: null, color: '#8B5CF6', invert: false, fmtFn: v => Math.round(v).toLocaleString() }
  ];

  document.getElementById('leadKpiGrid').innerHTML = kpis.map((k,i) => {
    const d = fmt.delta(k.value, k.prev, k.invert);
    const dText = d ? `${d.positive ? '▲' : '▼'} ${Math.abs(d.pct)}%` : '—';
    const dClass = d ? (d.positive ? 'up' : 'down') : 'neutral';
    return `<div class="kpi-card" style="animation-delay:${i*0.05+0.05}s">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value" style="color:${k.color}">${k.value != null ? k.fmtFn(k.value) : '—'}</div>
      <div class="kpi-footer"><span class="kpi-delta ${dClass}">${dText}</span></div>
    </div>`;
  }).join('');

  buildLeadCPLWeeklyChart(lgCampaigns);
  buildLeadVolumeChart(lgCampaigns);
  renderCampaignCards('leadCampaignGrid', lgCampaigns);
}

/* ── AWARENESS SECTION ───────────────────────────────────────────────────── */
function renderAwareness() {
  const awCampaigns = dashboardData.campaigns.filter(c => c.type === 'awareness' || c.type === 'traffic');
  const w    = getWeekSummary(selectedWeek);
  const prev = getWeekSummary(getPrevKey(selectedWeek));

  const kpis = [
    { label: 'Total Reach',      value: w.reach,        prev: prev.reach,       color: '#06B6D4', invert: false, fmtFn: v => Number(v).toLocaleString() },
    { label: 'Impressions',      value: w.impressions,  prev: prev.impressions, color: '#4F6EF7', invert: false, fmtFn: v => Number(v).toLocaleString() },
    { label: 'Avg CPM',          value: w.cpm,          prev: prev.cpm,         color: '#8B5CF6', invert: true,  fmtFn: v => '$' + Number(v).toFixed(2) },
    { label: 'Avg Frequency',    value: w.frequency,    prev: prev.frequency,   color: '#F59E0B', invert: true,  fmtFn: v => Number(v).toFixed(2) + '×' },
    { label: 'Awareness Spend',  value: w.spend,        prev: prev.spend,       color: '#EF4444', invert: false, fmtFn: v => '$' + Math.round(v).toLocaleString() },
  ];

  document.getElementById('awarenessKpiGrid').innerHTML = kpis.map((k,i) => {
    const d = fmt.delta(k.value, k.prev, k.invert);
    const dText = d ? `${d.positive ? '▲' : '▼'} ${Math.abs(d.pct)}%` : '—';
    const dClass = d ? (d.positive ? 'up' : 'down') : 'neutral';
    return `<div class="kpi-card" style="animation-delay:${i*0.05+0.05}s">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value" style="color:${k.color}">${k.value != null ? k.fmtFn(k.value) : '—'}</div>
      <div class="kpi-footer"><span class="kpi-delta ${dClass}">${dText}</span></div>
    </div>`;
  }).join('');

  buildReachChart();
  buildCPMChart();
  renderCampaignCards('awarenessCampaignGrid', awCampaigns);
}

/* ── CAMPAIGN CARDS ──────────────────────────────────────────────────────── */
function renderCampaignCards(containerId, campaigns) {
  const container = document.getElementById(containerId);
  const wk  = selectedWeek;
  const pwk = getPrevKey(wk);
  container.innerHTML = campaigns.map((c, i) => {
    const d  = c.weekly[wk]  || {};
    const pd = c.weekly[pwk] || {};
    const cpl = d.cpl != null ? '$' + Number(d.cpl).toFixed(2) : '—';
    const cpm = d.cpm != null ? '$' + Number(d.cpm).toFixed(2) : '—';
    const spendSpark = WEEK_KEYS.map(k => c.weekly[k]?.spend || 0);
    const sparkColor = c.type === 'lead_gen' ? '#10B981' : c.type === 'traffic' ? '#F59E0B' : '#4F6EF7';
    const spendWoW = fmt.delta(d.spend, pd.spend, false);
    const spendWoWHtml = spendWoW ? `<span style="font-size:0.7rem;color:${spendWoW.positive ? 'var(--success)' : 'var(--danger)'};">${spendWoW.positive ? '▲' : '▼'}${Math.abs(spendWoW.pct)}%</span>` : '';
    return `
    <div class="campaign-card searchable-item" data-name="${c.name.toLowerCase()}" data-type="${c.type}" style="animation-delay:${i*0.04+0.1}s">
      <div class="campaign-card-header">
        <div class="campaign-type-dot ${c.type}"></div>
        <div class="campaign-name">${c.name}</div>
        <div class="campaign-status">${c.status || 'Active'}</div>
      </div>
      <div class="campaign-metrics">
        <div class="campaign-metric-item">
          <label>Spend</label>
          <div class="metric-val">${fmt.aud(d.spend)} ${spendWoWHtml}</div>
        </div>
        <div class="campaign-metric-item">
          <label>${c.type === 'lead_gen' ? 'Leads' : 'Reach'}</label>
          <div class="metric-val">${c.type === 'lead_gen' ? (d.leads || '0') : fmt.num(d.reach)}</div>
        </div>
        <div class="campaign-metric-item">
          <label>CPL</label>
          <div class="metric-val">${c.type === 'lead_gen' ? cpl : '—'}</div>
        </div>
        <div class="campaign-metric-item">
          <label>CPM</label>
          <div class="metric-val">${cpm}</div>
        </div>
      </div>
      <div class="campaign-sparkline-wrap">
        <label>Spend Trend (5 weeks)</label>
        <svg class="campaign-sparkline" id="cspk-${containerId}-${i}" viewBox="0 0 160 36"></svg>
      </div>
      ${c.flag ? `<div class="campaign-flag">⚠️ ${c.flag}</div>` : ''}
    </div>`;
  }).join('') || '<div class="empty-state"><div class="empty-icon">📭</div><p>No campaigns found.</p></div>';

  // Draw sparklines
  campaigns.forEach((c, i) => {
    const vals = WEEK_KEYS.map(k => c.weekly[k]?.spend || 0);
    const color = c.type === 'lead_gen' ? '#10B981' : c.type === 'traffic' ? '#F59E0B' : '#4F6EF7';
    drawSparklineSVG(`cspk-${containerId}-${i}`, vals, color, 160, 36);
  });
}

/* ── CAMPAIGNS TABLE ─────────────────────────────────────────────────────── */
function renderCampaigns() {
  const wk  = selectedWeek;
  const pwk = getPrevKey(wk);
  tableData = dashboardData.campaigns.map(c => {
    const d  = c.weekly[wk]  || {};
    const pd = c.weekly[pwk] || {};
    const wowSpend = fmt.delta(d.spend, pd.spend, false);
    return {
      name:        c.name,
      type:        c.type,
      spend:       d.spend   || 0,
      impressions: d.impressions || 0,
      reach:       d.reach   || 0,
      frequency:   d.frequency || 0,
      cpm:         d.cpm     || 0,
      leads:       d.leads   || 0,
      cpl:         d.cpl     || null,
      wow:         wowSpend ? parseFloat(wowSpend.pct) : 0,
      wowPos:      wowSpend ? wowSpend.positive : null,
      flag:        c.flag || null
    };
  });

  sortTableBy(tableSortKey, false);
  renderTablePage();
}

function sortTableBy(key, toggle = true) {
  if (toggle && tableSortKey === key) tableSortAsc = !tableSortAsc;
  else if (toggle) { tableSortKey = key; tableSortAsc = ['name','type'].includes(key); }
  else { tableSortKey = key; }

  tableData.sort((a, b) => {
    let va = a[key], vb = b[key];
    if (va == null) va = tableSortAsc ? Infinity : -Infinity;
    if (vb == null) vb = tableSortAsc ? Infinity : -Infinity;
    if (typeof va === 'string') return tableSortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    return tableSortAsc ? va - vb : vb - va;
  });

  document.querySelectorAll('thead th').forEach(th => th.classList.remove('sorted'));
  currentPage = 1;
  renderTablePage();
}

function renderTablePage() {
  const search  = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const typeF   = document.getElementById('campaignTypeFilter')?.value || '';
  const filtered = tableData.filter(r => {
    const matchS = !search  || r.name.toLowerCase().includes(search);
    const matchT = !typeF   || r.type === typeF;
    return matchS && matchT;
  });

  const total  = filtered.length;
  const pages  = Math.ceil(total / PAGE_SIZE);
  const slice  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const tbody = document.getElementById('campaignTableBody');
  if (!tbody) return;

  if (slice.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10"><div class="empty-state"><div class="empty-icon">🔍</div><p>No campaigns match your search.</p></div></td></tr>`;
  } else {
    tbody.innerHTML = slice.map(r => {
      const cplClass = !r.cpl ? 'na' : r.cpl < 10 ? 'green' : r.cpl < 30 ? 'yellow' : 'red';
      const cplText  = r.cpl ? '$' + r.cpl.toFixed(2) : '—';
      const deltaHtml = r.wowPos === null ? '—' : `<span class="delta-cell ${r.wowPos ? 'up' : 'down'}">${r.wowPos ? '▲' : '▼'}${Math.abs(r.wow).toFixed(1)}%</span>`;
      const freqFlag = r.frequency > 3.5 ? ' style="color:var(--danger)"' : r.frequency > 2.0 ? ' style="color:var(--warning)"' : '';
      return `<tr class="searchable-item" data-name="${r.name.toLowerCase()}" data-type="${r.type}">
        <td class="td-name" title="${r.name}">${r.flag ? '⚠️ ' : ''}${r.name}</td>
        <td><span class="type-pill ${r.type}">${r.type.replace('_',' ')}</span></td>
        <td>${fmt.aud(r.spend)}</td>
        <td>${fmt.num(r.impressions)}</td>
        <td>${fmt.num(r.reach)}</td>
        <td${freqFlag}>${r.frequency ? r.frequency.toFixed(2) + '×' : '—'}</td>
        <td>${r.cpm ? '$' + r.cpm.toFixed(2) : '—'}</td>
        <td>${r.leads || '—'}</td>
        <td class="cpl-cell ${cplClass}">${cplText}</td>
        <td>${deltaHtml}</td>
      </tr>`;
    }).join('');
  }

  // Pagination
  const pg = document.getElementById('tablePagination');
  if (!pg) return;
  let html = `<span class="pagination-info">${total} campaigns · Page ${currentPage} of ${pages}</span>`;
  html += `<button onclick="goPage(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''}>‹ Prev</button>`;
  for (let p = 1; p <= pages; p++) {
    if (pages <= 7 || Math.abs(p - currentPage) <= 2 || p === 1 || p === pages) {
      html += `<button class="${p === currentPage ? 'active' : ''}" onclick="goPage(${p})">${p}</button>`;
    } else if (Math.abs(p - currentPage) === 3) {
      html += `<button disabled>…</button>`;
    }
  }
  html += `<button onclick="goPage(${currentPage + 1})" ${currentPage >= pages ? 'disabled' : ''}>Next ›</button>`;
  pg.innerHTML = html;
}

function goPage(n) {
  const max = Math.ceil(tableData.length / PAGE_SIZE);
  currentPage = Math.max(1, Math.min(n, max));
  renderTablePage();
}

function filterTable() { currentPage = 1; renderTablePage(); }

/* ── SEARCH & FILTER ─────────────────────────────────────────────────────── */
function applySearchAndFilter() {
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const typeF  = document.getElementById('typeFilter')?.value || '';

  // Filter campaign cards (searchable-item class)
  document.querySelectorAll('.searchable-item').forEach(el => {
    const name = el.dataset.name || '';
    const type = el.dataset.type || '';
    const ms = !search || name.includes(search);
    const mt = !typeF  || type === typeF;
    el.style.display = (ms && mt) ? '' : 'none';
  });

  // If on campaigns section, rerender table too
  const activeSec = document.querySelector('.page-section.visible');
  if (activeSec && activeSec.id === 'section-campaigns') renderTablePage();
}

/* ── ALERTS ──────────────────────────────────────────────────────────────── */
function renderAlerts() {
  const grid = document.getElementById('alertsGrid');
  grid.innerHTML = dashboardData.alerts.map((a, i) => `
    <div class="alert-card ${a.type}" style="animation-delay:${i*0.06}s">
      <div class="alert-icon">${a.icon}</div>
      <div class="alert-body">
        <div class="alert-title">${a.title}</div>
        <div class="alert-message">${a.message}</div>
        <span class="alert-action">→ ${a.action}</span>
      </div>
    </div>`).join('');

  document.getElementById('alertBadge').textContent = dashboardData.alerts.length;
}

/* ── RECOMMENDATIONS ─────────────────────────────────────────────────────── */
function renderRecos() {
  document.getElementById('recoList').innerHTML = dashboardData.recommendations.map((r, i) => `
    <div class="reco-row" style="animation-delay:${i*0.05}s">
      <div><div class="priority-badge">${r.priority}</div></div>
      <div class="reco-content">
        <div class="reco-title">${r.title}</div>
        <div class="reco-desc">${r.description}</div>
      </div>
      <div><span class="effort-pill ${r.effort}">${r.effort}</span></div>
      <div><span class="impact-pill ${r.impact}">${r.impact}</span></div>
    </div>`).join('');
}

/* ── SPARKLINE SVG ───────────────────────────────────────────────────────── */
function drawSparkline(svgId, values, color) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const w = 80, h = 28;
  drawSparklineSVG(svgId, values, color, w, h);
}

function drawSparklineSVG(svgId, values, color, w, h) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  const valid = values.filter(v => v != null && !isNaN(v) && v > 0);
  if (valid.length < 2) { svg.innerHTML = ''; return; }
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;
  const pad = 2;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = pad + (1 - ((v || 0) - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const filled = [...pts, `${w - pad},${h - pad}`, `${pad},${h - pad}`].join(' ');
  svg.innerHTML = `
    <defs><linearGradient id="sg${svgId}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon points="${filled}" fill="url(#sg${svgId})" />
    <polyline points="${pts.join(' ')}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="${pts[pts.length-1].split(',')[0]}" cy="${pts[pts.length-1].split(',')[1]}" r="2.5" fill="${color}"/>`;
}

/* ── CHART HELPERS ───────────────────────────────────────────────────────── */
const chartOpts = (xLabels, yLabel, stack) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { padding: 16, boxWidth: 10 } },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A' } },
    y: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A',
         callback: v => yLabel === '$' ? '$' + v.toLocaleString() : v.toLocaleString() },
      stacked: !!stack }
  },
  animation: { duration: 600, easing: 'easeInOutQuart' }
});

function destroyChart(inst) {
  if (inst) { try { inst.destroy(); } catch(e){} }
}

/* ── CPL CHART ───────────────────────────────────────────────────────────── */
function buildCPLChart() {
  destroyChart(cplChartInst);
  const ctx = document.getElementById('cplChart');
  if (!ctx) return;

  if (currentCPLView === 'daily') {
    const data = dashboardData.dailyCPL;
    cplChartInst = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.date),
        datasets: [{
          label: 'True CPL (AUD)',
          data: data.map(d => d.cpl),
          borderColor: '#10B981',
          backgroundColor: '#10B98115',
          fill: true,
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5
        }, {
          label: 'Daily Leads',
          data: data.map(d => d.leads),
          borderColor: '#4F6EF7',
          backgroundColor: 'transparent',
          borderDash: [4, 3],
          tension: 0.4,
          pointRadius: 0,
          yAxisID: 'y2'
        }]
      },
      options: {
        ...chartOpts(null, '$'),
        scales: {
          x: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A', maxTicksLimit: 10 } },
          y: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A', callback: v => '$'+v } },
          y2: { position: 'right', grid: { display: false }, ticks: { color: '#4F6EF7' } }
        }
      }
    });
  } else {
    const wkLabels = WEEK_KEYS.map(k => dashboardData.weekly[k].dateRange);
    cplChartInst = new Chart(ctx, {
      type: 'line',
      data: {
        labels: wkLabels,
        datasets: [{
          label: 'Blended CPL',
          data: WEEK_KEYS.map(k => dashboardData.weekly[k].blendedCPL),
          borderColor: '#EF4444', backgroundColor: '#EF444415', fill: true, tension: 0.4
        }, {
          label: 'True Lead-Gen CPL',
          data: WEEK_KEYS.map(k => dashboardData.weekly[k].trueLeadGenCPL),
          borderColor: '#10B981', backgroundColor: 'transparent', tension: 0.4, borderDash: [5,3]
        }]
      },
      options: { ...chartOpts(null, '$'), scales: {
        x: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A' } },
        y: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A', callback: v => '$'+v } }
      }}
    });
  }
}

function setCPLView(view, btn) {
  currentCPLView = view;
  document.querySelectorAll('.chart-toggle button').forEach(b => {
    if (b.parentElement === btn.parentElement) b.classList.remove('active');
  });
  btn.classList.add('active');
  buildCPLChart();
}

/* ── BAR CHART ───────────────────────────────────────────────────────────── */
function buildBarChart() {
  destroyChart(barChartInst);
  const ctx = document.getElementById('barChart');
  if (!ctx) return;

  const wk  = selectedWeek;
  const sorted = [...dashboardData.campaigns]
    .filter(c => c.weekly[wk]?.spend > 0)
    .sort((a, b) => (b.weekly[wk]?.spend || 0) - (a.weekly[wk]?.spend || 0))
    .slice(0, 8);

  const colors = ['#4F6EF7','#10B981','#F59E0B','#8B5CF6','#EF4444','#06B6D4','#EC4899','#84CC16'];
  const metricKey = currentBarMetric;
  const yPfx = metricKey === 'cpm' || metricKey === 'spend' ? '$' : '';

  barChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map(c => c.name.length > 24 ? c.name.substring(0, 22) + '…' : c.name),
      datasets: [{
        data: sorted.map(c => c.weekly[wk]?.[metricKey] || 0),
        backgroundColor: sorted.map((_, i) => colors[i % colors.length] + 'CC'),
        borderColor: sorted.map((_, i) => colors[i % colors.length]),
        borderWidth: 1,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: {
        label: ctx => ` ${yPfx}${Number(ctx.raw).toLocaleString()}`
      }}},
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8A8A9A', maxRotation: 35, font: { size: 10 } } },
        y: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A', callback: v => yPfx + v.toLocaleString() } }
      },
      animation: { duration: 600 }
    }
  });
}

function setBarMetric(metric, btn) {
  currentBarMetric = metric;
  document.querySelectorAll('.chart-toggle button').forEach(b => {
    if (b.parentElement === btn.parentElement) b.classList.remove('active');
  });
  btn.classList.add('active');
  buildBarChart();
}

/* ── TREND CHART ─────────────────────────────────────────────────────────── */
function buildTrendChart() {
  destroyChart(trendChartInst);
  const ctx = document.getElementById('trendChart');
  if (!ctx) return;

  const labels = WEEK_KEYS.map(k => dashboardData.weekly[k].dateRange);
  trendChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Total Spend (AUD)',
        data: WEEK_KEYS.map(k => dashboardData.weekly[k].spend),
        borderColor: '#4F6EF7', backgroundColor: '#4F6EF715', fill: true, tension: 0.4, yAxisID: 'y'
      }, {
        label: 'Total Reach',
        data: WEEK_KEYS.map(k => dashboardData.weekly[k].reach),
        borderColor: '#10B981', backgroundColor: 'transparent', tension: 0.4, yAxisID: 'y2'
      }, {
        label: 'Leads',
        data: WEEK_KEYS.map(k => dashboardData.weekly[k].leads),
        borderColor: '#F59E0B', backgroundColor: 'transparent', tension: 0.4, borderDash: [5,3], yAxisID: 'y3'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A' } },
        y:  { grid: { color: '#2A2A38' }, ticks: { color: '#4F6EF7', callback: v => '$' + (v/1000).toFixed(0) + 'K' }, position: 'left' },
        y2: { grid: { display: false }, ticks: { color: '#10B981', callback: v => (v/1000000).toFixed(1) + 'M' }, position: 'right' },
        y3: { grid: { display: false }, ticks: { color: '#F59E0B' }, position: 'right' }
      },
      animation: { duration: 700 }
    }
  });
}

/* ── LEAD CPL WEEKLY CHART ───────────────────────────────────────────────── */
function buildLeadCPLWeeklyChart(lgCampaigns) {
  destroyChart(leadCplInst);
  const ctx = document.getElementById('leadCplWeeklyChart');
  if (!ctx) return;
  const labels = WEEK_KEYS.map(k => dashboardData.weekly[k].dateRange);
  const colors = ['#10B981','#4F6EF7','#F59E0B','#8B5CF6'];
  leadCplInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: lgCampaigns.map((c, i) => ({
        label: c.name.length > 28 ? c.name.substring(0, 26) + '…' : c.name,
        data: WEEK_KEYS.map(k => c.weekly[k]?.cpl || null),
        borderColor: colors[i % colors.length],
        backgroundColor: 'transparent',
        tension: 0.4, pointRadius: 4
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false,
        callbacks: { label: ctx => ` CPL: $${ctx.raw?.toFixed(2) || '—'}` }
      }},
      scales: {
        x: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A' } },
        y: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A', callback: v => '$' + v } }
      }
    }
  });
}

/* ── LEAD VOLUME CHART ───────────────────────────────────────────────────── */
function buildLeadVolumeChart(lgCampaigns) {
  destroyChart(leadVolInst);
  const ctx = document.getElementById('leadVolumeChart');
  if (!ctx) return;
  const colors = ['#10B981','#4F6EF7','#F59E0B'];
  leadVolInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: WEEK_KEYS.map(k => dashboardData.weekly[k].dateRange),
      datasets: lgCampaigns.map((c, i) => ({
        label: c.name.length > 24 ? c.name.substring(0,22) + '…' : c.name,
        data: WEEK_KEYS.map(k => c.weekly[k]?.leads || 0),
        backgroundColor: colors[i % colors.length] + 'BB',
        borderRadius: 4
      }))
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8A8A9A' }, stacked: true },
        y: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A' }, stacked: true }
      }
    }
  });
}

/* ── REACH CHART ─────────────────────────────────────────────────────────── */
function buildReachChart() {
  destroyChart(reachChartInst);
  const ctx = document.getElementById('reachChart');
  if (!ctx) return;
  reachChartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: WEEK_KEYS.map(k => dashboardData.weekly[k].dateRange),
      datasets: [{
        label: 'Total Reach',
        data: WEEK_KEYS.map(k => dashboardData.weekly[k].reach),
        backgroundColor: '#4F6EF7BB', borderRadius: 6
      }, {
        label: 'Total Impressions',
        data: WEEK_KEYS.map(k => dashboardData.weekly[k].impressions),
        backgroundColor: '#06B6D4BB', borderRadius: 6
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' }, tooltip: { mode: 'index', intersect: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#8A8A9A' } },
        y: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A', callback: v => (v/1000000).toFixed(1) + 'M' } }
      }
    }
  });
}

/* ── CPM TREND CHART ─────────────────────────────────────────────────────── */
function buildCPMChart() {
  destroyChart(cpmChartInst);
  const ctx = document.getElementById('cpmChart');
  if (!ctx) return;
  cpmChartInst = new Chart(ctx, {
    type: 'line',
    data: {
      labels: WEEK_KEYS.map(k => dashboardData.weekly[k].dateRange),
      datasets: [{
        label: 'Avg CPM (AUD)',
        data: WEEK_KEYS.map(k => dashboardData.weekly[k].cpm),
        borderColor: '#8B5CF6', backgroundColor: '#8B5CF615', fill: true, tension: 0.4, pointRadius: 5
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` CPM: $${c.raw?.toFixed(2)}` } } },
      scales: {
        x: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A' } },
        y: { grid: { color: '#2A2A38' }, ticks: { color: '#8A8A9A', callback: v => '$' + v } }
      }
    }
  });
}
