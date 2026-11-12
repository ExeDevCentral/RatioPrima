export interface CanonicalMathReference {
  book: string;
  author: string;
  chapter: string;
  topic: string;
  quote: string;
}

export interface FormalProofStep {
  step: string;
  justification: string;
}

export interface SocraticProbe {
  question: string;
  concept: string;
  answer: string;
}

export interface MathStep {
  stepNumber: number;
  title: string;
  instruction: string;
  commandOrExpression: string;
  rationale: string;
  expectedResult: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  symbol?: string;
  definition: string;
  rigorousContext: string;
}

export interface MathExercise {
  id: string;
  module: string;
  lessonNumber: number;
  title: string;
  subtitle: string;
  whyWeLearnThis: string;
  steps: MathStep[];
  references: CanonicalMathReference[];
  formalProof: {
    theorem: string;
    premises: string[];
    steps: FormalProofStep[];
    qed: string;
  };
  computationalVerification: {
    tool: string;
    code: string;
    output: string;
    explanation: string;
  };
  socraticQuestions: SocraticProbe[];
  glossary: GlossaryTerm[];
}

export const MODULE1_EXERCISES: MathExercise[] = [
  {
    id: 'math-m01-01',
    module: 'Módulo 01 · Axiomática de los Números Reales',
    lessonNumber: 1,
    title: 'Axiomas de Cuerpo y Demostración de (-a)·(-b) = a·b',
    subtitle: 'Dejar de memorizar "menos por menos es más": deducción estricta desde los axiomas de Peano y de Campo.',
    whyWeLearnThis: 'En la secundaria nos enseñan una regla nemotécnica arbitraria: "menos por menos es más". En el Politécnico y en Ingeniería, la matemática no es un acto de fe. Los números reales (R, +, ·) forman un CUERPO (Field). Toda propiedad algebraica debe ser deducible exclusivamente a partir de los axiomas de cerradura, conmutatividad, asociatividad, elemento neutro, inverso y distributividad.',
    steps: [
      {
        stepNumber: 1,
        title: 'Verificar la unicidad del inverso aditivo',
        instruction: 'Por definición de elemento opuesto, a + (-a) = 0. Cualquier elemento x tal que a + x = 0 es forzosamente x = -a.',
        commandOrExpression: 'a + (-a) = 0',
        rationale: 'Axioma de existencia de inverso aditivo en el cuerpo de los reales.',
        expectedResult: '0 (Elemento neutro de la suma)'
      },
      {
        stepNumber: 2,
        title: 'Demostrar que a · 0 = 0 para todo real',
        instruction: 'Escribimos a · 0 = a · (0 + 0) = a·0 + a·0. Sumando -(a·0) a ambos lados obtenemos 0 = a·0.',
        commandOrExpression: 'a * 0 == 0',
        rationale: 'Consecuencia directa de la distributividad del producto respecto a la suma neutra.',
        expectedResult: 'True (Teorema de anulación del producto por cero)'
      },
      {
        stepNumber: 3,
        title: 'Demostrar que (-a)·b = -(a·b)',
        instruction: 'Evaluamos a·b + (-a)·b = (a + (-a))·b = 0·b = 0. Luego, (-a)·b es el inverso aditivo de a·b.',
        commandOrExpression: '(-a) * b + a * b == 0',
        rationale: 'Distributividad a derecha: (a + (-a))·b = 0·b = 0.',
        expectedResult: 'True'
      },
      {
        stepNumber: 4,
        title: 'Concluir la regla de los signos: (-a)·(-b) = a·b',
        instruction: 'Calculamos (-a)·(-b) + (- (a·b)) = (-a)·(-b) + (-a)·b = (-a)·((-b) + b) = (-a)·0 = 0. Por unicidad del inverso, (-a)·(-b) = a·b.',
        commandOrExpression: 'simplify((-a) * (-b) - a * b)',
        rationale: 'Identidad axiomática rigurosa. Q.E.D.',
        expectedResult: '0'
      }
    ],
    references: [
      {
        book: 'Calculus (Volumen 1)',
        author: 'Michael Spivak',
        chapter: 'Capítulo 1: Propiedades básicas de los números',
        topic: 'Axiomas de Campo (P1 a P9)',
        quote: 'El hecho de que (-a)·(-b) = a·b suele considerarse misterioso. En realidad, no es un axioma ni una convención arbitraria, sino una consecuencia inevitable de la ley distributiva y la definición del inverso aditivo.'
      },
      {
        book: 'Mathematical Analysis (2da Ed.)',
        author: 'Tom M. Apostol',
        chapter: 'Capítulo 1: El sistema de números reales y complejos',
        topic: 'Estructura Algebraica de Cuerpo',
        quote: 'Un cuerpo es un conjunto F junto con dos operaciones binarias que satisfacen los axiomas de cuerpo. Todas las leyes del álgebra ordinaria se deducen formalmente de estos diez axiomas.'
      }
    ],
    formalProof: {
      theorem: 'Para todo a, b ∈ ℝ, se verifica (-a)·(-b) = a·b.',
      premises: [
        'Axioma Distributivo: x · (y + z) = x·y + x·z',
        'Inverso aditivo: x + (-x) = 0',
        'Neutro aditivo: x + 0 = x',
        'Unicidad del inverso: si x + y = 0, entonces y = -x'
      ],
      steps: [
        { step: 'a·0 = a·(0 + 0) = a·0 + a·0', justification: 'Neutro aditivo y distributividad' },
        { step: 'Sumando -(a·0) en ambos miembros: 0 = a·0', justification: 'Inverso aditivo' },
        { step: 'a·b + (-a)·b = (a + (-a))·b = 0·b = 0', justification: 'Distributividad e inverso' },
        { step: 'Por tanto, (-a)·b = -(a·b)', justification: 'Unicidad del opuesto de (a·b)' },
        { step: '(-a)·(-b) + [-(a·b)] = (-a)·(-b) + (-a)·b = (-a)·[(-b) + b] = (-a)·0 = 0', justification: 'Distributividad' },
        { step: '(-a)·(-b) = a·b', justification: 'Unicidad del opuesto aditivo' }
      ],
      qed: '■ Q.E.D. (Quod erat demonstrandum)'
    },
    computationalVerification: {
      tool: 'Python 3 + SymPy (Computer Algebra System)',
      code: 'import sympy as sp\na, b = sp.symbols("a b", real=True)\nexpr = (-a) * (-b) - a * b\nprint("Simplificación formal:", sp.simplify(expr))',
      output: 'Simplificación formal: 0',
      explanation: 'El motor algebraico simbólico reduce la identidad a 0 mediante los axiomas de anillo conmutativo.'
    },
    socraticQuestions: [
      {
        question: '¿Por qué la división por cero no está permitida en ningún cuerpo matemático?',
        concept: 'Inconsistencia axiomática',
        answer: 'Si existiera un inverso multiplicativo de 0 (digamos 0⁻¹), entonces 1 = 0 · 0⁻¹. Pero demostramos que x · 0 = 0 para todo elemento x. Por lo tanto 1 = 0, lo que colapsa el cuerpo a un conjunto trivial con un único elemento, violando el axioma de no trivialidad 1 ≠ 0.'
      },
      {
        question: '¿Qué propiedad matemática se violaría en los números reales si decidiéramos por decreto que (-1)·(-1) = -1?',
        concept: 'Fallo de la Propiedad Distributiva',
        answer: 'Se rompería la distributividad: 0 = (-1) · 0 = (-1) · (1 + (-1)) = (-1)·1 + (-1)·(-1) = -1 + (-1) = -2 ≠ 0. La aritmética entera dejaría de ser coherente.'
      }
    ],
    glossary: [
      {
        id: 'cuerpo-field',
        term: 'Cuerpo (Field)',
        symbol: '(F, +, ·)',
        definition: 'Estructura algebraica con dos operaciones binarias cerradas (suma y producto) que cumplen conmutatividad, asociatividad, distributividad y existencia de neutros e inversos.',
        rigorousContext: 'Los conjuntos Q y R son cuerpos. Z no lo es porque los enteros no tienen inverso multiplicativo en Z.'
      },
      {
        id: 'inverso-aditivo',
        term: 'Inverso Aditivo (Opuesto)',
        symbol: '-a',
        definition: 'Único elemento del cuerpo que al sumarse con a produce el elemento neutro de la adición: a + (-a) = 0.',
        rigorousContext: 'No representa un número negativo por sí mismo; si a = -5, su opuesto -a es +5.'
      }
    ]
  },
  {
    id: 'math-m01-02',
    module: 'Módulo 01 · Axiomática de los Números Reales',
    lessonNumber: 2,
    title: 'Axiomas de Orden y por qué se invierte la Desigualdad',
    subtitle: 'Deducción rigurosa de las inecuaciones: conjunto de números positivos (P) y tricotomía.',
    whyWeLearnThis: 'En cálculo infinitesimal y demostraciones de límites, el 90% del trabajo consiste en acotar desigualdades (|f(x) - L| < ε). Si no dominás por qué multiplicar por un número negativo invierte el sentido de la desigualdad a nivel axiomático, cometerás errores fatales en inecuaciones racionales.',
    steps: [
      {
        stepNumber: 1,
        title: 'Comprender el Axioma de Tricotomía',
        instruction: 'Para todo real a, ocurre exactamente una de tres posibilidades: a ∈ P (positivo), a = 0, o bien -a ∈ P.',
        commandOrExpression: 'a > 0  XOR  a == 0  XOR  -a > 0',
        rationale: 'El conjunto P parte a los reales en positivos, cero y negativos sin solapamiento.',
        expectedResult: 'Exactamente una condición verdadera'
      },
      {
        stepNumber: 2,
        title: 'Definir rigurosamente la relación menor que (<)',
        instruction: 'Escribir a < b significa estrictamente que (b - a) ∈ P.',
        commandOrExpression: 'b - a in P',
        rationale: 'Toda desigualdad en R es simplemente una afirmación sobre la pertenencia de una diferencia al conjunto P.',
        expectedResult: 'b - a > 0'
      },
      {
        stepNumber: 3,
        title: 'Multiplicar una desigualdad por un real positivo c > 0',
        instruction: 'Si a < b y c > 0, entonces (b - a) ∈ P y c ∈ P. Por cerradura de P bajo el producto, c·(b - a) = (c·b - c·a) ∈ P. Por lo tanto c·a < c·b.',
        commandOrExpression: 'c * (b - a) > 0',
        rationale: 'El producto de dos positivos es positivo.',
        expectedResult: 'c*a < c*b (mantiene el sentido)'
      },
      {
        stepNumber: 4,
        title: 'Multiplicar una desigualdad por un real negativo c < 0',
        instruction: 'Si c < 0, entonces (-c) ∈ P. Multiplicando (b - a) ∈ P por (-c) ∈ P obtenemos (-c)·(b - a) = (c·a - c·b) ∈ P. Por definición: c·b < c·a, o lo que es igual: c·a > c·b.',
        commandOrExpression: '(-c) * (b - a) > 0 ==> c*a > c*b',
        rationale: 'Deducción formal de la inversión del sentido de la desigualdad.',
        expectedResult: 'c*a > c*b (se invierte el sentido)'
      }
    ],
    references: [
      {
        book: 'Calculus (Volumen 1)',
        author: 'Michael Spivak',
        chapter: 'Capítulo 1: Propiedades básicas de los números',
        topic: 'Axiomas de Orden (P10 a P12)',
        quote: 'La propiedad de que a < b y c < 0 implica ca > cb es una fuente continua de errores para principiantes. Su demostración revela que no es una regla caprichosa sino consecuencia directa de la cerradura de P.'
      }
    ],
    formalProof: {
      theorem: 'Si a < b y c < 0, entonces c·a > c·b.',
      premises: [
        'Definición: a < b ⇔ (b - a) ∈ P',
        'Definición: c < 0 ⇔ -c ∈ P',
        'Cerradura del producto en P: x, y ∈ P ⇒ x·y ∈ P'
      ],
      steps: [
        { step: 'Dado a < b, se cumple (b - a) ∈ P', justification: 'Definición de orden' },
        { step: 'Dado c < 0, se cumple (-c) ∈ P', justification: 'Definición de negatividad' },
        { step: '(-c) · (b - a) ∈ P', justification: 'Axioma de cerradura del producto en P' },
        { step: '(-c)·b - (-c)·a = - (c·b) + c·a = c·a - c·b ∈ P', justification: 'Leyes distributivas y signos' },
        { step: 'c·b < c·a, es decir, c·a > c·b', justification: 'Definición de orden formal' }
      ],
      qed: '■ Q.E.D.'
    },
    computationalVerification: {
      tool: 'Python 3 + SymPy',
      code: 'import sympy as sp\nx = sp.Symbol("x", real=True)\nineq = -2 * x < 6\nsolution = sp.solve_univariate_inequality(ineq, x)\nprint("Conjunto solución formal:", solution)',
      output: 'Conjunto solución formal: x > -3',
      explanation: 'Al dividir por -2, el solver invierte formalmente la desigualdad de menor a mayor.'
    },
    socraticQuestions: [
      {
        question: '¿Por qué la afirmación "si x < y entonces x² < y²" es FALSA en general?',
        concept: 'Contraejemplo de valores negativos',
        answer: 'Porque si x = -5 e y = 2, se tiene -5 < 2, pero (-5)² = 25 y 2² = 4, con lo cual 25 > 4. La función f(t) = t² solo es monótona creciente cuando t ≥ 0.'
      }
    ],
    glossary: [
      {
        id: 'tricotomia',
        term: 'Axioma de Tricotomía',
        definition: 'Principio que establece que para cualquier número real a, exactamente una de las siguientes proposiciones es verdadera: a es positivo, a es cero, o -a es positivo.',
        rigorousContext: 'Garantiza que la recta real es totalmente ordenada.'
      }
    ]
  }
];
