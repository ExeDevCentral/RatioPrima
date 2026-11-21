import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MATH_SYMBOLS,
  SYMBOL_GROUP_LABELS,
  searchSymbols,
  type SymbolGroup
} from '../../data/symbols';
import { MATH_DICTIONARY, searchDictionary } from '../../data/mathDictionary';
import { askTutorAI, evaluateMathExpression } from '../../lib/tutorAi';
import Icon from './Icon';
import RichText, { FormulaCard } from './RichText';

export type AssistantTab = 'dictionary' | 'symbols' | 'tutor';

interface SymbolsDrawerProps {
  open: boolean;
  initialTab?: AssistantTab;
  onClose: () => void;
}

interface MiniMsg {
  id: string;
  role: 'user' | 'tutor';
  text: string;
  formula?: string;
}

const GROUPS: SymbolGroup[] = ['conjuntos', 'logica', 'orden'];
const QUICK_WHY = [
  '¿Por qué existen los negativos?',
  '¿Por qué se invierte el signo en inecuaciones?',
  '¿Cómo diferencio seno, coseno y tangente?',
  '¿Por qué no se puede dividir por cero?'
];

export default function SymbolsDrawer({ open, initialTab = 'dictionary', onClose }: SymbolsDrawerProps) {
  const [tab, setTab] = useState<AssistantTab>(initialTab);
  const [query, setQuery] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<MiniMsg[]>([
    {
      id: 'init',
      role: 'tutor',
      text: 'Preguntame cualquier **¿por qué?** del cursillo o escribime una cuenta (ej. `3/4 + 1/2` o `sqrt(144)`). Te guío sin hacer la tarea por vos.'
    }
  ]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(timer);
    };
  }, [open, tab, onClose]);

  const filteredSymbols = useMemo(() => searchSymbols(query), [query]);
  const filteredDict = useMemo(() => searchDictionary(query), [query]);

  const sendMiniQuestion = (preset?: string) => {
    const text = (preset ?? question).trim();
    if (!text) return;

    const lower = text.toLowerCase();
    let reply: string;
    let formula: string | undefined;

    if (lower.includes('negativ')) {
      reply =
        'Los enteros negativos (ℤ) existen porque en los naturales ℕ no podés resolver restas como **3 − 5** ni medir deudas o temperaturas bajo cero. Por eso el eje Y sube un nivel: ℤ incluye a ℕ y resuelve esas restas.';
      formula = '3 - 5 = -2 \\in \\mathbb{Z} \\quad (\\text{pero } -2 \\notin \\mathbb{N})';
    } else if (lower.includes('dividir por cero') || lower.includes('dividir por 0')) {
      reply =
        'Si existiera un número $k = a/0$, entonces $k \\cdot 0 = a$. Pero cualquier número multiplicado por $0$ da $0$, nunca un $a \\ne 0$. Por eso dividir por cero rompe las reglas del álgebra.';
      formula = 'a \\div 0 \\text{ no existe en } \\mathbb{R}';
    } else if (lower.includes('invierte') && (lower.includes('signo') || lower.includes('inecuac'))) {
      reply =
        'En la recta, $2 < 5$. Si multiplicás ambos lados por $-1$, obtenés $-2$ y $-5$: en la recta $-2$ queda a la derecha de $-5$, o sea $-2 > -5$. Multiplicar por un negativo espeja la recta.';
      formula = '2 < 5 \\;\\Longrightarrow\\; -2 > -5';
    } else {
      const evaluated = evaluateMathExpression(text);
      if (evaluated !== null && /^[\d\s+\-*/^().,a-zA-Z]+$/.test(text) && /\d/.test(text)) {
        const clean = Number.isInteger(evaluated) ? evaluated : Number(evaluated.toFixed(5));
        reply = `Verifiqué tu cuenta: **${text} = ${clean}**. Comprobá si cada signo y paréntesis coincide con tu planteo.`;
        formula = `${text} = ${clean}`;
      } else {
        const ai = askTutorAI(text, 'sets3d');
        reply = ai.reply;
        formula = ai.formula;
      }
    }

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: 'user', text },
      { id: `t-${Date.now() + 1}`, role: 'tutor', text: reply, formula }
    ]);
    if (!preset) setQuestion('');
  };

  if (!open) return null;

  return (
    <div
      className="symbols-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className="symbols-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="symbols-drawer-title"
      >
        <div className="symbols-drawer-head">
          <div>
            <span className="eyebrow">Asistente Académico · RatioPrima</span>
            <h2 id="symbols-drawer-title">Diccionario, Símbolos &amp; Tutor</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Cerrar asistente académico"
            title="Cerrar (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="drawer-tabs" role="tablist" aria-label="Secciones del asistente">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'dictionary'}
            className={`drawer-tab ${tab === 'dictionary' ? 'active' : ''}`}
            onClick={() => { setTab('dictionary'); setQuery(''); }}
          >
            <Icon name="book" size={14} /> Diccionario
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'symbols'}
            className={`drawer-tab ${tab === 'symbols' ? 'active' : ''}`}
            onClick={() => { setTab('symbols'); setQuery(''); }}
          >
            <span aria-hidden="true">∈</span> Símbolos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'tutor'}
            className={`drawer-tab ${tab === 'tutor' ? 'active' : ''}`}
            onClick={() => setTab('tutor')}
          >
            <Icon name="brain" size={14} /> Preguntá
          </button>
        </div>

        {tab !== 'tutor' ? (
          <div className="symbols-search-wrap">
            <input
              ref={inputRef}
              type="search"
              className="symbols-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === 'dictionary'
                  ? 'Buscá concepto o creador (ej: cero, Al-Juarismi, √2)...'
                  : 'Buscá símbolo o lectura (ej: ∈, pertenece, existe)...'
              }
              aria-label={tab === 'dictionary' ? 'Buscar en diccionario matemático' : 'Buscar símbolo matemático'}
            />
            <span className="symbols-count">
              {tab === 'dictionary'
                ? `${filteredDict.length}/${MATH_DICTIONARY.length}`
                : `${filteredSymbols.length}/${MATH_SYMBOLS.length}`}
            </span>
          </div>
        ) : null}

        {tab === 'dictionary' ? (
          <div className="symbols-list">
            {filteredDict.length === 0 ? (
              <div className="symbols-empty">
                <Icon name="bulb" size={20} />
                <p>No encontramos «{query}». Probá con «enteros», «Pitágoras» o «Al-Juarismi».</p>
              </div>
            ) : (
              filteredDict.map((entry) => (
                <article key={entry.id} className="dict-card">
                  <div className="dict-card-head">
                    <span className="symbol-glyph" aria-hidden="true">{entry.symbol}</span>
                    <div className="dict-card-title">
                      <span className="dict-cat">{entry.category}</span>
                      <strong>{entry.term}</strong>
                    </div>
                  </div>
                  <p className="dict-why">
                    <em>¿Por qué existe?</em> {entry.whyItExists}
                  </p>
                  <p className="dict-def">{entry.definition}</p>
                  <div className="dict-history">
                    <span className="dict-creator">🏛 {entry.creator}</span>
                    <small>{entry.history}</small>
                  </div>
                </article>
              ))
            )}
          </div>
        ) : null}

        {tab === 'symbols' ? (
          <div className="symbols-list">
            {filteredSymbols.length === 0 ? (
              <div className="symbols-empty">
                <Icon name="bulb" size={20} />
                <p>No encontramos símbolos con «{query}». Probá con «pertenece», «unión» o «∀».</p>
              </div>
            ) : (
              GROUPS.map((group) => {
                const items = filteredSymbols.filter((s) => s.group === group);
                if (items.length === 0) return null;
                return (
                  <section key={group} className="symbols-group">
                    <h3>{SYMBOL_GROUP_LABELS[group]}</h3>
                    <div className="symbols-items">
                      {items.map((item) => (
                        <article key={item.symbol} className="symbol-row">
                          <span className="symbol-glyph" aria-hidden="true">
                            {item.symbol}
                          </span>
                          <div className="symbol-copy">
                            <strong>{item.reads}</strong>
                            <small>{item.example}</small>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        ) : null}

        {tab === 'tutor' ? (
          <div className="mini-tutor-wrap">
            <div className="symbols-list">
              {messages.map((m) => (
                <article key={m.id} className={`tutor-bubble ${m.role}`}>
                  <div className="tutor-bubble-head">
                    <strong>{m.role === 'tutor' ? 'Tutor local' : 'Vos'}</strong>
                  </div>
                  <div className="tutor-bubble-body">
                    <RichText text={m.text} />
                  </div>
                  {m.formula ? (
                    <div className="tutor-bubble-formula">
                      <FormulaCard formula={m.formula} />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
            <div className="tutor-quick-row">
              {QUICK_WHY.map((q) => (
                <button key={q} type="button" className="tutor-quick-chip" onClick={() => sendMiniQuestion(q)}>
                  {q}
                </button>
              ))}
            </div>
            <form
              className="tutor-input-row"
              onSubmit={(e) => {
                e.preventDefault();
                sendMiniQuestion();
              }}
            >
              <input
                ref={inputRef}
                type="text"
                className="tutor-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Preguntá un ¿por qué? o escribí una cuenta..."
                aria-label="Pregunta para el tutor matemático"
              />
              <button type="submit" className="btn btn-primary">
                Ir
              </button>
            </form>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
