import type { World } from '../types';

const L = String.raw;

export const trigonometria: World = {
  id: 'trigonometria',
  order: 3,
  name: 'Brújula',
  subtitle: 'Trigonometría',
  description:
    'Ángulos, radianes y razones trigonométricas. Del triángulo rectángulo al círculo unitario: la misma idea vista desde dos geometrías.',
  icon: 'compass',
  color: '#a78bfa',
  accent: 'rgba(167, 139, 250, 0.16)',
  lessons: [
    {
      id: 'trigono-angulos',
      worldId: 'trigonometria',
      title: 'Ángulos y sistemas de medida',
      tagline: 'Un ángulo es un barrido, no solo un dibujo.',
      minutes: 14,
      xp: 70,
      concepts: ['Ángulo plano', 'Recto', 'Llano', 'Vuelta', 'Sexagesimal', 'Complemento', 'Suplemento'],
      theory: [
        {
          heading: 'El ángulo como barrido',
          body: L`Un ángulo convexo es el conjunto de puntos barridos por una semirrecta que gira desde una posición inicial hasta una final, describiendo un arco menor o igual a una semicircunferencia. Si el arco supera la semicircunferencia, el ángulo es cóncavo.`
        },
        {
          heading: 'Los ángulos notables',
          body: L`Recto $=90^\circ$ (cuarta parte de una vuelta); llano $=180^\circ$ (media vuelta); de una vuelta $=360^\circ$; nulo $=0^\circ$. Estas medidas son el esqueleto de toda la trigonometría.`
        },
        {
          heading: 'Grados, minutos y segundos',
          body: L`Un grado se divide en 60 minutos y un minuto en 60 segundos: $1^\circ=60'$ y $1'=60''$. Dos ángulos son complementarios si suman $90^\circ$ y suplementarios si suman $180^\circ$.`
        }
      ],
      formulas: [
        L`\hat R=90^\circ\quad \hat L=180^\circ\quad \hat V=360^\circ`,
        L`1^\circ=60'\qquad 1'=60''`,
        L`\alpha+\beta=90^\circ\ \text{(complementarios)}`,
        L`\alpha+\beta=180^\circ\ \text{(suplementarios)}`
      ],
      lab: 'unitcircle',
      labConfig: { angle: 60, mode: 'degrees' },
      steps: [
        {
          title: 'Clasificá por el barrido',
          detail: L`Menos de $90^\circ$: agudo. Igual a $90^\circ$: recto. Entre $90^\circ$ y $180^\circ$: obtuso. Igual a $180^\circ$: llano.`
        },
        {
          title: 'Pasá a forma decimal si hace falta',
          detail: L`$30^\circ15'=30^\circ+\frac{15}{60}^\circ=30{,}25^\circ$.`
        },
        {
          title: 'Calculá complemento o suplemento',
          detail: L`Restá de $90^\circ$ o de $180^\circ$ según corresponda.`,
          latex: L`\text{compl}(35^\circ)=55^\circ`
        }
      ],
      questions: [
        {
          id: 'trigono-angulos-q1',
          prompt: L`El complemento de $35^\circ$ es:`,
          options: [L`55^\circ`, L`145^\circ`, L`65^\circ`, L`35^\circ`],
          correct: 0,
          explanation: L`Dos ángulos son complementarios si suman $90^\circ$. Entonces $90^\circ-35^\circ=55^\circ$.`,
          difficulty: 1
        },
        {
          id: 'trigono-angulos-q2',
          prompt: L`¿Cuántos segundos hay en $2^\circ$?`,
          options: [L`120''`, L`720''`, L`7200''`, L`3600''`],
          correct: 2,
          explanation: L`$2^\circ=2\cdot60'=120'$ y $120'=120\cdot60''=7200''$.`,
          difficulty: 2
        },
        {
          id: 'trigono-angulos-q3',
          prompt: L`Un ángulo de $120^\circ$ es:`,
          options: ['Agudo', 'Recto', 'Obtuso', 'Llano'],
          correct: 2,
          explanation: L`Está entre $90^\circ$ y $180^\circ$, por lo tanto es obtuso.`,
          difficulty: 1
        }
      ],
      source: 'PDF p. 17-20'
    },
    {
      id: 'trigono-radianes',
      worldId: 'trigonometria',
      title: 'El radián y el círculo unitario',
      tagline: 'Medir ángulos con longitudes de arco.',
      minutes: 14,
      xp: 70,
      concepts: ['Radián', 'Longitud de arco', 'Conversión', 'Círculo unitario'],
      theory: [
        {
          heading: 'Un radián es una geometría',
          body: L`Un ángulo central mide 1 radián cuando el arco que barre tiene la misma longitud que el radio. Como la circunferencia completa mide $2\pi r$, una vuelta equivale a $2\pi$ radianes.`
        },
        {
          heading: 'La conversión que resuelve todo',
          body: L`La equivalencia fundamental es $360^\circ=2\pi$ rad, o sea $180^\circ=\pi$ rad. Para convertir, multiplicá por $\frac{\pi}{180^\circ}$ o por $\frac{180^\circ}{\pi}$ según la dirección.`
        },
        {
          heading: 'El círculo unitario',
          body: L`Si el radio es $1$, el arco recorrido por un ángulo $\alpha$ mide exactamente $\alpha$ radianes. Por eso el círculo unitario es el puente natural entre ángulos, coordenadas y funciones trigonométricas.`
        }
      ],
      formulas: [
        L`1\ \text{rad}=\frac{180^\circ}{\pi}`,
        L`180^\circ=\pi\ \text{rad}`,
        L`360^\circ=2\pi\ \text{rad}`,
        L`s=r\alpha\quad(\alpha\ \text{en radianes})`
      ],
      lab: 'unitcircle',
      labConfig: { angle: 45, mode: 'radians' },
      steps: [
        {
          title: 'Partí de 180° = π',
          detail: L`Todas las conversiones salen de esa igualdad; no hace falta memorizar una tabla.`,
          latex: L`90^\circ=\frac{\pi}{2}\quad 45^\circ=\frac{\pi}{4}`
        },
        {
          title: 'Multiplicá por el factor de conversión',
          detail: L`De grados a radianes: $\alpha\cdot\frac{\pi}{180^\circ}$. De radianes a grados: $\alpha\cdot\frac{180^\circ}{\pi}$.`
        },
        {
          title: 'Verificá el orden de magnitud',
          detail: L`Un ángulo en radianes suele ser un número pequeño: $180^\circ\approx3{,}14$ rad. Si te dio $180$, revisá el factor.`
        }
      ],
      questions: [
        {
          id: 'trigono-radianes-q1',
          prompt: L`¿A cuántos radianes equivalen $90^\circ$?`,
          options: [L`\pi`, L`\frac{\pi}{2}`, L`2\pi`, L`\frac{\pi}{4}`],
          correct: 1,
          explanation: L`$90^\circ$ es la mitad de $180^\circ=\pi$, por lo tanto es $\frac{\pi}{2}$.`,
          difficulty: 1
        },
        {
          id: 'trigono-radianes-q2',
          prompt: L`El ángulo $\frac{5\pi}{3}$ rad equivale a:`,
          options: [L`150^\circ`, L`300^\circ`, L`240^\circ`, L`120^\circ`],
          correct: 1,
          explanation: L`$\frac{5\pi}{3}\cdot\frac{180^\circ}{\pi}=5\cdot60^\circ=300^\circ$.`,
          difficulty: 2
        },
        {
          id: 'trigono-radianes-q3',
          prompt: 'Una vuelta completa mide:',
          options: [L`\pi\ \text{rad}`, L`2\pi\ \text{rad}`, L`\frac{\pi}{2}\ \text{rad}`, L`360\pi\ \text{rad}`],
          correct: 1,
          explanation: L`La circunferencia completa mide $2\pi r$; con $r=1$ el arco es $2\pi$, así que la vuelta es $2\pi$ rad.`,
          difficulty: 1
        }
      ],
      source: 'PDF p. 20-21'
    },
    {
      id: 'trigono-razones',
      worldId: 'trigonometria',
      title: 'Seno, coseno y tangente',
      tagline: 'Las tres razones que conectan ángulos y lados.',
      minutes: 16,
      xp: 80,
      concepts: ['Cateto opuesto', 'Cateto adyacente', 'Hipotenusa', 'Seno', 'Coseno', 'Tangente', 'Inversas'],
      theory: [
        {
          heading: 'Nombrar antes de calcular',
          body: L`En un triángulo rectángulo, la hipotenusa es el lado opuesto al ángulo recto. Respecto de un ángulo agudo $\alpha$, el cateto opuesto es el que está enfrente y el adyacente el que lo toca. Sin identificar bien estos lados, ninguna razón funciona.`
        },
        {
          heading: 'Las definiciones',
          body: L`$\operatorname{sen}\alpha=\frac{\text{opuesto}}{\text{hipotenusa}}$, $\cos\alpha=\frac{\text{adyacente}}{\text{hipotenusa}}$ y $\tan\alpha=\frac{\text{opuesto}}{\text{adyacente}}$. Son cocientes, no longitudes: por eso no dependen del tamaño del triángulo.`
        },
        {
          heading: 'Volver del cociente al ángulo',
          body: L`Si conocés la razón y querés el ángulo, usás la función inversa: $\arcsin$, $\arccos$ o $\arctan$. En la calculadora aparecen como $\sin^{-1}$, $\cos^{-1}$ y $\tan^{-1}$.`
        }
      ],
      formulas: [
        L`\operatorname{sen}\alpha=\frac{CO}{H}`,
        L`\cos\alpha=\frac{CA}{H}`,
        L`\tan\alpha=\frac{CO}{CA}`,
        L`\alpha=\arctan\left(\frac{CO}{CA}\right)`
      ],
      lab: 'unitcircle',
      labConfig: { angle: 30, mode: 'triangle' },
      steps: [
        {
          title: 'Marcá el ángulo de referencia',
          detail: L`Todo depende de cuál ángulo agudo estás usando. Si cambiás de ángulo, cambian opuesto y adyacente.`
        },
        {
          title: 'Elegí la razón correcta',
          detail: L`Si conocés opuesto e hipotenusa, usá seno. Si conocés adyacente e hipotenusa, coseno. Si conocés ambos catetos, tangente.`
        },
        {
          title: 'Despejá el lado o el ángulo',
          detail: L`Las razones son ecuaciones: podés multiplicar o dividir para aislar la incógnita.`,
          latex: L`\operatorname{sen}30^\circ=\frac{x}{10}\Rightarrow x=5`
        }
      ],
      questions: [
        {
          id: 'trigono-razones-q1',
          prompt: L`En un triángulo rectángulo, $\operatorname{sen}\alpha=\frac{3}{5}$. ¿Cuánto vale el cateto opuesto si la hipotenusa mide 20?`,
          options: [L`12`, L`15`, L`8`, L`5`],
          correct: 0,
          explanation: L`$\frac{CO}{20}=\frac35$, entonces $CO=20\cdot\frac35=12$.`,
          difficulty: 2
        },
        {
          id: 'trigono-razones-q2',
          prompt: L`La tangente de un ángulo agudo es:`,
          options: [L`\frac{H}{CO}`, L`\frac{CA}{H}`, L`\frac{CO}{CA}`, L`\frac{CO}{H}`],
          correct: 2,
          explanation: L`La tangente relaciona los dos catetos: cateto opuesto sobre cateto adyacente.`,
          difficulty: 1
        },
        {
          id: 'trigono-razones-q3',
          prompt: L`Si $\cos\alpha=0{,}5$, entonces $\alpha$ mide:`,
          options: [L`30^\circ`, L`45^\circ`, L`60^\circ`, L`90^\circ`],
          correct: 2,
          explanation: L`$\cos60^\circ=0{,}5$. También podés usar $\arccos(0{,}5)=60^\circ$.`,
          difficulty: 1
        }
      ],
      source: 'PDF p. 21-23'
    },
    {
      id: 'trigono-identidad',
      worldId: 'trigonometria',
      title: 'Identidad pitagórica y aplicaciones',
      tagline: 'Una identidad que vale para todos los ángulos.',
      minutes: 16,
      xp: 80,
      concepts: ['Identidad pitagórica', 'Tangente', 'Triángulos rectángulos', 'Ángulos de elevación'],
      theory: [
        {
          heading: 'La identidad fundamental',
          body: L`En el círculo unitario, el punto correspondiente a un ángulo $\alpha$ tiene coordenadas $(\cos\alpha;\operatorname{sen}\alpha)$. Como está sobre la circunferencia $x^2+y^2=1$, se cumple $\operatorname{sen}^2\alpha+\cos^2\alpha=1$.`
        },
        {
          heading: 'La tangente como cociente',
          body: L`De las definiciones se deduce $\tan\alpha=\frac{\operatorname{sen}\alpha}{\cos\alpha}$ siempre que $\cos\alpha\ne0$. Esta relación permite pasar de una razón a otra sin construir el triángulo.`
        },
        {
          heading: 'Resolver un triángulo',
          body: L`Resolver un triángulo rectángulo es hallar todos sus lados y ángulos. Con un lado y un ángulo agudo, o con dos lados, las razones trigonométricas permiten completar el resto. En problemas reales, el ángulo de elevación se mide desde la horizontal.`
        }
      ],
      formulas: [
        L`\operatorname{sen}^2\alpha+\cos^2\alpha=1`,
        L`\tan\alpha=\frac{\operatorname{sen}\alpha}{\cos\alpha}`,
        L`h=d\cdot\tan\theta`,
        L`\alpha+\beta=90^\circ\ \text{en un triángulo rectángulo}`
      ],
      lab: 'unitcircle',
      labConfig: { angle: 35, mode: 'identity' },
      steps: [
        {
          title: 'Elegí la identidad que conecta los datos',
          detail: L`Si conocés el seno y querés el coseno, usá la identidad pitagórica. Si querés la tangente, dividí.`
        },
        {
          title: 'Quedate con el signo correcto',
          detail: L`En un triángulo rectángulo los ángulos agudos tienen seno y coseno positivos. La identidad da dos signos; el contexto elige.`
        },
        {
          title: 'Dibujá el triángulo del problema',
          detail: L`Identificá la horizontal, la vertical y el ángulo. La altura suele ser el cateto opuesto y la distancia horizontal el adyacente.`,
          latex: L`h=100\cdot\tan60^\circ\approx173{,}2`
        }
      ],
      questions: [
        {
          id: 'trigono-identidad-q1',
          prompt: L`Si $\operatorname{sen}\alpha=0{,}6$ y $\alpha$ es agudo, entonces $\cos\alpha$ vale:`,
          options: [L`0{,}4`, L`0{,}8`, L`0{,}6`, L`1{,}6`],
          correct: 1,
          explanation: L`$\cos^2\alpha=1-0{,}36=0{,}64$; como $\alpha$ es agudo, $\cos\alpha=0{,}8$.`,
          difficulty: 2
        },
        {
          id: 'trigono-identidad-q2',
          prompt: L`La identidad pitagórica afirma que:`,
          options: [L`\operatorname{sen}\alpha+\cos\alpha=1`, L`\operatorname{sen}^2\alpha+\cos^2\alpha=1`, L`\tan^2\alpha+1=0`, L`\operatorname{sen}^2\alpha-\cos^2\alpha=1`],
          correct: 1,
          explanation: L`Es la ecuación de la circunferencia unitaria aplicada al punto $(\cos\alpha;\operatorname{sen}\alpha)$.`,
          difficulty: 1
        },
        {
          id: 'trigono-identidad-q3',
          prompt: L`Un barrilete se sostiene con 100 m de hilo y el ángulo de elevación es $30^\circ$. ¿A qué altura está?`,
          options: [L`50 m`, L`86{,}6 m`, L`100 m`, L`30 m`],
          correct: 0,
          explanation: L`La altura es el cateto opuesto: $h=100\cdot\operatorname{sen}30^\circ=100\cdot0{,}5=50$ m.`,
          difficulty: 3
        }
      ],
      source: 'PDF p. 21-23'
    }
  ]
};
