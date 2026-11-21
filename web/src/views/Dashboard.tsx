import React from 'react';
import { ACHIEVEMENTS, achievementById } from '../data/achievements';
import { ALL_LESSONS, CURRICULUM_STATS, WORLDS, getLesson, getWorldOfLesson } from '../data/curriculum';
import { PLAN_60 } from '../data/plan';
import {
  accuracyPercent,
  completedWorldCount,
  effectiveStreak,
  levelProgress,
  recommendedLesson,
  totalCorrect
} from '../lib/gamification';
import { useLearning } from '../state/LearningContext';
import Icon from '../components/ui/Icon';
import { Bar, Pill, ProgressRing, SectionTitle, StatTile } from '../components/ui/Primitives';
import RichText from '../components/ui/RichText';

const DAY_LABELS: Record<string, string> = {
  lesson: 'Lección',
  practice: 'Práctica',
  review: 'Repaso',
  exam: 'Examen',
  rest: 'Descanso'
};

export default function Dashboard() {
  const { state, level, streak, planDay, openLesson, navigate } = useLearning();
  const recommended = recommendedLesson(state);
  const lesson = getLesson(recommended);
  const world = lesson ? getWorldOfLesson(lesson.id) : undefined;

  const completed = state.completedLessons.length;
  const overall = Math.round((completed / Math.max(1, ALL_LESSONS.length)) * 100);
  const nextDays = PLAN_60.filter((day) => day.day >= planDay).slice(0, 5);
  const unlockedBadges = state.badges
    .map((id) => achievementById(id))
    .filter(Boolean)
    .slice(-3)
    .reverse();
  const nextBadge = ACHIEVEMENTS.find((achievement) => !state.badges.includes(achievement.id));

  const dailyTasks = [
    { label: 'Completar 1 lección', done: state.daily.lessons >= 1, value: `${Math.min(1, state.daily.lessons)}/1` },
    { label: 'Acertar 10 preguntas', done: state.daily.correct >= 10, value: `${Math.min(10, state.daily.correct)}/10` },
    { label: 'Ganar la meta diaria', done: state.daily.xp >= state.daily.goal, value: `${Math.min(state.daily.xp, state.daily.goal)}/${state.daily.goal} XP` }
  ];

  return (
    <div className="view dashboard">
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Tu ruta · Ingreso 2027</div>
          <h1>
            Matemática,<br />
            <span className="gradient-text">convertida en juego.</span>
          </h1>
          <p>
            Ocho mundos, 32 misiones y 60 días para dominar los conceptos del cursillo.
            Cada fórmula se ve, se toca y se resuelve. Sin memorizar a ciegas.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => openLesson(recommended)}>
              <Icon name="play" size={16} />
              {completed === 0 ? 'Empezar mi ruta' : 'Continuar donde quedé'}
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('map')}>
              <Icon name="map" size={16} /> Ver el mapa
            </button>
          </div>
          <div className="hero-meta">
            <span><Icon name="clock" size={14} /> Día {planDay} de 60</span>
            <span><Icon name="book" size={14} /> {CURRICULUM_STATS.lessons} lecciones</span>
            <span><Icon name="target" size={14} /> {CURRICULUM_STATS.questions} preguntas</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orb">
            <div className="orb-ring orb-ring-1" />
            <div className="orb-ring orb-ring-2" />
            <div className="orb-ring orb-ring-3" />
            <div className="orb-core">
              <span>Nv.</span>
              <strong>{level.level}</strong>
              <small>{level.title}</small>
            </div>
            <span className="orb-dot orb-dot-1" />
            <span className="orb-dot orb-dot-2" />
            <span className="orb-dot orb-dot-3" />
          </div>
          <div className="hero-level">
            <div className="hero-level-row">
              <span>{state.xp} XP</span>
              <span>{level.remaining > 0 ? `faltan ${level.remaining}` : 'nivel máximo'}</span>
            </div>
            <Bar value={level.percent} color="#22d3ee" />
          </div>
        </div>
      </section>

      <section className="stat-row">
        <StatTile icon="bolt" label="Nivel" value={`${level.level} · ${level.title}`} color="#22d3ee" />
        <StatTile icon="flame" label="Racha" value={`${streak} ${streak === 1 ? 'día' : 'días'}`} color="#fb923c" hint={`Mejor: ${state.bestStreak}`} />
        <StatTile icon="target" label="Precisión" value={`${accuracyPercent(state)}%`} color="#34d399" hint={`${totalCorrect(state)} aciertos`} />
        <StatTile icon="book" label="Lecciones" value={`${completed}/${ALL_LESSONS.length}`} color="#a78bfa" hint={`${overall}% del mapa`} />
        <StatTile icon="star" label="Logros" value={`${state.badges.length}/${ACHIEVEMENTS.length}`} color="#fde047" />
      </section>

      <div className="dashboard-grid">
        <section className="panel mission-panel">
          <SectionTitle
            eyebrow="Misión de hoy"
            title="Tres pulsos para no perder el ritmo"
            description="La constancia diaria vale más que una sesión maratónica."
            right={<Pill icon="flame" color="#fb923c">{streak} {streak === 1 ? 'día' : 'días'}</Pill>}
          />
          <div className="mission-top">
            <ProgressRing value={Math.round((state.daily.xp / Math.max(1, state.daily.goal)) * 100)} size={92} color="#22d3ee">
              <div className="ring-inner">
                <strong>{state.daily.xp}</strong>
                <span>XP hoy</span>
              </div>
            </ProgressRing>
            <div className="mission-tasks">
              {dailyTasks.map((task) => (
                <div key={task.label} className={`mission-task ${task.done ? 'done' : ''}`}>
                  <span className="task-check">{task.done ? '✓' : '○'}</span>
                  <span>{task.label}</span>
                  <em>{task.value}</em>
                </div>
              ))}
            </div>
          </div>
          <button className="btn btn-block" onClick={() => navigate('exercises')}>
            <Icon name="route" size={15} /> Seguir la ruta progresiva de ejercicios
          </button>
        </section>

        <section className="panel continue-panel" style={{ borderColor: `${world?.color ?? '#22d3ee'}44` }}>
          <div className="continue-glow" style={{ background: world?.color }} />
          <div className="continue-head">
            <span className="eyebrow">Siguiente misión</span>
            <Pill color={world?.color}>{world?.name}</Pill>
          </div>
          <h3>{lesson?.title ?? 'Repaso final'}</h3>
          <p><RichText text={lesson?.tagline ?? 'Consolidá todo lo aprendido.'} /></p>
          <div className="concept-chips">
            {lesson?.concepts.slice(0, 4).map((concept) => (
              <span key={concept} className="concept-chip">{concept}</span>
            ))}
          </div>
          <div className="continue-meta">
            <span><Icon name="clock" size={14} /> {lesson?.minutes ?? 15} min</span>
            <span><Icon name="bolt" size={14} /> +{lesson?.xp ?? 50} XP</span>
            <span><Icon name="book" size={14} /> {lesson?.source}</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => openLesson(recommended)}>
            <Icon name="arrow" size={16} /> Entrar a la lección
          </button>
        </section>
      </div>

      <SectionTitle
        eyebrow="Mapa de mundos"
        title="Ocho territorios, una sola mente"
        description="Cada mundo desbloquea el siguiente. Completá las cuatro misiones para conquistarlo."
        right={<button className="btn btn-ghost btn-sm" onClick={() => navigate('map')}>Abrir mapa <Icon name="arrow" size={14} /></button>}
      />

      <div className="world-grid">
        {WORLDS.map((worldItem) => {
          const done = worldItem.lessons.filter((item) => state.completedLessons.includes(item.id)).length;
          const percent = Math.round((done / worldItem.lessons.length) * 100);
          return (
            <button
              key={worldItem.id}
              className="world-card"
              style={{ '--world-color': worldItem.color, '--world-accent': worldItem.accent } as React.CSSProperties}
              onClick={() => navigate('map')}
            >
              <div className="world-card-top">
                <div className="world-icon" style={{ color: worldItem.color, background: worldItem.accent, borderColor: `${worldItem.color}44` }}>
                  <Icon name={worldItem.icon} size={22} />
                </div>
                <ProgressRing value={percent} size={48} stroke={4} color={worldItem.color}>
                  <span className="ring-small">{percent}%</span>
                </ProgressRing>
              </div>
              <div className="world-order">Mundo {worldItem.order.toString().padStart(2, '0')}</div>
              <h3>{worldItem.name}</h3>
              <div className="world-subtitle">{worldItem.subtitle}</div>
              <p>{worldItem.description}</p>
              <div className="world-foot">
                <span>{done}/{worldItem.lessons.length} misiones</span>
                <span style={{ color: worldItem.color }}>Explorar <Icon name="chevron" size={13} /></span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="dashboard-grid bottom">
        <section className="panel">
          <SectionTitle eyebrow="Próximos días" title="Tu plan de 60 días" right={<button className="text-button" onClick={() => navigate('plan')}>Ver plan completo</button>} />
          <div className="next-days">
            {nextDays.map((day) => (
              <div key={day.day} className={`next-day ${day.day === planDay ? 'today' : ''}`}>
                <div className="next-day-number">{day.day}</div>
                <div>
                  <span className={`day-type type-${day.type}`}>{DAY_LABELS[day.type]}</span>
                  <strong>{day.title}</strong>
                  <small>{day.focus}</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <SectionTitle eyebrow="Logros" title="Tu vitrina" right={<button className="text-button" onClick={() => navigate('progress')}>Ver todo</button>} />
          {unlockedBadges.length === 0 ? (
            <div className="empty-state">
              <Icon name="star" size={28} />
              <strong>Todavía no hay logros</strong>
              <span>Completá tu primera lección para encender la primera estrella.</span>
            </div>
          ) : (
            <div className="badge-preview">
              {unlockedBadges.map((badge) => badge ? (
                <div key={badge.id} className="badge-unlocked">
                  <div className="badge-icon"><Icon name="star" size={18} filled /></div>
                  <div>
                    <strong>{badge.name}</strong>
                    <span>{badge.description}</span>
                  </div>
                </div>
              ) : null)}
            </div>
          )}
          {nextBadge ? (
            <div className="next-badge">
              <div className="next-badge-icon"><Icon name="lock" size={16} /></div>
              <div>
                <span>Próximo logro</span>
                <strong>{nextBadge.name}</strong>
                <small>{nextBadge.description}</small>
              </div>
              <Pill color="#fde047">+{nextBadge.xp} XP</Pill>
            </div>
          ) : null}
        </section>
      </div>

      <section className="quick-lab">
        <div>
          <span className="eyebrow">Zona libre</span>
          <h3>¿Querés jugar con la matemática?</h3>
          <p>Entrá al laboratorio 3D y hacé rotar una superficie llena de haces láser. Sin ejercicios, solo intuición.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('lab')}>
          <Icon name="laser" size={16} /> Abrir laboratorio 3D
        </button>
      </section>
    </div>
  );
}
