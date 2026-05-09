// ====== BetLine — Sports Betting Dashboard ======

const app = document.getElementById('app');
let currentView = 'dashboard';

// ====== Mock Data ======
const USER = { bankroll: 10000, totalBets: 47, wins: 28, losses: 17, pushes: 2, roi: 12.4 };

const BETS = [
  { id: 1, sport: '⚽', league: 'EPL', match: 'Liverpool vs Man City', pick: 'Liverpool (1X2)', odds: 2.45, stake: 200, result: 'win', profit: 490, date: '2026-05-08' },
  { id: 2, sport: '🏀', league: 'NBA', match: 'Lakers vs Celtics', pick: 'Over 215.5', odds: 1.91, stake: 150, result: 'win', profit: 286.5, date: '2026-05-08' },
  { id: 3, sport: '🎾', league: 'ATP Rome', match: 'Sinner vs Alcaraz', pick: 'Sinner Win', odds: 1.73, stake: 100, result: 'lose', profit: -100, date: '2026-05-07' },
  { id: 4, sport: '⚽', league: 'UCL', match: 'Real Madrid vs Bayern', pick: 'Both Teams to Score', odds: 1.85, stake: 250, result: 'win', profit: 462.5, date: '2026-05-07' },
  { id: 5, sport: '🏀', league: 'NBA', match: 'Warriors vs Nuggets', pick: 'Nuggets -4.5', odds: 2.10, stake: 120, result: 'pending', profit: 0, date: '2026-05-09' },
  { id: 6, sport: '⚽', league: 'Serie A', match: 'Inter vs Milan', pick: 'Over 2.5 Goals', odds: 1.95, stake: 180, result: 'pending', profit: 0, date: '2026-05-09' },
  { id: 7, sport: '⚽', league: 'EPL', match: 'Sunderland vs Man United', pick: 'Man United Win', odds: 1.85, stake: 250, result: 'pending', profit: 0, date: '2026-05-09' },
  { id: 8, sport: '⚽', league: 'EPL', match: 'Man City vs Brentford', pick: 'Man City -1.5', odds: 1.91, stake: 300, result: 'pending', profit: 0, date: '2026-05-09' },
  { id: 9, sport: '🏎️', league: 'F1', match: 'Miami GP', pick: 'Verstappen Win', odds: 1.45, stake: 300, result: 'pending', profit: 0, date: '2026-05-11' },
];

const PREDICTIONS = [
  { id: 1, sport: '⚽', league: 'EPL', match: 'Sunderland vs Man United', pick: 'Man United Win (-0.5)', odds: 1.85, confidence: 68, analysis: 'МЮ в форме (3W-1D-1L), обыграли Ливерпуль и Челси. Сандерленд нестабилен: 0-5 от Ноттингема. Фора -0.5 — букмекеры ждут победу МЮ.' },
  { id: 2, sport: '⚽', league: 'EPL', match: 'Man City vs Brentford', pick: 'Man City -1.5', odds: 1.91, confidence: 74, analysis: 'Сити дома — 4 матча без поражений (Арсенал, Челси). Брентфорд — 4 матча без побед. Фора -1.5 оправдана, как в матче с Сандерлендом (3-0).' },
  { id: 3, sport: '⚽', league: 'EPL', match: 'Arsenal vs Tottenham', pick: 'Arsenal Win', odds: 1.80, confidence: 78, analysis: 'Арсенал дома, потеря Тоттенхэмом ключевого защитника, xG Arsenal 2.1 vs 1.2' },
  { id: 4, sport: '🎾', league: 'ATP RG', match: 'Djokovic vs Alcaraz', pick: 'Djokovic +3.5 Games', odds: 1.91, confidence: 65, analysis: 'Джокович набирает форму, на грунте historical edge, Alcaraz после травмы' },
  { id: 5, sport: '🏀', league: 'NBA', match: 'Bucks vs Celtics', pick: 'Under 224.5', odds: 1.87, confidence: 71, analysis: 'Обе команды в топ-5 защиты, последние 5 встреч — 3 under' },
  { id: 6, sport: '🏎️', league: 'F1', match: 'Monaco GP', pick: 'Leclerc Top 3', odds: 1.65, confidence: 82, analysis: 'Король Монако. 3 поула подряд, 2 победы. Полюс практически гарантирован.' },
];

const LIVE = [
  { sport: '⚽', league: 'EPL', match: 'Sunderland 0-0 Man United', minute: 10, prediction: 'Man United Win @ 1.85', confidence: 68 },
  { sport: '⚽', league: 'EPL', match: 'Man City 0-0 Brentford', minute: 10, prediction: 'Man City -1.5 @ 1.91', confidence: 74 },
  { sport: '⚽', league: 'Bundesliga', match: 'Dortmund 2-1 RB Leipzig', minute: 72, prediction: 'Over 3.5 Goals @ 2.10', confidence: 63 },
  { sport: '🏀', league: 'NBA', match: 'Thunder 98-92 Mavericks', quarter: 3, prediction: 'Thunder -3.5 @ 1.95', confidence: 74 },
  { sport: '🎾', league: 'ATP Rome', match: 'Medvedev — Rublev', set: '2nd', prediction: 'Medvedev Win @ 1.53', confidence: 81 },
];

function fmt(n) { return n >= 0 ? '+$' + n.toLocaleString() : '-$' + Math.abs(n).toLocaleString(); }
function pct(n) { return (n * 100).toFixed(1) + '%'; }

// ====== Router ======
function show(view) {
  currentView = view;
  document.querySelectorAll('.topbar__btn').forEach(b => b.classList.toggle('active', b.dataset.tab === view));
  const fns = { dashboard, bets, predictions, live, stats };
  if (fns[view]) fns[view]();
}

// ====== Dashboard ======
function dashboard() {
  const wr = USER.wins / USER.totalBets;
  const profit = BETS.filter(b => b.result === 'win').reduce((s, b) => s + b.profit, 0) - BETS.filter(b => b.result === 'lose').reduce((s, b) => s + b.stake, 0);
  const activeBets = BETS.filter(b => b.result === 'pending').length;

  app.innerHTML = `
    <div class="view">
      <h2>BetLine</h2>
      <p>Персональная аналитика ставок</p>
      <div class="cards">
        <div class="card card--hl">
          <div class="card__l">Банкролл</div>
          <div class="card__v card__v--up">$${USER.bankroll.toLocaleString()}</div>
          <div class="card__t card__t--up">+${USER.roi}% ROI</div>
        </div>
        <div class="card">
          <div class="card__l">Всего ставок</div>
          <div class="card__v">${USER.totalBets}</div>
          <div class="card__t">${USER.wins}W / ${USER.losses}L / ${USER.pushes}P</div>
        </div>
        <div class="card">
          <div class="card__l">Win Rate</div>
          <div class="card__v">${pct(wr)}</div>
          <div class="card__t card__t--up">+${USER.roi}% над bankroll</div>
        </div>
        <div class="card">
          <div class="card__l">Активных ставок</div>
          <div class="card__v">${activeBets}</div>
          <div class="card__t">${PREDICTIONS.length} новых прогнозов</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="block">
          <div class="block__h">Последние ставки <span>${BETS.filter(b => b.result !== 'pending').length} завершено</span></div>
          ${BETS.filter(b => b.result !== 'pending').slice(0, 4).map(b => `
            <div class="bet-item">
              <span class="bet-icon">${b.sport}</span>
              <div class="bet-info">
                <div class="name">${b.match}</div>
                <div class="detail">${b.pick} @ ${b.odds}</div>
              </div>
              <span class="bet-status bet-status--${b.result}">${b.result === 'win' ? '✅' : '❌'}</span>
              <span class="bet-amount bet-amount--${b.result}">${fmt(b.result === 'win' ? b.profit : -b.stake)}</span>
            </div>
          `).join('')}
        </div>
        <div class="block">
          <div class="block__h">Прогнозы <span>AI-powered</span></div>
          ${PREDICTIONS.slice(0, 3).map(p => `
            <div class="pred-item" onclick="show('predictions')">
              <div class="pred-h">
                <span>${p.sport} ${p.league}: <strong>${p.match}</strong></span>
                <span class="sport-tag">${p.confidence}%</span>
              </div>
              <div class="pred-m">${p.pick} @ ${p.odds}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

// ====== Bets ======
function bets() {
  app.innerHTML = `
    <div class="view">
      <h2>🎯 Мои ставки</h2>
      <p>Все ставки: ${BETS.length} | +${BETS.filter(b => b.result === 'win').length}W / ${BETS.filter(b => b.result === 'lose').length}L</p>
      ${['pending', 'win', 'lose'].map(status => `
        ${BETS.filter(b => b.result === status).length ? `
          <div class="block" style="margin-bottom:12px">
            <div class="block__h">${status === 'pending' ? '⏳ Активные' : status === 'win' ? '✅ Выигрыш' : '❌ Проигрыш'}</div>
            ${BETS.filter(b => b.result === status).map(b => `
              <div class="bet-item">
                <span class="bet-icon">${b.sport}</span>
                <div class="bet-info">
                  <div class="name">${b.match}</div>
                  <div class="detail">${b.pick} @ ${b.odds} | $${b.stake} | ${b.date}</div>
                </div>
                <span class="bet-status bet-status--${b.result}">
                  ${b.result === 'win' ? '✅' : b.result === 'lose' ? '❌' : '⏳'}
                </span>
                <span class="bet-amount bet-amount--${b.result}">
                  ${b.result === 'pending' ? `$${b.stake}` : fmt(b.result === 'win' ? b.profit : -b.stake)}
                </span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `).join('')}
    </div>
  `;
}

// ====== Predictions ======
function predictions() {
  app.innerHTML = `
    <div class="view">
      <h2>🔮 Прогнозы AI</h2>
      <p>На основе live данных ESPN, Transfermarkt, FastF1 и рынков Kalshi/Polymarket</p>
      ${PREDICTIONS.map(p => {
        const confClass = p.confidence >= 70 ? 'h' : p.confidence >= 60 ? 'm' : 'l';
        return `
          <div class="pred-item">
            <div class="pred-h">
              <span>${p.sport} <strong>${p.league}</strong> • ${p.match}</span>
              <span class="sport-tag">${p.sport === '⚽' ? 'Football' : p.sport === '🏀' ? 'Basketball' : p.sport === '🎾' ? 'Tennis' : 'F1'}</span>
            </div>
            <div style="font-size:15px;font-weight:600">${p.pick}</div>
            <div class="pred-m" style="margin-top:4px">${p.analysis}</div>
            <div class="pred-f">
              <span class="odds">@ ${p.odds}</span>
              <span class="confidence confidence--${confClass}">Уверенность: ${p.confidence}% ${p.confidence >= 70 ? '🟢' : p.confidence >= 60 ? '🟡' : '🔴'}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// ====== Live ======
function live() {
  app.innerHTML = `
    <div class="view">
      <h2>⚡ Live события</h2>
      <p>Прямо сейчас. Данные обновляются каждую минуту.</p>
      ${LIVE.map(l => `
        <div class="live-item">
          <div class="live-dot"></div>
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${l.match}</div>
            <div style="font-size:12px;color:#a1a1aa">${l.sport} ${l.league} • ${l.minute ? l.minute + "'" : l.quarter + 'Q ' + l.set ? l.set : ''}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:13px;font-weight:600">${l.prediction}</div>
            <div style="font-size:11px;color:#a1a1aa">Conf ${l.confidence}%</div>
          </div>
        </div>
      `).join('')}
      <div style="margin-top:16px;padding:16px;background:rgba(253,203,110,0.03);border:1px solid rgba(253,203,110,0.1);border-radius:8px;text-align:center;color:#a1a1aa">
        ⚡ Live данные приходят из machina-sports/sports-skills (ESPN, Kalshi, Polymarket)
      </div>
    </div>
  `;
}

// ====== Stats ======
function stats() {
  const profit = BETS.filter(b => b.result === 'win').reduce((s, b) => s + b.profit, 0) - BETS.filter(b => b.result === 'lose').reduce((s, b) => s + b.stake, 0);
  const totalStaked = BETS.reduce((s, b) => s + b.stake, 0);
  const bestSport = '⚽ Football';
  const bestSportWR = pct(BETS.filter(b => b.sport === '⚽' && b.result === 'win').length / BETS.filter(b => b.sport === '⚽' && b.result !== 'pending').length);

  const sportStats = [
    { name: '⚽ Футбол', bets: BETS.filter(b => b.sport === '⚽').length, wins: BETS.filter(b => b.sport === '⚽' && b.result === 'win').length, losses: BETS.filter(b => b.sport === '⚽' && b.result === 'lose').length },
    { name: '🏀 Баскетбол', bets: BETS.filter(b => b.sport === '🏀').length, wins: BETS.filter(b => b.sport === '🏀' && b.result === 'win').length, losses: BETS.filter(b => b.sport === '🏀' && b.result === 'lose').length },
    { name: '🎾 Теннис', bets: BETS.filter(b => b.sport === '🎾').length, wins: BETS.filter(b => b.sport === '🎾' && b.result === 'win').length, losses: BETS.filter(b => b.sport === '🎾' && b.result === 'lose').length },
  ];

  app.innerHTML = `
    <div class="view">
      <h2>📈 ROI & Статистика</h2>
      <p>Детальный анализ эффективности</p>
      <div class="cards">
        <div class="card card--hl">
          <div class="card__l">Общий ROI</div>
          <div class="card__v card__v--up">${USER.roi}%</div>
          <div class="card__t">$${profit.toLocaleString()} чистой прибыли</div>
        </div>
        <div class="card">
          <div class="card__l">Всего поставлено</div>
          <div class="card__v">$${totalStaked.toLocaleString()}</div>
          <div class="card__t">средняя ставка $${Math.round(totalStaked / USER.totalBets)}</div>
        </div>
        <div class="card">
          <div class="card__l">Лучший вид спорта</div>
          <div class="card__v card__v--up">${bestSport}</div>
          <div class="card__t">WR ${bestSportWR}</div>
        </div>
        <div class="card">
          <div class="card__l">Текущая серия</div>
          <div class="card__v card__v--up">2W</div>
          <div class="card__t">2 победы подряд</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="block">
          <div class="block__h">По видам спорта</div>
          ${sportStats.map(s => {
            const wr = s.bets > 0 ? (s.wins / (s.wins + s.losses) * 100).toFixed(0) : 0;
            return `
              <div style="margin-bottom:12px">
                <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:2px">
                  <span>${s.name}</span><span style="font-weight:700">${s.wins}W / ${s.losses}L (${wr}%)</span>
                </div>
                <div class="bar"><div class="bar__fill" style="width:${wr}%;background:${parseInt(wr) >= 60 ? '#55efc4' : '#fdcb6e'}"></div></div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="block">
          <div class="block__h">Советы <span>AI</span></div>
          <div class="stat-row"><span class="l">Рекомендуемый банкролл</span><span class="v">$${USER.bankroll.toLocaleString()}</span></div>
          <div class="stat-row"><span class="l">Kelly Criterion (рекомендация)</span><span class="v v--p">1.5%</span></div>
          <div class="stat-row"><span class="l">Макс. ставка (5% bankroll)</span><span class="v">$${(USER.bankroll * 0.05).toFixed(0)}</span></div>
          <div class="stat-row"><span class="l">Лучший коэффициент</span><span class="v v--p">2.45 (Liverpool)</span></div>
          <div class="stat-row"><span class="l">Средний коэффициент</span><span class="v">1.91</span></div>
        </div>
      </div>
    </div>
  `;
}

// ====== Init ======
document.querySelectorAll('.topbar__btn').forEach(b => {
  b.addEventListener('click', () => show(b.dataset.tab));
});
show('dashboard');
console.log('🧿 BetLine loaded');
