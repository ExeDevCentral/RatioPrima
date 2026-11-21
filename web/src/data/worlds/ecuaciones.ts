import type { World } from '../types';

const L = String.raw;

export const ecuaciones: World = {
  id: 'ecuaciones',
  order: 5,
  name: 'Balanza',
  subtitle: 'Ecuaciones',
  description:
    'Resolver una ecuación es mantener el equilibrio mientras se aísla la incógnita. Ecuaciones lineales, clasificación, cuadráticas y fraccionarias.',
  icon: 'scale',
  color: '#fb7185',
  accent: 'rgba(251, 113, 133, 0.16)',
  lessons: [
    {
      id: 'ecuaciones-lineales',
      worldId: 'ecuaciones',
      title: 'Ecuaciones lineales y equivalencia',
      tagline: 'Lo que hacés de un lado, lo hacés del otro.',
      minutes: 14,
      xp: 70,
      concepts: ['Ecuación', 'Incógnita', 'Conjunto solución', 'Ecuaciones equivalentes', 'Propiedades'],
      theory: [
        {
          heading: 'Qué es resolver',
          body: L`Una ecuación es una igualdad con al menos una incógnita. Resolverla es encontrar todos los valores de la incógnita que la hacen verdadera. Ese conjunto de valores es el conjunto solución $S$.`
        },
        {
          heading: 'Transformaciones que conservan las soluciones',
          body: L`Sumar o restar la misma expresión a ambos miembros produce una ecuación equivalente. Multiplicar o dividir ambos miembros por un número distinto de cero también. La ecuación cambia de forma, no de solución.`
        },
        {
          heading: 'El algoritmo, justificado',
          body: L`Primero se eliminan denominadores, luego paréntesis, después se agrupan las $x$ de un lado y los números del otro, y finalmente se divide por el coeficiente. Cada paso es una transformación equivalente.`
        }
      ],
      formulas: [
        L`ax+b=0\quad(a\ne0)\Rightarrow x=-\frac{b}{a}`,
        L`2x-1=5\Rightarrow 2x=6\Rightarrow x=3`,
        L`S=\{3\}`
      ],
      lab: 'balance',
      labConfig: { a: 2, b: -1, c: 5 },
      steps: [
        {
          title: 'Simplificá cada miembro',
          detail: 'Eliminá paréntesis y denominadores antes de mover términos.'
        },
        {
          title: 'Agrupá las incógnitas',
          detail: L`Sumá el opuesto del término que quieras eliminar en ambos miembros.`,
          latex: L`2x-1+1=5+1\Rightarrow 2x=6`
        },
        {
          title: 'Despejá dividiendo',
          detail: L`Dividí ambos miembros por el coeficiente de $x$.`,
          latex: L`\frac{2x}{2}=\frac{6}{2}\Rightarrow x=3`
        }
      ],
      questions: [
        {
          id: 'ecuaciones-lineales-q1',
          prompt: L`La solución de $2x-1=5$ es:`,
          options: [L`x=2`, L`x=3`, L`x=4`, L`x=-3`],
          correct: 1,
          explanation: L`Sumamos 1: $2x=6$. Dividimos por 2: $x=3$. Verificación: $2\cdot3-1=5$.`,
          difficulty: 1
        },
        {
          id: 'ecuaciones-lineales-q2',
          prompt: L`¿Qué transformación NO produce una ecuación equivalente?`,
          options: [
            'Sumar 5 a ambos miembros',
            'Multiplicar ambos miembros por 2',
            'Dividir ambos miembros por 0',
            'Restar x a ambos miembros'
          ],
          correct: 2,
          explanation: L`Dividir por cero no está definido y destruye la equivalencia. Las otras tres son transformaciones válidas.`,
          difficulty: 1
        },
        {
          id: 'ecuaciones-lineales-q3',
          prompt: L`Resolvé $3(x-2)=x+4$:`,
          options: [L`x=5`, L`x=2`, L`x=-5`, L`x=1`],
          correct: 0,
          explanation: L`$3x-6=x+4\Rightarrow 2x=10\Rightarrow x=5$.`,
          difficulty: 2
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 30-32'
    },
    {
      id: 'ecuaciones-clasificacion',
      worldId: 'ecuaciones',
      title: 'Clasificación de ecuaciones',
      tagline: 'Una, infinitas o ninguna: el coeficiente decide.',
      minutes: 13,
      xp: 70,
      concepts: ['Compatible determinada', 'Indeterminada', 'Incompatible', '0x=b'],
      theory: [
        {
          heading: 'La forma canónica ax=b',
          body: L`Toda ecuación lineal se reduce a $ax=b$. Si $a\ne0$, hay una única solución $x=b/a$: compatible determinada. Si $a=0$, el análisis depende de $b$.`
        },
        {
          heading: '0x=0: todo vale',
          body: L`Si $a=0$ y $b=0$, la igualdad $0=0$ es verdadera para cualquier $x$. La ecuación es indeterminada y su conjunto solución es $S=\mathbb{R}$.`
        },
        {
          heading: '0x=5: nada vale',
          body: L`Si $a=0$ y $b\ne0$, queda $0=b$, que es falso para todo $x$. La ecuación es incompatible y $S=\varnothing$.`
        }
      ],
      formulas: [
        L`ax=b`,
        L`a\ne0\Rightarrow S=\left\{\frac{b}{a}\right\}`,
        L`a=0,\ b=0\Rightarrow S=\mathbb{R}`,
        L`a=0,\ b\ne0\Rightarrow S=\varnothing`
      ],
      lab: 'balance',
      labConfig: { a: 0, b: 5, c: 0 },
      steps: [
        {
          title: 'Simplificá hasta ax=b',
          detail: 'Agrupá todos los términos y reducí.'
        },
        {
          title: 'Mirá el coeficiente de x',
          detail: L`Si no es cero, hay solución única: dividí.`,
          latex: L`-10x=-110\Rightarrow x=11`
        },
        {
          title: 'Si el coeficiente es cero, mirá b',
          detail: L`$0=0$ es siempre verdadero ($S=\mathbb{R}$); $0=5$ es siempre falso ($S=\varnothing$).`
        }
      ],
      questions: [
        {
          id: 'ecuaciones-clasificacion-q1',
          prompt: L`La ecuación $0x=0$ es:`,
          options: ['Compatible determinada', 'Compatible indeterminada', 'Incompatible', 'No es una ecuación'],
          correct: 1,
          explanation: L`$0=0$ es verdadero para todo real, así que $S=\mathbb{R}$: compatible con infinitas soluciones.`,
          difficulty: 1
        },
        {
          id: 'ecuaciones-clasificacion-q2',
          prompt: L`La ecuación $0x=5$ tiene conjunto solución:`,
          options: [L`\{5\}`, L`\{0\}`, L`\mathbb{R}`, L`\varnothing`],
          correct: 3,
          explanation: L`$0=5$ es falso para cualquier $x$. No existe solución: $S=\varnothing$.`,
          difficulty: 1
        },
        {
          id: 'ecuaciones-clasificacion-q3',
          prompt: L`Si $ax=b$ con $a\ne0$, la solución es:`,
          options: [L`x=ab`, L`x=\frac{a}{b}`, L`x=\frac{b}{a}`, L`x=b-a`],
          correct: 2,
          explanation: L`Dividimos ambos miembros por $a$, que no es cero: $x=b/a$.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 31-32'
    },
    {
      id: 'ecuaciones-cuadraticas',
      worldId: 'ecuaciones',
      title: 'Producto nulo y ecuaciones cuadráticas',
      tagline: 'Si un producto es cero, alguien tiene la culpa.',
      minutes: 18,
      xp: 90,
      concepts: ['Producto nulo', 'Fórmula resolvente', 'Discriminante', 'Raíces'],
      theory: [
        {
          heading: 'La condición de anulación',
          body: L`Si $ab=0$, entonces $a=0$ o $b=0$. Esto permite resolver ecuaciones factorizadas sin desarrollar: $(x-3)(x^2-1)=0$ conduce a $x=3$, $x=1$ o $x=-1$.`
        },
        {
          heading: 'La fórmula resolvente',
          body: L`Para $ax^2+bx+c=0$ con $a\ne0$, las soluciones son $x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}$. La fórmula se deduce completando cuadrados, no aparece por generación espontánea.`
        },
        {
          heading: 'El discriminante informa sin calcular',
          body: L`$\Delta=b^2-4ac$ decide la naturaleza de las raíces: $\Delta>0$ dos raíces reales distintas; $\Delta=0$ una raíz doble; $\Delta<0$ no hay raíces reales.`
        }
      ],
      formulas: [
        L`ab=0\iff a=0\ \lor\ b=0`,
        L`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        L`\Delta=b^2-4ac`,
        L`\Delta>0:\ 2\text{ raíces}\quad \Delta=0:\ 1\text{ raíz doble}\quad \Delta<0:\ \text{ninguna real}`
      ],
      lab: 'parabola',
      labConfig: { a: 2, b: -10, c: 12 },
      steps: [
        {
          title: 'Factorizá si es posible',
          detail: L`Si la ecuación ya viene factorizada, usá producto nulo: cada factor igual a cero.`,
          latex: L`(x-3)(x^2-1)=0\Rightarrow S=\{-1;1;3\}`
        },
        {
          title: 'Identificá a, b y c',
          detail: L`Pasá todo a un miembro y ordená: $ax^2+bx+c=0$. Cuidado con los signos.`
        },
        {
          title: 'Calculá el discriminante y resolvé',
          detail: L`Primero $\Delta$ para saber qué esperar; después aplicá la fórmula.`,
          latex: L`2x^2-10x+12=0\Rightarrow \Delta=100-96=4`
        }
      ],
      questions: [
        {
          id: 'ecuaciones-cuadraticas-q1',
          prompt: L`El conjunto solución de $(x-3)(x^2-1)=0$ es:`,
          options: [L`\{3\}`, L`\{-1;1\}`, L`\{-1;1;3\}`, L`\{-3;1\}`],
          correct: 2,
          explanation: L`Producto nulo: $x-3=0$ o $x^2-1=0$. Entonces $x=3$, $x=1$ o $x=-1$.`,
          difficulty: 1
        },
        {
          id: 'ecuaciones-cuadraticas-q2',
          prompt: L`Las soluciones de $2x^2-10x+12=0$ son:`,
          options: [L`2\ \text{y}\ 3`, L`-2\ \text{y}\ -3`, L`1\ \text{y}\ 6`, L`-1\ \text{y}\ 6`],
          correct: 0,
          explanation: L`$\Delta=(-10)^2-4\cdot2\cdot12=4$. Entonces $x=\frac{10\pm2}{4}$, es decir $3$ y $2$.`,
          difficulty: 3
        },
        {
          id: 'ecuaciones-cuadraticas-q3',
          prompt: L`Si el discriminante de una cuadrática es negativo, entonces:`,
          options: ['Tiene dos raíces reales distintas', 'Tiene una raíz doble', 'No tiene raíces reales', 'Tiene infinitas raíces'],
          correct: 2,
          explanation: L`La raíz cuadrada de un número negativo no es real, así que no hay soluciones reales. En los complejos habría dos raíces conjugadas.`,
          difficulty: 2
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 32-34'
    },
    {
      id: 'ecuaciones-fraccionarias',
      worldId: 'ecuaciones',
      title: 'Ecuaciones fraccionarias',
      tagline: 'Multiplicar en cruz, pero cuidando el dominio.',
      minutes: 16,
      xp: 80,
      concepts: ['Proporción', 'Producto de medios y extremos', 'Dominio', 'Solución extraña'],
      theory: [
        {
          heading: 'La regla de las proporciones',
          body: L`En una proporción $\frac{a}{b}=\frac{c}{d}$ con $b,d\ne0$, el producto de medios iguala al producto de extremos: $ad=bc$. Es la versión algebraica de "multiplicar en cruz".`
        },
        {
          heading: 'El dominio primero',
          body: L`Antes de multiplicar, anotá qué valores anulan los denominadores. Esos valores quedan excluidos aunque aparezcan como solución de la ecuación transformada.`
        },
        {
          heading: 'Verificar no es opcional',
          body: L`Al multiplicar por expresiones con $x$ pueden aparecer soluciones extrañas. Toda solución candidata debe verificarse en la ecuación original.`
        }
      ],
      formulas: [
        L`\frac{a}{b}=\frac{c}{d}\iff ad=bc\quad(b,d\ne0)`,
        L`\frac{-2}{2x-1}=\frac{3}{x+6}\Rightarrow x=-\frac98`,
        L`\text{Dominio: }2x-1\ne0,\ x+6\ne0`
      ],
      lab: 'balance',
      labConfig: { a: -2, b: 1, c: 3, fractional: true },
      steps: [
        {
          title: 'Anotá las restricciones',
          detail: L`Igualá cada denominador a cero y excluí esos valores del dominio.`
        },
        {
          title: 'Multiplicá en cruz',
          detail: L`Aplicá $ad=bc$ y resolvé la ecuación resultante.`,
          latex: L`-2(x+6)=3(2x-1)`
        },
        {
          title: 'Verificá en la original',
          detail: L`Si el candidato coincide con una restricción, se descarta. Si no, se comprueba reemplazando.`,
          latex: L`-\frac98\ne\frac12,\quad -\frac98\ne-6`
        }
      ],
      questions: [
        {
          id: 'ecuaciones-fraccionarias-q1',
          prompt: L`Al resolver $\frac{-2}{2x-1}=\frac{3}{x+6}$, se obtiene:`,
          options: [L`x=-\frac98`, L`x=\frac98`, L`x=-9`, L`x=8`],
          correct: 0,
          explanation: L`Multiplicando en cruz: $-2(x+6)=3(2x-1)\Rightarrow -2x-12=6x-3\Rightarrow -9=8x\Rightarrow x=-\frac98$.`,
          difficulty: 3
        },
        {
          id: 'ecuaciones-fraccionarias-q2',
          prompt: L`En $\frac{5}{x-5}=\frac{3}{2x-4}$, ¿qué valores NO pueden ser solución?`,
          options: [L`x=5\ \text{y}\ x=2`, L`x=5\ \text{y}\ x=4`, L`x=0`, L`Ninguno`],
          correct: 0,
          explanation: L`Los denominadores se anulan en $x=5$ y $2x-4=0\Rightarrow x=2$. Esos valores quedan excluidos del dominio.`,
          difficulty: 1
        },
        {
          id: 'ecuaciones-fraccionarias-q3',
          prompt: L`En una proporción $\frac{a}{b}=\frac{c}{d}$, se cumple:`,
          options: [L`ab=cd`, L`ac=bd`, L`ad=bc`, L`a+b=c+d`],
          correct: 2,
          explanation: L`Producto de medios igual a producto de extremos: $a\cdot d=b\cdot c$.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 33-34'
    }
  ]
};
