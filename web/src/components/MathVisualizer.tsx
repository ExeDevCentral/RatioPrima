import React, { useState } from 'react';
import type { MathExercise } from '../data/exercises';

interface MathVisualizerProps {
  exercise: MathExercise;
}

export default function MathVisualizer({ exercise }: MathVisualizerProps) {
  // Estado para Límites Epsilon-Delta
  const [epsilon, setEpsilon] = useState<number>(0.6);
  const [showProbePoint, setShowProbePoint] = useState<boolean>(true);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  // Estado para Álgebra Lineal / Vectores
  const [c1, setC1] = useState<number>(1);
  const [c2, setC2] = useState<number>(0.5);

  // Estado para Inducción / Sumatorias
  const [nInduction, setNInduction] = useState<number>(5);

  // Estado para Escalar de Orden
  const [scalarC, setScalarC] = useState<number>(-1.5);

  // Render según categoría / id de la lección
  if (exercise.id === 'calc-day01') {
    const delta = epsilon / 3;
    const x0 = 2;
    const L = 5;

    // Dimensiones SVG
    const width = 540;
    const height = 360;
    const padding = 50;

    // Escalas: x de 0 a 4, y de 0 a 8
    const scaleX = (x: number) => padding + ((x - 0) / 4) * (width - 2 * padding);
    const scaleY = (y: number) => height - padding - ((y - 0) / 8) * (height - 2 * padding);

    const xLeft = x0 - delta;
    const xRight = x0 + delta;
    const yBottom = L - epsilon;
    const yTop = L + epsilon;

    const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      const svgX = (clientX / rect.width) * width;
      const svgY = (clientY / rect.height) * height;

      // Despejar x en [0, 4]
      const mathX = ((svgX - padding) / (width - 2 * padding)) * 4;
      const mathY = ((height - padding - svgY) / (height - 2 * padding)) * 8;
      if (mathX >= 0 && mathX <= 4 && mathY >= 0 && mathY <= 8) {
        setHoverCoord({ x: mathX, y: mathY });
      } else {
        setHoverCoord(null);
      }
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#c9d1d9' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#161b22',
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #30363d'
        }}>
          <div>
            <strong style={{ color: '#58a6ff', fontSize: '13px' }}>Banda Epsilon-Delta Reactiva</strong>
            <div style={{ fontSize: '12px', color: '#8b949e' }}>
              f(x) = 3x - 1 | x₀ = 2, L = 5 | Relación: δ = ε / 3
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowProbePoint(!showProbePoint)}
              style={{
                background: showProbePoint ? 'rgba(88, 166, 255, 0.15)' : '#21262d',
                border: `1px solid ${showProbePoint ? '#58a6ff' : '#30363d'}`,
                color: showProbePoint ? '#58a6ff' : '#8b949e',
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showProbePoint ? '● Punto Fijo' : '○ Ocultar'}
            </button>
            <label style={{ fontSize: '12px', color: '#e5a93c' }}>
              ε: <strong>{epsilon.toFixed(2)}</strong>
            </label>
            <input
              type="range"
              min="0.15"
              max="1.5"
              step="0.05"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              style={{ width: '120px', accentColor: '#e5a93c' }}
            />
          </div>
        </div>

        {/* SVG Canvas */}
        <div style={{
          background: '#0d1117',
          border: '1px solid #30363d',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverCoord(null)}
          >
            {/* Cuadrícula de fondo */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#21262d" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width={width} height={height} fill="url(#grid)" />

            {/* Zona Epsilon Horizontal (y in [L-eps, L+eps]) */}
            <rect
              x={padding}
              y={scaleY(yTop)}
              width={width - 2 * padding}
              height={scaleY(yBottom) - scaleY(yTop)}
              fill="rgba(88, 166, 255, 0.12)"
              stroke="rgba(88, 166, 255, 0.4)"
              strokeDasharray="4 2"
            />

            {/* Zona Delta Vertical (x in [x0-delta, x0+delta]) */}
            <rect
              x={scaleX(xLeft)}
              y={padding}
              width={scaleX(xRight) - scaleX(xLeft)}
              height={height - 2 * padding}
              fill="rgba(63, 185, 80, 0.12)"
              stroke="rgba(63, 185, 80, 0.4)"
              strokeDasharray="4 2"
            />

            {/* Rectángulo de Intersección de Seguridad */}
            <rect
              x={scaleX(xLeft)}
              y={scaleY(yTop)}
              width={scaleX(xRight) - scaleX(xLeft)}
              height={scaleY(yBottom) - scaleY(yTop)}
              fill="rgba(188, 140, 255, 0.2)"
              stroke="#bc8cff"
              strokeWidth="1.2"
            />

            {/* Ejes X e Y */}
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#8b949e" strokeWidth="1.5" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#8b949e" strokeWidth="1.5" />

            {/* Marcas de Ejes */}
            {[1, 2, 3, 4].map((v) => (
              <g key={`x-tick-${v}`}>
                <line x1={scaleX(v)} y1={height - padding - 4} x2={scaleX(v)} y2={height - padding + 4} stroke="#8b949e" />
                <text x={scaleX(v)} y={height - padding + 18} fill="#8b949e" fontSize="10" textAnchor="middle">{v}</text>
              </g>
            ))}
            {[2, 4, 6, 8].map((v) => (
              <g key={`y-tick-${v}`}>
                <line x1={padding - 4} y1={scaleY(v)} x2={padding + 4} y2={scaleY(v)} stroke="#8b949e" />
                <text x={padding - 10} y={scaleY(v) + 4} fill="#8b949e" fontSize="10" textAnchor="end">{v}</text>
              </g>
            ))}

            {/* Función f(x) = 3x - 1 */}
            <line
              x1={scaleX(0.5)}
              y1={scaleY(3 * 0.5 - 1)}
              x2={scaleX(3)}
              y2={scaleY(3 * 3 - 1)}
              stroke="#58a6ff"
              strokeWidth="2.5"
            />

            {/* Punto Central (x0, L) = (2, 5) */}
            {showProbePoint && (
              <>
                <line x1={scaleX(x0)} y1={scaleY(L)} x2={scaleX(x0)} y2={height - padding} stroke="#e5a93c" strokeDasharray="3 3" />
                <line x1={padding} y1={scaleY(L)} x2={scaleX(x0)} y2={scaleY(L)} stroke="#e5a93c" strokeDasharray="3 3" />
                <circle cx={scaleX(x0)} cy={scaleY(L)} r="5" fill="#e5a93c" stroke="#0d1117" strokeWidth="1.5" />
                <text x={scaleX(x0) + 8} y={scaleY(L) - 8} fill="#e5a93c" fontSize="11" fontWeight="bold">
                  (2, 5)
                </text>
              </>
            )}

            {/* Marcador Hover interactivo */}
            {hoverCoord && (
              <g>
                <circle cx={scaleX(hoverCoord.x)} cy={scaleY(hoverCoord.y)} r="4" fill="#bc8cff" />
                <line
                  x1={scaleX(hoverCoord.x)}
                  y1={padding}
                  x2={scaleX(hoverCoord.x)}
                  y2={height - padding}
                  stroke="#bc8cff"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
                <line
                  x1={padding}
                  y1={scaleY(hoverCoord.y)}
                  x2={width - padding}
                  y2={scaleY(hoverCoord.y)}
                  stroke="#bc8cff"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
                <rect
                  x={Math.min(scaleX(hoverCoord.x) + 8, width - 130)}
                  y={Math.max(scaleY(hoverCoord.y) - 26, padding + 4)}
                  width="115"
                  height="22"
                  fill="#161b22"
                  stroke="#bc8cff"
                  rx="4"
                />
                <text
                  x={Math.min(scaleX(hoverCoord.x) + 14, width - 124)}
                  y={Math.max(scaleY(hoverCoord.y) - 11, padding + 19)}
                  fill="#f0f6fc"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  x:{hoverCoord.x.toFixed(2)}, y:{hoverCoord.y.toFixed(2)}
                </text>
              </g>
            )}

            {/* Etiquetas de cotas */}
            <text x={scaleX(xRight)} y={height - padding + 32} fill="#3fb950" fontSize="10" textAnchor="middle">
              2 + δ ({xRight.toFixed(2)})
            </text>
            <text x={scaleX(xLeft)} y={height - padding + 32} fill="#3fb950" fontSize="10" textAnchor="middle">
              2 - δ ({xLeft.toFixed(2)})
            </text>
            <text x={padding + 8} y={scaleY(yTop) - 4} fill="#58a6ff" fontSize="10">
              L + ε ({yTop.toFixed(2)})
            </text>
            <text x={padding + 8} y={scaleY(yBottom) + 12} fill="#58a6ff" fontSize="10">
              L - ε ({yBottom.toFixed(2)})
            </text>
          </svg>
        </div>

        {/* Telemetría Analítica */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          fontSize: '12px'
        }}>
          <div style={{ background: '#161b22', padding: '8px 12px', borderRadius: '6px', border: '1px solid #30363d' }}>
            <span style={{ color: '#8b949e' }}>Tolerancia vertical:</span>
            <div style={{ color: '#58a6ff', fontWeight: 600, fontSize: '13px' }}>ε = {epsilon.toFixed(3)}</div>
          </div>
          <div style={{ background: '#161b22', padding: '8px 12px', borderRadius: '6px', border: '1px solid #30363d' }}>
            <span style={{ color: '#8b949e' }}>Vecindad de dominio:</span>
            <div style={{ color: '#3fb950', fontWeight: 600, fontSize: '13px' }}>δ = ε/3 = {delta.toFixed(3)}</div>
          </div>
          <div style={{ background: '#161b22', padding: '8px 12px', borderRadius: '6px', border: '1px solid #30363d' }}>
            <span style={{ color: '#8b949e' }}>Condición Cauchy:</span>
            <div style={{ color: '#bc8cff', fontWeight: 600, fontSize: '13px' }}>3|x - 2| &lt; {epsilon.toFixed(3)} ✓</div>
          </div>
        </div>
      </div>
    );
  }

  // Render para Álgebra Lineal: Vectores en R2
  if (exercise.id === 'lin-day01') {
    const v1 = [1, 2];
    const v2 = [3, 4];
    const w = [c1 * v1[0] + c2 * v2[0], c1 * v1[1] + c2 * v2[1]];

    const width = 540;
    const height = 360;
    const originX = width / 2;
    const originY = height / 2;
    const scale = 36; // px por unidad

    const toSvgX = (x: number) => originX + x * scale;
    const toSvgY = (y: number) => originY - y * scale;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#c9d1d9' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#161b22',
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #30363d'
        }}>
          <div>
            <strong style={{ color: '#58a6ff', fontSize: '13px' }}>Espacio Vectorial ℝ² · Combinación Lineal</strong>
            <div style={{ fontSize: '12px', color: '#8b949e' }}>
              w = c₁·v₁ + c₂·v₂ | v₁ = (1, 2), v₂ = (3, 4) | det(A) = -2 ≠ 0
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <label style={{ fontSize: '12px', color: '#58a6ff' }}>
              c₁: <strong>{c1.toFixed(1)}</strong>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.2"
                value={c1}
                onChange={(e) => setC1(parseFloat(e.target.value))}
                style={{ marginLeft: '6px', width: '70px', accentColor: '#58a6ff' }}
              />
            </label>
            <label style={{ fontSize: '12px', color: '#3fb950' }}>
              c₂: <strong>{c2.toFixed(1)}</strong>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.2"
                value={c2}
                onChange={(e) => setC2(parseFloat(e.target.value))}
                style={{ marginLeft: '6px', width: '70px', accentColor: '#3fb950' }}
              />
            </label>
          </div>
        </div>

        {/* Canvas Vectorial */}
        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', overflow: 'hidden' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            <defs>
              <pattern id="vec-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#21262d" strokeWidth="0.8" />
              </pattern>
              <marker id="arrow-v1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#58a6ff" />
              </marker>
              <marker id="arrow-v2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#3fb950" />
              </marker>
              <marker id="arrow-w" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <polygon points="0 0, 6 3, 0 6" fill="#e5a93c" />
              </marker>
            </defs>
            <rect width={width} height={height} fill="url(#vec-grid)" />

            {/* Ejes cartesianos */}
            <line x1="0" y1={originY} x2={width} y2={originY} stroke="#30363d" strokeWidth="1.5" />
            <line x1={originX} y1="0" x2={originX} y2={height} stroke="#30363d" strokeWidth="1.5" />

            {/* Paralelogramo generado por c1*v1 y c2*v2 */}
            <polygon
              points={`
                ${toSvgX(0)},${toSvgY(0)}
                ${toSvgX(c1 * v1[0])},${toSvgY(c1 * v1[1])}
                ${toSvgX(w[0])},${toSvgY(w[1])}
                ${toSvgX(c2 * v2[0])},${toSvgY(c2 * v2[1])}
              `}
              fill="rgba(229, 169, 60, 0.12)"
              stroke="rgba(229, 169, 60, 0.4)"
              strokeDasharray="3 3"
            />

            {/* Vector v1 */}
            <line
              x1={toSvgX(0)}
              y1={toSvgY(0)}
              x2={toSvgX(v1[0])}
              y2={toSvgY(v1[1])}
              stroke="#58a6ff"
              strokeWidth="2.5"
              markerEnd="url(#arrow-v1)"
            />
            <text x={toSvgX(v1[0]) + 8} y={toSvgY(v1[1]) - 4} fill="#58a6ff" fontSize="11" fontWeight="bold">v₁ (1, 2)</text>

            {/* Vector v2 */}
            <line
              x1={toSvgX(0)}
              y1={toSvgY(0)}
              x2={toSvgX(v2[0])}
              y2={toSvgY(v2[1])}
              stroke="#3fb950"
              strokeWidth="2.5"
              markerEnd="url(#arrow-v2)"
            />
            <text x={toSvgX(v2[0]) + 8} y={toSvgY(v2[1]) - 4} fill="#3fb950" fontSize="11" fontWeight="bold">v₂ (3, 4)</text>

            {/* Vector w resultante */}
            <line
              x1={toSvgX(0)}
              y1={toSvgY(0)}
              x2={toSvgX(w[0])}
              y2={toSvgY(w[1])}
              stroke="#e5a93c"
              strokeWidth="3"
              markerEnd="url(#arrow-w)"
            />
            <text x={toSvgX(w[0]) + 8} y={toSvgY(w[1]) - 6} fill="#e5a93c" fontSize="12" fontWeight="bold">
              w ({w[0].toFixed(1)}, {w[1].toFixed(1)})
            </text>

            {/* Origen */}
            <circle cx={originX} cy={originY} r="4" fill="#8b949e" />
          </svg>
        </div>

        {/* Readout analítico */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          fontSize: '12px'
        }}>
          <div style={{ background: '#161b22', padding: '8px 12px', borderRadius: '6px', border: '1px solid #30363d' }}>
            <span style={{ color: '#8b949e' }}>Matriz de Base:</span>
            <div style={{ color: '#58a6ff', fontWeight: 600 }}>det([v₁ v₂]) = -2.00</div>
          </div>
          <div style={{ background: '#161b22', padding: '8px 12px', borderRadius: '6px', border: '1px solid #30363d' }}>
            <span style={{ color: '#8b949e' }}>Núcleo (Kernel):</span>
            <div style={{ color: '#3fb950', fontWeight: 600 }}>ker(T) = &#123; (0, 0) &#125;</div>
          </div>
          <div style={{ background: '#161b22', padding: '8px 12px', borderRadius: '6px', border: '1px solid #30363d' }}>
            <span style={{ color: '#8b949e' }}>Estado de Cobertura:</span>
            <div style={{ color: '#bc8cff', fontWeight: 600 }}>Genera todo ℝ² (Rango 2)</div>
          </div>
        </div>
      </div>
    );
  }

  // Render para Matemática Discreta: Inducción & Sumatoria de Gauss
  if (exercise.id === 'disc-day01') {
    const sumTotal = (nInduction * (nInduction + 1)) / 2;
    const width = 540;
    const height = 300;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#c9d1d9' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#161b22',
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #30363d'
        }}>
          <div>
            <strong style={{ color: '#3fb950', fontSize: '13px' }}>Prueba Geométrica de la Sumatoria de Gauss</strong>
            <div style={{ fontSize: '12px', color: '#8b949e' }}>
              ∑ i = n(n + 1) / 2 | Duplicación en rectángulo n × (n + 1)
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '12px', color: '#3fb950' }}>
              n (límite superior): <strong>{nInduction}</strong>
            </label>
            <input
              type="range"
              min="2"
              max="9"
              step="1"
              value={nInduction}
              onChange={(e) => setNInduction(parseInt(e.target.value, 10))}
              style={{ width: '100px', accentColor: '#3fb950' }}
            />
          </div>
        </div>

        {/* Canvas de Bloques Discretos */}
        <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '16px' }}>
          <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
            {Array.from({ length: nInduction }).map((_, row) => {
              const countInRow = row + 1;
              return Array.from({ length: countInRow }).map((__, col) => {
                const blockSize = 24;
                const gap = 3;
                const startX = 60 + col * (blockSize + gap);
                const startY = 40 + row * (blockSize + gap);
                return (
                  <rect
                    key={`b-${row}-${col}`}
                    x={startX}
                    y={startY}
                    width={blockSize}
                    height={blockSize}
                    fill="#58a6ff"
                    rx="3"
                  />
                );
              });
            })}

            {/* Malla complementaria para formar n*(n+1) */}
            {Array.from({ length: nInduction }).map((_, row) => {
              const complementCount = nInduction - row;
              return Array.from({ length: complementCount }).map((__, col) => {
                const blockSize = 24;
                const gap = 3;
                const startX = 60 + (row + 1 + col) * (blockSize + gap);
                const startY = 40 + row * (blockSize + gap);
                return (
                  <rect
                    key={`comp-${row}-${col}`}
                    x={startX}
                    y={startY}
                    width={blockSize}
                    height={blockSize}
                    fill="none"
                    stroke="#3fb950"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                    rx="3"
                  />
                );
              });
            })}

            <text x="340" y="80" fill="#e6edf3" fontSize="13" fontWeight="bold">
              Rectángulo total: {nInduction} × {nInduction + 1} = {nInduction * (nInduction + 1)}
            </text>
            <text x="340" y="105" fill="#58a6ff" fontSize="12">
              ■ Suma directa (azul): {sumTotal} bloques
            </text>
            <text x="340" y="130" fill="#3fb950" fontSize="12">
              □ Espejo complementario: {sumTotal} bloques
            </text>
            <text x="340" y="165" fill="#e5a93c" fontSize="12" fontWeight="bold">
              Área triangular = [n(n+1)] / 2
            </text>
          </svg>
        </div>

        <div style={{
          background: '#161b22',
          padding: '10px 14px',
          borderRadius: '6px',
          border: '1px solid #30363d',
          fontSize: '12px'
        }}>
          <span style={{ color: '#8b949e' }}>Paso Inductivo Verificado: </span>
          <strong style={{ color: '#3fb950' }}>P({nInduction}) = {sumTotal}</strong>
          {' ⟹ '}
          <span style={{ color: '#58a6ff' }}>
            P({nInduction + 1}) = {sumTotal} + ({nInduction + 1}) = {sumTotal + nInduction + 1}
          </span>
          {' = '}
          <strong style={{ color: '#e5a93c' }}>
            [({nInduction + 1})({nInduction + 2})]/2
          </strong>
        </div>
      </div>
    );
  }

  // Render por defecto para Axiomas de Orden / Campo
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', color: '#c9d1d9' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#161b22',
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #30363d'
      }}>
        <div>
          <strong style={{ color: '#e5a93c', fontSize: '13px' }}>Recta Real · Cono Positivo y Tricotomía</strong>
          <div style={{ fontSize: '12px', color: '#8b949e' }}>
            Inversión formal de la desigualdad bajo producto por escalar c
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '12px', color: scalarC < 0 ? '#f85149' : '#3fb950' }}>
            Escalar c: <strong>{scalarC.toFixed(1)}</strong>
          </label>
          <input
            type="range"
            min="-3"
            max="3"
            step="0.5"
            value={scalarC}
            onChange={(e) => setScalarC(parseFloat(e.target.value))}
            style={{ width: '110px', accentColor: scalarC < 0 ? '#f85149' : '#3fb950' }}
          />
        </div>
      </div>

      <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '24px' }}>
        <svg viewBox="0 0 500 160" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Recta Real */}
          <line x1="30" y1="80" x2="470" y2="80" stroke="#8b949e" strokeWidth="2" />
          <polygon points="475 80, 465 75, 465 85" fill="#8b949e" />
          <polygon points="25 80, 35 75, 35 85" fill="#8b949e" />

          {/* Origen 0 */}
          <circle cx="250" cy="80" r="5" fill="#e6edf3" />
          <text x="250" y="105" fill="#e6edf3" fontSize="12" textAnchor="middle" fontWeight="bold">0</text>

          {/* Regiones Tricotomía */}
          <text x="140" y="45" fill="#f85149" fontSize="11" textAnchor="middle">-P (Reales Negativos)</text>
          <text x="360" y="45" fill="#3fb950" fontSize="11" textAnchor="middle">P (Cono Positivo)</text>

          {/* Valores a = 1, b = 2 */}
          <circle cx="300" cy="80" r="4" fill="#58a6ff" />
          <text x="300" y="105" fill="#58a6ff" fontSize="11" textAnchor="middle">a (1)</text>

          <circle cx="350" cy="80" r="4" fill="#58a6ff" />
          <text x="350" y="105" fill="#58a6ff" fontSize="11" textAnchor="middle">b (2)</text>

          {/* Valores c*a y c*b */}
          {scalarC !== 0 && (
            <>
              <circle cx={250 + 50 * scalarC} cy="60" r="5" fill={scalarC < 0 ? '#f85149' : '#3fb950'} />
              <text x={250 + 50 * scalarC} y="40" fill={scalarC < 0 ? '#f85149' : '#3fb950'} fontSize="11" textAnchor="middle">
                c·a ({(1 * scalarC).toFixed(1)})
              </text>

              <circle cx={250 + 100 * scalarC} cy="60" r="5" fill={scalarC < 0 ? '#f85149' : '#3fb950'} />
              <text x={250 + 100 * scalarC} y="40" fill={scalarC < 0 ? '#f85149' : '#3fb950'} fontSize="11" textAnchor="middle">
                c·b ({(2 * scalarC).toFixed(1)})
              </text>
            </>
          )}
        </svg>
      </div>

      <div style={{
        background: '#161b22',
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #30363d',
        fontSize: '12px'
      }}>
        Estado formal: {scalarC < 0 ? (
          <span style={{ color: '#f85149', fontWeight: 600 }}>
            c &lt; 0 ⟹ (-c) ∈ P ⟹ c·a &gt; c·b (Sentido invertido rigurosamente)
          </span>
        ) : scalarC > 0 ? (
          <span style={{ color: '#3fb950', fontWeight: 600 }}>
            c &gt; 0 ⟹ c ∈ P ⟹ c·a &lt; c·b (Sentido preservado por monotonía)
          </span>
        ) : (
          <span style={{ color: '#e5a93c', fontWeight: 600 }}>
            c = 0 ⟹ c·a = c·b = 0 (Colapso por anulación del producto)
          </span>
        )}
      </div>
    </div>
  );
}
