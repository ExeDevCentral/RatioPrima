export type StepSeriesId = 'zero' | 'simple' | 'challenge';

export interface StepSolutionItem {
  title: string;
  detail: string;
  latex?: string;
}

export interface CommonMistakeRule {
  /** Valor numérico o cadena normalizada que dispara este diagnóstico */
  matchValues: string[];
  diagnosis: string;
}

export interface StepExercise {
  id: string;
  series: StepSeriesId;
  order: number;
  topic: string;
  prompt: string;
  /** Explicación clara en lenguaje simple visible antes de responder */
  guide: string;
  /** Mini ejemplo parecido ya resuelto para no adivinar */
  miniExample: string;
  placeholder: string;
  /** Respuesta canónica legible */
  canonicalAnswer: string;
  /** Lista de respuestas equivalentes aceptadas (ej. ["0.5", "1/2"]) */
  acceptedAnswers: string[];
  /** Valor numérico exacto si aplica (para comparar fracciones y decimales) */
  numericValue?: number;
  hint: string;
  steps: StepSolutionItem[];
  commonMistakes: CommonMistakeRule[];
  xp: number;
}

export interface AIReviewResult {
  isCorrect: boolean;
  tone: 'correct' | 'close' | 'wrong';
  headline: string;
  diagnosis: string;
  normalizedInput: string;
}

export function normalizeMathInput(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^[a-z]\s*=\s*/i, '') // "x = 3" -> "3"
    .replace(/,/g, '.') // coma decimal -> punto
    .replace(/\s+/g, '');
}

export function parseNumericValue(norm: string): number | null {
  if (!norm) return null;
  // Fracción a/b
  const fracMatch = norm.match(/^(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)$/);
  if (fracMatch) {
    const num = Number(fracMatch[1]);
    const den = Number(fracMatch[2]);
    if (Number.isFinite(num) && Number.isFinite(den) && den !== 0) {
      return num / den;
    }
    return null;
  }
  if (/^-?\d+(?:\.\d+)?$/.test(norm)) {
    const val = Number(norm);
    return Number.isFinite(val) ? val : null;
  }
  return null;
}

/** Revisor local por reglas; no llama a un modelo generativo ni a una API externa. */
export function reviewAnswerWithAI(exercise: StepExercise, rawInput: string): AIReviewResult {
  const normalizedInput = normalizeMathInput(rawInput);

  if (!normalizedInput) {
    return {
      isCorrect: false,
      tone: 'wrong',
      headline: 'Falta tu respuesta',
      diagnosis: 'Escribí un número o fracción usando el teclado antes de pedir la revisión IA.',
      normalizedInput
    };
  }

  // 1. Coincidencia textual directa
  const directMatch = exercise.acceptedAnswers.some(
    (ans) => normalizeMathInput(ans) === normalizedInput
  );

  // 2. Equivalencia numérica (ej. 0.5 == 1/2, -1.125 == -9/8)
  const userNum = parseNumericValue(normalizedInput);
  const numericMatch =
    exercise.numericValue !== undefined &&
    userNum !== null &&
    Math.abs(userNum - exercise.numericValue) < 1e-4;

  if (directMatch || numericMatch) {
    return {
      isCorrect: true,
      tone: 'correct',
      headline: '¡Correcto! Razonamiento validado',
      diagnosis: `Tu respuesta (${rawInput.trim()}) coincide exactamente con el resultado formal ${exercise.canonicalAnswer}.`,
      normalizedInput
    };
  }

  // 3. Diagnóstico inteligente de errores frecuentes
  for (const rule of exercise.commonMistakes) {
    const hit = rule.matchValues.some((mv) => {
      const normMv = normalizeMathInput(mv);
      if (normMv === normalizedInput) return true;
      const mvNum = parseNumericValue(normMv);
      return mvNum !== null && userNum !== null && Math.abs(mvNum - userNum) < 1e-4;
    });
    if (hit) {
      return {
        isCorrect: false,
        tone: 'close',
        headline: 'Diagnóstico: error clásico detectado',
        diagnosis: rule.diagnosis,
        normalizedInput
      };
    }
  }

  // 4. Diagnóstico por signo opuesto
  if (
    exercise.numericValue !== undefined &&
    userNum !== null &&
    exercise.numericValue !== 0 &&
    Math.abs(userNum + exercise.numericValue) < 1e-4
  ) {
    return {
      isCorrect: false,
      tone: 'close',
      headline: '¡Casi! Revisá el signo',
      diagnosis: `El valor absoluto es correcto (${Math.abs(exercise.numericValue)}), pero el signo quedó invertido. Revisá el pasaje de términos o la regla de signos.`,
      normalizedInput
    };
  }

  return {
    isCorrect: false,
    tone: 'wrong',
    headline: 'No coincide todavía',
    diagnosis: `Tu entrada (${rawInput.trim()}) no coincide con ${exercise.canonicalAnswer}. Seguí los pasos simples desplegados abajo para detectar dónde cambió el cálculo.`,
    normalizedInput
  };
}

const L = String.raw;

export const FOUNDATION_EXERCISES: StepExercise[] = [
  {
    id: 'zero-01',
    series: 'zero',
    order: 1,
    topic: 'Sumar negativos',
    prompt: L`Calculá $-5 + 8$:`,
    guide: 'Pensalo como plata: el -5 es que debés $5, y el +8 es que tenés $8. Pagás los $5 y te sobra plata a favor.',
    miniExample: 'Ejemplo parecido: -3 + 10 = 7 (debía 3, pagué con 10, me quedan 7).',
    placeholder: 'Ej: 3',
    canonicalAnswer: '3',
    acceptedAnswers: ['3', '+3'],
    numericValue: 3,
    hint: '8 - 5 = 3, y queda positivo porque el 8 es más grande.',
    steps: [
      { title: 'Restá los valores', detail: 'Como tienen distinto signo, restamos 8 - 5 = 3.' },
      { title: 'Elegí el signo del mayor', detail: 'El 8 es positivo y más grande que 5, así que queda +3.', latex: L`-5 + 8 = 3` }
    ],
    commonMistakes: [
      { matchValues: ['-13', '13'], diagnosis: 'Sumaste 5 + 8 como si tuvieran el mismo signo. Cuando uno es negativo y otro positivo, se restan.' },
      { matchValues: ['-3'], diagnosis: 'El resultado es 3, pero positivo porque +8 es más grande que -5.' }
    ],
    xp: 10
  },
  {
    id: 'zero-02',
    series: 'zero',
    order: 2,
    topic: 'Signos al multiplicar',
    prompt: L`Calculá $(-4) \cdot (-3)$:`,
    guide: 'Al multiplicar: signos iguales siempre dan positivo (+), signos distintos siempre dan negativo (-).',
    miniExample: 'Ejemplo parecido: (-2) · (-5) = +10.',
    placeholder: 'Ej: 12',
    canonicalAnswer: '12',
    acceptedAnswers: ['12', '+12'],
    numericValue: 12,
    hint: '4 × 3 = 12, y menos por menos da más.',
    steps: [
      { title: 'Multiplicá los números', detail: '4 × 3 = 12.' },
      { title: 'Aplicá regla de signos', detail: 'Negativo por negativo da positivo.', latex: L`(-4)\cdot(-3) = 12` }
    ],
    commonMistakes: [
      { matchValues: ['-12'], diagnosis: 'En la multiplicación, menos por menos da MÁS (+12). Solo da negativo cuando los signos son distintos.' }
    ],
    xp: 10
  },
  {
    id: 'zero-03',
    series: 'zero',
    order: 3,
    topic: 'Orden de operaciones',
    prompt: L`Calculá $2 + 3 \cdot 4$:`,
    guide: 'Regla de oro: los signos + y - separan en términos. Primero resolvés multiplicaciones y divisiones, al final sumás.',
    miniExample: 'Ejemplo parecido: 5 + 2 · 3 = 5 + 6 = 11 (NO 7 · 3).',
    placeholder: 'Ej: 14',
    canonicalAnswer: '14',
    acceptedAnswers: ['14'],
    numericValue: 14,
    hint: 'Hacé primero 3 × 4 = 12, y después sumale 2.',
    steps: [
      { title: 'Separá en términos', detail: 'Primero multiplicamos 3 · 4 = 12.', latex: L`2 + (3\cdot 4) = 2 + 12` },
      { title: 'Sumá al final', detail: '2 + 12 = 14.', latex: L`2 + 12 = 14` }
    ],
    commonMistakes: [
      { matchValues: ['20'], diagnosis: 'Sumaste 2 + 3 = 5 antes de multiplicar por 4. La multiplicación siempre va primero que la suma.' }
    ],
    xp: 10
  },
  {
    id: 'zero-04',
    series: 'zero',
    order: 4,
    topic: 'Fracciones básicas',
    prompt: L`Calculá $\frac{1}{2} + \frac{1}{4}$ (escribilo como fracción ` + '`a/b`' + ` o decimal):`,
    guide: 'Pensalo en porciones: 1/2 es media pizza (equivale a 2 cuartos: 2/4). Si a 2/4 le sumás 1/4, tenés 3/4.',
    miniExample: 'Ejemplo parecido: 1/2 + 1/2 = 2/2 = 1.',
    placeholder: 'Ej: 3/4 o 0.75',
    canonicalAnswer: '3/4',
    acceptedAnswers: ['3/4', '0.75'],
    numericValue: 0.75,
    hint: 'Convertí 1/2 en 2/4 para que tengan el mismo número abajo.',
    steps: [
      { title: 'Igualá el denominador', detail: '1/2 es lo mismo que 2/4.', latex: L`\frac{1}{2} = \frac{2}{4}` },
      { title: 'Sumá los de arriba', detail: '2/4 + 1/4 = 3/4.', latex: L`\frac{2}{4}+\frac{1}{4}=\frac{3}{4}` }
    ],
    commonMistakes: [
      { matchValues: ['2/6', '1/3'], diagnosis: 'Sumaste los de arriba y los de abajo (1+1)/(2+4). ¡Los de abajo nunca se suman directo!' }
    ],
    xp: 10
  },
  {
    id: 'zero-05',
    series: 'zero',
    order: 5,
    topic: 'Multiplicar fracciones',
    prompt: L`Calculá $\frac{2}{3} \cdot \frac{3}{5}$ (escribilo como fracción ` + '`a/b`' + ` o decimal):`,
    guide: 'Multiplicar fracciones es lo más fácil: se multiplica derecho (arriba por arriba, abajo por abajo).',
    miniExample: 'Ejemplo parecido: (1/2) · (3/4) = (1·3)/(2·4) = 3/8.',
    placeholder: 'Ej: 2/5 o 0.4',
    canonicalAnswer: '2/5',
    acceptedAnswers: ['2/5', '6/15', '0.4'],
    numericValue: 0.4,
    hint: '2 × 3 = 6 arriba, y 3 × 5 = 15 abajo (6/15 simplificado por 3 es 2/5).',
    steps: [
      { title: 'Multiplicá derecho', detail: 'Numerador por numerador y denominador por denominador.', latex: L`\frac{2\cdot 3}{3\cdot 5} = \frac{6}{15}` },
      { title: 'Simplificá por 3', detail: 'Dividimos arriba y abajo por 3.', latex: L`\frac{6}{15} = \frac{2}{5}` }
    ],
    commonMistakes: [
      { matchValues: ['10/9'], diagnosis: 'Multiplicaste cruzado en lugar de derecho. En la multiplicación es arriba×arriba y abajo×abajo.' }
    ],
    xp: 10
  },
  {
    id: 'zero-06',
    series: 'zero',
    order: 6,
    topic: 'Porcentajes',
    prompt: L`¿Cuánto es el $50\%$ de $80$?`,
    guide: 'El 100% es el total completo. El 50% es exactamente la mitad (dividir por 2). El 25% es la cuarta parte (dividir por 4).',
    miniExample: 'Ejemplo parecido: el 50% de 60 es 60 ÷ 2 = 30.',
    placeholder: 'Ej: 40',
    canonicalAnswer: '40',
    acceptedAnswers: ['40'],
    numericValue: 40,
    hint: 'Dividí 80 por 2.',
    steps: [
      { title: 'Traducí 50%', detail: '50/100 es lo mismo que 1/2 (la mitad).', latex: L`50\% = \frac{1}{2}` },
      { title: 'Calculá la mitad', detail: '80 ÷ 2 = 40.', latex: L`\frac{80}{2} = 40` }
    ],
    commonMistakes: [
      { matchValues: ['30'], diagnosis: 'Restaste 80 - 50 = 30 en lugar de calcular la mitad de 80.' }
    ],
    xp: 10
  },
  {
    id: 'zero-07',
    series: 'zero',
    order: 7,
    topic: 'Qué es una incógnita',
    prompt: L`Si $x + 4 = 10$, ¿qué número esconde la $x$?`,
    guide: 'La letra x es solo una cajita vacía con un número escondido adentro. Preguntate: ¿qué número más 4 da 10?',
    miniExample: 'Ejemplo parecido: si x + 2 = 7, la cajita esconde al 5 (porque 5 + 2 = 7).',
    placeholder: 'Ej: 6',
    canonicalAnswer: '6',
    acceptedAnswers: ['6'],
    numericValue: 6,
    hint: 'Al 10 restale 4.',
    steps: [
      { title: 'Pensá qué falta', detail: '¿Qué número + 4 = 10?', latex: L`x = 10 - 4` },
      { title: 'Verificá', detail: '6 + 4 = 10.', latex: L`x = 6` }
    ],
    commonMistakes: [
      { matchValues: ['14'], diagnosis: 'Sumaste 10 + 4 en lugar de restar 10 - 4.' }
    ],
    xp: 10
  },
  {
    id: 'zero-08',
    series: 'zero',
    order: 8,
    topic: 'Potencia desde cero',
    prompt: L`Calculá $2^3$:`,
    guide: 'El número chiquito de arriba (3) te dice cuántas veces multiplicás el número grande (2) por sí mismo: 2 · 2 · 2.',
    miniExample: 'Ejemplo parecido: 3² = 3 · 3 = 9 (NO es 3 · 2).',
    placeholder: 'Ej: 8',
    canonicalAnswer: '8',
    acceptedAnswers: ['8'],
    numericValue: 8,
    hint: '2 × 2 = 4, y 4 × 2 = 8.',
    steps: [
      { title: 'Escribí la multiplicación', detail: 'El 2 aparece 3 veces multiplicándose.', latex: L`2^3 = 2 \cdot 2 \cdot 2` },
      { title: 'Calculá paso a paso', detail: '2 × 2 = 4, y 4 × 2 = 8.', latex: L`2^3 = 8` }
    ],
    commonMistakes: [
      { matchValues: ['6'], diagnosis: 'Multiplicaste 2 × 3 = 6. Recordá que la potencia repite multiplicaciones (2×2×2), no multiplica base por exponente.' }
    ],
    xp: 10
  },
  {
    id: 'zero-09',
    series: 'zero',
    order: 9,
    topic: 'Raíz cuadrada desde cero',
    prompt: L`Calculá $\sqrt{25}$:`,
    guide: 'La raíz cuadrada es lo contrario de elevar al cuadrado: buscá qué número positivo multiplicado por sí mismo da 25.',
    miniExample: 'Ejemplo parecido: √16 = 4 porque 4 × 4 = 16.',
    placeholder: 'Ej: 5',
    canonicalAnswer: '5',
    acceptedAnswers: ['5'],
    numericValue: 5,
    hint: 'Probá 3×3=9, 4×4=16, 5×5=...',
    steps: [
      { title: 'Buscá el número', detail: '5 × 5 = 25.', latex: L`5^2 = 25` },
      { title: 'Escribí la raíz', detail: 'Por lo tanto √25 = 5.', latex: L`\sqrt{25} = 5` }
    ],
    commonMistakes: [
      { matchValues: ['12.5', '25/2'], diagnosis: 'Dividiste por 2 en vez de buscar qué número multiplicado por sí mismo da 25.' }
    ],
    xp: 10
  },
  {
    id: 'zero-10',
    series: 'zero',
    order: 10,
    topic: 'Regla de tres simple',
    prompt: L`Si $2$ cuadernos cuestan $\$100$, ¿cuánto cuestan $5$ cuadernos?`,
    guide: 'Primero averiguá cuánto cuesta 1 solo cuaderno (dividiendo 100 ÷ 2), y después multiplicá ese precio por 5.',
    miniExample: 'Ejemplo parecido: 3 lápices cuestan $30 → 1 lápiz cuesta $10 → 4 lápices cuestan $40.',
    placeholder: 'Ej: 250',
    canonicalAnswer: '250',
    acceptedAnswers: ['250', '$250'],
    numericValue: 250,
    hint: '1 cuaderno sale $50. ¿Cuánto salen 5?',
    steps: [
      { title: 'Calculá el valor de 1 unidad', detail: '100 ÷ 2 = $50 cada cuaderno.', latex: L`\frac{100}{2} = 50` },
      { title: 'Multiplicá por 5', detail: '50 × 5 = 250.', latex: L`50 \cdot 5 = 250` }
    ],
    commonMistakes: [
      { matchValues: ['50'], diagnosis: '50 es el precio de 1 cuaderno. Falta multiplicarlo por los 5 cuadernos.' }
    ],
    xp: 15
  }
];

export const SIMPLE_EXERCISES: StepExercise[] = [
  {
    id: 'simple-01',
    series: 'simple',
    order: 1,
    topic: 'Valor absoluto',
    prompt: L`Calculá el valor numérico de $|-7| + |3|$:`,
    guide: 'Las barras | | miden distancia al cero: convierten cualquier número negativo en positivo y dejan igual al positivo.',
    miniExample: 'Ejemplo parecido: |-4| + |2| = 4 + 2 = 6.',
    placeholder: 'Ej: 10',
    canonicalAnswer: '10',
    acceptedAnswers: ['10'],
    numericValue: 10,
    hint: 'El valor absoluto mide distancia al cero, por lo que siempre es ≥ 0.',
    steps: [
      { title: 'Evaluá cada módulo', detail: 'La distancia de -7 a 0 es 7, y la de 3 a 0 es 3.', latex: L`|-7|=7,\quad |3|=3` },
      { title: 'Sumá los resultados', detail: 'Sumamos ambas distancias positivas.', latex: L`7+3=10` }
    ],
    commonMistakes: [
      { matchValues: ['-4'], diagnosis: 'Sumaste -7 + 3 sin aplicar primero el valor absoluto. Recordá: |-7| = +7.' },
      { matchValues: ['4'], diagnosis: 'Restaste 7 - 3 en lugar de sumar ambos módulos.' }
    ],
    xp: 15
  },
  {
    id: 'simple-02',
    series: 'simple',
    order: 2,
    topic: 'Orden en ℝ',
    prompt: L`Entre $-8$ y $-3$, ¿cuál es el número MAYOR?`,
    guide: 'En los números negativos es al revés que en los positivos: el que está más cerca de 0 (más a la derecha en la recta) es el mayor.',
    miniExample: 'Ejemplo parecido: entre -10 y -2, el mayor es -2 (deber $2 es mejor que deber $10).',
    placeholder: 'Ej: -3',
    canonicalAnswer: '-3',
    acceptedAnswers: ['-3'],
    numericValue: -3,
    hint: 'En la recta real, el número mayor siempre está más a la derecha.',
    steps: [
      { title: 'Ubicalos en la recta real', detail: 'Cuanto mayor es el valor absoluto de un negativo, más a la izquierda queda.', latex: L`-8 < -3 < 0` },
      { title: 'Elegí el de la derecha', detail: '-3 está más cerca del cero, por lo tanto es mayor.', latex: L`\max(-8, -3) = -3` }
    ],
    commonMistakes: [
      { matchValues: ['-8'], diagnosis: 'Confundiste mayor valor absoluto con número mayor. En negativos, -8 está más a la izquierda que -3.' }
    ],
    xp: 15
  },
  {
    id: 'simple-03',
    series: 'simple',
    order: 3,
    topic: 'Potencias',
    prompt: L`Calculá $(-3)^2$:`,
    guide: 'El paréntesis indica que multiplicás TODO el (-3) por sí mismo dos veces: (-3) · (-3). Menos por menos da más.',
    miniExample: 'Ejemplo parecido: (-5)² = (-5) · (-5) = +25.',
    placeholder: 'Ej: 9',
    canonicalAnswer: '9',
    acceptedAnswers: ['9'],
    numericValue: 9,
    hint: 'El paréntesis incluye al signo menos dentro de la base.',
    steps: [
      { title: 'Escribí como producto', detail: 'Multiplicamos la base (-3) dos veces por sí misma.', latex: L`(-3)^2 = (-3)\cdot(-3)` },
      { title: 'Aplicá regla de signos', detail: 'Menos por menos da más.', latex: L`(-3)\cdot(-3) = 9` }
    ],
    commonMistakes: [
      { matchValues: ['-9'], diagnosis: 'El exponente par afecta al signo negativo dentro del paréntesis: (-3)² = +9 (distinto de -3² = -9).' },
      { matchValues: ['-6', '6'], diagnosis: 'Multiplicaste base por exponente (3×2) en vez de multiplicar 3×3.' }
    ],
    xp: 15
  },
  {
    id: 'simple-04',
    series: 'simple',
    order: 4,
    topic: 'Exponente negativo',
    prompt: L`Calculá $\left(\frac{2}{5}\right)^{-1}$ (podés escribir fracción ` + '`a/b`' + ` o decimal):`,
    guide: 'Un exponente -1 simplemente da vuelta la fracción (el de abajo sube y el de arriba baja), sin cambiar el signo.',
    miniExample: 'Ejemplo parecido: (3/4)⁻¹ = 4/3.',
    placeholder: 'Ej: 5/2 o 2.5',
    canonicalAnswer: '5/2',
    acceptedAnswers: ['5/2', '2.5'],
    numericValue: 2.5,
    hint: 'El exponente -1 invierte la fracción sin cambiar su signo.',
    steps: [
      { title: 'Aplicá definición de exponente -1', detail: 'Invertimos numerador y denominador.', latex: L`\left(\frac{2}{5}\right)^{-1} = \frac{5}{2}` },
      { title: 'Forma decimal equivalente', detail: 'También equivale a 2,5.', latex: L`\frac{5}{2} = 2{,}5` }
    ],
    commonMistakes: [
      { matchValues: ['-2/5', '-0.4'], diagnosis: 'El exponente negativo NO vuelve negativo al número: invierte la fracción.' }
    ],
    xp: 15
  },
  {
    id: 'simple-05',
    series: 'simple',
    order: 5,
    topic: 'Radicales',
    prompt: L`Calculá el radical aritmético $\sqrt{144}$:`,
    guide: 'Preguntate: ¿qué número positivo multiplicado por sí mismo da 144? (No es dividir por 2).',
    miniExample: 'Ejemplo parecido: √81 = 9 porque 9 × 9 = 81.',
    placeholder: 'Ej: 12',
    canonicalAnswer: '12',
    acceptedAnswers: ['12'],
    numericValue: 12,
    hint: 'Buscá el número positivo cuyo cuadrado sea 144.',
    steps: [
      { title: 'Buscá la base positiva', detail: '12 × 12 = 144.', latex: L`12^2 = 144` },
      { title: 'Aplicá convención aritmética', detail: 'La raíz cuadrada principal es no negativa.', latex: L`\sqrt{144} = 12` }
    ],
    commonMistakes: [
      { matchValues: ['72'], diagnosis: 'Dividiste 144 por 2 en lugar de buscar qué número al cuadrado da 144.' }
    ],
    xp: 15
  },
  {
    id: 'simple-06',
    series: 'simple',
    order: 6,
    topic: 'Ecuación lineal',
    prompt: L`Despejá $x$ en $2x - 1 = 5$:`,
    guide: 'Dejá la x sola en dos pasos: primero pasá el -1 sumando al otro lado, y después pasá el 2 dividiendo.',
    miniExample: 'Ejemplo parecido: 2x - 3 = 7 → 2x = 10 → x = 5.',
    placeholder: 'Ej: 3',
    canonicalAnswer: '3',
    acceptedAnswers: ['3'],
    numericValue: 3,
    hint: 'Sumá 1 en ambos miembros y luego dividí por 2.',
    steps: [
      { title: 'Sumá 1 a ambos lados', detail: 'Aislamos el término con x.', latex: L`2x = 5 + 1 = 6` },
      { title: 'Dividí por 2', detail: 'Despejamos la incógnita.', latex: L`x = \frac{6}{2} = 3` }
    ],
    commonMistakes: [
      { matchValues: ['2'], diagnosis: 'Restaste 1 al 5 (5 - 1 = 4) en vez de sumar 1 al pasar el -1.' }
    ],
    xp: 15
  },
  {
    id: 'simple-07',
    series: 'simple',
    order: 7,
    topic: 'Ecuación con paréntesis',
    prompt: L`Resolvé $3(x - 2) = 9$ y escribí el valor de $x$:`,
    guide: 'Como el 3 multiplica a todo el paréntesis, podés pasarlo dividiendo primero (9 ÷ 3 = 3) y luego pasar el -2 sumando.',
    miniExample: 'Ejemplo parecido: 4(x - 1) = 8 → x - 1 = 2 → x = 3.',
    placeholder: 'Ej: 5',
    canonicalAnswer: '5',
    acceptedAnswers: ['5'],
    numericValue: 5,
    hint: 'Podés dividir ambos miembros por 3 primero: x - 2 = 3.',
    steps: [
      { title: 'Dividí por 3 ambos lados', detail: 'Simplificamos el factor externo.', latex: L`x - 2 = \frac{9}{3} = 3` },
      { title: 'Sumá 2', detail: 'Despejamos x.', latex: L`x = 3 + 2 = 5` }
    ],
    commonMistakes: [
      { matchValues: ['1'], diagnosis: 'Restaste 2 en vez de sumar 2 al pasar el término.' },
      { matchValues: ['11/3'], diagnosis: 'Olvidaste multiplicar el 3 por el -2 en la distributiva: 3(x-2) = 3x - 6, no 3x - 2.' }
    ],
    xp: 15
  },
  {
    id: 'simple-08',
    series: 'simple',
    order: 8,
    topic: 'Trigonometría',
    prompt: L`¿Cuánto vale $\operatorname{sen}(30^\circ)$? (fracción o decimal):`,
    guide: 'Seno = Cateto Opuesto / Hipotenusa. En el ángulo notable de 30°, el cateto opuesto mide exactamente la mitad de la hipotenusa.',
    miniExample: 'Ejemplo parecido: cos(60°) también vale 1/2 = 0.5.',
    placeholder: 'Ej: 1/2 o 0.5',
    canonicalAnswer: '0.5',
    acceptedAnswers: ['0.5', '1/2'],
    numericValue: 0.5,
    hint: 'Es el ángulo notable más usado en triángulos 30°-60°-90°.',
    steps: [
      { title: 'Recordá el triángulo notable', detail: 'En un triángulo equilátero partido a la mitad, el cateto opuesto a 30° mide la mitad de la hipotenusa.', latex: L`\operatorname{sen}(30^\circ) = \frac{1}{2} = 0{,}5` }
    ],
    commonMistakes: [
      { matchValues: ['0.866', '0.87'], diagnosis: 'Ese es el valor aproximado de cos(30°) = √3/2. El seno de 30° es exactamente 1/2.' }
    ],
    xp: 15
  },
  {
    id: 'simple-09',
    series: 'simple',
    order: 9,
    topic: 'Radianes',
    prompt: L`Si $90^\circ = k\pi\text{ rad}$, ¿cuánto vale el coeficiente $k$?`,
    guide: 'Recordá que 180° es 1π rad. Preguntate qué fracción de 180° es 90°.',
    miniExample: 'Ejemplo parecido: 60° es un tercio de 180°, así que 60° = (1/3)π → k = 1/3.',
    placeholder: 'Ej: 1/2 o 0.5',
    canonicalAnswer: '1/2',
    acceptedAnswers: ['1/2', '0.5'],
    numericValue: 0.5,
    hint: 'Partí de 180° = π rad y dividí por 2.',
    steps: [
      { title: 'Usá la equivalencia base', detail: '180° equivale a π radianes.', latex: L`180^\circ = \pi\text{ rad}` },
      { title: 'Dividí por 2', detail: '90° es la mitad de 180°.', latex: L`90^\circ = \frac{1}{2}\pi\text{ rad} \implies k = \frac{1}{2}` }
    ],
    commonMistakes: [
      { matchValues: ['2'], diagnosis: '2π rad es una vuelta completa (360°), no 90°.' }
    ],
    xp: 15
  },
  {
    id: 'simple-10',
    series: 'simple',
    order: 10,
    topic: 'Sistema 2×2 simple',
    prompt: L`Si $x + y = 10$ y $x - y = 2$, ¿cuánto vale $x$?`,
    guide: 'Sumá las dos ecuaciones hacia abajo: +y con -y se cancelan, y te queda 2x igual a la suma de los números.',
    miniExample: 'Ejemplo parecido: x + y = 8 y x - y = 4 → sumando: 2x = 12 → x = 6.',
    placeholder: 'Ej: 6',
    canonicalAnswer: '6',
    acceptedAnswers: ['6'],
    numericValue: 6,
    hint: 'Sumá ambas ecuaciones directamente: las "y" se cancelan.',
    steps: [
      { title: 'Sumá las dos ecuaciones', detail: 'Al sumar miembro a miembro desaparece y.', latex: L`(x+y)+(x-y) = 10 + 2 \implies 2x = 12` },
      { title: 'Despejá x', detail: 'Dividimos por 2.', latex: L`x = 6` }
    ],
    commonMistakes: [
      { matchValues: ['4'], diagnosis: '4 es el valor de y (ya que 6 + 4 = 10). La pregunta pide el valor de x.' }
    ],
    xp: 20
  }
];

export const CHALLENGE_EXERCISES: StepExercise[] = [
  {
    id: 'challenge-01',
    series: 'challenge',
    order: 1,
    topic: 'Decimal periódico a fracción',
    prompt: L`Escribí $0{,}\overline{27}$ como fracción irreducible (` + '`a/b`' + `):`,
    guide: 'El arco arriba del 27 significa que se repite infinitamente (0,272727...). Poné las cifras repetidas arriba y un 9 por cada cifra abajo, luego simplificá.',
    miniExample: 'Ejemplo parecido: 0,18 periódico = 18/99 = 2/11 (dividiendo por 9).',
    placeholder: 'Ej: 3/11',
    canonicalAnswer: '3/11',
    acceptedAnswers: ['3/11'],
    numericValue: 3 / 11,
    hint: 'Tiene 2 cifras periódicas: va sobre 99 y luego simplificás por 9.',
    steps: [
      { title: 'Convertí el período', detail: 'Dos cifras periódicas generan denominador 99.', latex: L`0{,}\overline{27} = \frac{27}{99}` },
      { title: 'Simplificá al máximo', detail: 'Dividimos numerador y denominador por 9.', latex: L`\frac{27 \div 9}{99 \div 9} = \frac{3}{11}` }
    ],
    commonMistakes: [
      { matchValues: ['27/100', '0.27'], diagnosis: 'Usaste denominador 100 como si fuera un decimal exacto (0,27), pero es periódico (0,272727...).' }
    ],
    xp: 25
  },
  {
    id: 'challenge-02',
    series: 'challenge',
    order: 2,
    topic: 'Propiedades de potencias',
    prompt: L`Calculá el valor exacto de $2^5 \cdot 2^{-2}$:`,
    guide: 'Cuando multiplicás potencias que tienen la misma base (el 2), sumás sus exponentes: 5 + (-2).',
    miniExample: 'Ejemplo parecido: 3⁴ · 3⁻² = 3^(4-2) = 3² = 9.',
    placeholder: 'Ej: 8',
    canonicalAnswer: '8',
    acceptedAnswers: ['8'],
    numericValue: 8,
    hint: 'Producto de igual base: sumá los exponentes (5 + (-2)).',
    steps: [
      { title: 'Sumá los exponentes', detail: 'Misma base 2.', latex: L`2^{5 + (-2)} = 2^3` },
      { title: 'Calculá la potencia', detail: '2 × 2 × 2 = 8.', latex: L`2^3 = 8` }
    ],
    commonMistakes: [
      { matchValues: ['128'], diagnosis: 'Restaste 5 - (-2) = 7 en vez de sumar 5 + (-2) = 3.' }
    ],
    xp: 25
  },
  {
    id: 'challenge-03',
    series: 'challenge',
    order: 3,
    topic: 'Extracción de radicales',
    prompt: L`Si $\sqrt{108} = k\sqrt{3}$, ¿cuánto vale $k$?`,
    guide: 'Dividí 108 por 3 para ver qué cuadrado perfecto está escondido adentro, y sacale la raíz cuadrada a ese número.',
    miniExample: 'Ejemplo parecido: √75 = √(25·3) = 5√3 → k = 5.',
    placeholder: 'Ej: 6',
    canonicalAnswer: '6',
    acceptedAnswers: ['6'],
    numericValue: 6,
    hint: 'Factorizá 108 = 36 × 3.',
    steps: [
      { title: 'Descomponé 108', detail: 'Buscamos el mayor cuadrado perfecto que divide a 108.', latex: L`108 = 36 \cdot 3 = 6^2 \cdot 3` },
      { title: 'Extraé la raíz', detail: 'La raíz de 36 sale como 6.', latex: L`\sqrt{108} = 6\sqrt{3} \implies k = 6` }
    ],
    commonMistakes: [
      { matchValues: ['36'], diagnosis: '36 es el cuadrado dentro de la raíz; al salir de √ queda su raíz cuadrada (6).' }
    ],
    xp: 25
  },
  {
    id: 'challenge-04',
    series: 'challenge',
    order: 4,
    topic: 'Discriminante cuadrático',
    prompt: L`En $2x^2 - 10x + 12 = 0$, calculá el discriminante $\Delta = b^2 - 4ac$:`,
    guide: 'Leé los 3 coeficientes con su signo: a=2, b=-10, c=12. Reemplazá en b² - 4·a·c (recordá que (-10)² es positivo).',
    miniExample: 'Ejemplo parecido: en x² - 5x + 6 = 0 → (-5)² - 4(1)(6) = 25 - 24 = 1.',
    placeholder: 'Ej: 4',
    canonicalAnswer: '4',
    acceptedAnswers: ['4'],
    numericValue: 4,
    hint: 'a = 2, b = -10, c = 12. Ojo: (-10)² = +100.',
    steps: [
      { title: 'Identificá coeficientes', detail: 'a = 2, b = -10, c = 12.', latex: L`\Delta = (-10)^2 - 4(2)(12)` },
      { title: 'Operá', detail: '100 - 96 = 4 (dos raíces reales distintas).', latex: L`\Delta = 100 - 96 = 4` }
    ],
    commonMistakes: [
      { matchValues: ['-196'], diagnosis: 'Pusiste -10² = -100 en lugar de (-10)² = +100.' }
    ],
    xp: 25
  },
  {
    id: 'challenge-05',
    series: 'challenge',
    order: 5,
    topic: 'Ecuación fraccionaria',
    prompt: L`Resolvé $\frac{-2}{2x-1} = \frac{3}{x+6}$ (fracción o decimal):`,
    guide: 'Es una igualdad de dos fracciones: multiplicá cruzado (-2 por lo de abajo a la derecha = 3 por lo de abajo a la izquierda) y despejá x.',
    miniExample: 'Ejemplo parecido: 2/(x+1) = 4/(x+3) → 2(x+3) = 4(x+1) → 2x+6 = 4x+4 → x = 1.',
    placeholder: 'Ej: -9/8',
    canonicalAnswer: '-9/8',
    acceptedAnswers: ['-9/8', '-1.125'],
    numericValue: -9 / 8,
    hint: 'Multiplicá en cruz: -2(x + 6) = 3(2x - 1).',
    steps: [
      { title: 'Verificá el dominio', detail: 'x ≠ 1/2 y x ≠ -6.', latex: L`2x-1\ne 0,\ x+6\ne 0` },
      { title: 'Multiplicá en cruz', detail: 'Aplicamos producto de medios y extremos.', latex: L`-2(x+6)=3(2x-1) \implies -2x-12=6x-3` },
      { title: 'Despejá x', detail: 'Agrupamos las x.', latex: L`-9 = 8x \implies x = -\frac{9}{8}` }
    ],
    commonMistakes: [
      { matchValues: ['9/8', '1.125'], diagnosis: 'El módulo 9/8 es correcto, pero revisá el signo al despejar -9 = 8x.' }
    ],
    xp: 30
  },
  {
    id: 'challenge-06',
    series: 'challenge',
    order: 6,
    topic: 'Inecuación con negativo',
    prompt: L`Al resolver $-2x > 6$ queda $x < c$. ¿Cuánto vale $c$?`,
    guide: 'Pasá el -2 dividiendo al 6 (6 ÷ (-2)). Al dividir por negativo el signo > gira a <, y el número c es el resultado de esa división.',
    miniExample: 'Ejemplo parecido: -3x > 12 → x < 12/(-3) → x < -4 (c = -4).',
    placeholder: 'Ej: -3',
    canonicalAnswer: '-3',
    acceptedAnswers: ['-3'],
    numericValue: -3,
    hint: 'Dividí ambos lados por -2 (y recordá que eso invierte el signo >).',
    steps: [
      { title: 'Dividí por -2', detail: 'Al dividir por un negativo, > se convierte en <.', latex: L`x < \frac{6}{-2}` },
      { title: 'Simplificá', detail: 'El extremo es -3.', latex: L`x < -3 \implies c = -3` }
    ],
    commonMistakes: [
      { matchValues: ['3'], diagnosis: 'Faltó dividir conservando el signo negativo: 6 / (-2) = -3.' }
    ],
    xp: 25
  },
  {
    id: 'challenge-07',
    series: 'challenge',
    order: 7,
    topic: 'Cuadrado de binomio',
    prompt: L`En $(2x + 3)^2 = 4x^2 + kx + 9$, ¿cuánto vale $k$?`,
    guide: 'El término del medio de (a + b)² siempre es el DOBLE producto: 2 · (primero) · (segundo). Multiplicá 2 · 2 · 3.',
    miniExample: 'Ejemplo parecido: (3x + 2)² = 9x² + 2·3·2·x + 4 → k = 12.',
    placeholder: 'Ej: 12',
    canonicalAnswer: '12',
    acceptedAnswers: ['12'],
    numericValue: 12,
    hint: 'El término central es el doble producto: 2 · (2x) · 3.',
    steps: [
      { title: 'Aplicá (a+b)²', detail: 'a = 2x y b = 3.', latex: L`(2x)^2 + 2\cdot(2x)\cdot 3 + 3^2` },
      { title: 'Calculá el doble producto', detail: '2 × 2 × 3 = 12.', latex: L`4x^2 + 12x + 9 \implies k = 12` }
    ],
    commonMistakes: [
      { matchValues: ['6'], diagnosis: 'Calculaste 2x · 3 = 6x, pero te faltó multiplicar por 2 (el doble producto).' }
    ],
    xp: 25
  },
  {
    id: 'challenge-08',
    series: 'challenge',
    order: 8,
    topic: 'Identidad pitagórica',
    prompt: L`Si $\operatorname{sen}\alpha = 0{,}6$ y $\alpha$ es agudo, calculá $\cos\alpha$:`,
    guide: 'Usá sen²α + cos²α = 1. Elevá 0,6 al cuadrado (0,36), restáselo a 1 (te queda 0,64) y sacale la raíz cuadrada.',
    miniExample: 'Ejemplo parecido: si sen α = 0,8 → cos α = √(1 - 0,64) = √0,36 = 0,6.',
    placeholder: 'Ej: 0.8 o 4/5',
    canonicalAnswer: '0.8',
    acceptedAnswers: ['0.8', '4/5'],
    numericValue: 0.8,
    hint: 'Usá sen²α + cos²α = 1.',
    steps: [
      { title: 'Despejá cos²α', detail: '1 - 0,6² = 1 - 0,36 = 0,64.', latex: L`\cos^2\alpha = 1 - 0{,}36 = 0{,}64` },
      { title: 'Tomá raíz positiva', detail: 'Como α es agudo, el coseno es positivo.', latex: L`\cos\alpha = \sqrt{0{,}64} = 0{,}8` }
    ],
    commonMistakes: [
      { matchValues: ['0.4', '2/5'], diagnosis: 'Restaste 1 - 0,6 directamente sin elevar al cuadrado (sen²α + cos²α = 1, no sen + cos = 1).' }
    ],
    xp: 25
  },
  {
    id: 'challenge-09',
    series: 'challenge',
    order: 9,
    topic: 'Examen 2006 (Exponencial)',
    prompt: L`Resolvé $\frac{2^{x+1}}{8} = \frac{1}{16}$ y escribí el valor de $x$:`,
    guide: 'Convertí el 8 y el 1/16 a potencias de base 2: 8 = 2³ y 1/16 = 2⁻⁴. Restá los exponentes de la izquierda e igualá con -4.',
    miniExample: 'Ejemplo parecido: 2ˣ / 4 = 1/8 → 2^(x-2) = 2⁻³ → x - 2 = -3 → x = -1.',
    placeholder: 'Ej: -2',
    canonicalAnswer: '-2',
    acceptedAnswers: ['-2'],
    numericValue: -2,
    hint: 'Escribí 8 = 2³ y 1/16 = 2⁻⁴.',
    steps: [
      { title: 'Pasá todo a base 2', detail: '8 = 2³ y 16 = 2⁴.', latex: L`\frac{2^{x+1}}{2^3} = 2^{-4} \implies 2^{x-2} = 2^{-4}` },
      { title: 'Igualá exponentes', detail: 'Bases iguales implican exponentes iguales.', latex: L`x - 2 = -4 \implies x = -2` }
    ],
    commonMistakes: [
      { matchValues: ['6'], diagnosis: 'Pusiste 1/16 = 2⁴ en lugar de 2⁻⁴.' }
    ],
    xp: 35
  },
  {
    id: 'challenge-10',
    series: 'challenge',
    order: 10,
    topic: 'Modelado 2×2 (PDF p. 41)',
    prompt: L`En un corral hay $60$ animales entre gallinas y vacas, y $150$ patas en total. ¿Cuántas vacas hay?`,
    guide: 'Cada gallina tiene 2 patas y cada vaca 4. Si los 60 tuvieran 2 patas habría 120 patas; las 30 patas que sobran son de 2 patas extra por cada vaca (30 ÷ 2).',
    miniExample: 'Ejemplo parecido: 10 animales y 26 patas → sobran 26 - 20 = 6 patas → 6 ÷ 2 = 3 vacas.',
    placeholder: 'Ej: 15',
    canonicalAnswer: '15',
    acceptedAnswers: ['15'],
    numericValue: 15,
    hint: 'g + v = 60 y 2g + 4v = 150. Restá el doble de la primera.',
    steps: [
      { title: 'Planteá el sistema', detail: 'Gallinas (2 patas) y vacas (4 patas).', latex: L`\begin{cases}g+v=60\\2g+4v=150\end{cases}` },
      { title: 'Eliminá g', detail: 'Restamos 2(g+v)=120 a la segunda ecuación.', latex: L`2v = 30 \implies v = 15` }
    ],
    commonMistakes: [
      { matchValues: ['45'], diagnosis: '45 es la cantidad de gallinas (60 - 15). El problema pregunta por las vacas.' }
    ],
    xp: 35
  }
];

export const ALL_STEP_EXERCISES: StepExercise[] = [
  ...FOUNDATION_EXERCISES,
  ...SIMPLE_EXERCISES,
  ...CHALLENGE_EXERCISES
];
