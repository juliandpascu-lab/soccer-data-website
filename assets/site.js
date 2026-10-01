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

const NAME_OVERRIDES = {
  'pierreemerick aubameyang': 'Pierre-Emerick Aubameyang',
};

const LEAGUE_NAMES = {
  D1: 'Bundesliga',
  E0: 'Premier League',
  F1: 'Ligue 1',
  I1: 'Serie A',
  SP1: 'La Liga',
};

// Public badge assets are stored locally as visual identifiers; the underlying
// statistics still come exclusively from the project CSV.
const LEAGUE_BADGES = {
  D1: 'assets/badges/league-bundesliga.png',
  E0: 'assets/badges/league-premier-league.png',
  F1: 'assets/badges/league-ligue-1.png',
  I1: 'assets/badges/league-serie-a.png',
  SP1: 'assets/badges/league-la-liga.png',
};

const CLUB_BADGES = {
  Barcelona: ['assets/badges/club-barcelona.png', 'FCB'],
  'Real Madrid': ['assets/badges/club-real-madrid.png', 'RMA'],
  'Bayern Munich': ['assets/badges/club-bayern-munich.png', 'BAY'],
  'Paris Saint-Germain': ['assets/badges/club-psg.png', 'PSG'],
  Chelsea: ['assets/badges/club-chelsea.png', 'CFC'],
  Napoli: ['assets/badges/club-napoli.png', 'NAP'],
  Juventus: ['assets/badges/club-juventus.png', 'JUV'],
  'Borussia Dortmund': ['assets/badges/club-borussia-dortmund.png', 'BVB'],
  'AS Roma': ['assets/badges/club-as-roma.png', 'ROM'],
  Lyon: ['assets/badges/club-lyon.png', 'LYO'],
  'Atletico Madrid': ['assets/badges/club-atletico-madrid.png', 'ATM'],
  Sevilla: ['assets/badges/club-sevilla.png', 'SEV'],
  'AC Milan': ['assets/badges/club-ac-milan.png', 'ACM'],
  Fiorentina: ['assets/badges/club-fiorentina.png', 'FIO'],
  Valencia: ['assets/badges/club-valencia.png', 'VAL'],
  Internazionale: ['assets/badges/club-internazionale.png', 'INT'],
  Lazio: ['assets/badges/club-lazio.png', 'LAZ'],
  'Bayer Leverkusen': ['assets/badges/club-bayer-leverkusen.png', 'B04'],
  'Schalke 04': ['assets/badges/club-schalke-04.png', 'S04'],
  Montpellier: ['assets/badges/club-montpellier.png', 'MHS'],
  'Real Sociedad': ['assets/badges/club-real-sociedad.png', 'RSO'],
  'Manchester City': ['assets/badges/club-manchester-city.png', 'MCI'],
  Marseille: ['assets/badges/club-marseille.png', 'OM'],
  'VfL Wolfsburg': ['assets/badges/club-wolfsburg.png', 'WOB'],
  'Borussia Monchengladbach': ['assets/badges/club-borussia-monchengladbach.png', 'BMG'],
  Lille: ['assets/badges/club-lille.png', 'LOSC'],
};

const KIT_IMAGES = {
  Barcelona: 'assets/kits/barcelona-2014-15.jpg',
  'Real Madrid': 'assets/kits/real-madrid-2012-13.jpg',
  'Bayern Munich': 'assets/kits/bayern-2012-13.jpg',
  'Paris Saint-Germain': 'assets/kits/psg-2014-15.jpg',
  'Borussia Dortmund': 'assets/kits/dortmund-2012-13.jpg',
  Napoli: 'assets/kits/napoli-2012-13.jpg',
  Lyon: 'assets/kits/lyon-2012-13.jpg',
  Chelsea: 'assets/kits/chelsea-2011-12.jpg',
};

const KIT_SOURCES = {
  Barcelona: 'https://www.footballshirtculture.com/14-15-kits/barcelona-2014-2015-nike-home-football-shirt.html',
  'Real Madrid': 'https://www.classicfootballshirts.co.uk/2012-13-real-madrid-home-shirt-410-l-rmdh12470325.html',
  'Bayern Munich': 'https://www.classicfootballshirts.co.uk/2012-13-bayern-munich-home-shirt-410-l-bynh12741667.html',
  'Paris Saint-Germain': 'https://www.classicfootballshirts.co.uk/2014-15-paris-saint-germain-home-shirt-510-xlboys-psgh14423580.html',
  'Borussia Dortmund': 'https://www.classicfootballshirts.co.uk/2012-13-borussia-dortmund-home-shirt-610-l-dorh12576468.html',
  Napoli: 'https://www.classicfootballshirts.co.uk/2011-12-napoli-home-shirt-cavani-7-510-xl-naph11210354.html',
  Lyon: 'https://www.classicfootballshirts.co.uk/2014-15-lyon-home-shirt-510-xl-lynh1463885.html',
  Chelsea: 'https://www.ebay.com/itm/226123305737',
};

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

function prefersReducedMotion() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let metricObserver = null;

function runMetricAnimation(element) {
  const numericTarget = Number(element.dataset.countTarget);
  const formatter = element._metricFormatter || formatNumber;
  const duration = element._metricDuration || 900;
  if (!Number.isFinite(numericTarget)) return;
  if (element._metricFrame) cancelAnimationFrame(element._metricFrame);
  const startValue = Number(element.dataset.motionValue || 0);
  element.dataset.motionValue = String(numericTarget);
  element.dataset.counted = 'true';
  element.classList.remove('count-up-pending');
  if (prefersReducedMotion()) {
    element.textContent = formatter(numericTarget);
    return;
  }
  const startTime = performance.now();
  const tick = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - ((1 - progress) ** 3);
    element.textContent = formatter(startValue + ((numericTarget - startValue) * eased));
    if (progress < 1) element._metricFrame = requestAnimationFrame(tick);
  };
  element._metricFrame = requestAnimationFrame(tick);
}

function animateMetric(id, target, formatter = formatNumber, duration = 900) {
  const element = document.getElementById(id);
  const numericTarget = Number(target);
  if (!element || !Number.isFinite(numericTarget)) {
    if (element) element.textContent = '—';
    return;
  }
  element._metricFormatter = formatter;
  element._metricDuration = duration;
  element.dataset.countTarget = String(numericTarget);
  if (element.dataset.counted === 'true' || prefersReducedMotion() || !metricObserver) {
    runMetricAnimation(element);
    return;
  }
  element.textContent = formatter(0);
  element.classList.add('count-up-pending');
  metricObserver.observe(element);
}

function displayName(value) {
  const raw = String(value || '').trim();
  const override = NAME_OVERRIDES[raw.toLowerCase()];
  if (override) return override;
  return raw.toLowerCase().split(/([\s\-'])/).map((part) => {
    if (!/[a-zà-ÿ]/i.test(part)) return part;
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');
}

function displayCategory(key, value) {
  if (key === 'player') return displayName(value);
  if (key === 'league') return LEAGUE_NAMES[value] || value;
  if (key === 'country') return String(value || '').replace(/\b\w/g, (letter) => letter.toUpperCase());
  return value;
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
  return [...grouped.entries()].map(([keyValue, value]) => ({ key: keyValue, label: displayCategory(key, keyValue), value })).sort((a, b) => b.value - a.value);
}

function rawGroupSum(rows, key, metric) {
  const grouped = new Map();
  rows.forEach((row) => {
    const name = row[key] || 'Unknown';
    grouped.set(name, (grouped.get(name) || 0) + Number(row[metric] || 0));
  });
  return [...grouped.entries()].map(([keyValue, value]) => ({
    key: keyValue,
    label: displayCategory(key, keyValue),
    value,
  })).sort((a, b) => b.value - a.value);
}

function identityBadge(src, initials, label, className = '') {
  const safeSrc = escapeHtml(src || '');
  const safeInitials = escapeHtml(initials || String(label || '?').slice(0, 3).toUpperCase());
  return `<span class="identity-badge ${className}" title="${escapeHtml(label)}"><span class="identity-fallback">${safeInitials}</span>${src ? `<img src="${safeSrc}" alt="${escapeHtml(label)} crest" loading="lazy" onerror="this.style.display='none'">` : ''}</span>`;
}

function leagueBadgeMarkup(code) {
  return identityBadge(LEAGUE_BADGES[code], code, LEAGUE_NAMES[code] || code, 'league-badge');
}

function teamBadgeMarkup(team) {
  const badge = CLUB_BADGES[team];
  return identityBadge(badge?.[0], badge?.[1], team, 'club-badge');
}

function renderLeagueBadges(rows) {
  const container = document.getElementById('league-badges');
  if (!container) return;
  const entries = rawGroupSum(rows, 'league', 'goals');
  container.innerHTML = entries.map((entry) => `<article class="identity-tile"><div>${leagueBadgeMarkup(entry.key)}</div><strong>${escapeHtml(entry.label)}</strong><span>${formatNumber(entry.value)} goals</span></article>`).join('');
}

function renderClubBadges(rows) {
  const container = document.getElementById('club-badges');
  if (!container) return;
  const entries = rawGroupSum(rows, 'team', 'goals').slice(0, 10);
  container.innerHTML = entries.map((entry) => `<article class="identity-tile"><div>${teamBadgeMarkup(entry.key)}</div><strong>${escapeHtml(entry.label)}</strong><span>${formatNumber(entry.value)} goals</span></article>`).join('');
}

function kitImageMarkup(number, rank, team) {
  const image = KIT_IMAGES[team];
  const source = KIT_SOURCES[team];
  if (!image) {
    return `<div class="kit-visual kit-fallback" title="${escapeHtml(team)} crest fallback">${teamBadgeMarkup(team)}<span>${escapeHtml(shortLabel(team, 12))}</span></div>`;
  }
  return `<div class="kit-visual" title="${escapeHtml(team)} historical home shirt">
    <img class="kit-photo" src="${escapeHtml(image)}" alt="${escapeHtml(team)} historical home shirt" loading="lazy" onerror="this.style.display='none'">
    <span class="kit-rank">#${rank}</span>
    <span class="kit-goal-badge"><strong>${formatNumber(number)}</strong><small>GOALS</small></span>
    ${source ? `<a class="kit-source" href="${escapeHtml(source)}" target="_blank" rel="noreferrer">SOURCE</a>` : ''}
  </div>`;
}

function topTeamForPlayer(rows, player, season = null) {
  const filtered = rows.filter((row) => row.player === player && (season === null || String(row.season) === String(season)));
  return rawGroupSum(filtered, 'team', 'goals')[0]?.key || 'Unknown club';
}

function renderScorerShirts(top, rows) {
  const container = document.getElementById('scorer-shirts');
  if (!container) return;
  container.innerHTML = top.slice(0, 8).map((entry, index) => {
    const team = topTeamForPlayer(rows, entry.key);
    return `<article class="scorer-shirt-card" title="${escapeHtml(entry.label)}: ${formatNumber(entry.value)} recorded goals">
      ${kitImageMarkup(entry.value, index + 1, team)}
      <strong>${escapeHtml(entry.label)}</strong><span>${formatNumber(entry.value)} goals</span><small>${escapeHtml(team)}</small>
    </article>`;
  }).join('');
}

function renderHeroTopPlayers(top, rows) {
  const container = document.getElementById('hero-top-players');
  if (!container) return;
  container.innerHTML = top.slice(0, 3).map((entry, index) => {
    const team = topTeamForPlayer(rows, entry.key);
    const image = KIT_IMAGES[team];
    return `<article class="hero-player-card" tabindex="0" title="${escapeHtml(entry.label)}: ${formatNumber(entry.value)} recorded goals">
      <div class="hero-player-kit">
        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(team)} historical home shirt" loading="lazy" onerror="this.style.display='none'">` : ''}
        <span>0${index + 1}</span>
      </div>
      <div class="hero-player-info"><strong>${escapeHtml(entry.label)}</strong><small>${escapeHtml(team)}</small></div>
      <div class="hero-player-goals"><strong>${formatNumber(entry.value)}</strong><small>GOALS</small></div>
    </article>`;
  }).join('');
}

function seasonDisplay(value) {
  const season = Number(value);
  return Number.isFinite(season) ? `${season - 1}/${String(season).slice(-2)}` : String(value);
}

function renderTopScorerTimeline(rows) {
  const container = document.getElementById('top-scorer-timeline');
  if (!container) return;
  const seasons = [...new Set(rows.map((row) => row.season))].sort((a, b) => Number(a) - Number(b));
  const top = rawGroupSum(rows, 'player', 'goals').slice(0, 10);
  const details = new Map();
  rows.forEach((row) => {
    if (!details.has(row.player)) details.set(row.player, new Map());
    const seasonMap = details.get(row.player);
    if (!seasonMap.has(row.season)) seasonMap.set(row.season, { goals: 0, teams: new Map() });
    const entry = seasonMap.get(row.season);
    const goals = Number(row.goals || 0);
    entry.goals += goals;
    entry.teams.set(row.team, (entry.teams.get(row.team) || 0) + goals);
  });
  const maxGoals = Math.max(...top.map((entry) => entry.value), 1);
  const header = `<div class="timeline-row timeline-header"><div>PLAYER</div><div>PRIMARY CLUB</div>${seasons.map((season) => `<div>${seasonDisplay(season)}</div>`).join('')}</div>`;
  const body = top.map((player) => {
    const primaryTeam = topTeamForPlayer(rows, player.key);
    const seasonMap = details.get(player.key) || new Map();
    const cells = seasons.map((season) => {
      const entry = seasonMap.get(season);
      if (!entry || entry.goals === 0) return '<div class="timeline-cell timeline-empty">—</div>';
      const team = [...entry.teams.entries()].sort((a, b) => b[1] - a[1])[0][0];
      const intensity = Math.max(.12, Math.min(.85, entry.goals / maxGoals));
      return `<div class="timeline-cell" title="${escapeHtml(player.label)} · ${seasonDisplay(season)} · ${formatNumber(entry.goals)} goals · ${escapeHtml(team)}" style="--cell-alpha:${intensity.toFixed(2)}"><strong>${formatNumber(entry.goals)}</strong><span>${teamBadgeMarkup(team)}<em>${escapeHtml(shortLabel(team, 13))}</em></span></div>`;
    }).join('');
    return `<div class="timeline-row"><div class="timeline-player"><strong>${escapeHtml(player.label)}</strong><span>${formatNumber(player.value)} total</span></div><div class="timeline-club">${teamBadgeMarkup(primaryTeam)}<span>${escapeHtml(shortLabel(primaryTeam, 18))}</span></div>${cells}</div>`;
  }).join('');
  container.innerHTML = `<div class="timeline-grid">${header}${body}</div>`;
}

function groupAverage(rows, key, metric) {
  const grouped = new Map();
  rows.forEach((row) => {
    const name = row[key] || 'Unknown';
    if (row[metric] === null || row[metric] === undefined || row[metric] === '') return;
    if (!grouped.has(name)) grouped.set(name, []);
    grouped.get(name).push(Number(row[metric] || 0));
  });
  return [...grouped.entries()].map(([keyValue, values]) => ({
    key: keyValue,
    label: displayCategory(key, keyValue), value: values.reduce((a, b) => a + b, 0) / values.length,
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

function renderPitchBubbles(container, items) {
  if (!container) return;
  const layer = container.querySelector('.pitch-bubbles');
  if (!layer) return;
  const max = Math.max(...items.map((item) => Number(item.value) || 0), 1);
  layer.innerHTML = items.map((item, index) => {
    const value = Number(item.value) || 0;
    const size = 20 + Math.sqrt(value / max) * 38;
    const tooltip = `${item.label}: ${formatNumber(value)} recorded goals`;
    return `<button class="pitch-bubble${index === 0 ? ' is-leading' : ''}" type="button" style="--bubble-x:${(item.x * 100).toFixed(2)}%;--bubble-y:${(item.y * 100).toFixed(2)}%;--bubble-size:${size.toFixed(1)}px;--bubble-delay:${index * 24}ms" data-tooltip="${escapeHtml(tooltip)}" title="${escapeHtml(tooltip)}" aria-label="${escapeHtml(tooltip)}"><span>${formatNumber(value)}</span></button>`;
  }).join('');
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
    tooltip.style.left = `${Math.min(event.clientX + 14, window.innerWidth - 190)}px`;
    tooltip.style.top = `${Math.min(event.clientY + 14, window.innerHeight - 76)}px`;
    tooltip.classList.add('visible');
    canvas.style.cursor = 'crosshair';
  });
  canvas.addEventListener('mouseleave', () => {
    const tooltip = document.querySelector('.chart-tooltip');
    if (tooltip) tooltip.classList.remove('visible');
    canvas.style.cursor = 'default';
  });
}

function svgEscape(value) {
  return escapeHtml(value);
}

function chartSvgId(element) {
  return `chart-${String(element.id || 'visual').replace(/[^a-z0-9_-]/gi, '-')}`;
}

function svgPaint(element, color) {
  const palette = {
    '#116149': 'green',
    '#d79542': 'gold',
    '#d66356': 'coral',
    '#5e8e79': 'sage',
    '#7b6ea8': 'purple',
    '#4a7890': 'blue',
    '#a9794f': 'bronze',
    '#8c9a62': 'olive',
  };
  const name = palette[color];
  return name ? `url(#${chartSvgId(element)}-${name})` : color;
}

function svgValueLabel(value, decimals) {
  return decimals ? formatDecimal(value) : formatNumber(value);
}

function renderSvg(element, content, viewBox = '0 0 820 300') {
  const id = chartSvgId(element);
  const defs = `<defs>
    <linearGradient id="${id}-green" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b3d30"/><stop offset=".5" stop-color="#218160"/><stop offset="1" stop-color="#69c091"/></linearGradient>
    <linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a65c2a"/><stop offset=".5" stop-color="#d79542"/><stop offset="1" stop-color="#ffd36b"/></linearGradient>
    <linearGradient id="${id}-coral" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9d3e3a"/><stop offset=".5" stop-color="#d66356"/><stop offset="1" stop-color="#f18d7d"/></linearGradient>
    <linearGradient id="${id}-sage" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#356b58"/><stop offset="1" stop-color="#8dc5a7"/></linearGradient>
    <linearGradient id="${id}-purple" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#584275"/><stop offset="1" stop-color="#b998d5"/></linearGradient>
    <linearGradient id="${id}-blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#315e87"/><stop offset="1" stop-color="#79b4dd"/></linearGradient>
    <linearGradient id="${id}-bronze" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#744b30"/><stop offset="1" stop-color="#cfa177"/></linearGradient>
    <linearGradient id="${id}-olive" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5c6b3c"/><stop offset="1" stop-color="#b5c77d"/></linearGradient>
    <linearGradient id="${id}-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d79542" stop-opacity=".34"/><stop offset="1" stop-color="#d79542" stop-opacity="0"/></linearGradient>
    <filter id="${id}-shadow" x="-20%" y="-20%" width="150%" height="170%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#0b3d30" flood-opacity=".18"/></filter>
    <filter id="${id}-glow" x="-20%" y="-30%" width="150%" height="180%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;
  const surface = `<path class="svg-field-orbit" d="M 626 -86 A 205 205 0 0 1 836 122"/>
    <path class="svg-field-orbit svg-field-orbit-secondary" d="M 678 -58 A 154 154 0 0 1 836 100"/>
    <line class="svg-field-line" x1="650" y1="0" x2="820" y2="170"/>`;
  element.innerHTML = `<div class="chart-load-bar" aria-hidden="true"><span></span></div><svg class="svg-chart" id="${id}" viewBox="${viewBox}" role="img" aria-label="Interactive chart" preserveAspectRatio="xMidYMid meet">${defs}${surface}${content}</svg>`;
  element.classList.add('interactive-chart');
}

function drawSvgBars(element, items, { horizontal = true, color = COLORS[0], maxItems = 10, decimals = false, formatValue = null, iconFor = null } = {}) {
  const data = items.slice(0, maxItems);
  if (!data.length) {
    renderSvg(element, '<text class="svg-empty" x="410" y="155" text-anchor="middle">No data for this view</text>');
    return;
  }
  const width = 820;
  const height = 300;
  const colors = Array.isArray(color) ? color : [color];
  const max = Math.max(...data.map((item) => Number(item.value) || 0), 1);
  const valueText = (item) => formatValue ? formatValue(item.value) : svgValueLabel(item.value, decimals);
  let content = '<g class="svg-grid">';
  if (horizontal) {
    const left = 218;
    const right = 70;
    const top = 18;
    const bottom = 12;
    const plotWidth = width - left - right;
    const rowHeight = (height - top - bottom) / data.length;
    data.forEach((item, index) => {
      const rowY = top + index * rowHeight;
      const barY = rowY + Math.max(2, (rowHeight - 18) / 2);
      const barHeight = Math.min(18, rowHeight - 4);
      const barWidth = Math.max(3, ((Number(item.value) || 0) / max) * plotWidth);
      const label = shortLabel(item.label, 29);
      const value = valueText(item);
      const icon = iconFor ? iconFor(item) : '';
      const outside = left + barWidth + 9;
      const inside = outside + 42 > width - 8;
      const valueX = inside ? left + barWidth - 9 : outside;
      const paint = svgPaint(element, colors[index % colors.length]);
      content += `<g class="svg-mark rank-${index}" style="--chart-delay:${index * 38}ms" tabindex="0"><title>${svgEscape(item.label)}: ${svgEscape(value)}</title>`;
      content += `<rect class="svg-track" x="${left}" y="${barY.toFixed(2)}" width="${plotWidth}" height="${barHeight.toFixed(2)}" rx="6"/>`;
      content += `<rect class="svg-bar-shadow" x="${(left + 4).toFixed(2)}" y="${(barY + 4).toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" rx="6" fill="${paint}"/>`;
      content += `<rect class="svg-bar" x="${left}" y="${barY.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" rx="6" fill="${paint}" filter="url(#${chartSvgId(element)}-shadow)"/>`;
      content += `<rect class="svg-bar-highlight" x="${left + 2}" y="${(barY + 2).toFixed(2)}" width="${Math.max(0, barWidth - 4).toFixed(2)}" height="2" rx="1"/>`;
      if (icon) content += `<image class="svg-label-icon svg-horizontal-icon" href="${svgEscape(icon)}" x="${Math.max(5, left - 210)}" y="${(barY - 2).toFixed(2)}" width="22" height="22" preserveAspectRatio="xMidYMid meet"/>`;
      content += `<text class="svg-label" x="${left - 12}" y="${(barY + barHeight / 2 + 4).toFixed(2)}" text-anchor="end">${svgEscape(label)}</text>`;
      content += `<text class="svg-value ${inside ? 'svg-value-inside' : ''}" x="${valueX.toFixed(2)}" y="${(barY + barHeight / 2 + 4).toFixed(2)}" text-anchor="${inside ? 'end' : 'start'}">${svgEscape(value)}</text></g>`;
    });
  } else {
    const left = 52;
    const right = 22;
    const top = 24;
    const bottom = 58;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const slot = plotWidth / data.length;
    [0, .5, 1].forEach((fraction) => {
      const y = top + plotHeight * (1 - fraction);
      content += `<line class="svg-rule" x1="${left}" y1="${y.toFixed(2)}" x2="${width - right}" y2="${y.toFixed(2)}"/>`;
      content += `<text class="svg-axis" x="${left - 10}" y="${(y + 4).toFixed(2)}" text-anchor="end">${svgEscape(formatValue ? formatValue(max * fraction) : svgValueLabel(max * fraction, decimals))}</text>`;
    });
    data.forEach((item, index) => {
      const barWidth = Math.max(12, Math.min(58, slot - 12));
      const x = left + index * slot + (slot - barWidth) / 2;
      const barHeight = Math.max(2, ((Number(item.value) || 0) / max) * plotHeight);
      const y = top + plotHeight - barHeight;
      const value = valueText(item);
      const label = shortLabel(item.label, 14);
      const icon = iconFor ? iconFor(item) : '';
      const labelY = icon ? height - bottom + 36 : height - bottom + 20;
      const paint = svgPaint(element, colors[index % colors.length]);
      content += `<g class="svg-mark rank-${index}" style="--chart-delay:${index * 48}ms" tabindex="0"><title>${svgEscape(item.label)}: ${svgEscape(value)}</title>`;
      content += `<rect class="svg-bar-shadow" x="${(x + 4).toFixed(2)}" y="${(y + 5).toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" rx="6" fill="${paint}"/>`;
      content += `<rect class="svg-bar" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" rx="6" fill="${paint}" filter="url(#${chartSvgId(element)}-shadow)"/>`;
      content += `<rect class="svg-bar-highlight" x="${(x + 2).toFixed(2)}" y="${(y + 2).toFixed(2)}" width="${Math.max(0, barWidth - 4).toFixed(2)}" height="2" rx="1"/>`;
      content += `<text class="svg-value" x="${(x + barWidth / 2).toFixed(2)}" y="${Math.max(16, y - 8).toFixed(2)}" text-anchor="middle">${svgEscape(value)}</text>`;
      if (icon) content += `<image class="svg-label-icon" href="${svgEscape(icon)}" x="${(x + barWidth / 2 - 12).toFixed(2)}" y="${height - bottom - 2}" width="24" height="24" preserveAspectRatio="xMidYMid meet"/>`;
      content += `<text class="svg-label svg-x-label" x="${(x + barWidth / 2).toFixed(2)}" y="${labelY}" text-anchor="middle">${svgEscape(label)}</text></g>`;
    });
  }
  content += '</g>';
  renderSvg(element, content);
}

function drawSvgLine(element, items, { color = COLORS[0], decimals = false, formatValue = null } = {}) {
  const data = items;
  if (!data.length) {
    renderSvg(element, '<text class="svg-empty" x="410" y="155" text-anchor="middle">No data for this view</text>');
    return;
  }
  const width = 820;
  const height = 300;
  const left = 56;
  const right = 24;
  const top = 22;
  const bottom = 58;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const max = Math.max(...data.map((item) => Number(item.value) || 0), 1);
  const point = (item, index) => ({
    x: left + (data.length === 1 ? plotWidth / 2 : index * plotWidth / (data.length - 1)),
    y: top + plotHeight * (1 - (Number(item.value) || 0) / max),
  });
  let content = '<g class="svg-grid">';
  [0, .5, 1].forEach((fraction) => {
    const y = top + plotHeight * (1 - fraction);
    content += `<line class="svg-rule" x1="${left}" y1="${y.toFixed(2)}" x2="${width - right}" y2="${y.toFixed(2)}"/>`;
    content += `<text class="svg-axis" x="${left - 10}" y="${(y + 4).toFixed(2)}" text-anchor="end">${svgEscape(formatValue ? formatValue(max * fraction) : svgValueLabel(max * fraction, decimals))}</text>`;
  });
  const points = data.map(point);
  const labelStep = Math.max(1, Math.ceil(data.length / 8));
  const paint = svgPaint(element, color);
  const areaPoints = [`${left},${top + plotHeight}`, ...points.map((item) => `${item.x.toFixed(2)},${item.y.toFixed(2)}`), `${width - right},${top + plotHeight}`].join(' ');
  content += `<polygon class="svg-area" points="${areaPoints}" fill="url(#${chartSvgId(element)}-area)"/>`;
  content += `<polyline class="svg-line" fill="none" stroke="${paint}" filter="url(#${chartSvgId(element)}-glow)" points="${points.map((item) => `${item.x.toFixed(2)},${item.y.toFixed(2)}`).join(' ')}"/>`;
  data.forEach((item, index) => {
    const current = points[index];
    const value = formatValue ? formatValue(item.value) : svgValueLabel(item.value, decimals);
    content += `<g class="svg-mark rank-${index}" style="--chart-delay:${index * 48}ms" tabindex="0"><title>${svgEscape(item.label)}: ${svgEscape(value)}</title>`;
    content += `<circle class="svg-point-halo" cx="${current.x.toFixed(2)}" cy="${current.y.toFixed(2)}" r="10" fill="${paint}"/>`;
    content += `<circle class="svg-point" cx="${current.x.toFixed(2)}" cy="${current.y.toFixed(2)}" r="5" fill="${paint}"/>`;
    if (data.length <= 12 || index % labelStep === 0 || index === data.length - 1) {
      content += `<text class="svg-value" x="${current.x.toFixed(2)}" y="${Math.max(16, current.y - 12).toFixed(2)}" text-anchor="middle">${svgEscape(value)}</text>`;
      content += `<text class="svg-label svg-x-label" x="${current.x.toFixed(2)}" y="${height - bottom + 20}" text-anchor="middle">${svgEscape(shortLabel(item.label, 15))}</text>`;
    }
    content += '</g>';
  });
  content += '</g>';
  renderSvg(element, content);
}

function playerShotTotals(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    const player = row.player || 'Unknown';
    if (!grouped.has(player)) grouped.set(player, { player, attempts: 0, shotsOnTarget: 0, goals: 0 });
    const entry = grouped.get(player);
    entry.attempts += Number(row.attempts || 0);
    entry.shotsOnTarget += Number(row.shots_on_target || 0);
    entry.goals += Number(row.goals || 0);
  });
  return [...grouped.values()].map((entry) => ({
    ...entry,
    label: displayName(entry.player),
    conversion: entry.attempts ? entry.goals / entry.attempts : 0,
    onTargetRate: entry.attempts ? entry.shotsOnTarget / entry.attempts : 0,
  }));
}

function renderConversionFunnel(element, rows) {
  if (!element) return;
  const totals = [
    { label: 'ATTEMPTS', value: sum(rows, 'attempts'), color: '#116149' },
    { label: 'SHOTS ON TARGET', value: sum(rows, 'shots_on_target'), color: '#d79542' },
    { label: 'GOALS', value: sum(rows, 'goals'), color: '#d66356' },
  ];
  const players = playerShotTotals(rows);
  const eligible = players.filter((item) => item.attempts >= 100).sort((a, b) => b.conversion - a.conversion);
  const leader = eligible[0];
  setText('conversion-leader', leader?.label || '—');
  setText('conversion-leader-rate', leader ? formatPercent(leader.conversion) : '—');
  setText('conversion-leader-goals', leader ? formatNumber(leader.goals) : '—');
  setText('conversion-leader-attempts', leader ? formatNumber(leader.attempts) : '—');

  const race = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);
  if (!totals.some((item) => item.value) || !race.length) {
    renderSvg(element, '<text class="svg-empty" x="410" y="155" text-anchor="middle">No conversion data for this view</text>');
    return;
  }

  const width = 820;
  const funnelCenter = 238;
  const maxStage = Math.max(totals[0].value, 1);
  const widthFor = (value) => 126 + Math.sqrt(Math.max(value, 0) / maxStage) * 270;
  const stageTop = 42;
  const stageHeight = 70;
  const stageGap = 8;
  let content = '<g class="conversion-funnel">';
  content += '<text class="funnel-heading" x="38" y="20">MATCH FLOW</text>';
  content += '<text class="funnel-heading funnel-heading-right" x="488" y="20">TOP GOAL VOLUMES</text>';
  content += '<text class="funnel-subheading" x="488" y="34">ATTEMPTS · ON TARGET · GOALS · CONVERSION</text>';

  totals.forEach((stage, index) => {
    const y = stageTop + index * (stageHeight + stageGap);
    const topWidth = widthFor(stage.value);
    const nextValue = totals[index + 1]?.value ?? stage.value * .66;
    const bottomWidth = widthFor(nextValue);
    const topLeft = funnelCenter - topWidth / 2;
    const topRight = funnelCenter + topWidth / 2;
    const bottomLeft = funnelCenter - bottomWidth / 2;
    const bottomRight = funnelCenter + bottomWidth / 2;
    const detail = index === 0
      ? '100% of attempts'
      : `${formatPercent(stage.value / totals[0].value)} of attempts`;
    const nextDetail = index === totals.length - 1
      ? `${formatPercent(stage.value / totals[1].value)} of shots on target`
      : detail;
    const path = `M ${topLeft.toFixed(2)} ${y} L ${topRight.toFixed(2)} ${y} L ${bottomRight.toFixed(2)} ${(y + stageHeight).toFixed(2)} L ${bottomLeft.toFixed(2)} ${(y + stageHeight).toFixed(2)} Z`;
    const paint = svgPaint(element, stage.color);
    content += `<g class="funnel-segment" style="--chart-delay:${index * 90}ms" tabindex="0"><title>${stage.label}: ${formatNumber(stage.value)} (${svgEscape(index === totals.length - 1 ? nextDetail : detail)})</title><path d="${path}" fill="${paint}" filter="url(#${chartSvgId(element)}-shadow)"/><path class="funnel-gloss" d="M ${topLeft.toFixed(2)} ${(y + 2).toFixed(2)} L ${topRight.toFixed(2)} ${(y + 2).toFixed(2)} L ${(topRight - 12).toFixed(2)} ${(y + 7).toFixed(2)} L ${(topLeft + 12).toFixed(2)} ${(y + 7).toFixed(2)} Z"/><text class="funnel-label" x="${funnelCenter}" y="${y + 28}" text-anchor="middle">${stage.label}</text><text class="funnel-value" x="${funnelCenter}" y="${y + 51}" text-anchor="middle">${formatNumber(stage.value)}</text></g>`;
    if (index < totals.length - 1) {
      content += `<text class="funnel-rate" x="${funnelCenter + 216}" y="${y + stageHeight + 5}">${formatPercent(totals[index + 1].value / stage.value)} CONTINUE</text>`;
    }
  });
  content += '<line class="funnel-divider" x1="466" y1="42" x2="466" y2="298"/>';

  const maxGoals = Math.max(...race.map((item) => item.goals), 1);
  race.forEach((item, index) => {
    const y = 49 + index * 49;
    const barWidth = Math.max(4, (item.goals / maxGoals) * 148);
    const title = `${item.label}: ${formatNumber(item.attempts)} attempts, ${formatNumber(item.shotsOnTarget)} shots on target, ${formatNumber(item.goals)} goals, ${formatPercent(item.conversion)} conversion`;
    content += `<g class="funnel-row" style="--chart-delay:${index * 55}ms" tabindex="0"><title>${svgEscape(title)}</title><rect class="funnel-row-bg" x="488" y="${y - 16}" width="298" height="40" rx="9"/><circle class="funnel-player-dot" cx="510" cy="${y - 4}" r="11"/><text class="funnel-rank" x="510" y="${y - 1}" text-anchor="middle">0${index + 1}</text><text class="funnel-player" x="527" y="${y - 1}">${svgEscape(shortLabel(item.label, 17))}</text><text class="funnel-goals" x="774" y="${y - 1}" text-anchor="end">${formatNumber(item.goals)}</text><rect class="funnel-track" x="527" y="${y + 6}" width="148" height="6" rx="3"/><rect class="funnel-bar" x="527" y="${y + 6}" width="${barWidth.toFixed(2)}" height="6" rx="3" fill="${svgPaint(element, '#d66356')}"/><text class="funnel-detail" x="684" y="${y + 11}">${formatNumber(item.attempts)} att · ${formatNumber(item.shotsOnTarget)} SOT · ${formatPercent(item.conversion)}</text></g>`;
  });
  content += '</g>';
  renderSvg(element, content, `0 0 ${width} 320`);
}

function drawBars(canvas, items, { horizontal = true, color = COLORS[0], maxItems = 10, decimals = false, formatValue = null, iconFor = null } = {}) {
  if (canvas && canvas.tagName && canvas.tagName.toLowerCase() !== 'canvas') {
    drawSvgBars(canvas, items, { horizontal, color, maxItems, decimals, formatValue, iconFor });
    return;
  }
  const { ctx, width, height } = setupCanvas(canvas);
  const data = items.slice(0, maxItems);
  if (!data.length) { attachTooltip(canvas, []); return; }
  const regions = [];
  const left = horizontal ? Math.min(190, Math.max(128, width * .42)) : 42;
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
      const valueLabel = formatValue ? formatValue(item.value) : (decimals ? formatDecimal(item.value) : formatNumber(item.value));
      ctx.fillStyle = '#e8eee9'; ctx.fillRect(left, y, plotWidth, 16);
      ctx.fillStyle = Array.isArray(color) ? color[index % color.length] : color;
      ctx.fillRect(left, y, barWidth, 16);
      ctx.fillStyle = '#53635d'; ctx.textAlign = 'right'; ctx.fillText(shortLabel(item.label, width < 440 ? 17 : 23), left - 8, y + 8);
      const valueOutsideX = left + barWidth + 7;
      const valueWidth = ctx.measureText(valueLabel).width;
      if (valueOutsideX + valueWidth > width - 6) {
        ctx.fillStyle = '#ffffff'; ctx.textAlign = 'right'; ctx.fillText(valueLabel, left + barWidth - 8, y + 8);
      } else {
        ctx.fillStyle = '#10221d'; ctx.textAlign = 'left'; ctx.fillText(valueLabel, valueOutsideX, y + 8);
      }
      regions.push({ x: left, y, width: plotWidth, height: 16, label: item.label, value: item.value, valueLabel });
    } else {
      const barWidth = plotWidth / data.length;
      const barHeight = (item.value / max) * plotHeight;
      const x = left + index * barWidth + 5;
      const valueLabel = formatValue ? formatValue(item.value) : (decimals ? formatDecimal(item.value) : formatNumber(item.value));
      ctx.fillStyle = Array.isArray(color) ? color[index % color.length] : color;
      ctx.fillRect(x, height - bottom - barHeight, Math.max(8, barWidth - 10), barHeight);
      ctx.fillStyle = '#53635d'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(shortLabel(item.label, 13), x + (barWidth - 10) / 2, height - bottom + 9);
      ctx.fillStyle = '#10221d'; ctx.textBaseline = 'bottom';
      ctx.fillText(valueLabel, x + (barWidth - 10) / 2, Math.max(13, height - bottom - barHeight - 6));
      regions.push({ x, y: height - bottom - barHeight, width: Math.max(8, barWidth - 10), height: Math.max(barHeight, 10), label: item.label, value: item.value, valueLabel });
    }
  });
  attachTooltip(canvas, regions);
}

function drawLine(canvas, items, { color = COLORS[0], decimals = false, formatValue = null } = {}) {
  if (canvas && canvas.tagName && canvas.tagName.toLowerCase() !== 'canvas') {
    drawSvgLine(canvas, items, { color, decimals, formatValue });
    return;
  }
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
    ctx.fillText(formatValue ? formatValue(max * fraction) : (decimals ? formatDecimal(max * fraction) : formatNumber(max * fraction)), left - 7, y);
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
    regions.push({ type: 'point', x, y, label: item.label, value: item.value, valueLabel: formatValue ? formatValue(item.value) : (decimals ? formatDecimal(item.value) : formatNumber(item.value)) });
  });
  attachTooltip(canvas, regions);
}

function roundedRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawPitchHeatmap(canvas, items) {
  const { ctx, width, height } = setupCanvas(canvas);
  const stadium = { x: 10, y: 8, width: width - 20, height: height - 38 };
  const pitch = { x: 42, y: 39, width: width - 84, height: height - 88 };
  const max = Math.max(...items.map((item) => item.value), 1);
  const regions = [];

  const stadiumGradient = ctx.createLinearGradient(0, stadium.y, 0, stadium.y + stadium.height);
  stadiumGradient.addColorStop(0, '#071e18'); stadiumGradient.addColorStop(1, '#123f31');
  ctx.fillStyle = stadiumGradient; roundedRect(ctx, stadium.x, stadium.y, stadium.width, stadium.height, 14); ctx.fill();
  ctx.fillStyle = '#214c3d'; roundedRect(ctx, stadium.x + 7, stadium.y + 7, stadium.width - 14, stadium.height - 14, 11); ctx.fill();

  ctx.fillStyle = 'rgba(255,255,255,.12)';
  for (let index = 0; index < 15; index += 1) {
    const topX = stadium.x + 18 + index * (stadium.width - 36) / 15;
    const bottomX = topX;
    ctx.fillRect(topX, stadium.y + 12, 4, 4);
    ctx.fillRect(bottomX, stadium.y + stadium.height - 17, 4, 4);
  }
  for (let row = 0; row < 3; row += 1) {
    ctx.fillStyle = row === 1 ? 'rgba(255,211,107,.34)' : 'rgba(255,255,255,.18)';
    ctx.fillRect(stadium.x + 12, stadium.y + 18 + row * 6, stadium.width - 24, 2);
    ctx.fillRect(stadium.x + 12, stadium.y + stadium.height - 31 + row * 6, stadium.width - 24, 2);
  }
  ctx.fillStyle = '#d9eee0';
  [[stadium.x + 13, stadium.y + 13], [stadium.x + stadium.width - 17, stadium.y + 13], [stadium.x + 13, stadium.y + stadium.height - 17], [stadium.x + stadium.width - 17, stadium.y + stadium.height - 17]].forEach(([x, y]) => {
    ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.font = '700 9px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('STADIUM / GOAL-ZONE MAP', width / 2, 14);

  ctx.fillStyle = '#2a7655'; ctx.fillRect(pitch.x, pitch.y, pitch.width, pitch.height);
  ctx.fillStyle = 'rgba(255,255,255,.055)';
  for (let index = 0; index < 10; index += 1) {
    if (index % 2 === 0) ctx.fillRect(pitch.x + index * pitch.width / 10, pitch.y, pitch.width / 10, pitch.height);
  }
  ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.2;
  ctx.strokeRect(pitch.x, pitch.y, pitch.width, pitch.height);
  ctx.beginPath(); ctx.moveTo(pitch.x + pitch.width / 2, pitch.y); ctx.lineTo(pitch.x + pitch.width / 2, pitch.y + pitch.height); ctx.stroke();
  ctx.beginPath(); ctx.arc(pitch.x + pitch.width / 2, pitch.y + pitch.height / 2, pitch.height * .16, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeRect(pitch.x + pitch.width * .74, pitch.y + pitch.height * .18, pitch.width * .22, pitch.height * .64);
  ctx.strokeRect(pitch.x + pitch.width * .88, pitch.y + pitch.height * .34, pitch.width * .08, pitch.height * .32);
  ctx.strokeStyle = 'rgba(255,255,255,.35)';
  ctx.strokeRect(pitch.x - 5, pitch.y + pitch.height * .34, 5, pitch.height * .32);
  ctx.strokeRect(pitch.x + pitch.width, pitch.y + pitch.height * .34, 5, pitch.height * .32);
  ctx.fillStyle = 'rgba(255,255,255,.72)'; ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  ctx.fillText('goal zones · attacking direction →', width / 2, height - 20);
  items.forEach((item, index) => {
    const radius = 6 + Math.sqrt(item.value / max) * 17;
    const x = Math.min(pitch.x + pitch.width - radius - 2, Math.max(pitch.x + radius + 2, pitch.x + item.x * pitch.width));
    const y = Math.min(pitch.y + pitch.height - radius - 2, Math.max(pitch.y + radius + 2, pitch.y + item.y * pitch.height));
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
  animateMetric('report-rows', rows.length);
  animateMetric('report-goals', totalGoals);
  animateMetric('report-players', unique(rows, 'player'));
  setText('report-seasons', `${seasons[0]}–${seasons[seasons.length - 1]}`);
  setText('top-scorer', top[0]?.label || '—');
  animateMetric('top-scorer-goals', top[0]?.value);
  setText('top-team', groupSum(rows, 'team', 'goals')[0]?.label || '—');
  animateMetric('top-team-goals', groupSum(rows, 'team', 'goals')[0]?.value);
  const topLeague = rawGroupSum(rows, 'league', 'goals')[0];
  setText('top-league', topLeague?.label || '—');
  animateMetric('top-league-goals', topLeague?.value);
  setText('top-contributor', topContribution[0]?.label || '—');
  animateMetric('top-contributor-value', topContribution[0]?.value);
  const topMethod = methodTotals(rows, 'bodypart')[0];
  setText('top-method', topMethod?.label || '—');
  animateMetric('top-method-goals', topMethod?.value);
  const topLocation = locationTotals(rows)[0];
  setText('top-location', topLocation?.label || '—');
  animateMetric('top-location-goals', topLocation?.value);
  const topCards = groupSum(rows, 'player', 'yellow_cards');
  setText('top-card-player', topCards[0]?.label || '—');
  animateMetric('top-card-value', topCards[0]?.value);
  setText('top-season', bySeason(rows, 'goals').sort((a, b) => b.value - a.value)[0]?.label || '—');
  animateMetric('top-season-goals', Math.max(...bySeason(rows, 'goals').map((item) => item.value)));
  setText('rows-note', `${formatNumber(rows.length)} player-season-team records were generated from ${formatNumber(unique(rows, 'season'))} seasons of recorded events.`);
  renderScorerShirts(top, rows);
  renderHeroTopPlayers(top, rows);
  renderLeagueBadges(rows);
  renderClubBadges(rows);
  renderTopScorerTimeline(rows);

  reportChart('chart-top-scorers', rows, 'player', 'goals', { color: COLORS, maxItems: 10 });
  reportChart('chart-season-goals', rows, 'season', 'goals', { line: true, color: COLORS[1] });
  reportChart('chart-league-goals', rows, 'league', 'goals', { horizontal: false, color: COLORS, maxItems: 5, iconFor: (item) => LEAGUE_BADGES[item.key] });
  reportChart('chart-contributions', rows, 'player', 'goal_contributions', { color: COLORS[2], maxItems: 10 });
  drawBars(document.getElementById('chart-methods'), methodTotals(rows, 'bodypart'), { horizontal: false, color: COLORS, maxItems: 3 });
  renderPitchBubbles(document.getElementById('chart-location'), locationTotals(rows));
  reportChart('chart-cards', rows, 'player', 'yellow_cards', { color: COLORS[4], maxItems: 10 });
  reportChart('chart-teams', rows, 'team', 'goals', { color: COLORS, maxItems: 10, iconFor: (item) => CLUB_BADGES[item.key]?.[0] });
  renderConversionFunnel(document.getElementById('chart-conversion-funnel'), rows);
}

function addOptions(select, values, allLabel, selectedValue = select.value) {
  select.innerHTML = `<option value="all">${allLabel}</option>`;
  values.forEach((value) => {
    const label = select.id === 'filter-player' ? displayName(value) : select.id === 'filter-league' ? displayCategory('league', value) : select.id === 'filter-country' ? displayCategory('country', value) : value;
    select.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`);
  });
  const available = [...select.options].some((option) => option.value === String(selectedValue));
  select.value = available ? String(selectedValue) : 'all';
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }

function renderLeaguePicker(rows) {
  const container = document.getElementById('league-picker');
  if (!container) return;
  const leagueEntries = rawGroupSum(rows, 'league', 'goals').map((entry) => ({
    ...entry,
    players: unique(rows.filter((row) => row.league === entry.key), 'player'),
  }));
  const entries = [{ key: 'all', label: 'All leagues', value: sum(rows, 'goals'), players: unique(rows, 'player') }, ...leagueEntries];
  container.innerHTML = entries.map((entry) => {
    const all = entry.key === 'all';
    return `<button class="league-choice${all ? ' active' : ''}" type="button" data-league="${escapeHtml(entry.key)}" aria-pressed="${String(all)}">
      <span class="league-choice-icon">${all ? '<span class="league-choice-ball" aria-hidden="true">⚽</span>' : leagueBadgeMarkup(entry.key)}</span>
      <span class="league-choice-copy"><strong>${escapeHtml(entry.label)}</strong><small>${formatNumber(entry.value)} goals · ${formatNumber(entry.players)} players</small></span>
    </button>`;
  }).join('');
}

function updateLeaguePickerState() {
  const selected = document.getElementById('filter-league')?.value || 'all';
  document.querySelectorAll('#league-picker [data-league]').forEach((button) => {
    const active = button.dataset.league === selected;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function syncExplorerOptions(rows) {
  const season = document.getElementById('filter-season')?.value || 'all';
  const country = document.getElementById('filter-country')?.value || 'all';
  const leagueSelect = document.getElementById('filter-league');
  const teamSelect = document.getElementById('filter-team');
  const playerSelect = document.getElementById('filter-player');
  const baseRows = rows.filter((row) => (season === 'all' || String(row.season) === season) && (country === 'all' || String(row.country) === country));
  addOptions(leagueSelect, [...new Set(baseRows.map((row) => row.league).filter(Boolean))].sort(), 'All leagues', leagueSelect.value);
  const league = leagueSelect.value;
  const leagueRows = baseRows.filter((row) => league === 'all' || row.league === league);
  addOptions(teamSelect, [...new Set(leagueRows.map((row) => row.team).filter(Boolean))].sort(), 'All teams', teamSelect.value);
  const team = teamSelect.value;
  const teamRows = leagueRows.filter((row) => team === 'all' || row.team === team);
  addOptions(playerSelect, [...new Set(teamRows.map((row) => row.player).filter(Boolean))].sort((a, b) => displayName(a).localeCompare(displayName(b))), 'All players', playerSelect.value);
  updateLeaguePickerState();
}

function updateScopeSummary(filtered) {
  const league = document.getElementById('filter-league')?.value || 'all';
  const team = document.getElementById('filter-team')?.value || 'all';
  const player = document.getElementById('filter-player')?.value || 'all';
  const season = document.getElementById('filter-season')?.value || 'all';
  const country = document.getElementById('filter-country')?.value || 'all';
  const labels = [
    league === 'all' ? 'ALL LEAGUES' : displayCategory('league', league).toUpperCase(),
    team === 'all' ? 'ALL TEAMS' : String(team).toUpperCase(),
    player === 'all' ? 'ALL PLAYERS' : displayName(player).toUpperCase(),
  ];
  const breadcrumb = document.getElementById('scope-breadcrumb');
  if (breadcrumb) breadcrumb.innerHTML = labels.map((label, index) => `${index ? '<b aria-hidden="true">›</b>' : ''}<span>${escapeHtml(label)}</span>`).join('');
  const context = [
    `${formatNumber(filtered.length)} records`,
    `${formatNumber(unique(filtered, 'player'))} players`,
    `${formatNumber(sum(filtered, 'goals'))} goals`,
  ];
  if (season !== 'all') context.push(seasonDisplay(season));
  if (country !== 'all') context.push(displayCategory('country', country));
  setText('scope-note', context.join(' · '));
}

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
  updateScopeSummary(filtered);
  updateLeaguePickerState();
  animateMetric('dash-records', filtered.length);
  animateMetric('dash-players', unique(filtered, 'player'));
  animateMetric('dash-metric-total', metricTotal, (value) => metricFormat(metric, value));
  animateMetric('dash-avg-goals', filtered.length ? sum(filtered, 'goals') / filtered.length : 0, formatDecimal);
  setText('dash-metric-label', `${metricLabel} total`);
  setText('dash-current-label', `${metricLabel} by ${breakdown}`);
  const breakdownData = aggregateMetric(filtered, breakdown, metric);
  const selectedMeasureFormat = (value) => metricFormat(metric, value);
  drawBars(document.getElementById('dash-breakdown-chart'), breakdownData, { color: COLORS, maxItems: 12, formatValue: selectedMeasureFormat });
  drawLine(document.getElementById('dash-season-chart'), bySeason(filtered, metric), { color: COLORS[1], formatValue: selectedMeasureFormat });
  drawBars(document.getElementById('dash-goals-chart'), groupSum(filtered, 'league', 'goals'), { horizontal: false, color: COLORS[2], maxItems: 5, iconFor: (item) => LEAGUE_BADGES[item.key] });
  drawBars(document.getElementById('dash-discipline-chart'), groupSum(filtered, 'league', 'yellow_cards'), { horizontal: false, color: COLORS[4], maxItems: 5, iconFor: (item) => LEAGUE_BADGES[item.key] });
  drawBars(document.getElementById('dash-method-chart'), methodTotals(filtered, methodGroup), { horizontal: false, color: COLORS, maxItems: 5 });
  renderPitchBubbles(document.getElementById('dash-location-chart'), locationTotals(filtered));
  setText('table-view-label', `Current view / top ${Math.min(20, filtered.length)} records`);
  renderTable(filtered, metric);
}

function renderTable(rows, metric) {
  const body = document.querySelector('#dashboard-table tbody');
  const sorted = [...rows].sort((a, b) => Number(b[metric] || 0) - Number(a[metric] || 0)).slice(0, 20);
  body.innerHTML = sorted.map((row) => `<tr>
    <td>${escapeHtml(displayName(row.player))}</td><td><span class="table-team">${teamBadgeMarkup(row.team)}<span>${escapeHtml(row.team)}</span></span></td><td><span class="table-team">${leagueBadgeMarkup(row.league)}<span>${escapeHtml(displayCategory('league', row.league))}</span></span></td><td>${row.season}</td>
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

function setupMetricObserver() {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  metricObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      metricObserver.unobserve(entry.target);
      runMetricAnimation(entry.target);
    });
  }, { threshold: .35, rootMargin: '0px 0px -8% 0px' });
}

function setupChartObserver() {
  const charts = document.querySelectorAll('.chart-plot');
  const reveal = (chart) => {
    chart.classList.add('chart-is-visible');
  };
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    charts.forEach(reveal);
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      reveal(entry.target);
    });
  }, { threshold: .18, rootMargin: '0px 0px -10% 0px' });
  charts.forEach((chart) => {
    if (chart.classList.contains('chart-is-visible')) return;
    observer.observe(chart);
  });
}

function setupThemeToggle() {
  const button = document.getElementById('theme-toggle');
  if (!button) return;
  const root = document.documentElement;
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.innerHTML = `<span aria-hidden="true">${dark ? '☀' : '☾'}</span><span>${dark ? 'Light mode' : 'Dark mode'}</span>`;
  };
  setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light');
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('soccer-theme', next); } catch (error) {}
    setTheme(next);
  });
}

function setupSiteIntro() {
  const intro = document.getElementById('site-intro');
  if (!intro) return;
  if (prefersReducedMotion()) {
    intro.remove();
    return;
  }
  window.setTimeout(() => {
    intro.classList.add('is-complete');
    window.setTimeout(() => intro.remove(), 550);
  }, 1250);
}

async function initDashboard() {
  const rows = await loadRows();
  const values = (field) => [...new Set(rows.map((row) => row[field]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));
  addOptions(document.getElementById('filter-season'), values('season'), 'All seasons');
  addOptions(document.getElementById('filter-league'), values('league'), 'All leagues');
  addOptions(document.getElementById('filter-country'), values('country'), 'All countries');
  addOptions(document.getElementById('filter-team'), values('team'), 'All teams');
  addOptions(document.getElementById('filter-player'), values('player'), 'All players');
  renderLeaguePicker(rows);
  syncExplorerOptions(rows);
  ['filter-season', 'filter-league', 'filter-country', 'filter-team', 'filter-player', 'measure', 'breakdown', 'method-group'].forEach((id) => document.getElementById(id).addEventListener('change', () => {
    if (['filter-season', 'filter-league', 'filter-country', 'filter-team'].includes(id)) syncExplorerOptions(rows);
    renderDashboard(rows);
  }));
  document.getElementById('league-picker').addEventListener('click', (event) => {
    const button = event.target.closest('[data-league]');
    if (!button) return;
    document.getElementById('filter-league').value = button.dataset.league;
    document.getElementById('filter-team').value = 'all';
    document.getElementById('filter-player').value = 'all';
    document.getElementById('filter-country').value = 'all';
    syncExplorerOptions(rows);
    renderDashboard(rows);
  });
  document.getElementById('reset-filters').addEventListener('click', () => {
    ['filter-season', 'filter-league', 'filter-country', 'filter-team', 'filter-player'].forEach((id) => { document.getElementById(id).value = 'all'; });
    document.getElementById('measure').value = 'goals';
    document.getElementById('breakdown').value = 'player';
    document.getElementById('method-group').value = 'bodypart';
    syncExplorerOptions(rows);
    renderDashboard(rows);
  });
  document.getElementById('dashboard-loading').remove();
  renderDashboard(rows);
}

document.addEventListener('DOMContentLoaded', async () => {
  setupSiteIntro();
  setupScrollReveal();
  setupMetricObserver();
  setupThemeToggle();
  try {
    if (document.body.dataset.page === 'report') await initReport();
    if (document.body.dataset.page === 'dashboard') await initDashboard();
    setupChartObserver();
  } catch (error) {
    console.error(error);
    const message = document.getElementById('load-error');
    if (message) message.textContent = `The data could not be loaded: ${error.message}`;
  }
});
