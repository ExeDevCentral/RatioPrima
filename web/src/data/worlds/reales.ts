import type { World } from '../types';

const L = String.raw;

export const reales: World = {
  id: 'reales',
  order: 1,
  name: 'Origen',
  subtitle: 'Números reales',
  description:
    'El mapa completo de los números: de contar piedras a medir la diagonal de un cuadrado. Construí el eje real, dominá el valor absoluto y los intervalos.',
  icon: 'orbit',
  color: '#22d3ee',
  accent: 'rgba(34, 211, 238, 0.16)',
  lessons: [
    {
      id: 'reales-conjuntos',
      worldId: 'reales',
      title: 'Los conjuntos numéricos',
      tagline: 'Cada conjunto nace de una pregunta que el anterior no puede responder.',
      minutes: 14,
      xp: 60,
      concepts: ['Naturales', 'Enteros', 'Racionales', 'Irracionales', 'Reales'],
      theory: [
        {
          heading: 'De contar a medir',
          body: L`Los números naturales $\mathbb{N}=\{1;2;3;\dots\}$ nacen de la necesidad de contar. Al agregar el cero aparece $\mathbb{N}_0=\mathbb{N}\cup\{0\}$. Pero dentro de $\mathbb{N}_0$ no siempre se puede resolver $x=p-q$ cuando $p<q$: por eso se inventan los enteros $\mathbb{Z}=\{\dots;-2;-1;0;1;2;\dots\}$.`
        },
        {
          heading: 'La gran cadena',
          body: L`En $\mathbb{Z}$ no siempre se puede dividir: $3x=2$ no tiene solución entera. Entonces aparecen los racionales $\mathbb{Q}=\{p/q \mid p\in\mathbb{Z},\ q\in\mathbb{Z}\setminus\{0\}\}$. Y como $\sqrt{2}$ no es racional, se completa el sistema con los irracionales $\mathbb{I}$ y los reales $\mathbb{R}=\mathbb{Q}\cup\mathbb{I}$.`
        },
        {
          heading: 'Decimales que revelan la especie',
          body: L`Todo racional tiene expresión decimal periódica: $\frac{4}{3}=1{,}\overline{3}$ y $\frac{5}{2}=2{,}5=2{,}5\overline{0}$. Los irracionales tienen infinitas cifras no periódicas: $\pi=3{,}14159\ldots$, $\sqrt{2}=1{,}4142\ldots$. Reconocer esa diferencia te permite clasificar cualquier número.`
        }
      ],
      formulas: [
        L`\mathbb{N}\subset\mathbb{N}_0\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}`,
        L`\mathbb{R}=\mathbb{Q}\cup\mathbb{I}\qquad \mathbb{Q}\cap\mathbb{I}=\varnothing`,
        L`\frac{p}{q}\ \text{con }p\in\mathbb{Z},\ q\in\mathbb{Z}\setminus\{0\}`
      ],
      lab: 'numberline',
      labConfig: { mode: 'sets', value: 1.4142 },
      steps: [
        {
          title: 'Preguntá qué operación falla',
          detail: L`Cada ampliación resuelve una carencia: restar en $\mathbb{N}$ exige $\mathbb{Z}$; dividir en $\mathbb{Z}$ exige $\mathbb{Q}$; resolver $x^2=2$ exige $\mathbb{R}$.`,
          latex: L`\mathbb{N}\to\mathbb{Z}\to\mathbb{Q}\to\mathbb{R}`
        },
        {
          title: 'Clasificá por su decimal',
          detail: L`Si el decimal es periódico (o finito), el número es racional. Si es infinito no periódico, es irracional.`,
          latex: L`0{,}75\in\mathbb{Q}\quad \sqrt{2}\in\mathbb{I}`
        },
        {
          title: 'Ubicalo en la cadena',
          detail: L`Todo natural es entero, todo entero es racional y todo racional es real. Las inclusiones nunca se rompen.`,
          latex: L`-3\in\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}`
        }
      ],
      questions: [
        {
          id: 'reales-conjuntos-q1',
          prompt: '¿Cuál de estas inclusiones es verdadera?',
          options: [
            L`\mathbb{Q}\subset\mathbb{I}`,
            L`\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}`,
            L`\mathbb{I}\subset\mathbb{Q}`,
            L`\mathbb{R}\subset\mathbb{Q}`
          ],
          correct: 1,
          explanation: L`Los naturales están dentro de los enteros, estos dentro de los racionales y todos dentro de los reales. Los irracionales son disjuntos de los racionales.`,
          hint: 'Recordá el diagrama de círculos concéntricos del PDF.',
          difficulty: 1
        },
        {
          id: 'reales-conjuntos-q2',
          prompt: L`El número $0{,}272727\ldots=0{,}\overline{27}$ es:`,
          options: ['Irracional', 'Racional no entero', 'Natural', 'Entero negativo'],
          correct: 1,
          explanation: L`Su desarrollo decimal es periódico, así que puede escribirse como fracción: $0{,}\overline{27}=\frac{27}{99}=\frac{3}{11}$. Es racional y no es entero.`,
          difficulty: 1
        },
        {
          id: 'reales-conjuntos-q3',
          prompt: L`¿Por qué $\sqrt{2}$ no pertenece a $\mathbb{Q}$?`,
          options: [
            'Porque su decimal es finito',
            'Porque no puede escribirse como cociente de dos enteros',
            'Porque es negativo',
            'Porque es un número natural'
          ],
          correct: 1,
          explanation: L`Se demuestra por contradicción: si $\sqrt{2}=p/q$ con $p,q$ coprimos, entonces $p^2=2q^2$, lo que obliga a que ambos sean pares, contradiciendo que sean coprimos.`,
          difficulty: 3
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 3-5'
    },
    {
      id: 'reales-recta',
      worldId: 'reales',
      title: 'La recta real y el orden',
      tagline: 'Cada número es un punto; cada punto es un número.',
      minutes: 12,
      xp: 60,
      concepts: ['Eje real', 'Orden', 'Densidad', 'Correspondencia biunívoca'],
      theory: [
        {
          heading: 'Una correspondencia perfecta',
          body: L`Fijamos un origen $0$, una unidad de medida y un sentido positivo. Entonces cada número real corresponde a exactamente un punto de la recta y cada punto a exactamente un número real. Esta correspondencia se llama biunívoca.`
        },
        {
          heading: 'Menor significa más a la izquierda',
          body: L`Decimos $a\le b$ cuando el punto de $a$ está a la izquierda del punto de $b$ o coincide con él. Por eso $-7<-3$, aunque $7>3$: el signo invierte la posición.`
        },
        {
          heading: 'Densidad: siempre hay otro',
          body: L`Entre dos reales distintos siempre existe otro real: el promedio $\frac{a+b}{2}$. No existen números reales "consecutivos". Esta propiedad es la que permite hablar de límites y continuidad más adelante.`
        }
      ],
      formulas: [
        L`a\le b \iff b-a\ge 0`,
        L`a<b \iff b-a>0`,
        L`a<b \implies a<\frac{a+b}{2}<b`
      ],
      lab: 'numberline',
      labConfig: { mode: 'order', a: -3, b: 2 },
      steps: [
        {
          title: 'Elegí el origen y la unidad',
          detail: 'Sin origen y unidad no hay escala: la recta se vuelve un mapa sin coordenadas.',
          latex: L`0,\ 1,\ 2,\ 3,\dots`
        },
        {
          title: 'Ubicá los negativos a la izquierda',
          detail: L`Cuanto mayor es el valor absoluto de un negativo, más a la izquierda está. Así $-8<-3$.`,
          latex: L`-8 < -3 < 0`
        },
        {
          title: 'Compará con la resta',
          detail: L`Para comparar $a$ y $b$ calculá $b-a$. Si el resultado es positivo, entonces $b$ es mayor.`,
          latex: L`2-(-3)=5>0\Rightarrow 2>-3`
        }
      ],
      questions: [
        {
          id: 'reales-recta-q1',
          prompt: L`¿Cuál de los siguientes números es menor?`,
          options: [L`-3{,}5`, L`-2{,}8`, L`0`, L`1`],
          correct: 0,
          explanation: L`En la recta, $-3{,}5$ está más a la izquierda que $-2{,}8$. Con negativos, mayor valor absoluto significa menor número.`,
          difficulty: 1
        },
        {
          id: 'reales-recta-q2',
          prompt: L`Si $a<b$, ¿qué número real está garantizado entre ambos?`,
          options: [L`a+b`, L`\frac{a+b}{2}`, L`b-a`, L`2b`],
          correct: 1,
          explanation: L`El promedio $\frac{a+b}{2}$ siempre queda estrictamente entre $a$ y $b$. Esa es la propiedad de densidad de $\mathbb{R}$.`,
          difficulty: 1
        },
        {
          id: 'reales-recta-q3',
          prompt: L`La expresión $a\le b$ equivale a:`,
          options: [L`b-a<0`, L`b-a\le 0`, L`b-a\ge 0`, L`a-b>0`],
          correct: 2,
          explanation: L`$a\le b$ significa que $b$ está a la derecha de $a$ o coincide, es decir, $b-a\ge 0$.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 6-7'
    },
    {
      id: 'reales-absoluto',
      worldId: 'reales',
      title: 'Valor absoluto como distancia',
      tagline: 'No importa el signo: importa cuán lejos estás del origen.',
      minutes: 15,
      xp: 70,
      concepts: ['Distancia', 'Valor absoluto', 'Ecuaciones modulares', 'Intervalos'],
      theory: [
        {
          heading: 'La definición que lo explica todo',
          body: L`El valor absoluto de $x$ es su distancia al origen: $|x|=d(x;0)$. Por eso $|5|=5$ y $|-5|=5$: ambos puntos están a cinco unidades del cero.`
        },
        {
          heading: 'Dos casos, una sola idea',
          body: L`Algebraicamente $|x|=x$ si $x\ge 0$, y $|x|=-x$ si $x<0$. La segunda fórmula no "agrega" un menos: lo usa para convertir el negativo en positivo.`
        },
        {
          heading: 'Distancias entre dos puntos',
          body: L`$|x-a|$ es la distancia entre $x$ y $a$. Entonces $|x-3|\le 2$ describe todos los puntos que están a lo sumo a 2 unidades de 3: el intervalo $[1;5]$.`
        }
      ],
      formulas: [
        L`|x|=\begin{cases}x & x\ge 0\\ -x & x<0\end{cases}`,
        L`|x-a|=d(x;a)`,
        L`|x-a|\le r \iff a-r\le x\le a+r`
      ],
      lab: 'numberline',
      labConfig: { mode: 'absolute', center: 3, radius: 2 },
      steps: [
        {
          title: 'Leé el módulo como distancia',
          detail: L`$|x-3|$ no es "x menos 3 con palitos": es la distancia entre $x$ y $3$.`,
          latex: L`d(x;3)=|x-3|`
        },
        {
          title: 'Traducí la desigualdad',
          detail: L`$|x-3|\le 2$ pide los puntos cuya distancia a 3 no supera 2.`
        },
        {
          title: 'Escribí el intervalo',
          detail: L`Sumá y restá el radio al centro: $3-2\le x\le 3+2$, o sea $[1;5]$.`,
          latex: L`x\in[1;5]`
        }
      ],
      questions: [
        {
          id: 'reales-absoluto-q1',
          prompt: L`El conjunto solución de $|x-3|\le 2$ es:`,
          options: [L`[1;5]`, L`(1;5)`, L`[-5;-1]`, L`[3;5]`],
          correct: 0,
          explanation: L`La distancia a 3 es a lo sumo 2, así que $x$ puede ir desde $3-2=1$ hasta $3+2=5$, incluidos los extremos.`,
          difficulty: 1
        },
        {
          id: 'reales-absoluto-q2',
          prompt: L`¿Cuál es el conjunto solución de $|x|=5$?`,
          options: [L`\{5\}`, L`\{-5\}`, L`\{-5;5\}`, L`\varnothing`],
          correct: 2,
          explanation: L`Hay dos puntos a distancia 5 del origen: $5$ y $-5$. Por eso el módulo de una ecuación produce dos ramas.`,
          difficulty: 1
        },
        {
          id: 'reales-absoluto-q3',
          prompt: L`Si $x<0$, entonces $|x|$ es igual a:`,
          options: [L`x`, L`-x`, L`0`, L`x^2`],
          correct: 1,
          explanation: L`Cuando $x$ es negativo, $-x$ es positivo. Por eso se usa $-x$ en la segunda rama de la definición.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 6-9'
    },
    {
      id: 'reales-intervalos',
      worldId: 'reales',
      title: 'Intervalos: el lenguaje del conjunto solución',
      tagline: 'Corchetes que incluyen, paréntesis que excluyen.',
      minutes: 14,
      xp: 70,
      concepts: ['Intervalos acotados', 'Intervalos no acotados', 'Unión', 'Intersección'],
      theory: [
        {
          heading: 'Cuatro formas de encerrar la recta',
          body: L`Un intervalo acotado tiene extremos finitos. $[a;b]$ incluye ambos; $(a;b)$ excluye ambos; $[a;b)$ incluye $a$ y excluye $b$; $(a;b]$ al revés. El corchete siempre mira hacia adentro del intervalo.`
        },
        {
          heading: 'Hacia el infinito',
          body: L`$[a;+\infty)$ son todos los números mayores o iguales que $a$. El símbolo $\infty$ nunca se incluye con corchete: no es un número, es una dirección.`
        },
        {
          heading: 'Unir e intersectar',
          body: L`La unión $A\cup B$ reúne los elementos de ambos conjuntos. La intersección $A\cap B$ conserva solo los que están en los dos. En la recta, la intersección es la zona de solapamiento.`
        }
      ],
      formulas: [
        L`[a;b]=\{x\mid a\le x\le b\}`,
        L`(a;b)=\{x\mid a<x<b\}`,
        L`(-\infty;a]=\{x\mid x\le a\}`
      ],
      lab: 'numberline',
      labConfig: { mode: 'interval', a: -2, b: 3 },
      steps: [
        {
          title: 'Mirá los extremos',
          detail: 'Corchete = extremo incluido. Paréntesis = extremo excluido.',
          latex: L`[2;5)\Rightarrow 2\le x<5`
        },
        {
          title: 'Decidí si es acotado',
          detail: L`Si aparece $+\infty$ o $-\infty$, el intervalo no está acotado de ese lado.`
        },
        {
          title: 'Intersecá mirando la recta',
          detail: L`Dibujá ambos intervalos y quedate con la zona que está pintada dos veces.`,
          latex: L`[-2;4]\cap[1;7]=[1;4]`
        }
      ],
      questions: [
        {
          id: 'reales-intervalos-q1',
          prompt: L`El intervalo $[2;5)$ representa:`,
          options: [L`2<x<5`, L`2\le x\le 5`, L`2\le x<5`, L`2<x\le 5`],
          correct: 2,
          explanation: L`El corchete en 2 incluye el extremo; el paréntesis en 5 lo excluye. Por eso $2\le x<5$.`,
          difficulty: 1
        },
        {
          id: 'reales-intervalos-q2',
          prompt: L`La unión $(-\infty;2]\cup[2;+\infty)$ es:`,
          options: [L`\mathbb{R}`, L`\{2\}`, L`\varnothing`, L`(2;+\infty)`],
          correct: 0,
          explanation: L`Ambos intervalos cubren toda la recta y comparten el punto 2. La unión es todo $\mathbb{R}$.`,
          difficulty: 2
        },
        {
          id: 'reales-intervalos-q3',
          prompt: L`¿Cómo se escribe el conjunto $\{x\mid x>-1\}$?`,
          options: [L`[-1;+\infty)`, L`(-1;+\infty)`, L`(-\infty;-1)`, L`[-1;1]`],
          correct: 1,
          explanation: L`El extremo $-1$ no está incluido porque la desigualdad es estricta, y la dirección es hacia $+\infty$.`,
          difficulty: 1
        }
      ],
      source: 'Ingreso Terciario 2027 · Matemática, pp. 7-9'
    }
  ]
};
