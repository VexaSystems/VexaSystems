const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileLinks = mobileNav.querySelectorAll('a');
const headerBrand = document.querySelector('.site-header .brand');

const setMenuState = (open) => {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
};

menuToggle.addEventListener('click', () => {
  setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true');
});

mobileLinks.forEach((link) => link.addEventListener('click', () => setMenuState(false)));

headerBrand.addEventListener('click', (event) => {
  event.preventDefault();
  setMenuState(false);
  window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -42px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const observedSections = [...document.querySelectorAll('main section[id]')];
const desktopLinks = [...document.querySelectorAll('.desktop-nav a')];

if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      desktopLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });
  observedSections.forEach((section) => navObserver.observe(section));
}

const form = document.querySelector('#contact-form');
const formStatus = form.querySelector('.form-status');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.textContent = '';

  if (!form.checkValidity()) {
    form.classList.add('show-errors');
    form.reportValidity();
    formStatus.textContent = 'Revisa los campos obligatorios antes de continuar.';
    return;
  }

  const data = new FormData(form);
  const subject = `Consulta de automatización — ${data.get('empresa')}`;
  const body = [
    `Nombre: ${data.get('nombre')}`,
    `Empresa: ${data.get('empresa')}`,
    `Email: ${data.get('email')}`,
    `Teléfono: ${data.get('telefono') || 'No indicado'}`,
    '',
    'Proceso a automatizar:',
    data.get('mensaje')
  ].join('\n');

  formStatus.textContent = 'Solicitud preparada. Se abrirá tu aplicación de correo.';
  window.location.href = `mailto:vexa.systems2026@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

document.querySelectorAll('[data-placeholder-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const current = link.textContent;
    link.textContent = 'Disponible próximamente';
    window.setTimeout(() => { link.textContent = current; }, 1800);
  });
});
