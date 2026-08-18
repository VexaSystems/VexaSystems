const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setMenuState = (open) => {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileNav.setAttribute('aria-hidden', String(!open));
  document.body.classList.toggle('menu-open', open);
};

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    setMenuState(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuState(false);
});

const updateHeader = () => {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.11, rootMargin: '0px 0px -36px' });

  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const form = document.querySelector('#contact-form');

if (form) {
  const formStatus = form.querySelector('.form-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (formStatus) formStatus.textContent = '';

    if (!form.checkValidity()) {
      form.classList.add('show-errors');
      form.reportValidity();
      if (formStatus) formStatus.textContent = 'Revisa los campos obligatorios antes de continuar.';
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

    if (formStatus) formStatus.textContent = 'Solicitud preparada. Se abrirá tu aplicación de correo.';
    window.location.href = `mailto:vexa.systems2026@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.querySelectorAll('[data-placeholder-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const current = link.textContent;
    link.textContent = 'Disponible próximamente';
    window.setTimeout(() => { link.textContent = current; }, 1800);
  });
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});
