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
import { auditLearningProfile, canAdvanceFromSeries, nextExerciseSeries, seriesProgress, seriesUnlocked } from '../lib/exerciseAudit';
import Icon from '../components/ui/Icon';
import { Bar, Pill, SectionTitle } from '../components/ui/Primitives';
import RichText, { FormulaCard } from '../components/ui/RichText';
import MemoryAnchorCard from '../components/ui/MemoryAnchorCard';
import { burstConfetti } from '../lib/fx';
import { playClick, playLaser } from '../lib/sfx';

const KEYPAD_KEYS = ['7', '8', '9', '/', '4', '5', '6', '-', '1', '2', '3', '.', '0'];

export default function StepsPracticeView() {
  const { recordQuestion, pushToast, state } = useLearning();
  const [series, setSeries] = useState<StepSeriesId>('zero');
  const [index, setIndex] = useState(0);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [verdicts, setVerdicts] = useState<Record<string, AIReviewResult>>({});
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
  const storedStat = state.questionStats[exercise.id];
  const currentReview = verdicts[exercise.id];

  const savedSeriesProgress = useMemo(() => seriesProgress(series, state.questionStats), [series, state.questionStats]);
  const solvedCount = savedSeriesProgress.solved;
  const attemptedCount = useMemo(
    () => list.filter((ex) => (state.questionStats[ex.id]?.attempts ?? 0) > 0).length,
    [list, state.questionStats]
  );
  const audit = useMemo(() => auditLearningProfile(state.questionStats), [state.questionStats]);
  const nextSeries = nextExerciseSeries(series);
  const canAdvance = canAdvanceFromSeries(series, state.questionStats);
  const isSeriesComplete = attemptedCount === list.length;
  const seriesLabel = (id: StepSeriesId) => id === 'zero' ? 'Nivel 0' : id === 'simple' ? 'Nivel 1' : 'Nivel 2';

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
    if (!seriesUnlocked(series, state.questionStats) || !seriesUnlocked(nextSeries, state.questionStats)) {
      pushToast({
        title: 'Completá primero esta etapa',
        detail: 'Para pasar de nivel necesitás resolver al menos 8 de los 10 ejercicios.',
        tone: 'warning'
      });
      return;
    }
    playClick();
    setSeries(nextSeries);
    setIndex(0);
  };

  const setAnswerText = (val: string) => {
    setInputs((prev) => ({ ...prev, [exercise.id]: val }));
    setVerdicts((prev) => {
      if (!prev[exercise.id]) return prev;
      const next = { ...prev };
      delete next[exercise.id];
      return next;
    });
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
      if (!currentReview) {
        pushToast({ title: 'Auditoría pendiente', detail: 'Revisá tu respuesta antes de pasar al próximo ejercicio.', tone: 'warning' });
        return;
      }
      playClick();
      setIndex((i) => i + 1);
    } else if (index === list.length - 1 && !seriesProgress(series, state.questionStats).unlocked) {
      pushToast({ title: 'Primero completá esta etapa', detail: 'Auditar los 10 ejercicios habilita el siguiente nivel.', tone: 'warning' });
    }
  };

  const goPrev = () => {
    if (index > 0) {
      playClick();
      setIndex((i) => i - 1);
    }
  };

  const runAnswerAudit = () => {
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
      const previousCorrect = state.questionStats[exercise.id]?.correct ?? 0;
      const isNewAuditedAnswer = verdicts[exercise.id]?.normalizedInput !== result.normalizedInput;
      setVerdicts((prev) => ({ ...prev, [exercise.id]: result }));
      setScanning(false);
      if (isNewAuditedAnswer) {
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
          result.isCorrect && previousCorrect === 0 ? exercise.xp : 0
        );
      }

      if (result.isCorrect && previousCorrect === 0) {
        const nextSolved = list.filter(
          (ex) => ex.id === exercise.id || (state.questionStats[ex.id]?.correct ?? 0) > 0
        ).length;
        if (nextSolved === list.length) {
          burstConfetti();
          pushToast({
            title: `Etapa ${seriesLabel(series)} completada`,
            detail: 'Resolviste todos los ejercicios. Revisá tu auditoría y avanzá cuando estés listo.',
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
        runAnswerAudit();
      }
    }
  };

  const resetSeries = () => {
    playLaser();
    setInputs((prev) => {
      const next = { ...prev };
      for (const ex of list) delete next[ex.id];
      return next;
    });
    setVerdicts((prev) => {
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
          <div className="eyebrow">Ruta progresiva · Auditoría matemática local</div>
          <h1>
            Aprendé haciendo <span className="gradient-text">paso a paso</span>
          </h1>
          <p>
            Empezá desde las bases, resolvé problemas del ingreso y avanzá hacia desafíos. El corrector local
            compara respuestas y errores conocidos: no usa un modelo generativo ni envía datos a un servicio externo.
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
            className={`series-tab ${series === 'simple' ? 'active' : ''} ${!seriesUnlocked('zero', state.questionStats) ? 'locked' : ''}`}
            onClick={() => switchSeries('simple')}
            aria-disabled={!seriesUnlocked('zero', state.questionStats)}
          >
            <Icon name="bolt" size={16} />
            <div>
              <strong>Nivel 1 · Básico</strong>
              <small>{seriesProgress('simple', state.questionStats).solved}/10 resueltos · 8 desbloquean</small>
            </div>
          </button>
          <button
            type="button"
            className={`series-tab ${series === 'challenge' ? 'active' : ''} ${!seriesUnlocked('simple', state.questionStats) ? 'locked' : ''}`}
            onClick={() => switchSeries('challenge')}
            aria-disabled={!seriesUnlocked('simple', state.questionStats)}
          >
            <Icon name="brain" size={16} />
            <div>
              <strong>Nivel 2 · Desafío</strong>
              <small>{seriesProgress('challenge', state.questionStats).solved}/10 resueltos · 8 desbloquean</small>
            </div>
          </button>
        </div>
      </section>

      <section className="panel steps-progress-panel">
        <div className="steps-progress-head">
          <span>
            Ejercicio <strong>{index + 1}</strong> de {list.length} ·{' '}
            <em style={{ color: '#34d399' }}>{solvedCount}/10 resueltos</em>
            {nextSeries ? <small className="series-unlock-hint"> · {canAdvance ? 'Siguiente nivel disponible' : `Resolvé ${Math.max(0, 8 - solvedCount)} más para avanzar`}</small> : null}
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
            const stat = state.questionStats[ex.id];
            const cls = stat?.correct ? 'ok' : stat?.attempts ? 'err' : '';
            return (
              <button
                key={ex.id}
                type="button"
                disabled={i > index && !currentReview}
                className={`step-dot ${i === index ? 'current' : ''} ${cls}`}
                onClick={() => {
                  if (i > index && (state.questionStats[exercise.id]?.attempts ?? 0) === 0) {
                    pushToast({ title: 'Resolvé este ejercicio antes de seguir', detail: 'La ruta se recorre en orden para construir las bases paso a paso.', tone: 'warning' });
                    return;
                  }
                  setIndex(i);
                }}
                title={`Ejercicio ${i + 1}: ${ex.topic}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        {isSeriesComplete ? (
          <div className="exercise-audit-inline">
            <strong>Auditoría de la ruta</strong>
            <span>Fortalezas: {audit.strengths.length ? audit.strengths.join(', ') : 'aún sin datos suficientes'}.</span>
            <span>Para reforzar: {audit.weaknesses.length ? audit.weaknesses.join(', ') : 'sin debilidades concluyentes'}.</span>
            <span>En el historial: {audit.correct} aciertos · {audit.incorrect} errores · {audit.coveredTopics} temas con intentos</span>
            {nextSeries ? <button type="button" className="btn btn-primary btn-sm" disabled={!canAdvance} onClick={() => switchSeries(nextSeries)}>{canAdvance ? `Avanzar a ${seriesLabel(nextSeries)}` : 'Resolvé 8 de 10 para avanzar'} <Icon name="arrow" size={14} /></button> : null}
          </div>
        ) : null}
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
            <span className="steps-kbd-hint">Corrector local · presioná <kbd>Enter</kbd> para revisar o avanzar</span>
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
              onClick={runAnswerAudit}
              disabled={scanning}
            >
              <Icon name="spark" size={16} />
              {scanning ? 'Revisando...' : 'Auditar respuesta'}
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
            eyebrow="Corrector matemático local"
            title="Auditoría y pasos simples"
            description="Compara respuestas equivalentes y detecta errores frecuentes con reglas verificables."
          />

          {scanning ? (
            <div className="ai-loading-box">
              <div className="ai-pulse-orb" />
              <p>Comparando la respuesta con el resultado y los errores frecuentes...</p>
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
              <strong>Auditoría lista</strong>
              <p>
                Escribí tu resultado y presioná <kbd>Enter</kbd>. El corrector local compara la respuesta,
                admite equivalencias y detecta patrones de error definidos para el ejercicio.
              </p>
            </div>
          )}
        </section>
      </div>

      <MemoryAnchorCard key={exercise.topic} worldOrTopic={exercise.topic} compact />
    </div>
  );
}
