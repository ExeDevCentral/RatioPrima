import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Lesson } from '../../data/types';
import { KaTeXInline } from '../KaTeXView';
import Icon from '../ui/Icon';

export type Scene3DKind =
  | 'sets3d'
  | 'powers3d'
  | 'helix3d'
  | 'cube3d'
  | 'parabola3d'
  | 'rational3d'
  | 'planes3d'
  | 'wave3d';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface Face3D {
  pts: Vec3[];
  fill: string;
  stroke: string;
  depth: number;
}

export const SCENE_META: Record<
  Scene3DKind,
  {
    title: string;
    subtitle: string;
    paramALabel: string;
    paramBLabel: string;
    defaultA: number;
    defaultB: number;
    minA: number;
    maxA: number;
    stepA: number;
    minB: number;
    maxB: number;
    stepB: number;
  }
> = {
  sets3d: {
    title: 'Anillos Numéricos & Módulo 3D',
    subtitle: 'Inclusión ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ y cono de distancia |x - c| ≤ r',
    paramALabel: 'centro c',
    paramBLabel: 'radio r',
    defaultA: 1.5,
    defaultB: 2.0,
    minA: -3,
    maxA: 3,
    stepA: 0.5,
    minB: 0.5,
    maxB: 3.5,
    stepB: 0.5
  },
  powers3d: {
    title: 'Geometría de Potencias & Raíces',
    subtitle: 'Del segmento a¹ al área a² y al volumen cúbico a³',
    paramALabel: 'base a',
    paramBLabel: 'exponente',
    defaultA: 2.2,
    defaultB: 3,
    minA: 1.2,
    maxA: 3.2,
    stepA: 0.2,
    minB: 1,
    maxB: 3,
    stepB: 1
  },
  helix3d: {
    title: 'Hélice Trigonométrica 3D',
    subtitle: 'Proyección espacial (cos θ, sen θ, θ): círculo unitario + ondas ortogonales',
    paramALabel: 'ángulo (°)',
    paramBLabel: 'vueltas',
    defaultA: 45,
    defaultB: 2.0,
    minA: 0,
    maxA: 360,
    stepA: 5,
    minB: 1,
    maxB: 3.5,
    stepB: 0.5
  },
  cube3d: {
    title: 'Cubo Binomial (a + b)³ Explotado',
    subtitle: '8 bloques 3D: a³ + 3a²b + 3ab² + b³ (por qué ≠ a³ + b³)',
    paramALabel: 'lado a',
    paramBLabel: 'separación',
    defaultA: 2.2,
    defaultB: 0.85,
    minA: 1.4,
    maxA: 2.8,
    stepA: 0.2,
    minB: 0,
    maxB: 1.8,
    stepB: 0.1
  },
  parabola3d: {
    title: 'Paraboloide & Raíces Reales',
    subtitle: 'Corte con el plano y = 0: Δ > 0 (2 raíces), Δ = 0 (1), Δ < 0 (0)',
    paramALabel: 'coeficiente a',
    paramBLabel: 'término c',
    defaultA: 0.45,
    defaultB: -1.8,
    minA: -0.8,
    maxA: 0.9,
    stepA: 0.05,
    minB: -3.0,
    maxB: 2.5,
    stepB: 0.2
  },
  rational3d: {
    title: 'Superficie de Signos & Asíntota',
    subtitle: 'f(x) = (x - r) / (x - m): muro vertical en el denominador nulo',
    paramALabel: 'raíz r',
    paramBLabel: 'muro m',
    defaultA: 2.0,
    defaultB: -2.0,
    minA: -3.5,
    maxA: 3.5,
    stepA: 0.5,
    minB: -3.5,
    maxB: 3.5,
    stepB: 0.5
  },
  planes3d: {
    title: 'Planos & Rectas en el Espacio',
    subtitle: 'Sistemas: secantes (1 sol.), paralelos (∅) o coincidentes (∞)',
    paramALabel: 'pendiente m₂',
    paramBLabel: 'desfase b₂',
    defaultA: -1.0,
    defaultB: 1.5,
    minA: -2.0,
    maxA: 2.0,
    stepA: 0.2,
    minB: -2.5,
    maxB: 2.5,
    stepB: 0.5
  },
  wave3d: {
    title: 'Campo de Onda Láser 3D',
    subtitle: 'Superficie paramétrica z = A·sen(f·r)·e^(-r/6.5) con haces tangentes',
    paramALabel: 'amplitud A',
    paramBLabel: 'frecuencia f',
    defaultA: 1.3,
    defaultB: 1.1,
    minA: 0.3,
    maxA: 2.4,
    stepA: 0.1,
    minB: 0.4,
    maxB: 2.2,
    stepB: 0.1
  }
};

export function sceneForLesson(lesson: Lesson): Scene3DKind {
  switch (lesson.worldId) {
    case 'reales':
      return 'sets3d';
    case 'operaciones':
      return 'powers3d';
    case 'trigonometria':
      return 'helix3d';
    case 'algebra':
      return 'cube3d';
    case 'ecuaciones':
      return 'parabola3d';
    case 'inecuaciones':
      return 'rational3d';
    case 'sistemas':
      return 'planes3d';
    default:
      return 'wave3d';
  }
}

function projectPoint(
  p: Vec3,
  yaw: number,
  pitch: number,
  zoom: number,
  width: number,
  height: number
): { x: number; y: number; depth: number } {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy - p.z * sy;
  const z1 = p.x * sy + p.z * cy;

  const cx = Math.cos(pitch);
  const sx = Math.sin(pitch);
  const y1 = p.y * cx - z1 * sx;
  const z2 = p.y * sx + z1 * cx;

  const dist = 16.5;
  const scale = (zoom * Math.min(width, height)) / Math.max(2, z2 + dist);
  return {
    x: width / 2 + x1 * scale,
    y: height / 2 - y1 * scale,
    depth: z2
  };
}

function pushBox(
  faces: Face3D[],
  cx: number,
  cy: number,
  cz: number,
  sx: number,
  sy: number,
  sz: number,
  colorRgb: string,
  yaw: number,
  pitch: number,
  zoom: number,
  w: number,
  h: number
) {
  const hx = sx / 2;
  const hy = sy / 2;
  const hz = sz / 2;
  const v: Vec3[] = [
    { x: cx - hx, y: cy - hy, z: cz - hz },
    { x: cx + hx, y: cy - hy, z: cz - hz },
    { x: cx + hx, y: cy + hy, z: cz - hz },
    { x: cx - hx, y: cy + hy, z: cz - hz },
    { x: cx - hx, y: cy - hy, z: cz + hz },
    { x: cx + hx, y: cy - hy, z: cz + hz },
    { x: cx + hx, y: cy + hy, z: cz + hz },
    { x: cx - hx, y: cy + hy, z: cz + hz }
  ];
  const quads: Array<[number, number, number, number, number]> = [
    [0, 1, 2, 3, 0.28],
    [4, 5, 6, 7, 0.34],
    [0, 1, 5, 4, 0.18],
    [2, 3, 7, 6, 0.42],
    [0, 3, 7, 4, 0.24],
    [1, 2, 6, 5, 0.32]
  ];
  for (const [i0, i1, i2, i3, alpha] of quads) {
    const pts = [v[i0], v[i1], v[i2], v[i3]];
    const avgZ =
      pts.reduce((acc, p) => acc + projectPoint(p, yaw, pitch, zoom, w, h).depth, 0) / 4;
    faces.push({
      pts,
      fill: `rgba(${colorRgb}, ${alpha})`,
      stroke: `rgba(${colorRgb}, 0.85)`,
      depth: avgZ
    });
  }
}

export default function Math3DScene({
  lesson,
  activeStep = 0,
  activeFormula,
  caption,
  allowSwitch = false,
  compact = false,
  cinema = false,
  onKindChange
}: {
  lesson: Lesson;
  activeStep?: number;
  activeFormula?: string;
  caption?: string;
  allowSwitch?: boolean;
  compact?: boolean;
  cinema?: boolean;
  onKindChange?: (kind: Scene3DKind) => void;
}) {
  const defaultKind = useMemo(() => sceneForLesson(lesson), [lesson]);
  const [kind, setKind] = useState<Scene3DKind>(defaultKind);
  const meta = SCENE_META[kind];

  const [paramA, setParamA] = useState<number>(meta.defaultA);
  const [paramB, setParamB] = useState<number>(meta.defaultB);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  useEffect(() => {
    setKind(defaultKind);
  }, [defaultKind]);

  useEffect(() => {
    const nextMeta = SCENE_META[kind];
    setParamA(nextMeta.defaultA);
    setParamB(nextMeta.defaultB);
    onKindChange?.(kind);
  }, [kind, onKindChange]);

  // Subtle reactive animation when switching theory/step blocks
  useEffect(() => {
    if (kind === 'helix3d') {
      setParamA((30 + activeStep * 45) % 360);
    } else if (kind === 'cube3d') {
      setParamB(activeStep === 0 ? 0.1 : activeStep === 1 ? 0.85 : 1.35);
    } else if (kind === 'powers3d') {
      setParamB(Math.min(3, Math.max(1, activeStep + 1)));
    }
  }, [activeStep, kind]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const yawRef = useRef(0.68);
  const pitchRef = useRef(0.38);
  const zoomRef = useRef(1.08);
  const draggingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  const stateRef = useRef({ kind, paramA, paramB, autoRotate, activeStep });
  useEffect(() => {
    stateRef.current = { kind, paramA, paramB, autoRotate, activeStep };
  }, [kind, paramA, paramB, autoRotate, activeStep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const obs = new ResizeObserver(resize);
    obs.observe(canvas);
    resize();

    const drawSeg = (a: Vec3, b: Vec3, color: string, lineWidth = 1.3, glow = 0) => {
      const pa = projectPoint(a, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      const pb = projectPoint(b, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (glow > 0) {
        ctx.shadowColor = color;
        ctx.shadowBlur = glow;
      }
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawDot = (p: Vec3, r: number, color: string, glow = 12) => {
      const pp = projectPoint(p, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      ctx.beginPath();
      ctx.fillStyle = color;
      if (glow > 0) {
        ctx.shadowColor = color;
        ctx.shadowBlur = glow;
      }
      ctx.arc(pp.x, pp.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const drawText3D = (p: Vec3, text: string, color: string) => {
      const pp = projectPoint(p, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      ctx.font = '600 11px ui-monospace, monospace';
      ctx.fillStyle = color;
      ctx.fillText(text, pp.x + 4, pp.y - 4);
    };

    const renderFaces = (faces: Face3D[]) => {
      faces.sort((a, b) => b.depth - a.depth);
      for (const f of faces) {
        const p0 = projectPoint(f.pts[0], yawRef.current, pitchRef.current, zoomRef.current, width, height);
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        for (let i = 1; i < f.pts.length; i++) {
          const pi = projectPoint(f.pts[i], yawRef.current, pitchRef.current, zoomRef.current, width, height);
          ctx.lineTo(pi.x, pi.y);
        }
        ctx.closePath();
        ctx.fillStyle = f.fill;
        ctx.fill();
        ctx.strokeStyle = f.stroke;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };

    const render = () => {
      const time = (performance.now() - start) / 1000;
      const { kind: k, paramA: a, paramB: b, autoRotate: auto } = stateRef.current;
      const reduced =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('reduce-motion');

      if (auto && !draggingRef.current && !reduced) {
        yawRef.current += 0.0042;
      }

      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        10,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.72
      );
      bg.addColorStop(0, 'rgba(15, 38, 66, 0.72)');
      bg.addColorStop(0.55, 'rgba(5, 11, 22, 0.92)');
      bg.addColorStop(1, '#02050c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // Subtle base grid on y = -3.4
      const gy = -3.4;
      for (let i = -4; i <= 4; i++) {
        const alpha = i === 0 ? 0.26 : 0.08;
        drawSeg({ x: -4.5, y: gy, z: i }, { x: 4.5, y: gy, z: i }, `rgba(34,211,238,${alpha})`, 1);
        drawSeg({ x: i, y: gy, z: -4.5 }, { x: i, y: gy, z: 4.5 }, `rgba(34,211,238,${alpha})`, 1);
      }

      // 3D Axes
      drawSeg({ x: -4.2, y: 0, z: 0 }, { x: 4.4, y: 0, z: 0 }, 'rgba(34, 211, 238, 0.45)', 1.2);
      drawSeg({ x: 0, y: -3.4, z: 0 }, { x: 0, y: 3.8, z: 0 }, 'rgba(253, 224, 71, 0.45)', 1.2);
      drawSeg({ x: 0, y: 0, z: -4.2 }, { x: 0, y: 0, z: 4.4 }, 'rgba(167, 139, 250, 0.45)', 1.2);
      drawText3D({ x: 4.5, y: 0, z: 0 }, 'X', 'rgba(34,211,238,0.85)');
      drawText3D({ x: 0, y: 3.9, z: 0 }, 'Y', 'rgba(253,224,71,0.85)');
      drawText3D({ x: 0, y: 0, z: 4.5 }, 'Z', 'rgba(167,139,250,0.85)');

      if (k === 'cube3d') {
        // 3D Binomial Cube (a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3
        const sideA = a;
        const sideB = 1.1;
        const gap = b;
        const offset = -(sideA + sideB + gap) / 2;
        const faces: Face3D[] = [];

        const blocks: Array<{
          ix: number;
          iy: number;
          iz: number;
          sx: number;
          sy: number;
          sz: number;
          rgb: string;
        }> = [];

        const dims = [sideA, sideB];
        for (let ix = 0; ix < 2; ix++) {
          for (let iy = 0; iy < 2; iy++) {
            for (let iz = 0; iz < 2; iz++) {
              const countB = ix + iy + iz;
              const rgb =
                countB === 0
                  ? '34, 211, 238' // a^3 cyan
                  : countB === 1
                    ? '52, 211, 153' // 3a^2b emerald
                    : countB === 2
                      ? '167, 139, 250' // 3ab^2 violet
                      : '253, 224, 71'; // b^3 gold
              blocks.push({
                ix,
                iy,
                iz,
                sx: dims[ix],
                sy: dims[iy],
                sz: dims[iz],
                rgb
              });
            }
          }
        }

        for (const blk of blocks) {
          const cx = offset + (blk.ix === 0 ? sideA / 2 : sideA + gap + sideB / 2);
          const cy = offset + (blk.iy === 0 ? sideA / 2 : sideA + gap + sideB / 2);
          const cz = offset + (blk.iz === 0 ? sideA / 2 : sideA + gap + sideB / 2);
          pushBox(
            faces,
            cx,
            cy,
            cz,
            blk.sx,
            blk.sy,
            blk.sz,
            blk.rgb,
            yawRef.current,
            pitchRef.current,
            zoomRef.current,
            width,
            height
          );
        }
        renderFaces(faces);
      } else if (k === 'helix3d') {
        // 3D Trigonometric Helix: unit circle in XY + wave along Z
        const rad = (a * Math.PI) / 180;
        const turns = b;
        const R = 2.4;

        // Unit circle at z = -3.2
        const z0 = -3.2;
        for (let i = 0; i < 48; i++) {
          const t1 = (i / 48) * Math.PI * 2;
          const t2 = ((i + 1) / 48) * Math.PI * 2;
          drawSeg(
            { x: Math.cos(t1) * R, y: Math.sin(t1) * R, z: z0 },
            { x: Math.cos(t2) * R, y: Math.sin(t2) * R, z: z0 },
            'rgba(167, 139, 250, 0.5)',
            1.5
          );
        }

        // Right triangle on unit circle
        const px = Math.cos(rad) * R;
        const py = Math.sin(rad) * R;
        drawSeg({ x: 0, y: 0, z: z0 }, { x: px, y: py, z: z0 }, '#fde047', 2.4, 12);
        drawSeg({ x: 0, y: 0, z: z0 }, { x: px, y: 0, z: z0 }, '#22d3ee', 2.2);
        drawSeg({ x: px, y: 0, z: z0 }, { x: px, y: py, z: z0 }, '#fb7185', 2.2);
        drawDot({ x: px, y: py, z: z0 }, 4, '#fde047', 14);

        // 3D Helix + orthogonal projections
        const steps = 90;
        for (let i = 0; i < steps; i++) {
          const t1 = (i / steps) * turns * Math.PI * 2 + rad;
          const t2 = ((i + 1) / steps) * turns * Math.PI * 2 + rad;
          const z1 = z0 + (i / steps) * 6.8;
          const z2 = z0 + ((i + 1) / steps) * 6.8;
          drawSeg(
            { x: Math.cos(t1) * R, y: Math.sin(t1) * R, z: z1 },
            { x: Math.cos(t2) * R, y: Math.sin(t2) * R, z: z2 },
            'rgba(253, 224, 71, 0.85)',
            2.1,
            8
          );
          // sin wave on YZ plane
          drawSeg(
            { x: -3.6, y: Math.sin(t1) * R, z: z1 },
            { x: -3.6, y: Math.sin(t2) * R, z: z2 },
            'rgba(251, 113, 133, 0.65)',
            1.5
          );
          // cos wave on XZ plane
          drawSeg(
            { x: Math.cos(t1) * R, y: -3.2, z: z1 },
            { x: Math.cos(t2) * R, y: -3.2, z: z2 },
            'rgba(34, 211, 238, 0.65)',
            1.5
          );
        }
      } else if (k === 'powers3d') {
        // 3D Power Stack: a^1 (line), a^2 (square), a^3 (cube)
        const s = a;
        const exp = Math.round(b);
        const faces: Face3D[] = [];
        // a^1 bar
        pushBox(faces, -3.0, -2.5 + s / 2, 0, 0.35, s, 0.35, '34, 211, 238', yawRef.current, pitchRef.current, zoomRef.current, width, height);
        if (exp >= 2) {
          // a^2 plate
          pushBox(faces, -0.3, -2.5 + s / 2, 0, s, s, 0.3, '167, 139, 250', yawRef.current, pitchRef.current, zoomRef.current, width, height);
        }
        if (exp >= 3) {
          // a^3 cube
          pushBox(faces, 2.7, -2.5 + s / 2, 0, s, s, s, '253, 224, 71', yawRef.current, pitchRef.current, zoomRef.current, width, height);
        }
        renderFaces(faces);
        drawText3D({ x: -3.2, y: -2.8, z: 0.4 }, 'a¹', '#22d3ee');
        if (exp >= 2) drawText3D({ x: -0.5, y: -2.8, z: 0.4 }, 'a²', '#a78bfa');
        if (exp >= 3) drawText3D({ x: 2.5, y: -2.8, z: 1.5 }, 'a³', '#fde047');
      } else if (k === 'sets3d') {
        // Concentric rings for N ⊂ Z ⊂ Q ⊂ R + |x - c| <= r distance cone
        const rings = [
          { r: 0.9, y: -1.8, color: '#34d399', label: 'ℕ' },
          { r: 1.7, y: -1.2, color: '#22d3ee', label: 'ℤ' },
          { r: 2.5, y: -0.6, color: '#a78bfa', label: 'ℚ' },
          { r: 3.3, y: 0.0, color: '#fde047', label: 'ℝ' }
        ];
        for (const ring of rings) {
          for (let i = 0; i < 36; i++) {
            const t1 = (i / 36) * Math.PI * 2 + time * 0.2;
            const t2 = ((i + 1) / 36) * Math.PI * 2 + time * 0.2;
            drawSeg(
              { x: Math.cos(t1) * ring.r, y: ring.y, z: Math.sin(t1) * ring.r },
              { x: Math.cos(t2) * ring.r, y: ring.y, z: Math.sin(t2) * ring.r },
              ring.color,
              1.6
            );
          }
          drawText3D({ x: ring.r + 0.1, y: ring.y, z: 0 }, ring.label, ring.color);
        }
        // Absolute value V-cone: y = |x - a| with cut at y = b
        const leftX = a - b;
        const rightX = a + b;
        drawSeg({ x: -4, y: Math.abs(-4 - a) * 0.7 + 0.3, z: 0 }, { x: a, y: 0.3, z: 0 }, '#fb7185', 2.2, 10);
        drawSeg({ x: a, y: 0.3, z: 0 }, { x: 4, y: Math.abs(4 - a) * 0.7 + 0.3, z: 0 }, '#fb7185', 2.2, 10);
        drawSeg({ x: leftX, y: b * 0.7 + 0.3, z: 0 }, { x: rightX, y: b * 0.7 + 0.3, z: 0 }, '#34d399', 2.5, 14);
        drawDot({ x: leftX, y: b * 0.7 + 0.3, z: 0 }, 3.8, '#34d399');
        drawDot({ x: rightX, y: b * 0.7 + 0.3, z: 0 }, 3.8, '#34d399');
      } else if (k === 'parabola3d') {
        // 3D Parabola surface z-extruded: y = a*x^2 + b
        const coefA = Math.abs(a) < 0.08 ? 0.1 : a;
        const coefC = b;
        const segX = 24;
        for (let iz = -2; iz <= 2; iz++) {
          const z = iz * 0.8;
          for (let i = 0; i < segX; i++) {
            const x1 = -3.8 + (i / segX) * 7.6;
            const x2 = -3.8 + ((i + 1) / segX) * 7.6;
            const y1 = Math.max(-3.2, Math.min(3.5, coefA * x1 * x1 + coefC));
            const y2 = Math.max(-3.2, Math.min(3.5, coefA * x2 * x2 + coefC));
            const col = iz === 0 ? '#fde047' : 'rgba(34, 211, 238, 0.38)';
            drawSeg({ x: x1, y: y1, z }, { x: x2, y: y2, z }, col, iz === 0 ? 2.6 : 1.1, iz === 0 ? 10 : 0);
          }
        }
        // Highlight real roots where coefA * x^2 + coefC = 0
        const ratio = -coefC / coefA;
        if (ratio > 0.01) {
          const root = Math.sqrt(ratio);
          if (root <= 3.8) {
            drawDot({ x: root, y: 0, z: 0 }, 4.5, '#34d399', 16);
            drawDot({ x: -root, y: 0, z: 0 }, 4.5, '#34d399', 16);
            drawText3D({ x: root, y: 0.25, z: 0 }, `x₂=${root.toFixed(1)}`, '#34d399');
            drawText3D({ x: -root, y: 0.25, z: 0 }, `x₁=${(-root).toFixed(1)}`, '#34d399');
          }
        } else if (Math.abs(ratio) <= 0.01) {
          drawDot({ x: 0, y: 0, z: 0 }, 4.5, '#fde047', 16);
        }
      } else if (k === 'rational3d') {
        // Rational sign surface f(x) = (x - a)/(x - b) extruded in Z + vertical asymptote wall at x = b
        const root = a;
        const wall = b;
        // Asymptote wall
        const faces: Face3D[] = [
          {
            pts: [
              { x: wall, y: -3.2, z: -2.2 },
              { x: wall, y: 3.2, z: -2.2 },
              { x: wall, y: 3.2, z: 2.2 },
              { x: wall, y: -3.2, z: 2.2 }
            ],
            fill: 'rgba(251, 113, 133, 0.16)',
            stroke: 'rgba(251, 113, 133, 0.75)',
            depth: 0
          }
        ];
        renderFaces(faces);
        drawText3D({ x: wall, y: 3.3, z: 0 }, `x≠${wall.toFixed(1)}`, '#fb7185');
        for (let iz = -1; iz <= 1; iz++) {
          const z = iz * 1.1;
          for (let i = 0; i < 60; i++) {
            const x1 = -4 + (i / 60) * 8;
            const x2 = -4 + ((i + 1) / 60) * 8;
            if (Math.abs(x1 - wall) < 0.22 || Math.abs(x2 - wall) < 0.22) continue;
            const y1 = Math.max(-3.2, Math.min(3.2, (x1 - root) / (x1 - wall)));
            const y2 = Math.max(-3.2, Math.min(3.2, (x2 - root) / (x2 - wall)));
            const pos = y1 >= 0;
            drawSeg(
              { x: x1, y: y1, z },
              { x: x2, y: y2, z },
              pos ? 'rgba(52, 211, 153, 0.85)' : 'rgba(251, 146, 60, 0.85)',
              iz === 0 ? 2.4 : 1.2
            );
          }
        }
        drawDot({ x: root, y: 0, z: 0 }, 4.2, '#34d399', 14);
      } else if (k === 'planes3d') {
        // Two planes/lines in 3D: y = x + 0.5 vs y = a*x + b
        const faces: Face3D[] = [
          {
            pts: [
              { x: -3.5, y: -3.5 + 0.5, z: -2.0 },
              { x: 3.5, y: 3.5 + 0.5, z: -2.0 },
              { x: 3.5, y: 3.5 + 0.5, z: 2.0 },
              { x: -3.5, y: -3.5 + 0.5, z: 2.0 }
            ],
            fill: 'rgba(34, 211, 238, 0.18)',
            stroke: 'rgba(34, 211, 238, 0.8)',
            depth: 0
          },
          {
            pts: [
              { x: -3.5, y: a * -3.5 + b, z: -2.0 },
              { x: 3.5, y: a * 3.5 + b, z: -2.0 },
              { x: 3.5, y: a * 3.5 + b, z: 2.0 },
              { x: -3.5, y: a * -3.5 + b, z: 2.0 }
            ],
            fill: 'rgba(167, 139, 250, 0.18)',
            stroke: 'rgba(167, 139, 250, 0.8)',
            depth: 0
          }
        ];
        // Compute rough depth
        for (const f of faces) {
          f.depth =
            f.pts.reduce((s, p) => s + projectPoint(p, yawRef.current, pitchRef.current, zoomRef.current, width, height).depth, 0) / 4;
        }
        renderFaces(faces);
        if (Math.abs(a - 1) > 0.05) {
          const xi = (b - 0.5) / (1 - a);
          const yi = xi + 0.5;
          if (Math.abs(xi) <= 3.8 && Math.abs(yi) <= 3.8) {
            drawSeg({ x: xi, y: yi, z: -2.0 }, { x: xi, y: yi, z: 2.0 }, '#fde047', 2.8, 16);
            drawDot({ x: xi, y: yi, z: 0 }, 4.5, '#fde047', 16);
          }
        }
      } else {
        // wave3d
        const segs = 18;
        const range = 3.8;
        const grid: Vec3[][] = [];
        for (let i = 0; i <= segs; i++) {
          const row: Vec3[] = [];
          const x = -range + (i / segs) * range * 2;
          for (let j = 0; j <= segs; j++) {
            const z = -range + (j / segs) * range * 2;
            const r = Math.sqrt(x * x + z * z);
            const y = a * 1.8 * Math.sin(b * r * 1.6 - time * 1.4) * Math.exp(-r / 5.5);
            row.push({ x, y, z });
          }
          grid.push(row);
        }
        for (let i = 0; i <= segs; i++) {
          for (let j = 0; j <= segs; j++) {
            const p = grid[i][j];
            const t = Math.max(0, Math.min(1, (p.y + 2) / 4));
            const col = `hsla(${188 + t * 90}, 92%, ${52 + t * 14}%, ${0.2 + t * 0.45})`;
            if (i < segs) drawSeg(p, grid[i + 1][j], col, 1);
            if (j < segs) drawSeg(p, grid[i][j + 1], col, 1);
          }
        }
      }

      animId = window.requestAnimationFrame(render);
    };

    animId = window.requestAnimationFrame(render);

    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      lastRef.current = { x: e.clientX, y: e.clientY };
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current || !lastRef.current) return;
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      yawRef.current += dx * 0.008;
      pitchRef.current = Math.max(-1.25, Math.min(1.25, pitchRef.current + dy * 0.007));
      lastRef.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      draggingRef.current = false;
      lastRef.current = null;
      if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomRef.current = Math.max(0.6, Math.min(2.1, zoomRef.current - e.deltaY * 0.0012));
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(animId);
      obs.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <div className={`math3d-card ${compact ? 'compact' : ''} ${cinema ? 'cinema' : ''}`}>
      <div className="math3d-head">
        <div>
          <span className="eyebrow">Creación 3D en vivo</span>
          <h4>{meta.title}</h4>
          <p>{caption || meta.subtitle}</p>
        </div>
        <button
          type="button"
          className={`chip ${autoRotate ? 'active' : ''}`}
          onClick={() => setAutoRotate((v) => !v)}
          title={autoRotate ? 'Pausar rotación 3D' : 'Reanudar rotación 3D'}
        >
          <Icon name="laser" size={13} /> {autoRotate ? 'Auto 3D' : 'Pausado'}
        </button>
      </div>

      {allowSwitch ? (
        <div className="preset-row" style={{ marginBottom: 8 }}>
          {(Object.keys(SCENE_META) as Scene3DKind[]).map((k) => (
            <button
              key={k}
              type="button"
              className={`chip ${kind === k ? 'active' : ''}`}
              onClick={() => setKind(k)}
            >
              {SCENE_META[k].title.split(' ')[0]}
            </button>
          ))}
        </div>
      ) : null}

      <div className="math3d-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="math3d-canvas"
          aria-label={`Visualización 3D interactiva: ${meta.title}`}
        />
        <div className="canvas-hud">
          <span>arrastrar · rotar 3D</span>
          <span>rueda · zoom</span>
        </div>
      </div>

      {activeFormula ? (
        <div className="math3d-formula">
          <KaTeXInline math={activeFormula} />
        </div>
      ) : null}

      <div className="math3d-sliders">
        <label className="slider">
          <span className="slider-label">
            {meta.paramALabel} <strong style={{ color: '#22d3ee' }}>{paramA.toFixed(1)}</strong>
          </span>
          <input
            type="range"
            min={meta.minA}
            max={meta.maxA}
            step={meta.stepA}
            value={paramA}
            onChange={(e) => setParamA(Number(e.target.value))}
            style={{ accentColor: '#22d3ee' }}
          />
        </label>
        <label className="slider">
          <span className="slider-label">
            {meta.paramBLabel} <strong style={{ color: '#a78bfa' }}>{paramB.toFixed(1)}</strong>
          </span>
          <input
            type="range"
            min={meta.minB}
            max={meta.maxB}
            step={meta.stepB}
            value={paramB}
            onChange={(e) => setParamB(Number(e.target.value))}
            style={{ accentColor: '#a78bfa' }}
          />
        </label>
      </div>
    </div>
  );
}
