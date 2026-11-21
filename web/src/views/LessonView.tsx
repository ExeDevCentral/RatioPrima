import React, { useEffect, useMemo, useState } from 'react';
import {
  CONTENT_LESSONS,
  ALL_LESSONS,
  getLesson,
  getWorldOfLesson,
  nextLesson,
  lessonIndex
} from '../data/curriculum';
import type { Lesson, Question } from '../data/types';
import { useLearning } from '../state/LearningContext';
import Icon from '../components/ui/Icon';
import { Bar, Pill, ProgressRing, SectionTitle } from '../components/ui/Primitives';
import RichText, { FormulaCard } from '../components/ui/RichText';
import MemoryAnchorCard from '../components/ui/MemoryAnchorCard';
import LabRenderer, { LAB_META } from '../components/labs/LabRenderer';
import Math3DScene from '../components/labs/Math3DScene';
import GuidedAnimationStudio, { type StudioTopic } from '../components/labs/GuidedAnimationStudio';
import { burstConfetti } from '../lib/fx';
import { playClick, playCorrect, playLaser, playWrong } from '../lib/sfx';

type Phase = 'teoria' | 'lab' | 'pasos' | 'checkpoint';

const PHASES: Array<{ id: Phase; label: string; icon: 'book' | 'flask' | 'route' | 'target' }> = [
  { id: 'teoria', label: 'Teoría', icon: 'book' },
  { id: 'lab', label: 'Laboratorio', icon: 'flask' },
  { id: 'pasos', label: 'Pasos guiados', icon: 'route' },
  { id: 'checkpoint', label: 'Checkpoint', icon: 'target' }
];

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function studioTopicOf(worldId: string): StudioTopic {
  switch (worldId) {
    case 'trigonometria':
      return 'trig';
    case 'ecuaciones':
      return 'equations';
    case 'inecuaciones':
      return 'inequalities';
    case 'reales':
      return 'logic';
    default:
      return 'shapes';
  }
}

function worldColorOf(lesson: Lesson): string {
  return getWorldOfLesson(lesson.id)?.color ?? '#22d3ee';
}

export default function LessonView() {
  const { state, route, openLesson, navigate, recordQuestion, finishLesson, pushToast } = useLearning();
  const lessonId = route.lessonId ?? ALL_LESSONS[0].id;
  const lesson = getLesson(lessonId) ?? ALL_LESSONS[0];
  const world = getWorldOfLesson(lesson.id);
  const color = worldColorOf(lesson);
  const meta = LAB_META[lesson.lab];
  const index = lessonIndex(lesson.id);
  const next = nextLesson(lesson.id);
  const alreadyCompleted = state.completedLessons.includes(lesson.id);
  const bestScore = state.lessonBest[lesson.id];

  const [phase, setPhase] = useState<Phase>('teoria');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [current, setCurrent] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [justFinished, setJustFinished] = useState(false);
  const [activeTheory, setActiveTheory] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setPhase('teoria');
    setAnswers({});
    setChecked({});
    setResults({});
    setCurrent(0);
    setShowHint(false);
    setJustFinished(false);
    setActiveTheory(0);
    setActiveStep(0);
  }, [lesson.id]);

  const totalQuestions = lesson.questions.length;
  const answeredCount = Object.keys(checked).length;
  const correctCount = Object.values(results).filter(Boolean).length;
  const scorePercent = totalQuestions === 0 ? 100 : Math.round((correctCount / totalQuestions) * 100);
  const allChecked = answeredCount >= totalQuestions;
  const question = lesson.questions[current];

  const overall = Math.round(((index + 1) / ALL_LESSONS.length) * 100);

  const wording = useMemo(() => {
    if (scorePercent >= 90) return { title: 'Dominio total', detail: 'Podés explicar este tema a otra persona.', color: '#34d399' };
    if (scorePercent >= 70) return { title: 'Buen pulso', detail: 'La base está. Revisá el error y avanzá.', color: '#22d3ee' };
    if (scorePercent >= 40) return { title: 'Casi', detail: 'Volvé a la teoría y repetí el checkpoint.', color: '#fde047' };
    return { title: 'Necesita otra pasada', detail: 'No hay apuro: repetir es parte del juego.', color: '#fb7185' };
  }, [scorePercent]);

  const selectOption = (optionIndex: number) => {
    if (!question || checked[question.id]) return;
    playClick();
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
  };

  const checkAnswer = () => {
    if (!question || checked[question.id]) return;
    const chosen = answers[question.id];
    if (chosen === undefined) {
      pushToast({ title: 'Elegí una opción', detail: 'Tocá una de las alternativas antes de comprobar.', tone: 'warning' });
      return;
    }
    const correct = chosen === question.correct;
    setChecked((prev) => ({ ...prev, [question.id]: true }));
    setResults((prev) => ({ ...prev, [question.id]: correct }));
    recordQuestion(question, correct);
    if (correct) {
      playCorrect(1);
    } else {
      playWrong();
    }
  };

  const goNextQuestion = () => {
    if (current < totalQuestions - 1) {
      setCurrent((value) => value + 1);
      setShowHint(false);
    }
  };

  const complete = () => {
    finishLesson(lesson.id, scorePercent);
    setJustFinished(true);
    burstConfetti();
  };

  const phaseIndex = PHASES.findIndex((item) => item.id === phase);
  const nextPhase = PHASES[Math.min(PHASES.length - 1, phaseIndex + 1)];
  const prevPhase = PHASES[Math.max(0, phaseIndex - 1)];

  return (
    <div className="view lesson-view" style={{ '--lesson-color': color } as React.CSSProperties}>
      <div className="lesson-breadcrumb">
        <button className="text-button" onClick={() => navigate('map')}>
          <Icon name="map" size={14} /> Mapa
        </button>
        <span>/</span>
        <span>{world?.name}</span>
        <span>/</span>
        <strong>{lesson.title}</strong>
      </div>

      <header className="lesson-hero">
        <div className="lesson-hero-copy">
          <div className="lesson-pills">
            <Pill color={color}>{world?.name} · Mundo {world?.order}</Pill>
            <Pill icon="clock" color="#94a3b8">{lesson.minutes} min</Pill>
            <Pill icon="bolt" color="#fde047">+{lesson.xp} XP</Pill>
            {alreadyCompleted ? <Pill icon="check" color="#34d399">Completada{bestScore !== undefined ? ` · ${bestScore}%` : ''}</Pill> : null}
          </div>
          <h1>{lesson.title}</h1>
          <p className="lesson-tagline"><RichText text={lesson.tagline} /></p>
          <div className="concept-chips">
            {lesson.concepts.map((concept) => (
              <span key={concept} className="concept-chip">{concept}</span>
            ))}
          </div>
        </div>
        <div className="lesson-hero-side">
          <ProgressRing value={overall} size={108} stroke={7} color={color}>
            <div className="ring-inner">
              <strong>{index + 1}</strong>
              <span>de {ALL_LESSONS.length}</span>
            </div>
          </ProgressRing>
          <div className="lesson-hero-meta">
            <span><Icon name={meta.icon} size={14} /> Lab: {meta.name}</span>
            <span><Icon name="book" size={14} /> {lesson.source}</span>
            <span><Icon name="target" size={14} /> {totalQuestions} preguntas</span>
          </div>
        </div>
      </header>

      <nav className="lesson-tabs" aria-label="Etapas de la lección">
        {PHASES.map((item, itemIndex) => {
          const isActive = phase === item.id;
          const isCheckpoint = item.id === 'checkpoint';
          return (
            <button
              key={item.id}
              className={`lesson-tab ${isActive ? 'active' : ''}`}
              onClick={() => setPhase(item.id)}
              style={isActive ? { borderColor: `${color}88`, color } : undefined}
            >
              <span className="lesson-tab-index">{itemIndex + 1}</span>
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
              {isCheckpoint && answeredCount > 0 ? <em>{answeredCount}/{totalQuestions}</em> : null}
            </button>
          );
        })}
      </nav>

      {phase === 'teoria' ? (
        <div className="lesson-grid">
          <section className="panel lesson-theory">
            <SectionTitle eyebrow="Conceptos" title="Lo que tenés que entender" description="Tocá cada bloque para sincronizar la creación 3D en vivo." />
            {lesson.theory.map((block, blockIndex) => (
              <article
                key={`${block.heading ?? 'block'}-${blockIndex}`}
                className={`theory-block interactive ${activeTheory === blockIndex ? 'active' : ''}`}
                onClick={() => setActiveTheory(blockIndex)}
              >
                <div className="theory-marker" style={{ background: `${color}22`, color }}>
                  {String(blockIndex + 1).padStart(2, '0')}
                </div>
                <div>
                  {block.heading ? <h3>{block.heading}</h3> : null}
                  <div className="theory-body"><RichText text={block.body} /></div>
                  {block.note ? (
                    <div className="theory-note">
                      <Icon name="bulb" size={15} />
                      <span><RichText text={block.note} /></span>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
            <div className="lesson-callout" style={{ borderColor: `${color}44`, background: `${color}0d` }}>
              <Icon name="brain" size={18} />
              <div>
                <strong>Regla de oro</strong>
                <span>Si podés explicar el concepto con un ejemplo propio, ya lo aprendiste. Si no, volvé al laboratorio.</span>
              </div>
            </div>

            <MemoryAnchorCard worldOrTopic={lesson.worldId} />
          </section>

          <aside className="lesson-side">
            <section className="panel lesson-3d-panel" style={{ borderColor: `${color}44` }}>
              <Math3DScene
                lesson={lesson}
                activeStep={activeTheory}
                activeFormula={lesson.formulas[activeTheory] ?? lesson.formulas[0]}
                caption={lesson.theory[activeTheory]?.heading}
                compact
              />
            </section>

            <section className="panel formula-panel" style={{ borderColor: `${color}33` }}>
              <div className="formula-panel-head">
                <Icon name="layers" size={16} />
                <h3>Fórmulas clave</h3>
              </div>
              <div className="formula-list">
                {lesson.formulas.map((formula, formulaIndex) => (
                  <FormulaCard key={formula} formula={formula} label={`F${formulaIndex + 1}`} />
                ))}
              </div>
            </section>

            <section className="panel lesson-route-panel">
              <div className="formula-panel-head">
                <Icon name="route" size={16} />
                <h3>Ruta de la misión</h3>
              </div>
              <ol className="mission-roadmap">
                {PHASES.map((item) => (
                  <li key={item.id} className={phase === item.id ? 'active' : ''} onClick={() => setPhase(item.id)}>
                    <span><Icon name={item.icon} size={13} /></span>
                    {item.label}
                  </li>
                ))}
              </ol>
            </section>

            <section className="panel lesson-source">
              <span className="eyebrow">Fuente</span>
              <strong>{lesson.source}</strong>
              <p>Contenido alineado al cursillo de ingreso 2027.</p>
            </section>
          </aside>
        </div>
      ) : null}

      {phase === 'lab' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="panel lesson-lab-panel" style={{ borderColor: `${color}33` }}>
            <SectionTitle
              eyebrow="Etapa 2 · Experimentar"
              title={`Laboratorio: ${meta.name}`}
              description={meta.blurb}
            />
            <LabRenderer lesson={lesson} />
          </section>
          <section className="panel" style={{ borderColor: `${color}33` }}>
            <SectionTitle
              eyebrow="Guía Animada HD (10s)"
              title="Simulador interactivo a escala"
              description="Seguí la animación de 10 segundos y jugá con los parámetros para fijar la intuición."
            />
            <GuidedAnimationStudio initialTopic={studioTopicOf(lesson.worldId)} />
          </section>
        </div>
      ) : null}

      {phase === 'pasos' ? (
        <div className="lesson-steps-grid lesson-classroom">
          <section className="panel lesson-steps lesson-classroom-panel">
            <SectionTitle
              eyebrow={`Clase guiada · Paso ${activeStep + 1} de ${lesson.steps.length}`}
              title={lesson.steps[activeStep]?.title ?? 'Pasos guiados'}
              description="Mirá un paso, leé la explicación y avanzá cuando la idea esté clara."
              right={
                <div className="preset-row">
                  <button
                    type="button"
                    className="chip"
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    className="chip active"
                    disabled={activeStep >= lesson.steps.length - 1}
                    onClick={() => setActiveStep((s) => Math.min(lesson.steps.length - 1, s + 1))}
                  >
                    Siguiente →
                  </button>
                </div>
              }
            />
            <div className="classroom-progress" aria-label={`Paso ${activeStep + 1} de ${lesson.steps.length}`}>
              {lesson.steps.map((step, stepIndex) => (
                <button
                  key={step.title}
                  type="button"
                  className={`classroom-progress-dot ${stepIndex === activeStep ? 'active' : ''} ${stepIndex < activeStep ? 'done' : ''}`}
                  onClick={() => setActiveStep(stepIndex)}
                  aria-label={`Ir al paso ${stepIndex + 1}: ${step.title}`}
                  aria-current={stepIndex === activeStep ? 'step' : undefined}
                />
              ))}
            </div>
            <article className="classroom-explanation" aria-live="polite">
              <div className="classroom-explanation-label"><Icon name="book" size={15} /> Explicación</div>
              <h3>{lesson.steps[activeStep]?.title}</h3>
              <p><RichText text={lesson.steps[activeStep]?.detail ?? ''} /></p>
              {lesson.steps[activeStep]?.latex ? (
                <FormulaCard formula={lesson.steps[activeStep].latex!} label="En la pizarra" />
              ) : null}
            </article>
            <div className="classroom-controls">
              <span>{activeStep + 1} / {lesson.steps.length}</span>
              <div className="preset-row">
                <button
                  type="button"
                  className="chip"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                >
                  ← Anterior
                </button>
                {activeStep < lesson.steps.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setActiveStep((s) => Math.min(lesson.steps.length - 1, s + 1))}
                  >
                    Siguiente paso <Icon name="arrow" size={15} />
                  </button>
                ) : (
                  <button type="button" className="chip active" onClick={() => setPhase('checkpoint')}>
                    Ir a la práctica <Icon name="target" size={14} />
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className="lesson-side classroom-stage">
            <section className="panel lesson-3d-panel sticky classroom-scene" style={{ borderColor: `${color}44` }}>
              <Math3DScene
                lesson={lesson}
                activeStep={activeStep}
                activeFormula={lesson.steps[activeStep]?.latex ?? lesson.formulas[0]}
                caption={`Pizarra 3D · ${lesson.steps[activeStep]?.title ?? ''}`}
                guided
              />
            </section>
          </aside>
        </div>
      ) : null}

      {phase === 'checkpoint' ? (
        <section className="panel checkpoint-panel">
          {justFinished ? (
            <div className="lesson-result">
              <ProgressRing value={scorePercent} size={140} stroke={9} color={wording.color}>
                <div className="ring-inner">
                  <strong>{scorePercent}%</strong>
                  <span>{correctCount}/{totalQuestions}</span>
                </div>
              </ProgressRing>
              <div className="lesson-result-copy">
                <div className="eyebrow">Misión completada</div>
                <h2 style={{ color: wording.color }}>{wording.title}</h2>
                <p>{wording.detail}</p>
                <div className="lesson-result-stats">
                  <Pill icon="bolt" color="#fde047">+{lesson.xp} XP base</Pill>
                  <Pill icon="check" color="#34d399">{correctCount} {correctCount === 1 ? 'correcta' : 'correctas'}</Pill>
                  <Pill icon="star" color={color}>{world?.name}</Pill>
                </div>
                <div className="lesson-result-actions">
                  {next ? (
                    <button className="btn btn-primary" onClick={() => openLesson(next.id)}>
                      <Icon name="arrow" size={16} /> Siguiente: {next.title}
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={() => navigate('exam')}>
                      <Icon name="trophy" size={16} /> Ir al examen final
                    </button>
                  )}
                  <button className="btn btn-ghost" onClick={() => navigate('map')}>
                    <Icon name="map" size={16} /> Volver al mapa
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setJustFinished(false);
                      setAnswers({});
                      setChecked({});
                      setResults({});
                      setCurrent(0);
                      setPhase('checkpoint');
                      playLaser();
                    }}
                  >
                    <Icon name="refresh" size={16} /> Repetir checkpoint
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="checkpoint-head">
                <div>
                  <div className="eyebrow">Etapa 4 · Verificar</div>
                  <h2>Checkpoint de la misión</h2>
                  <p>Respondé las {totalQuestions} preguntas. Cada una tiene una sola opción correcta.</p>
                </div>
                <ProgressRing value={(answeredCount / Math.max(1, totalQuestions)) * 100} size={76} color={color}>
                  <span className="ring-small">{answeredCount}/{totalQuestions}</span>
                </ProgressRing>
              </div>

              <div className="question-dots">
                {lesson.questions.map((item, dotIndex) => {
                  const isChecked = checked[item.id];
                  const isCorrect = results[item.id];
                  return (
                    <button
                      key={item.id}
                      className={`question-dot ${current === dotIndex ? 'current' : ''} ${isChecked ? (isCorrect ? 'ok' : 'bad') : ''}`}
                      onClick={() => { setCurrent(dotIndex); setShowHint(false); }}
                      aria-label={`Pregunta ${dotIndex + 1}`}
                    >
                      {isChecked ? (isCorrect ? '✓' : '×') : dotIndex + 1}
                    </button>
                  );
                })}
              </div>

              {question ? (
                <article className="checkpoint-question">
                  <div className="question-meta">
                    <span>Pregunta {current + 1} de {totalQuestions}</span>
                    <Pill color={question.difficulty === 1 ? '#34d399' : question.difficulty === 2 ? '#fde047' : '#fb7185'}>
                      nivel {question.difficulty}
                    </Pill>
                  </div>
                  <h3 className="question-prompt"><RichText text={question.prompt} /></h3>

                  <div className="option-list">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[question.id] === optionIndex;
                      const isChecked = checked[question.id];
                      const isCorrectOption = optionIndex === question.correct;
                      const stateClass = !isChecked
                        ? selected ? 'selected' : ''
                        : isCorrectOption ? 'correct' : selected ? 'wrong' : 'muted';
                      return (
                        <button
                          key={`${question.id}-${optionIndex}`}
                          className={`option ${stateClass}`}
                          onClick={() => selectOption(optionIndex)}
                          disabled={Boolean(checked[question.id])}
                        >
                          <span className="option-letter">{LETTERS[optionIndex]}</span>
                          <span className="option-text"><RichText text={option} inline /></span>
                          {isChecked && isCorrectOption ? <Icon name="check" size={17} /> : null}
                          {isChecked && selected && !isCorrectOption ? <Icon name="close" size={17} /> : null}
                        </button>
                      );
                    })}
                  </div>

                  {!checked[question.id] ? (
                    <div className="question-actions">
                      {question.hint ? (
                        <button className="btn btn-ghost" onClick={() => setShowHint((value) => !value)}>
                          <Icon name="bulb" size={15} /> {showHint ? 'Ocultar pista' : 'Ver pista'}
                        </button>
                      ) : <span />}
                      <button className="btn btn-primary" onClick={checkAnswer} disabled={answers[question.id] === undefined}>
                        <Icon name="check" size={15} /> Comprobar
                      </button>
                    </div>
                  ) : (
                    <div className={`answer-feedback ${results[question.id] ? 'ok' : 'bad'}`}>
                      <div className="feedback-head">
                        <Icon name={results[question.id] ? 'check' : 'refresh'} size={17} />
                        <strong>{results[question.id] ? '¡Correcto!' : 'Todavía no'}</strong>
                      </div>
                      <p><RichText text={question.explanation} /></p>
                      {current < totalQuestions - 1 ? (
                        <button className="btn btn-primary" onClick={goNextQuestion}>
                          Siguiente pregunta <Icon name="arrow" size={15} />
                        </button>
                      ) : (
                        <button className="btn btn-primary" onClick={complete}>
                          <Icon name="flag" size={15} /> Completar misión
                        </button>
                      )}
                    </div>
                  )}

                  {showHint && question.hint && !checked[question.id] ? (
                    <div className="hint-box">
                      <Icon name="bulb" size={15} />
                      <span><RichText text={question.hint} /></span>
                    </div>
                  ) : null}
                </article>
              ) : null}

              {allChecked && !justFinished ? (
                <div className="checkpoint-finish">
                  <div>
                    <strong>Checkpoint completo: {correctCount}/{totalQuestions}</strong>
                    <span>Puntaje: {scorePercent}%</span>
                  </div>
                  <button className="btn btn-primary" onClick={complete}>
                    <Icon name="flag" size={16} /> Completar misión
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>
      ) : null}

      {!justFinished ? (
        <div className="lesson-footer-nav">
          <button className="btn btn-ghost" onClick={() => setPhase(prevPhase.id)} disabled={phaseIndex === 0}>
            <Icon name="chevron" size={15} className="flip" /> {prevPhase.label}
          </button>
          <span className="lesson-footer-progress">
            Etapa {phaseIndex + 1} de {PHASES.length}
            <Bar value={((phaseIndex + 1) / PHASES.length) * 100} color={color} height={5} />
          </span>
          <button className="btn btn-primary" onClick={() => setPhase(nextPhase.id)} disabled={phaseIndex === PHASES.length - 1}>
            {nextPhase.label} <Icon name="arrow" size={15} />
          </button>
        </div>
      ) : null}

      <div className="lesson-adjacent">
        {index > 0 ? (
          <button className="adjacent-card left" onClick={() => openLesson(ALL_LESSONS[index - 1].id)}>
            <span><Icon name="chevron" size={13} className="flip" /> Anterior</span>
            <strong>{ALL_LESSONS[index - 1].title}</strong>
          </button>
        ) : <span />}
        {index < CONTENT_LESSONS.length - 1 && next ? (
          <button className="adjacent-card right" onClick={() => openLesson(next.id)}>
            <span>Siguiente <Icon name="chevron" size={13} /></span>
            <strong>{next.title}</strong>
          </button>
        ) : null}
      </div>
    </div>
  );
}
