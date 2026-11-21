import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { Lesson } from '../../data/types';
import { KaTeXInline } from '../KaTeXView';
import Icon from '../ui/Icon';
import {
  clamp,
  easeOutCubic,
  lerpVec3,
  projectPoint,
  unprojectToPlaneZ0,
  type Vec3
} from '../../lib/geometry3d';
import {
  SCENE_BUILD_STEPS,
  SCENE_META,
  sceneBuildStepForLesson,
  sceneForLesson,
  type Scene3DKind
} from './scene3dConfig';

export { SCENE_BUILD_STEPS, SCENE_META, sceneBuildStepForLesson, sceneForLesson };
export type { Scene3DKind };

interface Face3D {
  pts: Vec3[];
  fill: string;
  stroke: string;
  depth: number;
}

/** Geometría compartida entre el render y el panel de datos en vivo. */
export const RT_RADIUS = 3.4;
export const RT_OX = 0;
export const RT_OY = 0;

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

const RT_PRESETS = [
  { label: '30°', value: 30 },
  { label: '45°', value: 45 },
  { label: '60°', value: 60 },
  { label: '3-4-5', value: 36.87 }
];

const fmt3 = (value: number) => value.toFixed(3).replace('.', ',');
const texNum = (value: number) => value.toFixed(3).replace('.', '{,}');

/**
 * Panel de datos en vivo del triángulo rectángulo.
 * Muestra las razones como longitudes (barras) además de los cocientes, para
 * que el alumno vea *por qué* sen y cos siempre quedan entre 0 y 1.
 */
function RightTriangleReadout({
  angle,
  scale,
  activeStep,
  compact,
  onPreset
}: {
  angle: number;
  scale: number;
  activeStep: number;
  compact: boolean;
  onPreset: (degrees: number) => void;
}) {
  const deg = clamp(angle, 2, 89);
  const rad = (deg * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const tan = Math.tan(rad);
  const H = scale;
  const CA = scale * cos;
  const CO = scale * sin;
  const activeKey = ['h', 'cat', 'sincos', 'tan'][Math.min(3, Math.max(0, activeStep))] ?? 'h';
  const identity = `${texNum(CA * CA)}+${texNum(CO * CO)}=${texNum(H * H)}`;

  // Valores exactos en los ángulos notables (y el triángulo 3-4-5).
  const exactLine =
    Math.abs(deg - 30) < 0.4
      ? '\\text{exacto: }\\ \\operatorname{sen}\\alpha=\\tfrac12,\\ \\cos\\alpha=\\tfrac{\\sqrt3}{2},\\ \\tan\\alpha=\\tfrac{\\sqrt3}{3}'
      : Math.abs(deg - 45) < 0.4
        ? '\\text{exacto: }\\ \\operatorname{sen}\\alpha=\\tfrac{\\sqrt2}{2},\\ \\cos\\alpha=\\tfrac{\\sqrt2}{2},\\ \\tan\\alpha=1'
        : Math.abs(deg - 60) < 0.4
          ? '\\text{exacto: }\\ \\operatorname{sen}\\alpha=\\tfrac{\\sqrt3}{2},\\ \\cos\\alpha=\\tfrac12,\\ \\tan\\alpha=\\sqrt3'
          : null;
  const near345 = Math.abs(sin - 0.6) < 0.008 && Math.abs(cos - 0.8) < 0.008;

  const rows = [
    { key: 'sin', label: 'sen α', value: sin, color: '#fb7185', ratio: sin },
    { key: 'cos', label: 'cos α', value: cos, color: '#22d3ee', ratio: cos },
    { key: 'tan', label: 'tan α', value: tan, color: '#fb923c', ratio: Math.min(1, tan / 3) }
  ];

  return (
    <section className={`rt-readout ${compact ? 'compact' : ''}`} aria-label="Lectura trigonométrica en vivo">
      <div className="rt-readout-head">
        <span className="eyebrow">Lectura en vivo</span>
        <span className="rt-angle">
          α = {deg.toFixed(1)}° · {fmt3(rad)} rad · β = {(90 - deg).toFixed(1)}°
        </span>
      </div>

      {exactLine ? (
        <div className="rt-exact">
          <KaTeXInline math={exactLine} />
        </div>
      ) : near345 ? (
        <div className="rt-exact">
          ≈ triángulo 3-4-5:{' '}
          <KaTeXInline
            math={
              '\\operatorname{sen}\\alpha=\\tfrac35,\\ \\cos\\alpha=\\tfrac45,\\ \\tan\\alpha=\\tfrac34'
            }
          />
        </div>
      ) : null}

      <div className={`rt-formula ${activeKey === 'sincos' ? 'is-active' : ''}`}>
        <KaTeXInline
          math={`\\textcolor{#fb7185}{\\operatorname{sen}\\alpha}=\\dfrac{\\textcolor{#fb7185}{CO}}{\\textcolor{#fde047}{H}}=\\dfrac{${texNum(
            CO
          )}}{${texNum(H)}}=${texNum(sin)}`}
        />
      </div>

      <div className="rt-bars">
        {rows.map((row) => (
          <div
            key={row.key}
            className={`rt-bar-row ${
              activeKey === (row.key === 'tan' ? 'tan' : 'sincos') ? 'is-active' : ''
            }`}
          >
            <span style={{ color: row.color }}>{row.label}</span>
            <span className="rt-bar-track">
              <span
                className="rt-bar-fill"
                style={{ width: `${Math.max(0, Math.min(1, row.ratio)) * 100}%`, background: row.color, color: row.color }}
              />
            </span>
            <strong>{row.value > 9.99 ? '→ ∞' : fmt3(row.value)}</strong>
          </div>
        ))}
      </div>

      {compact ? (
        <div className="rt-check">
          CA² + CO² = H² · {fmt3(CA * CA)} + {fmt3(CO * CO)} = {fmt3(H * H)}
        </div>
      ) : (
        <>
          <div className={`rt-formula ${activeKey === 'sincos' ? 'is-active' : ''}`}>
            <KaTeXInline
              math={`\\cos\\alpha=\\dfrac{\\textcolor{#22d3ee}{CA}}{\\textcolor{#fde047}{H}}=${texNum(
                cos
              )}\\qquad\\tan\\alpha=\\dfrac{\\textcolor{#fb7185}{CO}}{\\textcolor{#22d3ee}{CA}}=${texNum(tan)}`}
            />
          </div>
          <div className={`rt-formula rt-identity ${activeKey === 'tan' ? 'is-active' : ''}`}>
            <KaTeXInline
              math={`\\textcolor{#22d3ee}{CA}^2+\\textcolor{#fb7185}{CO}^2=\\textcolor{#fde047}{H}^2\\;\\Rightarrow\\;${identity}`}
            />
          </div>
          {Math.abs(scale - 1) > 0.05 ? (
            <div className="rt-check">
              El triángulo fantasma es la misma forma con k = 1: las razones no cambian.
            </div>
          ) : null}
          <div className="rt-presets">
            <span>Valores notables:</span>
            {RT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={`chip ${Math.abs(deg - preset.value) < 0.3 ? 'active' : ''}`}
                onClick={() => onPreset(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function Math3DScene({
  lesson,
  activeStep = 0,
  activeFormula,
  caption,
  allowSwitch = false,
  compact = false,
  cinema = false,
  onKindChange,
  guided = false
}: {
  lesson: Lesson;
  activeStep?: number;
  activeFormula?: string;
  caption?: string;
  allowSwitch?: boolean;
  compact?: boolean;
  cinema?: boolean;
  onKindChange?: (kind: Scene3DKind) => void;
  guided?: boolean;
}) {
  const defaultKind = useMemo(() => sceneForLesson(lesson), [lesson]);
  const [kind, setKind] = useState<Scene3DKind>(defaultKind);
  const meta = SCENE_META[kind];

  const [paramA, setParamA] = useState<number>(meta.defaultA);
  const [paramB, setParamB] = useState<number>(meta.defaultB);
  const [autoRotate, setAutoRotate] = useState<boolean>(!guided);
  const buildSteps = SCENE_BUILD_STEPS[kind];
  const sceneStep = sceneBuildStepForLesson(lesson, activeStep);
  const [buildStep, setBuildStep] = useState<number>(guided ? sceneStep : 0);
  const [autoBuild, setAutoBuild] = useState<boolean>(!guided);

  useEffect(() => {
    setKind(defaultKind);
  }, [defaultKind]);

  useEffect(() => {
    const nextMeta = SCENE_META[kind];
    setParamA(nextMeta.defaultA);
    setParamB(nextMeta.defaultB);
    setBuildStep(0);
    setAutoBuild(true);
    onKindChange?.(kind);
  }, [kind, onKindChange]);

  useEffect(() => {
    if (!guided) return;
    setAutoRotate(false);
    setAutoBuild(false);
    if (buildSteps?.length) {
      setBuildStep(Math.min(buildSteps.length - 1, Math.max(0, sceneStep)));
    }
  }, [activeStep, buildSteps, guided, sceneStep]);

  // Avanza paso a paso automáticamente para enseñar anillo por anillo / pieza por pieza
  useEffect(() => {
    if (guided || !autoBuild || !buildSteps || buildSteps.length <= 1) return;
    const timer = window.setInterval(() => {
      setBuildStep((prev) => (prev + 1) % buildSteps.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [autoBuild, buildSteps]);

  // Subtle reactive animation when switching theory/step blocks
  useEffect(() => {
    if (kind === 'helix3d') {
      setParamA((30 + activeStep * 45) % 360);
    } else if (kind === 'cube3d') {
      setParamB(activeStep === 0 ? 0.1 : activeStep === 1 ? 0.85 : 1.35);
    } else if (kind === 'powers3d') {
      setParamB(Math.min(3, Math.max(1, activeStep + 1)));
    } else if (kind === 'righttriangle3d') {
      // Ángulos notables alineados con los pasos de teoría: 37° (3-4-5), 45°, 60°, 30°.
      const notable = [37, 45, 60, 30];
      setParamA(notable[Math.min(notable.length - 1, Math.max(0, activeStep))] ?? 37);
    }
  }, [activeStep, kind]);

  // Accesibilidad: si el usuario pidió menos movimiento, no auto-rotamos ni
  // auto-construimos. Puede activarlo a mano con los chips.
  useEffect(() => {
    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('reduce-motion');
    if (prefersReduced) {
      setAutoRotate(false);
      setAutoBuild(false);
    }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const yawRef = useRef(0.68);
  const pitchRef = useRef(0.38);
  const zoomRef = useRef(1.08);
  const draggingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const handleDragRef = useRef(false);
  const manualZoomRef = useRef(false);
  const fitZoomRef = useRef(2.4);
  const visibleRef = useRef(true);
  const sizeRef = useRef({ width: 0, height: 0 });
  const stepStartRef = useRef<number>(typeof performance !== 'undefined' ? performance.now() : 0);

  useEffect(() => {
    stepStartRef.current = typeof performance !== 'undefined' ? performance.now() : 0;
  }, [buildStep, kind]);

  // Encuadre inicial amplio y nítido: las figuras llenan el canvas desde el primer frame.
  useEffect(() => {
    if (kind === 'righttriangle3d') {
      yawRef.current = 0.5;
      pitchRef.current = 0.24;
      zoomRef.current = 2.45;
    } else if (kind === 'sets3d') {
      yawRef.current = 0.42;
      pitchRef.current = 0.34;
      zoomRef.current = 1.62;
    } else {
      zoomRef.current = 1.48;
    }
    manualZoomRef.current = false;
  }, [kind]);

  const stateRef = useRef({ kind, paramA, paramB, autoRotate, activeStep, buildStep });
  useEffect(() => {
    stateRef.current = { kind, paramA, paramB, autoRotate, activeStep, buildStep };
  }, [kind, paramA, paramB, autoRotate, activeStep, buildStep]);

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
      sizeRef.current = { width, height };
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Encuadre automático del círculo unitario: el triángulo y las guías
      // tienen que entrar completos en cualquier tamaño de tarjeta. Muestreamos
      // el círculo real con la misma proyección (incluida la perspectiva) y
      // calculamos el zoom que deja margen para las etiquetas.
      let maxDx = 1;
      let maxDy = 1;
      for (const yaw of [0.28, 0.5, 0.72]) {
        for (let i = 0; i < 90; i += 1) {
          const t = (i / 90) * Math.PI * 2;
          const p = projectPoint(
            { x: Math.cos(t) * RT_RADIUS, y: Math.sin(t) * RT_RADIUS, z: 0 },
            yaw,
            0.27,
            1,
            width,
            height
          );
          maxDx = Math.max(maxDx, Math.abs(p.x - width / 2));
          maxDy = Math.max(maxDy, Math.abs(p.y - height / 2));
        }
      }
      const margin = 0.86;
      const zoomFit = Math.min((margin * width) / 2 / maxDx, (margin * height) / 2 / maxDy);
      fitZoomRef.current = Math.max(0.8, Math.min(3.2, zoomFit));
    };

    const obs = new ResizeObserver(resize);
    obs.observe(canvas);
    resize();

    // Pausa el dibujo cuando la tarjeta está fuera de pantalla (varias
    // escenas conviven en el workbench y no queremos gastar batería).
    const visObs =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              visibleRef.current = entries.some((entry) => entry.isIntersecting);
            },
            { threshold: 0.01 }
          )
        : null;
    visObs?.observe(canvas);

    const drawSeg = (
      a: Vec3,
      b: Vec3,
      color: string,
      lineWidth = 1.3,
      glow = 0,
      dash: number[] | null = null
    ) => {
      const pa = projectPoint(a, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      const pb = projectPoint(b, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (glow > 0) {
        ctx.shadowColor = color;
        ctx.shadowBlur = glow;
      }
      ctx.setLineDash(dash ?? []);
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
      ctx.setLineDash([]);
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

    /** Etiqueta con fondo para que los nombres de los lados no se pierdan. */
    const drawTag3D = (
      p: Vec3,
      text: string,
      color: string,
      dx = 0,
      dy = 0,
      fontSize = 12
    ) => {
      const pp = projectPoint(p, yawRef.current, pitchRef.current, zoomRef.current, width, height);
      ctx.save();
      ctx.font = `700 ${fontSize}px ui-monospace, monospace`;
      const w = ctx.measureText(text).width + 16;
      const h = fontSize + 10;
      const x = pp.x + dx - w / 2;
      const y = pp.y + dy - h / 2;
      ctx.fillStyle = 'rgba(3, 8, 18, 0.9)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x + w / 2, y + h / 2);
      ctx.restore();
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
      if (!visibleRef.current) {
        animId = window.requestAnimationFrame(render);
        return;
      }
      const stepProgress = easeOutCubic(
        Math.min(1, (performance.now() - stepStartRef.current) / 1350)
      );
      const { kind: k, paramA: a, paramB: b, autoRotate: auto, buildStep: bStep } = stateRef.current;
      const reduced =
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('reduce-motion');

      if (auto && !draggingRef.current && !handleDragRef.current && !reduced) {
        if (k === 'righttriangle3d') {
          // Balanceo suave y pausado: nunca perdemos de vista el plano.
          yawRef.current = 0.5 + Math.sin(time * 0.26) * 0.18;
          pitchRef.current = 0.24 + Math.sin(time * 0.2) * 0.04;
        } else {
          yawRef.current += 0.0018;
        }
      }

      // Encuadre automático de la escena estrella (salvo que el usuario haga zoom).
      if (k === 'righttriangle3d' && !manualZoomRef.current && !pinchRef.current) {
        zoomRef.current = fitZoomRef.current;
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

      if (k === 'righttriangle3d') {
        // ── Triángulo rectángulo interactivo ────────────────────────────
        // O = vértice del ángulo α · A = ángulo recto · B = extremo de H
        const deg = clamp(a, 2, 89);
        const rad = (deg * Math.PI) / 180;
        const kScale = clamp(b, 0.4, 1.6);
        const UNIT = RT_RADIUS; // círculo unitario de referencia (k = 1), siempre fijo
        const H = UNIT * kScale; // hipotenusa escalada por k
        const CA = H * Math.cos(rad);
        const CO = H * Math.sin(rad);
        const O: Vec3 = { x: RT_OX, y: RT_OY, z: 0 };
        const A: Vec3 = { x: RT_OX + CA, y: RT_OY, z: 0 };
        const B: Vec3 = { x: RT_OX + CA, y: RT_OY + CO, z: 0 };
        const prismDepth = 0.26;
        const atAngle = (radius: number, angle: number, z = 0): Vec3 => ({
          x: O.x + Math.cos(angle) * radius,
          y: O.y + Math.sin(angle) * radius,
          z
        });

        // ── Círculo unitario de referencia ─────────────────────────────
        // Siempre visible (tenue) y se ilumina en el paso 3. Al quedar fijo,
        // las proporciones no cambian al mover la escala k: el fantasma k = 1
        // se compara contra este mismo círculo.
        const circleGrow = bStep >= 2 ? (bStep === 2 ? stepProgress : 1) : 1;
        const circleColor = bStep >= 2 ? 'rgba(167, 139, 250, 0.5)' : 'rgba(167, 139, 250, 0.18)';
        const circleSegs = 108;
        const visibleSegs = Math.max(2, Math.round(circleSegs * circleGrow));
        for (let i = 0; i < visibleSegs; i += 1) {
          const t1 = (i / circleSegs) * Math.PI * 2;
          const t2 = ((i + 1) / circleSegs) * Math.PI * 2;
          drawSeg(atAngle(UNIT, t1), atAngle(UNIT, t2), circleColor, bStep >= 2 ? 1.8 : 1.1);
        }

        // ── Guías punteadas: ejes que dividen el círculo ───────────────
        // Diámetro horizontal = 0° / 180° (la "mitad" del círculo).
        // Diámetro vertical = 90° / 270°. Juntos marcan los 4 cuadrantes.
        const guide = 'rgba(148, 163, 184, 0.5)';
        drawSeg(
          { x: O.x - UNIT, y: O.y, z: 0 },
          { x: O.x + UNIT, y: O.y, z: 0 },
          guide,
          1.2,
          0,
          [5, 6]
        );
        drawSeg(
          { x: O.x, y: O.y - UNIT, z: 0 },
          { x: O.x, y: O.y + UNIT, z: 0 },
          guide,
          1.2,
          0,
          [5, 6]
        );

        // Marcas cada 30° sobre el borde (más largas en los cuartos).
        for (let d = 0; d < 360; d += 30) {
          const t = (d * Math.PI) / 180;
          const major = d % 90 === 0;
          drawSeg(
            atAngle(UNIT - (major ? 0.34 : 0.18), t),
            atAngle(UNIT, t),
            major ? 'rgba(226, 232, 240, 0.62)' : 'rgba(148, 163, 184, 0.4)',
            major ? 1.6 : 1.1
          );
        }

        // Etiquetas de los cuartos, dentro del círculo para que nunca se corten.
        drawTag3D(atAngle(UNIT * 0.9, -0.22), '0°', 'rgba(226, 232, 240, 0.85)', 0, 0, 11);
        drawTag3D(
          atAngle(UNIT * 0.5, 1.75),
          '90° = π/2',
          'rgba(226, 232, 240, 0.85)',
          0,
          0,
          11
        );
        drawTag3D(
          atAngle(UNIT * 0.78, Math.PI),
          '180° = π',
          'rgba(226, 232, 240, 0.85)',
          0,
          0,
          11
        );
        drawTag3D(
          atAngle(UNIT * 0.78, (3 * Math.PI) / 2),
          '270°',
          'rgba(226, 232, 240, 0.85)',
          0,
          0,
          11
        );

        // Prisma (extrusión): le da volumen al triángulo sin perder la lectura 2D.
        const front: Vec3[] = [
          { ...O, z: prismDepth },
          { ...A, z: prismDepth },
          { ...B, z: prismDepth }
        ];
        const back: Vec3[] = [
          { ...O, z: -prismDepth },
          { ...A, z: -prismDepth },
          { ...B, z: -prismDepth }
        ];
        const faces: Face3D[] = [
          {
            pts: back,
            fill: 'rgba(167, 139, 250, 0.07)',
            stroke: 'rgba(167, 139, 250, 0.26)',
            depth: 0
          }
        ];
        for (let i = 0; i < 3; i += 1) {
          const j = (i + 1) % 3;
          faces.push({
            pts: [front[i], front[j], back[j], back[i]],
            fill: 'rgba(34, 211, 238, 0.06)',
            stroke: 'rgba(34, 211, 238, 0.2)',
            depth: 0
          });
        }
        faces.push({
          pts: front,
          fill: 'rgba(34, 211, 238, 0.13)',
          stroke: 'rgba(34, 211, 238, 0.5)',
          depth: 0
        });
        for (const face of faces) {
          face.depth =
            face.pts.reduce(
              (sum, p) =>
                sum +
                projectPoint(p, yawRef.current, pitchRef.current, zoomRef.current, width, height)
                  .depth,
              0
            ) / face.pts.length;
        }
        renderFaces(faces);
        for (let i = 0; i < 3; i += 1) {
          drawSeg(front[i], back[i], 'rgba(148, 163, 184, 0.24)', 1.1);
        }

        // Paso 1: hipotenusa (se dibuja, no aparece de golpe).
        const growH = bStep === 0 ? stepProgress : 1;
        drawSeg(O, lerpVec3(O, B, growH), '#fde047', 5, 18);
        if (growH > 0.55) {
          // Etiqueta hacia afuera del triángulo (normal exterior).
          drawTag3D(
            {
              x: O.x + CA * 0.5 - Math.sin(rad) * 0.66,
              y: O.y + CO * 0.5 + Math.cos(rad) * 0.66,
              z: 0
            },
            'H',
            '#fde047',
            0,
            -6,
            14
          );
        }

        // Arco del ángulo α.
        const arcR = Math.min(1.05, UNIT * 0.3);
        const arcSweep = (bStep === 0 ? stepProgress : 1) * rad;
        const arcSegs = 32;
        for (let i = 0; i < arcSegs; i += 1) {
          const t1 = (i / arcSegs) * arcSweep;
          const t2 = ((i + 1) / arcSegs) * arcSweep;
          drawSeg(atAngle(arcR, t1), atAngle(arcR, t2), '#a78bfa', 3, 8);
        }

        // Paso 2: catetos. CA crece desde O y CO desde A.
        if (bStep >= 1) {
          const growCat = bStep === 1 ? stepProgress : 1;
          drawSeg(O, lerpVec3(O, A, growCat), '#22d3ee', 4.2, 14);
          drawSeg(A, lerpVec3(A, B, growCat), '#fb7185', 4.2, 14);
          if (growCat > 0.6) {
            drawTag3D({ x: O.x + CA * 0.5, y: O.y - 0.46, z: 0 }, 'CA', '#22d3ee', 0, 0, 14);
            drawTag3D(
              { x: O.x + CA + 0.46, y: O.y + CO * 0.5, z: 0 },
              'CO',
              '#fb7185',
              0,
              0,
              14
            );
          }
          // Cuadradito del ángulo recto en A.
          const ra = 0.26;
          drawSeg(
            { x: A.x - ra, y: A.y, z: 0 },
            { x: A.x - ra, y: A.y + ra, z: 0 },
            'rgba(226, 232, 240, 0.95)',
            1.8
          );
          drawSeg(
            { x: A.x - ra, y: A.y + ra, z: 0 },
            { x: A.x, y: A.y + ra, z: 0 },
            'rgba(226, 232, 240, 0.95)',
            1.8
          );
        }

        // Paso 3: arco recorrido + proyecciones cos/sen.
        if (bStep >= 2) {
          const sweep = rad * (bStep === 2 ? stepProgress : 1);
          const hiSegs = 36;
          for (let i = 0; i < hiSegs; i += 1) {
            const t1 = (i / hiSegs) * sweep;
            const t2 = ((i + 1) / hiSegs) * sweep;
            drawSeg(
              atAngle(UNIT, t1),
              atAngle(UNIT, t2),
              'rgba(253, 224, 71, 0.95)',
              3.4,
              12
            );
          }
          // Sombra horizontal (CA) y vertical (CO) de B.
          drawSeg({ x: O.x, y: B.y, z: 0 }, B, 'rgba(34, 211, 238, 0.5)', 1.4, 0, [4, 4]);
          drawSeg({ x: B.x, y: O.y, z: 0 }, B, 'rgba(251, 113, 133, 0.5)', 1.4, 0, [4, 4]);
        }

        // ── 1 radián: el arco que mide exactamente un radio ────────────
        // 1 rad ≈ 57,3°: radio punteado + arco violeta del mismo largo que H.
        if (bStep >= 2) {
          const grow1 = bStep === 2 ? stepProgress : 1;
          const sweep1 = Math.min(1, grow1);
          const radSegs = 30;
          for (let i = 0; i < radSegs; i += 1) {
            const t1 = (i / radSegs) * sweep1;
            const t2 = ((i + 1) / radSegs) * sweep1;
            drawSeg(atAngle(UNIT, t1), atAngle(UNIT, t2), 'rgba(196, 181, 253, 0.95)', 3.6, 12);
          }
          const P1 = atAngle(UNIT, 1);
          drawSeg(O, P1, 'rgba(196, 181, 253, 0.85)', 1.8, 6, [4, 5]);
          drawDot(P1, 3.8, '#c4b5fd', 10);
          if (grow1 > 0.5) {
            drawTag3D(atAngle(UNIT * 0.78, 1.08), '1 rad ≈ 57,3°', '#c4b5fd', 16, -16, 11);
          }
        }

        // Paso 4: tangente como longitud real sobre el borde del círculo.
        if (bStep >= 3) {
          const growTan = stepProgress;
          const tanVal = Math.tan(rad);
          const T0: Vec3 = { x: O.x + UNIT, y: O.y, z: 0 };
          const maxTop = O.y + UNIT * 1.05;
          const rawTop = O.y + UNIT * tanVal;
          const clipped = rawTop > maxTop;
          const topY = Math.min(rawTop, maxTop);
          const tip = lerpVec3(T0, { x: T0.x, y: topY, z: 0 }, growTan);
          drawSeg(T0, tip, '#fb923c', 3.6, 16);
          // Escuadra en la base de la tangente.
          const tr = 0.18;
          drawSeg(
            { x: T0.x - tr, y: T0.y, z: 0 },
            { x: T0.x - tr, y: T0.y + tr, z: 0 },
            'rgba(251, 146, 60, 0.85)',
            1.2
          );
          drawSeg(
            { x: T0.x - tr, y: T0.y + tr, z: 0 },
            { x: T0.x, y: T0.y + tr, z: 0 },
            'rgba(251, 146, 60, 0.85)',
            1.2
          );
          // Cuando se va al infinito, flechita hacia arriba + valor real.
          if (clipped) {
            drawSeg(
              { x: T0.x - 0.14, y: topY - 0.2, z: 0 },
              { x: T0.x, y: topY, z: 0 },
              '#fb923c',
              2.4
            );
            drawSeg(
              { x: T0.x + 0.14, y: topY - 0.2, z: 0 },
              { x: T0.x, y: topY, z: 0 },
              '#fb923c',
              2.4
            );
          }
          if (growTan > 0.5) {
            const text = clipped
              ? `tan α = ${tanVal.toFixed(2).replace('.', ',')} ↑`
              : 'tan α';
            drawTag3D({ x: T0.x, y: (T0.y + topY) / 2, z: 0 }, text, '#fb923c', -34, 0, 12);
          }
        }

        // Fantasma a escala k = 1 (misma forma, otro tamaño).
        if (Math.abs(kScale - 1) > 0.02) {
          const A1: Vec3 = { x: O.x + UNIT * Math.cos(rad), y: O.y, z: 0 };
          const B1: Vec3 = {
            x: O.x + UNIT * Math.cos(rad),
            y: O.y + UNIT * Math.sin(rad),
            z: 0
          };
          const ghost = 'rgba(226, 232, 240, 0.4)';
          drawSeg(O, A1, ghost, 1.4, 0, [4, 4]);
          drawSeg(A1, B1, ghost, 1.4, 0, [4, 4]);
          drawSeg(O, B1, ghost, 1.6, 0, [6, 5]);
          drawTag3D(lerpVec3(O, B1, 0.52), 'k = 1', 'rgba(226, 232, 240, 0.85)', 0, 22, 11);
        }

        // Etiqueta de α al final: siempre visible, por encima de todo.
        drawTag3D(
          atAngle(arcR + 0.5, rad / 2),
          `α = ${deg.toFixed(1)}°`,
          '#a78bfa',
          0,
          -4,
          13
        );

        // Handle arrastrable: el punto B sobre el círculo.
        const handleScreen = projectPoint(
          B,
          yawRef.current,
          pitchRef.current,
          zoomRef.current,
          width,
          height
        );
        ctx.save();
        ctx.beginPath();
        ctx.arc(handleScreen.x, handleScreen.y, 15 + Math.sin(time * 3) * 1.6, 0, Math.PI * 2);
        ctx.strokeStyle = handleDragRef.current ? '#ffffff' : 'rgba(253, 224, 71, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        drawDot(B, 7.5, '#fde047', 26);
        // Núcleo blanco: affordance de "esto se arrastra" y punto de referencia.
        drawDot(B, 3, '#ffffff', 0);
      } else if (k === 'cube3d') {
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
              if (countB > bStep) continue; // Construir pieza por pieza!
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
        if (bStep >= 1) {
          drawSeg({ x: 0, y: 0, z: z0 }, { x: px, y: py, z: z0 }, '#fde047', 2.4, 12);
          drawSeg({ x: 0, y: 0, z: z0 }, { x: px, y: 0, z: z0 }, '#22d3ee', 2.2);
          drawSeg({ x: px, y: 0, z: z0 }, { x: px, y: py, z: z0 }, '#fb7185', 2.2);
          drawDot({ x: px, y: py, z: z0 }, 4, '#fde047', 14);
        }

        // 3D Helix + orthogonal projections
        if (bStep >= 2) {
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
            if (bStep >= 3) {
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
          }
        }
      } else if (k === 'powers3d') {
        // 3D Power Stack: a^1 (line), a^2 (square), a^3 (cube)
        const s = a;
        const exp = Math.max(Math.round(b), bStep + 1);
        const faces: Face3D[] = [];
        // a^1 bar
        pushBox(faces, -3.0, -2.5 + s / 2, 0, 0.35, s, 0.35, '34, 211, 238', yawRef.current, pitchRef.current, zoomRef.current, width, height);
        if (bStep >= 1 && exp >= 2) {
          // a^2 plate
          pushBox(faces, -0.3, -2.5 + s / 2, 0, s, s, 0.3, '167, 139, 250', yawRef.current, pitchRef.current, zoomRef.current, width, height);
        }
        if (bStep >= 2 && exp >= 3) {
          // a^3 cube
          pushBox(faces, 2.7, -2.5 + s / 2, 0, s, s, s, '253, 224, 71', yawRef.current, pitchRef.current, zoomRef.current, width, height);
        }
        renderFaces(faces);
        drawText3D({ x: -3.2, y: -2.8, z: 0.4 }, 'a¹', '#22d3ee');
        if (bStep >= 1 && exp >= 2) drawText3D({ x: -0.5, y: -2.8, z: 0.4 }, 'a²', '#a78bfa');
        if (bStep >= 2 && exp >= 3) drawText3D({ x: 2.5, y: -2.8, z: 1.5 }, 'a³', '#fde047');
      } else if (k === 'sets3d') {
        // Concentric rings built RING BY RING (bStep 0..3) — spaced clearly with non-overlapping pills
        const rings = [
          { r: 1.05, y: -2.05, color: '#34d399', label: 'ℕ (Contar)', side: -1, dx: -14, dy: 14 },
          { r: 1.9, y: -1.1, color: '#22d3ee', label: 'ℤ (Negativos)', side: 1, dx: 14, dy: 8 },
          { r: 2.75, y: -0.15, color: '#a78bfa', label: 'ℚ (Fracciones)', side: -1, dx: -14, dy: -6 },
          { r: 3.55, y: 0.8, color: '#fde047', label: 'ℝ (Todos)', side: 1, dx: 14, dy: -12 }
        ];
        const visibleCount = Math.min(rings.length, bStep + 1);
        for (let idx = 0; idx < visibleCount; idx++) {
          const ring = rings[idx];
          const isCurrent = idx === visibleCount - 1;
          const grow = isCurrent ? stepProgress : 1;
          const segs = 48;
          const drawSegs = Math.max(2, Math.round(segs * grow));
          for (let i = 0; i < drawSegs; i++) {
            const t1 = (i / segs) * Math.PI * 2 + time * 0.1;
            const t2 = ((i + 1) / segs) * Math.PI * 2 + time * 0.1;
            drawSeg(
              { x: Math.cos(t1) * ring.r, y: ring.y, z: Math.sin(t1) * ring.r },
              { x: Math.cos(t2) * ring.r, y: ring.y, z: Math.sin(t2) * ring.r },
              ring.color,
              isCurrent ? 3.8 : 2.1,
              isCurrent ? 16 : 4
            );
          }
          if (grow > 0.35) {
            drawTag3D(
              { x: ring.side * (ring.r + 0.18), y: ring.y, z: 0 },
              ring.label,
              ring.color,
              ring.dx,
              ring.dy,
              12
            );
          }
        }
        // Absolute value V-cone appears on step 4 (bStep >= 3)
        if (bStep >= 3) {
          const leftX = a - b;
          const rightX = a + b;
          drawSeg({ x: -4, y: Math.abs(-4 - a) * 0.7 + 0.3, z: 0 }, { x: a, y: 0.3, z: 0 }, '#fb7185', 2.2, 10);
          drawSeg({ x: a, y: 0.3, z: 0 }, { x: 4, y: Math.abs(4 - a) * 0.7 + 0.3, z: 0 }, '#fb7185', 2.2, 10);
          drawSeg({ x: leftX, y: b * 0.7 + 0.3, z: 0 }, { x: rightX, y: b * 0.7 + 0.3, z: 0 }, '#34d399', 2.5, 14);
          drawDot({ x: leftX, y: b * 0.7 + 0.3, z: 0 }, 3.8, '#34d399');
          drawDot({ x: rightX, y: b * 0.7 + 0.3, z: 0 }, 3.8, '#34d399');
        }
      } else if (k === 'parabola3d') {
        // A line on the floor gives the 3D surface an unambiguous x-axis.
        drawSeg({ x: -4.2, y: 0, z: 0 }, { x: 4.2, y: 0, z: 0 }, 'rgba(226,232,240,0.55)', 1.5);
        drawText3D({ x: 3.9, y: 0.16, z: 0 }, 'eje x', '#e2e8f0');
        const coefficients =
          lesson.worldId === 'ecuaciones' && lesson.id === 'ecuaciones-cuadraticas'
            ? { a: 1, b: -5, c: 6 }
            : { a: Math.abs(a) < 0.08 ? 0.1 : a, b: 0, c: b };
        const { a: coefA, b: coefB, c: coefC } = coefficients;
        const segX = 48;
        for (let iz = -2; iz <= 2; iz++) {
          const z = iz * 0.8;
          for (let i = 0; i < segX; i++) {
            const x1 = -3.8 + (i / segX) * 7.6;
            const x2 = -3.8 + ((i + 1) / segX) * 7.6;
            const y1 = Math.max(-3.2, Math.min(3.5, coefA * x1 * x1 + coefB * x1 + coefC));
            const y2 = Math.max(-3.2, Math.min(3.5, coefA * x2 * x2 + coefB * x2 + coefC));
            const col = iz === 0 ? '#fde047' : 'rgba(34, 211, 238, 0.38)';
            drawSeg({ x: x1, y: y1, z }, { x: x2, y: y2, z }, col, iz === 0 ? 2.6 : 1.1, iz === 0 ? 10 : 0);
          }
        }
        // Intersections with y=0 use the complete quadratic equation ax²+bx+c=0.
        const discriminant = coefB * coefB - 4 * coefA * coefC;
        if (discriminant > 0) {
          const root = Math.sqrt(discriminant);
          const x1 = (-coefB - root) / (2 * coefA);
          const x2 = (-coefB + root) / (2 * coefA);
          if (Math.abs(x1) <= 3.8) {
            drawDot({ x: x1, y: 0, z: 0 }, 4.8, '#34d399', 16);
            drawText3D({ x: x1, y: 0.28, z: 0 }, `x₁=${x1.toFixed(1)}`, '#34d399');
          }
          if (Math.abs(x2) <= 3.8) {
            drawDot({ x: x2, y: 0, z: 0 }, 4.8, '#34d399', 16);
            drawText3D({ x: x2, y: 0.28, z: 0 }, `x₂=${x2.toFixed(1)}`, '#34d399');
          }
        } else if (Math.abs(discriminant) <= 0.01) {
          const root = -coefB / (2 * coefA);
          if (Math.abs(root) <= 3.8) {
            drawDot({ x: root, y: 0, z: 0 }, 4.8, '#fde047', 16);
            drawText3D({ x: root, y: 0.28, z: 0 }, `x=${root.toFixed(1)}`, '#fde047');
          }
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

    const handleScreenPos = () => {
      const s = stateRef.current;
      if (s.kind !== 'righttriangle3d') return null;
      const deg = clamp(s.paramA, 2, 89);
      const rad = (deg * Math.PI) / 180;
      const H = RT_RADIUS * Math.max(0.2, s.paramB);
      const B = {
        x: RT_OX + H * Math.cos(rad),
        y: RT_OY + H * Math.sin(rad),
        z: 0
      };
      return projectPoint(B, yawRef.current, pitchRef.current, zoomRef.current, width, height);
    };

    const onDown = (e: PointerEvent) => {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size >= 2) {
        const pts = Array.from(pointersRef.current.values());
        pinchRef.current = {
          dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y),
          zoom: zoomRef.current
        };
        draggingRef.current = false;
        handleDragRef.current = false;
        lastRef.current = null;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const handle = handleScreenPos();
      if (
        handle &&
        Math.hypot(e.clientX - rect.left - handle.x, e.clientY - rect.top - handle.y) < 42
      ) {
        // Agarró el vértice B: ahora se mueve el ángulo, no la cámara.
        handleDragRef.current = true;
        lastRef.current = null;
        setAutoBuild(false);
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          /* puntero sintético o ya liberado */
        }
        return;
      }

      draggingRef.current = true;
      lastRef.current = { x: e.clientX, y: e.clientY };
      // Si el usuario toma el control de la cámara, dejamos de moverla solos.
      setAutoRotate(false);
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* puntero sintético o ya liberado */
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!pointersRef.current.has(e.pointerId)) {
        const handle = handleScreenPos();
        if (handle) {
          const rect = canvas.getBoundingClientRect();
          const near =
            Math.hypot(e.clientX - rect.left - handle.x, e.clientY - rect.top - handle.y) < 42;
          canvas.style.cursor = near ? 'pointer' : 'grab';
        }
        return;
      }

      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      // Dos dedos: pinch zoom (mobile).
      if (pointersRef.current.size >= 2) {
        const pts = Array.from(pointersRef.current.values());
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (pinchRef.current && pinchRef.current.dist > 0) {
          manualZoomRef.current = true;
          zoomRef.current = clamp(
            pinchRef.current.zoom * (dist / pinchRef.current.dist),
            0.55,
            2.9
          );
        }
        return;
      }

      const rect = canvas.getBoundingClientRect();

      // Arrastre del ángulo: se resuelve el punto del plano z = 0 señalado.
      if (handleDragRef.current) {
        const world = unprojectToPlaneZ0(
          e.clientX - rect.left,
          e.clientY - rect.top,
          yawRef.current,
          pitchRef.current,
          zoomRef.current,
          width,
          height
        );
        if (world) {
          const localX = world.x - RT_OX;
          const localY = world.y - RT_OY;
          if (Math.hypot(localX, localY) > 0.12) {
            const deg = clamp((Math.atan2(localY, localX) * 180) / Math.PI, 2, 89);
            setParamA(Math.round(deg * 2) / 2);
          }
        }
        return;
      }

      if (!draggingRef.current || !lastRef.current) return;
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      yawRef.current += dx * 0.008;
      pitchRef.current = Math.max(-1.25, Math.min(1.25, pitchRef.current + dy * 0.007));
      lastRef.current = { x: e.clientX, y: e.clientY };
    };

    const onUp = (e: PointerEvent) => {
      pointersRef.current.delete(e.pointerId);
      if (pointersRef.current.size < 2) pinchRef.current = null;
      if (pointersRef.current.size === 0) {
        handleDragRef.current = false;
        draggingRef.current = false;
        lastRef.current = null;
      }
      try {
        if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* el puntero ya no está capturado */
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      manualZoomRef.current = true;
      zoomRef.current = Math.max(0.55, Math.min(2.9, zoomRef.current - e.deltaY * 0.0012));
    };

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(animId);
      obs.disconnect();
      visObs?.disconnect();
      pointersRef.current.clear();
      pinchRef.current = null;
      handleDragRef.current = false;
      canvas.style.cursor = '';
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <div
      className={`math3d-card ${compact ? 'compact' : ''} ${cinema ? 'cinema' : ''} ${
        kind === 'righttriangle3d' ? 'rt-mode' : ''
      }`}
    >
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
          <span>
            {kind === 'righttriangle3d'
              ? 'arrastrá el punto dorado · cambiar α'
              : 'arrastrar · rotar 3D'}
          </span>
          <span>{kind === 'righttriangle3d' ? 'fondo · rotar · pinza/rueda · zoom' : 'rueda · zoom'}</span>
        </div>
      </div>

      {kind === 'righttriangle3d' ? (
        <RightTriangleReadout
          angle={paramA}
          scale={paramB}
          activeStep={buildStep}
          compact={compact}
          onPreset={(degrees) => {
            setParamA(degrees);
            setAutoBuild(false);
          }}
        />
      ) : null}

      {buildSteps && buildSteps.length > 0 && !guided ? (
        <div className="math3d-build-box">
          <div className="math3d-build-head">
            <strong>{buildSteps[buildStep]?.title}</strong>
            <div className="preset-row">
              <button
                type="button"
                className={`chip ${autoBuild ? 'active' : ''}`}
                onClick={() => setAutoBuild((v) => !v)}
              >
                {autoBuild ? '⏸ Pausar pasos' : '▶ Animar paso a paso'}
              </button>
              <button
                type="button"
                className="chip"
                onClick={() => {
                  setBuildStep(0);
                  setAutoBuild(true);
                }}
                title="Reiniciar la construcción desde la primera pieza"
              >
                ↻
              </button>
              {buildSteps.map((st, idx) => (
                <button
                  key={st.title}
                  type="button"
                  className={`chip ${buildStep === idx ? 'active' : ''}`}
                  onClick={() => {
                    setAutoBuild(false);
                    setBuildStep(idx);
                  }}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </div>
          <p>{buildSteps[buildStep]?.kidText}</p>
        </div>
      ) : null}

      {meta.legend ? (
        <div className="math3d-legend">
          <Icon name="eye" size={14} />
          <span>{meta.legend}</span>
        </div>
      ) : null}

      {activeFormula && kind !== 'righttriangle3d' ? (
        <div className="math3d-formula">
          <KaTeXInline math={activeFormula} />
        </div>
      ) : null}

      {!guided ? <div className="math3d-sliders">
        <label className="slider">
          <span className="slider-label">
            {meta.paramALabel}{' '}
            <strong style={{ color: '#22d3ee' }}>
              {kind === 'righttriangle3d' ? `${paramA.toFixed(1)}°` : paramA.toFixed(1)}
            </strong>
          </span>
          <input
            type="range"
            min={meta.minA}
            max={meta.maxA}
            step={meta.stepA}
            value={paramA}
            onPointerDown={() => setAutoBuild(false)}
            onChange={(e) => setParamA(Number(e.target.value))}
            style={{ accentColor: '#22d3ee' }}
          />
        </label>
        <label className="slider">
          <span className="slider-label">
            {meta.paramBLabel}{' '}
            <strong style={{ color: '#a78bfa' }}>
              {kind === 'righttriangle3d' ? `k = ${paramB.toFixed(2)}` : paramB.toFixed(1)}
            </strong>
          </span>
          <input
            type="range"
            min={meta.minB}
            max={meta.maxB}
            step={meta.stepB}
            value={paramB}
            onPointerDown={() => setAutoBuild(false)}
            onChange={(e) => setParamB(Number(e.target.value))}
            style={{ accentColor: '#a78bfa' }}
          />
        </label>
      </div> : null}
    </div>
  );
}
