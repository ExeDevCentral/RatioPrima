import test from 'node:test';
import assert from 'node:assert/strict';
import { MATH_SYMBOLS, SYMBOL_GROUP_LABELS, searchSymbols } from '../web/src/data/symbols.ts';

const PDF_PAGE_2 = ['∈', '∉', '⊂', '⊄', '∩', '∪', '∅', '∀', '∃', '∄', '⇒', '⇔', '/', '∧', '∨', '≠', '<', '≤', '>', '≥', '∴'];

test('Símbolos: cubre el 100% de la página 2 del cuadernillo UNR 2027', () => {
  const present = new Set(MATH_SYMBOLS.map((s) => s.symbol));
  for (const sym of PDF_PAGE_2) assert.ok(present.has(sym), `falta el símbolo ${sym}`);
  assert.equal(MATH_SYMBOLS.length, PDF_PAGE_2.length);
});

test('Símbolos: únicos, con lectura, grupo válido y ejemplo', () => {
  const seen = new Set<string>();
  for (const s of MATH_SYMBOLS) {
    assert.ok(!seen.has(s.symbol), `duplicado ${s.symbol}`);
    seen.add(s.symbol);
    assert.ok(s.reads.length > 0);
    assert.ok(s.example.length > 5);
    assert.ok(s.group in SYMBOL_GROUP_LABELS);
  }
});

test('Símbolos: búsqueda por lectura y por símbolo', () => {
  assert.equal(searchSymbols('').length, MATH_SYMBOLS.length);
  assert.deepEqual(searchSymbols('∀').map((s) => s.symbol), ['∀']);
  assert.ok(searchSymbols('pertenece').some((s) => s.symbol === '∈'));
});
