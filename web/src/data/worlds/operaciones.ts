import type { World } from '../types';

const L = String.raw;

export const operaciones: World = {
  id: 'operaciones',
  order: 2,
  name: 'Forja',
  subtitle: 'Operaciones y raíces',
  description:
    'Las reglas del juego algebraico: propiedades del cuerpo real, potencias, radicales y racionalización. Sin memorizar: entendiendo por qué cada transformación es legal.',
  icon: 'flame',
  color: '#f59e0b',
  accent: 'rgba(245, 158, 11, 0.16)',
  lessons: [
    {
      id: 'operaciones-cuerpo',
      worldId: 'operaciones',
      title: 'Las propiedades del cuerpo real',
      tagline: 'Sumar y multiplicar no es magia: son reglas explícitas.',
      minutes: 15,
      xp: 70,
      concepts: ['Clausura', 'Conmutatividad', 'Asociatividad', 'Neutro', 'Opuesto', 'Recíproco', 'Distributiva'],
      theory: [
        {
          heading: 'Un cuerpo con dos operaciones',
          body: L`En $\mathbb{R}$ la suma y la multiplicación son cerradas, conmutativas y asociativas. Existen el neutro aditivo $0$ y el neutro multiplicativo $1$. Cada número tiene opuesto $-a$, y cada número no nulo tiene recíproco $1/a$.`
        },
        {
          heading: 'La distributiva conecta todo',
          body: L`La propiedad distributiva $a(b+c)=ab+ac$ es el puente entre suma y multiplicación. Leída de izquierda a derecha expande; leída de derecha a izquierda factoriza. Toda el álgebra escolar vive en esa doble lectura.`
        },
        {
          heading: 'Restar y dividir son atajos',
          body: L`La resta no es una operación nueva: $a-b=a+(-b)$. La división tampoco: $a:b=a\cdot\frac{1}{b}$ con $b\ne0$. Entenderlo evita errores como $(a+b)^2=a^2+b^2$.`
        }
      ],
      formulas: [
        L`a(b+c)=ab+ac`,
        L`a-b=a+(-b)`,
        L`a:b=a\cdot\frac{1}{b}\quad (b\ne0)`,
        L`-(-a)=a\qquad (-a)(-b)=ab`
      ],
      lab: 'balance',
      labConfig: { a: 2, b: 3, c: 11 },
      steps: [
        {
          title: 'Identificá la estructura',
          detail: L`¿Hay una suma multiplicada por algo? Aplicá distributiva. ¿Hay factores comunes? Extraelos.`,
          latex: L`3(x+2)=3x+6`
        },
        {
          title: 'Usá el opuesto para restar',
          detail: L`Restar $b$ es sumar $-b$. Así los signos se manejan con las reglas de la suma.`,
          latex: L`7-(-3)=7+3=10`
        },
        {
          title: 'Usá el recíproco para dividir',
          detail: L`Dividir por $b$ es multiplicar por $1/b$.`,
          latex: L`\frac{3}{4}:\frac{5}{2}=\frac{3}{4}\cdot\frac{2}{5}=\frac{3}{10}`
        }
      ],
      questions: [
        {
          id: 'operaciones-cuerpo-q1',
          prompt: L`¿Cuál igualdad es correcta?`,
          options: [L`(2+3)^2=2^2+3^2`, L`6+4:2=(6+4):2`, L`a(b+c)=ab+ac`, L`-(-a)=-a`],
          correct: 2,
          explanation: L`La distributiva es válida siempre. Las otras tres son errores clásicos: el cuadrado no se distribuye sobre la suma, la división no se distribuye así y el opuesto del opuesto devuelve el número original.`,
          difficulty: 1
        },
        {
          id: 'operaciones-cuerpo-q2',
          prompt: L`El recíproco de $-3$ es:`,
          options: [L`3`, L`-\frac{1}{3}`, L`\frac{1}{3}`, L`-3`],
          correct: 1,
          explanation: L`El recíproco de $a\ne0$ es $1/a$. Para $-3$: $\frac{1}{-3}=-\frac{1}{3}$. El opuesto, en cambio, es $3$.`,
          difficulty: 1
        },
        {
          id: 'operaciones-cuerpo-q3',
          prompt: L`Si $ab=0$, ¿qué se puede asegurar?`,
          options: [L`a=0 y b=0`, L`a=0 o b=0`, L`a+b=0`, L`Nada`],
          correct: 1,
          explanation: L`En un cuerpo no hay divisores de cero: si el producto es cero, al menos uno de los factores es cero. Esta es la base de la condición de anulación del producto.`,
          difficulty: 2
        }
      ],
      source: 'PDF p. 19-20'
    },
    {
      id: 'operaciones-potencias',
      worldId: 'operaciones',
      title: 'Potencias con exponente entero',
      tagline: 'Multiplicar muchas veces, y luego deshacerlo.',
      minutes: 15,
      xp: 70,
      concepts: ['Base', 'Exponente', 'Exponente negativo', 'Propiedades'],
      theory: [
        {
          heading: 'La definición manda',
          body: L`$a^n$ es el producto de $n$ factores iguales a $a$. Para que la notación sea coherente se define $a^0=1$ (con $a\ne0$) y $a^{-n}=1/a^n$. El exponente negativo no hace negativo al número: lo invierte.`
        },
        {
          heading: 'Las tres propiedades clave',
          body: L`Producto de igual base: $a^n a^m=a^{n+m}$. Cociente: $a^n/a^m=a^{n-m}$. Potencia de potencia: $(a^n)^m=a^{nm}$. Todas se deducen contando factores, no memorizando.`
        },
        {
          heading: 'Cuidado con la base negativa',
          body: L`$(-2)^4=16$ porque el exponente par cancela los signos; $(-2)^3=-8$ porque queda un signo negativo. Los paréntesis son obligatorios: $-2^4=-(2^4)=-16$.`
        }
      ],
      formulas: [
        L`a^n\cdot a^m=a^{n+m}`,
        L`\frac{a^n}{a^m}=a^{n-m}`,
        L`(a^n)^m=a^{nm}`,
        L`a^{-n}=\frac{1}{a^n}\quad(a\ne0)`
      ],
      lab: 'radicals',
      labConfig: { mode: 'power', base: 2, exponent: 3 },
      steps: [
        {
          title: 'Contá los factores',
          detail: L`$2^5$ significa $2\cdot2\cdot2\cdot2\cdot2$. La base es el factor; el exponente, la cantidad de veces.`,
          latex: L`2^5=32`
        },
        {
          title: 'Sumá exponentes al multiplicar',
          detail: L`Al multiplicar potencias de igual base, los exponentes se suman porque estás juntando factores.`,
          latex: L`h^{10}\cdot h^{12}=h^{22}`
        },
        {
          title: 'Invertí si el exponente es negativo',
          detail: L`$a^{-n}=1/a^n$. Luego aplicá las demás propiedades.`,
          latex: L`\left(\frac{5}{3}\right)^{-3}=\left(\frac{3}{5}\right)^3=\frac{27}{125}`
        }
      ],
      questions: [
        {
          id: 'operaciones-potencias-q1',
          prompt: L`Simplificá $h^{10}\cdot h^{12}\cdot h^{-20}$:`,
          options: [L`h^2`, L`h^{42}`, L`h^{-2}`, L`h^{22}`],
          correct: 0,
          explanation: L`Sumamos los exponentes: $10+12-20=2$. Por lo tanto el resultado es $h^2$.`,
          difficulty: 1
        },
        {
          id: 'operaciones-potencias-q2',
          prompt: L`El valor de $(-3)^2$ es:`,
          options: [L`-9`, L`9`, L`-6`, L`6`],
          correct: 1,
          explanation: L`$(-3)^2=(-3)(-3)=9$. El exponente par elimina el signo negativo.`,
          difficulty: 1
        },
        {
          id: 'operaciones-potencias-q3',
          prompt: L`¿Cuál expresión equivale a $\left(\frac{2}{5}\right)^{-2}$?`,
          options: [L`\frac{4}{25}`, L`\frac{25}{4}`, L`-\frac{4}{25}`, L`\frac{5}{2}`],
          correct: 1,
          explanation: L`$\left(\frac{2}{5}\right)^{-2}=\left(\frac{5}{2}\right)^2=\frac{25}{4}$. El exponente negativo invierte la fracción.`,
          difficulty: 2
        }
      ],
      source: 'PDF p. 21-22'
    },
    {
      id: 'operaciones-radicales',
      worldId: 'operaciones',
      title: 'Radicales y racionalización',
      tagline: 'La raíz como operación inversa de la potencia.',
      minutes: 16,
      xp: 80,
      concepts: ['Radicando', 'Índice', 'Radical aritmético', 'Extracción de factores', 'Racionalización'],
      theory: [
        {
          heading: 'Definición con condiciones',
          body: L`$\sqrt[n]{a}=b$ significa $b^n=a$, con $n\in\mathbb{N}$, $n>1$. Si $n$ es par, hace falta $a\ge0$; si $n$ es impar, cualquier real tiene raíz. Por convención, cuando el índice es par se toma solo la raíz positiva: el radical aritmético.`
        },
        {
          heading: 'Extraer factores',
          body: L`Para extraer factores de $\sqrt[n]{a}$ se factoriza el radicando y se agrupan potencias múltiplos de $n$. Por ejemplo $\sqrt{108}=\sqrt{2^2\cdot3^3}=6\sqrt{3}$.`
        },
        {
          heading: 'Racionalizar es cambiar la forma, no el valor',
          body: L`Racionalizar un denominador significa quitar las raíces del denominador multiplicando por una expresión conveniente. En el caso de un binomio se usa el conjugado: $(a+b)(a-b)=a^2-b^2$.`
        }
      ],
      formulas: [
        L`\sqrt[n]{a}=b\iff b^n=a`,
        L`\sqrt[n]{a\cdot b}=\sqrt[n]{a}\cdot\sqrt[n]{b}`,
        L`\frac{a}{\sqrt{b}}=\frac{a\sqrt{b}}{b}`,
        L`\frac{1}{\sqrt{a}+\sqrt{b}}=\frac{\sqrt{a}-\sqrt{b}}{a-b}`
      ],
      lab: 'radicals',
      labConfig: { mode: 'root', value: 108 },
      steps: [
        {
          title: 'Verificá el dominio',
          detail: L`Si el índice es par, el radicando debe ser no negativo. Si es impar, no hay restricción.`,
          latex: L`\sqrt{-9}\notin\mathbb{R}\qquad \sqrt[3]{-27}=-3`
        },
        {
          title: 'Factorizá el radicando',
          detail: L`Escribí el número como producto de potencias primas para detectar qué factores salen.`,
          latex: L`108=2^2\cdot3^3`
        },
        {
          title: 'Racionalizá con el conjugado',
          detail: L`Si el denominador es $\sqrt{a}+\sqrt{b}$, multiplicá arriba y abajo por $\sqrt{a}-\sqrt{b}$.`,
          latex: L`\frac{6}{\sqrt5+1}=\frac{6(\sqrt5-1)}{4}=\frac{3(\sqrt5-1)}{2}`
        }
      ],
      questions: [
        {
          id: 'operaciones-radicales-q1',
          prompt: L`La expresión $\sqrt{108}$ equivale a:`,
          options: [L`6\sqrt{3}`, L`3\sqrt{6}`, L`9\sqrt{2}`, L`12\sqrt{3}`],
          correct: 0,
          explanation: L`$108=4\cdot27=4\cdot9\cdot3$, entonces $\sqrt{108}=2\cdot3\sqrt3=6\sqrt3$.`,
          difficulty: 2
        },
        {
          id: 'operaciones-radicales-q2',
          prompt: L`¿Para qué valores reales existe $\sqrt{x-4}$?`,
          options: [L`x>4`, L`x\ge4`, L`x\le4`, L`Todo x`],
          correct: 1,
          explanation: L`El índice es par, así que el radicando debe ser no negativo: $x-4\ge0$, es decir $x\ge4$.`,
          difficulty: 1
        },
        {
          id: 'operaciones-radicales-q3',
          prompt: L`Al racionalizar $\frac{3}{\sqrt5}$ se obtiene:`,
          options: [L`\frac{3\sqrt5}{5}`, L`\frac{\sqrt5}{3}`, L`3\sqrt5`, L`\frac{5}{3\sqrt5}`],
          correct: 0,
          explanation: L`Multiplicamos por $\frac{\sqrt5}{\sqrt5}$: $\frac{3\sqrt5}{5}$. El valor no cambia, solo la forma.`,
          difficulty: 1
        }
      ],
      source: 'PDF p. 22-26'
    },
    {
      id: 'operaciones-exponente-racional',
      worldId: 'operaciones',
      title: 'Exponentes racionales',
      tagline: 'Una raíz es una potencia disfrazada.',
      minutes: 13,
      xp: 70,
      concepts: ['Exponente fraccionario', 'Raíz enésima', 'Simplificación', 'Propiedades'],
      theory: [
        {
          heading: 'La definición que une dos mundos',
          body: L`Se define $a^{m/n}=\sqrt[n]{a^m}$ con $n>1$, $m\in\mathbb{Z}$ y $a\ne0$ cuando corresponda. Así $\sqrt[3]{a^2}=a^{2/3}$. Las raíces y las potencias dejan de ser temas separados.`
        },
        {
          heading: 'Todas las propiedades siguen valiendo',
          body: L`Los exponentes racionales heredan las reglas de los enteros: se suman al multiplicar, se restan al dividir y se multiplican en la potencia de potencia. Eso permite simplificar expresiones enormes en dos líneas.`
        },
        {
          heading: 'El dominio no se olvida',
          body: L`Al convertir una raíz par en exponente fraccionario hay que conservar la restricción del radicando. La notación no elimina las condiciones de existencia.`
        }
      ],
      formulas: [
        L`a^{m/n}=\sqrt[n]{a^m}`,
        L`\sqrt[n]{a^m}=a^{m/n}`,
        L`a^{m/n}\cdot a^{p/q}=a^{m/n+p/q}`,
        L`\left(a^{m/n}\right)^{p/q}=a^{mp/nq}`
      ],
      lab: 'radicals',
      labConfig: { mode: 'rational', value: 16, exponent: 3, index: 4 },
      steps: [
        {
          title: 'Pasá de raíz a exponente',
          detail: L`El índice va al denominador y el exponente del radicando al numerador.`,
          latex: L`\sqrt[4]{x^3}=x^{3/4}`
        },
        {
          title: 'Operá con las reglas de potencias',
          detail: L`Sumá o restá exponentes según corresponda, sin cambiar la base.`,
          latex: L`a^{1/2}\cdot a^{1/3}=a^{5/6}`
        },
        {
          title: 'Volvé a la forma radical si hace falta',
          detail: L`El resultado puede escribirse como raíz, pero la forma exponencial suele ser más compacta.`,
          latex: L`a^{5/6}=\sqrt[6]{a^5}`
        }
      ],
      questions: [
        {
          id: 'operaciones-exponente-q1',
          prompt: L`La expresión $\sqrt[4]{x^3}$ equivale a:`,
          options: [L`x^{4/3}`, L`x^{3/4}`, L`x^{12}`, L`x^{1/12}`],
          correct: 1,
          explanation: L`El exponente del radicando va al numerador y el índice al denominador: $x^{3/4}$.`,
          difficulty: 1
        },
        {
          id: 'operaciones-exponente-q2',
          prompt: L`Simplificá $a^{1/2}\cdot a^{1/3}$:`,
          options: [L`a^{1/6}`, L`a^{2/5}`, L`a^{5/6}`, L`a^{1/5}`],
          correct: 2,
          explanation: L`Al multiplicar potencias de igual base se suman los exponentes: $\frac12+\frac13=\frac56$.`,
          difficulty: 2
        },
        {
          id: 'operaciones-exponente-q3',
          prompt: L`¿Cuál expresión NO está definida en $\mathbb{R}$?`,
          options: [L`(-8)^{1/3}`, L`16^{1/4}`, L`(-16)^{1/4}`, L`27^{2/3}`],
          correct: 2,
          explanation: L`$(-16)^{1/4}=\sqrt[4]{-16}$ tiene índice par y radicando negativo: no existe raíz real.`,
          difficulty: 3
        }
      ],
      source: 'PDF p. 26-27'
    }
  ]
};
