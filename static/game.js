// ── DATA ──────────────────────────────────────────────────────────────────
let REAL = [];
let FAKE = [];

Promise.all([
  fetch('data/ukrant_headlines.json').then(r => r.json()),
  fetch('data/ukrant_fake_headlines.json').then(r => r.json())
]).then(([realData, fakeData]) => {
  REAL = realData.map(h => h.title);
  FAKE = fakeData.map(h => h.title);
  loadRound();
}).catch(err => {
  console.error('Failed to load headlines:', err);
});

const RATINGS = [
  [0,  2,  "Reads only the horoscope page"],
  [3,  4,  "Occasional visitor to the front page"],
  [5,  6,  "Reliable reader of the print edition"],
  [7,  8,  "Could write the editorial column"],
  [9,  9,  "Editor-in-chief material"],
  [10, 10, "Are you sure you didn't write these?"],
];

const TOTAL_ROUNDS = 10;

// ── STATE ─────────────────────────────────────────────────────────────────
let score = 0;
let round = 0;
let streak = 0;
let answered = false;
let usedReal = [];
let usedFake = [];
let currentLieIndex = -1;

// ── UTILS ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUnused(pool, used) {
  const available = pool.filter((_, i) => !used.includes(i));
  if (available.length === 0) { used.length = 0; return pickUnused(pool, used); }
  const idx = pool.indexOf(available[Math.floor(Math.random() * available.length)]);
  used.push(idx);
  return pool[idx];
}

// ── GAME LOGIC ────────────────────────────────────────────────────────────
function loadRound() {
  answered = false;

  // Pick 2 real + 1 fake
  const real1 = pickUnused(REAL, usedReal);
  let real2 = pickUnused(REAL, usedReal);
  const fake  = pickUnused(FAKE, usedFake);

  const headlines = shuffle([real1, real2, fake]);
  currentLieIndex = headlines.indexOf(fake);

  // Render
  for (let i = 0; i < 3; i++) {
    document.getElementById(`headline-${i}`).textContent = headlines[i];
    const card = document.getElementById(`card-${i}`);
    card.className = 'card';
    card.onclick = () => guess(i);
    document.getElementById(`verdict-${i}`).textContent = '';
    document.getElementById(`cta-${i}`).style.display = 'block';
  }

  // Update counters
  document.getElementById('round-display').textContent = round + 1;
  document.getElementById('score-display').textContent = score;
  document.getElementById('streak-display').textContent = streak;

  // Hide feedback
  const fb = document.getElementById('feedback');
  fb.classList.remove('show');

  // Disable next button
  document.getElementById('next-btn').disabled = true;

  // Hide end screen
  document.getElementById('end-screen').classList.remove('show');
  document.getElementById('game-area').querySelector('.cards').style.display = 'grid';
  document.getElementById('feedback').style.display = 'block';
  document.getElementById('btn-row').style.display = 'flex';
  document.querySelector('.section-label').style.display = 'block';
  document.querySelector('.quiz-title').style.display = 'block';
  document.querySelector('.quiz-deck').style.display = 'block';
  document.querySelector('.divider').style.display = 'flex';
}

function guess(index) {
  if (answered) return;
  answered = true;

  const correct = index === currentLieIndex;

  // Reveal all cards
  for (let i = 0; i < 3; i++) {
    const card = document.getElementById(`card-${i}`);
    const verdict = document.getElementById(`verdict-${i}`);
    document.getElementById(`cta-${i}`).style.display = 'none';
    card.onclick = null;

    if (i === currentLieIndex) {
      card.classList.add('lie-revealed');
      verdict.textContent = '✗ The Lie';
    } else {
      card.classList.add('truth-revealed');
      verdict.textContent = '✓ True';
    }
  }

  // Feedback
  const fbEl = document.getElementById('feedback');
  const fbH  = document.getElementById('feedback-headline');
  const fbS  = document.getElementById('feedback-sub');

  if (correct) {
    score++;
    streak++;
    fbH.textContent = 'Correct.';
    fbH.className = 'feedback-headline correct';
    fbS.textContent = streak > 2 ? `${streak} in a row — the newsroom awaits.` : 'You spotted the fabrication.';
  } else {
    streak = 0;
    fbH.textContent = 'Wrong.';
    fbH.className = 'feedback-headline wrong';
    fbS.textContent = 'A convincing fabrication, we admit.';
  }

  fbEl.classList.add('show');

  // Update score display
  document.getElementById('score-display').textContent = score;
  document.getElementById('streak-display').textContent = streak;

  // Enable next
  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = false;
  round++;

  if (round >= TOTAL_ROUNDS) {
    nextBtn.textContent = 'See Results →';
  }
}

function nextRound() {
  if (round >= TOTAL_ROUNDS) {
    showEndScreen();
    return;
  }
  loadRound();
}

function showEndScreen() {
  // Hide game elements
  document.getElementById('game-area').querySelector('.cards').style.display = 'none';
  document.getElementById('feedback').style.display = 'none';
  document.getElementById('btn-row').style.display = 'none';
  document.querySelector('.section-label').style.display = 'none';
  document.querySelector('.quiz-title').style.display = 'none';
  document.querySelector('.quiz-deck').style.display = 'none';
  document.querySelector('.divider').style.display = 'none';

  // Rating
  let rating = '';
  for (const [lo, hi, label] of RATINGS) {
    if (score >= lo && score <= hi) { rating = label; break; }
  }

  document.getElementById('end-score').textContent = `${score} / ${TOTAL_ROUNDS}`;
  document.getElementById('end-rating').textContent = `"${rating}"`;
  document.getElementById('end-screen').classList.add('show');
}

function resetGame() {
  score = 0;
  round = 0;
  streak = 0;
  answered = false;
  usedReal = [];
  usedFake = [];

  document.getElementById('next-btn').textContent = 'Next Round →';
  document.getElementById('game-area').querySelector('.cards').style.display = 'grid';
  document.getElementById('feedback').style.display = 'block';
  document.getElementById('btn-row').style.display = 'flex';
  document.querySelector('.section-label').style.display = 'block';
  document.querySelector('.quiz-title').style.display = 'block';
  document.querySelector('.quiz-deck').style.display = 'block';
  document.querySelector('.divider').style.display = 'flex';

  loadRound();
}

// ── INIT ──────────────────────────────────────────────────────────────────
document.getElementById('total-rounds').textContent = TOTAL_ROUNDS;
document.getElementById('todays-date').textContent = new Date().toLocaleDateString('en-GB', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
});