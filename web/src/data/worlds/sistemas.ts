import type { World } from '../types';

const L = String.raw;

export const sistemas: World = {
  id: 'sistemas',
  order: 7,
  name: 'Nexo',
  subtitle: 'Sistemas de ecuaciones',
  description:
    'Varias ecuaciones, una misma solución. Clasificación, eliminación, igualación, sustitución y modelado de problemas reales.',
  icon: 'nexus',
  color: '#38bdf8',
  accent: 'rgba(56, 189, 248, 0.16)',
  lessons: [
    {
      id: 'sistemas-concepto',
      worldId: 'sistemas',
      title: 'Sistemas y clasificación',
      tagline: 'Dos rectas que se cruzan, coinciden o nunca se encuentran.',
      minutes: 15,
      xp: 75,
      concepts: ['Ecuación lineal', 'Sistema m×n', 'Compatible', 'Incompatible', 'Homogéneo', 'Equivalencia'],
      theory: [
        {
          heading: 'Qué es un sistema',
          body: L`Una ecuación lineal en $n$ incógnitas tiene la forma $a_1x_1+\dots+a_nx_n=b$. Un sistema $m\times n$ es un conjunto de $m$ ecuaciones con $n$ incógnitas que deben cumplirse simultáneamente.`
        },
        {
          heading: 'Tres destinos posibles',
          body: L`Un sistema es compatible determinado si tiene una única solución, compatible indeterminado si tiene infinitas, e incompatible si no tiene ninguna. En $2\times2$, geométricamente son dos rectas secantes, coincidentes o paralelas.`
        },
        {
          heading: 'Operaciones que no cambian la solución',
          body: L`Intercambiar ecuaciones, multiplicar una ecuación por un número no nulo o reemplazar una ecuación por ella más un múltiplo de otra produce un sistema equivalente. Estas son las operaciones del método de eliminación.`
        }
      ],
      formulas: [
        L`\begin{cases}a_1x+b_1y=c_1\\a_2x+b_2y=c_2\end{cases}`,
        L`\text{Compatible determinado: }S=\{(x_0;y_0)\}`,
        L`\text{Compatible indeterminado: }S=\text{infinitas soluciones}`,
        L`\text{Incompatible: }S=\varnothing`
      ],
      lab: 'systems',
      labConfig: { m1: 2, b1: 0, m2: -1, b2: 3 },
      steps: [
        {
          title: 'Escribí el sistema ordenado',
          detail: L`Alineá las incógnitas y los términos independientes.`,
          latex: L`\begin{cases}2x+3y=5\\3x+2y=5\end{cases}`
        },
        {
          title: 'Compará pendientes',
          detail: L`En $y=mx+b$, pendientes distintas implican una solución; iguales con distinto término independiente, ninguna; iguales y mismo término, infinitas.`
        },
        {
          title: 'Clasificá y resolvé',
          detail: 'La clasificación te dice qué esperar antes de calcular.'
        }
      ],
      questions: [
        {
          id: 'sistemas-concepto-q1',
          prompt: L`Dos rectas paralelas no coincidentes forman un sistema:`,
          options: ['Compatible determinado', 'Compatible indeterminado', 'Incompatible', 'Homogéneo'],
          correct: 2,
          explanation: L`No existe ningún punto en común, por lo tanto el sistema no tiene solución: incompatible.`,
          difficulty: 1
        },
        {
          id: 'sistemas-concepto-q2',
          prompt: L`Un sistema compatible indeterminado tiene:`,
          options: ['Una solución', 'Dos soluciones', 'Infinitas soluciones', 'Ninguna solución'],
          correct: 2,
          explanation: L`Compatible significa que tiene solución; indeterminado, que no es única. Por eso tiene infinitas.`,
          difficulty: 1
        },
        {
          id: 'sistemas-concepto-q3',
          prompt: L`¿Cuál operación produce un sistema equivalente?`,
          options: [
            'Multiplicar una ecuación por 0',
            'Intercambiar dos ecuaciones',
            'Sumar 1 solo a un miembro',
            'Eliminar una ecuación cualquiera'
          ],
          correct: 1,
          explanation: L`Intercambiar ecuaciones no cambia el conjunto solución. Multiplicar por 0 destruye información y sumar solo a un miembro rompe la igualdad.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 38-39'
    },
    {
      id: 'sistemas-eliminacion',
      worldId: 'sistemas',
      title: 'Método de eliminación',
      tagline: 'Sumar ecuaciones para que una incógnita desaparezca.',
      minutes: 17,
      xp: 85,
      concepts: ['Eliminación', 'Sistema escalonado', 'Multiplicadores', 'Sustitución hacia atrás'],
      theory: [
        {
          heading: 'La idea central',
          body: L`Se combinan las ecuaciones para cancelar una incógnita. Si los coeficientes de $y$ son $3$ y $2$, multiplicamos la primera por $2$ y la segunda por $-3$ para obtener $6y$ y $-6y$.`
        },
        {
          heading: 'Escalonar',
          body: L`El objetivo es llegar a un sistema escalonado: la segunda ecuación tiene una incógnita menos. Luego se resuelve hacia atrás, sustituyendo el valor hallado.`
        },
        {
          heading: 'El método de Gauss',
          body: L`Con más ecuaciones e incógnitas se repite el proceso: se elimina la primera incógnita de todas las ecuaciones siguientes, luego la segunda, y así hasta escalonar.`
        }
      ],
      formulas: [
        L`2E_2-3E_1:\ (6x+4y)- (6x+9y)=10-15`,
        L`-5y=-5\Rightarrow y=1`,
        L`2x+3(1)=5\Rightarrow x=1`,
        L`S=\{(1;1)\}`
      ],
      lab: 'systems',
      labConfig: { m1: 2, b1: 5, m2: 3, b2: 5, mode: 'elimination' },
      steps: [
        {
          title: 'Elegí la incógnita a eliminar',
          detail: 'Buscá la que tenga coeficientes más simples o ya opuestos.'
        },
        {
          title: 'Multiplicá y sumá',
          detail: L`Multiplicá cada ecuación por el coeficiente de la otra, con signo opuesto, y sumá.`,
          latex: L`2E_2-3E_1\Rightarrow -5y=-5`
        },
        {
          title: 'Sustituí hacia atrás',
          detail: L`Con $y=1$, reemplazá en cualquiera de las ecuaciones originales para obtener $x$.`,
          latex: L`2x+3=5\Rightarrow x=1`
        }
      ],
      questions: [
        {
          id: 'sistemas-eliminacion-q1',
          prompt: L`Al resolver $\begin{cases}2x+3y=5\\3x+2y=5\end{cases}$ por eliminación, se obtiene:`,
          options: [L`(1;1)`, L`(2;1)`, L`(1;2)`, L`(0;0)`],
          correct: 0,
          explanation: L`Multiplicando la segunda por 2 y restándole 3 veces la primera: $-5y=-5\Rightarrow y=1$. Luego $x=1$.`,
          difficulty: 3
        },
        {
          id: 'sistemas-eliminacion-q2',
          prompt: L`Para eliminar $y$ en $\begin{cases}3x+2y=7\\5x-4y=3\end{cases}$, una estrategia válida es:`,
          options: [
            'Multiplicar la primera por 2 y sumarla a la segunda',
            'Multiplicar la primera por 2 y restarle la segunda',
            'Sumar las dos ecuaciones directamente',
            'Multiplicar la segunda por 3'
          ],
          correct: 0,
          explanation: L`Al multiplicar la primera por 2 queda $6x+4y=14$; sumándola con $5x-4y=3$ se cancela $y$.`,
          difficulty: 2
        },
        {
          id: 'sistemas-eliminacion-q3',
          prompt: 'Un sistema escalonado es aquel en el que:',
          options: [
            'Todas las ecuaciones tienen el mismo coeficiente',
            'Cada ecuación empieza con al menos un coeficiente nulo más que la anterior',
            'No tiene solución',
            'Todas las incógnitas valen cero'
          ],
          correct: 1,
          explanation: L`La forma escalonada va eliminando incógnitas de a una, como una escalera.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 39-41'
    },
    {
      id: 'sistemas-igualacion',
      worldId: 'sistemas',
      title: 'Igualación y sustitución',
      tagline: 'Despejar, igualar o reemplazar: tres caminos al mismo punto.',
      minutes: 16,
      xp: 80,
      concepts: ['Igualación', 'Sustitución', 'Despeje', 'Verificación'],
      theory: [
        {
          heading: 'Igualación',
          body: L`Se despeja la misma incógnita en ambas ecuaciones y se igualan las expresiones resultantes. Queda una ecuación con una sola incógnita.`
        },
        {
          heading: 'Sustitución',
          body: L`Se despeja una incógnita en una ecuación y se reemplaza en la otra. Es especialmente útil cuando algún coeficiente es $1$ o $-1$.`
        },
        {
          heading: 'Siempre verificar',
          body: L`El par ordenado obtenido debe satisfacer ambas ecuaciones originales. Si falla una, hubo un error de despeje o de signo.`
        }
      ],
      formulas: [
        L`x=\frac{5-3y}{2}=\frac{5-2y}{3}`,
        L`3(5-3y)=2(5-2y)\Rightarrow y=1`,
        L`x=\frac{5-3}{2}=1`,
        L`S=\{(1;1)\}`
      ],
      lab: 'systems',
      labConfig: { m1: 2, b1: 5, m2: 3, b2: 5, mode: 'substitution' },
      steps: [
        {
          title: 'Elegí la incógnita más fácil',
          detail: L`Despejá la que tenga coeficiente $1$ o $-1$ para evitar fracciones.`
        },
        {
          title: 'Reemplazá en la otra ecuación',
          detail: L`Sustituí la expresión completa, con paréntesis si es necesario.`,
          latex: L`3\left(\frac{5-3y}{2}\right)+2y=5`
        },
        {
          title: 'Resolvé y verificá',
          detail: L`Obtené una incógnita, sustituí para la otra y comprobá en ambas ecuaciones.`
        }
      ],
      questions: [
        {
          id: 'sistemas-igualacion-q1',
          prompt: L`En el método de igualación se:`,
          options: [
            'Multiplican las ecuaciones',
            'Despeja la misma incógnita en ambas y se igualan las expresiones',
            'Suma siempre las ecuaciones',
            'Elimina una ecuación'
          ],
          correct: 1,
          explanation: L`La igualación consiste exactamente en despejar la misma variable en las dos ecuaciones e igualar.`,
          difficulty: 1
        },
        {
          id: 'sistemas-igualacion-q2',
          prompt: L`Si $x=5-3y$ y $x=5-2y$, entonces:`,
          options: [L`y=0`, L`y=1`, L`y=5`, L`y=-1`],
          correct: 0,
          explanation: L`Igualando: $5-3y=5-2y\Rightarrow -3y=-2y\Rightarrow y=0$. Luego $x=5$.`,
          difficulty: 2
        },
        {
          id: 'sistemas-igualacion-q3',
          prompt: '¿Cuándo conviene especialmente el método de sustitución?',
          options: [
            'Cuando todas las ecuaciones tienen coeficientes grandes',
            'Cuando una incógnita ya está despejada o tiene coeficiente 1',
            'Cuando el sistema es incompatible',
            'Nunca'
          ],
          correct: 1,
          explanation: L`Si ya hay un despeje o un coeficiente 1, sustituir evita fracciones innecesarias.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 40-41'
    },
    {
      id: 'sistemas-problemas',
      worldId: 'sistemas',
      title: 'Modelado con sistemas',
      tagline: 'Traducir el enunciado es el 80% del trabajo.',
      minutes: 18,
      xp: 90,
      concepts: ['Modelado', 'Variables', 'Restricciones', 'Verificación contextual'],
      theory: [
        {
          heading: 'Nombrar las incógnitas',
          body: L`Antes de escribir ecuaciones, definí qué representa cada variable. "Sean $g$ la cantidad de gallinas y $v$ la cantidad de vacas" evita confusiones y hace verificable el modelo.`
        },
        {
          heading: 'Dos datos, dos ecuaciones',
          body: L`Cada condición del enunciado produce una ecuación. El total de animales da $g+v=60$; el total de patas da $2g+4v=150$.`
        },
        {
          heading: 'La solución debe tener sentido',
          body: L`Si obtenés $-3$ gallinas, el modelo o la resolución tienen un error. Verificá unidades, signos y que la respuesta sea coherente con el contexto.`
        }
      ],
      formulas: [
        L`\begin{cases}g+v=60\\2g+4v=150\end{cases}`,
        L`\Rightarrow v=15,\ g=45`,
        L`\text{Verificación: }45+15=60,\ 2(45)+4(15)=150`
      ],
      lab: 'systems',
      labConfig: { m1: 1, b1: 60, m2: 2, b2: 150, mode: 'word' },
      steps: [
        {
          title: 'Definí variables',
          detail: L`Elegí letras mnemotécnicas y escribí su significado.`
        },
        {
          title: 'Traducí cada condición',
          detail: L`Cantidades totales suelen dar sumas; valores totales dan combinaciones lineales.`
        },
        {
          title: 'Resolvé y contextualizá',
          detail: L`Verificá que los valores sean no negativos y que cumplan ambas ecuaciones.`
        }
      ],
      questions: [
        {
          id: 'sistemas-problemas-q1',
          prompt: 'En un corral hay 60 animales entre gallinas y vacas, y 150 patas. ¿Cuántas vacas hay?',
          options: ['15', '45', '30', '20'],
          correct: 0,
          explanation: L`$g+v=60$ y $2g+4v=150$. Restando el doble de la primera: $2v=30\Rightarrow v=15$. Hay 15 vacas y 45 gallinas.`,
          difficulty: 3
        },
        {
          id: 'sistemas-problemas-q2',
          prompt: 'Un hotel tiene 50 habitaciones entre simples y dobles, con 87 camas. ¿Cuántas dobles hay?',
          options: ['37', '13', '25', '40'],
          correct: 0,
          explanation: L`$s+d=50$ y $s+2d=87$. Restando: $d=37$. Hay 37 dobles y 13 simples.`,
          difficulty: 2
        },
        {
          id: 'sistemas-problemas-q3',
          prompt: 'Un rectángulo tiene perímetro 46 cm y diagonal 17 cm. ¿Cuáles son sus lados?',
          options: ['8 cm y 15 cm', '10 cm y 13 cm', '7 cm y 16 cm', '5 cm y 18 cm'],
          correct: 0,
          explanation: L`$a+b=23$ y $a^2+b^2=289$. Elevando: $529=289+2ab\Rightarrow ab=120$. Las raíces de $t^2-23t+120=0$ son 8 y 15.`,
          difficulty: 3
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 41-42'
    }
  ]
};
