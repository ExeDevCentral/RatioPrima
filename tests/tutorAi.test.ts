import test from 'node:test';
import assert from 'node:assert/strict';
import { askTutorAI, evaluateMathExpression } from '../web/src/lib/tutorAi.ts';

test('Calculadora segura del Tutor: aritmética, potencias y trigonometría', () => {
  assert.equal(evaluateMathExpression('3/4 + 1/2'), 1.25);
  assert.equal(evaluateMathExpression('sqrt(144) + 2^3'), 20);
  assert.ok(Math.abs((evaluateMathExpression('sin(30)') ?? 0) - 0.5) < 1e-6);
  assert.equal(evaluateMathExpression('1 / 0'), null);
  assert.equal(evaluateMathExpression('process.exit()'), null);
});

test('Tutor IA Socrático: nunca hace la tarea, sí calcula y guía', () => {
  const noCheating = askTutorAI('dame la respuesta directa por favor', 'helix3d');
  assert.ok(noCheating.reply.includes('Tutor'));

  const trig = askTutorAI('no entiendo hipotenusa y catetos', 'helix3d');
  assert.ok(trig.reply.includes('hipotenusa'));
  assert.ok(trig.formula?.includes('operatorname{sen}'));

  const calc = askTutorAI('3/4 + 1/2', 'cube3d');
  assert.ok(calc.reply.includes('1.25'));
});
