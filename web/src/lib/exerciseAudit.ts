import {
  ALL_STEP_EXERCISES,
  CHALLENGE_EXERCISES,
  FOUNDATION_EXERCISES,
  SIMPLE_EXERCISES,
  type StepSeriesId
} from '../data/stepExercises.ts';
import type { QuestionStat } from './gamification';

export interface LearningAudit {
  strengths: string[];
  weaknesses: string[];
  coveredTopics: number;
  correct: number;
  incorrect: number;
}

const SERIES_ORDER: StepSeriesId[] = ['zero', 'simple', 'challenge'];
const PASS_THRESHOLD = 8;

export function nextExerciseSeries(series: StepSeriesId): StepSeriesId | null {
  const index = SERIES_ORDER.indexOf(series);
  return index >= 0 && index < SERIES_ORDER.length - 1 ? SERIES_ORDER[index + 1] : null;
}

export function seriesUnlocked(series: StepSeriesId, stats: Record<string, QuestionStat>): boolean {
  if (series === 'zero') return true;
  const prerequisite = series === 'simple' ? FOUNDATION_EXERCISES : SIMPLE_EXERCISES;
  return prerequisite.filter((exercise) => (stats[exercise.id]?.correct ?? 0) > 0).length >= PASS_THRESHOLD;
}

export function canAdvanceFromSeries(series: StepSeriesId, stats: Record<string, QuestionStat>): boolean {
  const next = nextExerciseSeries(series);
  return next !== null && seriesUnlocked(next, stats);
}

export function auditLearningProfile(
  stats: Record<string, QuestionStat>,
  exercises = ALL_STEP_EXERCISES
): LearningAudit {
  const byTopic = new Map<string, { attempts: number; correct: number }>();
  for (const exercise of exercises) {
    const stat = stats[exercise.id];
    if (!stat || stat.attempts <= 0) continue;
    const current = byTopic.get(exercise.topic) ?? { attempts: 0, correct: 0 };
    current.attempts += stat.attempts;
    current.correct += Math.min(stat.correct, stat.attempts);
    byTopic.set(exercise.topic, current);
  }

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  let correct = 0;
  let incorrect = 0;
  for (const [topic, result] of byTopic) {
    correct += result.correct;
    incorrect += result.attempts - result.correct;
    const accuracy = result.correct / result.attempts;
    if (result.attempts >= 2 && accuracy >= 0.8) strengths.push(topic);
    if (result.attempts >= 2 && accuracy < 0.7) weaknesses.push(topic);
  }

  return {
    strengths,
    weaknesses,
    coveredTopics: byTopic.size,
    correct,
    incorrect
  };
}

export function seriesProgress(
  series: StepSeriesId,
  stats: Record<string, QuestionStat>
): { solved: number; total: number; unlocked: boolean } {
  const exercises = series === 'zero'
    ? FOUNDATION_EXERCISES
    : series === 'simple'
      ? SIMPLE_EXERCISES
      : CHALLENGE_EXERCISES;
  return {
    solved: exercises.filter((exercise) => (stats[exercise.id]?.correct ?? 0) > 0).length,
    total: exercises.length,
    unlocked: seriesUnlocked(series, stats)
  };
}

export const EXERCISE_PASS_THRESHOLD = PASS_THRESHOLD;
