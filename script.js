// =========================================
// SABRES PRODUCTION — script.js
// =========================================

// ---------- Custom Cursor ----------
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover expansion on interactive elements
const hoverTargets = document.querySelectorAll('a, button, .project-card, .service-card, .tab-btn, .dot');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width  = '60px';
    cursorRing.style.height = '60px';
    cursorRing.style.opacity = '1';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.opacity = '0.6';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ---------- Navbar scroll effect ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---------- Hamburger Menu ----------
const hamburger  = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
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

// ---------- Scroll Reveal ----------
const revealEls = document.querySelectorAll('.reveal-up, .project-card, .service-card, .about-left, .about-right, .contact-item');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.classList.add('reveal-up');
  revealObserver.observe(el);
});

// ---------- Work Tabs ----------
const tabBtns = document.querySelectorAll('.tab-btn');
const careerGrid = document.getElementById('tab-content-career');
const hobbyGrid  = document.getElementById('tab-content-hobby');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.getAttribute('data-tab');
    if (tab === 'career') {
      careerGrid.classList.remove('hidden');
      hobbyGrid.classList.add('hidden');
    } else {
      hobbyGrid.classList.remove('hidden');
      careerGrid.classList.add('hidden');
    }
  });
});

// ---------- Project Card Click (open YouTube) ----------
document.querySelectorAll('.project-card[data-link]').forEach(card => {
  card.addEventListener('click', () => {
    window.open(card.getAttribute('data-link'), '_blank');
  });
});

// ---------- Carousel ----------
function initCarousel(id) {
  const track = document.getElementById(id + '-track');
  const dotsContainer = document.getElementById(id + '-dots');
  const dots  = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
  const slides = track ? track.querySelectorAll('.carousel-slide') : [];
  let current = 0;
  const total = slides.length;

  const container = document.getElementById(id + '-carousel');
  if (!container) return;

  // Hide arrows and dots if only 1 slide
  if (total <= 1) {
    container.querySelector('.carousel-btn--prev').style.display = 'none';
    container.querySelector('.carousel-btn--next').style.display = 'none';
    if (dotsContainer) dotsContainer.style.display = 'none';
    return;
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  container.querySelector('.carousel-btn--prev').addEventListener('click', e => {
    e.stopPropagation();
    goTo(current - 1);
  });
  container.querySelector('.carousel-btn--next').addEventListener('click', e => {
    e.stopPropagation();
    goTo(current + 1);
  });

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', e => {
      e.stopPropagation();
      goTo(i);
    });
  });

  // Touch/swipe support
  let startX = 0;
  container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  container.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });
}

initCarousel('sagi');
initCarousel('ugc');

// ---------- Smooth nav scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});
