const header = document.querySelector('.site-header');
const progress = document.querySelector('.progress');
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
  header.classList.toggle('scrolled', scrollY > 30);
}
addEventListener('scroll', updateScroll, { passive: true });
addEventListener('resize', updateScroll);
updateScroll();
document.querySelectorAll('.year').forEach(el => { el.textContent = new Date().getFullYear(); });

const menu = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open menu'); mobileNav.hidden = true; }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.hidden = !open;
});
mobileNav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menu.focus(); } });
matchMedia('(min-width: 801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const motionButton = document.querySelector('.motion-control');
motionButton.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.setAttribute('aria-label', paused ? 'Resume visual animation' : 'Pause visual animation');
  motionButton.querySelector('span').textContent = paused ? '▷' : 'Ⅱ';
});
if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('motion-paused');
  motionButton.hidden = true;
}

const slider = document.querySelector('#comparison-slider');
slider.addEventListener('input', () => slider.closest('.comparison').style.setProperty('--split', `${slider.value}%`));
const compareButton = document.querySelector('.compare-button');
compareButton.addEventListener('click', () => {
  const open = compareButton.getAttribute('aria-expanded') !== 'true';
  compareButton.setAttribute('aria-expanded', String(open));
  document.querySelector('#full-comparison').hidden = !open;
  compareButton.querySelector('span').textContent = open ? '−' : '+';
});

const contactDialog = document.querySelector('#contact-dialog');
const exampleDialog = document.querySelector('#example-dialog');
const form = document.querySelector('#enquiry-form');
let lastDialogTrigger;
function openContact(trigger, returnFocus = trigger) {
  lastDialogTrigger = returnFocus;
  if (exampleDialog.open) exampleDialog.close();
  closeMenu();
  form.elements.package.value = trigger?.dataset.plan || 'Help me choose';
  contactDialog.showModal();
  document.body.style.overflow = 'hidden';
}
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => openContact(button)));
for (const dialog of [contactDialog, exampleDialog]) {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!contactDialog.open && !exampleDialog.open) {
      document.body.style.overflow = '';
      lastDialogTrigger?.focus();
    }
  });
}
function enquiryText() {
  const data = new FormData(form);
  return `Hello Amanat, I would like to discuss your international marketing service.\n\nName: ${String(data.get('name')).trim()}\nEmail: ${String(data.get('email')).trim()}\nBusiness: ${String(data.get('business')).trim()}\nMarket: ${data.get('region')}\nPackage: ${data.get('package')}\n\n${String(data.get('message')).trim()}`;
}
function validateEnquiry() {
  for (const field of [form.elements.name, form.elements.business]) {
    field.setCustomValidity(field.value.trim() ? '' : 'Please complete this field.');
  }
  return form.reportValidity();
}
form.addEventListener('input', event => event.target.setCustomValidity?.(''));
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!validateEnquiry()) return;
  const subject = `Amanat marketing enquiry — ${form.elements.package.value}`;
  location.href = `mailto:propertiesamanat@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiryText())}`;
  document.querySelector('.form-help').textContent = 'Your email app was requested. Review and send the draft there, or choose WhatsApp.';
});
document.querySelector('.whatsapp-button').addEventListener('click', () => {
  if (!validateEnquiry()) return;
  location.href = `https://wa.me/93791606227?text=${encodeURIComponent(enquiryText())}`;
});

const examples = {
  listing: { title: 'The property spotlight.', description: 'A short property film that makes the viewing feel intentional, from the opening hook to the invitation to enquire.', steps: [ ['Open with the feeling', 'Start with the strongest view or the property’s defining feature.'], ['Show what matters', 'Move through the key spaces, with clear captions and verified facts.'], ['Invite the next step', 'Give viewers a simple route to ask for details or arrange a viewing.'] ] },
  education: { title: 'The local expert.', description: 'Useful, agent-led content that makes your experience easy to understand and gives your audience a reason to return.', steps: [ ['Choose one real question', 'For example: what should a buyer check before booking a viewing?'], ['Make the answer clear', 'A focused script, simple shot plan and readable on-screen points.'], ['Keep the brand consistent', 'Repeatable covers and a recognisable format across your series.'] ] },
  neighbourhood: { title: 'The neighbourhood story.', description: 'Place the property in context, with everyday details that help people imagine the area.', steps: [ ['Find the local angle', 'Choose a relevant route, amenity or everyday moment around the property.'], ['Capture the context', 'Film a small set of purposeful location shots using our guide.'], ['Connect it to the property', 'Explain why the area matters, using accurate, approved descriptions.'] ] }
};
document.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
  const example = examples[button.dataset.example];
  lastDialogTrigger = button;
  document.querySelector('#example-title').textContent = example.title;
  document.querySelector('#example-description').textContent = example.description;
  const steps = document.querySelector('#example-steps');
  steps.replaceChildren();
  example.steps.forEach(([title, text], index) => {
    const row = document.createElement('div');
    const number = document.createElement('span'); number.textContent = `0${index + 1}`;
    const content = document.createElement('div');
    const heading = document.createElement('h3'); heading.textContent = title;
    const paragraph = document.createElement('p'); paragraph.textContent = text;
    content.append(heading, paragraph); row.append(number, content); steps.append(row);
  });
  exampleDialog.showModal(); document.body.style.overflow = 'hidden';
}));
document.querySelector('#example-contact').addEventListener('click', () => openContact(null, lastDialogTrigger));
