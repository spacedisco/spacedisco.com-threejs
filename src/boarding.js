// Shared by the page and the /api/board function, so both check a request the same way.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (v, max) =>
  String(v ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

/**
 * Validate and normalize a boarding pass request.
 * @returns {{ok: true, value: {name: string, email: string, city: string, note: string}} | {ok: false, error: string, bot?: boolean}}
 */
export function validateBoarding(input = {}) {
  if (clean(input.website, 200)) return { ok: false, error: 'Request not accepted.', bot: true };
  const name = clean(input.name, 80);
  const email = clean(input.email, 254).toLowerCase();
  const city = clean(input.city, 80);
  const note = clean(input.note, 280);
  if (!name) return { ok: false, error: 'Add your name so we know who is boarding.' };
  if (!EMAIL.test(email)) return { ok: false, error: 'That email does not look right.' };
  return { ok: true, value: { name, email, city, note } };
}

/** Pass numbers look like SD-0042-7Q: the row number plus a short check code. */
export function passNumber(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) throw new Error('bad id');
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let h = (n * 2654435761) >>> 0;
  const check = alphabet[h % 32] + alphabet[(h >>> 5) % 32];
  return `SD-${String(n).padStart(4, '0')}-${check}`;
}
