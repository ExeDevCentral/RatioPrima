import React, { useMemo, useState } from 'react';
import type { Lesson } from '../../data/types';
import Icon from '../ui/Icon';
import { FormulaCard } from '../ui/RichText';

const L = String.raw;
type Mode = 'power' | 'root' | 'rational';

function primeFactors(value: number): number[] {
  let n = Math.max(2, Math.round(value));
  const factors: number[] = [];
  let divisor = 2;
  while (n > 1 && divisor * divisor <= n) {
    while (n % divisor === 0) {
      factors.push(divisor);
      n /= divisor;
    }
    divisor += 1;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function groupFactors(factors: number[], index: number): { outside: number; inside: number } {
  const counts = new Map<number, number>();
  factors.forEach((factor) => counts.set(factor, (counts.get(factor) ?? 0) + 1));
  let outside = 1;
  let inside = 1;
  counts.forEach((count, factor) => {
    outside *= Math.pow(factor, Math.floor(count / index));
    inside *= Math.pow(factor, count % index);
  });
  return { outside, inside };
}

export default function RadicalsLab({ lesson }: { lesson: Lesson }) {
  const config = lesson.labConfig ?? {};
  const initialMode = (typeof config.mode === 'string' ? config.mode : 'root') as Mode;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [base, setBase] = useState<number>(typeof config.base === 'number' ? config.base : 2);
  const [exponent, setExponent] = useState<number>(typeof config.exponent === 'number' ? config.exponent : 3);
  const [value, setValue] = useState<number>(typeof config.value === 'number' ? config.value : 108);
  const [index, setIndex] = useState<number>(typeof config.index === 'number' ? config.index : 2);

  const factors = useMemo(() => primeFactors(value), [value]);
  const grouped = useMemo(() => groupFactors(factors, index), [factors, index]);
  const powerValue = Math.pow(base, exponent);
  const rationalValue = Math.pow(value, exponent / index);
  const rationalValid = value >= 0 || index % 2 === 1;

  const treeLevels = useMemo(() => {
    const levels: number[][] = [[value]];
    let current = value;
    const pending = [...factors];
    let accumulator = current;
    const chain: Array<{ left: number; right: number; rest: number }> = [];
    for (const factor of pending) {
      const rest = accumulator / factor;
      chain.push({ left: factor, right: rest, rest });
      accumulator = rest;
      if (rest === 1) break;
    }
    chain.forEach((step, depth) => {
      if (!levels[depth + 1]) levels[depth + 1] = [];
      levels[depth + 1].push(step.left);
      if (step.rest > 1) levels[depth + 1].push(step.rest);
    });
    return levels;
  }, [value, factors]);

  return (
    <div className="lab">
      <div className="lab-head">
        <div>
          <span className="lab-kicker">Laboratorio 07 · Potencias y raíces</span>
          <h3>Fábrica de factores</h3>
          <p>Descomponé, agrupá y extraé. La raíz deja de ser magia cuando ves los factores.</p>
        </div>
        <div className="lab-badge">
          <Icon name="layers" size={16} /> {mode === 'power' ? 'potencia' : mode === 'root' ? 'radical' : 'exponente racional'}
        </div>
      </div>

      <div className="lab-tabs">
        {[
          { id: 'power' as Mode, label: 'Potencia' },
          { id: 'root' as Mode, label: 'Raíz' },
          { id: 'rational' as Mode, label: 'Exponente racional' }
        ].map((item) => (
          <button key={item.id} className={`chip ${mode === item.id ? 'active' : ''}`} onClick={() => setMode(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="lab-stage">
        {mode === 'power' ? (
          <div className="power-stage">
            <div className="power-chain">
              {Array.from({ length: Math.min(exponent, 8) }, (_, i) => (
                <React.Fragment key={i}>
                  <span className="power-factor">{base}</span>
                  {i < Math.min(exponent, 8) - 1 ? <span className="power-times">×</span> : null}
                </React.Fragment>
              ))}
            </div>
            <div className="power-result">
              <span>{base}^{exponent}</span>
              <strong>= {powerValue}</strong>
            </div>
            <div className="power-dots">
              {Array.from({ length: Math.min(Math.abs(powerValue), 64) }, (_, index) => (
                <span key={index} className="power-dot" style={{ animationDelay: `${index * 12}ms` }} />
              ))}
            </div>
            <p className="power-note">
              {exponent} factores iguales a {base}. {exponent < 0 ? 'El exponente negativo invierte la base.' : 'El exponente cuenta cuántas veces se multiplica.'}
            </p>
          </div>
        ) : null}

        {mode === 'root' ? (
          <div className="root-stage">
            <svg viewBox="0 0 460 350" className="root-tree" role="img" aria-label="Árbol de factores">
              <rect width="460" height="350" fill="#030711" />
              <g>
                <circle cx="230" cy="42" r="30" fill="rgba(34,211,238,0.14)" stroke="#22d3ee" />
                <text x="230" y="48" textAnchor="middle" fill="#e0f2fe" fontSize="18" fontWeight="700">{value}</text>
              </g>
              {factors.map((factor, position) => {
                const x = 230 + (position - (factors.length - 1) / 2) * 58;
                const y = 140 + (position % 2) * 78;
                return (
                  <g key={`${factor}-${position}`} className="tree-node" style={{ animationDelay: `${position * 90}ms` }}>
                    <line x1="230" y1="72" x2={x} y2={y - 22} stroke="#334155" strokeDasharray="3 4" />
                    <circle cx={x} cy={y} r="22" fill={factor === 2 ? 'rgba(34,211,238,0.14)' : factor === 3 ? 'rgba(167,139,250,0.16)' : 'rgba(253,224,71,0.14)'} stroke={factor === 2 ? '#22d3ee' : factor === 3 ? '#a78bfa' : '#fde047'} />
                    <text x={x} y={y + 5} textAnchor="middle" fill="#e2e8f0" fontSize="14" fontWeight="700">{factor}</text>
                  </g>
                );
              })}
              <text x="230" y="330" textAnchor="middle" fill="#475569" fontSize="11">
                {factors.join(' × ')} = {value}
              </text>
            </svg>

            <div className="root-readout">
              <FormulaCard formula={L`\sqrt[${index}]{${value}}`} label="radical" />
              <div className="root-arrow">↓ agrupamos de a {index}</div>
              <FormulaCard
                formula={
                  grouped.inside === 1
                    ? L`${grouped.outside}`
                    : grouped.outside === 1
                      ? L`\sqrt[${index}]{${grouped.inside}}`
                      : L`${grouped.outside}\sqrt[${index}]{${grouped.inside}}`
                }
                label="forma simplificada"
              />
              <div className="factor-chips">
                {factors.map((factor, position) => (
                  <span key={position} className="factor-chip">{factor}</span>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {mode === 'rational' ? (
          <div className="power-stage">
            <FormulaCard formula={L`${value}^{\frac{${exponent}}{${index}}}`} label="exponente racional" />
            <div className="rational-arrow">equivale a</div>
            <FormulaCard formula={L`\sqrt[${index}]{${value}^{${exponent}}}`} label="raíz enésima" />
            <div className="power-result">
              <strong>{rationalValid ? `≈ ${rationalValue.toFixed(4).replace('.', ',')}` : 'no definido en ℝ'}</strong>
            </div>
            <p className="power-note">
              {rationalValid
                ? `El denominador ${index} es el índice de la raíz; el numerador ${exponent} es la potencia del radicando.`
                : 'Índice par con radicando negativo: no hay raíz real.'}
            </p>
          </div>
        ) : null}
      </div>

      <div className="lab-controls">
        {mode === 'power' ? (
          <>
            <label className="slider">
              <span className="slider-label">base <strong style={{ color: '#22d3ee' }}>{base}</strong></span>
              <input type="range" min="1" max="6" step="1" value={base} onChange={(event) => setBase(Number(event.target.value))} style={{ accentColor: '#22d3ee' }} />
            </label>
            <label className="slider">
              <span className="slider-label">exponente <strong style={{ color: '#a78bfa' }}>{exponent}</strong></span>
              <input type="range" min="-3" max="6" step="1" value={exponent} onChange={(event) => setExponent(Number(event.target.value))} style={{ accentColor: '#a78bfa' }} />
            </label>
          </>
        ) : null}

        {mode === 'root' ? (
          <>
            <label className="slider">
              <span className="slider-label">radicando <strong style={{ color: '#22d3ee' }}>{value}</strong></span>
              <input type="range" min="2" max="200" step="1" value={value} onChange={(event) => setValue(Number(event.target.value))} style={{ accentColor: '#22d3ee' }} />
            </label>
            <label className="slider">
              <span className="slider-label">índice <strong style={{ color: '#a78bfa' }}>{index}</strong></span>
              <input type="range" min="2" max="4" step="1" value={index} onChange={(event) => setIndex(Number(event.target.value))} style={{ accentColor: '#a78bfa' }} />
            </label>
          </>
        ) : null}

        {mode === 'rational' ? (
          <>
            <label className="slider">
              <span className="slider-label">base <strong style={{ color: '#22d3ee' }}>{value}</strong></span>
              <input type="range" min="2" max="20" step="1" value={value} onChange={(event) => setValue(Number(event.target.value))} style={{ accentColor: '#22d3ee' }} />
            </label>
            <label className="slider">
              <span className="slider-label">numerador m <strong style={{ color: '#fde047' }}>{exponent}</strong></span>
              <input type="range" min="1" max="5" step="1" value={exponent} onChange={(event) => setExponent(Number(event.target.value))} style={{ accentColor: '#fde047' }} />
            </label>
            <label className="slider">
              <span className="slider-label">denominador n <strong style={{ color: '#a78bfa' }}>{index}</strong></span>
              <input type="range" min="2" max="5" step="1" value={index} onChange={(event) => setIndex(Number(event.target.value))} style={{ accentColor: '#a78bfa' }} />
            </label>
          </>
        ) : null}
      </div>

      <div className="lab-footnote">
        <Icon name="bulb" size={15} />
        <span>Factorizar el radicando es el paso que convierte una raíz enorme en una expresión simple. Sin factores, no hay simplificación.</span>
      </div>
    </div>
  );
}
