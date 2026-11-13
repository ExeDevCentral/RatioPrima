import React, { useMemo, useState } from 'react';
import type { Lesson } from '../../data/types';
import Icon from '../ui/Icon';
import { FormulaCard } from '../ui/RichText';

const L = String.raw;
const W = 760;
const H = 440;
const PAD = 48;
const MIN = -10;
const MAX = 10;

function sx(x: number): number {
  return PAD + ((x - MIN) / (MAX - MIN)) * (W - 2 * PAD);
}

function sy(y: number): number {
  return H - PAD - ((y - MIN) / (MAX - MIN)) * (H - 2 * PAD);
}

function fmt(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value - Math.round(value)) < 0.001) return `${Math.round(value)}`;
  return value.toFixed(2).replace('.', ',');
}

function linePath(m: number, b: number): string {
  const x1 = MIN;
  const y1 = m * x1 + b;
  const x2 = MAX;
  const y2 = m * x2 + b;
  return `M ${sx(x1)} ${sy(y1)} L ${sx(x2)} ${sy(y2)}`;
}

export default function SystemsLab({ lesson }: { lesson: Lesson }) {
  const config = lesson.labConfig ?? {};
  const [m1, setM1] = useState<number>(typeof config.m1 === 'number' ? config.m1 : 2);
  const [b1, setB1] = useState<number>(typeof config.b1 === 'number' ? config.b1 : 0);
  const [m2, setM2] = useState<number>(typeof config.m2 === 'number' ? config.m2 : -1);
  const [b2, setB2] = useState<number>(typeof config.b2 === 'number' ? config.b2 : 3);

  const parallel = Math.abs(m1 - m2) < 1e-9;
  const coincident = parallel && Math.abs(b1 - b2) < 1e-9;
  const intersection = parallel ? null : { x: (b2 - b1) / (m1 - m2), y: 0 };
  if (intersection) intersection.y = m1 * intersection.x + b1;

  const path1 = useMemo(() => linePath(m1, b1), [m1, b1]);
  const path2 = useMemo(() => linePath(m2, b2), [m2, b2]);

  const classification = coincident
    ? 'Compatible indeterminado: infinitas soluciones.'
    : parallel
      ? 'Incompatible: no hay solución.'
      : 'Compatible determinado: una única solución.';

  return (
    <div className="lab">
      <div className="lab-head">
        <div>
          <span className="lab-kicker">Laboratorio 06 · Sistemas</span>
          <h3>Dos rectas, un destino</h3>
          <p>Cambiá pendientes y ordenadas. Observá cuándo se cruzan, cuándo coinciden y cuándo nunca se encuentran.</p>
        </div>
        <div className="lab-badge">
          <Icon name="nexus" size={16} /> {coincident ? 'infinitas' : parallel ? 'sin solución' : 'única'}
        </div>
      </div>

      <div className="lab-stage">
        <svg viewBox={`0 0 ${W} ${H}`} className="lab-svg" role="img" aria-label="Sistema de dos rectas">
          <defs>
            <filter id="sys-glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="sys-l1" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id="sys-l2" x1="0" x2="1">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>

          <rect width={W} height={H} fill="#030711" />
          {Array.from({ length: 21 }, (_, index) => MIN + index).map((tick) => (
            <g key={`grid-${tick}`}>
              <line x1={sx(tick)} y1={PAD} x2={sx(tick)} y2={H - PAD} stroke="#0b1622" />
              <line x1={PAD} y1={sy(tick)} x2={W - PAD} y2={sy(tick)} stroke="#0b1622" />
            </g>
          ))}
          <line x1={PAD} y1={sy(0)} x2={W - PAD} y2={sy(0)} stroke="#475569" strokeWidth="1.5" />
          <line x1={sx(0)} y1={PAD} x2={sx(0)} y2={H - PAD} stroke="#475569" strokeWidth="1.5" />

          <path d={path1} fill="none" stroke="url(#sys-l1)" strokeWidth="3" filter="url(#sys-glow)" />
          <path d={path2} fill="none" stroke="url(#sys-l2)" strokeWidth="3" filter="url(#sys-glow)" />

          <path d={path1} fill="none" stroke="#e0f2fe" strokeWidth="2" strokeDasharray="2 26" className="flow-line" opacity="0.7" />
          <path d={path2} fill="none" stroke="#f5f3ff" strokeWidth="2" strokeDasharray="2 30" className="flow-line-reverse" opacity="0.7" />

          {intersection ? (
            <g>
              <circle cx={sx(intersection.x)} cy={sy(intersection.y)} r="12" fill="rgba(253,224,71,0.14)" />
              <circle cx={sx(intersection.x)} cy={sy(intersection.y)} r="6" fill="#fde047" filter="url(#sys-glow)" />
              <text x={sx(intersection.x) + 12} y={sy(intersection.y) - 12} fill="#fde047" fontSize="12" fontWeight="700">
                ({fmt(intersection.x)}; {fmt(intersection.y)})
              </text>
            </g>
          ) : null}

          <text x={W - PAD} y={PAD + 14} textAnchor="end" fill="#22d3ee" fontSize="11">
            y = {fmt(m1)}x {b1 >= 0 ? '+' : '−'} {fmt(Math.abs(b1))}
          </text>
          <text x={W - PAD} y={PAD + 32} textAnchor="end" fill="#a78bfa" fontSize="11">
            y = {fmt(m2)}x {b2 >= 0 ? '+' : '−'} {fmt(Math.abs(b2))}
          </text>
          <text x={PAD} y={H - 12} fill="#475569" fontSize="11">eje x</text>
          <text x={PAD} y={PAD - 10} fill="#475569" fontSize="11">eje y</text>
        </svg>
      </div>

      <div className="lab-controls">
        <label className="slider">
          <span className="slider-label">pendiente m₁ <strong style={{ color: '#22d3ee' }}>{m1}</strong></span>
          <input type="range" min="-5" max="5" step="0.5" value={m1} onChange={(event) => setM1(Number(event.target.value))} style={{ accentColor: '#22d3ee' }} />
        </label>
        <label className="slider">
          <span className="slider-label">ordenada b₁ <strong style={{ color: '#22d3ee' }}>{b1}</strong></span>
          <input type="range" min="-10" max="10" step="0.5" value={b1} onChange={(event) => setB1(Number(event.target.value))} style={{ accentColor: '#22d3ee' }} />
        </label>
        <label className="slider">
          <span className="slider-label">pendiente m₂ <strong style={{ color: '#a78bfa' }}>{m2}</strong></span>
          <input type="range" min="-5" max="5" step="0.5" value={m2} onChange={(event) => setM2(Number(event.target.value))} style={{ accentColor: '#a78bfa' }} />
        </label>
        <label className="slider">
          <span className="slider-label">ordenada b₂ <strong style={{ color: '#a78bfa' }}>{b2}</strong></span>
          <input type="range" min="-10" max="10" step="0.5" value={b2} onChange={(event) => setB2(Number(event.target.value))} style={{ accentColor: '#a78bfa' }} />
        </label>
      </div>

      <div className="lab-readout">
        <div className="balance-status">{classification}</div>
        {intersection ? (
          <FormulaCard formula={L`S=\{(${fmt(intersection.x)};\ ${fmt(intersection.y)})\}`} label="conjunto solución" />
        ) : (
          <FormulaCard formula={coincident ? L`S=\{(x;y)\mid y=${fmt(m1)}x+${fmt(b1)}\}` : L`S=\varnothing`} label="conjunto solución" />
        )}
        <div className="lab-note">
          {parallel
            ? 'Misma pendiente: las rectas son paralelas. Si además comparten ordenada, son la misma recta.'
            : `La solución es el punto donde ambas rectas se cruzan. Verificá reemplazando en las dos ecuaciones.`}
        </div>
      </div>

      <div className="lab-footnote">
        <Icon name="bulb" size={15} />
        <span>Resolver un sistema es encontrar los puntos que pertenecen a todas las ecuaciones a la vez.</span>
      </div>
    </div>
  );
}
