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
