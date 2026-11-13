import type { World } from '../types';

const L = String.raw;

export const algebra: World = {
  id: 'algebra',
  order: 4,
  name: 'Taller',
  subtitle: 'Álgebra y factoreo',
  description:
    'El arte de transformar expresiones sin cambiar su valor. Productos especiales, factor común, trinomios y cubos: las herramientas que simplifican todo lo que viene.',
  icon: 'cube',
  color: '#34d399',
  accent: 'rgba(52, 211, 153, 0.16)',
  lessons: [
    {
      id: 'algebra-expresiones',
      worldId: 'algebra',
      title: 'Lenguaje algebraico y valor numérico',
      tagline: 'Una letra es un número que todavía no elegimos.',
      minutes: 13,
      xp: 70,
      concepts: ['Variable', 'Expresión algebraica', 'Valor numérico', 'Distributiva'],
      theory: [
        {
          heading: 'Traducir antes de operar',
          body: L`Una expresión algebraica combina números, letras y operaciones. La letra es una variable: representa cualquier número de un conjunto. "El opuesto de un número más tres cuartos del mismo" se traduce como $-x+\frac34x$.`
        },
        {
          heading: 'El valor numérico depende de la variable',
          body: L`Evaluar es reemplazar la variable por un número y operar. Para $x=-1$, la expresión $-x+\frac34x$ vale $1-\frac34=\frac14$. Distintos valores de $x$ dan distintos resultados.`
        },
        {
          heading: 'Simplificar es reducir, no inventar',
          body: L`Solo se pueden sumar términos semejantes: misma parte literal y mismos exponentes. $3x^2$ y $5x$ no son semejantes; $3x^2$ y $-5x^2$ sí. La distributiva permite expandir y agrupar.`
        }
      ],
      formulas: [
        L`a(b+c)=ab+ac`,
        L`3x+5x=8x`,
        L`3x^2\ \text{y}\ 5x\ \text{no son semejantes}`,
        L`\text{Valor numérico: reemplazar }x\text{ y operar}`
      ],
      lab: 'tiles',
      labConfig: { a: 3, b: 1, mode: 'distribute' },
      steps: [
        {
          title: 'Traducí el enunciado',
          detail: L`"El doble de un número más cinco" es $2x+5$. "El cuadrado de la suma" es $(x+5)^2$, no $x^2+25$.`
        },
        {
          title: 'Reemplazá y calculá',
          detail: L`Siempre entre paréntesis al reemplazar valores negativos: si $x=-2$, entonces $x^2=(-2)^2=4$.`
        },
        {
          title: 'Agrupá términos semejantes',
          detail: L`Sumá solo los coeficientes de la misma parte literal.`,
          latex: L`4x^2-3x+2x^2+x=6x^2-2x`
        }
      ],
      questions: [
        {
          id: 'algebra-expresiones-q1',
          prompt: L`El valor numérico de $2x^2-3x+1$ para $x=-2$ es:`,
          options: [L`3`, L`15`, L`-1`, L`9`],
          correct: 1,
          explanation: L`$2(-2)^2-3(-2)+1=2\cdot4+6+1=15$.`,
          difficulty: 2
        },
        {
          id: 'algebra-expresiones-q2',
          prompt: L`¿Cuál par de términos son semejantes?`,
          options: [L`3x^2\ \text{y}\ 5x`, L`-2xy\ \text{y}\ 7xy`, L`x^3\ \text{y}\ x^2`, L`4a\ \text{y}\ 4b`],
          correct: 1,
          explanation: L`Tienen la misma parte literal $xy$ con los mismos exponentes. Solo cambia el coeficiente.`,
          difficulty: 1
        },
        {
          id: 'algebra-expresiones-q3',
          prompt: L`La expresión "el cuadrado de la suma de un número y 5" es:`,
          options: [L`x^2+5`, L`(x+5)^2`, L`x^2+25`, L`2x+5`],
          correct: 1,
          explanation: L`Primero se suma y después se eleva: $(x+5)^2$. Escribir $x^2+25$ es un error de jerarquía.`,
          difficulty: 1
        }
      ],
      source: 'PDF p. 24-25'
    },
    {
      id: 'algebra-productos',
      worldId: 'algebra',
      title: 'Productos especiales',
      tagline: 'Reconocer un patrón ahorra diez multiplicaciones.',
      minutes: 16,
      xp: 80,
      concepts: ['Cuadrado de binomio', 'Cubo de binomio', 'Suma por diferencia', 'Trinomio cuadrado perfecto'],
      theory: [
        {
          heading: 'El cuadrado de un binomio',
          body: L`$(a+b)^2=(a+b)(a+b)=a^2+2ab+b^2$. El término $2ab$ es el doble producto, la pieza que casi todos olvidan. Si el binomio es una resta, el doble producto es negativo: $(a-b)^2=a^2-2ab+b^2$.`
        },
        {
          heading: 'El cubo de un binomio',
          body: L`$(a+b)^3=a^3+3a^2b+3ab^2+b^3$. Los coeficientes $1,3,3,1$ no son casualidad: son los coeficientes binomiales. Multiplicando $(a+b)^2$ por $(a+b)$ se obtiene el patrón.`
        },
        {
          heading: 'Suma por diferencia',
          body: L`$(a+b)(a-b)=a^2-b^2$. Los términos cruzados se cancelan. Es la identidad que permite racionalizar denominadores y factorizar diferencias de cuadrados.`
        }
      ],
      formulas: [
        L`(a+b)^2=a^2+2ab+b^2`,
        L`(a-b)^2=a^2-2ab+b^2`,
        L`(a+b)^3=a^3+3a^2b+3ab^2+b^3`,
        L`(a+b)(a-b)=a^2-b^2`
      ],
      lab: 'tiles',
      labConfig: { a: 3, b: 2, mode: 'square' },
      steps: [
        {
          title: 'Identificá a y b',
          detail: L`En $(2x+3)^2$, $a=2x$ y $b=3$. No pierdas el coeficiente: el cuadrado de $2x$ es $4x^2$.`,
          latex: L`(2x+3)^2=4x^2+12x+9`
        },
        {
          title: 'Aplicá el patrón completo',
          detail: L`Cuadrado del primero, doble producto, cuadrado del segundo. Siempre los tres términos.`
        },
        {
          title: 'Verificá el signo del doble producto',
          detail: L`Si hay resta, el término central es negativo.`,
          latex: L`(x-4)^2=x^2-8x+16`
        }
      ],
      questions: [
        {
          id: 'algebra-productos-q1',
          prompt: L`Desarrollá $(x+3)^2$:`,
          options: [L`x^2+9`, L`x^2+6x+9`, L`x^2+3x+9`, L`x^2+6x+3`],
          correct: 1,
          explanation: L`$x^2+2\cdot x\cdot3+3^2=x^2+6x+9$.`,
          difficulty: 1
        },
        {
          id: 'algebra-productos-q2',
          prompt: L`El producto $(2x-y)(2x+y)$ es:`,
          options: [L`4x^2-y^2`, L`4x^2+y^2`, L`2x^2-y^2`, L`4x^2-4xy+y^2`],
          correct: 0,
          explanation: L`Es suma por diferencia: $(2x)^2-y^2=4x^2-y^2$.`,
          difficulty: 1
        },
        {
          id: 'algebra-productos-q3',
          prompt: L`¿Cuál es el término central de $(3a-2b)^2$?`,
          options: [L`6ab`, L`-12ab`, L`12ab`, L`-6ab`],
          correct: 1,
          explanation: L`El doble producto es $2\cdot3a\cdot(-2b)=-12ab$. El signo negativo viene del binomio resta.`,
          difficulty: 2
        }
      ],
      source: 'PDF p. 25-26'
    },
    {
      id: 'algebra-factor-comun',
      worldId: 'algebra',
      title: 'Factor común y por grupos',
      tagline: 'Factorizar es leer una suma como multiplicación.',
      minutes: 15,
      xp: 75,
      concepts: ['Factor común', 'Factor común por grupos', 'Extracción', 'Verificación'],
      theory: [
        {
          heading: 'La distributiva al revés',
          body: L`Factorizar es transformar una suma en producto. El caso más simple es el factor común: si todos los términos comparten un factor, se lo extrae. $a^2b+a^2+a^3=a^2(b+1+a)$.`
        },
        {
          heading: 'Siempre verificá multiplicando',
          body: L`Factorizar es una operación reversible: si distribuís el resultado, tenés que recuperar la expresión original. Esa verificación detecta casi todos los errores.`
        },
        {
          heading: 'Cuando no hay factor común global',
          body: L`Se agrupan los términos de a pares para que aparezca un factor común en cada grupo. Por ejemplo $x^2+2xy+x+2y=x(x+1)+2y(x+1)=(x+1)(x+2y)$.`
        }
      ],
      formulas: [
        L`ab+ac=a(b+c)`,
        L`a^2b+a^2+a^3=a^2(b+1+a)`,
        L`x^2+2xy+x+2y=(x+1)(x+2y)`,
        L`\text{Verificación: distribuir el resultado}`
      ],
      lab: 'tiles',
      labConfig: { a: 4, b: 2, mode: 'factor' },
      steps: [
        {
          title: 'Buscá el máximo factor común',
          detail: L`Extraé el mayor coeficiente y la menor potencia de cada variable presente en todos los términos.`
        },
        {
          title: 'Dividí cada término por el factor',
          detail: L`Lo que queda entre paréntesis es el cociente de cada término por el factor común.`,
          latex: L`6a^3b^2-4a^2c=2a^2(3ab^2-2c)`
        },
        {
          title: 'Agrupá si es necesario',
          detail: L`Si no hay factor común global, agrupá de a pares y buscá un paréntesis repetido.`
        }
      ],
      questions: [
        {
          id: 'algebra-factor-q1',
          prompt: L`Factorizá $6a^3b^2-4a^2c$:`,
          options: [L`2a^2(3ab^2-2c)`, L`2a^3(3b^2-2c)`, L`2a^2(3ab^2-2ac)`, L`6a^2(ab^2-4c)`],
          correct: 0,
          explanation: L`El máximo factor común es $2a^2$. Al dividir cada término: $3ab^2$ y $-2c$.`,
          difficulty: 2
        },
        {
          id: 'algebra-factor-q2',
          prompt: L`Factorizá $x^2+2xy+x+2y$:`,
          options: [L`(x+2)(y+1)`, L`(x+1)(x+2y)`, L`(x+y)(x+2)`, L`(x+2y)(x+2)`],
          correct: 1,
          explanation: L`Agrupando: $x(x+1)+2y(x+1)=(x+1)(x+2y)$.`,
          difficulty: 3
        },
        {
          id: 'algebra-factor-q3',
          prompt: L`El factor común de $25h^3m^2-10h^5m^3y$ es:`,
          options: [L`5h^3m^2`, L`5h^5m^3`, L`10h^3m^2`, L`5h^2m^2`],
          correct: 0,
          explanation: L`El coeficiente común es 5 y las menores potencias son $h^3m^2$. Queda $5h^3m^2(5-2h^2my)$.`,
          difficulty: 2
        }
      ],
      source: 'PDF p. 27'
    },
    {
      id: 'algebra-factoreo',
      worldId: 'algebra',
      title: 'Trinomios, cubos y factoreo combinado',
      tagline: 'Reconocer la forma antes de elegir el método.',
      minutes: 18,
      xp: 90,
      concepts: ['Trinomio cuadrado perfecto', 'Cuatrinomio cubo perfecto', 'Diferencia de cuadrados', 'Factoreo combinado'],
      theory: [
        {
          heading: 'Trinomio cuadrado perfecto',
          body: L`Un trinomio es cuadrado perfecto si dos de sus términos son cuadrados y el restante es el doble producto de sus raíces. Así $x^2+8x+16=(x+4)^2$ porque $8x=2\cdot x\cdot4$.`
        },
        {
          heading: 'Cuatrinomio cubo perfecto',
          body: L`$a^3+3a^2b+3ab^2+b^3=(a+b)^3$. Se reconocen los dos cubos y los dos triples productos. Por ejemplo $x^3+6x^2+12x+8=(x+2)^3$.`
        },
        {
          heading: 'Diferencia de cuadrados y combinación',
          body: L`$a^2-b^2=(a-b)(a+b)$. En un factoreo combinado se aplican varios casos en cadena: primero factor común, después diferencia de cuadrados, después trinomio. Siempre hasta que ningún factor se pueda seguir factorizando.`
        }
      ],
      formulas: [
        L`a^2+2ab+b^2=(a+b)^2`,
        L`a^2-2ab+b^2=(a-b)^2`,
        L`a^3+3a^2b+3ab^2+b^3=(a+b)^3`,
        L`a^2-b^2=(a-b)(a+b)`
      ],
      lab: 'tiles',
      labConfig: { a: 3, b: 2, mode: 'combined' },
      steps: [
        {
          title: 'Contá los términos',
          detail: '3 términos → trinomio (TCP o no). 4 términos → cuatrinomio (cubo perfecto o grupos). 2 términos → diferencia de cuadrados o suma/diferencia de cubos.'
        },
        {
          title: 'Buscá cuadrados o cubos reconocibles',
          detail: L`Preguntate: ¿$x^2$ y $16$ son cuadrados? ¿$x^3$ y $8$ son cubos? Usá sus raíces para armar el binomio.`
        },
        {
          title: 'Encadená casos hasta el final',
          detail: L`$2x^4-162y^4=2(x^4-81y^4)=2(x^2-9y^2)(x^2+9y^2)=2(x-3y)(x+3y)(x^2+9y^2)$.`,
          latex: L`2x^4-162y^4=2(x-3y)(x+3y)(x^2+9y^2)`
        }
      ],
      questions: [
        {
          id: 'algebra-factoreo-q1',
          prompt: L`El trinomio $x^2+8x+16$ se factoriza como:`,
          options: [L`(x+8)^2`, L`(x+4)^2`, L`(x-4)^2`, L`(x+4)(x-4)`],
          correct: 1,
          explanation: L`$x^2$ y $16$ son cuadrados de $x$ y $4$; el término central es $2\cdot x\cdot4=8x$. Por eso es $(x+4)^2$.`,
          difficulty: 1
        },
        {
          id: 'algebra-factoreo-q2',
          prompt: L`Factorizá $4x^2-9$:`,
          options: [L`(2x-3)^2`, L`(2x-3)(2x+3)`, L`(4x-3)(x+3)`, L`(2x-9)(2x+1)`],
          correct: 1,
          explanation: L`Es diferencia de cuadrados: $(2x)^2-3^2=(2x-3)(2x+3)$.`,
          difficulty: 1
        },
        {
          id: 'algebra-factoreo-q3',
          prompt: L`El cuatrinomio $x^3+6x^2+12x+8$ es:`,
          options: [L`(x+2)^3`, L`(x+4)^3`, L`(x+2)(x^2+4)`, L`(x-2)^3`],
          correct: 0,
          explanation: L`Los cubos son $x^3$ y $8=2^3$; los triples productos son $3x^2\cdot2=6x^2$ y $3x\cdot2^2=12x$. Por eso $(x+2)^3$.`,
          difficulty: 3
        }
      ],
      source: 'PDF p. 27-30'
    }
  ]
};
