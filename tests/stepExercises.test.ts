import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_STEP_EXERCISES,
  CHALLENGE_EXERCISES,
  SIMPLE_EXERCISES,
  reviewAnswerWithAI
} from '../web/src/data/stepExercises.ts';

test('Pasos Simples 10+10: estructura completa de 20 ejercicios', () => {
  assert.equal(SIMPLE_EXERCISES.length, 10);
  assert.equal(CHALLENGE_EXERCISES.length, 10);
  assert.equal(ALL_STEP_EXERCISES.length, 20);

  const ids = new Set(ALL_STEP_EXERCISES.map((ex) => ex.id));
  assert.equal(ids.size, 20);

  for (const ex of ALL_STEP_EXERCISES) {
    assert.ok(ex.steps.length >= 1, `Faltan pasos en ${ex.id}`);
    assert.ok(ex.acceptedAnswers.length >= 1, `Faltan respuestas en ${ex.id}`);
    const res = reviewAnswerWithAI(ex, ex.canonicalAnswer);
    assert.equal(res.isCorrect, true, `Respuesta canónica falló en ${ex.id}`);
    assert.equal(res.tone, 'correct');
  }
});

test('Revisión IA: equivalencias de teclado (fracciones, comas decimales, x=)', () => {
  const eq = SIMPLE_EXERCISES.find((e) => e.id === 'simple-06')!;
  assert.equal(reviewAnswerWithAI(eq, 'x = 3').isCorrect, true);

  const sen = SIMPLE_EXERCISES.find((e) => e.id === 'simple-08')!;
  assert.equal(reviewAnswerWithAI(sen, '0,5').isCorrect, true);
  assert.equal(reviewAnswerWithAI(sen, '1/2').isCorrect, true);

  const frac = CHALLENGE_EXERCISES.find((e) => e.id === 'challenge-05')!;
  assert.equal(reviewAnswerWithAI(frac, '-9/8').isCorrect, true);
  assert.equal(reviewAnswerWithAI(frac, '-1,125').isCorrect, true);
});

test('Revisión IA: diagnóstico inteligente de errores clásicos', () => {
  const pow = SIMPLE_EXERCISES.find((e) => e.id === 'simple-03')!;
  const powErr = reviewAnswerWithAI(pow, '-9');
  assert.equal(powErr.isCorrect, false);
  assert.equal(powErr.tone, 'close');
  assert.ok(powErr.diagnosis.includes('paréntesis'));

  const binom = CHALLENGE_EXERCISES.find((e) => e.id === 'challenge-07')!;
  const binomErr = reviewAnswerWithAI(binom, '6');
  assert.equal(binomErr.isCorrect, false);
  assert.equal(binomErr.tone, 'close');
  assert.ok(binomErr.diagnosis.includes('doble producto'));
});
