const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('open',open)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation')}));
const date=document.querySelector('input[type=date]');if(date){const d=new Date();date.min=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
document.querySelector('#visit-form')?.addEventListener('submit',e=>{e.preventDefault();const status=document.querySelector('#form-status');status.textContent='Your visit request is ready for this preview. No details have been sent and no appointment has been booked.';status.hidden=false});
document.querySelectorAll('#year').forEach(e=>e.textContent=new Date().getFullYear());

// Keep the welcome moment brief, even if external fonts are slow to load.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = document.querySelector('#welcome-loader');
if (loader) {
  document.documentElement.classList.add('is-welcoming');
  const dismissWelcome = () => {
    loader.classList.add('is-finished');
    document.documentElement.classList.remove('is-welcoming');
    document.documentElement.classList.add('site-ready');
    setTimeout(() => loader.remove(), reducedMotion ? 0 : 550);
  };
  setTimeout(dismissWelcome, reducedMotion ? 100 : 1450);
  window.addEventListener('pageshow', event => {
    if (event.persisted) dismissWelcome();
  });
} else {
  document.documentElement.classList.add('site-ready');
}

// Values remain readable without JavaScript; animate only on their first reveal.
const countElements = document.querySelectorAll('[data-count]');
function animateCount(element) {
  const target = Number(element.dataset.count);
  const start = performance.now();
  const duration = 1350;
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.floor(target * eased));
    if (progress < 1) requestAnimationFrame(frame);
  }
  element.setAttribute('aria-label', String(target));
  requestAnimationFrame(frame);
}
if (!reducedMotion && 'IntersectionObserver' in window) {
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    });
  }, {threshold: 0.6});
  countElements.forEach(element => countObserver.observe(element));
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, {threshold: 0.1});
  document.querySelectorAll('.service-card, .about-art, .stats-intro, .section-top, .team-note, .guide-heading, .guide-grid article, .booking-copy, #visit-form, .location-copy, .clinic-map').forEach((element, index) => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', `${(index % 4) * 65}ms`);
    revealObserver.observe(element);
  });
}

// Scroll feedback uses one queued frame, rather than work on every scroll event.
const progressTrack = document.createElement('div');
progressTrack.className = 'reading-progress';
progressTrack.setAttribute('aria-hidden', 'true');
const progressFill = document.createElement('span');
progressTrack.append(progressFill);
document.body.append(progressTrack);
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top';
backToTop.type = 'button';
backToTop.setAttribute('aria-label', 'Back to top');
backToTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg>';
backToTop.hidden = true;
document.body.append(backToTop);
backToTop.addEventListener('click', () => {
  window.scrollTo({top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  const homeLink = document.querySelector('header .brand');
  homeLink?.focus({preventScroll: true});
});
let scrollFramePending = false;
function updateScrollFeedback() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progressFill.style.transform = `scaleX(${distance > 0 ? Math.min(window.scrollY / distance, 1) : 0})`;
  backToTop.hidden = window.scrollY < 550;
  document.querySelector('header')?.classList.toggle('has-scrolled', window.scrollY > 20);
  scrollFramePending = false;
}
function queueScrollFeedback() {
  if (scrollFramePending) return;
  scrollFramePending = true;
  requestAnimationFrame(updateScrollFeedback);
}
window.addEventListener('scroll', queueScrollFeedback, {passive: true});
window.addEventListener('resize', queueScrollFeedback);
updateScrollFeedback();

// A single brief ripple follows the click, without covering the button label.
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    button.querySelector('.button-ripple')?.remove();
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'button-ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.style.left = `${event.detail ? event.clientX - rect.left : rect.width / 2}px`;
    ripple.style.top = `${event.detail ? event.clientY - rect.top : rect.height / 2}px`;
    button.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), {once: true});
  });
});

// Pause the ambient scene when hidden or off screen; keep the user's choice.
const ambientHero = document.querySelector('.ambient-hero');
if (ambientHero) {
  const ambientToggle = ambientHero.querySelector('.ambient-toggle');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let heroOnScreen = true;
  function updateAmbientPlayback() {
    ambientHero.classList.toggle('scene-active', heroOnScreen && !document.hidden && !motionPreference.matches);
  }
  ambientToggle?.addEventListener('click', () => {
    const paused = ambientHero.dataset.paused !== 'true';
    ambientHero.dataset.paused = String(paused);
    ambientToggle.setAttribute('aria-pressed', String(paused));
    ambientToggle.querySelector('.ambient-toggle-label').textContent = paused ? 'Resume background' : 'Pause background';
    ambientToggle.querySelector('.ambient-toggle-icon').textContent = paused ? '\u25b6' : '\u275a\u275a';
  });
  if ('IntersectionObserver' in window) {
    const ambientObserver = new IntersectionObserver(entries => {
      heroOnScreen = entries[0].isIntersecting;
      updateAmbientPlayback();
    });
    ambientObserver.observe(ambientHero);
  }
  document.addEventListener('visibilitychange', updateAmbientPlayback);
  motionPreference.addEventListener('change', updateAmbientPlayback);
  updateAmbientPlayback();
}

// Decorative SVG strokes keep text semantic and remain visible without motion.
const svgNamespace = 'http://www.w3.org/2000/svg';
document.querySelectorAll('.section-top h2>span, .booking-copy h2>span').forEach(text => {
  text.classList.add('heading-line');
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.setAttribute('viewBox', '0 0 240 10');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(svgNamespace, 'path');
  path.setAttribute('d', 'M3 7Q100 0 237 5');
  path.setAttribute('pathLength', '1');
  svg.append(path);
  text.append(svg);
});
document.querySelectorAll('.service-card').forEach(card => {
  const svg = document.createElementNS(svgNamespace, 'svg');
  svg.classList.add('traced-border');
  svg.setAttribute('viewBox', '0 0 300 360');
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('aria-hidden', 'true');
  const border = document.createElementNS(svgNamespace, 'rect');
  for (const [attribute, value] of Object.entries({x: '1', y: '1', width: '298', height: '358', rx: '15', pathLength: '1'})) {
    border.setAttribute(attribute, value);
  }
  svg.append(border);
  card.append(svg);
});
document.querySelectorAll('.guide-icon svg path').forEach(path => path.setAttribute('pathLength', '1'));
if (!reducedMotion && 'IntersectionObserver' in window) {
  const lineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('lines-visible');
      lineObserver.unobserve(entry.target);
    });
  }, {threshold: 0.25});
  document.querySelectorAll('.section-top, .first-visit-guide, .booking-copy').forEach(section => {
    section.classList.add('line-watched');
    lineObserver.observe(section);
  });
}
