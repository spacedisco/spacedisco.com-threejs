import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBoarding, passNumber } from '../src/boarding.js';
import { board } from '../api/board.js';

test('accepts a good request and normalizes it', () => {
  const r = validateBoarding({ name: '  Luna  ', email: 'Luna@Example.COM ', city: 'Portsmouth', note: 'moves\n\nand a friend' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.value, { name: 'Luna', email: 'luna@example.com', city: 'Portsmouth', note: 'moves and a friend' });
});

test('rejects a missing name or a bad email', () => {
  assert.equal(validateBoarding({ email: 'a@b.co' }).ok, false);
  assert.equal(validateBoarding({ name: 'A', email: 'nope' }).ok, false);
});

test('caps long fields', () => {
  const r = validateBoarding({ name: 'x'.repeat(500), email: 'a@b.co', note: 'y'.repeat(900) });
  assert.equal(r.value.name.length, 80);
  assert.equal(r.value.note.length, 280);
});

test('flags the honeypot as a bot', () => {
  const r = validateBoarding({ name: 'A', email: 'a@b.co', website: 'http://spam' });
  assert.equal(r.ok, false);
  assert.equal(r.bot, true);
});

test('pass numbers are stable and well formed', () => {
  assert.match(passNumber(42), /^SD-0042-[2-9A-Z]{2}$/);
  assert.equal(passNumber(42), passNumber(42));
  assert.notEqual(passNumber(42), passNumber(43));
  assert.throws(() => passNumber(0));
});

const fakeFetch = (responses) => {
  const calls = [];
  const fn = async (url, init = {}) => {
    calls.push({ url, init });
    const next = responses.shift();
    return { ok: next.ok ?? true, json: async () => next.body };
  };
  fn.calls = calls;
  return fn;
};

test('board inserts and returns a pass', async () => {
  const f = fakeFetch([{ body: [{ id: 7, rank: 'cadet' }] }]);
  const out = await board({ name: 'Apollo', email: 'apollo@example.com' }, { url: 'https://db', key: 'k', fetchImpl: f });
  assert.equal(out.status, 200);
  assert.equal(out.body.pass, passNumber(7));
  assert.equal(out.body.rank, 'Cadet');
  assert.match(f.calls[0].url, /spacedisco_boarding_requests\?on_conflict=email$/);
  assert.equal(JSON.parse(f.calls[0].init.body).source, 'spacedisco.com');
});

test('board returns the existing pass for a repeat email', async () => {
  const f = fakeFetch([{ body: [] }, { body: [{ id: 3, rank: 'crew' }] }]);
  const out = await board({ name: 'Apollo', email: 'apollo@example.com' }, { url: 'https://db', key: 'k', fetchImpl: f });
  assert.equal(out.body.pass, passNumber(3));
  assert.equal(out.body.rank, 'Crew');
});

test('board rejects bad input and hides the honeypot', async () => {
  const f = fakeFetch([]);
  assert.equal((await board({ name: '', email: 'x' }, { url: 'u', key: 'k', fetchImpl: f })).status, 400);
  const bot = await board({ name: 'A', email: 'a@b.co', website: 'x' }, { url: 'u', key: 'k', fetchImpl: f });
  assert.equal(bot.status, 200);
  assert.equal(f.calls.length, 0);
});

test('board says closed when the database is not configured', async () => {
  const out = await board({ name: 'A', email: 'a@b.co' }, { url: '', key: '' });
  assert.equal(out.status, 503);
});

test('board reports a database failure', async () => {
  const f = fakeFetch([{ ok: false, body: {} }]);
  const out = await board({ name: 'A', email: 'a@b.co' }, { url: 'u', key: 'k', fetchImpl: f });
  assert.equal(out.status, 502);
});
