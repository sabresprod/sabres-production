// ==========================================
// SABRES PRODUCTION — script.js v3
// ==========================================

// ---- Custom Cursor ----
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
document.querySelectorAll('a, button, .project-item, .service-card').forEach(el => {
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

// ---- Navbar ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ---- Hamburger ----
const hamburger  = document.getElementById('navHamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.mobile-link').forEach(link => link.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}));

// ---- Scroll Reveal ----
const revealEls = document.querySelectorAll('.reveal-up, .service-card, .about-left, .about-right, .contact-item');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }});
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => { el.classList.add('reveal-up'); revealObs.observe(el); });

// ---- Sabres Two-Layer Reveal ----
const sabresNaked = document.getElementById('sabresNaked');
const sabresFull  = document.getElementById('sabresFull');

function updateSabres() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  if (docHeight <= 0) return;
  const p = Math.min(scrollTop / docHeight, 1); // 0 → 1

  // Naked: always at high opacity, fades out gently in the last 20% of scroll
  const nakedOpacity = p < 0.8 ? 0.82 : 0.82 - ((p - 0.8) / 0.2) * 0.45;
  sabresNaked.style.opacity   = nakedOpacity.toFixed(3);

  // Full: starts fading in at 10% scroll, reaches 1.0 at 100%
  const fullP    = Math.max(0, (p - 0.1) / 0.9);
  // ease-in-out curve
  const eased    = fullP < 0.5 ? 2 * fullP * fullP : 1 - Math.pow(-2 * fullP + 2, 2) / 2;
  const scale    = 0.72 + eased * 0.28; // 0.72 → 1.0 (accessories "grow outward")
  sabresFull.style.opacity   = eased.toFixed(3);
  sabresFull.style.transform = `scale(${scale.toFixed(3)})`;
}

window.addEventListener('scroll', updateSabres, { passive: true });
updateSabres();

// ---- Work Tabs ----
const tabBtns    = document.querySelectorAll('.tab-btn');
const listCareer = document.getElementById('list-career');
const listHobby  = document.getElementById('list-hobby');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    closePlayer();
    showState('default');
    document.querySelectorAll('.project-item').forEach(i => i.classList.remove('open'));
    const tab = btn.getAttribute('data-tab');
    listCareer.classList.toggle('hidden', tab !== 'career');
    listHobby.classList.toggle('hidden',  tab !== 'hobby');
  });
});

// ---- Preview Panel — 3 States ----
const previewDefault    = document.getElementById('previewDefault');
const previewThumbWrap  = document.getElementById('previewThumbWrap');
const previewPlayerWrap = document.getElementById('previewPlayerWrap');
const previewThumb      = document.getElementById('previewThumb');
const previewMultiBadge = document.getElementById('previewMultiBadge');
const previewPlayBtn    = document.getElementById('previewPlayBtn');
const previewBackBtn    = document.getElementById('previewBackBtn');
const previewIframe     = document.getElementById('previewIframe');

let currentVideoId = '';
let playerActive   = false;

function showState(state) {
  previewDefault.classList.toggle('active',    state === 'default');
  previewThumbWrap.classList.toggle('active',  state === 'thumb');
  previewPlayerWrap.classList.toggle('active', state === 'player');
}

function showThumb(thumb, fallback, videoId, isMulti) {
  if (playerActive) return; // don't interrupt a playing video
  currentVideoId = videoId;
  previewThumb.src = thumb;
  previewThumb.onerror = () => {
    previewThumb.src = fallback;
    previewThumb.onerror = null;
  };
  if (isMulti) {
    previewMultiBadge.style.display = 'block';
    previewPlayBtn.style.display    = 'none';
  } else {
    previewMultiBadge.style.display = 'none';
    previewPlayBtn.style.display    = 'flex';
  }
  showState('thumb');
}

function hideThumb() {
  if (playerActive) return;
  showState('default');
}

function playVideo() {
  if (!currentVideoId) return;
  previewIframe.src = `https://www.youtube.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`;
  playerActive = true;
  showState('player');
}

function closePlayer() {
  previewIframe.src = ''; // stops video playback
  playerActive = false;
  showState('default');
  currentVideoId = '';
}

// Play / Back buttons
previewPlayBtn.addEventListener('click', e => {
  e.stopPropagation();
  playVideo();
});
previewBackBtn.addEventListener('click', () => {
  closePlayer();
});

// ---- Project Items ----
const projectItems = document.querySelectorAll('.project-item');

projectItems.forEach(item => {
  const thumb    = item.getAttribute('data-thumb');
  const fallback = item.getAttribute('data-fallback') || thumb;
  const videoId  = item.getAttribute('data-videoid');
  const isMulti  = item.getAttribute('data-multi') === 'true';
  const header   = item.querySelector('.proj-header');

  // Hover: show thumbnail (only if player not active)
  header.addEventListener('mouseenter', () => showThumb(thumb, fallback, videoId, isMulti));
  header.addEventListener('mouseleave', () => {
    // Only hide if this item isn't open
    if (!item.classList.contains('open') && !playerActive) {
      hideThumb();
    }
  });

  // Click header: toggle description open/close
  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all other items
    projectItems.forEach(other => {
      if (other !== item) other.classList.remove('open');
    });

    item.classList.toggle('open', !isOpen);

    // If multi (UGC), don't try to play in preview; show thumbnail
    if (!isOpen && !isMulti && videoId) {
      // Keep thumbnail visible when open
      showThumb(thumb, fallback, videoId, isMulti);
    }

    // If closing, hide thumb (unless hovering)
    if (isOpen) {
      hideThumb();
    }
  });
});

// Start with default state
showState('default');

// ---- Smooth Scroll ----
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
