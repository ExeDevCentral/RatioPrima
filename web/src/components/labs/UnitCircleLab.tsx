import React, { useEffect, useMemo, useState } from 'react';
import type { Lesson } from '../../data/types';
import Icon from '../ui/Icon';
import { FormulaCard } from '../ui/RichText';

const L = String.raw;
const CX = 235;
const CY = 210;
const R = 150;

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function piLabel(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  if (Math.abs(normalized) < 0.001) return '0';
  let numerator = Math.round(normalized);
  let denominator = 180;
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  if (denominator === 1) return numerator === 1 ? 'π' : `${numerator}π`;
  return `${numerator}π/${denominator}`;
}

function fmt(value: number, digits = 3): string {
  return value.toFixed(digits).replace('.', ',').replace('-0,000', '0,000');
}

export default function UnitCircleLab({ lesson }: { lesson: Lesson }) {
  const config = lesson.labConfig ?? {};
  const initialAngle = typeof config.angle === 'number' ? config.angle : 30;
  const mode = typeof config.mode === 'string' ? config.mode : 'degrees';

  const [angle, setAngle] = useState<number>(initialAngle);
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setAngle((current) => (current + 1) % 360);
    }, 30);
    return () => window.clearInterval(timer);
  }, [playing]);

  const radians = (angle * Math.PI) / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const tan = Math.abs(cos) < 0.0001 ? null : Math.tan(radians);
  const px = CX + R * cos;
  const py = CY - R * sin;

  const sinePath = useMemo(() => {
    const points: string[] = [];
    for (let degree = 0; degree <= 360; degree += 2) {
      const value = Math.sin((degree * Math.PI) / 180);
      const x = 440 + (degree / 360) * 290;
      const y = CY - value * 100;
      points.push(`${degree === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  }, []);

  const cosinePath = useMemo(() => {
    const points: string[] = [];
    for (let degree = 0; degree <= 360; degree += 2) {
      const value = Math.cos((degree * Math.PI) / 180);
      const x = 440 + (degree / 360) * 290;
      const y = CY - value * 100;
      points.push(`${degree === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return points.join(' ');
  }, []);

  return (
    <div className="lab">
      <div className="lab-head">
        <div>
          <span className="lab-kicker">Laboratorio 03 · Trigonometría</span>
          <h3>Círculo unitario y ondas</h3>
          <p>Girá el radio láser y mirá cómo nacen el seno y el coseno.</p>
        </div>
        <div className="lab-badge">
          <Icon name="compass" size={16} /> {mode === 'triangle' ? 'triángulo' : mode === 'identity' ? 'identidad' : 'radianes'}
        </div>
      </div>

      <div className="lab-stage">
        <svg viewBox="0 0 760 420" className="lab-svg" role="img" aria-label="Círculo unitario interactivo">
          <defs>
            <radialGradient id="uc-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="uc-laser" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <filter id="uc-blur">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="760" height="420" fill="#030711" />
          <circle cx={CX} cy={CY} r={R + 55} fill="url(#uc-glow)" />

          <line x1={CX - R - 40} y1={CY} x2={CX + R + 40} y2={CY} stroke="#1e293b" />
          <line x1={CX} y1={CY - R - 40} x2={CX} y2={CY + R + 40} stroke="#1e293b" />
          <circle cx={CX} cy={CY} r={R} fill="rgba(34,211,238,0.02)" stroke="#334155" strokeWidth="1.5" />

          {[-1, -0.5, 0.5, 1].map((tick) => (
            <g key={tick}>
              <line x1={CX + R * tick} y1={CY - 4} x2={CX + R * tick} y2={CY + 4} stroke="#475569" />
              <line x1={CX - 4} y1={CY - R * tick} x2={CX + 4} y2={CY - R * tick} stroke="#475569" />
            </g>
          ))}

          {[0, 90, 180, 270].map((degree) => {
            const rad = (degree * Math.PI) / 180;
            const tx = CX + (R + 28) * Math.cos(rad);
            const ty = CY - (R + 28) * Math.sin(rad);
            return (
              <text key={degree} x={tx} y={ty + 4} textAnchor="middle" fill="#64748b" fontSize="11">
                {degree}°
              </text>
            );
          })}

          <line
            x1={CX}
            y1={CY}
            x2={px}
            y2={py}
            stroke="url(#uc-laser)"
            strokeWidth="3"
            filter="url(#uc-blur)"
            className="laser-beam"
          />
          <circle cx={CX} cy={CY} r="5" fill="#e2e8f0" />
          <circle cx={px} cy={py} r="8" fill="#a78bfa" opacity="0.3" />
          <circle cx={px} cy={py} r="5" fill="#f0abfc" stroke="#fff" strokeWidth="1" filter="url(#uc-blur)" />

          <line x1={px} y1={CY} x2={px} y2={py} stroke="#fb7185" strokeWidth="2" strokeDasharray="4 3" />
          <line x1={CX} y1={py} x2={px} y2={py} stroke="#22d3ee" strokeWidth="2" strokeDasharray="4 3" />

          {mode === 'triangle' ? (
            <>
              <polygon points={`${CX},${CY} ${px},${CY} ${px},${py}`} fill="rgba(34,211,238,0.1)" stroke="#22d3ee" strokeWidth="1.5" />
              <text x={(CX + px) / 2} y={CY + 18} textAnchor="middle" fill="#22d3ee" fontSize="11">CA</text>
              <text x={px + 14} y={(CY + py) / 2} fill="#fb7185" fontSize="11">CO</text>
              <text x={(CX + px) / 2 - 12} y={(CY + py) / 2} fill="#a78bfa" fontSize="11">H</text>
            </>
          ) : null}

          <text x={px + 12} y={py - 10} fill="#f0abfc" fontSize="12" fontWeight="700">
            ({fmt(cos, 2)}; {fmt(sin, 2)})
          </text>

          <line x1={430} y1={CY} x2={748} y2={CY} stroke="#1e293b" />
          <text x={440} y={CY - 118} fill="#22d3ee" fontSize="11">onda del seno</text>
          <path d={sinePath} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeOpacity="0.45" />
          <path d={cosinePath} fill="none" stroke="#fb7185" strokeWidth="1.2" strokeOpacity="0.25" strokeDasharray="3 4" />
          <line x1={440} y1={CY - 100} x2={730} y2={CY - 100} stroke="#0f2b3a" strokeDasharray="3 5" />
          <line x1={440} y1={CY + 100} x2={730} y2={CY + 100} stroke="#0f2b3a" strokeDasharray="3 5" />
          <line
            x1={440 + (angle / 360) * 290}
            y1={CY - 110}
            x2={440 + (angle / 360) * 290}
            y2={CY + 110}
            stroke="#fde047"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <circle cx={440 + (angle / 360) * 290} cy={CY - sin * 100} r="5" fill="#22d3ee" filter="url(#uc-blur)" />
          <circle cx={440 + (angle / 360) * 290} cy={CY - cos * 100} r="4" fill="#fb7185" />
          <text x={590} y={CY + 134} textAnchor="middle" fill="#475569" fontSize="11">
            ángulo (0° → 360°)
          </text>

          <g className="orbit-dot">
            <circle cx={CX + R} cy={CY} r="3" fill="#22d3ee" />
          </g>
        </svg>
      </div>

      <div className="lab-controls">
        <label className="slider slider-wide">
          <span className="slider-label">ángulo <strong style={{ color: '#a78bfa' }}>{angle}° = {piLabel(angle)}</strong></span>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={angle}
            onChange={(event) => setAngle(Number(event.target.value))}
            style={{ accentColor: '#a78bfa' }}
          />
        </label>
        <div className="preset-row">
          <button className={`chip ${playing ? 'active' : ''}`} onClick={() => setPlaying(!playing)}>
            {playing ? '⏸ Pausar' : '▶ Animar'}
          </button>
          {[0, 30, 45, 60, 90, 180].map((preset) => (
            <button key={preset} className="chip" onClick={() => { setAngle(preset); setPlaying(false); }}>
              {preset}°
            </button>
          ))}
        </div>
      </div>

      <div className="lab-readout">
        <div className="trig-grid">
          <div><span>sen α</span><strong style={{ color: '#fb7185' }}>{fmt(sin)}</strong></div>
          <div><span>cos α</span><strong style={{ color: '#22d3ee' }}>{fmt(cos)}</strong></div>
          <div><span>tan α</span><strong style={{ color: '#fde047' }}>{tan === null ? '∄' : fmt(tan)}</strong></div>
          <div><span>ángulo</span><strong style={{ color: '#a78bfa' }}>{angle}°</strong></div>
        </div>
        <FormulaCard
          formula={L`\operatorname{sen}^2\alpha+\cos^2\alpha=${fmt(sin * sin + cos * cos, 3)}`}
          label="identidad pitagórica"
        />
        <div className="lab-note">
          {mode === 'identity'
            ? `La suma de los cuadrados es siempre 1. Acá: ${fmt(sin * sin, 3)} + ${fmt(cos * cos, 3)} = 1.`
            : mode === 'triangle'
              ? `El radio es la hipotenusa; la proyección horizontal es el cateto adyacente y la vertical el opuesto.`
              : `El arco recorrido mide ${piLabel(angle)} radianes porque el radio vale 1.`}
        </div>
      </div>

      <div className="lab-footnote">
        <Icon name="bulb" size={15} />
        <span>El seno es la altura del punto, el coseno su sombra horizontal. La tangente es la relación entre ambos.</span>
      </div>
    </div>
  );
}
