// App.jsx — Cubixso.ai under-construction page.
// Aesthetic: retro-futuristic terminal × editorial atelier.
// Two-column composition: globe anchors middle-left, content stack flows right.
// Light + dark themes with persisted preference.

import React, { useEffect, useMemo, useState } from 'react';
import { DottedSurface } from './DottedSurface.jsx';
import GlobeLoader from './GlobeLoader.jsx';

const LS_THEME = 'cubixso.theme';

// ─── Brand mark ────────────────────────────────────────────────────────────

// Cubixso brand mark — uses the actual logo PNG as a CSS mask so the rendered
// shape is pixel-accurate to the brand, while `background-color: currentColor`
// makes it theme-adaptive (white in dark mode, charcoal in light).
const Glyph = ({ size = 18 }) => (
  <span
    className="brand-glyph"
    style={{ width: size, height: size }}
    role="img"
    aria-label="Cubixso"
  />
);

// Sun + moon icons for theme toggle
const IconSun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="4.2" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <line x1="12" y1="2.5" x2="12" y2="5.6" />
      <line x1="12" y1="18.4" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5.6" y2="12" />
      <line x1="18.4" y1="12" x2="21.5" y2="12" />
      <line x1="5.2" y1="5.2" x2="7.4" y2="7.4" />
      <line x1="16.6" y1="16.6" x2="18.8" y2="18.8" />
      <line x1="5.2" y1="18.8" x2="7.4" y2="16.6" />
      <line x1="16.6" y1="7.4" x2="18.8" y2="5.2" />
    </g>
  </svg>
);
const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
    <path d="M20 14.5 A 8 8 0 1 1 9.5 4 A 6.4 6.4 0 0 0 20 14.5 Z"
          fill="currentColor" />
  </svg>
);

// ─── Hooks ────────────────────────────────────────────────────────────────

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const formatClock = (d) => {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

// Launch window — extended +12h to 2026-06-12 06:00 IST
const LAUNCH = new Date('2026-06-12T06:00:00+05:30').getTime();

function useCountdown(target = LAUNCH) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, target - now);
  return {
    days:  Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    mins:  Math.floor((ms % 3600000) / 60000),
    secs:  Math.floor((ms % 60000) / 1000),
    done:  ms === 0,
  };
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem(LS_THEME) || 'dark';
  });
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    try { localStorage.setItem(LS_THEME, theme); } catch {}
  }, [theme]);
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))];
}

// ─── Subscribe form ───────────────────────────────────────────────────────

function Subscribe() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    const subject = encodeURIComponent('Cubixso.ai — launch alert');
    const body = encodeURIComponent(`Add this address to the launch list:\n\n${email}`);
    window.open(`mailto:contact@cubixso.com?subject=${subject}&body=${body}`, '_self');
    setSent(true);
  };
  return (
    <form className="sub" onSubmit={submit} aria-label="Notify me on launch">
      <span className="sub-prefix">&gt;</span>
      <input
        type="email"
        required
        placeholder="enter address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email"
      />
      <button type="submit" aria-label="Notify me">
        <span>{sent ? 'OK' : 'NOTIFY'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
          <path d="M5 12 H19 M13 6 L19 12 L13 18"
                stroke="currentColor" strokeWidth="2.4" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}

// ─── Horizontal countdown ──────────────────────────────────────────────────

function HorizontalCountdown() {
  const { days, hours, mins, secs, done } = useCountdown();
  if (done) return <div className="cdh-done">Launching now.</div>;
  const cells = [
    { n: String(days).padStart(3, '0'),  l: 'days' },
    { n: String(hours).padStart(2, '0'), l: 'hours' },
    { n: String(mins).padStart(2, '0'),  l: 'mins' },
    { n: String(secs).padStart(2, '0'),  l: 'secs' },
  ];
  return (
    <div className="cdh" role="timer" aria-live="polite">
      <div className="cdh-eyebrow">T-MINUS</div>
      <div className="cdh-row">
        {cells.map((c, i) => (
          <React.Fragment key={c.l}>
            <div className="cdh-cell">
              <div className="cdh-num">{c.n}</div>
              <div className="cdh-lbl">{c.l}</div>
            </div>
            {i < cells.length - 1 && <div className="cdh-sep" aria-hidden />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Telemetry edges ──────────────────────────────────────────────────────

function EdgeTop() {
  const t = useClock();
  return (
    <div className="edge edge-top" aria-hidden>
      <span>SYS//CUBIXSO.AI</span>
      <span className="edge-sep" />
      <span>BUILD//0.0.1-α</span>
      <span className="edge-sep" />
      <span>NODE//HYD-01</span>
      <span className="edge-sep" />
      <span>LAT 17°23&prime;N · LNG 78°28&prime;E</span>
      <span className="edge-spacer" />
      <span className="edge-live"><span className="edge-dot" /> LIVE</span>
      <span className="edge-sep" />
      <span>{formatClock(t)} GMT+5:30</span>
    </div>
  );
}

function EdgeBottom() {
  return (
    <div className="edge edge-bottom" aria-hidden>
      <span>SIGNAL//STABLE</span>
      <span className="edge-sep" />
      <span>COORDINATE//17.385°N, 78.486°E</span>
      <span className="edge-sep" />
      <span>&copy;2026 CUBIXSO AI</span>
      <span className="edge-spacer" />
      <span>STARTUP INDIA RECOGNISED</span>
      <span className="edge-sep" />
      <span>RETURNING Q3 2026</span>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <>
      {/* Live wallpaper — dotted-surface waves, theme-aware */}
      <DottedSurface theme={theme} />

      {/* Atmospheric overlays */}
      <div className="scanlines" aria-hidden />
      <div className="hairline-grid" aria-hidden />

      {/* Edge runners */}
      <EdgeTop />
      <EdgeBottom />

      {/* Corner crosshairs */}
      <span className="crosshair ch-tl" aria-hidden />
      <span className="crosshair ch-tr" aria-hidden />
      <span className="crosshair ch-bl" aria-hidden />
      <span className="crosshair ch-br" aria-hidden />

      <main className="ed-grid">
        {/* Brand top-left */}
        <header className="ed-brand">
          <Glyph size={36} />
          <span>CUBIXSO.AI</span>
        </header>

        {/* Top-right controls — theme toggle + status pill */}
        <div className="ed-controls">
          <button
            type="button"
            className="theme-toggle"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={toggleTheme}>
            {theme === 'dark' ? <IconSun /> : <IconMoon />}
            <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>
          <div className="ed-status" role="status">
            <span className="ed-status-dot" aria-hidden />
            <span>System under construction</span>
            <span className="ed-status-meta">v0 → v1</span>
          </div>
        </div>

        {/* Globe — middle-left */}
        <section className="ed-globe">
          <div className="ed-globe-label">
            <span className="ed-globe-tick" />
            EARTH · LIVE · ORTHOGRAPHIC · 110m
          </div>
          <GlobeLoader />
          <div className="ed-globe-meta">
            <span>ROT 16°/s</span>
            <span className="edge-sep" />
            <span>TILT -18°</span>
            <span className="edge-sep" />
            <span>R 78px</span>
          </div>
        </section>

        {/* Content stack — middle-right */}
        <section className="ed-main">
          <div className="ed-head-eyebrow">DISPATCH No. 001 — 2026.05.22</div>
          <h1 className="ed-h">
            We&rsquo;re building<br />
            <em>the future</em><br />
            <span className="ed-h-line">in <em>private.</em></span>
          </h1>
          <p className="ed-sub">
            Cubixso.ai is being rebuilt from the ground up. New systems, new products,
            same crew. The signal returns when it&rsquo;s ready &mdash; not before.
          </p>

          <HorizontalCountdown />

          <div className="ed-tail">
            <div className="ed-tail-block">
              <div className="ed-tail-label">NOTIFY ON LAUNCH</div>
              <Subscribe />
            </div>
            <div className="ed-tail-block">
              <div className="ed-tail-label">DIRECT LINE</div>
              <div className="ed-contact">
                <a href="mailto:contact@cubixso.com">contact@cubixso.com</a>
                <a href="tel:+918374563012">+91 83745 63012</a>
                <span className="ed-contact-muted">T-HUB · HYDERABAD · IN</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
