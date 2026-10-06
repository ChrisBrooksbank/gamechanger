# CLAUDE.md

## Project Overview

GameChanger Wheel — a vanilla JS single-page app for spinning a wheel to pick a random online game for game night. Canvas rendering, audio feedback, confetti, and customizable game list.

**Live:** https://gamechanger-wheel.netlify.app

## Tech Stack

- Vanilla JavaScript (no framework)
- HTML Canvas (wheel rendering)
- Web Audio API (tick sounds)
- Service Worker (`sw.js`) for PWA offline support
- Deployed on Netlify

## File Structure

```
index.html      — Main page
spin.js         — Pure wheel-angle maths (rendering lives in index.html)
select.js       — Cryptographically random winner selection
util.js         — HTML escaping, URL sanitising, CSV parse/serialise
sw.js           — Service worker (PWA caching)
manifest.json   — PWA manifest
```

## Development

No build step. Edit JS/HTML directly. Test by opening `index.html` in a browser or serving with a local static server.

## Testing

```bash
npm test    # Runs unit tests (spin.test.js, select.test.js, util.test.js)
```

## Deployment

Deployed on Netlify as a static site. No build command needed. Bump `CACHE` in `sw.js` when shipping changes, and add any new ES module to its `PRECACHE` list.
