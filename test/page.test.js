import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('the page tells the story and offers a pass', () => {
  for (const needle of ['We are going to space', 'id="mission"', 'id="boarding"', 'id="log"', 'id="zyler"', 'id="pass-form"']) {
    assert.ok(html.includes(needle), `missing ${needle}`);
  }
});

test('the page has social and mobile basics', () => {
  assert.match(html, /name="viewport"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /<html lang="en">/);
});

// Guests' phone numbers live in old repos; none may ever reach the site.
test('no phone numbers or emails in the published files', () => {
  const phone = /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b|\+\d{10,}/;
  const email = /[\w.+-]+@[\w-]+\.[\w.]+/;
  const files = ['index.html', ...['src', 'api', 'public'].flatMap(function walk(d) {
    return readdirSync(d).flatMap((f) => {
      const p = join(d, f);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
  })].filter((f) => /\.(html|js|css|svg|json)$/.test(f));
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    assert.doesNotMatch(text, phone, `${f} looks like it has a phone number`);
    assert.doesNotMatch(text, email, `${f} looks like it has an email address`);
  }
});

test('media stays small enough for phones', () => {
  for (const f of readdirSync('public/media')) {
    const size = statSync(join('public/media', f)).size;
    assert.ok(size < 4_000_000, `${f} is ${size} bytes`);
  }
});
