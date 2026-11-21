/**
 * Glosario de símbolos matemáticos — Página 2 del cuadernillo
 * "Matemática · Ingreso Terciario 2027" (Instituto Politécnico, UNR).
 *
 * Datos puros (sin React) para el drawer "Símbolos" siempre accesible.
 */

export type SymbolGroup = 'conjuntos' | 'logica' | 'orden';

export interface MathSymbol {
  symbol: string;
  reads: string;
  group: SymbolGroup;
  /** Ejemplo cotidiano o del cursillo, en lenguaje simple. */
  example: string;
}

export const SYMBOL_GROUP_LABELS: Record<SymbolGroup, string> = {
  conjuntos: 'Conjuntos',
  logica: 'Lógica y cuantificadores',
  orden: 'Orden y comparación'
};

export const MATH_SYMBOLS: readonly MathSymbol[] = [
  { symbol: '∈', reads: 'pertenece a', group: 'conjuntos', example: '3 ∈ ℕ: el 3 es un número natural.' },
  { symbol: '∉', reads: 'no pertenece a', group: 'conjuntos', example: '−2 ∉ ℕ: el −2 no es natural.' },
  { symbol: '⊂', reads: 'incluido en', group: 'conjuntos', example: 'ℕ ⊂ ℤ: todo natural también es entero.' },
  { symbol: '⊄', reads: 'no incluido en', group: 'conjuntos', example: 'ℤ ⊄ ℕ: hay enteros (como −1) que no son naturales.' },
  { symbol: '∩', reads: 'intersección', group: 'conjuntos', example: '[0; 5] ∩ [3; 8] = [3; 5]: lo que tienen en común.' },
  { symbol: '∪', reads: 'unión', group: 'conjuntos', example: '[0; 2] ∪ [1; 4] = [0; 4]: juntar todo sin repetir.' },
  { symbol: '∅', reads: 'conjunto vacío', group: 'conjuntos', example: '{x ∈ ℝ / x² = −1} = ∅: ningún real cumple eso.' },
  { symbol: '∀', reads: 'para todo', group: 'logica', example: '∀ x ∈ ℝ: x² ≥ 0. Todo cuadrado es mayor o igual que cero.' },
  { symbol: '∃', reads: 'existe', group: 'logica', example: '∃ x ∈ ℕ / x + 2 = 5: existe un natural (el 3) que cumple.' },
  { symbol: '∄', reads: 'no existe', group: 'logica', example: '∄ x ∈ ℕ / x + 5 = 2: ningún natural cumple.' },
  { symbol: '⇒', reads: 'implica', group: 'logica', example: 'x = 2 ⇒ x² = 4. Si vale lo primero, vale lo segundo.' },
  { symbol: '⇔', reads: 'si y solo si', group: 'logica', example: 'x + 3 = 5 ⇔ x = 2: las dos frases dicen lo mismo.' },
  { symbol: '/', reads: 'tal que', group: 'logica', example: '{x ∈ ℤ / x > 0}: los enteros tales que son positivos.' },
  { symbol: '∧', reads: 'y', group: 'logica', example: 'x > 1 ∧ x < 4: deben cumplirse las dos a la vez.' },
  { symbol: '∨', reads: 'o', group: 'logica', example: 'x < 0 ∨ x > 3: alcanza con que se cumpla una.' },
  { symbol: '∴', reads: 'por lo tanto', group: 'logica', example: '2x = 6 ∴ x = 3.' },
  { symbol: '≠', reads: 'no igual, distinto', group: 'orden', example: '1/3 ≠ 0,3: un tercio es 0,333…' },
  { symbol: '<', reads: 'menor', group: 'orden', example: '−5 < −2: en la recta, −5 está más a la izquierda.' },
  { symbol: '≤', reads: 'menor o igual', group: 'orden', example: 'x ≤ 4 incluye al 4 (corchete en el intervalo).' },
  { symbol: '>', reads: 'mayor', group: 'orden', example: '0 > −1: el cero está a la derecha del −1.' },
  { symbol: '≥', reads: 'mayor o igual', group: 'orden', example: 'x ≥ 0: el cero también cuenta.' }
];

export function searchSymbols(query: string): MathSymbol[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...MATH_SYMBOLS];
  return MATH_SYMBOLS.filter(
    (s) => s.symbol === q || s.reads.toLowerCase().includes(q) || s.example.toLowerCase().includes(q)
  );
}
