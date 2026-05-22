# Cubixso.ai — Under Construction

The temporary loading page for [cubixso.ai](https://cubixso.ai) while the main site is being rebuilt.

## Stack

- **Vite 8** + **React 19**
- **Three.js** for the dotted-surface live wallpaper
- **d3-geo** + **topojson-client** + **world-atlas** for the spinning Earth (real Natural Earth country outlines, orthographic projection)
- Vanilla CSS — no framework dependency

## Layout

Editorial 12-column grid, two-zone composition:

- **Left half** — 200×200 monochrome globe loader spinning at 16°/sec with a five-piece counter-rotating whirl ring
- **Right half** — editorial headline, sub-copy, live T-minus countdown, terminal-style email subscribe, contact line
- **Edges** — fixed telemetry runners (top + bottom) and four corner crosshairs
- **Backdrop** — three.js DottedSurface (40 × 60 wave grid) with live cursor parallax

Light + dark themes (toggled top-right, persisted in `localStorage`).
Fully responsive down to ~360px.
Honors `prefers-reduced-motion`.

## Development

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # → dist/
npm run preview      # serve the built output locally
```

## Deployment

Auto-deploys from this repo via Vercel. No `vercel.json` required — Vite is detected automatically (`npm run build` → `dist/`).

## Tweaks

- **Launch date** — `LAUNCH` constant in `src/App.jsx`
- **Copy** — headline + sub strings in `src/App.jsx`
- **Accent colour / palette** — CSS custom properties at the top of `src/index.css`
- **Globe rotation speed / tilt** — `<GlobeLoader rotateSpeed={…} tilt={…} />` props
