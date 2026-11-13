import type { PlanDay, PlanDayType } from './types';
import { CONTENT_LESSONS, simulacros } from './curriculum.ts';

/**
 * Plan de 60 días: 8 semanas de contenido + 4 días de cierre.
 * Cada semana tiene 4 lecciones nuevas, 1 práctica, 1 repaso espaciado y 1 descanso activo.
 */
export function buildPlan(): PlanDay[] {
  const plan: PlanDay[] = [];
  let lessonCursor = 0;

  for (let week = 1; week <= 7; week++) {
    const weekLessons = CONTENT_LESSONS.slice(lessonCursor, lessonCursor + 4);
    lessonCursor += 4;
    const weekIds = weekLessons.map((lesson) => lesson.id);

    for (let offset = 0; offset < 7; offset++) {
      const day = (week - 1) * 7 + offset + 1;
      let type: PlanDayType = 'lesson';
      let title = '';
      let ids: string[] = [];
      let focus = '';

      if (offset < 4) {
        const lesson = weekLessons[offset];
        type = 'lesson';
        title = lesson.title;
        ids = [lesson.id];
        focus = lesson.concepts.slice(0, 3).join(' · ');
      } else if (offset === 4) {
        type = 'practice';
        title = 'Práctica dirigida';
        ids = weekIds;
        focus = '10 preguntas mezcladas del mundo';
      } else if (offset === 5) {
        type = 'review';
        title = 'Repaso espaciado';
        ids = weekIds;
        focus = 'Errores de la semana + tarjetas';
      } else {
        type = 'rest';
        title = 'Descanso activo';
        ids = [];
        focus = 'Caminar, dormir bien y repasar 5 minutos';
      }

      plan.push({ day, week, type, title, lessonIds: ids, focus });
    }
  }

  const arena = simulacros.lessons;
  for (let offset = 0; offset < 7; offset++) {
    const day = 49 + offset + 1;
    const lesson = arena[offset];
    let type: PlanDayType = 'lesson';
    let title = '';
    let ids: string[] = [];
    let focus = '';

    if (offset < 4) {
      type = lesson.id === 'simulacros-examen' ? 'exam' : 'lesson';
      title = lesson.title;
      ids = [lesson.id];
      focus = 'Simulacro cronometrado';
    } else if (offset === 4) {
      type = 'practice';
      title = 'Práctica de cierre';
      ids = arena.map((item) => item.id);
      focus = 'Mezcla de todos los mundos';
    } else if (offset === 5) {
      type = 'review';
      title = 'Repaso final';
      ids = arena.map((item) => item.id);
      focus = 'Tabla de errores y fórmulas';
    } else {
      type = 'rest';
      title = 'Descanso activo';
      ids = [];
      focus = 'Preparar el examen';
    }

    plan.push({ day, week: 8, type, title, lessonIds: ids, focus });
  }

  const closing: Array<{ type: PlanDayType; title: string; focus: string }> = [
    { type: 'exam', title: 'Examen final cronometrado', focus: '40 minutos, sin apuntes' },
    { type: 'review', title: 'Revisión de errores', focus: 'Solo los temas fallados' },
    { type: 'practice', title: 'Última práctica', focus: '20 preguntas de repaso' },
    { type: 'rest', title: 'Cierre y descanso', focus: 'Llegaste. Confiá en tu preparación.' }
  ];

  closing.forEach((item, index) => {
    plan.push({
      day: 57 + index,
      week: 9,
      type: item.type,
      title: item.title,
      lessonIds: item.type === 'exam' ? ['simulacros-examen'] : [],
      focus: item.focus
    });
  });

  return plan;
}

export const PLAN_60 = buildPlan();
