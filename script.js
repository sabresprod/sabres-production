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
const previewThumbWrap     = document.getElementById('previewThumbWrap');
const previewPlayerWrap    = document.getElementById('previewPlayerWrap');
const previewThumb         = document.getElementById('previewThumb');
const previewThumbVideo    = document.getElementById('previewThumbVideo');
const previewThumbVideoSrc = document.getElementById('previewThumbVideoSrc');
const previewMultiBadge    = document.getElementById('previewMultiBadge');
const previewPlayBtn       = document.getElementById('previewPlayBtn');
const previewBackBtn       = document.getElementById('previewBackBtn');
const previewIframe        = document.getElementById('previewIframe');
const previewVideo         = document.getElementById('previewVideo');
const previewVideoSrc      = document.getElementById('previewVideoSrc');
const previewNavPrev       = document.getElementById('previewNavPrev');
const previewNavNext       = document.getElementById('previewNavNext');
const previewVideoLabel    = document.getElementById('previewVideoLabel');

let currentVideoId      = '';
let currentVideoUrl     = '';
let playerActive        = false;
let currentProjectVideos= null;
let currentVideoIndex   = 0;

function showState(state) {
  previewDefault.classList.toggle('active',    state === 'default');
  previewThumbWrap.classList.toggle('active',  state === 'thumb');
  previewPlayerWrap.classList.toggle('active', state === 'player');
}

function updateNavArrows() {
  const hasMultiple = currentProjectVideos && currentProjectVideos.length > 1;
  previewNavPrev.classList.toggle('visible', hasMultiple);
  previewNavNext.classList.toggle('visible', hasMultiple);
  previewVideoLabel.classList.toggle('visible', hasMultiple);
  
  if (hasMultiple && currentProjectVideos[currentVideoIndex]) {
    const video = currentProjectVideos[currentVideoIndex];
    previewVideoLabel.innerHTML = `Video ${currentVideoIndex + 1} of ${currentProjectVideos.length}: ${video.title || ''}`;
  }
}

function renderActiveThumbnail(thumb, fallback, videoUrl) {
  if (videoUrl && (videoUrl.includes('.mp4') || videoUrl.includes('archive.org'))) {
    // Show exact 1st frame of MP4 video as thumbnail
    if (previewThumbVideo) {
      previewThumb.style.display = 'none';
      previewThumbVideo.style.display = 'block';
      const cleanUrl = videoUrl.includes('#t=') ? videoUrl : videoUrl + '#t=0.1';
      if (previewThumbVideoSrc.src !== cleanUrl) {
        previewThumbVideoSrc.src = cleanUrl;
        previewThumbVideo.load();
      }
    }
  } else {
    // Show image thumbnail for YouTube / static image
    if (previewThumbVideo) previewThumbVideo.style.display = 'none';
    previewThumb.style.display = 'block';
    if (thumb) {
      previewThumb.src = thumb;
      previewThumb.onerror = () => {
        if (fallback) previewThumb.src = fallback;
        previewThumb.onerror = null;
      };
    }
  }
}

function loadVideoFromProject(index) {
  if (!currentProjectVideos || !currentProjectVideos.length) return;
  currentVideoIndex = (index + currentProjectVideos.length) % currentProjectVideos.length;
  const videoData = currentProjectVideos[currentVideoIndex];

  if (videoData.type === 'mp4') {
    currentVideoUrl = videoData.url;
    currentVideoId  = '';
  } else {
    currentVideoId  = videoData.id;
    currentVideoUrl = '';
  }

  // Render first frame / unique thumbnail of selected video
  renderActiveThumbnail(videoData.thumb, videoData.fallback, currentVideoUrl);

  updateNavArrows();

  if (playerActive) {
    playVideo();
  }
}

function showThumb(thumb, fallback, videoId, isMulti, videoUrl, videosArray) {
  if (playerActive) {
    if (currentVideoId === videoId && videoId && !isMulti) return;
    if (currentVideoUrl === videoUrl && videoUrl && !isMulti) return;
    closePlayer();
  }

  currentProjectVideos = videosArray || null;
  currentVideoIndex    = 0;

  if (currentProjectVideos && currentProjectVideos.length > 0) {
    const firstVid = currentProjectVideos[0];
    if (firstVid.type === 'mp4') {
      currentVideoUrl = firstVid.url;
      currentVideoId  = '';
    } else {
      currentVideoId  = firstVid.id;
      currentVideoUrl = '';
    }
    if (firstVid.thumb) {
      thumb    = firstVid.thumb;
      fallback = firstVid.fallback || thumb;
    }
  } else {
    currentVideoId  = videoId  || '';
    currentVideoUrl = videoUrl || '';
  }

  updateNavArrows();
  renderActiveThumbnail(thumb, fallback, currentVideoUrl);

  if (isMulti && !currentProjectVideos) {
    previewMultiBadge.style.display = 'block';
    previewPlayBtn.style.display    = (videoId || videoUrl) ? 'flex' : 'none';
  } else {
    previewMultiBadge.style.display = 'none';
    previewPlayBtn.style.display    = 'flex';
  }
  showState('thumb');
}

function hideThumb() {
  if (playerActive) return;
  currentProjectVideos = null;
  updateNavArrows();
  showState('default');
}

function playVideo() {
  if (!currentVideoId && !currentVideoUrl) return;

  if (currentVideoUrl) {
    // Direct MP4 (e.g. archive.org)
    previewIframe.style.display = 'none';
    previewIframe.src = '';
    previewVideoSrc.src = currentVideoUrl;
    previewVideo.style.display = 'block';
    previewVideo.load();
    previewVideo.play().catch(() => {});
  } else {
    // YouTube embed
    previewVideo.style.display = 'none';
    previewVideo.pause();
    previewIframe.style.display = 'block';
    previewIframe.src = `https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&rel=0&modestbranding=1`;
  }
  playerActive = true;
  updateNavArrows();
  showState('player');
}

function closePlayer() {
  previewIframe.src = '';
  previewIframe.style.display = 'block';
  previewVideo.pause();
  previewVideoSrc.src = '';
  previewVideo.style.display = 'none';
  playerActive        = false;
  currentVideoId       = '';
  currentVideoUrl      = '';
  currentProjectVideos = null;
  updateNavArrows();
  showState('default');
}

// Arrow Navigation Handlers
if (previewNavPrev) {
  previewNavPrev.addEventListener('click', e => {
    e.stopPropagation();
    loadVideoFromProject(currentVideoIndex - 1);
  });
}
if (previewNavNext) {
  previewNavNext.addEventListener('click', e => {
    e.stopPropagation();
    loadVideoFromProject(currentVideoIndex + 1);
  });
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
  const videoUrl = item.getAttribute('data-videourl') || '';
  const isMulti  = item.getAttribute('data-multi') === 'true';
  const videosAttr = item.getAttribute('data-videos');
  let videosArray = null;
  if (videosAttr) {
    try { videosArray = JSON.parse(videosAttr); } catch (e) {}
  }
  const header   = item.querySelector('.proj-header');

  // Hover: show thumbnail
  header.addEventListener('mouseenter', () => showThumb(thumb, fallback, videoId, isMulti, videoUrl, videosArray));
  header.addEventListener('mouseleave', () => {
    if (!item.classList.contains('open') && !playerActive) hideThumb();
  });

  // Click header: toggle description
  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    projectItems.forEach(other => { if (other !== item) other.classList.remove('open'); });
    item.classList.toggle('open', !isOpen);
    if (!isOpen && (videoId || videoUrl || videosArray)) {
      showThumb(thumb, fallback, videoId, isMulti, videoUrl, videosArray);
    }
    if (isOpen) hideThumb();
  });
});

// Start with first career project thumbnail as default
const _firstItem = document.querySelector('#list-career .project-item');
if (_firstItem) {
  let _videosArray = null;
  const _vAttr = _firstItem.getAttribute('data-videos');
  if (_vAttr) { try { _videosArray = JSON.parse(_vAttr); } catch (e) {} }
  showThumb(
    _firstItem.getAttribute('data-thumb'),
    _firstItem.getAttribute('data-fallback') || _firstItem.getAttribute('data-thumb'),
    _firstItem.getAttribute('data-videoid'),
    _firstItem.getAttribute('data-multi') === 'true',
    _firstItem.getAttribute('data-videourl') || '',
    _videosArray
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



