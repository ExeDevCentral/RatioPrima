import React, { useState } from 'react';
import type { Lesson } from '../../data/types';
import Icon from '../ui/Icon';
import { FormulaCard } from '../ui/RichText';

const L = String.raw;

function fmt(value: number): string {
  if (Math.abs(value - Math.round(value)) < 0.0001) return `${Math.round(value)}`;
  return value.toFixed(2).replace('.', ',');
}

export default function BalanceLab({ lesson }: { lesson: Lesson }) {
  const config = lesson.labConfig ?? {};
  const initialA = typeof config.a === 'number' ? Math.max(0, Math.min(6, config.a)) : 2;
  const initialB = typeof config.b === 'number' ? config.b : -1;
  const initialC = typeof config.c === 'number' ? config.c : 5;

  const [a, setA] = useState<number>(initialA);
  const [b, setB] = useState<number>(initialB);
  const [c, setC] = useState<number>(initialC);
  const [step, setStep] = useState<number>(0);

  const effectiveA = a;
  const solution = effectiveA !== 0 ? (c - b) / effectiveA : null;
  const afterMove = c - b;
  const resolved = step >= 2 && effectiveA !== 0;

  const equation = (() => {
    if (step === 0) return L`${a === 1 ? '' : a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`;
    if (step === 1) return L`${a === 1 ? '' : a}x = ${c} ${b >= 0 ? '-' : '+'} ${Math.abs(b)} = ${afterMove}`;
    if (effectiveA === 0) return L`0 = ${afterMove}`;
    return L`x = ${fmt(solution ?? 0)}`;
  })();

  const classification = (() => {
    if (effectiveA !== 0) return 'Compatible determinada: una única solución.';
    if (afterMove === 0) return 'Compatible indeterminada: 0 = 0, solución S = ℝ.';
    return 'Incompatible: 0 = un número distinto de cero, solución S = ∅.';
  })();

  function reset() {
    setA(initialA);
    setB(initialB);
    setC(initialC);
    setStep(0);
  }

  const xTokens = Array.from({ length: Math.min(a, 6) }, (_, index) => index);
  const bTokens = Array.from({ length: Math.min(Math.abs(b), 12) }, (_, index) => index);
  const cTokens = Array.from({ length: Math.min(Math.abs(c), 20) }, (_, index) => index);

  return (
    <div className="lab">
      <div className="lab-head">
        <div>
          <span className="lab-kicker">Laboratorio 02 · Ecuaciones</span>
          <h3>Balanza algebraica</h3>
          <p>Operá sobre ambos platillos a la vez: el equilibrio no se rompe.</p>
        </div>
        <div className="lab-badge">
          <Icon name="scale" size={16} /> equilibrio
        </div>
      </div>

      <div className="balance-stage">
        <svg viewBox="0 0 760 340" className="lab-svg" role="img" aria-label="Balanza de ecuaciones">
          <defs>
            <linearGradient id="balance-beam" x1="0" x2="1">
              <stop offset="0%" stopColor="#fb7185" />
              <stop offset="50%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <filter id="balance-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="760" height="340" fill="#030711" />
          <circle cx="380" cy="240" r="110" fill="rgba(34,211,238,0.05)" />
          <circle cx="380" cy="240" r="160" fill="none" stroke="#0e2a3a" strokeDasharray="3 8" />

          <g className={resolved ? 'balance-resolved' : ''}>
            <line x1="150" y1="96" x2="610" y2="96" stroke="url(#balance-beam)" strokeWidth="7" strokeLinecap="round" filter="url(#balance-glow)" />
            <circle cx="380" cy="96" r="10" fill="#fde047" />
            <polygon points="380,96 355,215 405,215" fill="#0b1c2b" stroke="#22d3ee" strokeWidth="2" />
            <line x1="330" y1="240" x2="430" y2="240" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            <text x="380" y="272" textAnchor="middle" fill="#475569" fontSize="12">eje de equilibrio</text>

            <g>
              <line x1="180" y1="96" x2="180" y2="150" stroke="#475569" strokeWidth="2" />
              <ellipse cx="180" cy="156" rx="112" ry="12" fill="#0b1c2b" stroke="#fb7185" strokeWidth="2" />
              <text x="180" y="139" textAnchor="middle" fill="#fb7185" fontSize="11" fontWeight="700">MIEMBRO IZQUIERDO</text>
            </g>
            <g>
              <line x1="580" y1="96" x2="580" y2="150" stroke="#475569" strokeWidth="2" />
              <ellipse cx="580" cy="156" rx="112" ry="12" fill="#0b1c2b" stroke="#22d3ee" strokeWidth="2" />
              <text x="580" y="139" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="700">MIEMBRO DERECHO</text>
            </g>

            {xTokens.map((token) => (
              <g key={`x-${token}`} transform={`translate(${82 + token * 38}, 184)`}>
                <rect width="32" height="32" rx="6" fill="rgba(251,113,133,0.18)" stroke="#fb7185" />
                <text x="16" y="21" textAnchor="middle" fill="#fb7185" fontSize="15" fontWeight="700">x</text>
              </g>
            ))}

            {bTokens.map((token) => (
              <g key={`b-${token}`} transform={`translate(${86 + token * 22}, ${b >= 0 ? 230 : 230})`}>
                <circle cx="8" cy="8" r="8" fill={b >= 0 ? 'rgba(253,224,71,0.2)' : 'rgba(251,113,133,0.2)'} stroke={b >= 0 ? '#fde047' : '#fb7185'} />
                <text x="8" y="12" textAnchor="middle" fill={b >= 0 ? '#fde047' : '#fb7185'} fontSize="9" fontWeight="700">
                  {b >= 0 ? '+1' : '−1'}
                </text>
              </g>
            ))}

            {cTokens.map((token) => (
              <g key={`c-${token}`} transform={`translate(${500 + (token % 8) * 20}, ${185 + Math.floor(token / 8) * 22})`}>
                <circle cx="8" cy="8" r="8" fill="rgba(34,211,238,0.18)" stroke="#22d3ee" />
                <text x="8" y="12" textAnchor="middle" fill="#22d3ee" fontSize="9" fontWeight="700">+1</text>
              </g>
            ))}

            <g transform="translate(380, 330)">
              <text textAnchor="middle" fill="#94a3b8" fontSize="12">
                {resolved ? '✓ ecuación resuelta' : 'mantené el equilibrio: misma operación en ambos lados'}
              </text>
            </g>
          </g>
        </svg>
      </div>

      <div className="lab-controls">
        <label className="slider">
          <span className="slider-label">coeficiente a <strong style={{ color: '#fb7185' }}>{a}</strong></span>
          <input type="range" min="0" max="6" step="1" value={a} onChange={(e) => { setA(Number(e.target.value)); setStep(0); }} style={{ accentColor: '#fb7185' }} />
        </label>
        <label className="slider">
          <span className="slider-label">término b <strong style={{ color: '#fde047' }}>{b}</strong></span>
          <input type="range" min="-12" max="12" step="1" value={b} onChange={(e) => { setB(Number(e.target.value)); setStep(0); }} style={{ accentColor: '#fde047' }} />
        </label>
        <label className="slider">
          <span className="slider-label">resultado c <strong style={{ color: '#22d3ee' }}>{c}</strong></span>
          <input type="range" min="-12" max="24" step="1" value={c} onChange={(e) => { setC(Number(e.target.value)); setStep(0); }} style={{ accentColor: '#22d3ee' }} />
        </label>
      </div>

      <div className="balance-steps">
        <div className="balance-equation">
          <FormulaCard formula={equation} label={`paso ${step + 1}`} />
          <div className={`balance-status ${resolved ? 'ok' : ''}`}>{classification}</div>
        </div>
        <div className="lab-actions">
          <button className="btn" onClick={() => setStep(Math.min(2, step + 1))} disabled={step >= 2 || (step === 1 && a === 0)}>
            <Icon name="arrow" size={15} /> {step === 0 ? `Restar ${b >= 0 ? b : `(${b})`} a ambos lados` : 'Dividir por a'}
          </button>
          <button className="btn btn-ghost" onClick={reset}>
            <Icon name="refresh" size={15} /> Reiniciar
          </button>
        </div>
      </div>

      <div className="balance-log">
        <div className={step >= 0 ? 'active' : ''}>
          <span>1</span> {a === 1 ? 'x' : `${a}x`} {b >= 0 ? '+' : '−'} {Math.abs(b)} = {c}
        </div>
        <div className={step >= 1 ? 'active' : ''}>
          <span>2</span> {a === 1 ? 'x' : `${a}x`} = {afterMove} <em>(restamos {b} en ambos miembros)</em>
        </div>
        <div className={step >= 2 ? 'active' : ''}>
          <span>3</span> x = {solution === null ? '—' : fmt(solution)} <em>(dividimos por {a})</em>
        </div>
      </div>

      <div className="lab-footnote">
        <Icon name="bulb" size={15} />
        <span>Una ecuación es una igualdad: si sumás, restás, multiplicás o dividís (por algo distinto de cero) en un lado, tenés que hacerlo en el otro.</span>
      </div>
    </div>
  );
}
