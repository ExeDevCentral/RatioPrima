import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_LESSONS,
  ALL_QUESTIONS,
  CONTENT_LESSONS,
  CURRICULUM_STATS,
  WORLDS,
  getLesson,
  getQuestion,
  nextLesson
} from '../web/src/data/curriculum.ts';
import { PLAN_60 } from '../web/src/data/plan.ts';
import { ACHIEVEMENTS } from '../web/src/data/achievements.ts';
import {
  createInitialState,
  levelFromXp,
  levelProgress,
  xpForLevel,
  completeLesson,
  recordExam,
  recordQuizFinish,
  achievementStats,
  accuracyPercent,
  LEVEL_TITLES,
  DAILY_GOAL
} from '../web/src/lib/gamification.ts';
import type { AchievementStats, LabKind, Question } from '../web/src/data/types.ts';

const LABS: LabKind[] = [
  'numberline',
  'balance',
  'unitcircle',
  'parabola',
  'tiles',
  'systems',
  'radicals',
  'laser3d'
];

const PLAN_TYPES = ['lesson', 'practice', 'review', 'exam', 'rest'];

function assertUnique(values: string[], label: string) {
  assert.equal(new Set(values).size, values.length, `${label} contiene identificadores repetidos`);
}

test('Currículo: 8 mundos, 4 misiones por mundo y 120 preguntas', () => {
  assert.equal(WORLDS.length, 8);
  assert.equal(ALL_LESSONS.length, 32);
  assert.equal(CONTENT_LESSONS.length, 28);
  assert.equal(ALL_QUESTIONS.length, 120);
  assert.equal(CURRICULUM_STATS.worlds, 8);
  assert.equal(CURRICULUM_STATS.lessons, 32);
  assert.equal(CURRICULUM_STATS.questions, 120);

  assertUnique(WORLDS.map((world) => world.id), 'WORLDS');
  assertUnique(ALL_LESSONS.map((lesson) => lesson.id), 'Lecciones');
  assertUnique(ALL_QUESTIONS.map((question) => question.id), 'Preguntas');

  WORLDS.forEach((world, index) => {
    assert.equal(world.order, index + 1, `Orden incorrecto en ${world.id}`);
    assert.ok(world.name.length > 0, `Mundo sin nombre: ${world.id}`);
    assert.ok(world.subtitle.length > 0, `Mundo sin subtítulo: ${world.id}`);
    assert.ok(world.description.length > 40, `Descripción muy corta en ${world.id}`);
    assert.match(world.color, /^#[0-9a-f]{6}$/i, `Color inválido en ${world.id}`);
    assert.equal(world.lessons.length, 4, `El mundo ${world.id} debe tener 4 misiones`);
  });
});

test('Currículo alineado: ordena los prerrequisitos del temario de ingreso', () => {
  const firstOf = (worldId: string) => CONTENT_LESSONS.findIndex((lesson) => lesson.worldId === worldId);
  assert.ok(firstOf('reales') < firstOf('operaciones'));
  assert.ok(firstOf('operaciones') < firstOf('trigonometria'));
  assert.ok(firstOf('trigonometria') < firstOf('algebra'));
  assert.ok(firstOf('algebra') < firstOf('ecuaciones'));
  assert.ok(firstOf('ecuaciones') < firstOf('inecuaciones'));
  assert.ok(firstOf('inecuaciones') < firstOf('sistemas'));
  assert.ok(CONTENT_LESSONS.every((lesson) => lesson.source.includes('Ingreso Terciario 2027')));
});

test('Lecciones: contenido, laboratorio y fuente completos', () => {
  ALL_LESSONS.forEach((lesson) => {
    const world = WORLDS.find((item) => item.id === lesson.worldId);
    assert.ok(world, `Lección ${lesson.id} apunta a un mundo inexistente`);
    assert.ok(world!.lessons.includes(lesson), `Lección ${lesson.id} no está registrada en su mundo`);
    assert.ok(lesson.title.length > 3, `Título inválido en ${lesson.id}`);
    assert.ok(lesson.tagline.length > 10, `Bajada insuficiente en ${lesson.id}`);
    assert.ok(lesson.minutes >= 10 && lesson.minutes <= 45, `Duración fuera de rango en ${lesson.id}`);
    assert.ok(lesson.xp > 0, `XP inválido en ${lesson.id}`);
    assert.ok(lesson.concepts.length >= 3, `Conceptos insuficientes en ${lesson.id}`);
    assert.ok(lesson.theory.length >= 2, `Bloques de teoría insuficientes en ${lesson.id}`);
    lesson.theory.forEach((block, index) => {
      assert.ok(block.body.length > 20, `Teoría vacía en ${lesson.id}, bloque ${index + 1}`);
    });
    assert.ok(lesson.formulas.length >= 1, `Fórmulas ausentes en ${lesson.id}`);
    assert.ok(LABS.includes(lesson.lab), `Laboratorio inválido en ${lesson.id}: ${lesson.lab}`);
    assert.ok(lesson.steps.length >= 2, `Pasos guiados insuficientes en ${lesson.id}`);
    assert.ok(lesson.source.length > 0, `Fuente ausente en ${lesson.id}`);
    assert.ok(lesson.questions.length >= 3, `Preguntas insuficientes en ${lesson.id}`);
  });
});

test('Preguntas: cuatro opciones, respuesta válida y explicación', () => {
  const validateQuestion = (question: Question, lessonId: string) => {
    assert.ok(question.prompt.length > 5, `Enunciado inválido en ${question.id}`);
    assert.equal(question.options.length, 4, `La pregunta ${question.id} debe tener 4 opciones`);
    assert.equal(new Set(question.options).size, 4, `Opciones repetidas en ${question.id}`);
    question.options.forEach((option) => {
      assert.ok(option.length > 0, `Opción vacía en ${question.id}`);
    });
    assert.ok(
      Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4,
      `Índice correcto inválido en ${question.id}`
    );
    assert.ok(question.explanation.length > 15, `Explicación insuficiente en ${question.id}`);
    assert.ok([1, 2, 3].includes(question.difficulty), `Dificultad inválida en ${question.id}`);
    assert.ok(
      question.id.startsWith(lessonId.split('-')[0]),
      `La pregunta ${question.id} no pertenece al mundo de ${lessonId}`
    );
  };

  ALL_LESSONS.forEach((lesson) => {
    lesson.questions.forEach((question) => validateQuestion(question, lesson.id));
  });

  assert.ok(ALL_QUESTIONS.filter((question) => question.difficulty === 1).length >= 20);
  assert.ok(ALL_QUESTIONS.filter((question) => question.difficulty === 2).length >= 20);
  assert.ok(ALL_QUESTIONS.filter((question) => question.difficulty === 3).length >= 10);
});

test('Plan de 60 días: secuencia completa y cobertura del currículo', () => {
  assert.equal(PLAN_60.length, 60);
  const days = PLAN_60.map((day) => day.day);
  assert.deepEqual(days, Array.from({ length: 60 }, (_, index) => index + 1));

  const lessonIds = new Set(ALL_LESSONS.map((lesson) => lesson.id));
  PLAN_60.forEach((day) => {
    assert.ok(PLAN_TYPES.includes(day.type), `Tipo inválido en el día ${day.day}: ${day.type}`);
    assert.ok(day.title.length > 0, `Día ${day.day} sin título`);
    assert.ok(day.focus.length > 0, `Día ${day.day} sin foco`);
    day.lessonIds.forEach((id) => {
      assert.ok(lessonIds.has(id), `El día ${day.day} referencia una lección inexistente: ${id}`);
    });
  });

  const scheduledLessons = PLAN_60
    .filter((day) => day.type === 'lesson')
    .flatMap((day) => day.lessonIds);
  assertUnique(scheduledLessons, 'Lecciones programadas como misión');
  CONTENT_LESSONS.forEach((lesson) => {
    assert.ok(
      scheduledLessons.includes(lesson.id),
      `La lección ${lesson.id} no tiene un día de misión en el plan`
    );
  });

  const lastWeek = PLAN_60.slice(-4);
  assert.deepEqual(lastWeek.map((day) => day.type), ['exam', 'review', 'practice', 'rest']);
  assert.equal(PLAN_60[PLAN_60.length - 1].day, 60);
});

test('Gamificación: niveles, XP y progreso coherentes', () => {
  assert.equal(levelFromXp(0), 1);
  assert.equal(levelFromXp(49), 1);
  assert.equal(levelFromXp(50), 2);
  assert.equal(levelFromXp(5000), LEVEL_TITLES.length);
  assert.equal(levelFromXp(999999), LEVEL_TITLES.length);
  assert.equal(xpForLevel(1), 0);
  assert.equal(xpForLevel(2), 50);
  assert.equal(xpForLevel(3), 200);

  for (let level = 1; level <= LEVEL_TITLES.length; level++) {
    const xp = xpForLevel(level);
    assert.equal(levelFromXp(xp), level, `El nivel ${level} no coincide con su umbral de XP`);
    const progress = levelProgress(xp);
    assert.equal(progress.level, level);
    assert.ok(progress.percent >= 0 && progress.percent <= 100);
    assert.ok(progress.title.length > 0);
  }

  let previous = 0;
  for (let xp = 0; xp <= 6000; xp += 25) {
    const level = levelFromXp(xp);
    assert.ok(level >= previous, 'El nivel debe ser monótono creciente');
    previous = level;
  }
});

test('Gamificación: completar lección, práctica y simulacro actualizan el estado', () => {
  const initial = createInitialState();
  assert.equal(initial.xp, 0);
  assert.equal(initial.daily.goal, DAILY_GOAL);

  const lesson = CONTENT_LESSONS[0];
  const first = completeLesson(initial, lesson.id, 100);
  assert.ok(first.state.completedLessons.includes(lesson.id));
  assert.ok(first.state.xp > 0, 'Completar una lección debe otorgar XP');
  assert.equal(first.state.lessonBest[lesson.id], 100);
  assert.ok(first.newBadges.length >= 1, 'La primera lección debe desbloquear un logro');

  const second = completeLesson(first.state, lesson.id, 80);
  assert.equal(
    second.state.completedLessons.filter((id) => id === lesson.id).length,
    1,
    'La lección no debe duplicarse al repetirla'
  );
  assert.equal(second.state.lessonBest[lesson.id], 100, 'El récord no debe bajar');
  assert.ok(second.state.xp > first.state.xp, 'Repetir una lección también otorga XP');

  const today = initial.daily.date;
  const beforeQuiz = second.state.days[today]?.questions ?? 0;
  const quiz = recordQuizFinish(second.state, 8, 10);
  assert.equal(quiz.state.totalQuizzes, 1);
  assert.equal(quiz.state.perfectQuizzes, 0);
  assert.ok(quiz.state.xp > second.state.xp);
  assert.equal(
    quiz.state.days[today]?.questions ?? 0,
    beforeQuiz,
    'La práctica no debe duplicar las preguntas ya registradas una por una'
  );

  const beforeExam = quiz.state.days[today];
  const exam = recordExam(quiz.state, {
    id: 'simulacro-integral',
    score: 8,
    total: 10,
    passed: true
  });
  assert.equal(exam.state.examResults.length, 1);
  assert.equal(exam.state.examResults[0].passed, true);
  assert.ok(exam.state.examResults[0].date.match(/^\d{4}-\d{2}-\d{2}$/));
  assert.ok(exam.state.xp > quiz.state.xp);
  assert.equal(
    exam.state.days[today].questions,
    (beforeExam?.questions ?? 0) + 10,
    'El simulacro debe contabilizar sus 10 preguntas una sola vez'
  );
  assert.equal(
    exam.state.days[today].correct,
    (beforeExam?.correct ?? 0) + 8,
    'El simulacro debe contabilizar sus aciertos'
  );
  assert.equal(accuracyPercent(exam.state), 0, 'La precisión solo cuenta respuestas registradas');
});

test('Logros: identificadores únicos y comprobaciones seguras', () => {
  assertUnique(ACHIEVEMENTS.map((achievement) => achievement.id), 'Logros');
  assert.ok(ACHIEVEMENTS.length >= 12);

  const zero: AchievementStats = {
    xp: 0,
    level: 1,
    streak: 0,
    completedLessons: 0,
    correctAnswers: 0,
    perfectQuizzes: 0,
    completedWorlds: 0,
    examPasses: 0
  };
  const maxed: AchievementStats = {
    xp: 99999,
    level: LEVEL_TITLES.length,
    streak: 60,
    completedLessons: ALL_LESSONS.length,
    correctAnswers: 500,
    perfectQuizzes: 40,
    completedWorlds: WORLDS.length,
    examPasses: 30
  };

  ACHIEVEMENTS.forEach((achievement) => {
    assert.ok(achievement.name.length > 0, `Logro ${achievement.id} sin nombre`);
    assert.ok(achievement.description.length > 10, `Logro ${achievement.id} sin descripción`);
    assert.ok(achievement.xp > 0, `Logro ${achievement.id} sin recompensa`);
    assert.equal(typeof achievement.check(zero), 'boolean', `Logro ${achievement.id} no devuelve booleano`);
    assert.equal(achievement.check(maxed), true, `Logro ${achievement.id} no se desbloquea al máximo`);
  });

  const state = createInitialState();
  const stats = achievementStats(state);
  assert.equal(stats.level, 1);
  assert.equal(stats.completedWorlds, 0);
  assert.equal(stats.examPasses, 0);
});

test('Búsquedas del currículo: lección, pregunta y siguiente misión', () => {
  const first = ALL_LESSONS[0];
  assert.equal(getLesson(first.id)?.id, first.id);
  assert.equal(getQuestion(ALL_QUESTIONS[0].id)?.id, ALL_QUESTIONS[0].id);
  assert.equal(nextLesson(first.id)?.id, ALL_LESSONS[1].id);
  assert.equal(nextLesson(ALL_LESSONS[ALL_LESSONS.length - 1].id), undefined);
  assert.equal(getLesson('no-existe'), undefined);
});
