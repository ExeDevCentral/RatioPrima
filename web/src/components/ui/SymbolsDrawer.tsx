import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MATH_SYMBOLS,
  SYMBOL_GROUP_LABELS,
  searchSymbols,
  type SymbolGroup
} from '../../data/symbols';
import Icon from './Icon';

interface SymbolsDrawerProps {
  open: boolean;
  onClose: () => void;
}

const GROUPS: SymbolGroup[] = ['conjuntos', 'logica', 'orden'];

export default function SymbolsDrawer({ open, onClose }: SymbolsDrawerProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

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
  }, [open, onClose]);

  const filtered = useMemo(() => searchSymbols(query), [query]);

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
            <span className="eyebrow">Página 2 · Cursillo UNR 2027</span>
            <h2 id="symbols-drawer-title">Glosario de Símbolos</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Cerrar glosario de símbolos"
            title="Cerrar (Esc)"
          >
            ✕
          </button>
        </div>

        <div className="symbols-search-wrap">
          <input
            ref={inputRef}
            type="search"
            className="symbols-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscá un símbolo o lectura (ej: ∈, pertenece, existe)..."
            aria-label="Buscar símbolo matemático"
          />
          <span className="symbols-count">
            {filtered.length}/{MATH_SYMBOLS.length}
          </span>
        </div>

        <div className="symbols-list">
          {filtered.length === 0 ? (
            <div className="symbols-empty">
              <Icon name="bulb" size={20} />
              <p>No encontramos símbolos con «{query}». Probá con «pertenece», «unión» o «∀».</p>
            </div>
          ) : (
            GROUPS.map((group) => {
              const items = filtered.filter((s) => s.group === group);
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
      </aside>
    </div>
  );
}
