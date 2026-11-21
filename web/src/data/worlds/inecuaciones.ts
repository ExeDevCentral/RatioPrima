import type { World } from '../types';

const L = String.raw;

export const inecuaciones: World = {
  id: 'inecuaciones',
  order: 6,
  name: 'Frontera',
  subtitle: 'Inecuaciones',
  description:
    'El arte de comparar y acotar. Propiedades del orden, inecuaciones lineales, compuestas, valor absoluto y análisis de signos.',
  icon: 'frontier',
  color: '#fb923c',
  accent: 'rgba(251, 146, 60, 0.16)',
  lessons: [
    {
      id: 'inecuaciones-orden',
      worldId: 'inecuaciones',
      title: 'Propiedades del orden',
      tagline: 'Multiplicar por negativo invierte la flecha.',
      minutes: 14,
      xp: 70,
      concepts: ['Orden', 'Tricotomía', 'Suma', 'Multiplicación', 'Inversión'],
      theory: [
        {
          heading: 'Comparar es restar',
          body: L`$a<b$ equivale a $b-a>0$. Esta traducción convierte cualquier comparación en un análisis de signo y sirve para demostrar todas las propiedades del orden.`
        },
        {
          heading: 'Sumar conserva, multiplicar depende',
          body: L`Si $a\le b$, entonces $a+c\le b+c$ para cualquier $c$. Si multiplicamos por $c>0$, la desigualdad se conserva; si $c<0$, se invierte: $a\le b\Rightarrow ac\ge bc$.`
        },
        {
          heading: 'El error más caro del álgebra',
          body: L`Olvidar invertir el signo al multiplicar o dividir por un negativo cambia por completo el conjunto solución. Es el equivalente algebraico de mirar el mapa al revés.`
        }
      ],
      formulas: [
        L`a<b\iff b-a>0`,
        L`a\le b\Rightarrow a+c\le b+c`,
        L`a\le b,\ c>0\Rightarrow ac\le bc`,
        L`a\le b,\ c<0\Rightarrow ac\ge bc`
      ],
      lab: 'numberline',
      labConfig: { mode: 'order', a: -2, b: 3 },
      steps: [
        {
          title: 'Pasá todo a un miembro',
          detail: L`Reescribí la desigualdad como una comparación con cero: $f(x)>0$.`
        },
        {
          title: 'Operá con las propiedades',
          detail: L`Sumar o restar no cambia el sentido. Multiplicar o dividir por negativo lo invierte.`
        },
        {
          title: 'Representá el conjunto',
          detail: L`Dibujá en la recta y escribí el intervalo. Verificá con un valor de prueba.`,
          latex: L`-2x<6\Rightarrow x>-3`
        }
      ],
      questions: [
        {
          id: 'inecuaciones-orden-q1',
          prompt: L`Si $a<b$ y multiplicamos ambos miembros por $-2$, se obtiene:`,
          options: [L`-2a<-2b`, L`-2a>-2b`, L`-2a=-2b`, L`No se puede saber`],
          correct: 1,
          explanation: L`Multiplicar por un negativo invierte la desigualdad: $-2a>-2b$.`,
          difficulty: 1
        },
        {
          id: 'inecuaciones-orden-q2',
          prompt: L`La expresión $a\le b$ equivale a:`,
          options: [L`b-a<0`, L`b-a\le0`, L`b-a\ge0`, L`a+b\ge0`],
          correct: 2,
          explanation: L`$a\le b$ significa que $b$ está a la derecha de $a$ o coincide, o sea $b-a\ge0$.`,
          difficulty: 1
        },
        {
          id: 'inecuaciones-orden-q3',
          prompt: L`Si $x<3$, ¿cuál afirmación es siempre verdadera?`,
          options: [L`x^2<9`, L`-x>-3`, L`2x>6`, L`x-1<2`],
          correct: 3,
          explanation: L`Restar 1 conserva la desigualdad: $x-1<2$. Las otras fallan con negativos o invierten mal el signo.`,
          difficulty: 2
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, p. 35'
    },
    {
      id: 'inecuaciones-lineales',
      worldId: 'inecuaciones',
      title: 'Inecuaciones lineales',
      tagline: 'Como una ecuación, pero con intervalo de respuestas.',
      minutes: 15,
      xp: 75,
      concepts: ['Inecuación lineal', 'Conjunto solución', 'Intervalo', 'Recta real'],
      theory: [
        {
          heading: 'La misma mecánica, una flecha distinta',
          body: L`Una inecuación lineal tiene la forma $ax+b<0$ (o $>$, $\le$, $\ge$) con $a\ne0$. Se resuelve despejando $x$ con las mismas transformaciones que una ecuación, controlando el sentido de la desigualdad.`
        },
        {
          heading: 'El conjunto solución es un intervalo',
          body: L`A diferencia de una ecuación, la solución no es un punto sino una región de la recta. Por eso se escribe con intervalos y se representa con semirrectas o segmentos.`
        },
        {
          heading: 'Verificar con un punto de prueba',
          body: L`Elegí un número dentro del intervalo propuesto y reemplazalo en la inecuación original. Si falla, el sentido está invertido.`
        }
      ],
      formulas: [
        L`ax+b>0\quad(a\ne0)`,
        L`2x-7>0\Rightarrow x>\frac72`,
        L`S=\left(\frac72;+\infty\right)`,
        L`-\frac32x+1\le0\Rightarrow x\ge\frac23`
      ],
      lab: 'numberline',
      labConfig: { mode: 'inequality', a: 2, b: -7 },
      steps: [
        {
          title: 'Despejá como en una ecuación',
          detail: L`Sumá o restá para aislar el término con $x$.`
        },
        {
          title: 'Dividí por el coeficiente',
          detail: L`Si dividís por un negativo, invertí la desigualdad.`,
          latex: L`-2x>6\Rightarrow x<-3`
        },
        {
          title: 'Escribí el intervalo',
          detail: L`Usá paréntesis si el extremo no está incluido y corchete si sí.`,
          latex: L`x\ge\frac23\Rightarrow \left[\frac23;+\infty\right)`
        }
      ],
      questions: [
        {
          id: 'inecuaciones-lineales-q1',
          prompt: L`El conjunto solución de $2x-7>0$ es:`,
          options: [L`\left(-\infty;\frac72\right)`, L`\left(\frac72;+\infty\right)`, L`\left[-\frac72;+\infty\right)`, L`\left(-\infty;-\frac72\right)`],
          correct: 1,
          explanation: L`$2x>7\Rightarrow x>\frac72$. Como no incluye el extremo, es $\left(\frac72;+\infty\right)$.`,
          difficulty: 1
        },
        {
          id: 'inecuaciones-lineales-q2',
          prompt: L`Al resolver $-\frac32x+1\le0$ se obtiene:`,
          options: [L`x\le\frac23`, L`x\ge\frac23`, L`x\le-\frac23`, L`x\ge-\frac23`],
          correct: 1,
          explanation: L`$-\frac32x\le-1$. Al dividir por $-\frac32$ (negativo) se invierte: $x\ge\frac23$.`,
          difficulty: 2
        },
        {
          id: 'inecuaciones-lineales-q3',
          prompt: L`¿Qué intervalo representa $x<0$?`,
          options: [L`(0;+\infty)`, L`(-\infty;0)`, L`(-\infty;0]`, L`[0;+\infty)`],
          correct: 1,
          explanation: L`Son todos los números menores que 0, sin incluirlo: $(-\infty;0)$.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 35-37'
    },
    {
      id: 'inecuaciones-compuestas',
      worldId: 'inecuaciones',
      title: 'Inecuaciones compuestas y valor absoluto',
      tagline: 'Dos condiciones a la vez, o una distancia acotada.',
      minutes: 16,
      xp: 80,
      concepts: ['Doble desigualdad', 'Intersección', 'Valor absoluto', 'Unión'],
      theory: [
        {
          heading: 'Dos flechas, una zona',
          body: L`Una doble desigualdad como $-1<x\le3$ impone dos condiciones simultáneas: $x>-1$ y $x\le3$. La solución es la intersección de ambas, el intervalo $(-1;3]$.`
        },
        {
          heading: 'Valor absoluto menor que',
          body: L`$|x-a|<r$ describe los puntos a distancia menor que $r$ de $a$: el intervalo $(a-r;a+r)$. Con $\le$ se incluyen los extremos.`
        },
        {
          heading: 'Valor absoluto mayor que',
          body: L`$|x-a|>r$ describe los puntos que están lejos de $a$: dos semirrectas, $(-\infty;a-r)\cup(a+r;+\infty)$. Acá la solución es una unión, no una intersección.`
        }
      ],
      formulas: [
        L`-1<x\le3\iff x\in(-1;3]`,
        L`|x-a|<r\iff a-r<x<a+r`,
        L`|x-a|>r\iff x<a-r\ \lor\ x>a+r`,
        L`|x|\ge3\iff x\in(-\infty;-3]\cup[3;+\infty)`
      ],
      lab: 'numberline',
      labConfig: { mode: 'compound', center: 1, radius: 2 },
      steps: [
        {
          title: 'Separá en dos condiciones',
          detail: L`La doble desigualdad se parte en dos inecuaciones simples.`
        },
        {
          title: 'Resolvé cada una',
          detail: 'Obtenés dos intervalos. La solución es su intersección si las condiciones son simultáneas.'
        },
        {
          title: 'Traducí el módulo',
          detail: L`Si el módulo es menor, es un intervalo; si es mayor, es una unión de dos semirrectas.`
        }
      ],
      questions: [
        {
          id: 'inecuaciones-compuestas-q1',
          prompt: L`El conjunto $-1<x\le3$ se escribe como:`,
          options: [L`[-1;3]`, L`(-1;3]`, L`(-1;3)`, L`[-1;3)`],
          correct: 1,
          explanation: L`$-1$ no está incluido (paréntesis) y $3$ sí (corchete): $(-1;3]$.`,
          difficulty: 1
        },
        {
          id: 'inecuaciones-compuestas-q2',
          prompt: L`La solución de $|x|\ge3$ es:`,
          options: [L`[-3;3]`, L`(-3;3)`, L`(-\infty;-3]\cup[3;+\infty)`, L`[3;+\infty)`],
          correct: 2,
          explanation: L`Los puntos cuya distancia al origen es al menos 3 están a la izquierda de $-3$ o a la derecha de $3$.`,
          difficulty: 2
        },
        {
          id: 'inecuaciones-compuestas-q3',
          prompt: L`Si $|x-2|<4$, entonces $x$ pertenece a:`,
          options: [L`(-2;6)`, L`(-6;2)`, L`(-4;4)`, L`[2;6]`],
          correct: 0,
          explanation: L`$2-4<x<2+4$, es decir $-2<x<6$: el intervalo $(-2;6)$.`,
          difficulty: 3
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 36-37'
    },
    {
      id: 'inecuaciones-signo',
      worldId: 'inecuaciones',
      title: 'Análisis de signos',
      tagline: 'Una fracción cambia de signo solo en sus raíces y sus muros.',
      minutes: 17,
      xp: 85,
      concepts: ['Signo', 'Puntos críticos', 'Denominador', 'Tabla de signos'],
      theory: [
        {
          heading: 'Los puntos críticos',
          body: L`Para resolver $\frac{x-2}{x+3}\ge0$ se buscan los valores que anulan el numerador ($x=2$) y los que anulan el denominador ($x=-3$). Esos puntos dividen la recta en zonas donde el signo no cambia.`
        },
        {
          heading: 'El denominador nunca se incluye',
          body: L`Aunque la desigualdad sea $\ge$, un valor que anula el denominador queda excluido: la expresión no está definida. Se marca con paréntesis o con un círculo vacío.`
        },
        {
          heading: 'Tabla de signos',
          body: L`Se evalúa el signo de cada factor en cada zona y se multiplican los signos. La zona que cumple la desigualdad es la solución.`
        }
      ],
      formulas: [
        L`\frac{x-2}{x+3}\ge0\Rightarrow x\in(-\infty;-3)\cup[2;+\infty)`,
        L`\text{Numerador: }x=2\quad\text{Denominador: }x=-3`,
        L`\text{Denominador}\ne0\text{ siempre}`
      ],
      lab: 'numberline',
      labConfig: { mode: 'sign', root1: -3, root2: 2 },
      steps: [
        {
          title: 'Encontrá los puntos críticos',
          detail: 'Raíces del numerador y del denominador. Ordenalos en la recta.'
        },
        {
          title: 'Armá la tabla de signos',
          detail: 'Elegí un valor de prueba en cada zona y calculá el signo del cociente.'
        },
        {
          title: 'Excluí los muros',
          detail: L`El punto que anula el denominador nunca entra, aunque la desigualdad sea $\le$ o $\ge$.`
        }
      ],
      questions: [
        {
          id: 'inecuaciones-signo-q1',
          prompt: L`La solución de $\frac{x-2}{x+3}\ge0$ es:`,
          options: [
            L`[-3;2]`,
            L`(-\infty;-3)\cup[2;+\infty)`,
            L`(-3;2]`,
            L`(-\infty;-3]\cup[2;+\infty)`
          ],
          correct: 1,
          explanation: L`El signo es positivo fuera de las raíces. El $-3$ se excluye porque anula el denominador; el 2 se incluye porque anula el numerador.`,
          difficulty: 3
        },
        {
          id: 'inecuaciones-signo-q2',
          prompt: L`En una inecuación con denominador, un valor que anula el denominador:`,
          options: ['Siempre es solución', 'Nunca es solución', 'Es solución si la desigualdad es ≥', 'Depende del numerador'],
          correct: 1,
          explanation: L`La expresión no está definida en ese valor, así que no puede pertenecer al conjunto solución.`,
          difficulty: 1
        },
        {
          id: 'inecuaciones-signo-q3',
          prompt: L`La inecuación $x^2+3\ge0$ tiene como solución:`,
          options: [L`\varnothing`, L`\mathbb{R}`, L`[0;+\infty)`, L`[-3;3]`],
          correct: 1,
          explanation: L`$x^2\ge0$ para todo real, así que $x^2+3\ge3>0$ siempre. La solución es todo $\mathbb{R}$.`,
          difficulty: 2
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 35-37'
    }
  ]
};
