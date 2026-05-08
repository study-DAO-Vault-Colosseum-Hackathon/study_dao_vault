import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';

const DEFAULT_OPTIONS = {
  onSpeedUp: () => {},
  onSlowDown: () => {},
  distortion: 'turbulentDistortion',
  length: 380,
  roadWidth: 9,
  fov: 90,
  fovSpeedUp: 140,
  speedUp: 2.2,
  colors: {
    background: 0x000000,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
  },
};

export const hyperspeedPresets = {
  one: {
    distortion: 'turbulentDistortion',
    length: 380,
    roadWidth: 9,
    fov: 90,
    fovSpeedUp: 140,
    speedUp: 2.2,
    colors: {
      background: 0x000000,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    },
  },
};

const Hyperspeed = forwardRef(function Hyperspeed({ effectOptions, className = '' }, ref) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => containerRef.current);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) {
      return undefined;
    }

    const options = { ...DEFAULT_OPTIONS, ...effectOptions };
    const colors = { ...DEFAULT_OPTIONS.colors, ...(effectOptions?.colors || {}) };

    const state = {
      speed: 1,
      targetSpeed: 1,
      fov: options.fov,
      targetFov: options.fov,
    };

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(colors.background);

    const camera = new THREE.PerspectiveCamera(state.fov, 1, 0.1, 10000);
    camera.position.z = 10;
    camera.position.y = 7;

    const resize = () => {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);

    const count = 1600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 6);
    const lineColors = new Float32Array(count * 6);

    for (let i = 0; i < count; i += 1) {
      const z = Math.random() * options.length;
      const r = options.roadWidth + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r;

      const idx = i * 6;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = -z;
      positions[idx + 3] = x;
      positions[idx + 4] = y;
      positions[idx + 5] = -(z + 10 + Math.random() * 40);

      const palette = i % 2 === 0 ? colors.leftCars : colors.rightCars;
      const color = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      lineColors[idx] = color.r;
      lineColors[idx + 1] = color.g;
      lineColors[idx + 2] = color.b;
      lineColors[idx + 3] = color.r;
      lineColors[idx + 4] = color.g;
      lineColors[idx + 5] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    const updateDistortion = (time) => {
      const pos = geometry.attributes.position.array;

      for (let i = 0; i < count; i += 1) {
        const idx = i * 6;
        pos[idx + 2] += state.speed * 4.6;
        pos[idx + 5] += state.speed * 4.6;

        if (pos[idx + 2] > 40) {
          const newZ = options.length;
          const length = 10 + Math.random() * 40;
          pos[idx + 2] = -newZ;
          pos[idx + 5] = -(newZ + length);
        }

        if (options.distortion === 'turbulentDistortion') {
          const offset = Math.sin(time * 0.001 + pos[idx + 2] * 0.01) * 2;
          pos[idx] += offset * 0.01;
          pos[idx + 3] += offset * 0.01;
        }
      }

      geometry.attributes.position.needsUpdate = true;
    };

    let frameId;
    const animate = (time) => {
      frameId = requestAnimationFrame(animate);
      state.speed += (state.targetSpeed - state.speed) * 0.05;
      state.fov += (state.targetFov - state.fov) * 0.05;
      camera.fov = state.fov;
      camera.updateProjectionMatrix();
      updateDistortion(time);
      renderer.render(scene, camera);
    };
    animate(0);

    const speedUp = () => {
      state.targetSpeed = options.speedUp;
      state.targetFov = options.fovSpeedUp;
      options.onSpeedUp?.();
    };

    const slowDown = () => {
      state.targetSpeed = 1;
      state.targetFov = options.fov;
      options.onSlowDown?.();
    };

    window.addEventListener('mousedown', speedUp);
    window.addEventListener('mouseup', slowDown);
    window.addEventListener('touchstart', speedUp);
    window.addEventListener('touchend', slowDown);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', speedUp);
      window.removeEventListener('mouseup', slowDown);
      window.removeEventListener('touchstart', speedUp);
      window.removeEventListener('touchend', slowDown);
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [effectOptions]);

  return (
    <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
});

export default Hyperspeed;
