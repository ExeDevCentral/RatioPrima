import React, { useMemo, useState } from 'react';
import type { Lesson } from '../../data/types';
import Icon from '../ui/Icon';
import { FormulaCard } from '../ui/RichText';

const L = String.raw;
const W = 760;
const H = 430;
const PAD = 52;
const X_MIN = -7;
const X_MAX = 7;
const Y_MIN = -9;
const Y_MAX = 12;

function sx(x: number): number {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - 2 * PAD);
}

function sy(y: number): number {
  return H - PAD - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * (H - 2 * PAD);
}

function fmt(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value - Math.round(value)) < 0.001) return `${Math.round(value)}`;
  return value.toFixed(2).replace('.', ',');
}

export default function ParabolaLab({ lesson }: { lesson: Lesson }) {
  const config = lesson.labConfig ?? {};
  const [a, setA] = useState<number>(typeof config.a === 'number' ? Math.max(0.1, config.a) : 1);
  const [b, setB] = useState<number>(typeof config.b === 'number' ? config.b : -2);
  const [c, setC] = useState<number>(typeof config.c === 'number' ? config.c : -3);
  const [showRoots, setShowRoots] = useState<boolean>(true);

  const safeA = Math.abs(a) < 0.1 ? (a < 0 ? -0.1 : 0.1) : a;
  const disc = b * b - 4 * safeA * c;
  const vertexX = -b / (2 * safeA);
  const vertexY = safeA * vertexX * vertexX + b * vertexX + c;

  const roots = useMemo(() => {
    if (disc < 0) return [] as number[];
    if (Math.abs(disc) < 1e-9) return [-b / (2 * safeA)];
    const root = Math.sqrt(disc);
    return [(-b - root) / (2 * safeA), (-b + root) / (2 * safeA)].sort((p, q) => p - q);
  }, [disc, b, safeA]);

  const path = useMemo(() => {
    const commands: string[] = [];
    for (let index = 0; index <= 220; index++) {
      const x = X_MIN + (index / 220) * (X_MAX - X_MIN);
      const y = safeA * x * x + b * x + c;
      if (y < Y_MIN - 4 || y > Y_MAX + 4) {
        commands.push('');
        continue;
      }
      commands.push(`${index === 0 ? 'M' : 'L'} ${sx(x).toFixed(1)} ${sy(y).toFixed(1)}`);
    }
    return commands.filter(Boolean).join(' ');
  }, [safeA, b, c]);

  const yIntercept = c;

  return (
    <div className="lab">
      <div className="lab-head">
        <div>
          <span className="lab-kicker">Laboratorio 04 · Cuadráticas</span>
          <h3>Parábola y discriminante</h3>
          <p>Mové los coeficientes y observá cómo nacen, se juntan o desaparecen las raíces.</p>
        </div>
        <div className="lab-badge">
          <Icon name="chart" size={16} /> {roots.length} raíz{roots.length === 1 ? '' : 'es'} real{roots.length === 1 ? '' : 'es'}
        </div>
      </div>

      <div className="lab-stage">
        <svg viewBox={`0 0 ${W} ${H}`} className="lab-svg" role="img" aria-label="Parábola interactiva">
          <defs>
            <linearGradient id="parabola-stroke" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="55%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>
            <filter id="parabola-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width={W} height={H} fill="#030711" />
          {Array.from({ length: 15 }, (_, index) => X_MIN + index).map((tick) => (
            <line key={`v-${tick}`} x1={sx(tick)} y1={PAD} x2={sx(tick)} y2={H - PAD} stroke="#0b1622" />
          ))}
          {Array.from({ length: 22 }, (_, index) => Y_MIN + index).map((tick) => (
            <line key={`h-${tick}`} x1={PAD} y1={sy(tick)} x2={W - PAD} y2={sy(tick)} stroke="#0b1622" />
          ))}
          <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="#475569" strokeWidth="1.5" />
          <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke="#475569" strokeWidth="1.5" />

          {Array.from({ length: 15 }, (_, index) => X_MIN + index).filter((tick) => tick % 1 === 0 && tick !== 0).map((tick) => (
            <g key={`xt-${tick}`}>
              <line x1={sx(tick)} y1={sy(0) - 5} x2={sx(tick)} y2={sy(0) + 5} stroke="#64748b" />
              <text x={sx(tick)} y={sy(0) + 18} textAnchor="middle" fill="#64748b" fontSize="10">{tick}</text>
            </g>
          ))}

          <path d={path} fill="none" stroke="url(#parabola-stroke)" strokeWidth="3" filter="url(#parabola-glow)" className="draw-path" />

          <line x1={sx(vertexX)} y1={PAD} x2={sx(vertexX)} y2={H - PAD} stroke="#fde047" strokeWidth="1" strokeDasharray="4 5" opacity="0.5" />
          <circle cx={sx(vertexX)} cy={sy(vertexY)} r="5" fill="#fde047" filter="url(#parabola-glow)" />
          <text x={sx(vertexX) + 10} y={sy(vertexY) - 10} fill="#fde047" fontSize="11">
            vértice ({fmt(vertexX)}; {fmt(vertexY)})
          </text>

          <circle cx={sx(0)} cy={sy(yIntercept)} r="4" fill="#fb7185" />
          <text x={sx(0) + 8} y={sy(yIntercept) - 8} fill="#fb7185" fontSize="11">c = {fmt(c)}</text>

          {showRoots
            ? roots.map((root, index) => (
                <g key={`root-${index}`}>
                  <circle cx={sx(root)} cy={sy(0)} r="9" fill="rgba(253,224,71,0.18)" />
                  <circle cx={sx(root)} cy={sy(0)} r="5" fill="#fde047" filter="url(#parabola-glow)" />
                  <text x={sx(root)} y={sy(0) - 16} textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="700">
                    x{index + 1} = {fmt(root)}
                  </text>
                </g>
              ))
            : null}

          <text x={W - PAD} y={PAD + 14} textAnchor="end" fill="#475569" fontSize="11">
            f(x) = {fmt(safeA)}x² {b >= 0 ? '+' : '−'} {fmt(Math.abs(b))}x {c >= 0 ? '+' : '−'} {fmt(Math.abs(c))}
          </text>
        </svg>
      </div>

      <div className="lab-controls">
        <label className="slider">
          <span className="slider-label">a <strong style={{ color: '#22d3ee' }}>{a}</strong></span>
          <input type="range" min="-3" max="3" step="0.1" value={a} onChange={(event) => setA(Number(event.target.value))} style={{ accentColor: '#22d3ee' }} />
        </label>
        <label className="slider">
          <span className="slider-label">b <strong style={{ color: '#a78bfa' }}>{b}</strong></span>
          <input type="range" min="-8" max="8" step="0.5" value={b} onChange={(event) => setB(Number(event.target.value))} style={{ accentColor: '#a78bfa' }} />
        </label>
        <label className="slider">
          <span className="slider-label">c <strong style={{ color: '#fde047' }}>{c}</strong></span>
          <input type="range" min="-9" max="9" step="0.5" value={c} onChange={(event) => setC(Number(event.target.value))} style={{ accentColor: '#fde047' }} />
        </label>
        <label className="switch-row">
          <input type="checkbox" checked={showRoots} onChange={(event) => setShowRoots(event.target.checked)} />
          mostrar raíces
        </label>
      </div>

      <div className="lab-readout">
        <div className="trig-grid">
          <div><span>discriminante Δ</span><strong style={{ color: disc >= 0 ? '#34d399' : '#fb7185' }}>{fmt(disc)}</strong></div>
          <div><span>raíces reales</span><strong>{roots.length}</strong></div>
          <div><span>vértice</span><strong>({fmt(vertexX)}; {fmt(vertexY)})</strong></div>
          <div><span>eje de simetría</span><strong>x = {fmt(vertexX)}</strong></div>
        </div>

        <FormulaCard
          formula={
            roots.length === 2
              ? L`f(x)=${fmt(safeA)}(x-(${fmt(roots[0])}))(x-(${fmt(roots[1])}))`
              : roots.length === 1
                ? L`f(x)=${fmt(safeA)}(x-(${fmt(roots[0])}))^2`
                : L`\Delta<0\Rightarrow\text{sin raíces reales}`
          }
          label="forma factorizada"
        />

        <div className="lab-note">
          {disc > 0
            ? 'Δ > 0: la parábola corta el eje x en dos puntos distintos.'
            : disc === 0
              ? 'Δ = 0: la parábola toca el eje x en un único punto (raíz doble).'
              : 'Δ < 0: la parábola no corta el eje x; no hay raíces reales.'}
        </div>
      </div>

      <div className="lab-footnote">
        <Icon name="bulb" size={15} />
        <span>El discriminante no es un adorno: decide la naturaleza de las raíces antes de calcularlas.</span>
      </div>
    </div>
  );
}
