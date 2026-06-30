// === LOADER ===
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 1800);
});

// === CURSOR GLOW ===
const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  let mx = 0;
  let my = 0;
  let glowRaf = null;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    if (glowRaf) return;
    glowRaf = requestAnimationFrame(() => {
      glow.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      glowRaf = null;
    });
  }, { passive: true });
}

// === HERO MASTHEAD CHAR SPLIT ===
const masthead = document.getElementById('masthead');
const html = masthead.innerHTML;
const lineThrough = masthead.querySelector('.line-through');
const lineThroughText = lineThrough.textContent;
// Split TAP into chars
const tapText = 'TAP';
let charIndex = 0;
let newHTML = '';
for (let i = 0; i < tapText.length; i++) {
  newHTML += `<span class="char" style="animation-delay:${1.9 + charIndex * 0.06}s">${tapText[i]}</span>`;
  charIndex++;
}
newHTML += '<span class="line-through">';
for (let i = 0; i < lineThroughText.length; i++) {
  newHTML += `<span class="char" style="animation-delay:${1.9 + charIndex * 0.06}s">${lineThroughText[i]}</span>`;
  charIndex++;
}
newHTML += '</span>';
masthead.innerHTML = newHTML;

// === SCROLL REVEAL ===
const scrollEls = document.querySelectorAll('[data-scroll]');
const scrollObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('in-view'), delay);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
scrollEls.forEach(el => scrollObs.observe(el));

// === 3D TILT ON FEATURE CARDS ===
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -12;
    const rotateY = (x - 0.5) * 12;
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    card.style.setProperty('--mx', (x * 100) + '%');
    card.style.setProperty('--my', (y * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// === 3D TILT ON PHONES ===
document.querySelectorAll('[data-tilt-phone]').forEach(wrap => {
  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    wrap.style.transform = `perspective(800px) rotateY(${x * 20}deg) rotateX(${-y * 15}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    wrap.style.transform = '';
  });
});

// === MAGNETIC BUTTONS ===
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// === COUNT UP ===
const countObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = () => {
        current++;
        el.textContent = current;
        if (current < target) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.count-up').forEach(el => countObs.observe(el));

// === SMOOTH NAV ===
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// === PARALLAX on tagline bg text ===
const taglineBg = document.querySelector('.tagline-bg-text');
if (taglineBg) {
  window.addEventListener('scroll', () => {
    const rect = taglineBg.parentElement.getBoundingClientRect();
    const progress = -rect.top / window.innerHeight;
    taglineBg.style.transform = `translate(-50%, -50%) translateX(${progress * 80}px) scale(${1 + progress * 0.05})`;
  }, { passive: true });
}

// === SCROLL-DRIVEN 3D PHONE SHOWCASE ===
(function() {
  const pin = document.getElementById('showcase');
  const phone = document.getElementById('showcasePhone');
  const shadow = document.getElementById('showcaseShadow');
  const bgText = document.getElementById('showcaseBgText');
  const screens = document.querySelectorAll('.showcase-phone-screens img');
  const captions = document.querySelectorAll('.showcase-caption');
  const dots = document.querySelectorAll('.showcase-dot');
  const mobileNav = document.querySelector('.showcase-mobile-nav');
  const mobileDotsContainer = document.getElementById('showcaseMobileDots');
  const prevBtn = document.getElementById('showcasePrev');
  const nextBtn = document.getElementById('showcaseNext');
  if (!pin || !phone) return;

  const numSteps = 5;
  const bgWords = ['HOME', 'REPORTS', 'INSIGHTS', 'BACK TAP', 'SYNC'];
  const mobileQuery = window.matchMedia('(max-width: 768px)');

  let currentStep = 0;
  let raf = null;

  function setShowcaseStep(step) {
    currentStep = Math.max(0, Math.min(numSteps - 1, step));
    screens.forEach((img, i) => img.classList.toggle('active', i === currentStep));
    captions.forEach((cap, i) => cap.classList.toggle('active', i === currentStep));
    dots.forEach((d, i) => d.classList.toggle('active', i === currentStep));
    mobileDotsContainer?.querySelectorAll('button').forEach((d, i) => {
      d.classList.toggle('active', i === currentStep);
    });
    if (bgWords[currentStep] && bgText) bgText.textContent = bgWords[currentStep];
  }

  // Build mobile dots
  if (mobileDotsContainer) {
    for (let i = 0; i < numSteps; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Screen ${i + 1}`);
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => setShowcaseStep(i));
      mobileDotsContainer.appendChild(btn);
    }
  }

  dots.forEach(d => {
    d.addEventListener('click', () => setShowcaseStep(parseInt(d.dataset.step, 10)));
  });
  prevBtn?.addEventListener('click', () => setShowcaseStep(currentStep - 1));
  nextBtn?.addEventListener('click', () => setShowcaseStep(currentStep + 1));

  if (mobileNav) {
    mobileNav.setAttribute('aria-hidden', mobileQuery.matches ? 'false' : 'true');
    mobileQuery.addEventListener('change', e => {
      mobileNav.setAttribute('aria-hidden', e.matches ? 'false' : 'true');
      if (e.matches) {
        phone.style.transform = '';
        if (shadow) {
          shadow.style.transform = '';
          shadow.style.opacity = '';
        }
        if (bgText) bgText.style.transform = '';
      } else {
        update();
      }
    });
  }

  const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const lerp = (a, b, t) => a + (b - a) * t;

  function update() {
    if (mobileQuery.matches) return;

    const rect = pin.getBoundingClientRect();
    const winH = window.innerHeight;
    const total = pin.offsetHeight - winH;
    const progress = Math.max(0, Math.min(1, -rect.top / total));

    const stepFloat = progress * (numSteps - 1);
    const step = Math.round(stepFloat);

    const keys = [
      { ry: -18, rx: 6,  rz: -2, tz: 0,    ty: 0,   tx: -60, s: 1.0 },
      { ry: 12,  rx: -3, rz: 2,  tz: 60,   ty: -10, tx: 50,  s: 1.04 },
      { ry: -10, rx: 8,  rz: -4, tz: -40,  ty: 0,   tx: -40, s: 0.95 },
      { ry: 18,  rx: -4, rz: 3,  tz: 80,   ty: -20, tx: 60,  s: 1.05 },
      { ry: 0,   rx: 0,  rz: 0,  tz: 60,   ty: 0,   tx: 0,   s: 1.1 }
    ];

    const i0 = Math.min(Math.floor(stepFloat), numSteps - 2);
    const i1 = i0 + 1;
    const t = stepFloat - i0;
    const e = easeInOut(Math.max(0, Math.min(1, t)));

    const k0 = keys[i0];
    const k1 = keys[i1];
    const ry = lerp(k0.ry, k1.ry, e);
    const rx = lerp(k0.rx, k1.rx, e);
    const rz = lerp(k0.rz, k1.rz, e);
    const tz = lerp(k0.tz, k1.tz, e);
    const ty = lerp(k0.ty, k1.ty, e);
    const tx = lerp(k0.tx, k1.tx, e);
    const s  = lerp(k0.s,  k1.s,  e);

    phone.style.transform =
      `translate3d(${tx}px, ${ty}px, 0) ` +
      `scale(${s}) ` +
      `rotateY(${ry}deg) rotateX(${rx}deg) rotateZ(${rz}deg) ` +
      `translateZ(${tz}px)`;

    if (shadow) {
      shadow.style.transform = `scaleX(${1 - Math.abs(ry) * 0.01}) scaleY(${1 - Math.abs(tz) * 0.002}) translateY(${tz * 0.1}px)`;
      shadow.style.opacity = 0.3 + Math.abs(tz) * 0.002;
    }

    if (bgText) {
      bgText.style.transform = `translate(${-50 - progress * 30}%, -50%) scale(${1 + progress * 0.1})`;
    }

    if (step !== currentStep) setShowcaseStep(step);
  }

  function onScroll() {
    if (mobileQuery.matches) return;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      update();
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  setShowcaseStep(0);
  update();
})();
