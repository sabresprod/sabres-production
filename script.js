// ==========================================
// SABRES PRODUCTION — script.js v2
// ==========================================

// ---------- Custom Cursor ----------
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

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

const hoverEls = document.querySelectorAll('a, button, .project-row, .service-card');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width  = '56px';
    cursorRing.style.height = '56px';
    cursorRing.style.opacity = '1';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
    cursorRing.style.opacity = '0.6';
    cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// ---------- Navbar ----------
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---------- Hamburger ----------
const hamburger   = document.getElementById('navHamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
mobileLinks.forEach(link => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}));

// ---------- Scroll Reveal ----------
const revealEls = document.querySelectorAll('.reveal-up, .service-card, .about-left, .about-right, .contact-item');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => { el.classList.add('reveal-up'); revealObserver.observe(el); });

// ---------- Sabres Background Reveal ----------
const sabresBg = document.getElementById('sabresBg');

function updateSabres() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return;

  const progress = Math.min(scrollTop / docHeight, 1);

  // Ease-in-out (slow at start and end, fastest in middle)
  const t = progress;
  const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  sabresBg.style.opacity   = eased.toFixed(3);
  sabresBg.style.transform = `scale(${(0.45 + eased * 0.55).toFixed(3)})`;
}

window.addEventListener('scroll', updateSabres, { passive: true });
updateSabres();

// ---------- Work Tabs ----------
const tabBtns    = document.querySelectorAll('.tab-btn');
const listCareer = document.getElementById('list-career');
const listHobby  = document.getElementById('list-hobby');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    hidePreview();
    const tab = btn.getAttribute('data-tab');
    listCareer.classList.toggle('hidden', tab !== 'career');
    listHobby.classList.toggle('hidden',  tab !== 'hobby');
  });
});

// ---------- Work Preview ----------
const previewDefault   = document.getElementById('previewDefault');
const previewThumbWrap = document.getElementById('previewThumbWrap');
const previewThumb     = document.getElementById('previewThumb');
const previewMultiBadge = document.getElementById('previewMultiBadge');

let currentLink = '';

function showPreview(thumb, fallback, link, isMulti) {
  currentLink = link;
  previewThumb.src = thumb;
  previewThumb.onerror = () => { previewThumb.src = fallback; };
  previewDefault.classList.add('hidden');
  previewThumbWrap.classList.add('visible');
  if (isMulti) previewMultiBadge.classList.add('visible');
  else         previewMultiBadge.classList.remove('visible');
}

function hidePreview() {
  currentLink = '';
  previewDefault.classList.remove('hidden');
  previewThumbWrap.classList.remove('visible');
  previewMultiBadge.classList.remove('visible');
}

// Click preview panel → open link
previewThumbWrap.addEventListener('click', () => {
  if (currentLink) window.open(currentLink, '_blank');
});

// ---------- Project Rows ----------
const projectRows = document.querySelectorAll('.project-row');

projectRows.forEach(row => {
  const thumb   = row.getAttribute('data-thumb');
  const fallback = row.getAttribute('data-fallback') || thumb;
  const link    = row.getAttribute('data-link');
  const isMulti = row.getAttribute('data-multi') === 'true';

  row.addEventListener('mouseenter', () => showPreview(thumb, fallback, link, isMulti));
  row.addEventListener('mouseleave', () => hidePreview());

  row.addEventListener('click', () => {
    if (isMulti) {
      // Toggle expand
      const rowId    = row.id.replace('row-', '');
      const expand   = document.getElementById(rowId + '-expand');
      const arrowEl  = document.getElementById(rowId + '-arrow');
      if (!expand) return;
      const opening  = !expand.classList.contains('open');
      expand.classList.toggle('open', opening);
      if (arrowEl) arrowEl.innerHTML = opening ? '&#8593;' : '&#8595;';
    } else if (link) {
      window.open(link, '_blank');
    }
  });
});

// ---------- Smooth Scroll ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 72,
        behavior: 'smooth'
      });
    }
  });
});
