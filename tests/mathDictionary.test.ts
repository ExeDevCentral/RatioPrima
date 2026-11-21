import test from 'node:test';
import assert from 'node:assert/strict';
import { MATH_DICTIONARY, searchDictionary } from '../web/src/data/mathDictionary.ts';

test('Diccionario académico: entradas completas con creador, historia y porqué', () => {
  assert.ok(MATH_DICTIONARY.length >= 12);
  const ids = new Set<string>();
  for (const entry of MATH_DICTIONARY) {
    assert.ok(!ids.has(entry.id), `id duplicado: ${entry.id}`);
    ids.add(entry.id);
    assert.ok(entry.term.length > 2);
    assert.ok(entry.whyItExists.length > 10);
    assert.ok(entry.creator.length > 4);
    assert.ok(entry.history.length > 15);
  }
});

test('Diccionario académico: búsqueda por concepto, símbolo y creador histórico', () => {
  assert.equal(searchDictionary('').length, MATH_DICTIONARY.length);
  assert.ok(searchDictionary('Al-Juarismi').some((e) => e.id === 'algebra'));
  assert.ok(searchDictionary('Hipaso').some((e) => e.id === 'irracionales'));
  assert.ok(searchDictionary('Brahmagupta').some((e) => e.id === 'cero'));
});
