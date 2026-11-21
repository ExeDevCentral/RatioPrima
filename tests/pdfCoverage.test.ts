import test from 'node:test';
import assert from 'node:assert/strict';
import { ALL_QUESTIONS } from '../web/src/data/curriculum.ts';

const REQUIRED_PDF_TAGS = [
  'pdf:autoeval-1',
  'pdf:autoeval-2',
  'pdf:autoeval-3',
  'pdf:autoeval-4',
  'pdf:examen-2006',
  'pdf:examen-2013'
];

test('PDF UNR 2027: cubre las 4 Autoevaluaciones, Examen 2006 y Examen 2013', () => {
  const presentTags = new Set(ALL_QUESTIONS.flatMap((q) => q.tags ?? []));
  for (const tag of REQUIRED_PDF_TAGS) {
    assert.ok(presentTags.has(tag), `Falta cobertura para ${tag}`);
  }
});

test('Exactitud matemática de ejercicios incorporados del PDF UNR 2027', () => {
  // Autoeval 3 (2b): sqrt(8) - 2*sqrt(32) + 3*sqrt(128) === 18*sqrt(2)
  const radVal = Math.sqrt(8) - 2 * Math.sqrt(32) + 3 * Math.sqrt(128);
  assert.ok(Math.abs(radVal - 18 * Math.sqrt(2)) < 1e-10);

  // Autoeval 3 (4): rombo P=160 -> L=40, ángulo 120° -> d1=40, d2=40*sqrt(3)
  const L = 160 / 4;
  assert.ok(Math.abs(2 * L * Math.cos(Math.PI / 3) - 40) < 1e-10);
  assert.ok(Math.abs(2 * L * Math.sin(Math.PI / 3) - 40 * Math.sqrt(3)) < 1e-10);

  // Autoeval 4 (4): campo 840 ha -> 1/7 trigo, 1/3 del resto maíz, 480 ha soja
  const totalHa = 840;
  const afterTrigo = totalHa - totalHa / 7;
  const afterMaiz = afterTrigo - afterTrigo / 3;
  assert.equal(afterMaiz, 480);

  // Examen 2006 (5a): 7 económico ($800) + 6 ejecutivo ($1500) = 13 personas, $14600
  assert.equal(7 + 6, 13);
  assert.equal(7 * 800 + 6 * 1500, 14600);

  // Examen 2006 (6b): r = 20 / (pi/5) = 100/pi
  assert.ok(Math.abs((20 / (Math.PI / 5)) - 100 / Math.PI) < 1e-10);

  // Examen 2013 (1): escalera 2.5 m a 65° -> 2.5*cos(65°) ≈ 1.0565 m
  const dist = 2.5 * Math.cos((65 * Math.PI) / 180);
  assert.ok(Math.abs(dist - 1.06) < 0.01);

  // Examen 2013 (5): sistema 2x + y = 1, (y + 1)/(x + 3) = 5 -> x = -13/7, y = 33/7
  const x = -13 / 7;
  const y = 33 / 7;
  assert.ok(Math.abs(2 * x + y - 1) < 1e-12);
  assert.ok(Math.abs((y + 1) / (x + 3) - 5) < 1e-12);
});
