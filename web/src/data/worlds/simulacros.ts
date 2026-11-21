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
          difficulty: 2,
          tags: ['pdf:autoeval-1', 'pag-43']
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
          difficulty: 1,
          tags: ['pdf:autoeval-2', 'pag-44']
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
        },
        {
          id: 'simulacros-3-q6',
          prompt: L`Autoevaluación Nº 3 · Resolvé $\frac{3}{4}|x|+\frac{1}{4}\ge 1$:`,
          options: [L`[-1;1]`, L`(-\infty;-1]\cup[1;+\infty)`, L`[1;+\infty)`, L`(-\infty;-1)\cup(1;+\infty)`],
          correct: 1,
          explanation: L`Restamos $\frac{1}{4}$: $\frac{3}{4}|x|\ge\frac{3}{4}\Rightarrow |x|\ge 1\Rightarrow x\le -1\ \text{o}\ x\ge 1$, es decir $(-\infty;-1]\cup[1;+\infty)$.`,
          hint: 'Despejá primero |x| como en una inecuación lineal y después abrí el módulo.',
          difficulty: 2,
          tags: ['pdf:autoeval-3', 'pag-45']
        },
        {
          id: 'simulacros-3-q7',
          prompt: L`Autoevaluación Nº 3 · Simplificá $\sqrt{8}-2\sqrt{32}+3\sqrt{128}$:`,
          options: [L`18\sqrt{2}`, L`14\sqrt{2}`, L`26\sqrt{2}`, L`6\sqrt{2}`],
          correct: 0,
          explanation: L`Extraemos factores de cada raíz: $\sqrt{8}=2\sqrt{2}$, $2\sqrt{32}=8\sqrt{2}$ y $3\sqrt{128}=24\sqrt{2}$. Sumamos coeficientes: $(2-8+24)\sqrt{2}=18\sqrt{2}$.`,
          hint: 'Reescribí 8, 32 y 128 como múltiplos de 2 con un cuadrado perfecto.',
          difficulty: 2,
          tags: ['pdf:autoeval-3', 'pag-45']
        },
        {
          id: 'simulacros-3-q8',
          prompt: L`Autoevaluación Nº 3 · Un rombo tiene perímetro $160\text{ cm}$ y un ángulo interior de $120^\circ$. Sus diagonales miden:`,
          options: [L`40\text{ cm}\ \text{y}\ 40\sqrt{3}\text{ cm}`, L`80\text{ cm}\ \text{y}\ 80\sqrt{3}\text{ cm}`, L`20\text{ cm}\ \text{y}\ 20\sqrt{3}\text{ cm}`, L`40\text{ cm}\ \text{y}\ 80\text{ cm}`],
          correct: 0,
          explanation: L`Cada lado mide $160/4=40\text{ cm}$. Las diagonales son perpendiculares y bisecan los ángulos en $60^\circ$ y $30^\circ$: $d_1=2\cdot 40\cos 60^\circ=40\text{ cm}$ y $d_2=2\cdot 40\operatorname{sen}60^\circ=40\sqrt{3}\text{ cm}$.`,
          hint: 'Dividí el perímetro por 4 para hallar el lado y usá uno de los 4 triángulos rectángulos internos.',
          difficulty: 3,
          tags: ['pdf:autoeval-3', 'pag-45']
        },
        {
          id: 'simulacros-3-q9',
          prompt: L`Autoevaluación Nº 4 · ¿Para qué valores reales de $\alpha$ está definida $\frac{1}{\alpha^2+6\alpha+5}$?`,
          options: [L`\alpha\ne 1\ \text{y}\ \alpha\ne 5`, L`\alpha\ne -1\ \text{y}\ \alpha\ne -5`, L`\alpha>-5`, L`\alpha\ne -6\ \text{y}\ \alpha\ne 5`],
          correct: 1,
          explanation: L`Factorizamos el denominador: $\alpha^2+6\alpha+5=(\alpha+1)(\alpha+5)$. Para que no sea cero, exigimos $\alpha\ne -1$ y $\alpha\ne -5$.`,
          hint: 'Buscá dos números que sumen 6 y multipliquen 5 para factorizar el denominador.',
          difficulty: 2,
          tags: ['pdf:autoeval-4', 'pag-46']
        },
        {
          id: 'simulacros-3-q10',
          prompt: L`Autoevaluación Nº 4 · En un campo se siembra $\frac{1}{7}$ con trigo, $\frac{1}{3}$ de lo que queda con maíz y las $480\text{ ha}$ restantes con soja. ¿Cuántas hectáreas tiene el campo?`,
          options: [L`720\text{ ha}`, L`840\text{ ha}`, L`960\text{ ha}`, L`1120\text{ ha}`],
          correct: 1,
          explanation: L`Tras sembrar $\frac{1}{7}$ quedan $\frac{6}{7}$. Un tercio de $\frac{6}{7}$ es $\frac{2}{7}$ de maíz, por lo que sobran $\frac{4}{7}$ para soja. Entonces $\frac{4}{7}T=480\Rightarrow T=480\cdot\frac{7}{4}=840\text{ ha}$.`,
          hint: 'Calculá primero qué fracción del total queda después del trigo, y tomá 1/3 de esa fracción.',
          difficulty: 2,
          tags: ['pdf:autoeval-4', 'pag-46']
        },
        {
          id: 'simulacros-3-q11',
          prompt: L`Autoevaluación Nº 4 · ¿Para qué valores reales de $\alpha$ está definida $\sqrt{(-\alpha+1)(\alpha+2)}$?`,
          options: [L`[-2;1]`, L`(-\infty;-2]\cup[1;+\infty)`, L`(-2;1)`, L`[-1;2]`],
          correct: 0,
          explanation: L`El radicando debe ser $\ge 0$: $(-\alpha+1)(\alpha+2)\ge 0$. Sus raíces son $-2$ y $1$, y la parábola abre hacia abajo, así que es no negativa en $[-2;1]$.`,
          hint: 'Analizá el signo del producto en los intervalos determinados por α = −2 y α = 1.',
          difficulty: 3,
          tags: ['pdf:autoeval-4', 'pag-46']
        }
      ],
      source: 'PDF p. 45-46'
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
          difficulty: 3,
          tags: ['pdf:examen-2006', 'pag-47']
        },
        {
          id: 'simulacros-4-q8',
          prompt: L`¿Cuál es el conjunto solución real de $\frac{1}{x-1}+\frac{3}{x+1}=\frac{x}{x-1}$?`,
          options: [L`\{1;2\}`, L`\{2\}`, L`\{1\}`, L`\{-1;2\}`],
          correct: 1,
          explanation: L`El dominio exige $x\ne1$ y $x\ne-1$. Multiplicando por $(x-1)(x+1)$ queda $x^2-3x+2=0$, cuyas raíces son $1$ y $2$. Como $x=1$ anula el denominador, se descarta como solución extraña: $S=\{2\}$.`,
          difficulty: 3,
          tags: ['pdf:examen-2006', 'pag-47']
        },
        {
          id: 'simulacros-4-q9',
          prompt: L`La diagonal de un rectángulo mide $25\text{ cm}$ y su altura $10\text{ cm}$. El ángulo $\alpha$ con la base cumple:`,
          options: [L`\alpha=\arcsin(0{,}4)\text{ rad}`, L`\alpha=\arccos(0{,}4)\text{ rad}`, L`\alpha=\arctan(0{,}4)\text{ rad}`, L`\alpha=0{,}4\pi\text{ rad}`],
          correct: 0,
          explanation: L`La altura es el cateto opuesto al ángulo con la base y la diagonal es la hipotenusa: $\operatorname{sen}\alpha=\frac{10}{25}=0{,}4\Rightarrow\alpha=\arcsin(0{,}4)\text{ rad}$.`,
          difficulty: 2,
          tags: ['pdf:examen-2006', 'pag-47']
        },
        {
          id: 'simulacros-4-q10',
          prompt: L`Examen 2006 · Un restaurante ofrece menú económico a \$800 y ejecutivo a \$1500. Si 13 personas gastaron \$14600, ¿cuántos eligieron cada menú?`,
          options: ['7 económico y 6 ejecutivo', '6 económico y 7 ejecutivo', '8 económico y 5 ejecutivo', '5 económico y 8 ejecutivo'],
          correct: 0,
          explanation: L`Planteamos $x+y=13$ y $800x+1500y=14600$. Sustituyendo $x=13-y$: $10400+700y=14600\Rightarrow 700y=4200\Rightarrow y=6$ (ejecutivo) y $x=7$ (económico).`,
          hint: 'Llamá x al menú económico e y al ejecutivo, y despejá x = 13 − y.',
          difficulty: 2,
          tags: ['pdf:examen-2006', 'pag-47']
        },
        {
          id: 'simulacros-4-q11',
          prompt: L`Examen 2006 · Determiná el radio de una circunferencia si un ángulo central de $\frac{\pi}{5}\text{ rad}$ subtiende un arco de $20\text{ cm}$:`,
          options: [L`\frac{100}{\pi}\text{ cm}`, L`4\pi\text{ cm}`, L`\frac{4}{\pi}\text{ cm}`, L`100\pi\text{ cm}`],
          correct: 0,
          explanation: L`La longitud de arco cumple $s=r\cdot\theta$. Despejando: $r=\frac{20}{\pi/5}=\frac{100}{\pi}\text{ cm}$.`,
          hint: 'Recordá la relación en radianes: arco = radio × ángulo.',
          difficulty: 2,
          tags: ['pdf:examen-2006', 'pag-48']
        },
        {
          id: 'simulacros-4-q12',
          prompt: L`Examen 2013 · Una escalera de $2{,}5\text{ m}$ apoya formando $65^\circ$ con el piso. ¿A qué distancia de la pared está el pie?`,
          options: [L`2{,}5\cos(65^\circ)\approx 1{,}06\text{ m}`, L`2{,}5\operatorname{sen}(65^\circ)\approx 2{,}27\text{ m}`, L`2{,}5\tan(65^\circ)\approx 5{,}36\text{ m}`, L`\frac{2{,}5}{\cos(65^\circ)}\approx 5{,}92\text{ m}`],
          correct: 0,
          explanation: L`La distancia al pie es el cateto adyacente al ángulo de $65^\circ$ y la escalera es la hipotenusa ($2{,}5\text{ m}$): $d=2{,}5\cos(65^\circ)\approx 1{,}06\text{ m}$.`,
          hint: 'Dibujá el triángulo rectángulo: la escalera es la hipotenusa y el piso es el cateto adyacente.',
          difficulty: 2,
          tags: ['pdf:examen-2013', 'pag-49']
        },
        {
          id: 'simulacros-4-q13',
          prompt: L`Examen 2013 · ¿Para qué valores reales de $x$ está definida $\frac{1}{25x^3-100x^2}$?`,
          options: [L`x\ne 0\ \text{y}\ x\ne 4`, L`x\ne 4`, L`x\ne 0\ \text{y}\ x\ne \pm 2`, L`x>4`],
          correct: 0,
          explanation: L`Factorizamos el denominador: $25x^3-100x^2=25x^2(x-4)\ne 0\Rightarrow x\ne 0$ y $x\ne 4$.`,
          hint: 'Sacá factor común 25x² en el denominador.',
          difficulty: 2,
          tags: ['pdf:examen-2013', 'pag-49']
        },
        {
          id: 'simulacros-4-q14',
          prompt: L`Examen 2013 · ¿Verdadero o Falso? «$|x|=5\Rightarrow x=5$»`,
          options: ['Falso: también cumple x = −5', 'Verdadero: el módulo siempre devuelve un único valor', 'Verdadero si x ∈ ℝ', 'Falso porque |5| = −5'],
          correct: 0,
          explanation: L`Falso. La ecuación $|x|=5$ tiene dos soluciones reales: $x=5$ y $x=-5$, porque $|-5|=5$.`,
          hint: 'Probá sustituir x = −5 en la ecuación |x| = 5.',
          difficulty: 1,
          tags: ['pdf:examen-2013', 'pag-49']
        },
        {
          id: 'simulacros-4-q15',
          prompt: L`Examen 2013 · Resolvé el sistema $\begin{cases}2x+y=1\\\frac{y+1}{x+3}=5\end{cases}$:`,
          options: [L`x=-\frac{13}{7},\ y=\frac{33}{7}`, L`x=\frac{13}{7},\ y=-\frac{19}{7}`, L`x=-2,\ y=5`, L`x=-\frac{14}{7},\ y=5`],
          correct: 0,
          explanation: L`De la primera, $y=1-2x$ (con $x\ne -3$). En la segunda: $(1-2x)+1=5(x+3)\Rightarrow 2-2x=5x+15\Rightarrow 7x=-13\Rightarrow x=-\frac{13}{7}$ y $y=1+\frac{26}{7}=\frac{33}{7}$.`,
          hint: 'Despejá y = 1 − 2x y reemplazalo en la segunda ecuación multiplicando por (x + 3).',
          difficulty: 3,
          tags: ['pdf:examen-2013', 'pag-49']
        }
      ],
      source: 'PDF p. 47-49'
    }
  ]
};
