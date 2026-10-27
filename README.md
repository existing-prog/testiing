# Orbital

A responsive, space-themed portfolio for an aerospace engineering graduate specializing in astrodynamics. Includes an overview and printable CV, a research journal, and an interactive elliptical-orbit simulation.

## Develop

Requires Node.js 22 or later. No package installation, API keys, database, or build step is required.

```sh
npm run dev
```

The HTTP server listens on port 3000 (override with `PORT`). Routes: `/`, `/journal`, `/simulations`. Stop with Ctrl+C.

```sh
npm test
```

Tests exercise the HTTP routes, assets, and missing-file behavior. To check the UI, visit all three pages, open a research entry, use the simulation sliders and pause button, and use Print / save CV. Reduced-motion preferences start the simulation paused.

## Personalize

Page content and sample journal entries live in `src/app.js`; the visual design lives in `src/style.css`. Replace bracketed personal information, sample skills, and placeholder journal entries before publishing. The CV button uses the browser print dialog; no CV download is supplied. The simulation is an illustrative normalized two-body model.

Google Fonts are optional; system sans-serif and serif fallbacks work without external access. Deployment requires a Node process running `npm start`, or a static host configured to serve `src/index.html` for all three page routes and the other `src` files at the root.
