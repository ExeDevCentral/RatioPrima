import type { Lesson } from '../../data/types';

export type Scene3DKind =
  | 'righttriangle3d'
  | 'sets3d'
  | 'powers3d'
  | 'helix3d'
  | 'cube3d'
  | 'parabola3d'
  | 'rational3d'
  | 'planes3d'
  | 'wave3d';

export interface SceneBuildStep {
  title: string;
  kidText: string;
}

/**
 * Guion de construcción "parte por parte" de cada escena.
 * La escena nueva además anima el trazo de cada pieza (no solo la muestra).
 */
export const SCENE_BUILD_STEPS: Partial<Record<Scene3DKind, SceneBuildStep[]>> = {
  righttriangle3d: [
    {
      title: '1. La hipotenusa H (dorado)',
      kidText:
        'Es el lado más largo y siempre está frente al ángulo recto de 90°. Acá además es el radio del círculo: el punto dorado la mantiene tensa.'
    },
    {
      title: '2. Los catetos CO y CA',
      kidText:
        'CO (rosa) está enfrente del ángulo α. CA (cian) es el que toca a α. Juntos forman el ángulo recto: son las sombras de la hipotenusa.'
    },
    {
      title: '3. Proyecciones sobre el círculo',
      kidText:
        'Si H = 1, la sombra horizontal mide exactamente cos α y la vertical sen α. Por eso el extremo de H recorre el círculo unitario.'
    },
    {
      title: '4. La tangente como longitud real',
      kidText:
        'La tangente no es un cociente abstracto: es el segmento naranja sobre la recta x = H. Mide H·tan α. Cuando α → 90°, explota hacia arriba.'
    }
  ],
  sets3d: [
    {
      title: 'Anillo 1 (Verde): ℕ Naturales',
      kidText: 'Son los números de contar cosas con los dedos: 1, 2, 3, 4... No hay negativos ni comas.'
    },
    {
      title: 'Anillo 2 (Cian): ℤ Enteros',
      kidText: 'Metemos al 0 y a los negativos (-1, -2, -3...), como pisos del subsuelo o temperatura bajo cero.'
    },
    {
      title: 'Anillo 3 (Violeta): ℚ Racionales',
      kidText: 'Sumamos las fracciones y decimales (1/2, 0,75) para poder partir una pizza en pedazos.'
    },
    {
      title: 'Anillo 4 (Dorado): ℝ Reales + Distancia',
      kidText: 'Completamos con números infinitos como π y √2. La V rosa muestra la distancia |x - c|.'
    }
  ],
  powers3d: [
    {
      title: 'Paso 1: a¹ (Una línea)',
      kidText: 'Elevar a la 1 es dejar el número tal cual: es solo una línea de largo "a".'
    },
    {
      title: 'Paso 2: a² (Un cuadrado)',
      kidText: 'Elevar al cuadrado (a × a) arma un piso plano cuadrado de ancho "a" y alto "a".'
    },
    {
      title: 'Paso 3: a³ (Un cubo 3D)',
      kidText: 'Elevar al cubo (a × a × a) le da profundidad: ¡ahora tenés un dado o caja 3D!'
    }
  ],
  cube3d: [
    {
      title: 'Pieza 1 (Cian): El cubo grande a³',
      kidText: 'Arrancamos con un cubo de lado "a". Pero si el lado mide (a + b), todavía falta mucho volumen.'
    },
    {
      title: 'Pieza 2 (Verde): 3 placas planas a²b',
      kidText: 'Pegamos 3 placas de grosor "b" en tres caras del cubo grande.'
    },
    {
      title: 'Pieza 3 (Violeta): 3 barras largas ab²',
      kidText: 'Rellenamos los 3 bordes que quedaron huecos con 3 barras alargadas.'
    },
    {
      title: 'Pieza 4 (Dorado): El cubito b³',
      kidText: 'Cerramos la esquina con el cubito b³. Por eso (a+b)³ tiene 8 piezas y NO es solo a³ + b³.'
    }
  ],
  helix3d: [
    {
      title: 'Paso 1: El Círculo Unitario',
      kidText: 'Una rueda perfecta de radio 1 donde gira la aguja del ángulo.'
    },
    {
      title: 'Paso 2: El Triángulo adentro',
      kidText: 'La altura rosa es el SENO (arriba/abajo) y la base cian es el COSENO (izquierda/derecha).'
    },
    {
      title: 'Paso 3: La Hélice en 3D',
      kidText: 'Si la rueda avanza hacia adelante mientras gira, dibuja un resorte dorado en el espacio.'
    },
    {
      title: 'Paso 4: Ondas Seno y Coseno',
      kidText: 'Mirando el resorte desde el costado ves la onda del Seno; desde abajo ves la del Coseno.'
    }
  ],
  parabola3d: [
    { title: 'Paso 1: La curva cuadrática', kidText: 'La parábola representa el valor de ax² + bx + c mientras cambia x.' },
    { title: 'Paso 2: El vértice y el eje', kidText: 'El vértice es el punto más alto o más bajo; el eje vertical muestra la simetría.' },
    { title: 'Paso 3: Las raíces reales', kidText: 'Las raíces aparecen donde la parábola cruza el eje x; el discriminante anticipa cuántas hay.' }
  ],
  rational3d: [
    { title: 'Paso 1: El signo de la expresión', kidText: 'La superficie muestra dónde el cociente es positivo o negativo.' },
    { title: 'Paso 2: El denominador nulo', kidText: 'La pared marca el valor prohibido: allí la expresión no está definida.' },
    { title: 'Paso 3: Raíz y solución', kidText: 'El punto donde el numerador se anula puede pertenecer a la solución si el denominador no se anula.' }
  ],
  planes3d: [
    { title: 'Paso 1: Primera ecuación', kidText: 'Cada ecuación lineal en dos incógnitas dibuja una recta; en 3D se extiende como un plano.' },
    { title: 'Paso 2: Segunda ecuación', kidText: 'La solución debe pertenecer a las dos ecuaciones al mismo tiempo.' },
    { title: 'Paso 3: Intersección', kidText: 'El cruce señala la solución única; planos paralelos no tienen cruce y coincidentes comparten infinitos puntos.' }
  ],
  wave3d: [
    { title: 'Paso 1: La superficie', kidText: 'La altura cambia según la posición: cada punto de la superficie codifica un valor.' },
    { title: 'Paso 2: La amplitud', kidText: 'La amplitud regula cuánto sube y baja la onda.' },
    { title: 'Paso 3: La frecuencia', kidText: 'La frecuencia regula cuántas oscilaciones aparecen en el mismo espacio.' }
  ]
};

export interface Scene3DMeta {
  title: string;
  subtitle: string;
  legend?: string;
  hint?: string;
  paramALabel: string;
  paramBLabel: string;
  defaultA: number;
  defaultB: number;
  minA: number;
  maxA: number;
  stepA: number;
  minB: number;
  maxB: number;
  stepB: number;
}

export const SCENE_META: Record<Scene3DKind, Scene3DMeta> = {
  righttriangle3d: {
    title: 'Triángulo Rectángulo 3D · Razones en vivo',
    subtitle:
      'Arrastrá el punto dorado: la hipotenusa, los catetos y las razones se recalculan en tiempo real.',
    legend:
      'Dorado = H (hipotenusa/radio) · Rosa = CO (opuesto) · Cian = CA (adyacente) · Naranja = tan α',
    hint:
      'Arrastrá el punto dorado = cambiar α · líneas punteadas = mitad (180°) y 1 rad ≈ 57,3° · fondo = rotar · rueda/pinza = zoom',
    paramALabel: 'ángulo α (°)',
    paramBLabel: 'escala k (H)',
    defaultA: 37,
    defaultB: 1,
    minA: 5,
    maxA: 85,
    stepA: 1,
    minB: 0.7,
    maxB: 1.25,
    stepB: 0.05
  },
  sets3d: {
    title: 'Anillos Numéricos & Módulo 3D',
    subtitle: 'Inclusión ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ y cono de distancia |x - c| ≤ r',
    legend:
      'Anillos = ℕ (verde) ⊂ ℤ (cian) ⊂ ℚ (violeta) ⊂ ℝ (dorado) · V rosa = |x - c| · Barra verde = solución',
    paramALabel: 'centro c',
    paramBLabel: 'radio r',
    defaultA: 1.5,
    defaultB: 2.0,
    minA: -3,
    maxA: 3,
    stepA: 0.5,
    minB: 0.5,
    maxB: 3.5,
    stepB: 0.5
  },
  powers3d: {
    title: 'Geometría de Potencias & Raíces',
    subtitle: 'Del segmento a¹ al área a² y al volumen cúbico a³',
    paramALabel: 'base a',
    paramBLabel: 'exponente',
    defaultA: 2.2,
    defaultB: 3,
    minA: 1.2,
    maxA: 3.2,
    stepA: 0.2,
    minB: 1,
    maxB: 3,
    stepB: 1
  },
  helix3d: {
    title: 'Hélice Trigonométrica 3D',
    subtitle: 'Proyección espacial (cos θ, sen θ, θ): círculo unitario + ondas ortogonales',
    paramALabel: 'ángulo (°)',
    paramBLabel: 'vueltas',
    defaultA: 45,
    defaultB: 2.0,
    minA: 0,
    maxA: 360,
    stepA: 5,
    minB: 1,
    maxB: 3.5,
    stepB: 0.5
  },
  cube3d: {
    title: 'Cubo Binomial (a + b)³ Explotado',
    subtitle: '8 bloques 3D: a³ + 3a²b + 3ab² + b³ (por qué ≠ a³ + b³)',
    paramALabel: 'lado a',
    paramBLabel: 'separación',
    defaultA: 2.2,
    defaultB: 0.85,
    minA: 1.4,
    maxA: 2.8,
    stepA: 0.2,
    minB: 0,
    maxB: 1.8,
    stepB: 0.1
  },
  parabola3d: {
    title: 'Paraboloide & Raíces Reales',
    subtitle: 'Corte con el plano y = 0: Δ > 0 (2 raíces), Δ = 0 (1), Δ < 0 (0)',
    paramALabel: 'coeficiente a',
    paramBLabel: 'término c',
    defaultA: 0.45,
    defaultB: -1.8,
    minA: -0.8,
    maxA: 0.9,
    stepA: 0.05,
    minB: -3.0,
    maxB: 2.5,
    stepB: 0.2
  },
  rational3d: {
    title: 'Superficie de Signos & Asíntota',
    subtitle: 'f(x) = (x - r) / (x - m): muro vertical en el denominador nulo',
    paramALabel: 'raíz r',
    paramBLabel: 'muro m',
    defaultA: 2.0,
    defaultB: -2.0,
    minA: -3.5,
    maxA: 3.5,
    stepA: 0.5,
    minB: -3.5,
    maxB: 3.5,
    stepB: 0.5
  },
  planes3d: {
    title: 'Planos & Rectas en el Espacio',
    subtitle: 'Sistemas: secantes (1 sol.), paralelos (∅) o coincidentes (∞)',
    paramALabel: 'pendiente m₂',
    paramBLabel: 'desfase b₂',
    defaultA: -1.0,
    defaultB: 1.5,
    minA: -2.0,
    maxA: 2.0,
    stepA: 0.2,
    minB: -2.5,
    maxB: 2.5,
    stepB: 0.5
  },
  wave3d: {
    title: 'Campo de Onda Láser 3D',
    subtitle: 'Superficie paramétrica z = A·sen(f·r)·e^(-r/6.5) con haces tangentes',
    paramALabel: 'amplitud A',
    paramBLabel: 'frecuencia f',
    defaultA: 1.3,
    defaultB: 1.1,
    minA: 0.3,
    maxA: 2.4,
    stepA: 0.1,
    minB: 0.4,
    maxB: 2.2,
    stepB: 0.1
  }
};

/**
 * Escena sugerida para una lección. Una lección puede sobrescribirla con
 * `scene3d` para que el modelo 3D coincida exactamente con su tema.
 */
export function sceneForLesson(lesson: Lesson): Scene3DKind {
  if (lesson.scene3d && lesson.scene3d in SCENE_META) {
    return lesson.scene3d as Scene3DKind;
  }
  switch (lesson.worldId) {
    case 'reales':
      return 'sets3d';
    case 'operaciones':
      return 'powers3d';
    case 'trigonometria':
      return 'righttriangle3d';
    case 'algebra':
      return 'cube3d';
    case 'ecuaciones':
      return 'parabola3d';
    case 'inecuaciones':
      return 'rational3d';
    case 'sistemas':
      return 'planes3d';
    default:
      return 'wave3d';
  }
}

/** Mapea cada paso didáctico a la fase visual adecuada de su escena. */
export function sceneBuildStepForLesson(
  lesson: Lesson,
  activeStep: number,
  totalSteps = lesson.steps.length
): number {
  const buildSteps = SCENE_BUILD_STEPS[sceneForLesson(lesson)];
  if (!buildSteps?.length || buildSteps.length === 1) return 0;
  const lastLessonStep = Math.max(0, totalSteps - 1);
  const progress = lastLessonStep === 0 ? 0 : Math.max(0, Math.min(lastLessonStep, activeStep)) / lastLessonStep;
  return Math.round(progress * (buildSteps.length - 1));
}
