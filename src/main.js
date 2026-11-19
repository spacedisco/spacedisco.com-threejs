import './style.css';
import { validateBoarding } from './boarding.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal sections as they scroll into view.
const revealables = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  revealables.forEach((el) => io.observe(el));
} else {
  revealables.forEach((el) => el.classList.add('in'));
}

// The sky: stars, drifting light flecks and a slowly turning mirror ball. Loaded after first paint.
const canvas = document.getElementById('sky');
if (canvas) {
  const start = () => import('./sky.js').then((m) => m.startSky(canvas, { reducedMotion })).catch(() => {});
  if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 });
  else setTimeout(start, 300);
}

// Boarding pass requests.
const form = document.getElementById('pass-form');
const ticket = document.getElementById('ticket');
const status = form?.querySelector('.form-status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const check = validateBoarding(data);
  status.classList.remove('error');
  if (!check.ok) {
    status.textContent = check.error;
    status.classList.add('error');
    return;
  }
  const button = form.querySelector('button');
  button.disabled = true;
  status.textContent = 'Transmitting…';
  try {
    const res = await fetch('/api/board', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(check.value),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || 'Ground control did not answer. Try again in a minute.');
    ticket.querySelector('[data-t="name"]').textContent = check.value.name;
    ticket.querySelector('[data-t="pass"]').textContent = body.pass;
    ticket.querySelector('[data-t="rank"]').textContent = body.rank || 'Cadet';
    form.hidden = true;
    ticket.hidden = false;
    ticket.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  } catch (err) {
    status.textContent = err.message;
    status.classList.add('error');
    button.disabled = false;
  }
});
