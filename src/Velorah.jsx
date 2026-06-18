// Velorah — uilora "coming soon" hero used AS-IS for the Cubixso construction
// page, with the live launch countdown dropped in. Only change from the uilora
// original: the logo reads "Cubixso" (it's our page) and a countdown row is
// inserted between the subtext and the CTA. Tailwind v4 (@tailwindcss/vite).

import React from 'react';

// ── Embedded styles (verbatim from the uilora component) ────────────────────
const VelorahStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&display=swap');
    .uv-liquid-glass {
      background: rgba(255, 255, 255, 0.01);
      background-blend-mode: luminosity;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: none;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }
    .uv-liquid-glass::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1.4px;
      background: linear-gradient(180deg,
        rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%,
        rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%,
        rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
    @keyframes fade-rise {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .uv-animate-fade-rise { animation: fade-rise 0.8s ease-out both; }
    .uv-animate-fade-rise-delay { animation: fade-rise 0.8s ease-out 0.2s both; }
    .uv-animate-fade-rise-delay-2 { animation: fade-rise 0.8s ease-out 0.4s both; }
    .uv-font-display { font-family: 'Instrument Serif', serif; }
    .uv-font-body { font-family: 'Inter', sans-serif; }
  ` }} />
);

const NAV = ['Services', 'Products', 'Industries', 'Case Studies', 'About', 'Contact'];

// The live site to open when the visitor clicks "Launch". Override per
// environment with VITE_SITE_URL (e.g. the Vercel deployment URL); defaults to
// the production domain.
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://app.cubixso.com';

const Navbar = () => (
  <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
    {/* Brand — transparent white cube mark + wordmark */}
    <a href="#" className="flex shrink-0 items-center gap-2.5">
      <img src="/logo-white.png" alt="Cubixso" className="h-7 sm:h-8 w-auto" />
      <span className="uv-font-display text-2xl sm:text-3xl tracking-tight text-white leading-none">Cubixso</span>
    </a>
    {/* Links only on lg+ (tablets get the clean logo + button layout). */}
    <div className="hidden lg:flex items-center gap-8">
      {NAV.map((link, i) => (
        <a
          key={link}
          href="#"
          className={`text-sm whitespace-nowrap transition-colors duration-300 ${i === 0 ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          {link}
        </a>
      ))}
    </div>
    <a
      href={SITE_URL}
      className="uv-liquid-glass shrink-0 whitespace-nowrap rounded-full px-5 sm:px-6 py-2.5 text-sm text-white hover:scale-[1.03] transition-transform duration-300 uv-font-body font-medium"
    >
      Launch
    </a>
  </nav>
);

export const Velorah = () => (
  <div className="relative min-h-screen w-full bg-[#001D33] overflow-hidden flex flex-col uv-font-body selection:bg-white selection:text-[#001D33]">
    <VelorahStyles />

    {/* Background Video (uilora demo asset, kept as-is) */}
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-cover z-0 grayscale-[0.2] brightness-75"
    >
      <source
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        type="video/mp4"
      />
    </video>

    <div className="relative z-10 flex flex-col flex-grow">
      <Navbar />

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 flex-grow py-[60px]">
        {/* w-full so the paragraph's max-w shrinks to the viewport on phones
            (without it the text overflowed and clipped under overflow-hidden). */}
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="uv-font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] text-white uv-animate-fade-rise font-normal max-w-6xl">
            AI-native technology, <br className="hidden md:block" />
            <em className="not-italic text-zinc-400">now live.</em>
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mt-12 leading-relaxed uv-animate-fade-rise-delay font-light">
            The Cubixso website is now live. Step inside our AI-native world of agentic
            systems, RAG platforms, and education technology for the autonomous enterprise,
            engineered across Hyderabad, the UAE, and the US.
          </p>

          <a
            href={SITE_URL}
            className="group inline-flex items-center gap-3 rounded-full bg-white text-[#001D33] px-16 sm:px-20 py-5 sm:py-6 text-lg sm:text-xl mt-16 font-semibold tracking-wide shadow-[0_12px_50px_-6px_rgba(255,255,255,0.5)] hover:shadow-[0_18px_64px_-4px_rgba(255,255,255,0.75)] hover:scale-[1.04] active:scale-[0.98] transition-all duration-300 cursor-pointer uv-animate-fade-rise-delay-2"
          >
            Launch
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </a>
        </div>
      </main>
    </div>

    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/30 z-[1]" />
  </div>
);

export default Velorah;
