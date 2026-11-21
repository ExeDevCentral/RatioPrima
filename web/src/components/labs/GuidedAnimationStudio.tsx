import React, { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../ui/Icon';
import { KaTeXInline } from '../KaTeXView';

export type StudioTopic = 'trig' | 'shapes' | 'equations' | 'inequalities' | 'logic';

interface GuideCue {
  from: number;
  to: number;
  title: string;
  text: string;
  formula: string;
}

const DURATION = 10.0; // 10 segundos por ciclo animado

const TOPIC_META: Record<
  StudioTopic,
  {
    label: string;
    subtitle: string;
    cues: GuideCue[];
  }
> = {
  trig: {
    label: 'Trigonometría',
    subtitle: 'Hipotenusa, cateto opuesto, adyacente, ángulos y escala en vivo',
    cues: [
      {
        from: 0,
        to: 2.5,
        title: '1. Ubicá el ángulo α y la Hipotenusa',
        text: 'La hipotenusa (dorado) siempre está frente al ángulo recto de 90°. Es el lado más largo.',
        formula: 'H = \\text{lado opuesto a } 90^\\circ'
      },
      {
        from: 2.5,
        to: 5.0,
        title: '2. Diferenciá Opuesto y Adyacente',
        text: 'Frente a α está el Cateto Opuesto (rosa). Tocando α está el Cateto Adyacente (cian).',
        formula: '\\operatorname{sen}\\alpha = \\frac{CO}{H},\\quad \\cos\\alpha = \\frac{CA}{H}'
      },
      {
        from: 5.0,
        to: 7.5,
        title: '3. Jugá con la Escala k',
        text: 'Si multiplicás el triángulo por k, los lados crecen, ¡pero las razones sen(α) y cos(α) NO cambian!',
        formula: '\\frac{k\\cdot CO}{k\\cdot H} = \\frac{CO}{H}'
      },
      {
        from: 7.5,
        to: 10.0,
        title: '4. Círculo Unitario e Identidad',
        text: 'Cuando H = 1, los catetos son exactamente (cos α, sen α) y cumplen Pitágoras.',
        formula: '\\operatorname{sen}^2\\alpha + \\cos^2\\alpha = 1'
      }
    ]
  },
  shapes: {
    label: 'Triángulo, Círculo y Cuadrado',
    subtitle: 'Jugá con la escala y compará perímetros, áreas y Pitágoras',
    cues: [
      {
        from: 0,
        to: 2.5,
        title: '1. El Cuadrado a escala L',
        text: 'Si duplicás el lado L, el perímetro se duplica (×2) pero el área se cuadruplica (×4).',
        formula: 'P = 4L,\\quad A = L^2'
      },
      {
        from: 2.5,
        to: 5.0,
        title: '2. El Círculo y el Radián',
        text: 'Un radián es el ángulo cuyo arco mide exactamente igual que el radio r.',
        formula: 'C = 2\\pi r,\\quad A = \\pi r^2'
      },
      {
        from: 5.0,
        to: 7.5,
        title: '3. Triángulo y Teorema de Pitágoras',
        text: 'El área del cuadrado sobre la hipotenusa iguala la suma de las áreas sobre los catetos.',
        formula: 'a^2 + b^2 = c^2'
      },
      {
        from: 7.5,
        to: 10.0,
        title: '4. Proporción de Escala',
        text: 'En toda figura 2D, escalar por k multiplica longitudes por k y áreas por k².',
        formula: 'A(k\\cdot L) = k^2\\cdot A(L)'
      }
    ]
  },
  equations: {
    label: 'Ecuaciones',
    subtitle: 'Balanza algebraica HD y despeje equivalente paso a paso',
    cues: [
      {
        from: 0,
        to: 2.5,
        title: '1. Planteo en Equilibrio',
        text: 'Una ecuación ax + b = c es una balanza nivelada: ambos platillos pesan exactamente lo mismo.',
        formula: 'ax + b = c'
      },
      {
        from: 2.5,
        to: 5.0,
        title: '2. Operar en ambos miembros',
        text: 'Para quitar +b, restamos b en los dos platillos a la vez para no romper el equilibrio.',
        formula: 'ax + b - b = c - b \\implies ax = c - b'
      },
      {
        from: 5.0,
        to: 7.5,
        title: '3. Despejar la incógnita',
        text: 'Dividimos ambos platillos por a (con a ≠ 0) y encontramos el valor exacto de x.',
        formula: 'x = \\frac{c - b}{a}'
      },
      {
        from: 7.5,
        to: 10.0,
        title: '4. Verificación en vivo',
        text: 'Reemplazando x en la ecuación original, la aguja central vuelve exactamente a 0°.',
        formula: 'S = \\{x_0\\}'
      }
    ]
  },
  inequalities: {
    label: 'Desigualdades',
    subtitle: 'Intervalos, módulo como distancia y giro de flecha por negativo',
    cues: [
      {
        from: 0,
        to: 2.5,
        title: '1. Región en la Recta Real',
        text: 'A diferencia de una ecuación, una inecuación pinta todo un intervalo infinito o acotado.',
        formula: '|x - c| \\le r \\iff c-r \\le x \\le c+r'
      },
      {
        from: 2.5,
        to: 5.0,
        title: '2. Paréntesis vs Corchetes',
        text: 'Punto relleno [ ] incluye el extremo; punto hueco ( ) lo excluye.',
        formula: '[a; b) = \\{x \\mid a \\le x < b\\}'
      },
      {
        from: 5.0,
        to: 7.5,
        title: '3. Multiplicar por Negativo',
        text: '¡Atención! Multiplicar o dividir por un negativo refleja la recta e invierte el signo (< pasa a >).',
        formula: 'a < b \\implies -a > -b'
      },
      {
        from: 7.5,
        to: 10.0,
        title: '4. Unión e Intersección',
        text: 'Menor que r (|x-c|<r) es intersección; mayor que r (|x-c|>r) es unión de dos semirrectas.',
        formula: '(-\\infty; c-r) \\cup (c+r; +\\infty)'
      }
    ]
  },
  logic: {
    label: 'Lógica y Conjuntos',
    subtitle: 'Diagramas de Venn HD, conectivos ∧, ∨, ⇒ y tablas en vivo',
    cues: [
      {
        from: 0,
        to: 2.5,
        title: '1. Proposiciones P y Q',
        text: 'Cada proposición es Verdadera (V) o Falsa (F). Usá los botones P y Q para probar casos.',
        formula: 'P, Q \\in \\{\\text{V}, \\text{F}\\}'
      },
      {
        from: 2.5,
        to: 5.0,
        title: '2. Conjunción (P ∧ Q) — Intersección',
        text: 'Solo es Verdadera cuando P y Q son verdaderas al mismo tiempo (zona central).',
        formula: 'P \\land Q \\iff x \\in A \\cap B'
      },
      {
        from: 5.0,
        to: 7.5,
        title: '3. Disyunción (P ∨ Q) — Unión',
        text: 'Es Verdadera si al menos una de las dos se cumple (toda la unión de los círculos).',
        formula: 'P \\lor Q \\iff x \\in A \\cup B'
      },
      {
        from: 7.5,
        to: 10.0,
        title: '4. Implicación (P ⇒ Q)',
        text: 'Solo es Falsa si P es Verdadera y Q es Falsa (una promesa rota).',
        formula: 'P \\implies Q \\equiv \\neg P \\lor Q'
      }
    ]
  }
};

export default function GuidedAnimationStudio({
  initialTopic = 'trig'
}: {
  initialTopic?: StudioTopic;
}) {
  const [topic, setTopic] = useState<StudioTopic>(initialTopic);
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  // Interactive controls per topic
  const [angleDeg, setAngleDeg] = useState(37);
  const [scaleK, setScaleK] = useState(1.2);
  const [eqA, setEqA] = useState(2);
  const [eqB, setEqB] = useState(-2);
  const [eqC, setEqC] = useState(6);
  const [ineqCenter, setIneqCenter] = useState(1);
  const [ineqRadius, setIneqRadius] = useState(2.5);
  const [flipNeg, setFlipNeg] = useState(false);
  const [propP, setPropP] = useState(true);
  const [propQ, setPropQ] = useState(true);
  const [logicOp, setLogicOp] = useState<'AND' | 'OR' | 'IMP'>('AND');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef({
    topic,
    playing,
    elapsed,
    angleDeg,
    scaleK,
    eqA,
    eqB,
    eqC,
    ineqCenter,
    ineqRadius,
    flipNeg,
    propP,
    propQ,
    logicOp
  });

  useEffect(() => {
    stateRef.current = {
      topic,
      playing,
      elapsed,
      angleDeg,
      scaleK,
      eqA,
      eqB,
      eqC,
      ineqCenter,
      ineqRadius,
      flipNeg,
      propP,
      propQ,
      logicOp
    };
  }, [
    topic,
    playing,
    elapsed,
    angleDeg,
    scaleK,
    eqA,
    eqB,
    eqC,
    ineqCenter,
    ineqRadius,
    flipNeg,
    propP,
    propQ,
    logicOp
  ]);

  useEffect(() => {
    setElapsed(0);
    setPlaying(true);
  }, [topic]);

  // 10-second loop timer
  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setElapsed((prev) => (prev + dt) % DURATION);
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [playing]);

  // HD Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2.5, window.devicePixelRatio || 1);
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

    const glowLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      color: string,
      lw = 3,
      blur = 14
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    };

    const drawBadge = (x: number, y: number, text: string, color: string) => {
      ctx.save();
      ctx.font = '700 12px ui-monospace, SFMono-Regular, monospace';
      const w = ctx.measureText(text).width + 14;
      ctx.fillStyle = 'rgba(4, 9, 20, 0.88)';
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - 12, w, 24, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, x, y);
      ctx.restore();
    };

    const drawGrid = () => {
      const bg = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.78
      );
      bg.addColorStop(0, '#0c1b33');
      bg.addColorStop(0.6, '#060d1b');
      bg.addColorStop(1, '#02050c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      const step = 36;
      for (let x = (width / 2) % step; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = (height / 2) % step; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawFrame = () => {
      const s = stateRef.current;
      const t = s.elapsed; // 0..10
      const phase = Math.floor(t / 2.5); // 0, 1, 2, 3
      const pulse = 0.5 + 0.5 * Math.sin(t * 4);

      drawGrid();

      if (s.topic === 'trig') {
        const rad = (s.angleDeg * Math.PI) / 180;
        const unitRadius = Math.min(width, height) * 0.28;
        // Phase 2 smoothly animates scale if user isn't overriding, or uses user scaleK
        const animScale = phase === 2 ? s.scaleK * (0.85 + 0.25 * Math.sin((t - 5) * 2.5)) : s.scaleK;
        const H = unitRadius * animScale * 0.92;
        const CA = H * Math.cos(rad);
        const CO = H * Math.sin(rad);

        const originX = width * 0.26;
        const originY = height * 0.72;
        const rightX = originX + CA;
        const rightY = originY;
        const topX = rightX;
        const topY = originY - CO;

        // Phase 3: Unit circle backdrop
        if (phase === 3 || s.scaleK <= 1.35) {
          ctx.save();
          ctx.beginPath();
          ctx.strokeStyle = phase === 3 ? 'rgba(167, 139, 250, 0.7)' : 'rgba(167, 139, 250, 0.22)';
          ctx.lineWidth = phase === 3 ? 2.2 : 1.2;
          ctx.setLineDash([5, 5]);
          ctx.arc(originX, originY, H, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Fill subtle triangle interior
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(rightX, rightY);
        ctx.lineTo(topX, topY);
        ctx.closePath();
        ctx.fillStyle = 'rgba(34, 211, 238, 0.07)';
        ctx.fill();

        // Right angle square marker
        const sq = 16;
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.65)';
        ctx.lineWidth = 1.6;
        ctx.strokeRect(rightX - sq, rightY - sq, sq, sq);

        // Angle α arc
        ctx.beginPath();
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2.6;
        ctx.arc(originX, originY, 36, -rad, 0);
        ctx.stroke();
        drawBadge(originX + 58, originY - 18, `α = ${s.angleDeg}°`, '#a78bfa');

        // Angle β = 90 - α arc
        ctx.beginPath();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.arc(topX, topY, 26, Math.PI / 2, Math.PI - rad);
        ctx.stroke();
        drawBadge(topX - 42, topY + 26, `β = ${90 - s.angleDeg}°`, '#34d399');

        // Sides with phase-driven emphasis
        const hWidth = phase === 0 ? 4 + pulse * 2 : 3.2;
        const cWidth = phase === 1 ? 4 + pulse * 2 : 3.2;

        glowLine(originX, originY, topX, topY, '#fde047', hWidth, phase === 0 ? 22 : 10);
        glowLine(originX, originY, rightX, rightY, '#22d3ee', cWidth, phase === 1 ? 22 : 10);
        glowLine(rightX, rightY, topX, topY, '#fb7185', cWidth, phase === 1 ? 22 : 10);

        const lenH = s.scaleK;
        const lenCA = lenH * Math.cos(rad);
        const lenCO = lenH * Math.sin(rad);

        drawBadge((originX + topX) / 2 - 58, (originY + topY) / 2 - 26, `Hipotenusa H = ${lenH.toFixed(2)}`, '#fde047');
        drawBadge((originX + rightX) / 2, originY + 22, `Cateto Adyacente CA = ${lenCA.toFixed(2)}`, '#22d3ee');
        drawBadge(rightX + 86, (rightY + topY) / 2, `Opuesto CO = ${lenCO.toFixed(2)}`, '#fb7185');

        // Live invariant ratios HUD
        drawBadge(
          width * 0.78,
          36,
          `sen(α) = CO/H = ${Math.sin(rad).toFixed(3)} · cos(α) = ${Math.cos(rad).toFixed(3)}`,
          '#e2e8f0'
        );
      } else if (s.topic === 'shapes') {
        const k = phase === 3 ? s.scaleK * (0.85 + 0.25 * Math.sin(t * 2.5)) : s.scaleK;
        const base = 54 * k;

        // 1. Square (left)
        const sqX = width * 0.18 - base / 2;
        const sqY = height * 0.5 - base / 2;
        ctx.fillStyle = 'rgba(34, 211, 238, 0.12)';
        ctx.fillRect(sqX, sqY, base, base);
        glowLine(sqX, sqY, sqX + base, sqY, '#22d3ee', phase === 0 ? 4 : 2.5);
        glowLine(sqX + base, sqY, sqX + base, sqY + base, '#22d3ee', phase === 0 ? 4 : 2.5);
        glowLine(sqX + base, sqY + base, sqX, sqY + base, '#22d3ee', phase === 0 ? 4 : 2.5);
        glowLine(sqX, sqY + base, sqX, sqY, '#22d3ee', phase === 0 ? 4 : 2.5);
        drawBadge(width * 0.18, sqY + base + 24, `Cuadrado L=${k.toFixed(1)} · A=${(k * k).toFixed(2)}`, '#22d3ee');

        // 2. Circle (center)
        const cx = width * 0.5;
        const cy = height * 0.5;
        const r = base * 0.58;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(167, 139, 250, 0.12)';
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = phase === 1 ? 4 : 2.5;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        // 1 radian animated sweep
        const sweepAngle = phase === 1 ? Math.min(1, ((t - 2.5) / 2.5) * 1.2) : 1;
        glowLine(cx, cy, cx + r, cy, '#fde047', 2.4);
        glowLine(cx, cy, cx + Math.cos(-sweepAngle) * r, cy + Math.sin(-sweepAngle) * r, '#fde047', 2.4);
        drawBadge(cx, cy + r + 24, `Círculo r=${(k * 0.5).toFixed(2)} · A=${(Math.PI * (k * 0.5) ** 2).toFixed(2)}`, '#a78bfa');

        // 3. Right Triangle + Pythagoras squares (right)
        const tx = width * 0.78;
        const ty = height * 0.62;
        const ta = base * 0.75;
        const tb = base * 0.56;
        ctx.beginPath();
        ctx.moveTo(tx - ta / 2, ty);
        ctx.lineTo(tx + ta / 2, ty);
        ctx.lineTo(tx + ta / 2, ty - tb);
        ctx.closePath();
        ctx.fillStyle = 'rgba(52, 211, 153, 0.16)';
        ctx.fill();
        glowLine(tx - ta / 2, ty, tx + ta / 2, ty, '#34d399', phase === 2 ? 4 : 2.5);
        glowLine(tx + ta / 2, ty, tx + ta / 2, ty - tb, '#fb7185', phase === 2 ? 4 : 2.5);
        glowLine(tx - ta / 2, ty, tx + ta / 2, ty - tb, '#fde047', phase === 2 ? 4 : 2.5);
        drawBadge(tx, ty + 24, `Triángulo 3-4-5 · Escala ${k.toFixed(1)}x`, '#34d399');
      } else if (s.topic === 'equations') {
        // Animated Balance Scale for a*x + b = c
        const sol = (s.eqC - s.eqB) / (s.eqA || 1);
        const tilt = phase === 0 ? 0 : phase === 1 ? Math.sin((t - 2.5) * 3) * 0.06 : 0;
        const cx = width * 0.5;
        const pivotY = height * 0.44;
        const arm = Math.min(width * 0.3, 170);

        // Fulcrum pillar
        glowLine(cx, height * 0.82, cx, pivotY, '#64748b', 4, 0);
        ctx.beginPath();
        ctx.fillStyle = '#22d3ee';
        ctx.arc(cx, pivotY, 8, 0, Math.PI * 2);
        ctx.fill();

        const lx = cx - Math.cos(tilt) * arm;
        const ly = pivotY - Math.sin(tilt) * arm;
        const rx = cx + Math.cos(tilt) * arm;
        const ry = pivotY + Math.sin(tilt) * arm;
        glowLine(lx, ly, rx, ry, '#22d3ee', 4, 14);

        // Left & Right pans
        const panDrop = 52;
        glowLine(lx, ly, lx, ly + panDrop, 'rgba(148,163,184,0.6)', 1.5, 0);
        glowLine(rx, ry, rx, ry + panDrop, 'rgba(148,163,184,0.6)', 1.5, 0);
        glowLine(lx - 54, ly + panDrop, lx + 54, ly + panDrop, '#22d3ee', 3.5, 10);
        glowLine(rx - 54, ry + panDrop, rx + 54, ry + panDrop, '#a78bfa', 3.5, 10);

        const leftText =
          phase >= 2
            ? `x`
            : phase === 1
              ? `${s.eqA}x`
              : `${s.eqA}x ${s.eqB >= 0 ? '+' : '-'} ${Math.abs(s.eqB)}`;
        const rightText =
          phase >= 2
            ? `${sol.toFixed(2)}`
            : phase === 1
              ? `${s.eqC - s.eqB}`
              : `${s.eqC}`;

        drawBadge(lx, ly + panDrop - 24, leftText, '#22d3ee');
        drawBadge(rx, ry + panDrop - 24, rightText, '#a78bfa');
        drawBadge(cx, 38, `Solución exacta: x = ${sol.toFixed(2)}`, '#34d399');
      } else if (s.topic === 'inequalities') {
        // Number line HD with animated flip on negative multiply
        const midX = width * 0.5;
        const lineY = height * 0.52;
        const span = Math.min(width * 0.4, 240);
        const unit = span / 6;

        glowLine(midX - span - 24, lineY, midX + span + 24, lineY, 'rgba(148, 163, 184, 0.6)', 2, 0);
        for (let i = -6; i <= 6; i++) {
          const px = midX + i * unit;
          ctx.beginPath();
          ctx.strokeStyle = i === 0 ? '#fde047' : 'rgba(148,163,184,0.4)';
          ctx.moveTo(px, lineY - 7);
          ctx.lineTo(px, lineY + 7);
          ctx.stroke();
          if (i % 2 === 0) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = '11px ui-monospace, monospace';
            ctx.textAlign = 'center';
            ctx.fillText(String(i), px, lineY + 24);
          }
        }

        const isFlipped = s.flipNeg || phase === 2;
        const c = isFlipped ? -s.ineqCenter : s.ineqCenter;
        const a = Math.max(-6, Math.min(6, c - s.ineqRadius));
        const b = Math.max(-6, Math.min(6, c + s.ineqRadius));
        const ax = midX + a * unit;
        const bx = midX + b * unit;

        if (phase === 3) {
          // Union outside [a, b]
          glowLine(midX - span - 20, lineY, ax, lineY, '#fb923c', 6, 16);
          glowLine(bx, lineY, midX + span + 20, lineY, '#fb923c', 6, 16);
          drawBadge(midX, 42, `|x - ${c.toFixed(1)}| > ${s.ineqRadius.toFixed(1)} (Unión)`, '#fb923c');
        } else {
          glowLine(ax, lineY, bx, lineY, isFlipped ? '#fb7185' : '#34d399', 6, 16);
          drawBadge(
            midX,
            42,
            isFlipped
              ? `Reflejado por (-1): [${a.toFixed(1)} ; ${b.toFixed(1)}]`
              : `Intervalo [${a.toFixed(1)} ; ${b.toFixed(1)}]`,
            isFlipped ? '#fb7185' : '#34d399'
          );
        }

        for (const px of [ax, bx]) {
          ctx.beginPath();
          ctx.fillStyle = phase === 1 ? '#040914' : '#34d399';
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 2.5;
          ctx.arc(px, lineY, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      } else {
        // Logic Venn Diagrams
        const cx = width * 0.5;
        const cy = height * 0.52;
        const r = Math.min(width, height) * 0.24;
        const dx = r * 0.55;

        const op = phase === 1 ? 'AND' : phase === 2 ? 'OR' : phase === 3 ? 'IMP' : s.logicOp;

        const drawCircle = (x: number, y: number, color: string, active: boolean) => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = active ? `${color}33` : 'rgba(15, 23, 42, 0.55)';
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = active ? 3.2 : 1.6;
          ctx.stroke();
          ctx.restore();
        };

        const pTrue = s.propP;
        const qTrue = s.propQ;
        const result =
          op === 'AND' ? pTrue && qTrue : op === 'OR' ? pTrue || qTrue : !pTrue || qTrue;

        drawCircle(cx - dx, cy, '#22d3ee', pTrue);
        drawCircle(cx + dx, cy, '#a78bfa', qTrue);

        drawBadge(cx - dx - r * 0.4, cy - r - 18, `P = ${pTrue ? 'V' : 'F'}`, '#22d3ee');
        drawBadge(cx + dx + r * 0.4, cy - r - 18, `Q = ${qTrue ? 'V' : 'F'}`, '#a78bfa');

        const opLabel = op === 'AND' ? 'P ∧ Q' : op === 'OR' ? 'P ∨ Q' : 'P ⇒ Q';
        drawBadge(
          cx,
          height - 28,
          `${opLabel} = ${result ? 'VERDADERO' : 'FALSO'}`,
          result ? '#34d399' : '#fb7185'
        );
      }

      raf = window.requestAnimationFrame(drawFrame);
    };

    raf = window.requestAnimationFrame(drawFrame);
    return () => {
      window.cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  const meta = TOPIC_META[topic];
  const currentCue = useMemo(
    () => meta.cues.find((c) => elapsed >= c.from && elapsed < c.to) ?? meta.cues[0],
    [meta, elapsed]
  );

  return (
    <div className="studio-wrap">
      <div className="studio-topics">
        {(Object.keys(TOPIC_META) as StudioTopic[]).map((key) => (
          <button
            key={key}
            type="button"
            className={`chip ${topic === key ? 'active' : ''}`}
            onClick={() => setTopic(key)}
          >
            {TOPIC_META[key].label}
          </button>
        ))}
      </div>

      <div className="studio-grid">
        <div className="studio-stage">
          <div className="studio-canvas-wrap">
            <canvas
              ref={canvasRef}
              className="studio-canvas"
              aria-label={`Animación HD de ${meta.label}`}
            />
            <div className="studio-time-pill">
              {elapsed.toFixed(1)}s / 10.0s
            </div>
            <div className="studio-caption-overlay">
              <strong>{currentCue.title}</strong>
              <span>{currentCue.text}</span>
            </div>
          </div>

          <div className="studio-timeline">
            <button
              type="button"
              className="chip active"
              onClick={() => setPlaying((p) => !p)}
            >
              <Icon name={playing ? 'clock' : 'play'} size={13} />
              {playing ? 'Pausar' : 'Reproducir'}
            </button>
            <input
              type="range"
              min="0"
              max={DURATION - 0.05}
              step="0.05"
              value={elapsed}
              onChange={(e) => {
                setPlaying(false);
                setElapsed(Number(e.target.value));
              }}
              aria-label="Línea de tiempo de 10 segundos"
              style={{ flex: 1, accentColor: '#22d3ee' }}
            />
            <button
              type="button"
              className="chip"
              onClick={() => {
                setElapsed(0);
                setPlaying(true);
              }}
            >
              ↺ 10s
            </button>
          </div>
        </div>

        <div className="studio-guide">
          <div className="studio-cue-active">
            <span className="eyebrow">Guía en vivo · {meta.label}</span>
            <h4>{currentCue.title}</h4>
            <p>{currentCue.text}</p>
            <div className="math3d-formula">
              <KaTeXInline math={currentCue.formula} />
            </div>
          </div>

          <div className="studio-cues-list">
            {meta.cues.map((cue) => {
              const active = cue.title === currentCue.title;
              return (
                <button
                  key={cue.title}
                  type="button"
                  className={`studio-cue-btn ${active ? 'active' : ''}`}
                  onClick={() => {
                    setElapsed(cue.from + 0.1);
                    setPlaying(true);
                  }}
                >
                  <span>{cue.from}s–{cue.to}s</span>
                  <strong>{cue.title}</strong>
                </button>
              );
            })}
          </div>

          <div className="studio-controls">
            {topic === 'trig' ? (
              <>
                <label className="slider">
                  <span className="slider-label">Ángulo α <strong style={{ color: '#a78bfa' }}>{angleDeg}°</strong></span>
                  <input type="range" min="15" max="75" step="1" value={angleDeg} onChange={(e) => setAngleDeg(Number(e.target.value))} style={{ accentColor: '#a78bfa' }} />
                </label>
                <label className="slider">
                  <span className="slider-label">Escala k <strong style={{ color: '#fde047' }}>{scaleK.toFixed(1)}x</strong></span>
                  <input type="range" min="0.6" max="1.6" step="0.1" value={scaleK} onChange={(e) => setScaleK(Number(e.target.value))} style={{ accentColor: '#fde047' }} />
                </label>
              </>
            ) : null}

            {topic === 'shapes' ? (
              <label className="slider">
                <span className="slider-label">Escala global <strong style={{ color: '#22d3ee' }}>{scaleK.toFixed(1)}x</strong></span>
                <input type="range" min="0.6" max="1.8" step="0.1" value={scaleK} onChange={(e) => setScaleK(Number(e.target.value))} style={{ accentColor: '#22d3ee' }} />
              </label>
            ) : null}

            {topic === 'equations' ? (
              <div className="math3d-sliders">
                <label className="slider">
                  <span className="slider-label">a = <strong style={{ color: '#22d3ee' }}>{eqA}</strong></span>
                  <input type="range" min="1" max="5" step="1" value={eqA} onChange={(e) => setEqA(Number(e.target.value))} />
                </label>
                <label className="slider">
                  <span className="slider-label">c = <strong style={{ color: '#a78bfa' }}>{eqC}</strong></span>
                  <input type="range" min="-4" max="10" step="1" value={eqC} onChange={(e) => setEqC(Number(e.target.value))} />
                </label>
              </div>
            ) : null}

            {topic === 'inequalities' ? (
              <div className="preset-row">
                <button type="button" className={`chip ${flipNeg ? 'active' : ''}`} onClick={() => setFlipNeg((f) => !f)}>
                  Multiplicar por (-1)
                </button>
                <label className="slider" style={{ flex: 1 }}>
                  <span className="slider-label">Radio r = <strong>{ineqRadius.toFixed(1)}</strong></span>
                  <input type="range" min="1" max="3.5" step="0.5" value={ineqRadius} onChange={(e) => setIneqRadius(Number(e.target.value))} />
                </label>
              </div>
            ) : null}

            {topic === 'logic' ? (
              <div className="preset-row">
                <button type="button" className={`chip ${propP ? 'active' : ''}`} onClick={() => setPropP((v) => !v)}>
                  P = {propP ? 'V' : 'F'}
                </button>
                <button type="button" className={`chip ${propQ ? 'active' : ''}`} onClick={() => setPropQ((v) => !v)}>
                  Q = {propQ ? 'V' : 'F'}
                </button>
                {(['AND', 'OR', 'IMP'] as const).map((op) => (
                  <button key={op} type="button" className={`chip ${logicOp === op ? 'active' : ''}`} onClick={() => setLogicOp(op)}>
                    {op === 'AND' ? 'P ∧ Q' : op === 'OR' ? 'P ∨ Q' : 'P ⇒ Q'}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
