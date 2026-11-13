import test from 'node:test';
import assert from 'node:assert/strict';
import { EXERCISES, type MathExercise } from '../web/src/data/exercises.ts';
import { evaluateReplCommand } from '../web/src/lib/replEngine.ts';

test('Polymath Zero - Data Integrity: MathExercise Strict Schema', () => {
  assert.ok(EXERCISES.length >= 4, 'Debe haber al menos 4 ejercicios estructurados');

  for (const ex of EXERCISES) {
    // 1. Identificadores y títulos
    assert.ok(typeof ex.id === 'string' && ex.id.length > 0, `ID inválido en ${ex.id}`);
    assert.ok(typeof ex.topic === 'string' && ex.topic.length > 0, `Topic inválido en ${ex.id}`);
    assert.ok(typeof ex.category === 'string' && ex.category.length > 0, `Category inválido en ${ex.id}`);
    assert.ok(typeof ex.whyWeLearnThis === 'string' && ex.whyWeLearnThis.length > 30, `whyWeLearnThis insuficiente en ${ex.id}`);

    // 2. Pasos guiados
    assert.ok(Array.isArray(ex.stepByStep) && ex.stepByStep.length >= 3, `stepByStep debe tener al menos 3 pasos en ${ex.id}`);
    ex.stepByStep.forEach((step, idx) => {
      assert.equal(step.stepNumber, idx + 1, `stepNumber fuera de orden en paso ${idx + 1} de ${ex.id}`);
      assert.ok(step.title.length > 0, `Paso ${step.stepNumber} sin título en ${ex.id}`);
      assert.ok(step.commandOrFormula.length > 0, `Paso ${step.stepNumber} sin commandOrFormula en ${ex.id}`);
      assert.ok(step.rationale.length > 0, `Paso ${step.stepNumber} sin rationale en ${ex.id}`);
      assert.ok(step.expectedOutput.length > 0, `Paso ${step.stepNumber} sin expectedOutput en ${ex.id}`);
    });

    // 3. Canon Académico
    assert.ok(Array.isArray(ex.canonicalReferences) && ex.canonicalReferences.length >= 1, `canonicalReferences vacío en ${ex.id}`);
    ex.canonicalReferences.forEach((ref) => {
      assert.ok(ref.book.length > 0, `Libro no especificado en canon de ${ex.id}`);
      assert.ok(ref.author.length > 0, `Autor no especificado en canon de ${ex.id}`);
      assert.ok(ref.chapter.length > 0, `Capítulo no especificado en canon de ${ex.id}`);
      assert.ok(ref.topic.length > 0, `Tema no especificado en canon de ${ex.id}`);
      assert.ok(ref.quote.length > 0, `Cita no especificada en canon de ${ex.id}`);
    });

    // 4. Demostración formal
    assert.ok(ex.formalProof, `Demostración formal faltante en ${ex.id}`);
    assert.ok(ex.formalProof.theorem.length > 0, `Teorema faltante en formalProof de ${ex.id}`);
    assert.ok(ex.formalProof.premises.length >= 2, `Premisas insuficientes en formalProof de ${ex.id}`);
    assert.ok(ex.formalProof.steps.length >= 3, `Pasos deductivos insuficientes en formalProof de ${ex.id}`);
    assert.ok(ex.formalProof.qed.includes('Q.E.D.'), `Q.E.D. inválido en ${ex.id}`);

    // 5. Artefacto computacional
    assert.ok(
      ['SymPy', 'Maxima', 'NumPy'].includes(ex.computationalArtifact.engine),
      `Motor inválido en computationalArtifact de ${ex.id}: ${ex.computationalArtifact.engine}`
    );
    assert.ok(ex.computationalArtifact.codeSnippet.length > 0, `Código ausente en ${ex.id}`);
    assert.ok(ex.computationalArtifact.expectedConsoleOutput.length > 0, `Salida esperada ausente en ${ex.id}`);

    // 6. Chequeos Socráticos
    assert.ok(Array.isArray(ex.socraticProbes) && ex.socraticProbes.length >= 1, `socraticProbes vacío en ${ex.id}`);
    ex.socraticProbes.forEach((probe) => {
      assert.ok(probe.question.length > 0, `Pregunta socrática vacía en ${ex.id}`);
      assert.ok(probe.coreConcept.length > 0, `Concepto socrático vacío en ${ex.id}`);
      assert.ok(probe.deepExplanation.length > 20, `Explicación técnica insuficiente en ${ex.id}`);
    });

    // 7. Glosario
    assert.ok(Array.isArray(ex.glossaryTerms) && ex.glossaryTerms.length >= 2, `glossaryTerms insuficiente en ${ex.id}`);
    ex.glossaryTerms.forEach((g) => {
      assert.ok(g.term.length > 0, `Término vacío en glosario de ${ex.id}`);
      assert.ok(g.definition.length > 0, `Definición vacía en glosario de ${ex.id}`);
      assert.ok(g.rigorousContext.length > 0, `Contexto riguroso vacío en glosario de ${ex.id}`);
    });
  }
});

test('Polymath Zero - REPL Engine: Help, Status & Clear Commands', () => {
  const helpRes = evaluateReplCommand('help');
  assert.equal(helpRes.ok, true);
  assert.ok(helpRes.output.includes('POLYMATH ZERO'));
  assert.ok(helpRes.output.includes('diff'));

  const statusRes = evaluateReplCommand('status', { topic: 'Álgebra Lineal' });
  assert.equal(statusRes.ok, true);
  assert.ok(statusRes.output.includes('SymPy'));
  assert.ok(statusRes.output.includes('Álgebra Lineal'));

  const clearRes = evaluateReplCommand('clear');
  assert.equal(clearRes.action, 'clear');
});

test('Polymath Zero - REPL Engine: Calculus (diff, integrate, limit)', () => {
  // Diff
  const diffRes = evaluateReplCommand('diff x^3');
  assert.equal(diffRes.ok, true);
  assert.ok(diffRes.output.includes('3*x^2'));

  // Integrate
  const intRes = evaluateReplCommand('integrate 3*x^2');
  assert.equal(intRes.ok, true);
  assert.ok(intRes.output.includes('x^3 + C'));

  // Limit
  const limRes = evaluateReplCommand('limit (3*x - 1) x->2');
  assert.equal(limRes.ok, true);
  assert.ok(limRes.output.includes('5'));
  assert.ok(limRes.output.includes('Spivak'));
});

test('Polymath Zero - REPL Engine: Proof, Test and Step Verification', () => {
  const proofRes = evaluateReplCommand('proof', { proofTheorem: 'Teorema de Cauchy' });
  assert.equal(proofRes.action, 'proof');
  assert.ok(proofRes.output.includes('Teorema de Cauchy'));

  const testRes = evaluateReplCommand('test');
  assert.equal(testRes.ok, true);
  assert.ok(testRes.output.includes('RESULTADO: 6/6 pruebas formales pasadas con éxito'));

  const stepRes = evaluateReplCommand('a + (-a) == 0', {
    currentFormula: 'a + (-a) == 0',
    expectedOutput: '0 (Neutro aditivo)'
  });
  assert.equal(stepRes.ok, true);
  assert.ok(stepRes.output.includes('True') || stepRes.output.includes('0 (Neutro aditivo)'));
});

