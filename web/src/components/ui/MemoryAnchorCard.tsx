import React, { useState } from 'react';
import { getMemoryAnchorForTopic } from '../../data/memoryAnchors';
import Icon from './Icon';
import { Pill } from './Primitives';
import { playClick, playCorrect } from '../../lib/sfx';

export default function MemoryAnchorCard({
  worldOrTopic,
  compact = false
}: {
  worldOrTopic: string;
  compact?: boolean;
}) {
  const anchor = getMemoryAnchorForTopic(worldOrTopic);
  const [revealed, setRevealed] = useState(false);
  const [retained, setRetained] = useState(false);

  return (
    <section className={`panel memory-card ${compact ? 'compact' : ''}`}>
      <div className="memory-card-head">
        <div className="memory-title">
          <Icon name="brain" size={18} />
          <div>
            <span className="eyebrow">Psicología del aprendizaje · Retención</span>
            <h3>Cómo fijar este tema en tu memoria</h3>
          </div>
        </div>
        <Pill color="#a78bfa">{anchor.technique}</Pill>
      </div>

      <div className="memory-grid">
        <div className="memory-block">
          <strong>Imagen mental (para no olvidar)</strong>
          <p>{anchor.mentalImage}</p>
        </div>
        <div className="memory-block chunk">
          <strong>Regla en 1 frase</strong>
          <p>{anchor.chunkRule}</p>
        </div>
      </div>

      <div className="memory-recall-box">
        <div className="memory-recall-q">
          <Icon name="bulb" size={15} />
          <span><strong>Recuerdo activo:</strong> {anchor.recallPrompt}</span>
        </div>

        <div className="memory-recall-actions">
          <button
            type="button"
            className="chip"
            onClick={() => {
              playClick();
              setRevealed((r) => !r);
            }}
          >
            {revealed ? 'Ocultar respuesta' : 'Comprobar mi recuerdo'}
          </button>
          <button
            type="button"
            className={`chip ${retained ? 'active' : ''}`}
            onClick={() => {
              setRetained(true);
              playCorrect(1);
            }}
          >
            <Icon name="check" size={13} />
            {retained ? '¡Fijado en memoria!' : 'Lo recordé bien'}
          </button>
        </div>

        {revealed ? (
          <div className="memory-recall-answer step-reveal">
            {anchor.recallAnswer}
          </div>
        ) : null}
      </div>

      <div className="memory-spacing">
        <Icon name="clock" size={13} />
        <span>{anchor.spacingTip}</span>
      </div>
    </section>
  );
}
