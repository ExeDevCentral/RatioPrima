import React from 'react';
import type { Lesson } from '../../data/types';
import NumberLineLab from './NumberLineLab';
import BalanceLab from './BalanceLab';
import UnitCircleLab from './UnitCircleLab';
import ParabolaLab from './ParabolaLab';
import TilesLab from './TilesLab';
import SystemsLab from './SystemsLab';
import RadicalsLab from './RadicalsLab';
import Laser3DLab from './Laser3DLab';

export const LAB_META: Record<
  Lesson['lab'],
  { name: string; blurb: string; icon: 'orbit' | 'scale' | 'compass' | 'chart' | 'cube' | 'nexus' | 'flask' | 'laser' }
> = {
  numberline: {
    name: 'Recta real',
    blurb: 'Conjuntos, intervalos, módulo e inecuaciones sobre el eje.',
    icon: 'orbit'
  },
  balance: {
    name: 'Balanza algebraica',
    blurb: 'Resolvé ecuaciones manteniendo el equilibrio de los dos miembros.',
    icon: 'scale'
  },
  unitcircle: {
    name: 'Círculo unitario',
    blurb: 'Girá el radio láser y descubrí seno, coseno y tangente.',
    icon: 'compass'
  },
  parabola: {
    name: 'Parábola',
    blurb: 'Coeficientes, vértice, discriminante y raíces en vivo.',
    icon: 'chart'
  },
  tiles: {
    name: 'Tablero de áreas',
    blurb: 'Productos notables y factoreo como piezas geométricas.',
    icon: 'cube'
  },
  systems: {
    name: 'Sistemas',
    blurb: 'Dos rectas que se cruzan, se superponen o nunca se encuentran.',
    icon: 'nexus'
  },
  radicals: {
    name: 'Radicales',
    blurb: 'Potencia, raíz y exponente racional con descomposición visual.',
    icon: 'flask'
  },
  laser3d: {
    name: 'Superficie 3D',
    blurb: 'Un campo de haces láser que podés rotar con el mouse.',
    icon: 'laser'
  }
};

export default function LabRenderer({ lesson }: { lesson: Lesson }) {
  switch (lesson.lab) {
    case 'numberline':
      return <NumberLineLab lesson={lesson} />;
    case 'balance':
      return <BalanceLab lesson={lesson} />;
    case 'unitcircle':
      return <UnitCircleLab lesson={lesson} />;
    case 'parabola':
      return <ParabolaLab lesson={lesson} />;
    case 'tiles':
      return <TilesLab lesson={lesson} />;
    case 'systems':
      return <SystemsLab lesson={lesson} />;
    case 'radicals':
      return <RadicalsLab lesson={lesson} />;
    case 'laser3d':
      return <Laser3DLab lesson={lesson} />;
    default:
      return <NumberLineLab lesson={lesson} />;
  }
}
