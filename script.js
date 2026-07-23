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
  if (playerActive) {
    if (currentVideoId === videoId && videoId && !isMulti) {
      return; // Don't interrupt if hovering over the playing project itself
    }
    closePlayer();
  }
  currentVideoId = videoId;
  previewThumb.src = thumb;
  previewThumb.onerror = () => {
    previewThumb.src = fallback;
    previewThumb.onerror = null;
  };
  if (isMulti) {
    previewMultiBadge.style.display = 'block';
    previewPlayBtn.style.display    = videoId ? 'flex' : 'none';
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
  previewIframe.src = `https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`;
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

// Start with first career project thumbnail as default
const _firstItem = document.querySelector('#list-career .project-item');
if (_firstItem) {
  showThumb(
    _firstItem.getAttribute('data-thumb'),
    _firstItem.getAttribute('data-fallback') || _firstItem.getAttribute('data-thumb'),
    _firstItem.getAttribute('data-videoid'),
    _firstItem.getAttribute('data-multi') === 'true'
  );
} else {
  showState('default');
}

// ---- Smooth Scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  // Skip marquee items — they have their own handler
  if (a.classList.contains('marquee-item')) return;
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

// ---- Marquee Click Navigation ----
document.querySelectorAll('.marquee-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const targetId = item.getAttribute('data-target');
    const tabName  = item.getAttribute('data-tab');

    // 1. Switch to the correct tab if needed
    const targetTabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (targetTabBtn && !targetTabBtn.classList.contains('active')) {
      targetTabBtn.click();
    }

    // 2. Scroll to the Work section
    const workSection = document.getElementById('work');
    if (workSection) {
      window.scrollTo({
        top: workSection.getBoundingClientRect().top + window.scrollY - 72,
        behavior: 'smooth'
      });
    }

    // 3. After scroll settles, open the specific project
    setTimeout(() => {
      const projectEl = document.getElementById(targetId);
      if (projectEl) {
        const header = projectEl.querySelector('.proj-header');
        if (header) header.click();
        setTimeout(() => {
          projectEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }, 650);
  });
});



// ---- SABRES Spike Hover ----
const spikeWord = document.getElementById('sabresSpikeWord');

if (spikeWord) {
  const letterProfiles = [
    [
      { x: 24, y: 4, side: 'top', r: -10 },
      { x: 70, y: 5, side: 'top', r: 8 },
      { x: 4, y: 34, side: 'left', r: -92 },
      { x: 94, y: 66, side: 'right', r: 90 },
    ],
    [
      { x: 50, y: 2, side: 'top', r: 0 },
      { x: 16, y: 42, side: 'left', r: -70 },
      { x: 84, y: 42, side: 'right', r: 70 },
    ],
    [
      { x: 25, y: 3, side: 'top', r: -7 },
      { x: 92, y: 28, side: 'right', r: 84 },
      { x: 94, y: 70, side: 'right', r: 96 },
      { x: 5, y: 52, side: 'left', r: -90 }
    ],
    [
      { x: 26, y: 3, side: 'top', r: -7 },
      { x: 92, y: 28, side: 'right', r: 82 },
      { x: 73, y: 61, side: 'right', r: 112 },
      { x: 5, y: 52, side: 'left', r: -90 }
    ],
    [
      { x: 28, y: 3, side: 'top', r: -6 },
      { x: 76, y: 4, side: 'top', r: 7 },
      { x: 5, y: 52, side: 'left', r: -90 },
      { x: 78, y: 52, side: 'right', r: 90 },
    ],
    [
      { x: 24, y: 4, side: 'top', r: -10 },
      { x: 70, y: 5, side: 'top', r: 8 },
      { x: 4, y: 34, side: 'left', r: -92 },
      { x: 94, y: 66, side: 'right', r: 90 },
    ]
  ];

  const letters = [...spikeWord.querySelectorAll('.spike-letter')];

  letters.forEach((letter, letterIndex) => {
    const profile = letterProfiles[letterIndex] || letterProfiles[0];
    profile.forEach((point, pointIndex) => {
      const spike = document.createElement('i');
      spike.className = 'letter-spike';
      spike.style.setProperty('--x', point.x + '%');
      spike.style.setProperty('--y', point.y + '%');
      spike.style.setProperty('--r', point.r + 'deg');
      spike.dataset.x = point.x;
      spike.dataset.y = point.y;
      spike.dataset.seed = String((letterIndex + 1) * 17 + pointIndex * 9);
      const seed = Number(spike.dataset.seed);
      spike.style.setProperty('--w', (0.045 + (seed % 5) * 0.008) + 'em');
      spike.style.setProperty('--h', (0.10 + (seed % 4) * 0.025) + 'em');
      letter.appendChild(spike);
    });
  });

  function updateLetterSpikes(event) {
    letters.forEach(letter => {
      const rect = letter.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const letterDistance = Math.hypot(dx / Math.max(rect.width, 1), dy / Math.max(rect.height, 1));

      letter.querySelectorAll('.letter-spike').forEach(spike => {
        const anchorX = rect.left + rect.width * (Number(spike.dataset.x) / 100);
        const anchorY = rect.top + rect.height * (Number(spike.dataset.y) / 100);
        const distance = Math.hypot(event.clientX - anchorX, event.clientY - anchorY);
        const radius = Math.max(52, rect.width * 1.15);
        const proximity = Math.max(0, 1 - distance / radius);
        const letterBoost = Math.max(0, 1 - letterDistance * 0.9);
        const strength = Math.min(1, proximity * 1.1 + letterBoost * 0.18);

        spike.style.setProperty('--o', strength > 0.16 ? String(0.98 * strength) : '0');
        spike.style.setProperty('--s', strength > 0.16 ? String(0.35 + strength * 0.75) : '0');
      });
    });
  }

  function hideLetterSpikes() {
    spikeWord.querySelectorAll('.letter-spike').forEach(spike => {
      spike.style.setProperty('--o', '0');
      spike.style.setProperty('--s', '0');
    });
  }

  spikeWord.addEventListener('pointermove', updateLetterSpikes);
  spikeWord.addEventListener('pointerenter', updateLetterSpikes);
  spikeWord.addEventListener('pointerleave', hideLetterSpikes);
}

// Pages deploy trigger: 2026-07-03T18:10:55.122Z
