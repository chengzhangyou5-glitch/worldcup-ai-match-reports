import { matches, historyRecords, metrics } from "./data.js";

const flag = (team) => `<img class="team-flag" src="https://flagcdn.com/w160/${team.code}.png" alt="${team.name}队旗" width="80" height="54">`;
const icon = (name) => `<i class="ri-${name}" aria-hidden="true"></i>`;

export function pageIntro(kicker, title, description, aside = "") {
  return `<header class="page-intro">
    <div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p>${description}</p></div>${aside}
  </header>`;
}

export function matchCard(match, featured = false) {
  return `<article class="match-card ${featured ? "is-featured" : ""}" data-open-match="${match.id}" tabindex="0" role="link" aria-label="查看${match.home.name}对${match.away.name}完整分析">
    <div class="card-topline"><span class="competition-pill">${icon("football-line")}${match.competition}</span><time>${icon("time-line")}${match.time}</time></div>
    <div class="teams-row">
      <div class="team">${flag(match.home)}<strong>${match.home.name}</strong></div>
      <div class="versus"><b>VS</b><small>模型更新 ${match.updated}</small></div>
      <div class="team">${flag(match.away)}<strong>${match.away.name}</strong></div>
    </div>
    <div class="compact-trend" aria-label="胜平负趋势：主胜${match.trend[0]}%，平局${match.trend[1]}%，客胜${match.trend[2]}%">
      <div class="trend-labels"><span>主胜 <b>${match.trend[0]}%</b></span><span>平 <b>${match.trend[1]}%</b></span><span>客胜 <b>${match.trend[2]}%</b></span></div>
      <div class="stacked-bar"><i style="width:${match.trend[0]}%"></i><i style="width:${match.trend[1]}%"></i><i style="width:${match.trend[2]}%"></i></div>
    </div>
    <div class="quick-stats"><div><span>比分路径</span><strong>${match.scores.join(" / ")}</strong></div><div><span>总进球区间</span><strong>${match.goals} 球</strong></div></div>
    <div class="conclusion-line">${icon("lightbulb-flash-line")}<p>${match.conclusion}</p></div>
    <div class="risk-line"><span>风险等级</span><b class="risk-badge ${match.riskTone}">${match.risk}<i></i></b></div>
    <button class="primary-button card-button" type="button" data-open-match="${match.id}">查看完整分析 ${icon("arrow-right-line")}</button>
  </article>`;
}

function trendPanel(title, labels, values, note) {
  const max = Math.max(...values);
  return `<section class="detail-panel trend-panel"><h2>${title}</h2>
    <div class="bar-list">${values.map((value, i) => `<div class="bar-row"><div><span>${labels[i]}</span><b class="${value === max ? "is-strong" : ""}">${value}%</b></div><div class="bar-track"><i class="${value === max ? "is-strong" : ""}" style="width:${value}%"></i></div></div>`).join("")}</div>
    <p class="panel-note">${note}</p></section>`;
}

export function upcomingPage() {
  return `<div class="page page-upcoming">
    ${pageIntro("MATCH INTELLIGENCE", "待赛分析", "已更新 ${matches.length} 场 · 开赛前持续更新", `<div class="update-chip">${icon("pulse-line")}模型状态正常</div>`)}
    <div class="match-grid">${matches.map((m, i) => matchCard(m, i === 0)).join("")}</div>
    <section class="trust-strip"><div>${icon("shield-check-line")}<span><b>只做赛前记录</b><small>开赛后锁定，历史可回看</small></span></div><div>${icon("focus-3-line")}<span><b>结论先行</b><small>不懂球也能快速扫读</small></span></div><div>${icon("database-2-line")}<span><b>模型持续更新</b><small>时间与版本清楚可见</small></span></div></section>
  </div>`;
}

export function detailPage(id) {
  const match = matches.find((item) => item.id === id) || matches[0];
  return `<div class="page page-detail">
    <div class="detail-toolbar"><button class="text-button" type="button" data-action="back">${icon("arrow-left-line")}返回待赛</button><span>比赛详情</span><button class="icon-button" type="button" data-action="share" aria-label="分享分析">${icon("share-line")}</button></div>
    <section class="match-hero">
      <div class="card-topline"><span class="competition-pill">${icon("football-line")}${match.competition}</span><span class="risk-inline ${match.riskTone}">${icon("alarm-warning-line")}风险 ${match.risk}</span></div>
      <div class="teams-row large"><div class="team">${flag(match.home)}<strong>${match.home.name}</strong></div><div class="versus"><b>VS</b><small>${match.time}</small></div><div class="team">${flag(match.away)}<strong>${match.away.name}</strong></div></div>
      <p class="updated-line">${icon("refresh-line")}模型更新：${match.updated}</p>
    </section>
    <div class="detail-layout">
      <div class="detail-primary">
        <section class="detail-panel conclusion-panel"><h2>${icon("line-chart-line")}本场结论</h2><p>${match.conclusion}</p></section>
        ${trendPanel("胜平负趋势", ["主胜", "平局", "客胜"], match.trend, "主路径更明确，但平局仍然需要留意。")}
        ${trendPanel("让胜平负趋势", ["让胜", "让平", "让负"], match.handicap, "优势存在，但未必能明显拉开。")}
        <section class="detail-panel score-panel"><h2>比分路径</h2><div class="score-main"><span>首选</span><strong>${match.scores[0]}</strong>${icon("star-line")}</div><div class="score-alt"><div><span>次选</span><b>${match.scores[1]}</b></div><div><span>延伸</span><b>${match.scores[2]}</b></div></div></section>
      </div>
      <aside class="detail-secondary">
        <section class="detail-panel goals-panel"><h2>总进球区间</h2><div class="goals-value"><strong>${match.goals}</strong><div><span>低进球：存在</span><span>高进球：一般</span></div></div><div class="goal-scale"><i></i><i class="active"></i><i class="active"></i><i></i><i></i></div><p>双方都有进球空间，但比赛未必会大开大合。</p></section>
        <section class="detail-panel halftime-panel"><h2>半全场路径</h2><div class="path-line"><b>${match.halftime[0]}</b><span>●</span><em>${match.halftime[1]}</em></div><p>上半场可能不会太快打开局面。</p></section>
        <section class="detail-panel risk-panel"><h2>${icon("shield-line")}风险提醒（${match.risk}）</h2><ul>${match.riskNotes.map(note => `<li>${icon("alarm-warning-line")}${note}</li>`).join("")}</ul></section>
        <section class="detail-panel why-panel"><h2>${icon("brain-line")}为什么这样看</h2><p>${match.why}</p></section>
        <button class="primary-button report-button" type="button" data-action="open-report">${icon("file-chart-line")}获取本场模型分析</button>
      </aside>
    </div>
  </div>`;
}

function historyCard(record) {
  return `<article class="history-card" data-history-id="${record.id}">
    <div class="history-card-head"><div><span>${record.competition} · ${record.date}</span><h3>${record.match}</h3></div><b class="validation-pill ${record.status}">${record.status === "hit" ? "方向一致" : "未一致"}</b></div>
    <div class="history-core"><div><span>实际结果</span><strong>${record.result}</strong></div><div><span>赛前方向</span><strong>${record.direction}</strong></div><div><span>比分路径</span><strong>${record.scores}</strong></div><div><span>进球区间</span><strong>${record.goals}</strong></div></div>
    <div class="tag-row">${record.tags.map(tag => `<span class="${tag.includes("未") ? "miss" : ""}">${tag}</span>`).join("")}</div>
    <div class="history-expand" hidden><p>${record.review}</p><button class="outline-button" type="button" data-original="${record.id}">查看原分析 ${icon("arrow-right-line")}</button></div>
  </article>`;
}

export function historyPage() {
  return `<div class="page page-history">
    ${pageIntro("VERIFICATION CENTER", "历史验证中心", "近 30 场赛前分析表现 · 持续更新")}
    <section class="metric-hero"><div class="metric-main"><span>近 30 场胜平负方向一致率</span><strong>${metrics.direction}%</strong><small>基于已完赛场次统计</small></div><div class="metric-grid"><div><span>比分路径参考率</span><b>${metrics.score}%</b></div><div><span>总进球区间参考率</span><b>${metrics.goals}%</b></div><div><span>半全场路径参考率</span><b>${metrics.halftime}%</b></div></div></section>
    <section class="history-section"><div class="section-heading"><div><p class="eyebrow">RECORDS</p><h2>历史场次明细</h2></div><span>${historyRecords.length} 场记录</span></div><div class="history-list">${historyRecords.map(historyCard).join("")}</div></section>
  </div>`;
}

export function searchPage(query = "") {
  const normalized = query.trim().toLowerCase();
  const filtered = normalized ? historyRecords.filter(r => `${r.match}${r.date}${r.competition}`.toLowerCase().includes(normalized)) : historyRecords.slice(0, 4);
  return `<div class="page page-search">
    ${pageIntro("MATCH ARCHIVE", "搜索历史场次", "输入球队、赛事或日期，回看当时的完整判断")}
    <div class="search-box">${icon("search-line")}<input id="history-search" type="search" value="${query}" placeholder="输入球队、赛事或日期" autocomplete="off"><kbd>ESC</kbd></div>
    <div class="search-meta"><span>${query ? `找到 ${filtered.length} 场相关记录` : "最近查看"}</span>${query ? `<button type="button" data-action="clear-search">清除搜索</button>` : ""}</div>
    <div class="search-results">${filtered.length ? filtered.map(record => `<article class="search-result">
      <div class="search-result-top"><div><span>${record.competition} · ${record.date}</span><h2>${record.match}</h2></div><b class="validation-pill ${record.status}">${record.status === "hit" ? "方向一致" : "未一致"}</b></div>
      <div class="result-flow"><div><span>赛前方向</span><strong>${record.direction}</strong></div>${icon("arrow-right-line")}<div><span>实际结果</span><strong>${record.result}</strong></div></div>
      <div class="tag-row">${record.tags.map(tag => `<span class="${tag.includes("未") ? "miss" : ""}">${tag}</span>`).join("")}</div>
      <p>${record.review}</p><button class="outline-button" type="button" data-original="${record.id}">查看原分析 ${icon("arrow-right-line")}</button>
    </article>`).join("") : `<div class="empty-state">${icon("history-line")}<h2>没有找到相关场次</h2><p>换一个球队名、赛事或日期试试。</p></div>`}</div>
  </div>`;
}

export function reportModal() {
  return `<div class="modal-icon">${icon("file-chart-line")}</div><p class="eyebrow">MODEL REPORT</p><h2 id="modal-title">本场模型分析已就绪</h2><p>完整分析包含方向分布、三条比分路径、进球区间与风险说明。当前页面已展示全部核心信息。</p><button class="primary-button" type="button" data-action="close-modal">我知道了</button>`;
}

export function noticeModal() {
  return `<div class="modal-icon">${icon("notification-3-line")}</div><p class="eyebrow">LIVE UPDATE</p><h2 id="modal-title">开赛前持续更新</h2><p>待赛场次会根据最新公开足球情报更新模型时间。比赛开始后，分析内容将锁定并进入历史验证。</p><button class="primary-button" type="button" data-action="close-modal">明白</button>`;
}

export function shareModal() {
  return `<div class="modal-icon">${icon("check-line")}</div><p class="eyebrow">SHARE</p><h2 id="modal-title">链接已复制</h2><p>可以把当前比赛详情分享给朋友，一起做观赛参考。</p><button class="primary-button" type="button" data-action="close-modal">完成</button>`;
}
