/**
 * Modelo de contenido de Polymath Zero v2.
 * Todo el currículo está alineado al cursillo "Matemática · Ingreso Terciario 2027"
 * (Dpto. de Recursos Pedagógicos, POLITECNICO) y reorganizado en 8 mundos jugables.
 */

export type LabKind =
  | 'numberline'
  | 'balance'
  | 'unitcircle'
  | 'parabola'
  | 'tiles'
  | 'systems'
  | 'radicals'
  | 'laser3d';

export type WorldIcon =
  | 'orbit'
  | 'flame'
  | 'compass'
  | 'cube'
  | 'scale'
  | 'frontier'
  | 'nexus'
  | 'trophy';

export interface Question {
  id: string;
  prompt: string;
  options: string[];
  correct: number;
  explanation: string;
  hint?: string;
  difficulty: 1 | 2 | 3;
  tags?: string[];
}

export interface TheoryBlock {
  heading?: string;
  body: string;
  note?: string;
}

export interface GuidedStep {
  title: string;
  detail: string;
  latex?: string;
}

export interface Lesson {
  id: string;
  worldId: string;
  title: string;
  tagline: string;
  minutes: number;
  xp: number;
  concepts: string[];
  theory: TheoryBlock[];
  formulas: string[];
  lab: LabKind;
  labConfig?: Record<string, number | string | boolean>;
  steps: GuidedStep[];
  questions: Question[];
  source: string;
}

export interface World {
  id: string;
  order: number;
  name: string;
  subtitle: string;
  description: string;
  icon: WorldIcon;
  color: string;
  accent: string;
  lessons: Lesson[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  check: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
  xp: number;
  level: number;
  streak: number;
  completedLessons: number;
  correctAnswers: number;
  perfectQuizzes: number;
  completedWorlds: number;
  examPasses: number;
}

export type PlanDayType = 'lesson' | 'practice' | 'review' | 'exam' | 'rest';

export interface PlanDay {
  day: number;
  week: number;
  type: PlanDayType;
  title: string;
  lessonIds: string[];
  focus: string;
}
