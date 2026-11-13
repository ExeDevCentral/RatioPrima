import React, { useState } from 'react';
import type { Lesson } from '../../data/types';
import Icon from '../ui/Icon';
import { FormulaCard } from '../ui/RichText';

const L = String.raw;
type Mode = 'square' | 'difference' | 'factor';

export default function TilesLab({ lesson }: { lesson: Lesson }) {
  const config = lesson.labConfig ?? {};
  const [a, setA] = useState<number>(typeof config.a === 'number' ? Math.max(2, config.a) : 3);
  const [b, setB] = useState<number>(typeof config.b === 'number' ? Math.max(1, config.b) : 2);
  const [mode, setMode] = useState<Mode>('square');

  const unit = Math.min(52, 300 / (a + b));
  const originX = 120;
  const originY = 90;
  const aPx = a * unit;
  const bPx = b * unit;

  return (
    <div className="lab">
      <div className="lab-head">
        <div>
          <span className="lab-kicker">Laboratorio 05 · Álgebra visual</span>
          <h3>Tablero de áreas</h3>
          <p>Los productos notables son áreas. Cambiá a y b y mirá cómo se descompone el cuadrado.</p>
        </div>
        <div className="lab-badge">
          <Icon name="cube" size={16} /> geometría
        </div>
      </div>

      <div className="lab-tabs">
        {[
          { id: 'square' as Mode, label: '(a + b)²' },
          { id: 'difference' as Mode, label: 'a² − b²' },
          { id: 'factor' as Mode, label: 'a(b + c)' }
        ].map((item) => (
          <button key={item.id} className={`chip ${mode === item.id ? 'active' : ''}`} onClick={() => setMode(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="lab-stage">
        <svg viewBox="0 0 760 430" className="lab-svg" role="img" aria-label="Tablero de áreas algebraicas">
          <defs>
            <linearGradient id="tile-a" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#0e7490" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="tile-b" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="tile-ab" x1="0" x2="1">
              <stop offset="0%" stopColor="#fde047" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <rect width="760" height="430" fill="#030711" />

          {mode === 'square' ? (
            <g>
              <rect x={originX} y={originY} width={aPx} height={aPx} fill="url(#tile-a)" stroke="#22d3ee" className="tile-pop" />
              <text x={originX + aPx / 2} y={originY + aPx / 2 + 6} textAnchor="middle" fill="#e0f2fe" fontSize="20" fontWeight="700">a²</text>
              <text x={originX + aPx / 2} y={originY + aPx / 2 + 26} textAnchor="middle" fill="#67e8f9" fontSize="11">{a}² = {a * a}</text>

              <rect x={originX + aPx} y={originY} width={bPx} height={aPx} fill="url(#tile-ab)" stroke="#fde047" className="tile-pop" />
              <text x={originX + aPx + bPx / 2} y={originY + aPx / 2 + 6} textAnchor="middle" fill="#fef9c3" fontSize="18" fontWeight="700">ab</text>

              <rect x={originX} y={originY + aPx} width={aPx} height={bPx} fill="url(#tile-ab)" stroke="#fde047" className="tile-pop" />
              <text x={originX + aPx / 2} y={originY + aPx + bPx / 2 + 6} textAnchor="middle" fill="#fef9c3" fontSize="18" fontWeight="700">ab</text>

              <rect x={originX + aPx} y={originY + aPx} width={bPx} height={bPx} fill="url(#tile-b)" stroke="#a78bfa" className="tile-pop" />
              <text x={originX + aPx + bPx / 2} y={originY + aPx + bPx / 2 + 6} textAnchor="middle" fill="#ede9fe" fontSize="18" fontWeight="700">b²</text>

              <line x1={originX + aPx} y1={originY - 18} x2={originX + aPx} y2={originY + aPx + bPx} stroke="#64748b" strokeDasharray="4 4" />
              <line x1={originX - 18} y1={originY + aPx} x2={originX + aPx + bPx} y2={originY + aPx} stroke="#64748b" strokeDasharray="4 4" />

              <text x={originX + (aPx + bPx) / 2} y={originY - 30} textAnchor="middle" fill="#94a3b8" fontSize="12">a + b = {a + b}</text>
              <text x={originX - 30} y={originY + (aPx + bPx) / 2} textAnchor="middle" fill="#94a3b8" fontSize="12" transform={`rotate(-90 ${originX - 30} ${originY + (aPx + bPx) / 2})`}>
                a + b = {a + b}
              </text>

              <text x={560} y={150} fill="#22d3ee" fontSize="14" fontWeight="700">(a + b)²</text>
              <text x={560} y={180} fill="#94a3b8" fontSize="12">= a² + 2ab + b²</text>
              <text x={560} y={210} fill="#fde047" fontSize="13">= {a * a} + {2 * a * b} + {b * b}</text>
              <text x={560} y={240} fill="#e2e8f0" fontSize="20" fontWeight="700">= {(a + b) ** 2}</text>
            </g>
          ) : null}

          {mode === 'difference' ? (
            <g>
              <rect x={originX} y={originY} width={aPx} height={aPx} fill="url(#tile-a)" stroke="#22d3ee" className="tile-pop" />
              <text x={originX + aPx / 2} y={originY + aPx / 2 + 8} textAnchor="middle" fill="#e0f2fe" fontSize="20" fontWeight="700">a²</text>
              <rect x={originX + aPx - bPx} y={originY + aPx - bPx} width={bPx} height={bPx} fill="#030711" stroke="#fb7185" strokeWidth="2" strokeDasharray="5 4" />
              <text x={originX + aPx - bPx / 2} y={originY + aPx - bPx / 2 + 4} textAnchor="middle" fill="#fb7185" fontSize="13" fontWeight="700">−b²</text>

              <rect x={originX + aPx + 70} y={originY} width={aPx - bPx} height={unit} fill="rgba(34,211,238,0.2)" stroke="#22d3ee" />
              <text x={originX + aPx + 70 + (aPx - bPx) / 2} y={originY + unit / 2 + 4} textAnchor="middle" fill="#67e8f9" fontSize="12">a − b</text>
              <rect x={originX + aPx + 70} y={originY + unit + 10} width={aPx + bPx} height={unit} fill="rgba(167,139,250,0.2)" stroke="#a78bfa" />
              <text x={originX + aPx + 70 + (aPx + bPx) / 2} y={originY + unit + 10 + unit / 2 + 4} textAnchor="middle" fill="#c4b5fd" fontSize="12">a + b</text>

              <text x={originX + aPx + 70} y={originY + 130} fill="#22d3ee" fontSize="14" fontWeight="700">a² − b²</text>
              <text x={originX + aPx + 70} y={originY + 158} fill="#94a3b8" fontSize="12">= (a − b)(a + b)</text>
              <text x={originX + aPx + 70} y={originY + 190} fill="#fde047" fontSize="14">{a * a} − {b * b} = {(a - b) * (a + b)}</text>
            </g>
          ) : null}

          {mode === 'factor' ? (
            <g>
              <rect x={originX} y={originY} width={aPx} height={aPx} fill="url(#tile-a)" stroke="#22d3ee" className="tile-pop" />
              <text x={originX + aPx / 2} y={originY + aPx / 2 + 6} textAnchor="middle" fill="#e0f2fe" fontSize="18" fontWeight="700">ab</text>
              <rect x={originX + aPx + 12} y={originY} width={aPx} height={aPx} fill="url(#tile-b)" stroke="#a78bfa" className="tile-pop" />
              <text x={originX + aPx + 12 + aPx / 2} y={originY + aPx / 2 + 6} textAnchor="middle" fill="#ede9fe" fontSize="18" fontWeight="700">ac</text>

              <text x={originX + aPx + 90} y={originY + aPx + 50} fill="#22d3ee" fontSize="14" fontWeight="700">a(b + c) = ab + ac</text>
              <text x={originX + aPx + 90} y={originY + aPx + 78} fill="#94a3b8" fontSize="12">Factorizar es leer la suma como producto.</text>
              <text x={originX + aPx + 90} y={originY + aPx + 110} fill="#fde047" fontSize="13">{a} · ({b} + 3) = {a * b} + {a * 3}</text>
            </g>
          ) : null}

          <text x={W_MID} y={400} textAnchor="middle" fill="#334155" fontSize="11">
            cada rectángulo representa un producto
          </text>
        </svg>
      </div>

      <div className="lab-controls">
        <label className="slider">
          <span className="slider-label">a <strong style={{ color: '#22d3ee' }}>{a}</strong></span>
          <input type="range" min="1" max="5" step="1" value={a} onChange={(event) => setA(Number(event.target.value))} style={{ accentColor: '#22d3ee' }} />
        </label>
        <label className="slider">
          <span className="slider-label">b <strong style={{ color: '#a78bfa' }}>{b}</strong></span>
          <input type="range" min="1" max="5" step="1" value={b} onChange={(event) => setB(Number(event.target.value))} style={{ accentColor: '#a78bfa' }} />
        </label>
      </div>

      <div className="lab-readout">
        <FormulaCard
          formula={
            mode === 'square'
              ? L`(a+b)^2=a^2+2ab+b^2=${(a + b) ** 2}`
              : mode === 'difference'
                ? L`a^2-b^2=(a-b)(a+b)=${(a - b) * (a + b)}`
                : L`a(b+c)=ab+ac`
          }
          label="identidad activa"
        />
        <div className="lab-note">
          {mode === 'square'
            ? `El área total es (${a}+${b})² = ${(a + b) ** 2}. Se descompone en ${a * a} + ${2 * a * b} + ${b * b}.`
            : mode === 'difference'
              ? `Al cuadrado grande le quitamos el cuadrado chico: ${a * a} − ${b * b} = ${(a - b) * (a + b)}.`
              : `El rectángulo completo tiene altura ${a} y base ${b} + 3. Su área es ${a}·${b} + ${a}·3.`}
        </div>
      </div>

      <div className="lab-footnote">
        <Icon name="bulb" size={15} />
        <span>Visualizar el álgebra evita el error de creer que (a+b)² = a²+b². El doble producto es el área que falta.</span>
      </div>
    </div>
  );
}

const W_MID = 380;
