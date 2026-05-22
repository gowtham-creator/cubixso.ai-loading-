// GlobeLoader.jsx — true monochrome spinning globe with real country outlines.
// Data: Natural Earth 110m (CC0) via the `world-atlas` package, decoded with
// `topojson-client`, projected with d3-geo's orthographic projection so we
// only render the visible hemisphere — a real sphere, not a flat map illusion.
// 200×200 sits on an off-white panel. Whirl ring orbits around it. No text.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import worldTopo from 'world-atlas/countries-110m.json';

const SIZE = 200;
const RADIUS = 78;        // sphere radius inside the 200×200 panel
const TRANSLATE = [SIZE / 2, SIZE / 2];

// Pre-compute the GeoJSON shapes once at module load — these are pure data.
const GEO = (() => {
  const countries = feature(worldTopo, worldTopo.objects.countries);
  const borders   = mesh(worldTopo, worldTopo.objects.countries, (a, b) => a !== b);
  const sphere    = { type: 'Sphere' };
  const graticule = geoGraticule10();
  return { countries, borders, sphere, graticule };
})();

export default function GlobeLoader({ rotateSpeed = 16, tilt = -18 }) {
  const [lambda, setLambda] = useState(0);
  const rafRef = useRef(0);
  const lastRef = useRef(performance.now());

  // Drive globe rotation on rAF; pause when the document is hidden.
  useEffect(() => {
    const tick = (now) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setLambda((l) => (l + dt * rotateSpeed) % 360);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    const onVis = () => { lastRef.current = performance.now(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [rotateSpeed]);

  // Re-derive projection each frame (cheap — d3-geo creates a small closure).
  const projection = useMemo(() => geoOrthographic()
    .scale(RADIUS)
    .translate(TRANSLATE)
    .clipAngle(90)
    .rotate([lambda, tilt, 0]),
  [lambda, tilt]);

  const path = useMemo(() => geoPath(projection), [projection]);

  // Memoize path-string outputs per frame
  const d = {
    sphere:    path(GEO.sphere),
    graticule: path(GEO.graticule),
    countries: path(GEO.countries),
    borders:   path(GEO.borders),
  };

  return (
    <div className="globe-loader" role="img" aria-label="Earth, spinning">
      <div className="globe-panel">
        {/* Real globe */}
        <svg className="globe-svg" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          {/* Sphere fill — slightly cooler than the panel for separation */}
          <path d={d.sphere} fill="#f7f4ed" />
          {/* Graticule — soft 10° grid */}
          <path d={d.graticule}
                fill="none" stroke="#161616" strokeOpacity="0.10"
                strokeWidth="0.45" strokeLinejoin="round" />
          {/* Country fills */}
          <path d={d.countries} fill="#0f0f10" />
          {/* Internal country borders — light strokes carving fills */}
          <path d={d.borders}
                fill="none" stroke="#f7f4ed" strokeWidth="0.45" strokeLinejoin="round" />
          {/* Sphere outline */}
          <path d={d.sphere} fill="none" stroke="#0f0f10" strokeWidth="1.4" />
          {/* Subtle sphere shading */}
          <defs>
            <radialGradient id="globe-shade" cx="38%" cy="34%" r="78%">
              <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.30" />
            </radialGradient>
          </defs>
          <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS - 0.5} fill="url(#globe-shade)" />
        </svg>

        {/* Whirl — five counter-rotating ornaments around the globe */}
        <svg className="globe-whirl" viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <g className="whirl-a">
            <circle cx={SIZE / 2} cy={SIZE / 2} r="90"
                    fill="none" stroke="#0f0f10" strokeWidth="1"
                    strokeDasharray="2 9" strokeLinecap="round" />
          </g>
          <g className="whirl-b">
            <circle cx={SIZE / 2} cy={SIZE / 2} r="96"
                    fill="none" stroke="#0f0f10" strokeWidth="0.6"
                    strokeDasharray="1 11" strokeLinecap="round" />
          </g>
          <g className="whirl-c">
            <circle cx={SIZE / 2} cy="6.5" r="2.4" fill="#0f0f10" />
          </g>
          <g className="whirl-d">
            <circle cx={SIZE / 2} cy="6.5" r="1.6" fill="#0f0f10" />
          </g>
          <g className="whirl-e">
            <path d={`M ${SIZE / 2} 14 A 86 86 0 0 1 ${SIZE / 2 + 86} ${SIZE / 2}`}
                  fill="none" stroke="#0f0f10" strokeWidth="1.5"
                  strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}
