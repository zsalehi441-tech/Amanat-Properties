const languageButton = document.querySelector('.language');
let language = 'en';
try { language = localStorage.getItem('amanat-group-language') === 'fa' ? 'fa' : 'en'; } catch {}
const translatedElements = [...document.querySelectorAll('[data-fa]')];
for (const el of translatedElements) el.dataset.en = el.innerHTML;
function setLanguage(next) {
  language = next;
  document.documentElement.lang = next;
  document.documentElement.dir = next === 'fa' ? 'rtl' : 'ltr';
  for (const el of translatedElements) {
    if (next === 'fa') el.textContent = el.dataset.fa;
    else el.innerHTML = el.dataset.en;
  }
  languageButton.textContent = next === 'fa' ? 'EN' : 'دری';
  languageButton.setAttribute('aria-label', next === 'fa' ? 'Switch to English' : 'تغییر زبان به دری');
  document.title = next === 'fa' ? (document.querySelector('#partner-form') ? 'امانت گروپ — همکاری با امانت' : 'دسترسی همکاران — امانت گروپ') : (document.querySelector('#partner-form') ? 'Amanat Group — Grow with Amanat' : 'Partner Access — Amanat Group');
  try { localStorage.setItem('amanat-group-language', next); } catch {}
}
languageButton.addEventListener('click', () => setLanguage(language === 'en' ? 'fa' : 'en'));
setLanguage(language);
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() { nav?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); }
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
});
nav?.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
document.querySelectorAll('.year').forEach(el => { el.textContent = new Date().getFullYear(); });
document.querySelector('#partner-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  for (const field of form.querySelectorAll('input, textarea')) {
    field.setCustomValidity(field.value.trim() ? '' : (language === 'fa' ? 'لطفاً این بخش را تکمیل کنید.' : 'Please complete this field.'));
  }
  if (!form.reportValidity()) return;
  const labels = language === 'fa' ? ['سلام، دربارهٔ همکاری با امانت تماس می‌گیرم.', 'نام', 'دفتر', 'شهر', 'تماس', 'پیام'] : ['Salam, I would like to discuss partnering with Amanat.', 'Name', 'Office', 'City', 'Phone', 'Message'];
  const message = labels[0] + '\n\n' + ['name','office','city','phone','message'].map((key,i) => `${labels[i+1]}: ${String(data.get(key)).trim()}`).join('\n');
  window.location.assign(`https://wa.me/93791606227?text=${encodeURIComponent(message)}`);
});
document.querySelector('#partner-form')?.addEventListener('input', (event) => { event.target.setCustomValidity?.(''); });

// Progressive enhancement: the content and contact form work without animation.
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let manualMotion = null;
try { const saved = localStorage.getItem('amanat-group-motion'); if (saved) manualMotion = saved === 'reduce'; } catch {}
const motionButton = document.querySelector('.motion-toggle');
function applyMotion() {
  const reduce = manualMotion ?? motionPreference.matches;
  document.documentElement.classList.toggle('reduce-motion', reduce);
  motionButton?.setAttribute('aria-pressed', String(reduce));
  document.dispatchEvent(new Event('amanat-motion-change'));
}
motionButton?.addEventListener('click', () => {
  manualMotion = !document.documentElement.classList.contains('reduce-motion');
  try { localStorage.setItem('amanat-group-motion', manualMotion ? 'reduce' : 'full'); } catch {}
  applyMotion();
});
motionPreference.addEventListener('change', applyMotion); applyMotion();

const tabs = [...document.querySelectorAll('[data-panel]')];
function selectPanel(tab, focus = false) {
  tabs.forEach(button => {
    const active = button === tab;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    document.querySelector(`#panel-${button.dataset.panel}`).hidden = !active;
  });
  if (focus) tab.focus();
}
tabs.forEach(tab => {
  tab.addEventListener('click', () => selectPanel(tab));
  tab.addEventListener('keydown', event => {
    let index = tabs.indexOf(tab);
    if (event.key === 'ArrowRight') index += document.documentElement.dir === 'rtl' ? -1 : 1;
    else if (event.key === 'ArrowLeft') index += document.documentElement.dir === 'rtl' ? 1 : -1;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = tabs.length - 1;
    else return;
    event.preventDefault(); selectPanel(tabs[(index + tabs.length) % tabs.length], true);
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
  document.querySelectorAll('.section-heading, .about>div, .service-card, .workspace-showcase, .partner-aside, .partner-benefits article, .steps li, .contact>div, .contact form, .system-banner, .faq details').forEach((element) => {
    element.classList.add('reveal'); revealObserver.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) document.querySelectorAll('#navigation a').forEach(link => link.classList.toggle('current', link.hash === '#' + entry.target.id)); });
  }, { rootMargin: '-15% 0px -60% 0px' });
  document.querySelectorAll('section[id]').forEach(section => navObserver.observe(section));
}
let scrollFrame = false;
function reflectScroll() {
  scrollFrame = false;
  const range = document.documentElement.scrollHeight - innerHeight;
  const progress = document.querySelector('.reading-progress');
  if (progress) progress.style.transform = `scaleX(${range > 0 ? Math.min(scrollY / range, 1) : 0})`;
  document.querySelector('.header')?.classList.toggle('compact', scrollY > 50);
}
addEventListener('scroll', () => { if (!scrollFrame) { scrollFrame = true; requestAnimationFrame(reflectScroll); } }, { passive: true });
addEventListener('resize', reflectScroll);reflectScroll();
