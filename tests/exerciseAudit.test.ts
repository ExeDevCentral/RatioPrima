import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_STEP_EXERCISES,
  FOUNDATION_EXERCISES,
  SIMPLE_EXERCISES
} from '../web/src/data/stepExercises.ts';
import {
  auditLearningProfile,
  canAdvanceFromSeries,
  nextExerciseSeries,
  seriesProgress,
  seriesUnlocked,
  EXERCISE_PASS_THRESHOLD
} from '../web/src/lib/exerciseAudit.ts';
import type { QuestionStat } from '../web/src/lib/gamification.ts';

function statsFor(exercises: typeof ALL_STEP_EXERCISES, correctCount: number): Record<string, QuestionStat> {
  return Object.fromEntries(exercises.slice(0, correctCount).map((exercise) => [
    exercise.id,
    { attempts: 1, correct: 1 }
  ]));
}

test('ejercicios: la ruta requiere aprobar el umbral antes de avanzar', () => {
  assert.equal(EXERCISE_PASS_THRESHOLD, 8);
  assert.equal(nextExerciseSeries('zero'), 'simple');
  assert.equal(nextExerciseSeries('simple'), 'challenge');
  assert.equal(nextExerciseSeries('challenge'), null);
  assert.equal(seriesUnlocked('zero', {}), true);
  assert.equal(seriesUnlocked('simple', statsFor(FOUNDATION_EXERCISES, 7)), false);
  assert.equal(seriesUnlocked('simple', statsFor(FOUNDATION_EXERCISES, 8)), true);
  assert.equal(canAdvanceFromSeries('zero', statsFor(FOUNDATION_EXERCISES, 8)), true);
  assert.equal(canAdvanceFromSeries('simple', statsFor(SIMPLE_EXERCISES, 8)), true);
  assert.equal(canAdvanceFromSeries('challenge', {}), false);
  assert.deepEqual(seriesProgress('zero', statsFor(FOUNDATION_EXERCISES, 8)), {
    solved: 8,
    total: 10,
    unlocked: true
  });
});

test('auditoría: identifica fortalezas, debilidades y falta de evidencia', () => {
  const strongA = ALL_STEP_EXERCISES[0];
  const strongB = { ...ALL_STEP_EXERCISES[1], topic: ALL_STEP_EXERCISES[0].topic };
  const weakA = ALL_STEP_EXERCISES[2];
  const weakB = { ...ALL_STEP_EXERCISES[3], topic: ALL_STEP_EXERCISES[2].topic };
  const untouched = ALL_STEP_EXERCISES[4];
  const audit = auditLearningProfile({
    [strongA.id]: { attempts: 2, correct: 2 },
    [strongB.id]: { attempts: 1, correct: 1 },
    [weakA.id]: { attempts: 2, correct: 0 },
    [weakB.id]: { attempts: 2, correct: 0 },
    [untouched.id]: { attempts: 0, correct: 0 }
  }, [strongA, strongB, weakA, weakB, untouched]);

  assert.deepEqual(audit.strengths, [strongA.topic]);
  assert.deepEqual(audit.weaknesses, [weakA.topic]);
  assert.equal(audit.coveredTopics, 2);
  assert.equal(audit.correct, 3);
  assert.equal(audit.incorrect, 4);
});
