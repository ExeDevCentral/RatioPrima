import React from 'react';
import { WORLDS, ALL_LESSONS } from '../data/curriculum';
import { LAB_META } from '../components/labs/LabRenderer';
import { useLearning, lessonUnlocked } from '../state/LearningContext';
import Icon from '../components/ui/Icon';
import { Bar, Pill, SectionTitle } from '../components/ui/Primitives';
import { playLaser } from '../lib/sfx';

const LAB_ICON: Record<string, 'orbit' | 'scale' | 'compass' | 'chart' | 'cube' | 'nexus' | 'flask' | 'laser'> = {
  numberline: 'orbit',
  balance: 'scale',
  unitcircle: 'compass',
  parabola: 'chart',
  tiles: 'cube',
  systems: 'nexus',
  radicals: 'flask',
  laser3d: 'laser'
};

export default function MapView() {
  const { state, openLesson, navigate, pushToast } = useLearning();

  const completed = state.completedLessons.length;
  const overall = Math.round((completed / Math.max(1, ALL_LESSONS.length)) * 100);

  const handleOpen = (lessonId: string, title: string) => {
    if (!lessonUnlocked(state, lessonId)) {
      playLaser();
      pushToast({
        title: 'Misión bloqueada',
        detail: `Completá la misión anterior para abrir «${title}».`,
        tone: 'warning'
      });
      return;
    }
    openLesson(lessonId);
  };

  return (
    <div className="view map-view">
      <section className="map-hero">
        <div>
          <div className="eyebrow">Cartografía del conocimiento</div>
          <h1>Tu mapa de <span className="gradient-text">8 mundos</span></h1>
          <p>
            La ruta completa del cursillo de ingreso, del primer número natural al examen final.
            Cada nodo es una misión de 12 a 25 minutos.
          </p>
          <div className="map-hero-meta">
            <Pill icon="book" color="#22d3ee">{completed}/{ALL_LESSONS.length} misiones</Pill>
            <Pill icon="bolt" color="#a78bfa">{state.xp} XP</Pill>
            <Pill icon="flame" color="#fb923c">{state.streak} {state.streak === 1 ? 'día' : 'días'} de racha</Pill>
          </div>
        </div>
        <div className="map-progress-card">
          <span className="eyebrow">Progreso total</span>
          <div className="map-progress-value">{overall}%</div>
          <Bar value={overall} color="#22d3ee" height={10} />
          <div className="map-progress-foot">
            <span>{ALL_LESSONS.length - completed} {ALL_LESSONS.length - completed === 1 ? 'misión restante' : 'misiones restantes'}</span>
            <button className="text-button" onClick={() => navigate('plan')}>Ver plan</button>
          </div>
        </div>
      </section>

      <div className="map-legend">
        <span><i className="legend-dot done" /> Completada</span>
        <span><i className="legend-dot available" /> Disponible</span>
        <span><i className="legend-dot locked" /> Bloqueada</span>
        <span><Icon name="laser" size={14} /> El haz láser marca tu próximo paso</span>
      </div>

      <div className="map-canvas">
        <svg className="map-spine" viewBox="0 0 120 1600" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="spine-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#fde047" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <path
            d="M60 0 C 15 200, 105 320, 60 500 C 15 680, 105 800, 60 980 C 15 1160, 105 1280, 60 1460 C 40 1540, 55 1570, 60 1600"
            fill="none"
            stroke="url(#spine-gradient)"
            strokeWidth="2"
            strokeDasharray="7 9"
            className="spine-dash"
          />
        </svg>

        {WORLDS.map((world, worldIndex) => {
          const done = world.lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length;
          const percent = Math.round((done / world.lessons.length) * 100);
          const conquered = done === world.lessons.length;
          const side = worldIndex % 2 === 0 ? 'left' : 'right';

          return (
            <section
              key={world.id}
              className={`map-world ${side} ${conquered ? 'conquered' : ''}`}
              style={{ '--world-color': world.color, '--world-accent': world.accent } as React.CSSProperties}
            >
              <div className="map-world-marker" style={{ color: world.color, background: world.accent }}>
                <Icon name={world.icon} size={24} />
              </div>

              <div className="map-world-head">
                <div className="map-world-top">
                  <span className="world-order">Mundo {world.order.toString().padStart(2, '0')}</span>
                  <Pill color={world.color}>{conquered ? 'Conquistado' : `${percent}%`}</Pill>
                </div>
                <h2>{world.name}</h2>
                <h3>{world.subtitle}</h3>
                <p>{world.description}</p>
                <div className="map-world-bar">
                  <Bar value={percent} color={world.color} />
                  <span>{done}/{world.lessons.length}</span>
                </div>
              </div>

              <div className="map-nodes">
                {world.lessons.map((lesson, lessonIndex) => {
                  const isDone = state.completedLessons.includes(lesson.id);
                  const unlocked = lessonUnlocked(state, lesson.id);
                  const best = state.lessonBest[lesson.id];
                  const meta = LAB_META[lesson.lab];
                  return (
                    <button
                      key={lesson.id}
                      className={`map-node ${isDone ? 'done' : ''} ${unlocked ? 'available' : 'locked'} ${unlocked && !isDone ? 'current' : ''}`}
                      aria-disabled={!unlocked}
                      onClick={() => handleOpen(lesson.id, lesson.title)}
                      style={{ '--node-color': world.color } as React.CSSProperties}
                    >
                      <span className="map-node-index">
                        {isDone ? <Icon name="check" size={15} /> : unlocked ? `${world.order}.${lessonIndex + 1}` : <Icon name="lock" size={13} />}
                      </span>
                      <span className="map-node-body">
                        <strong>{lesson.title}</strong>
                        <small>{lesson.tagline}</small>
                        <span className="map-node-tags">
                          <em><Icon name={LAB_ICON[lesson.lab] ?? meta.icon} size={12} /> {meta.name}</em>
                          <em><Icon name="clock" size={12} /> {lesson.minutes} min</em>
                          <em><Icon name="bolt" size={12} /> {lesson.xp} XP</em>
                          {best !== undefined ? <em className="map-node-best">récord {best}%</em> : null}
                        </span>
                      </span>
                      <span className="map-node-arrow">
                        {unlocked ? <Icon name="chevron" size={16} /> : <Icon name="lock" size={15} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="map-finale panel">
        <div className="map-finale-glow" />
        <div className="map-finale-copy">
          <div className="eyebrow">Última estación</div>
          <h2>La Arena te espera</h2>
          <p>
            Cuatro simulacros con el formato del ingreso, corrección inmediata y un examen final
            cronometrado. Cuando llegues, ya vas a haber resuelto más de {ALL_LESSONS.reduce((sum, lesson) => sum + lesson.questions.length, 0)} preguntas.
          </p>
        </div>
        <div className="map-finale-actions">
          <button className="btn btn-primary" onClick={() => navigate('exam')}>
            <Icon name="target" size={16} /> Ir a los simulacros
          </button>
          <button className="btn btn-ghost" onClick={() => navigate('dashboard')}>
            <Icon name="home" size={16} /> Volver al panel
          </button>
        </div>
      </section>
    </div>
  );
}
