import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CHALLENGE_EXERCISES,
  FOUNDATION_EXERCISES,
  SIMPLE_EXERCISES,
  reviewAnswerWithAI,
  type AIReviewResult,
  type StepExercise,
  type StepSeriesId
} from '../data/stepExercises';
import { useLearning } from '../state/LearningContext';
import Icon from '../components/ui/Icon';
import { Bar, Pill, SectionTitle } from '../components/ui/Primitives';
import RichText, { FormulaCard } from '../components/ui/RichText';
import { burstConfetti } from '../lib/fx';
import { playClick, playLaser } from '../lib/sfx';

const KEYPAD_KEYS = ['7', '8', '9', '/', '4', '5', '6', '-', '1', '2', '3', '.', '0'];

export default function StepsPracticeView() {
  const { recordQuestion, pushToast } = useLearning();
  const [series, setSeries] = useState<StepSeriesId>('zero');
  const [index, setIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [reviews, setReviews] = useState<Record<string, AIReviewResult>>({});
  const [scanning, setScanning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scanTimerRef = useRef<number | null>(null);

  const list: StepExercise[] = useMemo(
    () =>
      series === 'zero'
        ? FOUNDATION_EXERCISES
        : series === 'simple'
          ? SIMPLE_EXERCISES
          : CHALLENGE_EXERCISES,
    [series]
  );

  const exercise = list[index] ?? list[0];
  const currentInput = inputs[exercise.id] ?? '';
  const currentReview = reviews[exercise.id];

  const solvedCount = useMemo(
    () => list.filter((ex) => reviews[ex.id]?.isCorrect).length,
    [list, reviews]
  );
  const attemptedCount = useMemo(
    () => list.filter((ex) => Boolean(reviews[ex.id])).length,
    [list, reviews]
  );

  useEffect(() => {
    setShowHint(false);
    setScanning(false);
    const id = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
    return () => window.clearTimeout(id);
  }, [exercise.id, series]);

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    };
  }, []);

  const switchSeries = (nextSeries: StepSeriesId) => {
    if (nextSeries === series) return;
    playClick();
    setSeries(nextSeries);
    setIndex(0);
  };

  const setAnswerText = (val: string) => {
    setInputs((prev) => ({ ...prev, [exercise.id]: val }));
  };

  const appendKey = (key: string) => {
    playClick();
    setAnswerText(currentInput + key);
    inputRef.current?.focus();
  };

  const backspaceKey = () => {
    playClick();
    setAnswerText(currentInput.slice(0, -1));
    inputRef.current?.focus();
  };

  const goNext = () => {
    if (index < list.length - 1) {
      playClick();
      setIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (index > 0) {
      playClick();
      setIndex((i) => i - 1);
    }
  };

  const runAIReview = () => {
    if (scanning) return;
    if (!currentInput.trim()) {
      pushToast({
        title: 'Escribí tu respuesta',
        detail: 'Usá el teclado o la botonera numérica para ingresar un resultado.',
        tone: 'warning'
      });
      inputRef.current?.focus();
      return;
    }

    playLaser();
    setScanning(true);
    if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);

    scanTimerRef.current = window.setTimeout(() => {
      const result = reviewAnswerWithAI(exercise, currentInput);
      const alreadySolved = reviews[exercise.id]?.isCorrect;

      setReviews((prev) => ({ ...prev, [exercise.id]: result }));
      setScanning(false);

      if (!alreadySolved) {
        recordQuestion(
          {
            id: exercise.id,
            prompt: exercise.prompt,
            options: [exercise.canonicalAnswer, '0', '1', '-1'],
            correct: 0,
            explanation: result.diagnosis,
            difficulty: series === 'simple' ? 1 : 2
          },
          result.isCorrect,
          result.isCorrect ? exercise.xp : 0
        );
      }

      if (result.isCorrect) {
        const nextSolved = list.filter(
          (ex) => ex.id === exercise.id || reviews[ex.id]?.isCorrect
        ).length;
        if (nextSolved === list.length) {
          burstConfetti();
          pushToast({
            title: `¡Serie ${series === 'simple' ? 'Pasos Simples' : 'Desafío'} completada!`,
            detail: '10/10 ejercicios validados con revisión IA.',
            tone: 'success'
          });
        }
      }
    }, 340);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentReview?.isCorrect && index < list.length - 1) {
        goNext();
      } else {
        runAIReview();
      }
    }
  };

  const resetSeries = () => {
    playLaser();
    setReviews((prev) => {
      const next = { ...prev };
      for (const ex of list) delete next[ex.id];
      return next;
    });
    setInputs((prev) => {
      const next = { ...prev };
      for (const ex of list) delete next[ex.id];
      return next;
    });
    setIndex(0);
  };

  return (
    <div className="view steps-view">
      <section className="panel steps-hero">
        <div className="steps-hero-copy">
          <div className="eyebrow">Teclado + Revisión IA en vivo</div>
          <h1>
            Pasos Simples <span className="gradient-text">10 + 10</span>
          </h1>
          <p>
            Escribí tus respuestas directamente con el teclado (números, signos y fracciones como{' '}
            <code>3/5</code> o <code>-9/8</code>). La IA analiza tu entrada en cada ejercicio y
            despliega los pasos animados.
          </p>
        </div>

        <div className="steps-series-tabs">
          <button
            type="button"
            className={`series-tab ${series === 'zero' ? 'active' : ''}`}
            onClick={() => switchSeries('zero')}
          >
            <Icon name="orbit" size={16} />
            <div>
              <strong>Nivel 0 · Desde Cero</strong>
              <small>10 ejercicios sin base previa</small>
            </div>
          </button>
          <button
            type="button"
            className={`series-tab ${series === 'simple' ? 'active' : ''}`}
            onClick={() => switchSeries('simple')}
          >
            <Icon name="bolt" size={16} />
            <div>
              <strong>Nivel 1 · Básico</strong>
              <small>10 ejercicios del cursillo</small>
            </div>
          </button>
          <button
            type="button"
            className={`series-tab ${series === 'challenge' ? 'active' : ''}`}
            onClick={() => switchSeries('challenge')}
          >
            <Icon name="brain" size={16} />
            <div>
              <strong>Nivel 2 · Desafío</strong>
              <small>10 ejercicios de examen</small>
            </div>
          </button>
        </div>
      </section>

      <section className="panel steps-progress-panel">
        <div className="steps-progress-head">
          <span>
            Ejercicio <strong>{index + 1}</strong> de {list.length} ·{' '}
            <em style={{ color: '#34d399' }}>{solvedCount}/10 validados</em>
          </span>
          <div className="preset-row">
            <Pill icon="bolt" color="#fde047">+{exercise.xp} XP</Pill>
            <button type="button" className="chip" onClick={resetSeries} title="Reiniciar serie">
              <Icon name="refresh" size={13} /> Reiniciar
            </button>
          </div>
        </div>
        <Bar value={(solvedCount / list.length) * 100} color="#34d399" height={6} />
        <div className="steps-dots" role="tablist" aria-label="Selector de ejercicios">
          {list.map((ex, i) => {
            const rev = reviews[ex.id];
            const cls = rev ? (rev.isCorrect ? 'ok' : 'err') : '';
            return (
              <button
                key={ex.id}
                type="button"
                className={`step-dot ${i === index ? 'current' : ''} ${cls}`}
                onClick={() => setIndex(i)}
                title={`Ejercicio ${i + 1}: ${ex.topic}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </section>

      <div className="steps-workspace">
        <section className="panel steps-card">
          <div className="steps-card-top">
            <div className="preset-row">
              <Pill color={series === 'zero' ? '#22d3ee' : series === 'simple' ? '#34d399' : '#a78bfa'}>
                {series === 'zero'
                  ? 'Nivel 0 · Desde Cero'
                  : series === 'simple'
                    ? 'Nivel 1 · Básico'
                    : 'Nivel 2 · Desafío'}
              </Pill>
              <Pill color="#22d3ee">{exercise.topic}</Pill>
            </div>
            <span className="steps-kbd-hint">Tip: presioná <kbd>Enter</kbd> para revisar o avanzar</span>
          </div>

          <h2 className="steps-prompt">
            <RichText text={exercise.prompt} />
          </h2>

          <div className="steps-guide-box">
            <div className="steps-guide-head">
              <Icon name="book" size={14} />
              <strong>Cómo resolverlo (sin adivinar)</strong>
            </div>
            <p>{exercise.guide}</p>
            <div className="steps-mini-example">{exercise.miniExample}</div>
          </div>

          <div className={`steps-input-wrap ${scanning ? 'scanning' : ''} ${currentReview ? currentReview.tone : ''}`}>
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              className="steps-input"
              value={currentInput}
              onChange={(e) => setAnswerText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={exercise.placeholder}
              aria-label="Escribí tu respuesta matemática"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={runAIReview}
              disabled={scanning}
            >
              <Icon name="spark" size={16} />
              {scanning ? 'IA analizando...' : 'Revisar con IA'}
            </button>
            {scanning ? <div className="ai-scan-beam" aria-hidden="true" /> : null}
          </div>

          <div className="math-keypad" aria-label="Teclado numérico rápido">
            {KEYPAD_KEYS.map((k) => (
              <button key={k} type="button" className="keypad-btn" onClick={() => appendKey(k)}>
                {k}
              </button>
            ))}
            <button type="button" className="keypad-btn wide" onClick={backspaceKey}>
              ⌫ Borrar
            </button>
            <button
              type="button"
              className="keypad-btn wide"
              onClick={() => {
                setShowHint((h) => !h);
                playClick();
              }}
            >
              <Icon name="bulb" size={14} /> Pista
            </button>
          </div>

          {showHint ? (
            <div className="theory-note step-reveal">
              <Icon name="bulb" size={15} />
              <span>{exercise.hint}</span>
            </div>
          ) : null}

          <div className="steps-nav-row">
            <button type="button" className="btn btn-ghost" onClick={goPrev} disabled={index === 0}>
              ← Anterior
            </button>
            <span className="steps-counter">
              {attemptedCount}/10 intentados
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={goNext}
              disabled={index >= list.length - 1}
            >
              Siguiente →
            </button>
          </div>
        </section>

        <section className="panel ai-review-panel">
          <SectionTitle
            eyebrow="Tutor IA en vivo"
            title="Revisión y pasos simples"
            description="La IA evalúa tu número o fracción y te muestra exactamente el camino."
          />

          {scanning ? (
            <div className="ai-loading-box">
              <div className="ai-pulse-orb" />
              <p>Analizando tu respuesta paso a paso...</p>
            </div>
          ) : currentReview ? (
            <div key={`${exercise.id}-${currentReview.normalizedInput}`} className={`ai-verdict-card ${currentReview.tone}`}>
              <div className="ai-verdict-head">
                <span className="ai-verdict-badge">
                  <Icon name={currentReview.isCorrect ? 'check' : 'brain'} size={16} />
                  {currentReview.headline}
                </span>
                {currentReview.isCorrect ? (
                  <Pill icon="bolt" color="#fde047">+{exercise.xp} XP</Pill>
                ) : null}
              </div>
              <p className="ai-verdict-body">{currentReview.diagnosis}</p>

              <div className="ai-steps-list">
                {exercise.steps.map((st, idx) => (
                  <article
                    key={st.title}
                    className="ai-step-item"
                    style={{ animationDelay: `${idx * 110}ms` }}
                  >
                    <div className="ai-step-num">{idx + 1}</div>
                    <div className="ai-step-copy">
                      <strong>{st.title}</strong>
                      <p>{st.detail}</p>
                      {st.latex ? <FormulaCard formula={st.latex} /> : null}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="ai-idle-box">
              <Icon name="brain" size={28} />
              <strong>Listo para revisar</strong>
              <p>
                Escribí tu resultado con el teclado y presioná <kbd>Enter</kbd>. Si cometés un error
                típico (como olvidar un signo o el doble producto), la IA te avisa dónde estuvo.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
