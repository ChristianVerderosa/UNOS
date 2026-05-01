// $UNOS — United Nations Oil Supply

const CONTRACT_ADDRESS = 'PLACEHOLDER_UNOS_CA_GOES_HERE';

const TOKENOMICS = [
  { label: 'Transaction Reserve Fund', pct: 60, color: '#C9941A' },
  { label: 'Liquidity Pool',           pct: 25, color: '#A0A0A0' },
  { label: 'Development & Operations', pct: 15, color: '#5A4A18' },
];

// ─── CONTRACT ADDRESS SYNC ───────────────────────────────────────

document.querySelectorAll('.ca-address').forEach(el => {
  el.textContent = CONTRACT_ADDRESS;
});

// ─── COPY TO CLIPBOARD ───────────────────────────────────────────

function setupCopyBtn(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.addEventListener('click', () => {
    const original = btn.textContent;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CONTRACT_ADDRESS).then(() => {
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = original; }, 2200);
      }).catch(() => fallbackCopy(btn, original));
    } else {
      fallbackCopy(btn, original);
    }
  });
}

function fallbackCopy(btn, original) {
  const ta = document.createElement('textarea');
  ta.value = CONTRACT_ADDRESS;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    btn.textContent = 'Copied';
    setTimeout(() => { btn.textContent = original; }, 2200);
  } catch (e) {
    btn.textContent = 'Error';
    setTimeout(() => { btn.textContent = original; }, 2200);
  }
  document.body.removeChild(ta);
}

setupCopyBtn('caCopy');
setupCopyBtn('caCopy2');
setupCopyBtn('caCopy3');

// ─── NAVBAR SCROLL ───────────────────────────────────────────────

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
}, { passive: true });

// ─── ACTIVE NAV LINK ─────────────────────────────────────────────

const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const sections   = [...navAnchors]
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

function updateActiveLink() {
  const offset = window.scrollY + 120;
  let active = sections[0];
  sections.forEach(sec => {
    if (sec.offsetTop <= offset) active = sec;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + active.id);
  });
}

updateActiveLink();

// ─── MOBILE HAMBURGER ────────────────────────────────────────────

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── TOKENOMICS CHART ────────────────────────────────────────────

(function buildChart() {
  const canvas = document.getElementById('tokenomicsChart');
  if (!canvas || typeof Chart === 'undefined') return;

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels:   TOKENOMICS.map(t => t.label),
      datasets: [{
        data:            TOKENOMICS.map(t => t.pct),
        backgroundColor: TOKENOMICS.map(t => t.color),
        borderColor:     '#050504',
        borderWidth:     3,
        hoverOffset:     8,
      }],
    },
    options: {
      cutout:    '70%',
      animation: { duration: 1200, easing: 'easeInOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#111008',
          borderColor:     '#221A08',
          borderWidth:     1,
          titleColor:      '#E0E4EE',
          bodyColor:       '#5A6070',
          padding:         12,
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed}%`,
          },
        },
      },
    },
  });

  buildTokenRows();
})();

function buildTokenRows() {
  const container = document.getElementById('tokenomicsRows');
  if (!container) return;

  TOKENOMICS.forEach(({ label, pct, color }) => {
    const row = document.createElement('div');
    row.className = 'token-row';
    row.innerHTML = `
      <div class="token-row-left">
        <div class="token-swatch" style="background:${color}"></div>
        <span class="token-label">${label}</span>
      </div>
      <span class="token-pct">${pct}%</span>
    `;
    container.appendChild(row);
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────

const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach((el, i) => {
  el.dataset.delay = (i % 5) * 80;
  observer.observe(el);
});
