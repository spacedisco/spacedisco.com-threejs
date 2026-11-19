// POST /api/board: request a boarding pass for the next Space Disco flight.
// Stores the request in the shared Supabase (table public.spacedisco_boarding_requests, service role only)
// and returns a pass number. Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
import { validateBoarding, passNumber } from '../src/boarding.js';

const TABLE = 'spacedisco_boarding_requests';

export async function board(input, { url, key, fetchImpl = fetch }) {
  const check = validateBoarding(input);
  if (!check.ok) {
    // Bots get a fake success so they do not learn the trap.
    if (check.bot) return { status: 200, body: { pass: 'SD-0000-00', rank: 'Cadet' } };
    return { status: 400, body: { error: check.error } };
  }
  if (!url || !key) return { status: 503, body: { error: 'Boarding is not open yet. Try again soon.' } };

  const headers = { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'application/json' };
  const insert = await fetchImpl(`${url}/rest/v1/${TABLE}?on_conflict=email`, {
    method: 'POST',
    headers: { ...headers, prefer: 'resolution=ignore-duplicates,return=representation' },
    body: JSON.stringify({ ...check.value, source: 'spacedisco.com' }),
  });
  if (!insert.ok) return { status: 502, body: { error: 'Ground control did not answer. Try again in a minute.' } };
  let rows = await insert.json();
  if (!rows.length) {
    // Already on the manifest: hand back the same pass.
    const found = await fetchImpl(
      `${url}/rest/v1/${TABLE}?select=id,rank&email=eq.${encodeURIComponent(check.value.email)}`,
      { headers },
    );
    rows = found.ok ? await found.json() : [];
    if (!rows.length) return { status: 502, body: { error: 'Ground control did not answer. Try again in a minute.' } };
  }
  const row = rows[0];
  const rank = row.rank ? row.rank[0].toUpperCase() + row.rank.slice(1) : 'Cadet';
  return { status: 200, body: { pass: passNumber(row.id), rank } };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ error: 'Use POST.' });
  }
  let input = req.body;
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input);
    } catch {
      input = {};
    }
  }
  const out = await board(input || {}, {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  res.setHeader('cache-control', 'no-store');
  return res.status(out.status).json(out.body);
}
