export interface MemoryAnchor {
  worldId: string;
  technique: string;
  mentalImage: string;
  chunkRule: string;
  recallPrompt: string;
  recallAnswer: string;
  spacingTip: string;
}

export const MEMORY_ANCHORS: Record<string, MemoryAnchor> = {
  reales: {
    worldId: 'reales',
    technique: 'Codificación Dual (Imagen + Dinero)',
    mentalImage:
      'Imaginá la recta real como una calle infinita: el 0 es tu casa, los positivos son plata a favor caminando a la derecha y los negativos son deuda caminando a la izquierda. El valor absoluto |x| es cuántos pasos caminaste, sin importar hacia qué lado.',
    chunkRule: 'En negativos, más cerca del 0 = más grande. |x| siempre es distancia ≥ 0.',
    recallPrompt: 'Cerrá los ojos 3 segundos: ¿por qué -3 es mayor que -8?',
    recallAnswer: 'Porque -3 está más a la derecha (más cerca del 0) que -8; deber $3 es mejor que deber $8.',
    spacingTip: 'Repaso espaciado: volvé a probar 2 ejercicios de signos en 24 horas.'
  },
  operaciones: {
    worldId: 'operaciones',
    technique: 'Agrupamiento (Chunking)',
    mentalImage:
      'Pensá la potencia como un "copiar y pegar" de multiplicaciones: 2³ pega el 2 tres veces (2·2·2). El exponente negativo no cambia el signo: simplemente da vuelta la fracción como una moneda.',
    chunkRule: 'Misma base multiplicando → sumá exponentes. Exponente negativo → invertí.',
    recallPrompt: 'Sin mirar fórmulas: ¿qué le hace el exponente -1 a la fracción 2/5?',
    recallAnswer: 'La da vuelta sin cambiar el signo: queda 5/2.',
    spacingTip: 'Repaso espaciado: practicá 3 potencias mezcladas en 3 días.'
  },
  trigonometria: {
    worldId: 'trigonometria',
    technique: 'Mnemotecnia Visual (SOH-CAH-TOA)',
    mentalImage:
      'Imaginá una escalera apoyada en la pared: la escalera es la Hipotenusa (H), la altura en la pared es el Opuesto (CO) y la distancia en el piso es el Adyacente (CA). Si agrandás la escalera al doble, el ángulo NO cambia.',
    chunkRule: 'SOH (sen = CO/H) · CAH (cos = CA/H) · TOA (tan = CO/CA).',
    recallPrompt: 'Recordá sin leer: ¿cuál es el lado que SIEMPRE está frente al ángulo de 90°?',
    recallAnswer: 'La Hipotenusa (el lado más largo del triángulo rectángulo).',
    spacingTip: 'Repaso espaciado: usá el simulador a escala mañana durante 2 minutos.'
  },
  algebra: {
    worldId: 'algebra',
    technique: 'Metáfora Concreta (Cajas Etiquetadas)',
    mentalImage:
      'Las variables con distinto exponente son cajas de distinto tamaño: podés sumar 3 cajas x² con 5 cajas x², pero jamás mezclar x² con x. Y (a+b)² es un cuadrado físico al que le faltan dos rectángulos (2ab) si solo hacés a²+b².',
    chunkRule: 'Solo se suman términos con exactamente la misma letra y exponente.',
    recallPrompt: '¿Por qué (x + 3)² NO es x² + 9?',
    recallAnswer: 'Porque falta el doble producto 2 · x · 3 = 6x (los dos rectángulos que completan el cuadrado).',
    spacingTip: 'Repaso espaciado: dibujá un cuadrado dividido en 4 partes dentro de 48 hs.'
  },
  ecuaciones: {
    worldId: 'ecuaciones',
    technique: 'Ancla Física (Balanza Justa)',
    mentalImage:
      'Cada ecuación es una balanza en equilibrio perfecto. No estás "pasando números mágicamente": estás agregando o quitando exactamente el mismo peso en ambos platillos para que la x quede sola.',
    chunkRule: 'Lo que hacés de un lado del =, hacelo idéntico del otro lado.',
    recallPrompt: 'En 2x - 1 = 5, ¿qué operación deshacés primero y por qué?',
    recallAnswer: 'Sumar 1 a ambos lados (lo más lejano a la x), y recién después dividir por 2.',
    spacingTip: 'Repaso espaciado: resolvé 2 ecuaciones con paréntesis en 3 días.'
  },
  inecuaciones: {
    worldId: 'inecuaciones',
    technique: 'Efecto Espejo (Alerta Cognitiva)',
    mentalImage:
      'Multiplicar por un número negativo es como mirar la recta real en un espejo: todo lo que estaba a la derecha pasa a la izquierda, por eso la flecha (< o >) tiene que darse vuelta obligatoriamente.',
    chunkRule: 'Dividir o multiplicar por negativo = invertir el signo de desigualdad.',
    recallPrompt: 'Si -2x > 6, ¿por qué queda x < -3 y no x > -3?',
    recallAnswer: 'Porque dividimos por -2 (negativo), lo que invierte el sentido de > a <.',
    spacingTip: 'Repaso espaciado: chequeá siempre tu intervalo con un número de prueba.'
  },
  sistemas: {
    worldId: 'sistemas',
    technique: 'Imagen Geométrica (Cruce de Rutas)',
    mentalImage:
      'Dos ecuaciones son dos rutas en un mapa. Resolver el sistema es encontrar el semáforo exacto donde se cruzan (1 solución). Si son autopistas paralelas, nunca se cruzan (sin solución).',
    chunkRule: 'Secantes = 1 solución · Paralelas = 0 soluciones · Coincidentes = infinitas.',
    recallPrompt: 'Si al sumar dos ecuaciones desaparece una letra, ¿qué método usaste?',
    recallAnswer: 'El método de eliminación (reducción).',
    spacingTip: 'Repaso espaciado: planteá 1 problema de palabras en 4 días.'
  },
  simulacros: {
    worldId: 'simulacros',
    technique: 'Regulación Emocional & Pausa de 5s',
    mentalImage:
      'En un examen el enemigo no es la matemática, es el apuro. Antes de calcular, hacé una pausa de 5 segundos: mirá el dominio (que nada divida por 0) y el signo. Ahorra el 80% de los errores.',
    chunkRule: 'Primero leé y chequeá dominio; después calculá; al final verificá.',
    recallPrompt: '¿Qué es lo primero que tenés que mirar en una ecuación con x en el denominador?',
    recallAnswer: 'Qué valores hacen cero al denominador, para excluirlos desde el principio.',
    spacingTip: 'Repaso espaciado: hacé un simulacro corto de 5 preguntas cada 7 días.'
  }
};

export function getMemoryAnchorForTopic(topicOrWorldId: string): MemoryAnchor {
  const key = topicOrWorldId.toLowerCase();
  if (key in MEMORY_ANCHORS) return MEMORY_ANCHORS[key];
  if (/(sen|cos|tan|radian|trigo)/.test(key)) return MEMORY_ANCHORS.trigonometria;
  if (/(ecuac|discriminante|fraccionaria)/.test(key)) return MEMORY_ANCHORS.ecuaciones;
  if (/(inecuac|desigualdad)/.test(key)) return MEMORY_ANCHORS.inecuaciones;
  if (/(sistema|modelado|regla de tres)/.test(key)) return MEMORY_ANCHORS.sistemas;
  if (/(binomio|algebra)/.test(key)) return MEMORY_ANCHORS.algebra;
  if (/(potencia|raiz|raíz|radical|exponencial|fraccion|porcentaje|operacion)/.test(key)) {
    return MEMORY_ANCHORS.operaciones;
  }
  return MEMORY_ANCHORS.reales;
}
