import type { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    name: 'Primer pulso',
    description: 'Completá tu primera lección.',
    icon: 'spark',
    xp: 25,
    check: (s) => s.completedLessons >= 1
  },
  {
    id: 'explorer',
    name: 'Explorador',
    description: 'Completá 5 lecciones.',
    icon: 'compass',
    xp: 50,
    check: (s) => s.completedLessons >= 5
  },
  {
    id: 'half-way',
    name: 'Media travesía',
    description: 'Completá 16 lecciones.',
    icon: 'route',
    xp: 120,
    check: (s) => s.completedLessons >= 16
  },
  {
    id: 'graduate',
    name: 'Polímata',
    description: 'Completá las 32 lecciones.',
    icon: 'trophy',
    xp: 400,
    check: (s) => s.completedLessons >= 32
  },
  {
    id: 'streak-3',
    name: 'Chispa',
    description: 'Mantené una racha de 3 días.',
    icon: 'flame',
    xp: 40,
    check: (s) => s.streak >= 3
  },
  {
    id: 'streak-7',
    name: 'Semana de fuego',
    description: 'Mantené una racha de 7 días.',
    icon: 'flame',
    xp: 100,
    check: (s) => s.streak >= 7
  },
  {
    id: 'streak-14',
    name: 'Constancia láser',
    description: 'Mantené una racha de 14 días.',
    icon: 'laser',
    xp: 200,
    check: (s) => s.streak >= 14
  },
  {
    id: 'correct-10',
    name: 'Precisión inicial',
    description: 'Acertá 10 preguntas.',
    icon: 'target',
    xp: 30,
    check: (s) => s.correctAnswers >= 10
  },
  {
    id: 'correct-50',
    name: 'Francotirador',
    description: 'Acertá 50 preguntas.',
    icon: 'target',
    xp: 120,
    check: (s) => s.correctAnswers >= 50
  },
  {
    id: 'correct-100',
    name: 'Cerebro en órbita',
    description: 'Acertá 100 preguntas.',
    icon: 'brain',
    xp: 250,
    check: (s) => s.correctAnswers >= 100
  },
  {
    id: 'perfect-1',
    name: 'Sin fallas',
    description: 'Completá una práctica con 100% de acierto.',
    icon: 'star',
    xp: 60,
    check: (s) => s.perfectQuizzes >= 1
  },
  {
    id: 'perfect-5',
    name: 'Impecable',
    description: 'Completá 5 prácticas perfectas.',
    icon: 'star',
    xp: 180,
    check: (s) => s.perfectQuizzes >= 5
  },
  {
    id: 'world-1',
    name: 'Conquistador',
    description: 'Completá un mundo entero.',
    icon: 'flag',
    xp: 100,
    check: (s) => s.completedWorlds >= 1
  },
  {
    id: 'world-4',
    name: 'Cartógrafo',
    description: 'Completá 4 mundos.',
    icon: 'map',
    xp: 200,
    check: (s) => s.completedWorlds >= 4
  },
  {
    id: 'world-8',
    name: 'Dueño del mapa',
    description: 'Completá los 8 mundos.',
    icon: 'crown',
    xp: 500,
    check: (s) => s.completedWorlds >= 8
  },
  {
    id: 'exam-1',
    name: 'Aprobado',
    description: 'Aprobá un simulacro de examen.',
    icon: 'seal',
    xp: 150,
    check: (s) => s.examPasses >= 1
  },
  {
    id: 'level-5',
    name: 'Ingeniero junior',
    description: 'Alcanzá el nivel 5.',
    icon: 'bolt',
    xp: 150,
    check: (s) => s.level >= 5
  },
  {
    id: 'level-10',
    name: 'Mente maestra',
    description: 'Alcanzá el nivel 10.',
    icon: 'bolt',
    xp: 400,
    check: (s) => s.level >= 10
  }
];

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
