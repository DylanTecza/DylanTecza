/* ===========================
   NAVBAR SCROLL EFFECT
=========================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ===========================
   MOBILE MENU
=========================== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===========================
   SCROLL REVEAL
=========================== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ===========================
   SKILL BARS ANIMATION
=========================== */
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      const pct = fill.getAttribute('data-pct');
      // Delay slightly for staggered feel
      setTimeout(() => {
        fill.style.width = pct + '%';
      }, 200);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

/* ===========================
   ACTIVE NAV LINK (scroll spy)
=========================== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navItems.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}`
          ? 'var(--white)'
          : '';
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

/* ===========================
   HERO PARALLAX (subtle)
=========================== */
const heroBgText = document.querySelector('.hero-bg-text');
if (heroBgText) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroBgText.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}

/* ===========================
   SMOOTH CURSOR GLOW (desktop only)
=========================== */
if (window.innerWidth > 900) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 400px; height: 400px; border-radius: 50%;
    background: radial-gradient(circle, rgba(193,18,31,0.055) 0%, transparent 65%);
    transform: translate(-50%, -50%);
    transition: left 0.6s ease, top 0.6s ease;
    left: -200px; top: -200px;
  `;
  document.body.appendChild(glow);
  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
}

/* ===========================
   COUNTER ANIMATION FOR STATS
=========================== */
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const isDecimal = target % 1 !== 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isDecimal ? (eased * target).toFixed(1) : Math.floor(eased * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // Extract numeric value (strip non-numeric except decimal)
      const text = el.textContent;
      const match = text.match(/[\d.]+/);
      if (match) {
        const num = parseFloat(match[0]);
        const prefix = text.slice(0, text.indexOf(match[0]));
        // We'll re-render around the inner text node
        // Keep the accent span intact
        const accentEl = el.querySelector('.stat-accent');
        const accentText = accentEl ? accentEl.textContent : '';

        // Create a temp span for the number
        el.childNodes.forEach(n => { if (n.nodeType === Node.TEXT_NODE) n.remove(); });
        const numSpan = document.createElement('span');
        numSpan.textContent = '0';
        el.insertBefore(numSpan, el.firstChild);

        animateCounter(numSpan, num);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.8 });

statNums.forEach(el => counterObserver.observe(el));
