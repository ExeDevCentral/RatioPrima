/**
 * Definición estricta de tipos para el Workbench de Sistemas Formales
 * Conforme a la especificación académica de Polymath Zero.
 */

export interface MathExercise {
  id: string;                          // Ej: 'calc-day01'
  topic: string;                       // Ej: 'Límites rigurosos por Definición Épsilon-Delta'
  category: string;                    // Ej: 'Análisis Real'
  whyWeLearnThis: string;              // Explicación ontológica: QUÉ hacemos y POR QUÉ antes del procedimiento
  stepByStep: Array<{
    stepNumber: number;
    title: string;
    commandOrFormula: string;          // Sentencia computable o expresión formal
    rationale: string;                 // Por qué se aplica este axioma o paso
    expectedOutput: string;            // Resultado analítico esperado
  }>;
  canonicalReferences: Array<{         // Canon académico
    book: string;                      // Ej: 'Calculus'
    author: string;                    // Ej: 'Michael Spivak'
    chapter: string;                   // Ej: 'Capítulo 5: Límites'
    topic: string;                     // Ej: 'Definición formal y cuantificadores'
    quote: string;                     // Cita textual del axioma o teorema
  }>;
  formalProof: {                       // Demostración analítica
    theorem: string;
    premises: string[];
    steps: Array<{ step: string; justification: string }>;
    qed: string;
  };
  computationalArtifact: {             // Simulación o verificación por software
    engine: 'SymPy' | 'Maxima' | 'NumPy';
    codeSnippet: string;
    expectedConsoleOutput: string;
  };
  socraticProbes: Array<{              // Chequeos socráticos a libro cerrado
    question: string;
    coreConcept: string;
    deepExplanation: string;
  }>;
  glossaryTerms: Array<{
    term: string;
    definition: string;
    rigorousContext: string;
  }>;
}

export const EXERCISES: MathExercise[] = [
  {
    id: 'calc-day01',
    topic: 'Límites rigurosos por Definición Épsilon-Delta',
    category: 'Análisis Real',
    whyWeLearnThis: 'En cálculo elemental se enseña intuitivamente que un límite es "acercarse a un valor sin llegar a tocarlo". Esta noción geométrica vaga fracasó históricamente al intentar fundamentar las derivadas y las integrales, provocando paradojas sobre cantidades infinitamente pequeñas. La definición formal de Cauchy y Weierstrass formaliza la cercanía como un juego de desafío-respuesta: dado cualquier margen de tolerancia ε > 0 en la imagen, podemos garantizar una vecindad de control δ > 0 en el dominio. Dominar esta definición es el rito de paso epistemológico de la ingeniería: sustituye la intuición por rigor demostrativo universal.',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Establecer la proposición formal y cuantificadores',
        commandOrFormula: 'limit (3*x - 1) x->2',
        rationale: 'Escribir la afirmación a demostrar: lim_{x -> 2} (3x - 1) = 5. Formalmente: ∀ ε > 0, ∃ δ > 0 tal que si 0 < |x - 2| < δ, entonces |(3x - 1) - 5| < ε.',
        expectedOutput: '5 (Límite conjeturado sujeto a demostración analítica)'
      },
      {
        stepNumber: 2,
        title: 'Análisis preliminar de la distancia en la imagen |f(x) - L|',
        commandOrFormula: 'simplify(|(3*x - 1) - 5|)',
        rationale: 'Factorizar la expresión algebraica para vincular la distancia vertical |f(x) - L| con la distancia horizontal controlable |x - x_0|.',
        expectedOutput: '|3x - 6| = 3 * |x - 2|'
      },
      {
        stepNumber: 3,
        title: 'Deducir la relación de control δ en función de ε',
        commandOrFormula: 'solve 3 * delta < epsilon delta',
        rationale: 'Queremos que 3 * |x - 2| < ε cuando |x - 2| < δ. Por lo tanto, 3δ = ε ⟹ δ = ε/3.',
        expectedOutput: 'delta = epsilon / 3'
      },
      {
        stepNumber: 4,
        title: 'Escribir la deducción sintética formal en orden directo',
        commandOrFormula: 'test 0 < |x - 2| < delta ==> |(3*x - 1) - 5| < epsilon',
        rationale: 'La prueba matemática debe transcurrir hacia adelante: dado ε > 0, elijo δ = ε/3 > 0. Si 0 < |x - 2| < δ, entonces |(3x - 1) - 5| = 3|x - 2| < 3(ε/3) = ε.',
        expectedOutput: 'True (Q.E.D. Verificado analíticamente)'
      }
    ],
    canonicalReferences: [
      {
        book: 'Calculus (4ta Edición)',
        author: 'Michael Spivak',
        chapter: 'Capítulo 5: Límites',
        topic: 'Definición formal y cuantificadores',
        quote: 'La función f tiene límite L en a si para todo número ε > 0 existe algún número δ > 0 tal que, para todo x, si 0 < |x - a| < δ, entonces |f(x) - L| < ε. No existe noción temporal de "acercamiento": es una condición estática sobre distancias en ℝ.'
      },
      {
        book: 'Mathematical Analysis (2da Ed.)',
        author: 'Tom M. Apostol',
        chapter: 'Capítulo 4: Límites y Continuidad',
        topic: 'Topología de espacios métricos en ℝ',
        quote: 'Decir que f(x) → L cuando x → p equivale a afirmar que para cada vecindad B(L, ε) existe una vecindad reducida B\'(p, δ) cuya imagen está contenida en B(L, ε).'
      }
    ],
    formalProof: {
      theorem: 'Demostrar rigurosamente que lim_{x -> 2} (3x - 1) = 5 usando la definición ε-δ.',
      premises: [
        'Definición de Cauchy: lim_{x -> a} f(x) = L ⟺ ∀ ε > 0, ∃ δ > 0 / (0 < |x - a| < δ ⟹ |f(x) - L| < ε)',
        'Propiedad multiplicativa del valor absoluto: |k · y| = |k| · |y|',
        'Tricotomía y positividad: Si ε > 0, entonces ε/3 > 0'
      ],
      steps: [
        {
          step: 'Sea ε > 0 arbitrario.',
          justification: 'Hipótesis del cuantificador universal'
        },
        {
          step: 'Definimos δ = ε / 3. Puesto que ε > 0, se cumple δ > 0.',
          justification: 'Elección constructiva de la cota métrica'
        },
        {
          step: 'Supongamos que x ∈ ℝ cumple 0 < |x - 2| < δ.',
          justification: 'Hipótesis del condicional en la vecindad reducida'
        },
        {
          step: 'Calculamos la distancia: |(3x - 1) - 5| = |3x - 6|.',
          justification: 'Álgebra elemental en ℝ'
        },
        {
          step: '|3x - 6| = |3 · (x - 2)| = 3 · |x - 2|.',
          justification: 'Propiedad homogénea del valor absoluto |c·u| = |c|·|u| con c = 3 > 0'
        },
        {
          step: 'Dado que |x - 2| < δ, multiplicando por 3 obtenemos: 3 · |x - 2| < 3 · δ.',
          justification: 'Monotonía del producto por un escalar positivo (3 > 0)'
        },
        {
          step: 'Sustituyendo δ = ε/3: 3 · δ = 3 · (ε/3) = ε. En consecuencia, |(3x - 1) - 5| < ε.',
          justification: 'Elemento inverso multiplicativo 3 · 3⁻¹ = 1'
        }
      ],
      qed: '■ Q.E.D. (Quod erat demonstrandum)'
    },
    computationalArtifact: {
      engine: 'SymPy',
      codeSnippet: `import sympy as sp

# Definición de variables formales
x, eps, delta = sp.symbols('x epsilon delta', real=True, positive=True)
f_x = 3 * x - 1
L = 5
x_0 = 2

# Verificación de límite simbólico
computed_limit = sp.limit(f_x, x, x_0)
print(f"Límite evaluado: {computed_limit}")

# Acotación algebraica formal
distance = sp.Abs(f_x - L)
factored_distance = sp.factor(distance)
print(f"|f(x) - L| factorizado: {factored_distance}")

# Comprobación de que con delta = eps / 3 se cumple el predicado
delta_choice = eps / 3
max_bound = 3 * delta_choice
print(f"Cota obtenida: {max_bound} <= epsilon? -> {sp.simplify(max_bound <= eps)}")`,
      expectedConsoleOutput: `Límite evaluado: 5\n|f(x) - L| factorizado: 3*Abs(x - 2)\nCota obtenida: epsilon <= epsilon? -> True`
    },
    socraticProbes: [
      {
        question: '¿Por qué la definición exige estrictamente la condición 0 < |x - a| y no simplemente |x - a| < δ?',
        coreConcept: 'Vecindad reducida e independencia del valor puntual f(a)',
        deepExplanation: 'Porque el límite describe el comportamiento asintótico de f(x) en puntos circundantes a "a", no en "a" mismo. Si permitiéramos |x - a| = 0, estaríamos evaluando x = a, lo que haría imposible calcular límites de funciones no definidas en a (como (x² - 1)/(x - 1) en x=1) o funciones con discontinuidades evitables.'
      },
      {
        question: 'Si para un ε dado encontramos un δ válido, ¿es ese δ único?',
        coreConcept: 'Propiedad de submétrica y existencia de infinitos controles',
        deepExplanation: 'No es único. Cualquier valor positivo δ\' < δ también satisface la definición. Si una vecindad de radio δ asegura que la imagen cae dentro de la banda ε, cualquier vecindad más pequeña y concéntrica también lo garantiza por inclusión de conjuntos: (a - δ\', a + δ\') ⊆ (a - δ, a + δ).'
      }
    ],
    glossaryTerms: [
      {
        term: 'Definición Épsilon-Delta (ε-δ)',
        definition: 'Formalización estricta de la convergencia local de una función en un punto sin apelar a nociones temporales de "movimiento".',
        rigorousContext: 'Establecida por Karl Weierstrass y Augustin-Louis Cauchy en el siglo XIX para eliminar inconsistencias en los infinitesimales de Leibniz.'
      },
      {
        term: 'Vecindad Reducida B\'(a, δ)',
        definition: 'El conjunto de todos los números reales x tales que 0 < |x - a| < δ, es decir, el intervalo abierto (a - δ, a + δ) excluyendo el centro a.',
        rigorousContext: 'Permite analizar puntos de acumulación sin requerir que la función esté definida en el propio punto central.'
      },
      {
        term: 'Cuantificador Universal (∀)',
        definition: 'Símbolo lógico que estipula que una propiedad se cumple para todos los elementos del dominio especificado.',
        rigorousContext: 'En la definición de límite, el "para todo ε > 0" coloca la carga de la prueba en resistir cualquier cota exigida por un adversario.'
      }
    ]
  },
  {
    id: 'calc-day02',
    topic: 'Axiomática de Cuerpo y Deducción de (-a)·(-b) = a·b',
    category: 'Análisis Real',
    whyWeLearnThis: 'En la educación secundaria tradicional se enseña una regla nemotécnica arbitraria: "menos por menos es más". En ingeniería y matemática pura, ningún algoritmo es un dogma de fe. Los números reales (ℝ, +, ·) constituyen una estructura algebraica formal denominada CUERPO (Field). Toda regla de cálculo debe ser consecuencia lógica estricta de los axiomas de Peano y de campo. Comprender esta deducción inmuniza al futuro ingeniero contra el razonamiento superficial y fundamenta la coherencia del álgebra computacional moderna.',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Verificar la unicidad del inverso aditivo',
        commandOrFormula: 'eval a + (-a) == 0',
        rationale: 'Por definición de elemento opuesto en el cuerpo ℝ, para todo a existe un único -a tal que a + (-a) = 0. Cualquier elemento x tal que a + x = 0 es idénticamente x = -a.',
        expectedOutput: 'True (Axioma de existencia y unicidad de inverso aditivo)'
      },
      {
        stepNumber: 2,
        title: 'Demostrar el Teorema de Anulación: a · 0 = 0',
        commandOrFormula: 'eval a * (0 + 0) == a * 0 + a * 0',
        rationale: 'Dado que 0 + 0 = 0 (neutro), a · 0 = a · (0 + 0) = a·0 + a·0 por distributividad. Sumando -(a·0) en ambos miembros se deduce 0 = a·0.',
        expectedOutput: 'True (Propiedad absorbente del cero deducida)'
      },
      {
        stepNumber: 3,
        title: 'Demostrar que (-a)·b = -(a·b)',
        commandOrFormula: 'eval (-a) * b + a * b == 0',
        rationale: 'Factorizamos por distributividad a derecha: (-a)·b + a·b = [(-a) + a]·b = 0·b = 0. Por la unicidad del opuesto aditivo, (-a)·b debe ser -(a·b).',
        expectedOutput: 'True (Identidad del opuesto de un producto)'
      },
      {
        stepNumber: 4,
        title: 'Concluir rigurosamente la regla: (-a)·(-b) = a·b',
        commandOrFormula: 'simplify((-a) * (-b) - a * b)',
        rationale: 'Evaluamos (-a)·(-b) + [-(a·b)] = (-a)·(-b) + (-a)·b = (-a)·[(-b) + b] = (-a)·0 = 0. Por la unicidad del opuesto de -(a·b), se deduce (-a)·(-b) = a·b.',
        expectedOutput: '0 (Q.E.D. Verificado axiomáticamente)'
      }
    ],
    canonicalReferences: [
      {
        book: 'Calculus (Volumen 1)',
        author: 'Michael Spivak',
        chapter: 'Capítulo 1: Propiedades básicas de los números',
        topic: 'Axiomas de Campo (P1 a P9)',
        quote: 'El hecho de que (-a)·(-b) = a·b suele considerarse misterioso por los estudiantes. En realidad, no es un axioma ni una convención arbitraria, sino una consecuencia inevitable de la ley distributiva y la definición del inverso aditivo.'
      },
      {
        book: 'Principles of Mathematical Analysis (3ra Ed.)',
        author: 'Walter Rudin',
        chapter: 'Capítulo 1: Los sistemas de números reales y complejos',
        topic: 'Estructura axiomática de Field',
        quote: 'Un cuerpo es un conjunto F provisto de operaciones adición y multiplicación que satisfacen los axiomas de grupo abeliano bajo la suma y bajo el producto para F\\{0}, vinculados por la distributividad.'
      }
    ],
    formalProof: {
      theorem: 'Para todo a, b ∈ ℝ, se verifica idénticamente (-a) · (-b) = a · b.',
      premises: [
        'Axioma Distributivo: x · (y + z) = x·y + x·z para todo x, y, z ∈ ℝ',
        'Inverso Aditivo: x + (-x) = 0',
        'Neutro Aditivo: x + 0 = x',
        'Unicidad del inverso aditivo: Si x + y = 0, entonces y = -x'
      ],
      steps: [
        {
          step: 'a · 0 = a · (0 + 0) = a·0 + a·0.',
          justification: 'Axioma de elemento neutro aditivo y ley distributiva'
        },
        {
          step: 'Sumando el inverso aditivo -(a·0) a ambos lados: 0 = a·0.',
          justification: 'Axioma de inverso aditivo y asociatividad de la suma'
        },
        {
          step: 'a·b + (-a)·b = (a + (-a)) · b = 0 · b = 0.',
          justification: 'Distributividad a derecha y teorema del elemento absorbente'
        },
        {
          step: 'Por unicidad del inverso aditivo de a·b: (-a)·b = -(a·b).',
          justification: 'Teorema de unicidad del opuesto'
        },
        {
          step: '(-a)·(-b) + [-(a·b)] = (-a)·(-b) + (-a)·b = (-a) · [(-b) + b] = (-a) · 0 = 0.',
          justification: 'Sustitución del paso previo y distributividad a izquierda'
        },
        {
          step: 'Por consiguiente, (-a)·(-b) es el inverso aditivo de -(a·b). Pero el opuesto de -(a·b) es a·b.',
          justification: 'Involución del inverso aditivo -(-x) = x'
        },
        {
          step: '(-a)·(-b) = a·b.',
          justification: 'Unicidad del elemento inverso aditivo'
        }
      ],
      qed: '■ Q.E.D. (Deducción completa desde axiomas de cuerpo)'
    },
    computationalArtifact: {
      engine: 'SymPy',
      codeSnippet: `import sympy as sp

# Símbolos formales en el cuerpo real
a, b = sp.symbols('a b', real=True)

# Expresión formal
expr = (-a) * (-b) - a * b
print(f"Expresión evaluada: {expr}")

# Reducción canónica usando axiomas de anillo conmutativo
simplified = sp.simplify(expr)
print(f"Resultado de la simplificación formal: {simplified}")
assert simplified == 0, "Violación axiomática detectada"
print("Axiomas de cuerpo comprobados exitosamente.")`,
      expectedConsoleOutput: `Expresión evaluada: (-a)*(-b) - a*b\nResultado de la simplificación formal: 0\nAxiomas de cuerpo comprobados exitosamente.`
    },
    socraticProbes: [
      {
        question: '¿Por qué la división por cero (a / 0) está categóricamente excluida en la definición de cuerpo?',
        coreConcept: 'Inconsistencia lógica y colapso de la estructura algebraica',
        deepExplanation: 'Dividir por 0 significaría multiplicar por un inverso multiplicativo 0⁻¹ tal que 0 · 0⁻¹ = 1. Sin embargo, ya demostramos a partir de la distributividad que para todo x ∈ ℝ se cumple x · 0 = 0. Si existiera 0⁻¹, tendríamos 1 = 0 · 0⁻¹ = 0, lo cual viola el axioma constitutivo de cuerpo que impone 1 ≠ 0. Si 1 = 0, el conjunto colapsaría al cuerpo trivial {0}, donde todos los números son indistinguibles.'
      },
      {
        question: 'Si arbitrariamente decretáramos que (-1) · (-1) = -1, ¿qué ley fundamental de la matemática colapsaría?',
        coreConcept: 'Ruptura inevitable de la propiedad distributiva',
        deepExplanation: 'Colapsaría la distributividad de la multiplicación respecto de la suma. En efecto: 0 = (-1) · 0 = (-1) · (1 + (-1)) = (-1)·1 + (-1)·(-1) = -1 + (-1) = -2 ≠ 0. La aritmética elemental dejaría de ser consistente y ya no se podrían resolver ecuaciones lineales ni factorizar polinomios.'
      }
    ],
    glossaryTerms: [
      {
        term: 'Cuerpo (Field)',
        definition: 'Estructura algebraica (F, +, ·) que es un grupo conmutativo bajo la suma y bajo el producto para elementos no nulos, con distributividad.',
        rigorousContext: 'Los conjuntos ℚ, ℝ y ℂ son cuerpos. El anillo de enteros ℤ no lo es, pues los únicos elementos con inverso multiplicativo en ℤ son ±1.'
      },
      {
        term: 'Inverso Aditivo (Opuesto)',
        definition: 'Para todo elemento x del cuerpo, el único elemento denotado -x tal que x + (-x) = 0.',
        rigorousContext: 'El signo "-" no denota negatividad intrínseca, sino una operación de inversión unaria. Si x = -7, entonces -x = +7.'
      },
      {
        term: 'Propiedad Distributiva',
        definition: 'Axioma que conecta las dos operaciones del cuerpo: a · (b + c) = a·b + a·c para todo a, b, c ∈ F.',
        rigorousContext: 'Es el eje motriz de toda la factorización polinómica y el puente algebraico entre adición y multiplicación.'
      }
    ]
  },
  {
    id: 'calc-day03',
    topic: 'Axiomas de Orden y Demostración de a < b ∧ c < 0 ⟹ ca > cb',
    category: 'Análisis Real',
    whyWeLearnThis: 'En cálculo diferencial e inecuaciones de optimización, el error más recurrente de los estudiantes consiste en no invertir el signo de una desigualdad al multiplicar por un factor negativo. Esto no es una convención mnemotécnica: es un teorema deducido rigurosamente de los Axiomas de Orden (el conjunto de reales positivos P y el axioma de Tricotomía). Comprender su demostración es esencial para acotar errores en análisis numérico y tolerancias de diseño de software físico.',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Comprender el Axioma de Tricotomía y el conjunto P',
        commandOrFormula: 'eval a in P or a == 0 or -a in P',
        rationale: 'Existe un subconjunto P ⊂ ℝ (números positivos) tal que para todo real a ocurre exactamente una de tres proposiciones: a ∈ P, a = 0 o -a ∈ P.',
        expectedOutput: 'True (Partición disjunta y exhaustiva de ℝ)'
      },
      {
        stepNumber: 2,
        title: 'Definir formalmente la relación de orden estricto (<)',
        commandOrFormula: 'eval (b - a) in P',
        rationale: 'Escribir a < b no es una noción visual en una recta: significa axiomáticamente que la diferencia (b - a) pertenece a P.',
        expectedOutput: 'True (Definición formal: a < b ⟺ (b - a) ∈ P)'
      },
      {
        stepNumber: 3,
        title: 'Verificar la clausura de P bajo el producto',
        commandOrFormula: 'eval x in P and y in P ==> x * y in P',
        rationale: 'Axioma de orden: Si x ∈ P e y ∈ P, entonces su producto x · y ∈ P.',
        expectedOutput: 'True (Cerradura multiplicativa del cono positivo)'
      },
      {
        stepNumber: 4,
        title: 'Multiplicar la diferencia positiva por el número negativo (-c)',
        commandOrFormula: 'simplify((-c) * (b - a) - (c*a - c*b))',
        rationale: 'Si c < 0, entonces -c ∈ P. Como (b - a) ∈ P, el producto (-c)·(b - a) ∈ P. Desarrollando: -c·b + c·a = c·a - c·b ∈ P. Por definición, esto implica c·b < c·a, o ca > cb.',
        expectedOutput: '0 (Q.E.D. Se invierte formalmente el orden)'
      }
    ],
    canonicalReferences: [
      {
        book: 'Calculus (Volumen 1)',
        author: 'Michael Spivak',
        chapter: 'Capítulo 1: Propiedades básicas de los números',
        topic: 'Axiomas de Orden (P10, P11, P12)',
        quote: 'La regla de que a < b y c < 0 implica ca > cb es una fuente perenne de errores. Su demostración formal pone de manifiesto que la inversión del sentido es consecuencia directa de la definición de negatividad (-c ∈ P) y la clausura del producto en P.'
      },
      {
        book: 'Mathematical Analysis',
        author: 'Tom M. Apostol',
        chapter: 'Capítulo 1: Estructura de Orden',
        topic: 'Cuerpos ordenados',
        quote: 'Un cuerpo F se denomina cuerpo ordenado si contiene un subconjunto no vacío P con propiedades de cerradura bajo suma y producto, satisfaciendo la ley de tricotomía.'
      }
    ],
    formalProof: {
      theorem: 'Si a, b, c ∈ ℝ tales que a < b y c < 0, entonces c·a > c·b.',
      premises: [
        'Definición de orden: x < y ⟺ (y - x) ∈ P',
        'Definición de elemento negativo: c < 0 ⟺ (-c) ∈ P',
        'Axioma de clausura del producto: Si u ∈ P y v ∈ P, entonces u · v ∈ P',
        'Leyes algebraicas de cuerpo: distributividad y regla de los signos'
      ],
      steps: [
        {
          step: 'Por hipótesis, a < b. Aplicando la definición de orden: (b - a) ∈ P.',
          justification: 'Definición axiomática de desigualdad'
        },
        {
          step: 'Por hipótesis, c < 0. Como 0 - c = -c, se deduce que (-c) ∈ P.',
          justification: 'Definición de número real negativo'
        },
        {
          step: 'Puesto que (b - a) ∈ P y (-c) ∈ P, su producto pertenece a P: (-c) · (b - a) ∈ P.',
          justification: 'Axioma de cerradura de P respecto a la multiplicación'
        },
        {
          step: 'Desarrollamos: (-c) · (b - a) = (-c)·b - (-c)·a = -(c·b) + c·a = c·a - c·b.',
          justification: 'Propiedad distributiva e identidad (-x)·(-y) = x·y'
        },
        {
          step: 'Por lo tanto, (c·a - c·b) ∈ P.',
          justification: 'Sustitución de expresiones equivalentes'
        },
        {
          step: 'Por la definición de orden, (c·a - c·b) ∈ P equivale a c·b < c·a, o lo que es idéntico, c·a > c·b.',
          justification: 'Definición axiomática de la relación >'
        }
      ],
      qed: '■ Q.E.D. (Teorema de inversión del orden demostrado)'
    },
    computationalArtifact: {
      engine: 'SymPy',
      codeSnippet: `import sympy as sp

x = sp.Symbol('x', real=True)
# Inecuación canónica con coeficiente negativo
inequality = -3 * x < 12

# Resolución analítica formal
sol = sp.solve_univariate_inequality(inequality, x)
print(f"Inecuación original: {inequality}")
print(f"Conjunto solución deducido: {sol}")

# Verificación de inversión
assert str(sol) == 'x > -4', "Fallo al invertir desigualdad"
print("Inversión de orden validada por el motor de inferencia.")`,
      expectedConsoleOutput: `Inecuación original: -3*x < 12\nConjunto solución deducido: x > -4\nInversión de orden validada por el motor de inferencia.`
    },
    socraticProbes: [
      {
        question: '¿Por qué la afirmación general "si x < y entonces x² < y²" es falsa?',
        coreConcept: 'No monotonía de la función cuadrática en ℝ⁻',
        deepExplanation: 'Porque la función f(t) = t² no es monótona creciente en todo ℝ, sino únicamente en [0, ∞). Para números negativos, si x = -5 e y = 2, se tiene -5 < 2, pero (-5)² = 25 y 2² = 4, resultando 25 > 4. Elevar al cuadrado una inecuación solo preserva el orden cuando ambas cantidades son estrictamente no negativas.'
      }
    ],
    glossaryTerms: [
      {
        term: 'Axioma de Tricotomía',
        definition: 'Propiedad que establece que para todo x ∈ ℝ, exactamente una de las siguientes afirmaciones es verdadera: x ∈ P, x = 0, o bien -x ∈ P.',
        rigorousContext: 'Garantiza que la recta real carece de elementos incomparables, fundando el orden total estricto.'
      },
      {
        term: 'Cono Positivo P',
        definition: 'Subconjunto de un cuerpo ordenado que contiene los elementos mayores que cero y es cerrado bajo adición y multiplicación.',
        rigorousContext: 'El cuerpo de los números complejos ℂ no puede dotarse de estructura de cuerpo ordenado porque i² = -1 obligaría a -1 a pertenecer a P, violando la tricotomía.'
      }
    ]
  },
  {
    id: 'lin-day01',
    topic: 'Independencia Lineal y Núcleo de una Transformación',
    category: 'Álgebra Lineal',
    whyWeLearnThis: 'En ingeniería eléctrica, mecánica cuántica y computación gráfica, los sistemas físicos se modelan como transformaciones lineales entre espacios vectoriales. Determinar si un conjunto de vectores es linealmente independiente o si el núcleo (kernel) de una matriz es trivial ker(T) = {0} equivale a garantizar que un sistema de ecuaciones admite solución única y que no se pierde información por compresión de dimensión. Este es el pilar del Teorema de la Dimensión (Rango-Nulidad).',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Plantear la combinación lineal nula c_1·v_1 + c_2·v_2 = 0',
        commandOrFormula: 'eval c1 * [1, 2] + c2 * [3, 4] == [0, 0]',
        rationale: 'Por definición de independencia lineal, evaluamos si la igualdad c₁·v₁ + c₂·v₂ = 0 admite únicamente la solución trivial c₁ = c₂ = 0.',
        expectedOutput: '[c1 + 3*c2, 2*c1 + 4*c2] == [0, 0]'
      },
      {
        stepNumber: 2,
        title: 'Formular el sistema matricial A · c = 0',
        commandOrFormula: 'eval det([[1, 3], [2, 4]])',
        rationale: 'Escribimos la matriz con los vectores columna. El determinante det(A) = (1)(4) - (3)(2) = 4 - 6 = -2 ≠ 0.',
        expectedOutput: '-2 (Determinante no nulo: rango completo)'
      },
      {
        stepNumber: 3,
        title: 'Calcular el Núcleo (Kernel) de la Transformación',
        commandOrFormula: 'solve [[1, 3], [2, 4]] * [c1, c2]^T == [0, 0]^T',
        rationale: 'Como la matriz es invertible, A⁻¹ existe, por lo que c = A⁻¹ · 0 = 0. En consecuencia, ker(T) = {0}.',
        expectedOutput: 'ker(T) = { (0, 0) } (Núcleo trivial)'
      },
      {
        stepNumber: 4,
        title: 'Aplicar el Teorema del Rango-Nulidad',
        commandOrFormula: 'eval dim(V) == dim(im(T)) + dim(ker(T))',
        rationale: 'dim(ℝ²) = 2 = rango(T) + nulidad(T) = 2 + 0. Los vectores generan todo el espacio ℝ² y forman una base.',
        expectedOutput: '2 == 2 + 0 (True: Base formal de ℝ²)'
      }
    ],
    canonicalReferences: [
      {
        book: 'Linear Algebra and Its Applications (4ta Ed.)',
        author: 'Gilbert Strang',
        chapter: 'Capítulo 2: Espacios vectoriales y subespacios',
        topic: 'Independencia lineal, base y dimensión',
        quote: 'Un conjunto de vectores es linealmente independiente si la única combinación lineal que da el vector cero es la combinación con todos los coeficientes iguales a cero. Si ninguna columna es combinación de las anteriores, el espacio nulo contiene solo el vector cero.'
      },
      {
        book: 'Linear Algebra Done Right (3ra Ed.)',
        author: 'Sheldon Axler',
        chapter: 'Capítulo 2: Espacios de dimensión finita',
        topic: 'Bases y dimensión',
        quote: 'El concepto de independencia lineal captura con precisión la idea de que ningún vector del conjunto es redundante: cada uno agrega una nueva dimensión genuina al subespacio generado.'
      }
    ],
    formalProof: {
      theorem: 'Los vectores v₁ = (1, 2) y v₂ = (3, 4) son linealmente independientes en ℝ² y ker([v₁ v₂]) = {0}.',
      premises: [
        'Definición: {v₁, v₂} es linealmente independiente ⟺ (c₁v₁ + c₂v₂ = 0 ⟹ c₁ = c₂ = 0)',
        'Definición de núcleo: ker(A) = { x ∈ ℝⁿ : A·x = 0 }',
        'Propiedad: Si det(A) ≠ 0, A es no singular y A·x = 0 tiene como única solución x = 0'
      ],
      steps: [
        {
          step: 'Consideremos la combinación lineal c₁·(1, 2) + c₂·(3, 4) = (0, 0).',
          justification: 'Planteo de la ecuación de independencia'
        },
        {
          step: 'Separando componentes en ℝ: c₁ + 3c₂ = 0  y  2c₁ + 4c₂ = 0.',
          justification: 'Operaciones canónicas por coordenadas en el espacio vectorial ℝ²'
        },
        {
          step: 'Matricialmente: [1 3; 2 4] · [c₁; c₂] = [0; 0].',
          justification: 'Representación canónica matricial de un operador lineal'
        },
        {
          step: 'Calculamos el determinante de la matriz de coeficientes: det(A) = 1·4 - 3·2 = 4 - 6 = -2.',
          justification: 'Fórmula de Leibniz para determinante en dimensión 2'
        },
        {
          step: 'Dado que det(A) = -2 ≠ 0, la matriz es invertible y admite inversa A⁻¹.',
          justification: 'Teorema de equivalencias de matrices no singulares'
        },
        {
          step: 'Multiplicando por la izquierda: [c₁; c₂] = A⁻¹ · [0; 0] = [0; 0], lo que exige c₁ = 0 y c₂ = 0.',
          justification: 'Unicidad de la solución para sistemas cuadrados no homogéneos'
        },
        {
          step: 'Por tanto, ker(A) = { (0, 0) } y el conjunto {v₁, v₂} es linealmente independiente.',
          justification: 'Conclusión formal de las definiciones'
        }
      ],
      qed: '■ Q.E.D. (Independencia y núcleo trivial verificados)'
    },
    computationalArtifact: {
      engine: 'NumPy',
      codeSnippet: `import numpy as np

# Definición de la matriz formada por los vectores columna
A = np.array([
    [1, 3],
    [2, 4]
], dtype=float)

# Cálculo de determinante
det_A = np.linalg.det(A)
print(f"Determinante calculado: {det_A:.2f}")

# Rango matricial
rank = np.linalg.matrix_rank(A)
print(f"Rango de la matriz: {rank} (dimensión = 2)")

# Verificación de solución al sistema homogéneo A c = 0
c_solution = np.linalg.solve(A, np.array([0.0, 0.0]))
print(f"Solución única c1, c2: {c_solution}")`,
      expectedConsoleOutput: `Determinante calculado: -2.00\nRango de la matriz: 2 (dimensión = 2)\nSolución única c1, c2: [0. 0.]`
    },
    socraticProbes: [
      {
        question: '¿Qué significado geométrico tiene que dos vectores en ℝ² sean linealmente dependientes?',
        coreConcept: 'Colinealidad y colapso de área orientada',
        deepExplanation: 'Geométricamente, dos vectores dependientes en ℝ² yacen sobre la misma recta que pasa por el origen (uno es múltiplo escalar del otro). El paralelogramo generado por ellos tiene área cero, lo cual se traduce algebraicamente en que el determinante de la matriz que forman es exactamente cero.'
      },
      {
        question: 'Si una transformación lineal T: ℝ³ → ℝ² tiene núcleo trivial, ¿es esto posible?',
        coreConcept: 'Teorema del Rango-Nulidad y principio del palomar dimensional',
        deepExplanation: 'Es imposible. Por el Teorema del Rango-Nulidad: dim(ker T) + dim(im T) = 3. Dado que la imagen está contenida en ℝ², su dimensión máxima es 2. Por ende dim(ker T) = 3 - dim(im T) ≥ 3 - 2 = 1. El núcleo tiene dimensión de al menos 1, por lo que nunca puede ser trivial; forzosamente comprime al menos una recta completa al origen.'
      }
    ],
    glossaryTerms: [
      {
        term: 'Independencia Lineal',
        definition: 'Propiedad de un conjunto de vectores donde ninguno puede expresarse como combinación lineal de los restantes.',
        rigorousContext: 'Constituye la condición mínima para optimizar bases computacionales sin redundancia numérica.'
      },
      {
        term: 'Núcleo o Espacio Nulo (Kernel)',
        definition: 'El conjunto de todos los vectores del dominio que el operador lineal transforma en el vector nulo: ker(T) = { v : T(v) = 0 }.',
        rigorousContext: 'Mide la pérdida de información del operador; si ker(T) = {0}, el operador es inyectivo (monomorfismo).'
      },
      {
        term: 'Teorema del Rango-Nulidad',
        definition: 'Para todo operador lineal T: V → W con V de dimensión finita: dim(V) = dim(ker T) + dim(im T).',
        rigorousContext: 'Es la ley de conservación de dimensión fundamental de toda el álgebra lineal.'
      }
    ]
  },
  {
    id: 'disc-day01',
    topic: 'Principio de Buena Ordenación e Inducción Matemática',
    category: 'Matemática Discreta',
    whyWeLearnThis: 'En ciencias de la computación, el análisis de complejidad de algoritmos, la corrección de bucles invariantes y la recursión descansan enteramente sobre el Principio de Inducción Matemática. Muchos creen que la inducción es un "truco de dominó", pero en los fundamentos de la matemática es equivalente al Principio de Buena Ordenación de los números naturales (todo subconjunto no vacío de ℕ posee un elemento mínimo). Sin dominar este principio axiomático, es imposible demostrar la terminación y correctitud de programas informáticos.',
    stepByStep: [
      {
        stepNumber: 1,
        title: 'Verificar el Caso Base P(1)',
        commandOrFormula: 'eval 1 == 1 * (1 + 1) / 2',
        rationale: 'Verificar que la proposición P(n): sum_{i=1}^n i = n(n+1)/2 es verdadera para el elemento mínimo del conjunto inductivo n = 1.',
        expectedOutput: '1 == 1.0 (True: Caso base anclado)'
      },
      {
        stepNumber: 2,
        title: 'Establecer la Hipótesis Inductiva P(k)',
        commandOrFormula: 'eval sum_{i=1}^k i == k*(k + 1)/2',
        rationale: 'Suponemos que para un entero fijo k ≥ 1 arbitrario, la suma de los primeros k enteros positivos cumple la fórmula cerrada.',
        expectedOutput: 'P(k) asumida como premisa formal'
      },
      {
        stepNumber: 3,
        title: 'Formular el Paso Inductivo para P(k + 1)',
        commandOrFormula: 'simplify(k*(k + 1)/2 + (k + 1))',
        rationale: 'Sumamos el término (k + 1) a ambos miembros: [sum_{i=1}^k i] + (k + 1) = k(k+1)/2 + (k+1). Factorizamos algebraicamente por (k+1).',
        expectedOutput: '(k + 1)*(k + 2)/2'
      },
      {
        stepNumber: 4,
        title: 'Concluir por el Axioma de Inducción de Peano',
        commandOrFormula: 'eval (k + 1) * ((k + 1) + 1) / 2',
        rationale: 'La expresión obtenida coincide exactamente con la fórmula sustituyendo n = k + 1. Por el principio de inducción, P(n) es verdadera para todo n ∈ ℕ.',
        expectedOutput: '(k + 1)*(k + 2)/2 (Q.E.D. Demostración universal completada)'
      }
    ],
    canonicalReferences: [
      {
        book: 'Concrete Mathematics: A Foundation for Computer Science (2da Ed.)',
        author: 'Ronald L. Graham, Donald E. Knuth, Oren Patashnik',
        chapter: 'Capítulo 2: Sumas',
        topic: 'Notación Sigma e Inducción',
        quote: 'La inducción matemática no es una herramienta para adivinar fórmulas, sino para confirmarlas rigurosamente una vez formuladas. El puente entre el caso discreto finito y la generalidad universal para todo n natural.'
      },
      {
        book: 'Discrete Mathematics and Its Applications (8va Ed.)',
        author: 'Kenneth H. Rosen',
        chapter: 'Capítulo 5: Inducción y Recursión',
        topic: 'El principio de buena ordenación',
        quote: 'La validez de la inducción matemática descansa en el principio de buena ordenación de los enteros naturales: todo subconjunto no vacío de enteros no negativos contiene un elemento mínimo.'
      }
    ],
    formalProof: {
      theorem: 'Para todo entero positivo n ∈ ℤ⁺, se verifica: ∑_{i=1}^{n} i = n(n + 1) / 2.',
      premises: [
        'Axioma de Inducción de Peano: Si S ⊆ ℕ contiene a 1, y k ∈ S implica (k + 1) ∈ S, entonces S = ℕ',
        'Definición inductiva de sumatoria: ∑_{i=1}^{k+1} a_i = (∑_{i=1}^{k} a_i) + a_{k+1}',
        'Propiedades distributiva y asociativa del anillo de enteros'
      ],
      steps: [
        {
          step: 'Caso base n = 1: Miembro izquierdo = ∑_{i=1}^{1} i = 1. Miembro derecho = 1 · (1 + 1) / 2 = 2 / 2 = 1.',
          justification: 'Evaluación directa y compatibilidad'
        },
        {
          step: 'El caso base P(1) es verdadero.',
          justification: 'Identidad numérica 1 = 1'
        },
        {
          step: 'Hipótesis inductiva: Asumimos que para un k ≥ 1 cualquiera, se cumple ∑_{i=1}^{k} i = k(k + 1)/2.',
          justification: 'Hipótesis del paso inductivo'
        },
        {
          step: 'Evaluamos la sumatoria hasta k + 1: ∑_{i=1}^{k+1} i = (∑_{i=1}^{k} i) + (k + 1).',
          justification: 'Definición recursiva del operador sumatoria'
        },
        {
          step: 'Sustituyendo la hipótesis inductiva: ∑_{i=1}^{k+1} i = [k(k + 1) / 2] + (k + 1).',
          justification: 'Aplicación de la hipótesis inductiva'
        },
        {
          step: 'Sacando factor común (k + 1): (k + 1) · [k / 2 + 1] = (k + 1) · [(k + 2) / 2] = (k + 1)((k + 1) + 1) / 2.',
          justification: 'Álgebra en el cuerpo de fracciones y distributividad'
        },
        {
          step: 'Por tanto, P(k) ⟹ P(k + 1) es verdadero para todo k ≥ 1.',
          justification: 'Deducción condicional formal'
        },
        {
          step: 'Por el principio de inducción matemática, P(n) es verdadero para todo n ∈ ℤ⁺.',
          justification: 'Axioma de Peano para los números naturales'
        }
      ],
      qed: '■ Q.E.D. (Inducción completada formalmente)'
    },
    computationalArtifact: {
      engine: 'SymPy',
      codeSnippet: `import sympy as sp

n = sp.Symbol('n', integer=True, positive=True)
i = sp.Symbol('i', integer=True)

# Sumatoria formal analítica
formal_sum = sp.summation(i, (i, 1, n))
print(f"Suma simbólica evaluada: {formal_sum}")

# Forma cerrada canónica
closed_form = n * (n + 1) / 2
print(f"Fórmula cerrada conjeturada: {closed_form}")

# Verificación de identidad para todo n simbólico
difference = sp.simplify(formal_sum - closed_form)
print(f"Diferencia simbólica: {difference}")
assert difference == 0, "Discrepancia en la fórmula cerrada"
print("Principio de inducción validado computacionalmente.")`,
      expectedConsoleOutput: `Suma simbólica evaluada: n*(n + 1)/2\nFórmula cerrada conjeturada: n*(n + 1)/2\nDiferencia simbólica: 0\nPrincipio de inducción validado computacionalmente.`
    },
    socraticProbes: [
      {
        question: '¿Por qué la verificación de una fórmula para los primeros 1.000.000 de casos no constituye una demostración matemática?',
        coreConcept: 'Insuficiencia de la inducción empírica y existencia de contraejemplos gigantes',
        deepExplanation: 'Porque la verdad en matemática es universal (∀ n ∈ ℕ), no estadística ni empírica. Existen conjeturas que son verdaderas para billones de casos y luego fallan, como la conjetura de Pólya sobre la paridad del número de factores primos, cuyo primer contraejemplo ocurre en n = 906.180.359. Sin el paso deductivo k ⟹ k+1, no hay certeza formal.'
      },
      {
        question: '¿Cómo se demuestra que el Principio de Inducción y el Principio de Buena Ordenación son equivalentes?',
        coreConcept: 'Demostración por contradicción y existencia de elemento mínimo',
        deepExplanation: 'Si la inducción fallara, existiría un conjunto de contraejemplos C = { n ∈ ℕ : P(n) es falso }. Si C fuera no vacío, por Buena Ordenación tendría un elemento mínimo m. Como P(1) es verdadero, m > 1, luego m - 1 está bien definido y P(m - 1) es verdadero. Pero por el paso inductivo, P(m - 1) ⟹ P(m), lo que contradice que m pertenezca a C. Por reducción al absurdo, C es vacío.'
      }
    ],
    glossaryTerms: [
      {
        term: 'Principio de Buena Ordenación (Well-Ordering Principle)',
        definition: 'Propiedad axiomática que establece que todo subconjunto no vacío de enteros positivos contiene un elemento mínimo.',
        rigorousContext: 'Es un axioma fundacional de los números naturales en la teoría axiomática de conjuntos ZFC.'
      },
      {
        term: 'Hipótesis Inductiva',
        definition: 'La suposición provisoria de que la proposición P(k) es válida para un valor k genérico con el único fin de deducir P(k + 1).',
        rigorousContext: 'No asume lo que se quiere probar en general, sino únicamente en el antecedente de la implicación condicional P(k) ⟹ P(k + 1).'
      },
      {
        term: 'Axiomas de Peano',
        definition: 'Conjunto de axiomas formulados por Giuseppe Peano en 1889 para definir rigurosamente la aritmética de los números naturales usando la función sucesor.',
        rigorousContext: 'El quinto axioma de Peano es precisamente el axioma de inducción matemática.'
      }
    ]
  }
];
