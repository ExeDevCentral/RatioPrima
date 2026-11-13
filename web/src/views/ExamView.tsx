import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CONTENT_LESSONS, getLesson, simulacros } from '../data/curriculum';
import type { Question } from '../data/types';
import { useLearning } from '../state/LearningContext';
import Icon from '../components/ui/Icon';
import { Pill, ProgressRing, SectionTitle, Modal } from '../components/ui/Primitives';
import RichText from '../components/ui/RichText';
import { playClick, playCorrect, playLaser, playWrong } from '../lib/sfx';

type Phase = 'setup' | 'run' | 'done';

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
  const mm = Math.floor(Math.max(0, seconds) / 60).toString().padStart(2, '0');
  const ss = Math.max(0, seconds % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

interface ExamDefinition {
  id: string;
  title: string;
  description: string;
  minutes: number;
  questions: Question[];
  worldId?: string;
  accent: string;
  icon: 'trophy' | 'target' | 'seal' | 'flag';
}

interface ExamReview {
  question: Question;
  chosen: number | undefined;
  correct: boolean;
}

export default function ExamView() {
  const { state, submitExam, openLesson, navigate, pushToast } = useLearning();

  const [phase, setPhase] = useState<Phase>('setup');
  const [exam, setExam] = useState<ExamDefinition | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [flagged, setFlagged] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [review, setReview] = useState<ExamReview[]>([]);
  const [score, setScore] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const submittedRef = useRef(false);

  const mixedQuestions = useMemo(() => {
    const pool = CONTENT_LESSONS.flatMap((lesson) => lesson.questions);
    return shuffle(pool).slice(0, 10);
  }, []);

  const definitions = useMemo<ExamDefinition[]>(() => {
    const mixed: ExamDefinition = {
      id: 'examen-integral',
      title: 'Simulacro integral',
      description: 'Diez preguntas mezcladas de los siete mundos de contenido, con tiempo límite.',
      minutes: 15,
      questions: mixedQuestions,
      accent: '#fde047',
      icon: 'trophy'
    };
    const arena = simulacros.lessons.map((lesson, index) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.tagline,
      minutes: index === 3 ? 20 : 10,
      questions: lesson.questions,
      worldId: lesson.worldId,
      accent: index === 3 ? '#fb7185' : '#a78bfa',
      icon: (index === 3 ? 'seal' : index === 2 ? 'flag' : 'target') as ExamDefinition['icon']
    }));
    return [mixed, ...arena];
  }, [mixedQuestions]);

  useEffect(() => {
    if (phase !== 'run') return;
    if (remaining <= 0) {
      finishExam(true);
      return;
    }
    const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, remaining]);

  const start = (definition: ExamDefinition) => {
    setExam(definition);
    setAnswers({});
    setFlagged([]);
    setCurrent(0);
    setRemaining(definition.minutes * 60);
    setReview([]);
    setScore(0);
    submittedRef.current = false;
    setPhase('run');
    playLaser();
  };

  const finishExam = (auto = false) => {
    if (!exam || submittedRef.current) return;
    submittedRef.current = true;
    const rows: ExamReview[] = exam.questions.map((question) => ({
      question,
      chosen: answers[question.id],
      correct: answers[question.id] === question.correct
    }));
    const hits = rows.filter((row) => row.correct).length;
    const percent = Math.round((hits / Math.max(1, exam.questions.length)) * 100);
    setReview(rows);
    setScore(hits);
    setPhase('done');
    setConfirmOpen(false);
    submitExam(
      {
        id: exam.id,
        score: hits,
        total: exam.questions.length,
        passed: percent >= 60,
        worldId: exam.worldId
      },
      rows.map((row) => ({ question: row.question, correct: row.correct }))
    );
    if (percent >= 60) {
      playCorrect(3);
    } else {
      playWrong();
    }
    if (auto) {
      pushToast({ title: 'Tiempo agotado', detail: 'El simulacro se entregó automáticamente.', tone: 'warning' });
    }
  };

  const question = exam?.questions[current];
  const answered = Object.keys(answers).length;
  const total = exam?.questions.length ?? 0;
  const passes = state.examResults.filter((result) => result.passed).length;

  if (phase === 'run' && exam && question) {
    const minutesLeft = remaining / 60;
    const timerColor = minutesLeft < 2 ? '#fb7185' : minutesLeft < 5 ? '#fde047' : '#34d399';
    return (
      <div className="view exam-view">
        <header className="exam-runbar">
          <div className="exam-runbar-title">
            <span className="eyebrow">Simulacro en curso</span>
            <strong>{exam.title}</strong>
          </div>
          <div className="exam-runbar-stats">
            <Pill icon="target" color="#22d3ee">{answered}/{total} respondidas</Pill>
            <Pill icon="flag" color="#fb923c">{flagged.length} marcadas</Pill>
            <div className="exam-timer" style={{ color: timerColor, borderColor: `${timerColor}55`, background: `${timerColor}12` }}>
              <Icon name="clock" size={16} />
              <strong>{formatTime(remaining)}</strong>
            </div>
          </div>
        </header>

        <div className="exam-layout">
          <aside className="panel exam-navigator">
            <SectionTitle eyebrow="Mapa" title="Preguntas" />
            <div className="exam-dots">
              {exam.questions.map((item, index) => (
                <button
                  key={item.id}
                  className={`exam-dot ${current === index ? 'current' : ''} ${answers[item.id] !== undefined ? 'answered' : ''} ${flagged.includes(item.id) ? 'flagged' : ''}`}
                  onClick={() => setCurrent(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="exam-legend">
              <span><i className="legend-dot available" /> respondida</span>
              <span><i className="legend-dot flagged" /> marcada</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => setConfirmOpen(true)}>
              <Icon name="flag" size={15} /> Entregar examen
            </button>
            <button
              className="btn btn-ghost btn-block"
              onClick={() => {
                setAnswers({});
                setFlagged([]);
                setCurrent(0);
                pushToast({ title: 'Examen reiniciado', detail: 'Se borraron las respuestas.', tone: 'info' });
              }}
            >
              <Icon name="refresh" size={15} /> Reiniciar
            </button>
          </aside>

          <section className="panel exam-question">
            <div className="question-meta">
              <span>Pregunta {current + 1} de {total}</span>
              <div className="exam-question-tags">
                <Pill color={question.difficulty === 1 ? '#34d399' : question.difficulty === 2 ? '#fde047' : '#fb7185'}>
                  nivel {question.difficulty}
                </Pill>
                <button
                  className={`btn btn-ghost btn-sm ${flagged.includes(question.id) ? 'flagged' : ''}`}
                  onClick={() => {
                    setFlagged((currentFlags) =>
                      currentFlags.includes(question.id)
                        ? currentFlags.filter((id) => id !== question.id)
                        : [...currentFlags, question.id]
                    );
                    playClick();
                  }}
                >
                  <Icon name="flag" size={14} /> {flagged.includes(question.id) ? 'Desmarcar' : 'Marcar para revisar'}
                </button>
              </div>
            </div>

            <h2 className="practice-prompt"><RichText text={question.prompt} /></h2>
            <div className="option-list">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                return (
                  <button
                    key={`${question.id}-${optionIndex}`}
                    className={`option ${selected ? 'selected' : ''}`}
                    onClick={() => {
                      setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
                      playClick();
                    }}
                  >
                    <span className="option-letter">{LETTERS[optionIndex]}</span>
                    <span className="option-text"><RichText text={option} inline /></span>
                  </button>
                );
              })}
            </div>

            <div className="exam-question-actions">
              <button className="btn btn-ghost" onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>
                <Icon name="chevron" size={15} className="flip" /> Anterior
              </button>
              <span className="practice-hint">Sin corrección hasta entregar. Administrá tu tiempo.</span>
              {current < total - 1 ? (
                <button className="btn btn-primary" onClick={() => setCurrent((value) => Math.min(total - 1, value + 1))}>
                  Siguiente <Icon name="arrow" size={15} />
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => setConfirmOpen(true)}>
                  <Icon name="flag" size={15} /> Entregar
                </button>
              )}
            </div>
          </section>
        </div>

        <Modal
          open={confirmOpen}
          title="¿Entregar el simulacro?"
          onClose={() => setConfirmOpen(false)}
          footer={
            <div className="question-actions">
              <button className="btn btn-ghost" onClick={() => setConfirmOpen(false)}>Seguir resolviendo</button>
              <button className="btn btn-primary" onClick={() => finishExam(false)}>
                <Icon name="check" size={15} /> Entregar ahora
              </button>
            </div>
          }
        >
          <p>Respondiste <strong>{answered} de {total}</strong> preguntas. Las que queden en blanco cuentan como incorrectas.</p>
          {flagged.length > 0 ? <p className="modal-warning">Tenés {flagged.length} pregunta(s) marcada(s) para revisar.</p> : null}
        </Modal>
      </div>
    );
  }

  if (phase === 'done' && exam) {
    const percent = Math.round((score / Math.max(1, exam.questions.length)) * 100);
    const passed = percent >= 60;
    const tone = passed ? '#34d399' : '#fb7185';
    return (
      <div className="view exam-view">
        <section className="panel exam-result-hero" style={{ borderColor: `${tone}44` }}>
          <ProgressRing value={percent} size={160} stroke={11} color={tone}>
            <div className="ring-inner">
              <strong>{percent}%</strong>
              <span>{score}/{exam.questions.length}</span>
            </div>
          </ProgressRing>
          <div className="exam-result-copy">
            <div className="eyebrow">Resultado del simulacro</div>
            <h1 style={{ color: tone }}>{passed ? 'Aprobado' : 'Todavía no'}</h1>
            <p>
              {passed
                ? 'Superaste el 60% requerido. Anotá las preguntas falladas: son las únicas que necesitan otra pasada.'
                : 'El objetivo de un simulacro es diagnóstico, no castigo. Revisá cada explicación y volvé a intentarlo en 24 horas.'}
            </p>
            <div className="lesson-result-stats">
              <Pill icon="check" color="#34d399">{score} {score === 1 ? 'correcta' : 'correctas'}</Pill>
              <Pill icon="close" color="#fb7185">{exam.questions.length - score} falladas</Pill>
              <Pill icon="clock" color="#94a3b8">{exam.minutes} min límite</Pill>
              <Pill icon="star" color="#fde047">{exam.title}</Pill>
            </div>
            <div className="lesson-result-actions">
              <button className="btn btn-primary" onClick={() => start(exam)}>
                <Icon name="refresh" size={16} /> Reintentar
              </button>
              <button className="btn btn-ghost" onClick={() => setPhase('setup')}>
                <Icon name="target" size={16} /> Otros simulacros
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('map')}>
                <Icon name="map" size={16} /> Volver al mapa
              </button>
            </div>
          </div>
        </section>

        <section className="panel practice-review">
          <SectionTitle eyebrow="Corrección" title="Pregunta por pregunta" description="Leé la explicación incluso de las que acertaste." />
          <div className="review-list">
            {review.map((row, index) => (
              <article key={row.question.id} className={`review-row ${row.correct ? 'ok' : 'bad'}`}>
                <span className="review-index">{row.correct ? '✓' : '×'}</span>
                <div>
                  <div className="review-prompt"><RichText text={row.question.prompt} /></div>
                  <div className="review-answer">
                    Tu respuesta: <strong>{row.chosen === undefined ? 'sin responder' : LETTERS[row.chosen]}</strong> · Correcta: <strong>{LETTERS[row.question.correct]}</strong>
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

  return (
    <div className="view exam-view">
      <section className="exam-hero">
        <div>
          <div className="eyebrow">La Arena · Mundo 08</div>
          <h1>Simulacros de <span className="gradient-text">ingreso</span></h1>
          <p>
            Cinco pruebas con el formato del examen. Tiempo límite, sin corrección inmediata y
            diagnóstico detallado al final. Aprobar requiere 60%.
          </p>
          <div className="practice-hero-stats">
            <Pill icon="trophy" color="#fde047">{passes} aprobados</Pill>
            <Pill icon="target" color="#22d3ee">{state.examResults.length} intentos</Pill>
            <Pill icon="clock" color="#94a3b8">10 a 20 minutos</Pill>
          </div>
        </div>
        <div className="exam-hero-seal">
          <div className="seal-ring" />
          <Icon name="seal" size={54} />
          <span>60% para aprobar</span>
        </div>
      </section>

      <div className="exam-grid">
        {definitions.map((definition) => (
          <article
            key={definition.id}
            className="panel exam-card"
            style={{ '--exam-color': definition.accent } as React.CSSProperties}
          >
            <div className="exam-card-top">
              <span className="exam-card-icon" style={{ color: definition.accent, background: `${definition.accent}16` }}>
                <Icon name={definition.icon} size={22} />
              </span>
              <Pill color={definition.accent}>{definition.questions.length} preguntas</Pill>
            </div>
            <h3>{definition.title}</h3>
            <p>{definition.description}</p>
            <div className="exam-card-meta">
              <span><Icon name="clock" size={14} /> {definition.minutes} min</span>
              <span><Icon name="bolt" size={14} /> XP al aprobar</span>
              <span><Icon name="target" size={14} /> 60% requerido</span>
            </div>
            <button className="btn btn-primary btn-block" onClick={() => start(definition)}>
              <Icon name="play" size={15} /> Iniciar simulacro
            </button>
          </article>
        ))}
      </div>

      <section className="panel exam-history">
        <SectionTitle
          eyebrow="Historial"
          title="Tus intentos"
          description="Cada intento guarda el puntaje y el resultado. La mejora se ve en la tendencia."
          right={<button className="btn btn-ghost btn-sm" onClick={() => openLesson('simulacros-examen')}><Icon name="book" size={14} /> Examen final</button>}
        />
        {state.examResults.length === 0 ? (
          <div className="empty-state">
            <Icon name="flag" size={28} />
            <strong>Todavía no hay intentos</strong>
            <span>Empezá por el simulacro integral. No necesitás estar listo: necesitás datos.</span>
          </div>
        ) : (
          <div className="exam-history-list">
            {state.examResults.slice(0, 8).map((result, index) => {
              const percent = Math.round((result.score / Math.max(1, result.total)) * 100);
              const definition = definitions.find((item) => item.id === result.id);
              return (
                <div key={`${result.id}-${result.date}-${index}`} className="exam-history-row">
                  <span className={`exam-history-status ${result.passed ? 'ok' : 'bad'}`}>
                    <Icon name={result.passed ? 'check' : 'close'} size={15} />
                  </span>
                  <div>
                    <strong>{definition?.title ?? getLesson(result.id)?.title ?? 'Simulacro'}</strong>
                    <small>{result.date}</small>
                  </div>
                  <div className="exam-history-score">
                    <strong>{result.score}/{result.total}</strong>
                    <span>{percent}%</span>
                  </div>
                  <Pill color={result.passed ? '#34d399' : '#fb7185'}>{result.passed ? 'Aprobado' : 'A repasar'}</Pill>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel exam-tips">
        <div className="formula-panel-head"><Icon name="bulb" size={16} /><h3>Cómo rendir un simulacro</h3></div>
        <div className="tips-grid">
          {[
            { title: 'Primera pasada', detail: 'Resolvé las que sabés. Las dudosas, marcalas y seguí.' },
            { title: 'Segunda pasada', detail: 'Volvé a las marcadas con el tiempo que sobra.' },
            { title: 'Cierre', detail: 'Revisá signos, unidades y que hayas respondido todas.' },
            { title: 'Después', detail: 'Anotá cada error por tema. Ese es tu plan del día siguiente.' }
          ].map((tip, index) => (
            <div key={tip.title} className="tip-card">
              <span>{index + 1}</span>
              <strong>{tip.title}</strong>
              <p>{tip.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
