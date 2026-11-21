import React, { useMemo, useRef, useState } from 'react';
import { ACHIEVEMENTS } from '../data/achievements';
import { ALL_LESSONS, WORLDS } from '../data/curriculum';
import {
  accuracyPercent,
  addDays,
  completedWorldCount,
  todayKey,
  totalAttempts,
  totalCorrect
} from '../lib/gamification';
import { exportProgress, importProgress } from '../lib/storage';
import { useLearning } from '../state/LearningContext';
import Icon, { type IconName } from '../components/ui/Icon';
import { Bar, Pill, ProgressRing, SectionTitle, StatTile, Modal } from '../components/ui/Primitives';

const BADGE_ICON: Record<string, IconName> = {
  spark: 'spark',
  compass: 'compass',
  route: 'route',
  trophy: 'trophy',
  flame: 'flame',
  laser: 'laser',
  target: 'target',
  brain: 'brain',
  star: 'star',
  flag: 'flag',
  map: 'map',
  crown: 'crown',
  seal: 'seal',
  bolt: 'bolt'
};

export default function ProgressView() {
  const { state, level, streak, toggleSound, toggleMotion, toggleLaser, resetAll, replaceState, pushToast, navigate } = useLearning();
  const [importOpen, setImportOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const accuracy = accuracyPercent(state);
  const completed = state.completedLessons.length;
  const worldsDone = completedWorldCount(state);
  const today = todayKey();
  const activity = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => {
      const date = addDays(today, index - 13);
      const log = state.days[date];
      return { date, xp: log?.xp ?? 0, questions: log?.questions ?? 0, lessons: log?.lessons ?? 0 };
    });
  }, [state.days, today]);
  const maxXp = Math.max(40, ...activity.map((item) => item.xp));

  const handleExport = () => {
    const data = exportProgress(state);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `polymath-zero-${today}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    pushToast({ title: 'Progreso exportado', detail: 'Guardá el archivo en un lugar seguro.', tone: 'success' });
  };

  const applyImport = () => {
    const next = importProgress(importText);
    if (!next) {
      pushToast({ title: 'Archivo inválido', detail: 'El JSON no tiene el formato esperado.', tone: 'warning' });
      return;
    }
    replaceState(next);
    setImportOpen(false);
    setImportText('');
    pushToast({ title: 'Progreso importado', detail: `${next.xp} XP restaurados.`, tone: 'success' });
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      setImportText(text);
      const next = importProgress(text);
      if (next) {
        replaceState(next);
        setImportOpen(false);
        pushToast({ title: 'Progreso importado', detail: `${next.xp} XP restaurados.`, tone: 'success' });
      } else {
        pushToast({ title: 'Archivo inválido', detail: 'Revisá que sea un JSON exportado por Polymath Zero.', tone: 'warning' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="view progress-view">
      <section className="progress-hero">
        <div>
          <div className="eyebrow">Panel del jugador</div>
          <h1>Tu <span className="gradient-text">progreso</span></h1>
          <p>
            Todo lo que hiciste, medido y guardado. Nivel, precisión, mundos conquistados,
            actividad diaria y logros. Los datos viven en este navegador.
          </p>
          <div className="practice-hero-stats">
            <Pill icon="bolt" color="#fde047">{state.xp} XP</Pill>
            <Pill icon="flame" color="#fb923c">racha {streak}</Pill>
            <Pill icon="book" color="#22d3ee">{completed}/{ALL_LESSONS.length} misiones</Pill>
          </div>
        </div>
        <div className="progress-level-card">
          <ProgressRing value={level.percent} size={130} stroke={9} color="#22d3ee">
            <div className="ring-inner">
              <strong>{level.level}</strong>
              <span>{level.title}</span>
            </div>
          </ProgressRing>
          <div>
            <span className="eyebrow">Nivel actual</span>
            <strong>{level.title}</strong>
            <small>{level.remaining > 0 ? `${level.remaining} XP para el nivel ${level.level + 1}` : 'Nivel máximo alcanzado'}</small>
            <Bar value={level.percent} color="#22d3ee" />
          </div>
        </div>
      </section>

      <section className="stat-row">
        <StatTile icon="bolt" label="XP total" value={state.xp} color="#fde047" hint={`${level.current} / ${level.next}`} />
        <StatTile icon="target" label="Precisión" value={`${accuracy}%`} color="#34d399" hint={`${totalCorrect(state)} / ${totalAttempts(state)}`} />
        <StatTile icon="flame" label="Racha" value={`${streak} ${streak === 1 ? 'día' : 'días'}`} color="#fb923c" hint={`Mejor: ${state.bestStreak}`} />
        <StatTile icon="map" label="Mundos" value={`${worldsDone}/8`} color="#22d3ee" hint={`${state.badges.length} logros`} />
        <StatTile icon="star" label="Monedas" value={state.coins} color="#a78bfa" hint={`${state.totalQuizzes} prácticas`} />
      </section>

      <div className="progress-grid">
        <section className="panel activity-panel">
          <SectionTitle
            eyebrow="Últimos 14 días"
            title="Tu constancia"
            description="La altura de cada barra es el XP ganado ese día."
            right={<Pill icon="flame" color="#fb923c">{state.daily.xp}/{state.daily.goal} XP hoy</Pill>}
          />
          <div className="activity-chart">
            {activity.map((item) => {
              const height = Math.max(3, Math.round((item.xp / maxXp) * 100));
              const isToday = item.date === today;
              return (
                <div key={item.date} className={`activity-col ${isToday ? 'today' : ''}`} title={`${item.date}: ${item.xp} XP`}>
                  <span className="activity-value">{item.xp > 0 ? item.xp : ''}</span>
                  <div className="activity-bar-track">
                    <div className="activity-bar" style={{ height: `${height}%` }} />
                  </div>
                  <span className="activity-label">{item.date.slice(8)}</span>
                </div>
              );
            })}
          </div>
          <div className="activity-foot">
            <span>Meta diaria: {state.daily.goal} XP</span>
            <span>{state.daily.lessons} {state.daily.lessons === 1 ? 'lección' : 'lecciones'} hoy · {state.daily.correct} aciertos hoy</span>
          </div>
        </section>

        <section className="panel daily-panel">
          <SectionTitle eyebrow="Hoy" title="Pulso diario" />
          <ProgressRing value={Math.min(100, Math.round((state.daily.xp / Math.max(1, state.daily.goal)) * 100))} size={120} color="#34d399">
            <div className="ring-inner">
              <strong>{state.daily.xp}</strong>
              <span>de {state.daily.goal} XP</span>
            </div>
          </ProgressRing>
          <div className="daily-list">
            <div><span>Lecciones</span><strong>{state.daily.lessons}</strong></div>
            <div><span>Preguntas</span><strong>{state.daily.questions}</strong></div>
            <div><span>Aciertos</span><strong>{state.daily.correct}</strong></div>
            <div><span>Monedas</span><strong>{state.coins}</strong></div>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => navigate('practice')}>
            <Icon name="target" size={15} /> Sumar XP ahora
          </button>
        </section>
      </div>

      <section className="panel worlds-progress">
        <SectionTitle eyebrow="Mundos" title="Conquista por territorio" description="Una barra por mundo; el check aparece al completar las cuatro misiones." />
        <div className="world-progress-list">
          {WORLDS.map((world) => {
            const done = world.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
            const percent = Math.round((done / world.lessons.length) * 100);
            return (
              <div key={world.id} className="world-progress-row" style={{ '--world-color': world.color } as React.CSSProperties}>
                <span className="world-progress-icon" style={{ color: world.color, background: world.accent }}><Icon name={world.icon} size={18} /></span>
                <div className="world-progress-main">
                  <div className="world-progress-head">
                    <strong>{world.name}</strong>
                    <span>{world.subtitle}</span>
                    <em>{done}/{world.lessons.length}</em>
                  </div>
                  <Bar value={percent} color={world.color} />
                </div>
                <span className={`world-progress-check ${done === world.lessons.length ? 'done' : ''}`}>
                  <Icon name={done === world.lessons.length ? 'check' : 'lock'} size={15} />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel badges-panel">
        <SectionTitle
          eyebrow="Vitrina"
          title={`Logros · ${state.badges.length}/${ACHIEVEMENTS.length}`}
          description="Se desbloquean solos al jugar. Cada uno suma XP extra."
        />
        <div className="badges-grid">
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = state.badges.includes(achievement.id);
            return (
              <article key={achievement.id} className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-card-icon">
                  <Icon name={unlocked ? (BADGE_ICON[achievement.icon] ?? 'star') : 'lock'} size={22} filled={unlocked} />
                </div>
                <div>
                  <strong>{achievement.name}</strong>
                  <p>{achievement.description}</p>
                </div>
                <Pill color={unlocked ? '#fde047' : '#64748b'}>+{achievement.xp} XP</Pill>
              </article>
            );
          })}
        </div>
      </section>

      <div className="progress-grid bottom">
        <section className="panel settings-panel">
          <SectionTitle eyebrow="Ajustes" title="Experiencia de juego" description="Preferencias guardadas junto con tu progreso." />
          <div className="settings-list">
            <button className={`switch-row ${state.settings.sound ? 'on' : ''}`} onClick={toggleSound}>
              <span className="switch-icon"><Icon name={state.settings.sound ? 'sound' : 'mute'} size={18} /></span>
              <span><strong>Sonido</strong><small>Efectos de acierto, error y subida de nivel.</small></span>
              <i className="switch" />
            </button>
            <button className={`switch-row ${state.settings.reduceMotion ? 'on' : ''}`} onClick={toggleMotion}>
              <span className="switch-icon"><Icon name="eye" size={18} /></span>
              <span><strong>Reducir movimiento</strong><small>Desactiva animaciones intensas y confeti.</small></span>
              <i className="switch" />
            </button>
            <button className={`switch-row ${state.settings.laser ? 'on' : ''}`} onClick={toggleLaser}>
              <span className="switch-icon"><Icon name="laser" size={18} /></span>
              <span><strong>Haces láser</strong><small>Rastros luminosos en mapas y laboratorios.</small></span>
              <i className="switch" />
            </button>
          </div>

          <div className="data-actions">
            <button className="btn btn-ghost" onClick={handleExport}><Icon name="layers" size={15} /> Exportar</button>
            <button className="btn btn-ghost" onClick={() => setImportOpen(true)}><Icon name="refresh" size={15} /> Importar</button>
            <button className="btn btn-ghost danger" onClick={() => setResetOpen(true)}><Icon name="close" size={15} /> Reiniciar todo</button>
          </div>
        </section>

        <section className="panel history-panel">
          <SectionTitle eyebrow="Simulacros" title="Últimos resultados" right={<button className="text-button" onClick={() => navigate('exam')}>Ir a simulacros</button>} />
          {state.examResults.length === 0 ? (
            <div className="empty-state">
              <Icon name="seal" size={26} />
              <strong>Sin simulacros todavía</strong>
              <span>Cuando rindas el primero, acá vas a ver la evolución.</span>
            </div>
          ) : (
            <div className="mini-history">
              {state.examResults.slice(0, 5).map((result, index) => {
                const percent = Math.round((result.score / Math.max(1, result.total)) * 100);
                return (
                  <div key={`${result.id}-${index}`} className="mini-history-row">
                    <span className={result.passed ? 'ok' : 'bad'}>{result.passed ? '✓' : '×'}</span>
                    <div>
                      <strong>{result.id}</strong>
                      <small>{result.date}</small>
                    </div>
                    <div className="mini-history-bar">
                      <Bar value={percent} color={result.passed ? '#34d399' : '#fb7185'} height={5} />
                    </div>
                    <em>{percent}%</em>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <Modal
        open={importOpen}
        title="Importar progreso"
        onClose={() => setImportOpen(false)}
        footer={
          <div className="question-actions">
            <button className="btn btn-ghost" onClick={() => setImportOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={applyImport} disabled={!importText.trim()}>Importar</button>
          </div>
        }
      >
        <p>Pegá el JSON exportado o elegí un archivo. Esto reemplaza el progreso actual.</p>
        <div className="import-row">
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}><Icon name="layers" size={15} /> Elegir archivo</button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </div>
        <textarea
          className="import-textarea"
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder='{ "version": 2, "xp": 0, ... }'
          rows={8}
        />
      </Modal>

      <Modal
        open={resetOpen}
        title="¿Reiniciar todo el progreso?"
        onClose={() => setResetOpen(false)}
        footer={
          <div className="question-actions">
            <button className="btn btn-ghost" onClick={() => setResetOpen(false)}>Cancelar</button>
            <button
              className="btn btn-primary"
              onClick={() => { resetAll(); setResetOpen(false); }}
            >
              Sí, empezar de cero
            </button>
          </div>
        }
      >
        <p>Se borran XP, nivel, misiones completadas, logros y simulacros. Esta acción no se puede deshacer.</p>
        <p className="modal-warning">Si querés conservar algo, exportá el progreso antes de continuar.</p>
      </Modal>
    </div>
  );
}
