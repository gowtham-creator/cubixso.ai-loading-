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

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000,
    );
    camera.position.set(0, 355, 1220);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
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
      camera.aspect = window.innerWidth / window.innerHeight;
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
