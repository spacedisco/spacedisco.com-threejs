<p align="center">
  <img src="docs/assets/space-disco-logo.png" width="260" alt="Space Disco logo">
</p>

<h1 align="center">spacedisco.com-threejs</h1>

<p align="center"><strong>spacedisco.com: the scrolling Three.js mirror-ball landing page for the Orbital Lounge and House Music Club.</strong></p>

<p align="center"><em>"We are going to space and we are bringing a disco."</em> 🚀🪩</p>

> **Status:** Live at [spacedisco.com](https://spacedisco.com) since 2026-11-19. · **Language:** JavaScript

## 🪩 What this is

The landing page for Space Disco, Steven's house music party brand: the mission, how boarding works (text-in invitations, QR boarding passes, crew ranks, secret doors), a flight log from 2019 to now, resident DJ ZYLER, and a boarding pass request form. The backdrop is footage from the 2020 dome night, with a Three.js star field and mirror ball.

The 2022 Fireship-style page is kept in `legacy/2022/` for history; it is not built or deployed.

## 🎛️ Stack

- Vite 6, plain JavaScript, Three.js (lazy-loaded)
- One Vercel function, `api/board.js`, which stores boarding requests in the shared Supabase (`public.spacedisco_boarding_requests`, service role only)
- Fonts: Unbounded and Space Grotesk (Google Fonts)

## 🚀 Launch sequence (local setup)

```bash
npm ci
npm test
npm run dev     # the form needs the API; on Vercel it is /api/board
npm run build   # outputs dist/
```

## 🛸 Deploy

Vercel project `spacedisco.com` (team stevenzeiler), domains spacedisco.com and www.spacedisco.com. Env vars `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set there. Deploy with `vercel build --prod && vercel deploy --prebuilt --prod`.

## 🧪 Tests & CI

`npm test` (node:test): request validation, pass numbers, the API handler with a fake database, page content, a no-phone-numbers check on published files, media size. CI runs tests, build, gitleaks on new commits and a PR title check.

## 🌌 How it connects

Brand source of truth for Space Disco copy and tone.

## 🙏 Credits

Based on the Fireship [scrollable Three.js animation](https://fireship.io/snippets/threejs-scrollbar-animation) demo by Jeff Delaney.

---

<p align="center"><sub>Space Disco · Orbital Lounge and House Music Club · Deep, Minimal, Tech House &amp; Soulful, Groovy, Funky, Disco House.<br>Documentation refreshed November 2026 from a read of the code and history.</sub></p>
