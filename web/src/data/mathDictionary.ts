/**
 * Diccionario Académico Matemático con Historia y Creadores — RatioPrima.
 * Módulo puro (sin React) para consulta rápida desde cualquier pantalla.
 */

export interface MathDictionaryEntry {
  id: string;
  term: string;
  symbol: string;
  category: 'Conjuntos' | 'Álgebra' | 'Geometría' | 'Lógica';
  whyItExists: string;
  definition: string;
  creator: string;
  history: string;
}

export const MATH_DICTIONARY: readonly MathDictionaryEntry[] = [
  {
    id: 'naturales',
    term: 'Números Naturales',
    symbol: 'ℕ',
    category: 'Conjuntos',
    whyItExists: 'Nacieron para contar objetos concretos (ovejas, días, cosechas) sin perder la cuenta.',
    definition: 'Conjunto {1; 2; 3; ...}. Al incluir el cero se escribe ℕ₀ = {0; 1; 2; ...}.',
    creator: 'Giuseppe Peano (1889) · formalización axiomática',
    history: 'Usados desde hace más de 30.000 años en huesos con muescas; en 1889 Peano los definió con solo 5 axiomas simples.'
  },
  {
    id: 'cero',
    term: 'El Cero',
    symbol: '0',
    category: 'Conjuntos',
    whyItExists: 'Para representar la ausencia de cantidad y permitir el sistema posicional (distinguir 12 de 102).',
    definition: 'Elemento neutro de la suma: a + 0 = a para todo número real a.',
    creator: 'Brahmagupta (India, 628 d.C.)',
    history: 'En su obra Brāhmasphuṭasiddhānta estableció por primera vez reglas claras para operar con el cero y con deudas.'
  },
  {
    id: 'enteros',
    term: 'Números Enteros',
    symbol: 'ℤ',
    category: 'Conjuntos',
    whyItExists: 'En ℕ no se puede restar 3 − 5 ni medir deudas o temperaturas bajo cero.',
    definition: 'Incluyen los naturales, el cero y los negativos: ℤ = {...; −2; −1; 0; 1; 2; ...}.',
    creator: 'Brahmagupta (s. VII) · notación ℤ de Nicolas Bourbaki',
    history: 'La letra ℤ viene del alemán «Zahlen» (números). En China antigua ya se calculaban con varillas rojas (positivos) y negras (negativos).'
  },
  {
    id: 'racionales',
    term: 'Números Racionales',
    symbol: 'ℚ',
    category: 'Conjuntos',
    whyItExists: 'En ℤ no se puede repartir 2 pizzas entre 3 personas ni resolver 3x = 2.',
    definition: 'Todo número expresable como fracción p/q con p, q ∈ ℤ y q ≠ 0. Su expresión decimal es exacta o periódica.',
    creator: 'Civilizaciones egipcia y babilónica · notación ℚ de Peano',
    history: 'La letra ℚ viene del italiano «quoziente» (cociente). Los egipcios escribían casi toda fracción como suma de fracciones unitarias (1/n).'
  },
  {
    id: 'irracionales',
    term: 'Números Irracionales',
    symbol: '𝕀',
    category: 'Conjuntos',
    whyItExists: 'La diagonal de un cuadrado de lado 1 mide √2, que no puede escribirse como ninguna fracción p/q.',
    definition: 'Números reales con infinitas cifras decimales no periódicas, como √2, π o e.',
    creator: 'Hipaso de Metaponto (escuela pitagórica, s. V a.C.)',
    history: 'Cuenta la tradición griega que demostrar la irracionalidad de √2 sacudió a los pitagóricos, que creían que todo en el universo era fracción entera.'
  },
  {
    id: 'reales',
    term: 'Números Reales',
    symbol: 'ℝ',
    category: 'Conjuntos',
    whyItExists: 'Para llenar todos los huecos de la recta numérica continua y medir cualquier longitud.',
    definition: 'Unión de los racionales y los irracionales: ℝ = ℚ ∪ 𝕀. Cada punto de la recta corresponde a un único real.',
    creator: 'Richard Dedekind y Georg Cantor (1872)',
    history: 'Dedekind construyó ℝ mediante «cortaduras» sobre los racionales, dándole al cálculo una base rigurosa sin agujeros.'
  },
  {
    id: 'valor-absoluto',
    term: 'Valor Absoluto (Módulo)',
    symbol: '|x|',
    category: 'Conjuntos',
    whyItExists: 'Para medir distancias en la recta sin importar si vas hacia la izquierda o hacia la derecha.',
    definition: '|x| es la distancia de x al cero: vale x si x ≥ 0, y −x si x < 0. Siempre es ≥ 0.',
    creator: 'Jean-Robert Argand (1806) y Karl Weierstrass (1841)',
    history: 'Weierstrass introdujo la notación de barras verticales |x| en 1841 para hablar de magnitud sin signo.'
  },
  {
    id: 'algebra',
    term: 'Álgebra y Ecuaciones',
    symbol: 'x',
    category: 'Álgebra',
    whyItExists: 'Para resolver familias enteras de problemas de una sola vez usando letras en lugar de probar números al azar.',
    definition: 'Rama que manipula expresiones simbólicas y busca valores desconocidos que mantienen una igualdad en equilibrio.',
    creator: 'Muhammad ibn Musa al-Juarismi (Bagdad, c. 820)',
    history: 'La palabra «álgebra» proviene de «al-jabr» (restaurar/completar términos) en su tratado fundacional; de su nombre también nace «algoritmo».'
  },
  {
    id: 'factoreo',
    term: 'Factoreo de Polinomios',
    symbol: '(a−b)(a+b)',
    category: 'Álgebra',
    whyItExists: 'Transformar sumas en productos permite hallar raíces al instante (si A·B = 0, entonces A = 0 o B = 0) y simplificar fracciones.',
    definition: 'Descomposición de una expresión algebraica en producto de factores más simples.',
    creator: 'François Viète (1591) y René Descartes (1637)',
    history: 'Viète sistematizó el uso de letras para coeficientes y Descartes consolidó la relación entre factores (x − r) y raíces.'
  },
  {
    id: 'inecuaciones',
    term: 'Inecuaciones',
    symbol: '≤ ≥',
    category: 'Álgebra',
    whyItExists: 'En la vida real y la ingeniería casi siempre trabajamos con rangos, presupuestos máximos y márgenes de seguridad.',
    definition: 'Desigualdad con incógnitas cuya solución suele ser un intervalo de infinitos números reales.',
    creator: 'Thomas Harriot (1631) · signos < y >',
    history: 'Harriot popularizó los símbolos < y > en su obra póstuma Artis Analyticae Praxis; Pierre Bouguer agregó ≤ y ≥ en 1734.'
  },
  {
    id: 'pitagoras',
    term: 'Teorema de Pitágoras',
    symbol: 'a²+b²=c²',
    category: 'Geometría',
    whyItExists: 'Conecta el álgebra con la geometría para calcular distancias indirectas cuando solo conocés dos lados perpendiculares.',
    definition: 'En todo triángulo rectángulo, el cuadrado de la hipotenusa iguala la suma de los cuadrados de los catetos.',
    creator: 'Escuela Pitagórica (s. VI a.C.) · tablilla Plimpton 322 (Babilonia, 1800 a.C.)',
    history: 'Los babilonios ya conocían ternas pitagóricas mil años antes, pero los griegos lo transformaron en teorema demostrado para todo triángulo rectángulo.'
  },
  {
    id: 'trigonometria',
    term: 'Trigonometría y Radián',
    symbol: 'sen · cos',
    category: 'Geometría',
    whyItExists: 'Permite calcular alturas, distancias y ángulos inaccesibles (desde estrellas hasta escaleras y rampas) usando razones constantes.',
    definition: 'Estudio de las razones entre lados de triángulos rectángulos (SOH-CAH-TOA). 1 radián es el ángulo cuyo arco mide exactamente 1 radio (≈ 57,3°).',
    creator: 'Hiparco de Nicea (c. 140 a.C.) · término «radián» de James Thomson (1873)',
    history: 'Hiparco compiló la primera tabla trigonométrica para astronomía; Leonhard Euler fijó la notación moderna sen, cos, tan en 1748.'
  },
  {
    id: 'sistemas',
    term: 'Sistemas de Ecuaciones',
    symbol: '{ }',
    category: 'Álgebra',
    whyItExists: 'Cuando un problema tiene dos o más condiciones simultáneas (ej. cantidad de personas y gasto total), necesitás resolverlas juntas.',
    definition: 'Conjunto de ecuaciones que comparten incógnitas; geométricamente, la solución es el punto donde se cruzan las rectas.',
    creator: 'Texto chino «Nueve Capítulos» (s. II a.C.) · Carl F. Gauss (1810)',
    history: 'El método de eliminación apareció en China hace más de 2000 años y Gauss lo perfeccionó para calcular la órbita del asteroide Pallas.'
  },
  {
    id: 'potencias',
    term: 'Potenciación y Radicales',
    symbol: 'aⁿ · √a',
    category: 'Álgebra',
    whyItExists: 'Abrevian multiplicaciones repetidas, escalas astronómicas o microscópicas, y operaciones inversas de áreas y volúmenes.',
    definition: 'aⁿ multiplica la base a por sí misma n veces; la raíz n-ésima busca la base que elevada a n reproduce el radicando.',
    creator: 'René Descartes (exponentes, 1637) y Christoff Rudolff (signo √, 1525)',
    history: 'Rudolff dibujó el signo √ a partir de una letra «r» estilizada de la palabra latina «radix» (raíz).'
  }
];

export function searchDictionary(query: string): MathDictionaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...MATH_DICTIONARY];
  return MATH_DICTIONARY.filter(
    (item) =>
      item.term.toLowerCase().includes(q) ||
      item.symbol.toLowerCase().includes(q) ||
      item.creator.toLowerCase().includes(q) ||
      item.whyItExists.toLowerCase().includes(q) ||
      item.history.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q)
  );
}
