const DATA_URL = 'data/player_season_stats.csv';

const COLORS = ['#116149', '#d79542', '#d66356', '#5e8e79', '#7b6ea8', '#4a7890', '#a9794f', '#8c9a62'];
const NUMERIC_FIELDS = [
  'season', 'matches_with_events', 'event_count', 'goals', 'assists', 'attempts',
  'shots_on_target', 'shots_not_on_target', 'key_passes', 'corners', 'fouls',
  'yellow_cards', 'second_yellows', 'red_cards', 'substitutions', 'offsides',
  'handballs', 'penalties_conceded', 'goals_per_event_match', 'goal_contributions',
  'goal_right_foot', 'goal_left_foot', 'goal_head', 'goal_open_play', 'goal_set_piece',
  'goal_corner', 'goal_free_kick', 'goal_no_assist', 'goal_assisted_by_pass',
  'goal_assisted_by_cross', 'goal_assisted_by_headed_pass', 'goal_assisted_by_through_ball',
  'finishing_rate', 'on_target_rate',
  'goal_location_attacking_half', 'goal_location_defensive_half', 'goal_location_centre_box',
  'goal_location_left_wing', 'goal_location_right_wing', 'goal_location_difficult_long_range',
  'goal_location_difficult_left', 'goal_location_difficult_right', 'goal_location_left_box',
  'goal_location_left_six', 'goal_location_right_box', 'goal_location_right_six',
  'goal_location_very_close', 'goal_location_penalty_spot', 'goal_location_outside_box',
  'goal_location_long_range', 'goal_location_over_35', 'goal_location_over_40', 'goal_location_not_recorded',
];

const METRICS = {
  goals: { label: 'Goals', format: formatNumber },
  assists: { label: 'Assists', format: formatNumber },
  goal_contributions: { label: 'Goal contributions', format: formatNumber },
  attempts: { label: 'Shot attempts', format: formatNumber },
  shots_on_target: { label: 'Shots on target', format: formatNumber },
  key_passes: { label: 'Key passes', format: formatNumber },
  yellow_cards: { label: 'Yellow cards', format: formatNumber },
  event_count: { label: 'Recorded events', format: formatNumber },
  finishing_rate: { label: 'Finishing rate', format: formatPercent, rate: true },
  on_target_rate: { label: 'On-target rate', format: formatPercent, rate: true },
  goals_per_event_match: { label: 'Goals per event match', format: formatDecimal, rate: true },
};

const LOCATION_FIELDS = [
  { field: 'goal_location_attacking_half', label: 'Attacking half', x: .37, y: .50 },
  { field: 'goal_location_defensive_half', label: 'Defensive half', x: .18, y: .50 },
  { field: 'goal_location_centre_box', label: 'Centre of the box', x: .79, y: .50 },
  { field: 'goal_location_left_wing', label: 'Left wing', x: .64, y: .18 },
  { field: 'goal_location_right_wing', label: 'Right wing', x: .64, y: .82 },
  { field: 'goal_location_difficult_long_range', label: 'Difficult angle / long range', x: .52, y: .50 },
  { field: 'goal_location_difficult_left', label: 'Difficult angle left', x: .69, y: .28 },
  { field: 'goal_location_difficult_right', label: 'Difficult angle right', x: .69, y: .72 },
  { field: 'goal_location_left_box', label: 'Left side of the box', x: .78, y: .28 },
  { field: 'goal_location_left_six', label: 'Left side of six-yard box', x: .91, y: .34 },
  { field: 'goal_location_right_box', label: 'Right side of the box', x: .78, y: .72 },
  { field: 'goal_location_right_six', label: 'Right side of six-yard box', x: .91, y: .66 },
  { field: 'goal_location_very_close', label: 'Very close range', x: .96, y: .50 },
  { field: 'goal_location_penalty_spot', label: 'Penalty spot', x: .86, y: .50 },
  { field: 'goal_location_outside_box', label: 'Outside the box', x: .66, y: .50 },
  { field: 'goal_location_long_range', label: 'Long range', x: .46, y: .50 },
  { field: 'goal_location_over_35', label: 'More than 35 yards', x: .30, y: .50 },
  { field: 'goal_location_over_40', label: 'More than 40 yards', x: .20, y: .50 },
  { field: 'goal_location_not_recorded', label: 'Not recorded', x: .08, y: .90 },
];

const METHOD_GROUPS = {
  bodypart: [
    { field: 'goal_right_foot', label: 'Right foot' },
    { field: 'goal_left_foot', label: 'Left foot' },
    { field: 'goal_head', label: 'Head' },
  ],
  situation: [
    { field: 'goal_open_play', label: 'Open play' },
    { field: 'goal_set_piece', label: 'Set piece' },
    { field: 'goal_corner', label: 'Corner' },
    { field: 'goal_free_kick', label: 'Free kick' },
  ],
  assist_method: [
    { field: 'goal_no_assist', label: 'No recorded assist' },
    { field: 'goal_assisted_by_pass', label: 'Pass' },
    { field: 'goal_assisted_by_cross', label: 'Cross' },
    { field: 'goal_assisted_by_headed_pass', label: 'Headed pass' },
    { field: 'goal_assisted_by_through_ball', label: 'Through ball' },
  ],
};

function formatNumber(value) {
  return Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatDecimal(value) {
  return Number(value || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatPercent(value) {
  return `${(Number(value || 0) * 100).toLocaleString('en-US', { maximumFractionDigits: 1 })}%`;
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') { value += '"'; i += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === ',' && !quoted) { row.push(value); value = ''; continue; }
    if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value); value = '';
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      continue;
    }
    value += char;
  }
  if (value.length || row.length) { row.push(value); rows.push(row); }
  const headers = rows.shift().map((header) => header.trim());
  return rows.map((cells) => {
    const record = {};
    headers.forEach((header, index) => {
      const raw = (cells[index] ?? '').trim();
      record[header] = NUMERIC_FIELDS.includes(header) ? (raw === '' ? null : Number(raw)) : raw;
    });
    return record;
  });
}

async function loadRows() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Could not load ${DATA_URL}`);
  return parseCSV(await response.text());
}

function sum(rows, field) { return rows.reduce((total, row) => total + Number(row[field] || 0), 0); }
function unique(rows, field) { return new Set(rows.map((row) => row[field]).filter(Boolean)).size; }
function groupSum(rows, key, metric) {
  const grouped = new Map();
  rows.forEach((row) => {
    const name = row[key] || 'Unknown';
    grouped.set(name, (grouped.get(name) || 0) + Number(row[metric] || 0));
  });
  return [...grouped.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}
function groupAverage(rows, key, metric) {
  const grouped = new Map();
  rows.forEach((row) => {
    const name = row[key] || 'Unknown';
    if (row[metric] === null || row[metric] === undefined || row[metric] === '') return;
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name).push(Number(row[metric] || 0));
  });
  return [...grouped.entries()].map(([label, values]) => ({
    label, value: values.reduce((a, b) => a + b, 0) / values.length,
  })).sort((a, b) => b.value - a.value);
}

function isRateMetric(metric) {
  return Boolean(METRICS[metric]?.rate) || metric === 'goals_per_event_match';
}

function aggregateMetric(rows, key, metric) {
  return isRateMetric(metric) ? groupAverage(rows, key, metric) : groupSum(rows, key, metric);
}

function metricValue(rows, metric) {
  if (!rows.length) return 0;
  if (!isRateMetric(metric)) return sum(rows, metric);
  const values = rows.map((row) => row[metric]).filter((value) => value !== null && value !== undefined && value !== '').map(Number);
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

function metricFormat(metric, value) {
  return METRICS[metric]?.format ? METRICS[metric].format(value) : formatNumber(value);
}

function locationTotals(rows) {
  return LOCATION_FIELDS.map((location) => ({
    ...location,
    value: sum(rows, location.field),
  })).filter((location) => location.value > 0).sort((a, b) => b.value - a.value);
}

function shortLabel(label, max = 19) {
  const clean = String(label);
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function setupCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const width = Math.max(canvas.clientWidth, 280);
  const height = Math.max(canvas.clientHeight, 260);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  const ctx = canvas.getContext('2d');
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, width, height);
  return { ctx, width, height };
}

function attachTooltip(canvas, regions) {
  canvas._chartRegions = regions;
  canvas.classList.add('interactive-chart');
  if (canvas._tooltipReady) return;
  canvas._tooltipReady = true;
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.clientWidth / rect.width);
    const y = (event.clientY - rect.top) * (canvas.clientHeight / rect.height);
    const region = (canvas._chartRegions || []).find((item) => {
      if (item.type === 'point') return Math.hypot(item.x - x, item.y - y) < 14;
      return x >= item.x && x <= item.x + item.width && y >= item.y && y <= item.y + item.height;
    });
    let tooltip = document.querySelector('.chart-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      document.body.appendChild(tooltip);
    }
    if (!region) { tooltip.classList.remove('visible'); canvas.style.cursor = 'default'; return; }
    tooltip.innerHTML = `<strong>${escapeHtml(region.label)}</strong><span>${region.valueLabel || formatNumber(region.value)}</span>`;
    tooltip.style.left = `${event.clientX + 14}px`;
    tooltip.style.top = `${event.clientY + 14}px`;
    tooltip.classList.add('visible');
    canvas.style.cursor = 'crosshair';
  });
  canvas.addEventListener('mouseleave', () => {
    const tooltip = document.querySelector('.chart-tooltip');
    if (tooltip) tooltip.classList.remove('visible');
    canvas.style.cursor = 'default';
  });
}

function drawBars(canvas, items, { horizontal = true, color = COLORS[0], maxItems = 10, decimals = false } = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  const data = items.slice(0, maxItems);
  if (!data.length) { attachTooltip(canvas, []); return; }
  const regions = [];
  const left = horizontal ? Math.min(138, width * .37) : 42;
  const bottom = horizontal ? 18 : 46;
  const plotWidth = width - left - 18;
  const plotHeight = height - bottom - 14;
  const max = Math.max(...data.map((item) => item.value), 1);
  ctx.font = '12px Inter, system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  data.forEach((item, index) => {
    if (horizontal) {
      const y = 18 + index * (plotHeight / data.length) + 3;
      const barWidth = Math.max(2, (item.value / max) * plotWidth);
      ctx.fillStyle = '#e8eee9'; ctx.fillRect(left, y, plotWidth, 16);
      ctx.fillStyle = Array.isArray(color) ? color[index % color.length] : color;
      ctx.fillRect(left, y, barWidth, 16);
      ctx.fillStyle = '#53635d'; ctx.textAlign = 'right'; ctx.fillText(shortLabel(item.label), left - 8, y + 8);
      ctx.fillStyle = '#10221d'; ctx.textAlign = 'left'; ctx.fillText(decimals ? formatDecimal(item.value) : formatNumber(item.value), left + barWidth + 7, y + 8);
      regions.push({ x: left, y, width: plotWidth, height: 16, label: item.label, value: item.value, valueLabel: decimals ? formatDecimal(item.value) : formatNumber(item.value) });
    } else {
      const barWidth = plotWidth / data.length;
      const barHeight = (item.value / max) * plotHeight;
      const x = left + index * barWidth + 5;
      ctx.fillStyle = Array.isArray(color) ? color[index % color.length] : color;
      ctx.fillRect(x, height - bottom - barHeight, Math.max(8, barWidth - 10), barHeight);
      ctx.fillStyle = '#53635d'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(shortLabel(item.label, 13), x + (barWidth - 10) / 2, height - bottom + 9);
      ctx.fillStyle = '#10221d'; ctx.textBaseline = 'bottom';
      ctx.fillText(decimals ? formatDecimal(item.value) : formatNumber(item.value), x + (barWidth - 10) / 2, height - bottom - barHeight - 6);
      regions.push({ x, y: height - bottom - barHeight, width: Math.max(8, barWidth - 10), height: Math.max(barHeight, 10), label: item.label, value: item.value, valueLabel: decimals ? formatDecimal(item.value) : formatNumber(item.value) });
    }
  });
  attachTooltip(canvas, regions);
}

function drawLine(canvas, items, { color = COLORS[0], decimals = false } = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  const data = items;
  if (!data.length) { attachTooltip(canvas, []); return; }
  const left = 44; const right = 18; const top = 18; const bottom = 42;
  const plotWidth = width - left - right; const plotHeight = height - top - bottom;
  const max = Math.max(...data.map((item) => item.value), 1);
  const regions = [];
  ctx.strokeStyle = '#dbe5df'; ctx.lineWidth = 1;
  [0, .5, 1].forEach((fraction) => {
    const y = top + plotHeight * (1 - fraction);
    ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(width - right, y); ctx.stroke();
    ctx.fillStyle = '#7a8982'; ctx.font = '11px system-ui'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(decimals ? formatDecimal(max * fraction) : formatNumber(max * fraction), left - 7, y);
  });
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath();
  data.forEach((item, index) => {
    const x = left + (data.length === 1 ? plotWidth / 2 : index * plotWidth / (data.length - 1));
    const y = top + plotHeight * (1 - item.value / max);
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  data.forEach((item, index) => {
    const x = left + (data.length === 1 ? plotWidth / 2 : index * plotWidth / (data.length - 1));
    const y = top + plotHeight * (1 - item.value / max);
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#53635d'; ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText(item.label, x, height - bottom + 12);
    regions.push({ type: 'point', x, y, label: item.label, value: item.value, valueLabel: decimals ? formatDecimal(item.value) : formatNumber(item.value) });
  });
  attachTooltip(canvas, regions);
}

function drawPitchHeatmap(canvas, items) {
  const { ctx, width, height } = setupCanvas(canvas);
  const pitch = { x: 18, y: 20, width: width - 36, height: height - 50 };
  const max = Math.max(...items.map((item) => item.value), 1);
  const regions = [];
  ctx.fillStyle = '#2a7655';
  ctx.fillRect(pitch.x, pitch.y, pitch.width, pitch.height);
  ctx.fillStyle = 'rgba(255,255,255,.055)';
  for (let index = 0; index < 10; index += 1) {
    if (index % 2 === 0) ctx.fillRect(pitch.x + index * pitch.width / 10, pitch.y, pitch.width / 10, pitch.height);
  }
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 1.2;
  ctx.strokeRect(pitch.x, pitch.y, pitch.width, pitch.height);
  ctx.beginPath(); ctx.moveTo(pitch.x + pitch.width / 2, pitch.y); ctx.lineTo(pitch.x + pitch.width / 2, pitch.y + pitch.height); ctx.stroke();
  ctx.beginPath(); ctx.arc(pitch.x + pitch.width / 2, pitch.y + pitch.height / 2, pitch.height * .16, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeRect(pitch.x + pitch.width * .74, pitch.y + pitch.height * .18, pitch.width * .22, pitch.height * .64);
  ctx.strokeRect(pitch.x + pitch.width * .88, pitch.y + pitch.height * .34, pitch.width * .08, pitch.height * .32);
  ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('goal location · attacking direction →', width / 2, height - 20);
  items.forEach((item, index) => {
    const x = pitch.x + item.x * pitch.width;
    const y = pitch.y + item.y * pitch.height;
    const radius = 7 + Math.sqrt(item.value / max) * 22;
    ctx.fillStyle = index === 0 ? '#ffd36b' : '#f6a65d';
    ctx.globalAlpha = .28; ctx.beginPath(); ctx.arc(x, y, radius + 7, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = .95; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    regions.push({ type: 'point', x, y, label: item.label, value: item.value, valueLabel: `${formatNumber(item.value)} goals` });
  });
  attachTooltip(canvas, regions);
}

function bySeason(rows, metric) {
  return aggregateMetric(rows, 'season', metric).sort((a, b) => Number(a.label) - Number(b.label));
}

function methodTotals(rows, group) {
  return (METHOD_GROUPS[group] || METHOD_GROUPS.bodypart).map((method) => ({
    label: method.label,
    value: sum(rows, method.field),
  })).sort((a, b) => b.value - a.value);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function reportChart(id, rows, grouping, metric, options = {}) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const data = grouping === 'season' ? bySeason(rows, metric) : groupSum(rows, grouping, metric);
  if (options.average) drawBars(canvas, groupAverage(rows, grouping, metric), options);
  else if (options.line) drawLine(canvas, data, options);
  else drawBars(canvas, data, options);
}

async function initReport() {
  const rows = await loadRows();
  const totalGoals = sum(rows, 'goals');
  const top = groupSum(rows, 'player', 'goals');
  const topContribution = groupSum(rows, 'player', 'goal_contributions');
  const seasons = [...new Set(rows.map((row) => row.season))].sort((a, b) => a - b);
  setText('report-rows', formatNumber(rows.length));
  setText('report-goals', formatNumber(totalGoals));
  setText('report-players', formatNumber(unique(rows, 'player')));
  setText('report-seasons', `${seasons[0]}–${seasons[seasons.length - 1]}`);
  setText('top-scorer', top[0]?.label || '—');
  setText('top-scorer-goals', formatNumber(top[0]?.value));
  setText('top-team', groupSum(rows, 'team', 'goals')[0]?.label || '—');
  setText('top-team-goals', formatNumber(groupSum(rows, 'team', 'goals')[0]?.value));
  setText('top-league', groupSum(rows, 'league', 'goals')[0]?.label || '—');
  setText('top-league-goals', formatNumber(groupSum(rows, 'league', 'goals')[0]?.value));
  setText('top-contributor', topContribution[0]?.label || '—');
  setText('top-contributor-value', formatNumber(topContribution[0]?.value));
  const topMethod = methodTotals(rows, 'bodypart')[0];
  setText('top-method', topMethod?.label || '—');
  setText('top-method-goals', formatNumber(topMethod?.value));
  const topLocation = locationTotals(rows)[0];
  setText('top-location', topLocation?.label || '—');
  setText('top-location-goals', formatNumber(topLocation?.value));
  const topCards = groupSum(rows, 'player', 'yellow_cards');
  setText('top-card-player', topCards[0]?.label || '—');
  setText('top-card-value', formatNumber(topCards[0]?.value));
  setText('top-season', bySeason(rows, 'goals').sort((a, b) => b.value - a.value)[0]?.label || '—');
  setText('top-season-goals', formatNumber(Math.max(...bySeason(rows, 'goals').map((item) => item.value))));
  setText('rows-note', `${formatNumber(rows.length)} player-season-team records were generated from ${formatNumber(unique(rows, 'season'))} seasons of recorded events.`);

  reportChart('chart-top-scorers', rows, 'player', 'goals', { color: COLORS, maxItems: 10 });
  reportChart('chart-season-goals', rows, 'season', 'goals', { line: true, color: COLORS[1] });
  reportChart('chart-league-goals', rows, 'league', 'goals', { horizontal: false, color: COLORS, maxItems: 5 });
  reportChart('chart-contributions', rows, 'player', 'goal_contributions', { color: COLORS[2], maxItems: 10 });
  drawBars(document.getElementById('chart-methods'), methodTotals(rows, 'bodypart'), { horizontal: false, color: COLORS, maxItems: 3 });
  drawPitchHeatmap(document.getElementById('chart-location'), locationTotals(rows));
  reportChart('chart-cards', rows, 'player', 'yellow_cards', { color: COLORS[4], maxItems: 10 });
  reportChart('chart-teams', rows, 'team', 'goals', { color: COLORS, maxItems: 10 });
  reportChart('chart-efficiency', rows, 'league', 'goals_per_event_match', { horizontal: false, color: COLORS[6], maxItems: 5, decimals: true, average: true });
}

function addOptions(select, values, allLabel) {
  select.innerHTML = `<option value="all">${allLabel}</option>`;
  values.forEach((value) => { select.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`); });
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

function renderDashboard(rows) {
  const selected = {
    season: document.getElementById('filter-season').value,
    league: document.getElementById('filter-league').value,
    country: document.getElementById('filter-country').value,
    team: document.getElementById('filter-team').value,
    player: document.getElementById('filter-player').value,
  };
  const filtered = rows.filter((row) => Object.entries(selected).every(([field, value]) => value === 'all' || String(row[field]) === value));
  const metric = document.getElementById('measure').value;
  const breakdown = document.getElementById('breakdown').value;
  const methodGroup = document.getElementById('method-group').value;
  const metricLabel = METRICS[metric].label;
  const metricTotal = metricValue(filtered, metric);
  setText('dash-records', formatNumber(filtered.length));
  setText('dash-players', formatNumber(unique(filtered, 'player')));
  setText('dash-metric-total', metricFormat(metric, metricTotal));
  setText('dash-avg-goals', formatDecimal(filtered.length ? sum(filtered, 'goals') / filtered.length : 0));
  setText('dash-metric-label', `${metricLabel} total`);
  setText('dash-current-label', `${metricLabel} by ${breakdown}`);
  const breakdownData = aggregateMetric(filtered, breakdown, metric);
  drawBars(document.getElementById('dash-breakdown-chart'), breakdownData, { color: COLORS, maxItems: 12 });
  drawLine(document.getElementById('dash-season-chart'), bySeason(filtered, metric), { color: COLORS[1] });
  drawBars(document.getElementById('dash-goals-chart'), groupSum(filtered, 'league', 'goals'), { horizontal: false, color: COLORS[2], maxItems: 5 });
  drawBars(document.getElementById('dash-discipline-chart'), groupSum(filtered, 'league', 'yellow_cards'), { horizontal: false, color: COLORS[4], maxItems: 5 });
  drawBars(document.getElementById('dash-method-chart'), methodTotals(filtered, methodGroup), { horizontal: false, color: COLORS, maxItems: 5 });
  drawPitchHeatmap(document.getElementById('dash-location-chart'), locationTotals(filtered));
  renderTable(filtered, metric);
}

function renderTable(rows, metric) {
  const body = document.querySelector('#dashboard-table tbody');
  const sorted = [...rows].sort((a, b) => Number(b[metric] || 0) - Number(a[metric] || 0)).slice(0, 40);
  body.innerHTML = sorted.map((row) => `<tr>
    <td>${escapeHtml(row.player)}</td><td>${escapeHtml(row.team)}</td><td>${escapeHtml(row.league)}</td><td>${row.season}</td>
    <td>${metricFormat(metric, row[metric])}</td><td>${formatNumber(row.goals)}</td><td>${formatNumber(row.assists)}</td><td>${formatNumber(row.matches_with_events)}</td>
  </tr>`).join('');
  if (!sorted.length) body.innerHTML = '<tr><td colspan="8" class="empty">No records match these filters.</td></tr>';
}

function setupScrollReveal() {
  const elements = document.querySelectorAll('.report-section, .method-card, .dashboard-card, .dashboard-stats .stat-card');
  elements.forEach((element) => element.classList.add('reveal'));
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  elements.forEach((element) => observer.observe(element));
}

async function initDashboard() {
  const rows = await loadRows();
  const values = (field) => [...new Set(rows.map((row) => row[field]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
  addOptions(document.getElementById('filter-season'), values('season'), 'All seasons');
  addOptions(document.getElementById('filter-league'), values('league'), 'All leagues');
  addOptions(document.getElementById('filter-country'), values('country'), 'All countries');
  addOptions(document.getElementById('filter-team'), values('team'), 'All teams');
  addOptions(document.getElementById('filter-player'), values('player'), 'All players');
  ['filter-season', 'filter-league', 'filter-country', 'filter-team', 'filter-player', 'measure', 'breakdown', 'method-group'].forEach((id) => document.getElementById(id).addEventListener('change', () => renderDashboard(rows)));
  document.getElementById('reset-filters').addEventListener('click', () => {
    ['filter-season', 'filter-league', 'filter-country', 'filter-team', 'filter-player'].forEach((id) => { document.getElementById(id).value = 'all'; });
    document.getElementById('measure').value = 'goals';
    document.getElementById('breakdown').value = 'player';
    document.getElementById('method-group').value = 'bodypart';
    renderDashboard(rows);
  });
  document.getElementById('dashboard-loading').remove();
  renderDashboard(rows);
}

document.addEventListener('DOMContentLoaded', async () => {
  setupScrollReveal();
  try {
    if (document.body.dataset.page === 'report') await initReport();
    if (document.body.dataset.page === 'dashboard') await initDashboard();
  } catch (error) {
    console.error(error);
    const message = document.getElementById('load-error');
    if (message) message.textContent = `The data could not be loaded: ${error.message}`;
  }
});
