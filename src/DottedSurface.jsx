// DottedSurface.jsx — aligned 1:1 with the reference at 21st.dev
// (sshahaider/dotted-surface). Adaptations only for this Vite + JSX stack:
//   • theme passed as prop (instead of `next-themes`)
//   • plain className (no shadcn `cn` util)
//   • JSX (no TSX)
//   • StrictMode-safe cleanup using closure-captured animationId
// All visual parameters (point size, attenuation, opacity, wave amplitude,
// phase step, particle color, camera position) match the reference exactly.

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function DottedSurface({ theme = 'dark', className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const SEPARATION = 150;
    const AMOUNTX = 40;
    const AMOUNTY = 60;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    // HORIZONTAL-FOV LOCK. PerspectiveCamera's fov is VERTICAL, so with a fixed
    // 60 the horizontal field shrinks in proportion to the aspect ratio. On a
    // portrait phone (~0.46) that is roughly a third of the desktop (~1.6)
    // horizontal view, and the 6000-unit-wide dot grid falls almost entirely
    // outside the frustum — the background renders but nothing of it is on
    // screen, which is the "background not visible on mobile/tablet" report.
    //
    // Widening the vertical fov on narrow viewports keeps the same horizontal
    // extent visible at every aspect. Landscape/desktop is untouched (the
    // branch only fires below the reference aspect), so the original framing is
    // preserved exactly where it already worked.
    const BASE_FOV = 60;
    const BASE_ASPECT = 16 / 9;
    const fovFor = (aspect) =>
      aspect >= BASE_ASPECT
        ? BASE_FOV
        : (2 *
            Math.atan(
              Math.tan((BASE_FOV * Math.PI) / 180 / 2) * (BASE_ASPECT / aspect),
            ) *
            180) /
          Math.PI;

    const aspect0 = window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(fovFor(aspect0), aspect0, 1, 10000);
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // Cap DPR: phones report 3, and a 3x full-screen canvas with antialias on
    // top of 2400 animated points is a lot of fill for a splash screen.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);

    containerRef.current.appendChild(renderer.domElement);

    const positions = [];
    const colors = [];
    const geometry = new THREE.BufferGeometry();

    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        const y = 0;
        const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        positions.push(x, y, z);
        if (theme === 'dark') {
          colors.push(200, 200, 200);
        } else {
          colors.push(0, 0, 0);
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    // Hint the GPU that position is rewritten every frame.
    geometry.attributes.position.usage = THREE.DynamicDrawUsage;

    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const positionAttribute = geometry.attributes.position;
      const arr = positionAttribute.array;

      let i = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const index = i * 3;
          arr[index + 1] =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;
          i++;
        }
      }
      positionAttribute.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.1;
    };

    const handleResize = () => {
      const aspect = window.innerWidth / window.innerHeight;
      camera.aspect = aspect;
      // Recompute fov too — a phone rotating portrait<->landscape changes the
      // aspect enough that a fixed fov would re-lose the field.
      camera.fov = fovFor(aspect);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    animate();

    // StrictMode-safe cleanup: cancel the LIVE rAF (closure variable,
    // not a stale snapshot), dispose objects, detach canvas.
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      scene.traverse((object) => {
        if (object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((m) => m.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      const canvasEl = renderer.domElement;
      if (canvasEl && canvasEl.parentNode) canvasEl.parentNode.removeChild(canvasEl);
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={`dotted-surface ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
