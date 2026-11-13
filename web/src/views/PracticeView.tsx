import React, { useEffect, useMemo, useState } from 'react';
import { ALL_QUESTIONS, WORLDS, getQuestionsForWorld } from '../data/curriculum';
import type { Question } from '../data/types';
import { useLearning } from '../state/LearningContext';
import Icon from '../components/ui/Icon';
import { Bar, Pill, ProgressRing, SectionTitle } from '../components/ui/Primitives';
import RichText from '../components/ui/RichText';
import { burstConfetti } from '../lib/fx';
import { playClick, playCorrect, playWrong } from '../lib/sfx';

type Phase = 'setup' | 'run' | 'done';
type Mode = 'mixta' | 'mundo' | 'errores';
type Difficulty = 'all' | '1' | '2' | '3';

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function formatTime(seconds: number): string {
  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

interface ResultRow {
  question: Question;
  chosen: number;
  correct: boolean;
}

export default function PracticeView() {
  const { state, finishQuiz, openLesson, navigate, recordQuestion, pushToast } = useLearning();

  const [phase, setPhase] = useState<Phase>('setup');
  const [mode, setMode] = useState<Mode>('mixta');
  const [worldId, setWorldId] = useState<string>(WORLDS[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const correctCount = results.filter((row) => row.correct).length;
  const question = questions[current];

  const mistakeCount = useMemo(
    () => ALL_QUESTIONS.filter((item) => {
      const stat = state.questionStats[item.id];
      return stat && stat.attempts > 0 && stat.correct < stat.attempts;
    }).length,
    [state.questionStats]
  );

  useEffect(() => {
    if (phase !== 'run') return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  const buildPool = (): Question[] => {
    let pool = ALL_QUESTIONS;
    if (mode === 'mundo') pool = getQuestionsForWorld(worldId);
    if (mode === 'errores') {
      pool = ALL_QUESTIONS.filter((item) => {
        const stat = state.questionStats[item.id];
        return stat && stat.attempts > 0 && stat.correct < stat.attempts;
      });
      if (pool.length < 4) pool = ALL_QUESTIONS;
    }
    if (difficulty !== 'all') {
      const filtered = pool.filter((item) => item.difficulty === Number(difficulty));
      if (filtered.length >= 4) pool = filtered;
    }
    if (pool.length === 0) pool = ALL_QUESTIONS;
    return shuffle(pool).slice(0, Math.min(10, pool.length));
  };

  const start = () => {
    const pool = buildPool();
    if (pool.length === 0) {
      pushToast({ title: 'No hay preguntas', detail: 'Probá otro filtro.', tone: 'warning' });
      return;
    }
    setQuestions(pool);
    setCurrent(0);
    setSelected(null);
    setChecked(false);
    setResults([]);
    setCombo(0);
    setMaxCombo(0);
    setElapsed(0);
    setPhase('run');
    playClick();
  };

  const check = () => {
    if (!question || selected === null || checked) return;
    const isCorrect = selected === question.correct;
    setChecked(true);
    setResults((rows) => [...rows, { question, chosen: selected, correct: isCorrect }]);
    recordQuestion(question, isCorrect);
    if (isCorrect) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((value) => Math.max(value, nextCombo));
      playCorrect(nextCombo);
    } else {
      setCombo(0);
      playWrong();
    }
  };

  const next = () => {
    if (current >= questions.length - 1) {
      const finalCorrect = results.filter((row) => row.correct).length;
      finishQuiz(finalCorrect, questions.length);
      if (finalCorrect === questions.length) burstConfetti();
      setPhase('done');
      return;
    }
    setCurrent((value) => value + 1);
    setSelected(null);
    setChecked(false);
  };

  const restart = () => {
    setPhase('setup');
    setQuestions([]);
    setResults([]);
    setElapsed(0);
  };

  if (phase === 'run' && question) {
    const progress = (current / questions.length) * 100;
    return (
      <div className="view practice-view">
        <div className="practice-topbar">
          <button className="text-button" onClick={restart}><Icon name="chevron" size={14} className="flip" /> Salir</button>
          <div className="practice-topbar-mid">
            <span className="practice-counter">Pregunta {current + 1} de {questions.length}</span>
            <Bar value={progress} color="#34d399" height={6} />
          </div>
          <div className="practice-topbar-right">
            <Pill icon="clock" color="#94a3b8">{formatTime(elapsed)}</Pill>
            <Pill icon="flame" color="#fb923c">x{combo} combo</Pill>
          </div>
        </div>

        <section className="panel practice-card">
          <div className="practice-question-head">
            <div>
              <div className="eyebrow">Práctica activa · {mode === 'mundo' ? WORLDS.find((w) => w.id === worldId)?.name : mode === 'errores' ? 'Tus errores' : 'Mezcla total'}</div>
              <div className="question-meta">
                <Pill color={question.difficulty === 1 ? '#34d399' : question.difficulty === 2 ? '#fde047' : '#fb7185'}>nivel {question.difficulty}</Pill>
                {question.tags?.slice(0, 3).map((tag) => <span key={tag} className="concept-chip">{tag}</span>)}
              </div>
            </div>
            <ProgressRing value={(results.length / questions.length) * 100} size={66} color="#34d399">
              <span className="ring-small">{results.length}/{questions.length}</span>
            </ProgressRing>
          </div>

          <h2 className="practice-prompt"><RichText text={question.prompt} /></h2>

          <div className="option-list">
            {question.options.map((option, optionIndex) => {
              const isSelected = selected === optionIndex;
              const isCorrectOption = optionIndex === question.correct;
              const stateClass = !checked ? (isSelected ? 'selected' : '') : isCorrectOption ? 'correct' : isSelected ? 'wrong' : 'muted';
              return (
                <button
                  key={`${question.id}-${optionIndex}`}
                  className={`option ${stateClass}`}
                  onClick={() => { if (!checked) { setSelected(optionIndex); playClick(); } }}
                >
                  <span className="option-letter">{LETTERS[optionIndex]}</span>
                  <span className="option-text"><RichText text={option} inline /></span>
                  {checked && isCorrectOption ? <Icon name="check" size={17} /> : null}
                  {checked && isSelected && !isCorrectOption ? <Icon name="close" size={17} /> : null}
                </button>
              );
            })}
          </div>

          {!checked ? (
            <div className="question-actions">
              <span className="practice-hint">Elegí una opción y comprobá. Las respuestas suman XP al instante.</span>
              <button className="btn btn-primary" onClick={check} disabled={selected === null}>
                <Icon name="check" size={15} /> Comprobar
              </button>
            </div>
          ) : (
            <div className={`answer-feedback ${results[results.length - 1]?.correct ? 'ok' : 'bad'}`}>
              <div className="feedback-head">
                <Icon name={results[results.length - 1]?.correct ? 'check' : 'refresh'} size={17} />
                <strong>{results[results.length - 1]?.correct ? '¡Correcto! +XP' : 'Revisá esta idea'}</strong>
              </div>
              <p><RichText text={question.explanation} /></p>
              <div className="question-actions">
                <span className="practice-hint">Racha actual: {combo} · Mejor racha: {maxCombo}</span>
                <button className="btn btn-primary" onClick={next}>
                  {current >= questions.length - 1 ? 'Ver resultados' : 'Siguiente'} <Icon name="arrow" size={15} />
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="practice-rail">
          {questions.map((item, index) => {
            const row = results.find((result) => result.question.id === item.id);
            return (
              <span
                key={item.id}
                className={`practice-pip ${index === current ? 'current' : ''} ${row ? (row.correct ? 'ok' : 'bad') : ''}`}
                title={`Pregunta ${index + 1}`}
              >
                {row ? (row.correct ? '✓' : '×') : index + 1}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const finalAccuracy = questions.length === 0 ? 0 : Math.round((correctCount / questions.length) * 100);
    const tone = finalAccuracy >= 80 ? '#34d399' : finalAccuracy >= 60 ? '#22d3ee' : '#fb7185';
    return (
      <div className="view practice-view">
        <section className="panel practice-summary">
          <ProgressRing value={finalAccuracy} size={150} stroke={10} color={tone}>
            <div className="ring-inner">
              <strong>{finalAccuracy}%</strong>
              <span>{correctCount}/{questions.length}</span>
            </div>
          </ProgressRing>
          <div className="practice-summary-copy">
            <div className="eyebrow">Práctica completada</div>
            <h1>{finalAccuracy >= 80 ? 'Precisión de francotirador' : finalAccuracy >= 60 ? 'Vas por buen camino' : 'Toca reforzar'}</h1>
            <p>
              {finalAccuracy >= 80
                ? 'Los conceptos están sólidos. Subí la dificultad o entrá a un simulacro cronometrado.'
                : finalAccuracy >= 60
                  ? 'Buen resultado. Mirá las preguntas falladas y volvé al laboratorio del tema.'
                  : 'No pasa nada: los errores son el mapa de lo que hay que repasar. Revisá las explicaciones y reintentá.'}
            </p>
            <div className="lesson-result-stats">
              <Pill icon="check" color="#34d399">{correctCount} {correctCount === 1 ? 'correcta' : 'correctas'}</Pill>
              <Pill icon="clock" color="#94a3b8">{formatTime(elapsed)}</Pill>
              <Pill icon="flame" color="#fb923c">mejor racha x{maxCombo}</Pill>
            </div>
            <div className="lesson-result-actions">
              <button className="btn btn-primary" onClick={start}>
                <Icon name="refresh" size={16} /> Otra ronda
              </button>
              <button className="btn btn-ghost" onClick={restart}>
                <Icon name="target" size={16} /> Cambiar filtros
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('exam')}>
                <Icon name="trophy" size={16} /> Simulacro
              </button>
            </div>
          </div>
        </section>

        <section className="panel practice-review">
          <SectionTitle eyebrow="Revisión" title="Pregunta por pregunta" description="Las falladas son las que más te van a hacer crecer." />
          <div className="review-list">
            {results.map((row, index) => (
              <article key={row.question.id} className={`review-row ${row.correct ? 'ok' : 'bad'}`}>
                <span className="review-index">{row.correct ? '✓' : '×'}</span>
                <div>
                  <div className="review-prompt"><RichText text={row.question.prompt} /></div>
                  <div className="review-answer">
                    Tu respuesta: <strong>{LETTERS[row.chosen]}</strong> · Correcta: <strong>{LETTERS[row.question.correct]}</strong>
                  </div>
                  <details>
                    <summary>Ver explicación</summary>
                    <p><RichText text={row.question.explanation} /></p>
                  </details>
                </div>
                <span className="review-number">{index + 1}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const selectedWorld = WORLDS.find((world) => world.id === worldId) ?? WORLDS[0];

  return (
    <div className="view practice-view">
      <section className="practice-setup-hero">
        <div>
          <div className="eyebrow">Entrenamiento libre</div>
          <h1>Práctica <span className="gradient-text">rápida</span></h1>
          <p>
            Diez preguntas, corrección inmediata y explicación en cada respuesta. Elegí el foco:
            mezcla total, un mundo específico o tus propios errores.
          </p>
          <div className="practice-hero-stats">
            <Pill icon="target" color="#34d399">{ALL_QUESTIONS.length} preguntas disponibles</Pill>
            <Pill icon="refresh" color="#fb7185">{mistakeCount} para repasar</Pill>
            <Pill icon="bolt" color="#fde047">XP por respuesta</Pill>
          </div>
        </div>
        <div className="practice-setup-orb">
          <div className="practice-orb-ring" />
          <div className="practice-orb-core">
            <strong>10</strong>
            <span>preguntas</span>
          </div>
        </div>
      </section>

      <div className="practice-setup-grid">
        <section className="panel setup-panel">
          <SectionTitle eyebrow="Paso 1" title="Elegí el modo" />
          <div className="mode-grid">
            {[
              { id: 'mixta' as Mode, title: 'Mezcla total', detail: 'Todo el currículo, sin aviso.', icon: 'layers' as const, color: '#22d3ee' },
              { id: 'mundo' as Mode, title: 'Un mundo', detail: 'Concentrate en un tema.', icon: 'orbit' as const, color: '#a78bfa' },
              { id: 'errores' as Mode, title: 'Mis errores', detail: 'Solo lo que fallaste.', icon: 'refresh' as const, color: '#fb7185' }
            ].map((item) => (
              <button
                key={item.id}
                className={`mode-card ${mode === item.id ? 'active' : ''}`}
                style={{ '--mode-color': item.color } as React.CSSProperties}
                onClick={() => setMode(item.id)}
              >
                <span className="mode-icon" style={{ color: item.color, background: `${item.color}18` }}>
                  <Icon name={item.icon} size={20} />
                </span>
                <strong>{item.title}</strong>
                <small>{item.detail}</small>
              </button>
            ))}
          </div>

          {mode === 'mundo' ? (
            <div className="setup-sub">
              <span className="slider-label">Mundo</span>
              <div className="world-picker">
                {WORLDS.map((world) => (
                  <button
                    key={world.id}
                    className={`chip ${worldId === world.id ? 'active' : ''}`}
                    style={worldId === world.id ? { borderColor: world.color, color: world.color } : undefined}
                    onClick={() => setWorldId(world.id)}
                  >
                    <Icon name={world.icon} size={13} /> {world.name}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="setup-sub">
            <span className="slider-label">Dificultad</span>
            <div className="chip-row">
              {[
                { id: 'all' as Difficulty, label: 'Todas' },
                { id: '1' as Difficulty, label: 'Nivel 1 · base' },
                { id: '2' as Difficulty, label: 'Nivel 2 · medio' },
                { id: '3' as Difficulty, label: 'Nivel 3 · desafío' }
              ].map((item) => (
                <button key={item.id} className={`chip ${difficulty === item.id ? 'active' : ''}`} onClick={() => setDifficulty(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="panel setup-summary">
          <SectionTitle eyebrow="Paso 2" title="Confirmá y arrancá" />
          <div className="setup-summary-list">
            <div><span>Modo</span><strong>{mode === 'mixta' ? 'Mezcla total' : mode === 'mundo' ? selectedWorld.name : 'Mis errores'}</strong></div>
            <div><span>Preguntas</span><strong>10</strong></div>
            <div><span>Dificultad</span><strong>{difficulty === 'all' ? 'Todas' : `Nivel ${difficulty}`}</strong></div>
            <div><span>Tiempo estimado</span><strong>8-12 min</strong></div>
            <div><span>Recompensa</span><strong>XP + bonus por precisión</strong></div>
          </div>
          <button className="btn btn-primary btn-block" onClick={start}>
            <Icon name="play" size={16} /> Empezar práctica
          </button>
          <button className="btn btn-ghost btn-block" onClick={() => openLesson('reales-conjuntos')}>
            <Icon name="book" size={16} /> Repasar antes
          </button>
          <div className="lab-footnote">
            <Icon name="bulb" size={15} />
            <span>Si una pregunta te traba más de 30 segundos, marcá y seguí. Al final vas a poder revisar todo.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
