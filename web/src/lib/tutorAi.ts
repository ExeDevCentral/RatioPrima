import type { Scene3DKind } from '../components/labs/Math3DScene';

export interface TutorMessage {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  formula?: string;
  timestamp: string;
}

/**
 * Evaluador matemático seguro (recursive-descent) para la calculadora del Tutor.
 * Soporta +, -, *, /, ^, paréntesis, pi, sqrt, abs, sin/sen, cos, tan (en grados).
 */
export function evaluateMathExpression(expr: string): number | null {
  const cleaned = expr
    .toLowerCase()
    .replace(/,/g, '.')
    .replace(/π/g, 'pi')
    .replace(/sen\(/g, 'sin(')
    .replace(/\s+/g, '');

  if (!cleaned || /[^0-9a-z.+\-*/^()]/.test(cleaned)) return null;

  let pos = 0;

  const peek = () => cleaned[pos] ?? '';
  const consume = () => cleaned[pos++] ?? '';

  const parseNumberOrIdent = (): number | null => {
    const start = pos;
    if (/[a-z]/.test(peek())) {
      while (/[a-z]/.test(peek())) consume();
      const ident = cleaned.slice(start, pos);
      if (ident === 'pi') return Math.PI;
      if (ident === 'e') return Math.E;
      if (peek() === '(') {
        consume(); // '('
        const arg = parseExpr();
        if (arg === null || consume() !== ')') return null;
        switch (ident) {
          case 'sqrt':
            return arg < 0 ? null : Math.sqrt(arg);
          case 'abs':
            return Math.abs(arg);
          case 'sin':
            return Math.sin((arg * Math.PI) / 180);
          case 'cos':
            return Math.cos((arg * Math.PI) / 180);
          case 'tan':
            return Math.tan((arg * Math.PI) / 180);
          default:
            return null;
        }
      }
      return null;
    }

    let seenDot = false;
    while (/[0-9.]/.test(peek())) {
      if (peek() === '.') {
        if (seenDot) return null;
        seenDot = true;
      }
      consume();
    }
    if (pos === start) return null;
    const num = Number(cleaned.slice(start, pos));
    return Number.isFinite(num) ? num : null;
  };

  const parsePrimary = (): number | null => {
    if (peek() === '(') {
      consume();
      const val = parseExpr();
      if (val === null || consume() !== ')') return null;
      return val;
    }
    if (peek() === '-') {
      consume();
      const val = parsePrimary();
      return val === null ? null : -val;
    }
    if (peek() === '+') {
      consume();
      return parsePrimary();
    }
    return parseNumberOrIdent();
  };

  const parsePower = (): number | null => {
    const base = parsePrimary();
    if (base === null) return null;
    if (peek() === '^') {
      consume();
      const exp = parsePower();
      if (exp === null) return null;
      const res = Math.pow(base, exp);
      return Number.isFinite(res) ? res : null;
    }
    return base;
  };

  const parseTerm = (): number | null => {
    let left = parsePower();
    if (left === null) return null;
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const right = parsePower();
      if (right === null) return null;
      if (op === '*') left *= right;
      else {
        if (Math.abs(right) < 1e-12) return null;
        left /= right;
      }
    }
    return left;
  };

  const parseExpr = (): number | null => {
    let left = parseTerm();
    if (left === null) return null;
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const right = parseTerm();
      if (right === null) return null;
      left = op === '+' ? left + right : left - right;
    }
    return left;
  };

  const result = parseExpr();
  if (result === null || pos !== cleaned.length) return null;
  return result;
}

const SCENE_TUTOR_HINTS: Record<Scene3DKind, { topic: string; cue: string; question: string }> = {
  helix3d: {
    topic: 'Trigonometría en 3D',
    cue: 'Mirá el triángulo dentro del círculo unitario en el plano XY y cómo se estira formando la hélice en Z.',
    question: '¿Qué lado representa la proyección vertical (rosa) cuando cambiás el ángulo α?'
  },
  cube3d: {
    topic: 'Cubo Binomial (a+b)³',
    cue: 'Separando los 8 bloques con el slider podés contar: 1 bloque a³, 3 bloques a²b, 3 bloques ab² y 1 bloque b³.',
    question: '¿Por qué (a+b)³ NO puede ser igual a a³ + b³ mirando el volumen 3D?'
  },
  parabola3d: {
    topic: 'Ecuaciones Cuadráticas y Raíces',
    cue: 'Las raíces reales son exactamente los puntos donde la curva amarilla corta el plano horizontal y = 0.',
    question: 'Si subís el término c hasta que la parábola no toque el piso, ¿qué pasa con el discriminante Δ?'
  },
  sets3d: {
    topic: 'Conjuntos Numéricos y Valor Absoluto',
    cue: 'El cono en V muestra la distancia |x - c|. El segmento verde marca todos los x que quedan por debajo del radio r.',
    question: '¿Qué pasa con el intervalo solución si duplicás el radio r?'
  },
  powers3d: {
    topic: 'Potencias y Radicales',
    cue: 'Compará la barra a¹ (longitud), la placa a² (área) y el cubo a³ (volumen).',
    question: 'Si un cubo tiene volumen 27, ¿cuánto mide su arista (raíz cúbica)?'
  },
  rational3d: {
    topic: 'Inecuaciones y Signos',
    cue: 'El muro rojo vertical marca el valor donde el denominador se hace cero: ahí la función explota y nunca se incluye.',
    question: '¿Por qué un valor que anula el denominador jamás puede entrar en el conjunto solución?'
  },
  planes3d: {
    topic: 'Sistemas de Ecuaciones',
    cue: 'Cuando dos planos se cruzan forman una línea brillante amarilla (solución única en 2D). Si los ponés paralelos, nunca se tocan.',
    question: '¿Cómo deben ser las pendientes m₁ y m₂ para que el sistema sea incompatible?'
  },
  wave3d: {
    topic: 'Modelado Paramétrico 3D',
    cue: 'La amplitud A estira la altura vertical y la frecuencia f comprime las crestas radiales.',
    question: '¿Qué parámetro modificarías para duplicar la altura máxima de la onda?'
  }
};

export function askTutorAI(
  rawMessage: string,
  activeScene: Scene3DKind
): { reply: string; formula?: string } {
  const msg = rawMessage.trim();
  const lower = msg.toLowerCase();
  const sceneInfo = SCENE_TUTOR_HINTS[activeScene];

  // 1. Detectar si el usuario quiere calcular una expresión matemática directa
  const calcCandidate = msg
    .replace(/^(calcula|calculá|cuanto es|cuánto es|resolver|eval|evaluar|=)\s*/i, '')
    .replace(/\?+$/, '')
    .trim();

  if (/[0-9]/.test(calcCandidate) && /[+\-*/^()]|sqrt|sin|sen|cos|tan/i.test(calcCandidate)) {
    const val = evaluateMathExpression(calcCandidate);
    if (val !== null) {
      const formatted = Number.isInteger(val) ? String(val) : Number(val.toFixed(4)).toString();
      return {
        reply: `Como herramienta de cálculo, \`${calcCandidate}\` da **${formatted}**. Ahora te toca a vos como tutoría: ¿qué representa ese resultado dentro del problema que estás resolviendo?`,
        formula: `${calcCandidate} = ${formatted}`
      };
    }
  }

  // 2. Modo TUTOR (nunca autor): si pide "haceme la tarea" o "dame la respuesta"
  if (/(dame la respuesta|resolvelo vos|haceme|hace por mi|respuesta directa)/i.test(lower)) {
    return {
      reply: `Acá soy tu **Tutor**, nunca tu autor: si te doy la respuesta hecha no entrenás el músculo matemático. Probemos juntos: contame qué **primer paso** se te ocurre en *${sceneInfo.topic}* y lo validamos al instante.`
    };
  }

  // 3. Explicación de la escena 3D actual
  if (/(3d|escena|grafico|gráfico|modelo|que veo|qué veo|explicame)/i.test(lower)) {
    return {
      reply: `En esta creación 3D (**${sceneInfo.topic}**): ${sceneInfo.cue}\n\nPara comprobarlo: **${sceneInfo.question}**`
    };
  }

  // 4. Dudas de trigonometría
  if (/(hipotenusa|cateto|seno|coseno|tangente|angulo|ángulo|triangulo|triángulo)/i.test(lower)) {
    return {
      reply: `Buena pregunta. Antes de elegir fórmula, identificá siempre 3 piezas en orden:\n1. La **hipotenusa** es el lado frente al ángulo de $90^\\circ$.\n2. El **cateto opuesto** está frente al ángulo $\\alpha$ que elegiste.\n3. El **cateto adyacente** toca a $\\alpha$.\n\nSi en un triángulo conocés el opuesto y la hipotenusa, ¿qué razón trigonométrica los conecta?`,
      formula: '\\operatorname{sen}\\alpha = \\frac{CO}{H},\\quad \\cos\\alpha = \\frac{CA}{H}'
    };
  }

  // 5. Dudas de ecuaciones / despeje
  if (/(ecuacion|ecuación|despej|x\s*=|balanza|cuadratica|cuadrática)/i.test(lower)) {
    return {
      reply: `Pensá la ecuación como una **balanza**: todo lo que sumás, restás, multiplicás o dividís de un lado, tenés que hacerlo exactamente igual del otro.\n\nDecime: en tu ecuación, ¿qué operación está más "lejos" de la $x$ para deshacerla primero?`,
      formula: 'ax + b = c \\implies ax = c - b'
    };
  }

  // 6. Dudas de inecuaciones / desigualdades
  if (/(inecuacion|inecuación|desigualdad|intervalo|signo|mayor|menor|modulo|módulo)/i.test(lower)) {
    return {
      reply: `Clave de oro en desigualdades: sumar o restar **mantiene** el sentido, pero multiplicar o dividir por un **negativo** invierte la flecha.\n\nProbá con un ejemplo mental: sabemos que $2 < 5$. Si multiplicás ambos por $-1$, ¿qué relación queda entre $-2$ y $-5$?`,
      formula: 'a < b \\text{ y } c < 0 \\implies ac > bc'
    };
  }

  // 7. Dudas de lógica / conjuntos
  if (/(logica|lógica|conjunto|venn|implicacion|implicación|tabla|verdad)/i.test(lower)) {
    return {
      reply: `En lógica proposicional:\n- $P \\land Q$ exige que **ambas** sean verdaderas.\n- $P \\lor Q$ pide **al menos una** verdadera.\n- $P \\implies Q$ solo falla si $P$ es Verdadera y $Q$ es Falsa.\n\n¿Qué pasa con $P \\implies Q$ cuando $P$ es Falsa y $Q$ es Verdadera?`,
      formula: 'P \\implies Q \\equiv \\neg P \\lor Q'
    };
  }

  // 8. Respuesta Socrática general
  return {
    reply: `Excelente punto para analizar en **${sceneInfo.topic}**. ${sceneInfo.cue}\n\nTambién podés escribirme cualquier cuenta (ej: \`3/4 + 1/2\` o \`sqrt(144)\`) para verificar tus cálculos parciales mientras pensás: **${sceneInfo.question}**`
  };
}
