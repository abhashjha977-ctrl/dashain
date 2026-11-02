const body = document.body;
const cursor = document.querySelector('.cursor-dot');
const motionToggle = document.querySelector('.motion-toggle');
const progressFill = document.querySelector('.progress-fill');
const progressIndex = document.querySelector('.progress-index');

const ritualData = [
  { kicker: '01 / planting', name: 'Jamara', description: 'Life begins in a dark room, then reaches for the light.', accessibility: 'Close-up of golden jamara grass and vermilion tika powder arranged on a brass thali.', image: '/manus-storage/async-images/w3IpARSIUsgYJDt0T8xqPx/image-2.webp' },
  { kicker: '02 / blessing', name: 'Tika', description: 'Red, rice, yoghurt — a small mark carrying a whole family’s good wishes.', accessibility: 'A family gathered in warm light as an elder prepares a Dashain tika blessing.', image: '/manus-storage/async-images/w3IpARSIUsgYJDt0T8xqPx/image-2.webp' },
  { kicker: '03 / arrival', name: 'Phulpati', description: 'The sacred arrives from the hills in a procession of flowers, leaves and memory.', accessibility: 'Temple silhouettes and a Dashain family scene beneath Himalayan dusk and drifting kites.', image: '/manus-storage/async-images/w3IpARSIUsgYJDt0T8xqPx/image-1.webp' },
  { kicker: '04 / skyward', name: 'Ping', description: 'A bamboo swing turns the season into a dare: higher, lighter, again.', accessibility: 'A traditional bamboo swing silhouetted against misty Himalayan foothills.', image: '/manus-storage/async-images/w3IpARSIUsgYJDt0T8xqPx/image-3.webp' },
  { kicker: '05 / gathering', name: 'Feast', description: 'Plates pass. Stories stretch. Nobody leaves the table unchanged.', accessibility: 'A festive Dashain gathering with warm food, jamara and family seated together.', image: '/manus-storage/async-images/w3IpARSIUsgYJDt0T8xqPx/image-3.webp' }
];
const dayData = [
  ['Day 01 / Ghatasthapana', 'A pot of earth is seeded with barley. In the dark, something tender begins.'],
  ['Day 07 / Phulpati', 'The royal flowers arrive; a procession makes the invisible feel near.'],
  ['Day 08 / Maha Ashtami', 'Offerings are made to Durga, the fierce mother who clears the path.'],
  ['Day 09 / Maha Navami', 'The pause before the blessing. Homes glow at the edge of a new day.'],
  ['Day 10 / Vijaya Dashami', 'Elders place tika and jamara. Victory becomes something you carry home.']
];

const setMotion = (off) => {
  body.classList.toggle('motion-off', off);
  document.documentElement.classList.toggle('motion-off', off);
  motionToggle.setAttribute('aria-pressed', String(off));
  motionToggle.setAttribute('aria-label', off ? 'Play animation' : 'Pause animation');
  motionToggle.querySelector('.motion-label').textContent = off ? 'Motion off' : 'Motion on';
  localStorage.setItem('dashain-motion-off', String(off));
};
setMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches || localStorage.getItem('dashain-motion-off') === 'true');
motionToggle.addEventListener('click', () => setMotion(!body.classList.contains('motion-off')));

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  }, { passive: true });
  document.querySelectorAll('a, button').forEach((element) => {
    element.addEventListener('mouseenter', () => { cursor.style.width = '18px'; cursor.style.height = '18px'; });
    element.addEventListener('mouseleave', () => { cursor.style.width = '10px'; cursor.style.height = '10px'; });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
}, { threshold: .16 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const sections = [...document.querySelectorAll('.section-anchor')];
const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  progressFill.style.height = `${amount * 100}%`;
  const index = Math.min(5, Math.max(1, Math.ceil(amount * 5)));
  progressIndex.textContent = String(index).padStart(2, '0');
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const ritualVisual = document.querySelector('.ritual-visual-image');
const ritualKicker = document.querySelector('[data-ritual-kicker]');
const ritualName = document.querySelector('[data-ritual-name]');
const ritualDescription = document.querySelector('[data-ritual-description]');
const ritualTabs = [...document.querySelectorAll('.ritual-tab')];
const updateRitual = (index) => {
  const data = ritualData[index];
  ritualTabs.forEach((tab, tabIndex) => { tab.classList.toggle('is-active', tabIndex === index); tab.setAttribute('aria-selected', String(tabIndex === index)); tab.tabIndex = tabIndex === index ? 0 : -1; });
  ritualVisual.style.backgroundImage = `linear-gradient(0deg, rgba(14,24,41,.86), rgba(14,24,41,.06)), url("${data.image}")`;
  ritualVisual.setAttribute('aria-label', data.accessibility);
  ritualKicker.textContent = data.kicker;
  ritualName.textContent = data.name;
  ritualDescription.textContent = data.description;
};
ritualTabs.forEach((tab, index) => tab.addEventListener('click', () => updateRitual(index)));
ritualTabs.forEach((tab, index) => tab.addEventListener('keydown', (event) => {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? ritualTabs.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + ritualTabs.length) % ritualTabs.length;
  ritualTabs[next].focus(); updateRitual(next);
}));

const dayTabs = [...document.querySelectorAll('.day-tab')];
const dayLabel = document.querySelector('[data-day-label]');
const dayCopy = document.querySelector('[data-day-copy]');
const updateDay = (index) => {
  dayTabs.forEach((tab, tabIndex) => { tab.classList.toggle('is-active', tabIndex === index); tab.setAttribute('aria-selected', String(tabIndex === index)); tab.tabIndex = tabIndex === index ? 0 : -1; });
  dayLabel.textContent = dayData[index][0]; dayCopy.textContent = dayData[index][1];
};
dayTabs.forEach((tab, index) => tab.addEventListener('click', () => updateDay(index)));
dayTabs.forEach((tab, index) => tab.addEventListener('keydown', (event) => {
  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? dayTabs.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + dayTabs.length) % dayTabs.length;
  dayTabs[next].focus(); updateDay(next);
}));

const heroBg = document.querySelector('.hero-bg');
const meaningOrbit = document.querySelector('.meaning-orbit');
let ticking = false;
const parallax = () => {
  if (body.classList.contains('motion-off')) { ticking = false; return; }
  const y = window.scrollY;
  if (heroBg && y < window.innerHeight) heroBg.style.transform = `scale(1.05) translate3d(0, ${y * .055}px, 0)`;
  if (meaningOrbit) meaningOrbit.style.transform = `translate3d(0, ${Math.max(-80, y * -.035)}px, 0) rotate(${y * .08}deg)`;
  ticking = false;
};
window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(parallax); ticking = true; } }, { passive: true });

const anchors = [...document.querySelectorAll('.main-nav a, .mobile-nav a')];
const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) anchors.forEach((anchor) => anchor.style.opacity = anchor.getAttribute('href') === `#${entry.target.id}` ? '1' : '');
  });
}, { rootMargin: '-36% 0px -55% 0px' });
sections.forEach((section) => activeObserver.observe(section));
