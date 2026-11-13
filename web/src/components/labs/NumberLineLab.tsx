import React, { useMemo, useState } from 'react';
import type { Lesson } from '../../data/types';
import { FormulaCard } from '../ui/RichText';
import Icon from '../ui/Icon';

type Mode = 'sets' | 'order' | 'absolute' | 'interval' | 'inequality' | 'compound' | 'sign';

const MODES: Array<{ id: Mode; label: string }> = [
  { id: 'sets', label: 'Conjuntos' },
  { id: 'order', label: 'Orden' },
  { id: 'absolute', label: 'Módulo' },
  { id: 'interval', label: 'Intervalos' },
  { id: 'inequality', label: 'Inecuación' },
  { id: 'compound', label: 'Compuesta' },
  { id: 'sign', label: 'Signos' }
];

const WIDTH = 760;
const HEIGHT = 250;
const PAD = 54;
const MIN = -10;
const MAX = 10;

function scaleX(value: number): number {
  return PAD + ((value - MIN) / (MAX - MIN)) * (WIDTH - 2 * PAD);
}

function fmt(value: number): string {
  if (Math.abs(value - Math.PI) < 0.001) return 'π';
  if (Math.abs(value - Math.SQRT2) < 0.001) return '√2';
  if (Math.abs(value - Math.round(value)) < 0.0001) return `${Math.round(value)}`;
  return value.toFixed(2).replace('.', ',');
}

function classify(value: number) {
  const irr = Math.abs(value - Math.PI) < 0.001 || Math.abs(value - Math.SQRT2) < 0.001;
  const integer = !irr && Math.abs(value - Math.round(value)) < 0.0001;
  return {
    natural: integer && value > 0,
    natural0: integer && value >= 0,
    integer,
    rational: !irr,
    irrational: irr,
    real: true
  };
}

export default function NumberLineLab({ lesson }: { lesson: Lesson }) {
  const config = lesson.labConfig ?? {};
  const initialMode = (typeof config.mode === 'string' ? config.mode : 'interval') as Mode;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [a, setA] = useState<number>(typeof config.a === 'number' ? config.a : -2);
  const [b, setB] = useState<number>(typeof config.b === 'number' ? config.b : 3);
  const [center, setCenter] = useState<number>(typeof config.center === 'number' ? config.center : 1);
  const [radius, setRadius] = useState<number>(typeof config.radius === 'number' ? config.radius : 2);
  const [closedA, setClosedA] = useState(true);
  const [closedB, setClosedB] = useState(true);
  const [value, setValue] = useState<number>(typeof config.value === 'number' ? config.value : 1.4142);

  const ticks = useMemo(() => {
    const list: number[] = [];
    for (let tick = MIN; tick <= MAX; tick += 1) list.push(tick);
    return list;
  }, []);

  const left = mode === 'absolute' || mode === 'compound' ? center - radius : Math.min(a, b);
  const right = mode === 'absolute' || mode === 'compound' ? center + radius : Math.max(a, b);

  const shadeStart = Math.max(MIN, left);
  const shadeEnd = Math.min(MAX, right);

  function handleAxisClick(event: React.MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * WIDTH;
    const raw = MIN + ((x - PAD) / (WIDTH - 2 * PAD)) * (MAX - MIN);
    const clamped = Math.max(MIN, Math.min(MAX, Math.round(raw * 10) / 10));
    if (mode === 'order') {
      if (Math.abs(clamped - a) < Math.abs(clamped - b)) setA(clamped);
      else setB(clamped);
    } else if (mode === 'absolute' || mode === 'compound') {
      setCenter(clamped);
    } else if (mode === 'sets') {
      setValue(clamped);
    } else {
      setB(clamped);
    }
  }

  const classified = classify(value);
  const quotient = a !== 0 ? -b / a : 0;

  const setRows = [
    { id: 'N', active: classified.natural, color: '#22d3ee' },
    { id: 'N0', active: classified.natural0, color: '#38bdf8' },
    { id: 'Z', active: classified.integer, color: '#a78bfa' },
    { id: 'Q', active: classified.rational, color: '#34d399' },
    { id: 'I', active: classified.irrational, color: '#fb7185' },
    { id: 'R', active: true, color: '#fde047' }
  ];

  return (
    <div className="lab">
      <div className="lab-head">
        <div>
          <span className="lab-kicker">Laboratorio 01 · Recta real</span>
          <h3>Explorador de la recta</h3>
          <p>Arrastrá los controles o hacé clic sobre el eje para mover los puntos.</p>
        </div>
        <div className="lab-badge">
          <Icon name="orbit" size={16} /> interactivo
        </div>
      </div>

      <div className="lab-tabs">
        {MODES.map((item) => (
          <button
            key={item.id}
            className={`chip ${mode === item.id ? 'active' : ''}`}
            onClick={() => setMode(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="lab-stage">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="lab-svg"
          onClick={handleAxisClick}
          role="img"
          aria-label="Recta real interactiva"
        >
          <defs>
            <linearGradient id="nl-shade" x1="0" x2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
            </linearGradient>
            <filter id="nl-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#030711" />
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={scaleX(tick)}
                y1={HEIGHT / 2 - 6}
                x2={scaleX(tick)}
                y2={HEIGHT / 2 + 6}
                stroke={tick === 0 ? '#94a3b8' : '#334155'}
                strokeWidth={tick === 0 ? 2 : 1}
              />
              {tick % 2 === 0 ? (
                <text
                  x={scaleX(tick)}
                  y={HEIGHT / 2 + 26}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="12"
                >
                  {tick}
                </text>
              ) : null}
            </g>
          ))}

          <line
            x1={PAD - 10}
            y1={HEIGHT / 2}
            x2={WIDTH - PAD + 10}
            y2={HEIGHT / 2}
            stroke="#475569"
            strokeWidth="2"
          />
          <polygon
            points={`${WIDTH - PAD + 10},${HEIGHT / 2} ${WIDTH - PAD},${HEIGHT / 2 - 5} ${WIDTH - PAD},${HEIGHT / 2 + 5}`}
            fill="#475569"
          />
          <text x={WIDTH - PAD + 4} y={HEIGHT / 2 - 12} fill="#64748b" fontSize="12">
            +∞
          </text>
          <text x={PAD - 20} y={HEIGHT / 2 - 12} fill="#64748b" fontSize="12">
            −∞
          </text>

          {(mode === 'absolute' || mode === 'interval' || mode === 'inequality' || mode === 'compound') &&
          shadeEnd > shadeStart ? (
            <rect
              x={scaleX(shadeStart)}
              y={HEIGHT / 2 - 19}
              width={Math.max(2, scaleX(shadeEnd) - scaleX(shadeStart))}
              height={38}
              fill="url(#nl-shade)"
              stroke="#22d3ee"
              strokeOpacity="0.45"
              strokeDasharray="4 4"
              rx="5"
            />
          ) : null}

          {mode === 'sign' ? (
            <>
              {[
                { from: MIN, to: Math.min(a, b), sign: '+' },
                { from: Math.min(a, b), to: Math.max(a, b), sign: '−' },
                { from: Math.max(a, b), to: MAX, sign: '+' }
              ].map((band, index) => (
                <g key={index}>
                  <rect
                    x={scaleX(band.from)}
                    y={HEIGHT / 2 - 19}
                    width={Math.max(0, scaleX(band.to) - scaleX(band.from))}
                    height={38}
                    fill={band.sign === '+' ? 'rgba(34,211,238,0.14)' : 'rgba(251,113,133,0.12)'}
                  />
                  <text
                    x={(scaleX(band.from) + scaleX(band.to)) / 2}
                    y={HEIGHT / 2 - 27}
                    textAnchor="middle"
                    fill={band.sign === '+' ? '#22d3ee' : '#fb7185'}
                    fontSize="14"
                    fontWeight="700"
                  >
                    {band.sign}
                  </text>
                </g>
              ))}
            </>
          ) : null}

          {mode === 'order' ? (
            <>
              <Point x={scaleX(a)} label={fmt(a)} color="#fb7185" />
              <Point x={scaleX(b)} label={fmt(b)} color="#22d3ee" />
              <g filter="url(#nl-glow)">
                <line
                  x1={scaleX(a)}
                  y1={HEIGHT / 2 - 46}
                  x2={scaleX(b)}
                  y2={HEIGHT / 2 - 46}
                  stroke="#a78bfa"
                  strokeWidth="2"
                  strokeDasharray="5 4"
                />
              </g>
              <text
                x={(scaleX(a) + scaleX(b)) / 2}
                y={HEIGHT / 2 - 54}
                textAnchor="middle"
                fill="#c4b5fd"
                fontSize="12"
              >
                distancia = {Math.abs(b - a).toFixed(1)}
              </text>
            </>
          ) : null}

          {mode === 'absolute' || mode === 'compound' ? (
            <>
              <Point x={scaleX(center)} label={fmt(center)} color="#22d3ee" />
              <Point x={scaleX(center - radius)} label={fmt(center - radius)} color="#a78bfa" />
              <Point x={scaleX(center + radius)} label={fmt(center + radius)} color="#a78bfa" />
            </>
          ) : null}

          {mode === 'interval' ? (
            <>
              <Point x={scaleX(Math.min(a, b))} label={fmt(Math.min(a, b))} color="#22d3ee" open={!closedA} />
              <Point x={scaleX(Math.max(a, b))} label={fmt(Math.max(a, b))} color="#22d3ee" open={!closedB} />
            </>
          ) : null}

          {mode === 'inequality' ? (
            <Point x={scaleX(quotient)} label={fmt(quotient)} color="#fde047" open />
          ) : null}

          {mode === 'sign' ? (
            <>
              <Point x={scaleX(Math.min(a, b))} label={fmt(Math.min(a, b))} color="#22d3ee" open />
              <Point x={scaleX(Math.max(a, b))} label={fmt(Math.max(a, b))} color="#fde047" />
            </>
          ) : null}

          {mode === 'sets' ? <Point x={scaleX(value)} label={fmt(value)} color="#fde047" /> : null}

          <line
            x1={scaleX(MIN)}
            y1={HEIGHT / 2 + 46}
            x2={scaleX(MAX)}
            y2={HEIGHT / 2 + 46}
            stroke="#1e293b"
            strokeWidth="1"
          />
          <text x={PAD} y={HEIGHT - 14} fill="#475569" fontSize="11">
            clic en el eje para mover
          </text>
        </svg>
      </div>

      <div className="lab-controls">
        {mode === 'sets' ? (
          <>
            <Slider label="Valor" value={value} min={-5} max={5} step={0.0001} onChange={setValue} />
            <div className="preset-row">
              <button className="chip" onClick={() => setValue(0)}>0</button>
              <button className="chip" onClick={() => setValue(-3)}>−3</button>
              <button className="chip" onClick={() => setValue(0.75)}>0,75</button>
              <button className="chip" onClick={() => setValue(2 / 3)}>2/3</button>
              <button className="chip" onClick={() => setValue(Math.SQRT2)}>√2</button>
              <button className="chip" onClick={() => setValue(Math.PI)}>π</button>
            </div>
          </>
        ) : null}

        {mode === 'order' ? (
          <>
            <Slider label="a" value={a} min={MIN} max={MAX} step={0.1} onChange={setA} color="#fb7185" />
            <Slider label="b" value={b} min={MIN} max={MAX} step={0.1} onChange={setB} color="#22d3ee" />
          </>
        ) : null}

        {(mode === 'absolute' || mode === 'compound') ? (
          <>
            <Slider label="centro a" value={center} min={-9} max={9} step={0.1} onChange={setCenter} />
            <Slider label="radio r" value={radius} min={0.1} max={5} step={0.1} onChange={setRadius} color="#a78bfa" />
          </>
        ) : null}

        {mode === 'interval' ? (
          <>
            <Slider label="extremo a" value={Math.min(a, b)} min={-9} max={9} step={0.5} onChange={setA} />
            <Slider label="extremo b" value={Math.max(a, b)} min={-9} max={9} step={0.5} onChange={setB} />
            <label className="switch-row">
              <input type="checkbox" checked={closedA} onChange={(event) => setClosedA(event.target.checked)} />
              incluir a
            </label>
            <label className="switch-row">
              <input type="checkbox" checked={closedB} onChange={(event) => setClosedB(event.target.checked)} />
              incluir b
            </label>
          </>
        ) : null}

        {mode === 'inequality' ? (
          <>
            <Slider label="coeficiente a" value={a} min={-5} max={5} step={0.5} onChange={setA} />
            <Slider label="término b" value={b} min={-10} max={10} step={0.5} onChange={setB} color="#fb923c" />
          </>
        ) : null}

        {mode === 'sign' ? (
          <>
            <Slider label="raíz 1" value={a} min={-6} max={6} step={0.5} onChange={setA} />
            <Slider label="raíz 2" value={b} min={-6} max={6} step={0.5} onChange={setB} color="#fb923c" />
          </>
        ) : null}
      </div>

      <div className="lab-readout">
        {mode === 'sets' ? (
          <div className="set-ladder">
            {setRows.map((row) => (
              <div key={row.id} className={`set-row ${row.active ? 'active' : ''}`} style={{ '--set-color': row.color } as React.CSSProperties}>
                <span className="set-symbol">{row.id}</span>
                <span className="set-name">
                  {row.id === 'N' && 'naturales'}
                  {row.id === 'N0' && 'naturales con cero'}
                  {row.id === 'Z' && 'enteros'}
                  {row.id === 'Q' && 'racionales'}
                  {row.id === 'I' && 'irracionales'}
                  {row.id === 'R' && 'reales'}
                </span>
                {row.active ? <span className="set-check">✓</span> : null}
              </div>
            ))}
            <div className="lab-note">
              {fmt(value)} pertenece a {setRows.filter((row) => row.active).map((row) => row.id).join(' ⊂ ')}
            </div>
          </div>
        ) : null}

        {mode === 'order' ? (
          <div className="lab-result">
            <strong>{fmt(a)} {a <= b ? '≤' : '>'} {fmt(b)}</strong>
            <span>En la recta, {fmt(Math.min(a, b))} está a la izquierda de {fmt(Math.max(a, b))}.</span>
          </div>
        ) : null}

        {(mode === 'absolute' || mode === 'compound') ? (
          <div className="lab-result">
            <FormulaCard formula={`|x - ${fmt(center)}| \\le ${fmt(radius)}`} label="distancia acotada" />
            <strong>
              x ∈ [{fmt(center - radius)}; {fmt(center + radius)}]
            </strong>
            <span>Todo punto a distancia ≤ {fmt(radius)} del centro.</span>
          </div>
        ) : null}

        {mode === 'interval' ? (
          <div className="lab-result">
            <strong>
              {closedA ? '[' : '('}{fmt(Math.min(a, b))}; {fmt(Math.max(a, b))}{closedB ? ']' : ')'}
            </strong>
            <span>
              {closedA ? '≤' : '<'} x {closedB ? '≤' : '<'} — {closedA ? 'incluye' : 'excluye'} el extremo izquierdo.
            </span>
          </div>
        ) : null}

        {mode === 'inequality' ? (
          <div className="lab-result">
            <strong>
              {a === 0 ? '0x' : `${fmt(a)}x`} {b >= 0 ? '+' : '−'} {fmt(Math.abs(b))} &gt; 0
            </strong>
            <span>
              {a === 0
                ? b > 0
                  ? 'Verdadero para todo x: S = ℝ'
                  : 'Falso para todo x: S = ∅'
                : a > 0
                  ? `x > ${fmt(quotient)} ⇒ (${fmt(quotient)}; +∞)`
                  : `x < ${fmt(quotient)} ⇒ (−∞; ${fmt(quotient)})`}
            </span>
            {a < 0 ? <em>Se invierte el sentido al dividir por un negativo.</em> : null}
          </div>
        ) : null}

        {mode === 'sign' ? (
          <div className="lab-result">
            <strong>
              (x − {fmt(Math.min(a, b))}) / (x − {fmt(Math.max(a, b))}) ≥ 0
            </strong>
            <span>
              S = (−∞; {fmt(Math.min(a, b))}) ∪ [{fmt(Math.max(a, b))}; +∞)
            </span>
            <em>El denominador nunca se incluye: {fmt(Math.max(a, b))} queda excluido.</em>
          </div>
        ) : null}
      </div>

      <div className="lab-footnote">
        <Icon name="bulb" size={15} />
        <span>
          Un intervalo es un conjunto, no un dibujo. El corchete incluye, el paréntesis excluye; el infinito jamás se incluye.
        </span>
      </div>
    </div>
  );
}

function Point({
  x,
  label,
  color,
  open = false
}: {
  x: number;
  label: string;
  color: string;
  open?: boolean;
}) {
  return (
    <g>
      <circle cx={x} cy={HEIGHT / 2} r="10" fill={color} opacity="0.14" />
      <circle
        cx={x}
        cy={HEIGHT / 2}
        r="6"
        fill={open ? '#030711' : color}
        stroke={color}
        strokeWidth="2"
        filter="url(#nl-glow)"
      />
      <text x={x} y={HEIGHT / 2 - 16} textAnchor="middle" fill={color} fontSize="12" fontWeight="700">
        {label}
      </text>
    </g>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  color = '#22d3ee'
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  color?: string;
}) {
  return (
    <label className="slider">
      <span className="slider-label">
        {label} <strong style={{ color }}>{value.toFixed(2).replace('.', ',')}</strong>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ accentColor: color }}
      />
    </label>
  );
}
