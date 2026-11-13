import React, { useEffect, useRef, useState } from 'react';
import type { Lesson } from '../../data/types';
import Icon from '../ui/Icon';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

function project(
  point: Point3D,
  yaw: number,
  pitch: number,
  zoom: number,
  width: number,
  height: number
): { x: number; y: number; depth: number } {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = point.x * cosY - point.z * sinY;
  const z1 = point.x * sinY + point.z * cosY;

  const cosX = Math.cos(pitch);
  const sinX = Math.sin(pitch);
  const y1 = point.y * cosX - z1 * sinX;
  const z2 = point.y * sinX + z1 * cosX;

  const distance = 16;
  const scale = (zoom * Math.min(width, height)) / (z2 + distance);
  return {
    x: width / 2 + x1 * scale,
    y: height / 2 - y1 * scale,
    depth: z2
  };
}

function surfaceHeight(x: number, y: number, amplitude: number, frequency: number): number {
  const radius = Math.sqrt(x * x + y * y);
  return amplitude * 2.4 * Math.sin(frequency * radius * 1.7) * Math.exp(-radius / 6.5);
}

export default function Laser3DLab({ lesson }: { lesson: Lesson }) {
  const config = lesson.labConfig ?? {};
  const initialMode = typeof config.mode === 'string' ? config.mode : 'surface';
  const initialAmplitude = typeof config.amplitude === 'number' ? config.amplitude : 1;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const yawRef = useRef(0.7);
  const pitchRef = useRef(0.42);
  const zoomRef = useRef(1.05);
  const draggingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const amplitudeRef = useRef(initialAmplitude);
  const frequencyRef = useRef(1);
  const autoRef = useRef(true);
  const modeRef = useRef(initialMode);

  const [amplitude, setAmplitude] = useState(initialAmplitude);
  const [frequency, setFrequency] = useState(1);
  const [auto, setAuto] = useState(true);
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    amplitudeRef.current = amplitude;
  }, [amplitude]);
  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);
  useEffect(() => {
    autoRef.current = auto;
  }, [auto]);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    let frame = 0;
    let animation = 0;
    const start = performance.now();
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const drawLine = (
      a: Point3D,
      b: Point3D,
      color: string,
      lineWidth = 1,
      glow = 0
    ) => {
      const pa = project(a, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      const pb = project(b, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = lineWidth;
      if (glow > 0) {
        context.shadowColor = color;
        context.shadowBlur = glow;
      }
      context.moveTo(pa.x, pa.y);
      context.lineTo(pb.x, pb.y);
      context.stroke();
      context.shadowBlur = 0;
    };

    const render = () => {
      frame += 1;
      const time = (performance.now() - start) / 1000;
      const reduced =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('reduce-motion');

      if (autoRef.current && !draggingRef.current && !reduced) {
        yawRef.current += 0.0032;
      }

      context.clearRect(0, 0, width, height);

      const background = context.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72
      );
      background.addColorStop(0, 'rgba(14, 40, 64, 0.62)');
      background.addColorStop(0.45, 'rgba(5, 12, 24, 0.9)');
      background.addColorStop(1, '#02050c');
      context.fillStyle = background;
      context.fillRect(0, 0, width, height);

      // Grid floor
      for (let index = -6; index <= 6; index++) {
        const alpha = index === 0 ? 0.3 : 0.1;
        drawLine({ x: -6, y: -6, z: index }, { x: 6, y: -6, z: index }, `rgba(34, 211, 238, ${alpha})`, 1);
        drawLine({ x: index, y: -6, z: -6 }, { x: index, y: -6, z: 6 }, `rgba(34, 211, 238, ${alpha})`, 1);
      }

      // Axes
      drawLine({ x: 0, y: -6, z: 0 }, { x: 6.6, y: -6, z: 0 }, 'rgba(34, 211, 238, 0.7)', 2);
      drawLine({ x: 0, y: -6, z: 0 }, { x: 0, y: 5.6, z: 0 }, 'rgba(253, 224, 71, 0.72)', 2);
      drawLine({ x: 0, y: -6, z: 0 }, { x: 0, y: -6, z: 6.6 }, 'rgba(167, 139, 250, 0.7)', 2);

      const surfaceMode = modeRef.current === 'surface' || modeRef.current === 'arena' || modeRef.current === 'boss';
      const isArena = modeRef.current === 'arena' || modeRef.current === 'boss';

      if (surfaceMode) {
        const segments = isArena ? 18 : 24;
        const range = 5.2;
        const points: Point3D[][] = [];
        for (let i = 0; i <= segments; i++) {
          const row: Point3D[] = [];
          const x = -range + (i / segments) * range * 2;
          for (let j = 0; j <= segments; j++) {
            const z = -range + (j / segments) * range * 2;
            const y = surfaceHeight(x, z, amplitudeRef.current, frequencyRef.current);
            row.push({ x, y, z });
          }
          points.push(row);
        }

        for (let i = 0; i <= segments; i++) {
          for (let j = 0; j <= segments; j++) {
            const point = points[i][j];
            const hue = Math.max(0, Math.min(1, (point.y + 3) / 6));
            const color = `hsla(${188 + hue * 92}, 92%, ${52 + hue * 16}%, ${0.16 + hue * 0.42})`;
            if (i < segments) drawLine(point, points[i + 1][j], color, 1);
            if (j < segments) drawLine(point, points[i][j + 1], color, 1);
          }
        }
      }

      // Laser beams
      const beamCount = modeRef.current === 'boss' ? 10 : isArena ? 7 : 5;
      for (let index = 0; index < beamCount; index++) {
        const angle = time * 0.8 + (index / beamCount) * Math.PI * 2;
        const radius = 3.6 + Math.sin(time * 0.6 + index) * 1.1;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = surfaceHeight(x, z, amplitudeRef.current, frequencyRef.current);
        const startPoint = { x: 0, y: -6.2, z: 0 };
        const endPoint = { x, y, z };
        drawLine(startPoint, endPoint, 'rgba(253, 224, 71, 0.42)', 1.2, 14);
        drawLine(endPoint, { x: x * 1.02, y: y + 1.4, z: z * 1.02 }, 'rgba(255, 255, 255, 0.55)', 1);

        const head = project(endPoint, yawRef.current, pitchRef.current, zoomRef.current, width, height);
        context.beginPath();
        context.fillStyle = 'rgba(253, 224, 71, 0.9)';
        context.shadowColor = '#fde047';
        context.shadowBlur = 16;
        context.arc(head.x, head.y, 2.6, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;
      }

      // Helix particle
      for (let index = 0; index < 42; index++) {
        const t = index / 42;
        const angle = t * Math.PI * 5 + time * 0.9;
        const point = {
          x: Math.cos(angle) * 4.6,
          y: -5.6 + t * 9,
          z: Math.sin(angle) * 4.6
        };
        const p = project(point, yawRef.current, pitchRef.current, zoomRef.current, width, height);
        context.beginPath();
        context.fillStyle = `rgba(34, 211, 238, ${0.15 + t * 0.7})`;
        context.arc(p.x, p.y, 1.5 + t * 1.4, 0, Math.PI * 2);
        context.fill();
      }

      // Axis labels
      context.font = '11px ui-monospace, monospace';
      context.fillStyle = 'rgba(34, 211, 238, 0.8)';
      const xLabel = project({ x: 6.9, y: -6, z: 0 }, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      context.fillText('X', xLabel.x, xLabel.y);
      context.fillStyle = 'rgba(253, 224, 71, 0.8)';
      const yLabel = project({ x: 0, y: 6, z: 0 }, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      context.fillText('Y', yLabel.x, yLabel.y);
      context.fillStyle = 'rgba(167, 139, 250, 0.8)';
      const zLabel = project({ x: 0, y: -6, z: 6.9 }, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      context.fillText('Z', zLabel.x, zLabel.y);

      animation = window.requestAnimationFrame(render);
    };

    animation = window.requestAnimationFrame(render);

    const handlePointerDown = (event: PointerEvent) => {
      draggingRef.current = true;
      lastRef.current = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!draggingRef.current || !lastRef.current) return;
      const dx = event.clientX - lastRef.current.x;
      const dy = event.clientY - lastRef.current.y;
      yawRef.current += dx * 0.007;
      pitchRef.current = Math.max(-1.2, Math.min(1.2, pitchRef.current + dy * 0.006));
      lastRef.current = { x: event.clientX, y: event.clientY };
    };
    const handlePointerUp = (event: PointerEvent) => {
      draggingRef.current = false;
      lastRef.current = null;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      zoomRef.current = Math.max(0.55, Math.min(2, zoomRef.current - event.deltaY * 0.0012));
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(animation);
      observer.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="lab lab-3d">
      <div className="lab-head">
        <div>
          <span className="lab-kicker">Laboratorio 08 · Espacio 3D</span>
          <h3>Campo de láser</h3>
          <p>Arrastrá para rotar, usá la rueda para acercar. Las rectas son haces que recorren la superficie.</p>
        </div>
        <div className="lab-badge">
          <Icon name="laser" size={16} /> WebGL-free 3D
        </div>
      </div>

      <div className="canvas-wrap">
        <canvas ref={canvasRef} className="laser-canvas" aria-label="Visualización 3D interactiva de una superficie matemática con haces láser" />
        <div className="canvas-hud">
          <span>arrastrar · rotar</span>
          <span>rueda · zoom</span>
          <span>{mode === 'boss' ? 'modo examen' : mode === 'arena' ? 'modo arena' : 'superficie'}</span>
        </div>
      </div>

      <div className="lab-controls">
        <label className="slider">
          <span className="slider-label">amplitud <strong style={{ color: '#22d3ee' }}>{amplitude.toFixed(1)}</strong></span>
          <input type="range" min="0.2" max="2.5" step="0.1" value={amplitude} onChange={(event) => setAmplitude(Number(event.target.value))} style={{ accentColor: '#22d3ee' }} />
        </label>
        <label className="slider">
          <span className="slider-label">frecuencia <strong style={{ color: '#a78bfa' }}>{frequency.toFixed(1)}</strong></span>
          <input type="range" min="0.3" max="2.2" step="0.1" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))} style={{ accentColor: '#a78bfa' }} />
        </label>
        <div className="preset-row">
          <button className={`chip ${auto ? 'active' : ''}`} onClick={() => setAuto(!auto)}>
            {auto ? '⏸ Rotación' : '▶ Rotación'}
          </button>
          {['surface', 'arena', 'boss'].map((item) => (
            <button key={item} className={`chip ${mode === item ? 'active' : ''}`} onClick={() => setMode(item)}>
              {item === 'surface' ? 'Superficie' : item === 'arena' ? 'Arena' : 'Examen'}
            </button>
          ))}
        </div>
      </div>

      <div className="lab-footnote">
        <Icon name="bulb" size={15} />
        <span>Esta escena no usa imágenes: cada frame se calcula con proyección 3D, rotaciones y una función de onda. La matemática es el motor.</span>
      </div>
    </div>
  );
}
