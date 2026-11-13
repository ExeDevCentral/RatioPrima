import type { World } from '../types';

const L = String.raw;

export const simulacros: World = {
  id: 'simulacros',
  order: 8,
  name: 'Arena',
  subtitle: 'Simulacros y examen',
  description:
    'El momento de probar todo junto. Autoevaluaciones, repaso de errores frecuentes y un examen final cronometrado con el formato del ingreso.',
  icon: 'trophy',
  color: '#fde047',
  accent: 'rgba(253, 224, 71, 0.16)',
  lessons: [
    {
      id: 'simulacros-autoeval-1',
      worldId: 'simulacros',
      title: 'Autoevaluación 1',
      tagline: 'Números reales, potencias y ecuaciones.',
      minutes: 25,
      xp: 120,
      concepts: ['Números reales', 'Potencias', 'Valor absoluto', 'Ecuaciones'],
      theory: [
        {
          heading: 'Cómo encarar la autoevaluación',
          body: 'Respondé sin mirar apuntes. Marcá las que dudaste, aunque hayas acertado: esas son las que hay que revisar. El objetivo no es el puntaje, es detectar grietas.'
        },
        {
          heading: 'Antes de entregar',
          body: 'Verificá signos, dominios y unidades. En los exámenes de ingreso, la mayoría de los errores no son conceptuales sino de prolijidad.'
        }
      ],
      formulas: [
        L`\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}`,
        L`a^n\cdot a^m=a^{n+m}`,
        L`|x-a|\le r\iff a-r\le x\le a+r`
      ],
      lab: 'laser3d',
      labConfig: { mode: 'arena', amplitude: 1.2 },
      steps: [
        { title: 'Leé toda la pregunta', detail: 'Identificá qué te piden exactamente antes de calcular.' },
        { title: 'Elegí una estrategia', detail: 'Definición, propiedad o contraejemplo. Si no sale, pasá a la siguiente.' },
        { title: 'Revisá el resultado', detail: 'Verificá con un valor numérico o con la sustitución.' }
      ],
      questions: [
        {
          id: 'simulacros-1-q1',
          prompt: '¿Cuál de estos números es irracional?',
          options: [L`\sqrt{9}`, L`0{,}75`, L`\pi`, L`\frac{3}{7}`],
          correct: 2,
          explanation: L`$\sqrt9=3$ es natural, $0{,}75$ y $3/7$ son racionales. $\pi$ tiene decimal infinito no periódico: es irracional.`,
          difficulty: 1
        },
        {
          id: 'simulacros-1-q2',
          prompt: L`Simplificá $\frac{a^3\cdot a^{-5}}{a^{-1}}$:`,
          options: [L`a^{-1}`, L`a`, L`a^{-9}`, L`a^3`],
          correct: 0,
          explanation: L`En el numerador: $a^{3-5}=a^{-2}$. Al dividir: $a^{-2-(-1)}=a^{-1}$.`,
          difficulty: 2
        },
        {
          id: 'simulacros-1-q3',
          prompt: L`El conjunto solución de $|x-2|\le3$ es:`,
          options: [L`[-1;5]`, L`[-5;1]`, L`(-1;5)`, L`[2;5]`],
          correct: 0,
          explanation: L`$-3\le x-2\le3$, sumando 2: $-1\le x\le5$.`,
          difficulty: 2
        },
        {
          id: 'simulacros-1-q4',
          prompt: L`La solución de $5-2x=11$ es:`,
          options: [L`x=3`, L`x=-3`, L`x=8`, L`x=-8`],
          correct: 1,
          explanation: L`$-2x=6\Rightarrow x=-3$. Verificación: $5-2(-3)=11$.`,
          difficulty: 1
        },
        {
          id: 'simulacros-1-q5',
          prompt: L`¿Cuál igualdad es verdadera?`,
          options: [L`(-2)^2=-4`, L`-2^2=4`, L`(-2)^3=-8`, L`(-2)^-2=-4`],
          correct: 2,
          explanation: L`$(-2)^3=(-2)(-2)(-2)=-8$. Las otras tienen signos o exponentes mal aplicados.`,
          difficulty: 2
        }
      ],
      source: 'PDF p. 43'
    },
    {
      id: 'simulacros-autoeval-2',
      worldId: 'simulacros',
      title: 'Autoevaluación 2',
      tagline: 'Álgebra, factoreo, ecuaciones y trigonometría.',
      minutes: 25,
      xp: 120,
      concepts: ['Productos especiales', 'Factoreo', 'Cuadráticas', 'Trigonometría'],
      theory: [
        {
          heading: 'Conectá los temas',
          body: 'En el ingreso los temas no vienen separados. Una ecuación cuadrática puede requerir factoreo, y un problema de triángulos puede terminar en una ecuación lineal. Pensá en cadena.'
        },
        {
          heading: 'Control de errores',
          body: 'Anotá cada error en una lista: signo, distributiva, dominio, fórmula. Repetir el mismo error es la señal más clara de qué repasar.'
        }
      ],
      formulas: [
        L`(a+b)^2=a^2+2ab+b^2`,
        L`x=\frac{-b\pm\sqrt{b^2-4ac}}{2a}`,
        L`\operatorname{sen}\alpha=\frac{CO}{H}`
      ],
      lab: 'laser3d',
      labConfig: { mode: 'arena', amplitude: 1.6 },
      steps: [
        { title: 'Factoreá antes de resolver', detail: 'Si la expresión se factoriza, la solución suele aparecer sin fórmula.' },
        { title: 'Dibujá si hay geometría', detail: 'Un esquema con datos evita confundir catetos e hipotenusa.' },
        { title: 'Verificá la solución', detail: 'Reemplazá y comprobá que la igualdad se cumpla.' }
      ],
      questions: [
        {
          id: 'simulacros-2-q1',
          prompt: L`Desarrollá $(2x+3)^2$:`,
          options: [L`4x^2+9`, L`4x^2+12x+9`, L`2x^2+12x+9`, L`4x^2+6x+9`],
          correct: 1,
          explanation: L`$(2x)^2+2(2x)(3)+3^2=4x^2+12x+9$.`,
          difficulty: 1
        },
        {
          id: 'simulacros-2-q2',
          prompt: L`Factorizá $x^2-5x+6$:`,
          options: [L`(x-2)(x-3)`, L`(x+2)(x+3)`, L`(x-1)(x-6)`, L`(x-5)(x+6)`],
          correct: 0,
          explanation: L`Buscamos dos números que sumen $-5$ y multipliquen $6$: $-2$ y $-3$.`,
          difficulty: 1
        },
        {
          id: 'simulacros-2-q3',
          prompt: L`Las raíces de $x^2-5x+6=0$ son:`,
          options: [L`2\ \text{y}\ 3`, L`-2\ \text{y}\ -3`, L`1\ \text{y}\ 6`, L`-1\ \text{y}\ -6`],
          correct: 0,
          explanation: L`Como $x^2-5x+6=(x-2)(x-3)$, las raíces son $2$ y $3$.`,
          difficulty: 1
        },
        {
          id: 'simulacros-2-q4',
          prompt: L`En un triángulo rectángulo los catetos miden 3 y 4. El seno del ángulo opuesto al cateto 3 es:`,
          options: [L`\frac{3}{4}`, L`\frac{4}{5}`, L`\frac{3}{5}`, L`\frac{5}{3}`],
          correct: 2,
          explanation: L`La hipotenusa mide 5. El seno es opuesto sobre hipotenusa: $3/5$.`,
          difficulty: 2
        },
        {
          id: 'simulacros-2-q5',
          prompt: L`El dominio de $\sqrt{x-3}$ es:`,
          options: [L`x>3`, L`x\ge3`, L`x\le3`, L`\mathbb{R}`],
          correct: 1,
          explanation: L`El radicando debe ser no negativo: $x-3\ge0\Rightarrow x\ge3$.`,
          difficulty: 1
        }
      ],
      source: 'PDF p. 44'
    },
    {
      id: 'simulacros-repaso',
      worldId: 'simulacros',
      title: 'Repaso de errores frecuentes',
      tagline: 'Los diez errores que más puntos cuestan.',
      minutes: 20,
      xp: 100,
      concepts: ['Signos', 'Distributiva', 'Dominio', 'Inecuaciones', 'Factoreo'],
      theory: [
        {
          heading: 'Errores que parecen detalles',
          body: 'No invertir una desigualdad, cancelar términos que no son factores, olvidar el doble producto, incluir un denominador nulo o ignorar el dominio de una raíz. Cada uno invalida la respuesta completa.'
        },
        {
          heading: 'La regla de oro',
          body: 'No cancelar sumas: solo factores. $\\frac{x+2}{x}$ no es $2$. En cambio $\\frac{2x}{x}=2$ porque $2x$ es un producto. Además, la división se distribuye en el numerador ($\\frac{a+b}{c}=\\frac{a}{c}+\\frac{b}{c}$), pero jamás en el denominador ($\\frac{c}{a+b}\\ne\\frac{c}{a}+\\frac{c}{b}$).'
        },
        {
          heading: 'Chequeo final en tres preguntas',
          body: '¿Respeté el dominio? ¿Verifiqué la solución en la ecuación original? ¿El resultado tiene sentido en el contexto?'
        }
      ],
      formulas: [
        L`\frac{c}{a+b}\ne\frac{c}{a}+\frac{c}{b}\quad(\text{en cambio }\frac{a+b}{c}=\frac{a}{c}+\frac{b}{c})`,
        L`\frac{ac}{c}=a\quad(c\ne0)`,
        L`a\le b,\ c<0\Rightarrow ac\ge bc`,
        L`\sqrt{x}\ \text{exige }x\ge0`
      ],
      lab: 'laser3d',
      labConfig: { mode: 'arena', amplitude: 1.0 },
      steps: [
        { title: 'Marcá los dominios', detail: 'Denominadores no nulos, radicandos no negativos, logaritmos positivos.' },
        { title: 'No canceles sumas', detail: 'Solo se simplifican factores que multiplican a todo el numerador y denominador.' },
        { title: 'Verificá el signo', detail: 'Si multiplicaste por negativo, la desigualdad cambia de sentido.' }
      ],
      questions: [
        {
          id: 'simulacros-3-q1',
          prompt: L`¿Cuál simplificación es correcta?`,
          options: [L`\frac{x+2}{x}=2`, L`\frac{2x}{x}=2`, L`\frac{x^2}{x}=0`, L`\frac{x+2}{2}=x`],
          correct: 1,
          explanation: L`Solo se cancela un factor común. En $\frac{2x}{x}$, el 2 multiplica a todo el numerador, así que queda 2.`,
          difficulty: 1
        },
        {
          id: 'simulacros-3-q2',
          prompt: L`Si $a<b$ y $c<0$, entonces:`,
          options: [L`ac<bc`, L`ac>bc`, L`ac=bc`, L`No se puede decidir`],
          correct: 1,
          explanation: L`Multiplicar por un negativo invierte la desigualdad: $ac>bc$.`,
          difficulty: 1
        },
        {
          id: 'simulacros-3-q3',
          prompt: L`¿Cuál expresión NO está definida para $x=2$?`,
          options: [L`x^2+1`, L`\frac{1}{x-2}`, L`\sqrt{x}`, L`|x|`],
          correct: 1,
          explanation: L`En $x=2$ el denominador se anula: la expresión no está definida.`,
          difficulty: 1
        },
        {
          id: 'simulacros-3-q4',
          prompt: L`El error en $(-2)^2=-4$ es:`,
          options: ['El exponente está mal', 'La base negativa elevada al cuadrado da positivo', 'Falta un paréntesis en el resultado', 'No hay error'],
          correct: 1,
          explanation: L`$(-2)^2=(-2)(-2)=4$. El signo negativo desaparece porque el exponente es par.`,
          difficulty: 1
        },
        {
          id: 'simulacros-3-q5',
          prompt: L`Al resolver una inecuación, dividir por un número negativo exige:`,
          options: ['Nada especial', 'Invertir el sentido de la desigualdad', 'Cambiar todos los signos', 'Elevar al cuadrado'],
          correct: 1,
          explanation: L`Si $a\le b$ y $c<0$, entonces $ac\ge bc$. El sentido se invierte.`,
          difficulty: 1
        }
      ],
      source: 'PDF p. 43-44'
    },
    {
      id: 'simulacros-examen',
      worldId: 'simulacros',
      title: 'Examen de ingreso final',
      tagline: 'Todo el recorrido en una sola misión.',
      minutes: 40,
      xp: 200,
      concepts: ['Integración', 'Estrategia', 'Tiempo', 'Precisión'],
      theory: [
        {
          heading: 'Estrategia de examen',
          body: 'Primero resolvé las que dominás. Las difíciles quedan para el final. Si una cuenta se vuelve enorme, probablemente haya una factorización o una propiedad que la simplifica.'
        },
        {
          heading: 'Administrá el tiempo',
          body: 'Dedicate unos segundos a leer y planificar cada problema. Es más caro rehacer que pensar. Dejá tiempo para revisar signos y dominios.'
        }
      ],
      formulas: [
        L`\text{Precisión}>\text{velocidad}`,
        L`\text{Dominio primero, cuentas después}`,
        L`\text{Verificar siempre}`
      ],
      lab: 'laser3d',
      labConfig: { mode: 'boss', amplitude: 2.0 },
      steps: [
        { title: 'Barrido inicial', detail: 'Leé todo y resolvé primero lo que sabés.' },
        { title: 'Ataque concentrado', detail: 'En cada problema, identificá el concepto y escribí el plan antes de calcular.' },
        { title: 'Revisión final', detail: 'Verificá dominios, signos y que hayas respondido lo que se pedía.' }
      ],
      questions: [
        {
          id: 'simulacros-4-q1',
          prompt: L`Simplificá $\left(\frac{2}{3}\right)^{-2}\cdot\frac{1}{4}$:`,
          options: [L`\frac{9}{16}`, L`\frac{16}{9}`, L`\frac{9}{4}`, L`\frac{1}{9}`],
          correct: 0,
          explanation: L`$\left(\frac23\right)^{-2}=\frac94$. Multiplicando por $\frac14$: $\frac{9}{16}$.`,
          difficulty: 3
        },
        {
          id: 'simulacros-4-q2',
          prompt: L`Factorizá completamente $2x^4-162y^4$:`,
          options: [
            L`2(x^2-9y^2)(x^2+9y^2)`,
            L`2(x-3y)(x+3y)(x^2+9y^2)`,
            L`2(x-3y)^2(x+3y)^2`,
            L`(2x^2-18y^2)(x^2+9y^2)`
          ],
          correct: 1,
          explanation: L`Factor común 2; diferencia de cuadrados dos veces: $2(x^2-9y^2)(x^2+9y^2)=2(x-3y)(x+3y)(x^2+9y^2)$.`,
          difficulty: 3
        },
        {
          id: 'simulacros-4-q3',
          prompt: L`La solución de $\frac{x-1}{2}-\frac{x+1}{3}=4$ es:`,
          options: [L`x=25`, L`x=29`, L`x=23`, L`x=31`],
          correct: 1,
          explanation: L`Multiplicando por 6: $3(x-1)-2(x+1)=24\Rightarrow 3x-3-2x-2=24\Rightarrow x=29$.`,
          difficulty: 3
        },
        {
          id: 'simulacros-4-q4',
          prompt: L`En un triángulo rectángulo, un cateto mide 6 y la hipotenusa 10. El otro cateto mide:`,
          options: [L`4`, L`8`, L`12`, L`16`],
          correct: 1,
          explanation: L`Por Pitágoras: $b^2=100-36=64\Rightarrow b=8$.`,
          difficulty: 1
        },
        {
          id: 'simulacros-4-q5',
          prompt: L`El sistema $\begin{cases}2x+y=5\\4x+2y=10\end{cases}$ es:`,
          options: ['Compatible determinado', 'Compatible indeterminado', 'Incompatible', 'No lineal'],
          correct: 1,
          explanation: L`La segunda ecuación es el doble de la primera: representan la misma recta. Hay infinitas soluciones.`,
          difficulty: 2
        },
        {
          id: 'simulacros-4-q6',
          prompt: L`Si $f(x)=x^2-4x+3$, ¿para qué valores $f(x)=0$?`,
          options: [L`x=1\ \text{y}\ x=3`, L`x=-1\ \text{y}\ x=-3`, L`x=0\ \text{y}\ x=4`, L`x=2\ \text{y}\ x=3`],
          correct: 0,
          explanation: L`$x^2-4x+3=(x-1)(x-3)$, entonces las raíces son 1 y 3.`,
          difficulty: 3
        },
        {
          id: 'simulacros-4-q7',
          prompt: L`Resolvé la ecuación exponencial $\frac{2^{x+1}}{8}=\frac{1}{16}$ (Examen 2006):`,
          options: [L`x=-2`, L`x=2`, L`x=-4`, L`x=0`],
          correct: 0,
          explanation: L`Expresamos todo en base 2: $\frac{2^{x+1}}{2^3}=2^{-4}\Rightarrow 2^{x-2}=2^{-4}\Rightarrow x-2=-4\Rightarrow x=-2$.`,
          difficulty: 3
        },
        {
          id: 'simulacros-4-q8',
          prompt: L`¿Cuál es el conjunto solución real de $\frac{1}{x-1}+\frac{3}{x+1}=\frac{x}{x-1}$?`,
          options: [L`\{1;2\}`, L`\{2\}`, L`\{1\}`, L`\{-1;2\}`],
          correct: 1,
          explanation: L`El dominio exige $x\ne1$ y $x\ne-1$. Multiplicando por $(x-1)(x+1)$ queda $x^2-3x+2=0$, cuyas raíces son $1$ y $2$. Como $x=1$ anula el denominador, se descarta como solución extraña: $S=\{2\}$.`,
          difficulty: 3
        },
        {
          id: 'simulacros-4-q9',
          prompt: L`La diagonal de un rectángulo mide $25\text{ cm}$ y su altura $10\text{ cm}$. El ángulo $\alpha$ con la base cumple:`,
          options: [L`\alpha=\arcsin(0{,}4)\text{ rad}`, L`\alpha=\arccos(0{,}4)\text{ rad}`, L`\alpha=\arctan(0{,}4)\text{ rad}`, L`\alpha=0{,}4\pi\text{ rad}`],
          correct: 0,
          explanation: L`La altura es el cateto opuesto al ángulo con la base y la diagonal es la hipotenusa: $\operatorname{sen}\alpha=\frac{10}{25}=0{,}4\Rightarrow\alpha=\arcsin(0{,}4)\text{ rad}$.`,
          difficulty: 2
        }
      ],
      source: 'PDF p. 47-50'
    }
  ]
};
