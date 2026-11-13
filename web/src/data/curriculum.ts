import type { Lesson, Question, World } from './types';
import { reales } from './worlds/reales.ts';
import { operaciones } from './worlds/operaciones.ts';
import { trigonometria } from './worlds/trigonometria.ts';
import { algebra } from './worlds/algebra.ts';
import { ecuaciones } from './worlds/ecuaciones.ts';
import { inecuaciones } from './worlds/inecuaciones.ts';
import { sistemas } from './worlds/sistemas.ts';
import { simulacros } from './worlds/simulacros.ts';

export const WORLDS: World[] = [
  reales,
  operaciones,
  trigonometria,
  algebra,
  ecuaciones,
  inecuaciones,
  sistemas,
  simulacros
];

export const ALL_LESSONS: Lesson[] = WORLDS.flatMap((world) => world.lessons);

export const ALL_QUESTIONS: Question[] = ALL_LESSONS.flatMap((lesson) => lesson.questions);

export const CONTENT_LESSONS: Lesson[] = ALL_LESSONS.filter(
  (lesson) => lesson.worldId !== 'simulacros'
);

export const TOTAL_XP_AVAILABLE = ALL_LESSONS.reduce((sum, lesson) => sum + lesson.xp, 0);

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((lesson) => lesson.id === id);
}

export function getWorld(id: string): World | undefined {
  return WORLDS.find((world) => world.id === id);
}

export function getWorldOfLesson(id: string): World | undefined {
  return WORLDS.find((world) => world.lessons.some((lesson) => lesson.id === id));
}

export function getQuestionsForWorld(worldId: string): Question[] {
  const world = getWorld(worldId);
  return world ? world.lessons.flatMap((lesson) => lesson.questions) : [];
}

export function getQuestion(id: string): Question | undefined {
  return ALL_QUESTIONS.find((question) => question.id === id);
}

export function lessonIndex(id: string): number {
  return ALL_LESSONS.findIndex((lesson) => lesson.id === id);
}

export function nextLesson(id: string): Lesson | undefined {
  const index = lessonIndex(id);
  if (index < 0 || index === ALL_LESSONS.length - 1) return undefined;
  return ALL_LESSONS[index + 1];
}

export const CURRICULUM_STATS = {
  worlds: WORLDS.length,
  lessons: ALL_LESSONS.length,
  questions: ALL_QUESTIONS.length,
  minutes: ALL_LESSONS.reduce((sum, lesson) => sum + lesson.minutes, 0)
};

export { reales, operaciones, trigonometria, algebra, ecuaciones, inecuaciones, sistemas, simulacros };
