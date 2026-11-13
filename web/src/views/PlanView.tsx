import React, { useMemo, useState } from 'react';
import { PLAN_60 } from '../data/plan';
import { CONTENT_LESSONS, getLesson, WORLDS } from '../data/curriculum';
import type { PlanDayType } from '../data/types';
import { useLearning } from '../state/LearningContext';
import Icon from '../components/ui/Icon';
import { Bar, Pill, ProgressRing, SectionTitle } from '../components/ui/Primitives';

const DAY_LABELS: Record<PlanDayType, string> = {
  lesson: 'Lección',
  practice: 'Práctica',
  review: 'Repaso',
  exam: 'Examen',
  rest: 'Descanso'
};

const DAY_PLURALS: Record<PlanDayType, string> = {
  lesson: 'lecciones',
  practice: 'prácticas',
  review: 'repasos',
  exam: 'exámenes',
  rest: 'descansos'
};

const countLabel = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

const DAY_COLORS: Record<PlanDayType, string> = {
  lesson: '#22d3ee',
  practice: '#34d399',
  review: '#a78bfa',
  exam: '#fb7185',
  rest: '#64748b'
};

const DAY_ICONS: Record<PlanDayType, 'book' | 'target' | 'refresh' | 'seal' | 'shield'> = {
  lesson: 'book',
  practice: 'target',
  review: 'refresh',
  exam: 'seal',
  rest: 'shield'
};

const WEEK_TITLES = [
  'Semana 1 · El origen',
  'Semana 2 · Operaciones',
  'Semana 3 · Trigonometría',
  'Semana 4 · Álgebra',
  'Semana 5 · Ecuaciones',
  'Semana 6 · Inecuaciones',
  'Semana 7 · Sistemas',
  'Semana 8 · La Arena',
  'Cierre · Días 57-60'
];

export default function PlanView() {
  const { state, planDay, openLesson, navigate } = useLearning();
  const [weekFilter, setWeekFilter] = useState<number | 'all'>('all');

  const completed = state.completedLessons.length;
  const overall = Math.round((completed / Math.max(1, CONTENT_LESSONS.length)) * 100);

  const weeks = useMemo(() => {
    const map = new Map<number, typeof PLAN_60>();
    PLAN_60.forEach((day) => {
      const list = map.get(day.week) ?? [];
      list.push(day);
      map.set(day.week, list);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, []);

  const todayEntry = PLAN_60.find((day) => day.day === planDay) ?? PLAN_60[0];
  const todayType = todayEntry?.type ?? 'lesson';

  const typeCounts = useMemo(() => {
    return PLAN_60.reduce<Record<string, number>>((acc, day) => {
      acc[day.type] = (acc[day.type] ?? 0) + 1;
      return acc;
    }, {});
  }, []);

  const visibleWeeks = weekFilter === 'all' ? weeks : weeks.filter(([week]) => week === weekFilter);

  return (
    <div className="view plan-view">
      <section className="plan-hero">
        <div>
          <div className="eyebrow">60 días · 8 semanas + cierre</div>
          <h1>Tu plan de <span className="gradient-text">dos meses</span></h1>
          <p>
            Cuatro lecciones nuevas por semana, una práctica dirigida, un repaso espaciado y un
            descanso activo. Así se aprende sin quemarse.
          </p>
          <div className="practice-hero-stats">
            <Pill icon="calendar" color="#22d3ee">Día {planDay} de 60</Pill>
            <Pill icon="book" color="#a78bfa">{CONTENT_LESSONS.length} lecciones de contenido</Pill>
            <Pill icon="trophy" color="#fde047">{PLAN_60.length} días planificados</Pill>
          </div>
        </div>
        <div className="plan-today" style={{ '--today-color': DAY_COLORS[todayType] } as React.CSSProperties}>
          <div className="plan-today-head">
            <span className="eyebrow">Hoy</span>
            <Pill color={DAY_COLORS[todayType]} icon={DAY_ICONS[todayType]}>{DAY_LABELS[todayType]}</Pill>
          </div>
          <h3>{todayEntry?.title ?? 'Repaso libre'}</h3>
          <p>{todayEntry?.focus ?? 'Elegí una práctica y sumá XP.'}</p>
          {todayEntry?.lessonIds.length ? (
            <button className="btn btn-primary btn-block" onClick={() => openLesson(todayEntry.lessonIds[0])}>
              <Icon name="play" size={15} /> Empezar ahora
            </button>
          ) : (
            <button className="btn btn-primary btn-block" onClick={() => navigate('practice')}>
              <Icon name="target" size={15} /> Práctica libre
            </button>
          )}
        </div>
      </section>

      <div className="plan-summary panel">
        <div className="plan-summary-main">
          <div>
            <span className="eyebrow">Avance del contenido</span>
            <strong>{completed} de {CONTENT_LESSONS.length} lecciones</strong>
          </div>
          <Bar value={overall} color="#22d3ee" height={9} />
        </div>
        <ProgressRing value={overall} size={70} color="#22d3ee">
          <span className="ring-small">{overall}%</span>
        </ProgressRing>
        <div className="plan-type-counts">
          {(Object.keys(DAY_LABELS) as PlanDayType[]).map((type) => {
            const count = typeCounts[type] ?? 0;
            return (
              <span key={type} style={{ color: DAY_COLORS[type] }}>
                <Icon name={DAY_ICONS[type]} size={13} /> {countLabel(count, DAY_LABELS[type].toLowerCase(), DAY_PLURALS[type])}
              </span>
            );
          })}
        </div>
      </div>

      <div className="plan-filter">
        <button className={`chip ${weekFilter === 'all' ? 'active' : ''}`} onClick={() => setWeekFilter('all')}>
          Todas las semanas
        </button>
        {weeks.map(([week]) => (
          <button key={week} className={`chip ${weekFilter === week ? 'active' : ''}`} onClick={() => setWeekFilter(week)}>
            {week <= 8 ? `Semana ${week}` : 'Cierre'}
          </button>
        ))}
      </div>

      {visibleWeeks.map(([week, days]) => (
        <section key={week} className="plan-week">
          <div className="plan-week-head">
            <div>
              <span className="eyebrow">Bloque {week.toString().padStart(2, '0')}</span>
              <h2>{WEEK_TITLES[week - 1] ?? `Semana ${week}`}</h2>
            </div>
            <div className="plan-week-meta">
              <span>{days.length} días</span>
              <span>{countLabel(new Set(days.flatMap((day) => day.lessonIds).filter((id) => state.completedLessons.includes(id))).size, 'lección completada', 'lecciones completadas')}</span>
            </div>
          </div>

          <div className="plan-days">
            {days.map((day) => {
              const isToday = day.day === planDay;
              const isPast = day.day < planDay;
              const allDone = day.lessonIds.length > 0 && day.lessonIds.every((id) => state.completedLessons.includes(id));
              return (
                <article
                  key={day.day}
                  className={`plan-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${allDone ? 'done' : ''}`}
                  style={{ '--day-color': DAY_COLORS[day.type] } as React.CSSProperties}
                >
                  <div className="plan-day-top">
                    <span className="plan-day-number">{day.day}</span>
                    <span className="plan-day-type" style={{ color: DAY_COLORS[day.type], background: `${DAY_COLORS[day.type]}14` }}>
                      <Icon name={DAY_ICONS[day.type]} size={12} /> {DAY_LABELS[day.type]}
                    </span>
                    {allDone ? <span className="plan-day-check"><Icon name="check" size={13} /></span> : null}
                    {isToday ? <span className="plan-day-today">HOY</span> : null}
                  </div>
                  <h3>{day.title}</h3>
                  <p>{day.focus}</p>

                  {day.lessonIds.length > 0 ? (
                    <div className="plan-day-lessons">
                      {day.lessonIds.slice(0, 4).map((id) => {
                        const lesson = getLesson(id);
                        if (!lesson) return null;
                        const done = state.completedLessons.includes(id);
                        const world = WORLDS.find((item) => item.id === lesson.worldId);
                        return (
                          <button key={id} className={`plan-lesson-link ${done ? 'done' : ''}`} onClick={() => openLesson(id)}>
                            <span style={{ color: world?.color ?? '#22d3ee' }}>{done ? '✓' : '→'}</span>
                            <span>{lesson.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="plan-day-rest">
                      <Icon name={day.type === 'rest' ? 'shield' : 'book'} size={14} />
                      <span>{day.type === 'rest' ? 'Sin pantallas: caminar, dormir, repasar 5 minutos.' : 'Práctica libre o repaso de errores.'}</span>
                    </div>
                  )}

                  {isToday ? <span className="plan-day-glow" /> : null}
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section className="panel plan-method">
        <SectionTitle
          eyebrow="Método"
          title="Por qué este plan funciona"
          description="No es una lista de temas: es una secuencia con carga, práctica y descanso."
        />
        <div className="method-grid">
          {[
            { icon: 'book' as const, title: '4 lecciones por semana', detail: 'Dosis cortas y frecuentes. La constancia supera a la maratón.' },
            { icon: 'target' as const, title: 'Práctica dirigida', detail: 'El día 5 mezcla lo aprendido. Recuperar cuesta más que repasar.' },
            { icon: 'refresh' as const, title: 'Repaso espaciado', detail: 'El día 6 vuelve sobre los errores. Ahí se consolida la memoria.' },
            { icon: 'shield' as const, title: 'Descanso activo', detail: 'El día 7 baja la carga. Dormir también es estudiar.' }
          ].map((item) => (
            <div key={item.title} className="method-card">
              <span className="method-icon"><Icon name={item.icon} size={18} /></span>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
