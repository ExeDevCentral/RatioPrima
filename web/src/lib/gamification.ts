import { ACHIEVEMENTS } from '../data/achievements.ts';
import { ALL_LESSONS, ALL_QUESTIONS, WORLDS } from '../data/curriculum.ts';
import type { AchievementStats, Question } from '../data/types';

export const STATE_VERSION = 2;
export const STORAGE_KEY = 'polymath-zero-v2';
export const DAILY_GOAL = 100;

export interface QuestionStat {
  attempts: number;
  correct: number;
}

export interface ExamResult {
  id: string;
  date: string;
  score: number;
  total: number;
  passed: boolean;
  worldId?: string;
}

export interface DayLog {
  date: string;
  xp: number;
  lessons: number;
  questions: number;
  correct: number;
}

export interface WeeklySnapshot {
  date: string;
  xp: number;
}

export interface ProgressState {
  version: number;
  xp: number;
  coins: number;
  streak: number;
  bestStreak: number;
  lastActiveDay: string | null;
  startDate: string;
  completedLessons: string[];
  lessonBest: Record<string, number>;
  questionStats: Record<string, QuestionStat>;
  badges: string[];
  daily: DayLog & { goal: number };
  days: Record<string, DayLog>;
  perfectQuizzes: number;
  totalQuizzes: number;
  examResults: ExamResult[];
  settings: {
    sound: boolean;
    reduceMotion: boolean;
    laser: boolean;
  };
}

export const LEVEL_TITLES = [
  'Novato',
  'Aprendiz',
  'Explorador',
  'Analista',
  'Ingeniero',
  'Arquitecto',
  'Estratega',
  'Maestro',
  'Sabio',
  'Polímata',
  'Leyenda'
];

export function todayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDays(key: string, amount: number): string {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + amount);
  return todayKey(date);
}

export function daysBetween(from: string, to: string): number {
  const [y1, m1, d1] = from.split('-').map(Number);
  const [y2, m2, d2] = to.split('-').map(Number);
  const a = Date.UTC(y1, m1 - 1, d1);
  const b = Date.UTC(y2, m2 - 1, d2);
  return Math.round((b - a) / 86400000);
}

export function createInitialState(): ProgressState {
  const today = todayKey();
  return {
    version: STATE_VERSION,
    xp: 0,
    coins: 0,
    streak: 0,
    bestStreak: 0,
    lastActiveDay: null,
    startDate: today,
    completedLessons: [],
    lessonBest: {},
    questionStats: {},
    badges: [],
    daily: { date: today, xp: 0, lessons: 0, questions: 0, correct: 0, goal: DAILY_GOAL },
    days: {},
    perfectQuizzes: 0,
    totalQuizzes: 0,
    examResults: [],
    settings: { sound: true, reduceMotion: false, laser: true }
  };
}

export function normalizeState(input: Partial<ProgressState> | null | undefined): ProgressState {
  const base = createInitialState();
  if (!input || typeof input !== 'object') return base;
  const today = todayKey();
  const daily = input.daily && input.daily.date === today
    ? { ...base.daily, ...input.daily, goal: input.daily.goal || DAILY_GOAL }
    : { ...base.daily };

  return {
    ...base,
    ...input,
    version: STATE_VERSION,
    completedLessons: Array.isArray(input.completedLessons) ? input.completedLessons : [],
    lessonBest: input.lessonBest && typeof input.lessonBest === 'object' ? input.lessonBest : {},
    questionStats:
      input.questionStats && typeof input.questionStats === 'object' ? input.questionStats : {},
    badges: Array.isArray(input.badges) ? input.badges : [],
    days: input.days && typeof input.days === 'object' ? input.days : {},
    examResults: Array.isArray(input.examResults) ? input.examResults : [],
    daily,
    settings: { ...base.settings, ...(input.settings || {}) },
    xp: Number.isFinite(input.xp) ? Number(input.xp) : 0,
    coins: Number.isFinite(input.coins) ? Number(input.coins) : 0,
    streak: Number.isFinite(input.streak) ? Number(input.streak) : 0,
    bestStreak: Number.isFinite(input.bestStreak) ? Number(input.bestStreak) : 0,
    perfectQuizzes: Number.isFinite(input.perfectQuizzes) ? Number(input.perfectQuizzes) : 0,
    totalQuizzes: Number.isFinite(input.totalQuizzes) ? Number(input.totalQuizzes) : 0,
    startDate: typeof input.startDate === 'string' ? input.startDate : today
  };
}

export function levelFromXp(xp: number): number {
  if (xp <= 0) return 1;
  return Math.min(LEVEL_TITLES.length, Math.floor(Math.sqrt(xp / 50)) + 1);
}

export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(50 * Math.pow(level - 1, 2));
}

export function levelProgress(xp: number): {
  level: number;
  title: string;
  current: number;
  next: number;
  percent: number;
  remaining: number;
} {
  const level = levelFromXp(xp);
  const current = xpForLevel(level);
  const next = xpForLevel(Math.min(LEVEL_TITLES.length, level + 1));
  const span = Math.max(1, next - current);
  const percent = level >= LEVEL_TITLES.length ? 100 : Math.min(100, Math.max(0, ((xp - current) / span) * 100));
  return {
    level,
    title: LEVEL_TITLES[level - 1] ?? 'Leyenda',
    current,
    next,
    percent,
    remaining: Math.max(0, next - xp)
  };
}

export function effectiveStreak(state: ProgressState): number {
  if (!state.lastActiveDay) return 0;
  const gap = daysBetween(state.lastActiveDay, todayKey());
  if (gap <= 1) return state.streak;
  return 0;
}

export function totalCorrect(state: ProgressState): number {
  return Object.values(state.questionStats).reduce((sum, stat) => sum + stat.correct, 0);
}

export function totalAttempts(state: ProgressState): number {
  return Object.values(state.questionStats).reduce((sum, stat) => sum + stat.attempts, 0);
}

export function completedWorldCount(state: ProgressState): number {
  return WORLDS.filter((world) =>
    world.lessons.every((lesson) => state.completedLessons.includes(lesson.id))
  ).length;
}

export function achievementStats(state: ProgressState): AchievementStats {
  return {
    xp: state.xp,
    level: levelFromXp(state.xp),
    streak: effectiveStreak(state),
    completedLessons: state.completedLessons.length,
    correctAnswers: totalCorrect(state),
    perfectQuizzes: state.perfectQuizzes,
    completedWorlds: completedWorldCount(state),
    examPasses: state.examResults.filter((result) => result.passed).length
  };
}

function ensureDaily(state: ProgressState): ProgressState {
  const today = todayKey();
  if (state.daily.date === today) return state;
  return {
    ...state,
    daily: { date: today, xp: 0, lessons: 0, questions: 0, correct: 0, goal: state.daily.goal || DAILY_GOAL }
  };
}

function touchStreak(state: ProgressState): ProgressState {
  const today = todayKey();
  if (state.lastActiveDay === today) return state;
  const gap = state.lastActiveDay ? daysBetween(state.lastActiveDay, today) : Infinity;
  const streak = gap === 1 ? state.streak + 1 : 1;
  return {
    ...state,
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    lastActiveDay: today
  };
}

function applyDayLog(
  state: ProgressState,
  patch: Partial<DayLog>
): ProgressState {
  const today = todayKey();
  const current: DayLog = state.days[today] ?? {
    date: today,
    xp: 0,
    lessons: 0,
    questions: 0,
    correct: 0
  };
  const next: DayLog = {
    date: today,
    xp: current.xp + (patch.xp ?? 0),
    lessons: current.lessons + (patch.lessons ?? 0),
    questions: current.questions + (patch.questions ?? 0),
    correct: current.correct + (patch.correct ?? 0)
  };
  return {
    ...state,
    days: { ...state.days, [today]: next },
    daily: {
      ...state.daily,
      xp: state.daily.xp + (patch.xp ?? 0),
      lessons: state.daily.lessons + (patch.lessons ?? 0),
      questions: state.daily.questions + (patch.questions ?? 0),
      correct: state.daily.correct + (patch.correct ?? 0)
    }
  };
}

export interface XpResult {
  state: ProgressState;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  newBadges: string[];
}

export function addXp(
  rawState: ProgressState,
  amount: number,
  meta?: { lessons?: number; questions?: number; correct?: number; awardAchievements?: boolean }
): XpResult {
  let state = ensureDaily(rawState);
  const oldLevel = levelFromXp(state.xp);
  const safeAmount = Math.max(0, Math.round(amount));

  state = {
    ...state,
    xp: state.xp + safeAmount,
    coins: state.coins + Math.round(safeAmount / 10)
  };
  state = applyDayLog(state, {
    xp: safeAmount,
    lessons: meta?.lessons ?? 0,
    questions: meta?.questions ?? 0,
    correct: meta?.correct ?? 0
  });
  if (safeAmount > 0) state = touchStreak(state);

  const newBadges: string[] = [];
  let bonus = 0;

  if (meta?.awardAchievements !== false) {
    const stats = achievementStats(state);
    for (const achievement of ACHIEVEMENTS) {
      if (!state.badges.includes(achievement.id) && achievement.check(stats)) {
        state = { ...state, badges: [...state.badges, achievement.id] };
        bonus += achievement.xp;
        newBadges.push(achievement.id);
      }
    }
    if (bonus > 0) {
      state = {
        ...state,
        xp: state.xp + bonus,
        coins: state.coins + Math.round(bonus / 10)
      };
      state = applyDayLog(state, { xp: bonus });
    }
  }

  const newLevel = levelFromXp(state.xp);
  return {
    state,
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel,
    newBadges
  };
}

export function recordAnswer(
  state: ProgressState,
  question: Question,
  correct: boolean
): ProgressState {
  const previous = state.questionStats[question.id] ?? { attempts: 0, correct: 0 };
  return {
    ...state,
    questionStats: {
      ...state.questionStats,
      [question.id]: {
        attempts: previous.attempts + 1,
        correct: previous.correct + (correct ? 1 : 0)
      }
    }
  };
}

export function completeLesson(
  state: ProgressState,
  lessonId: string,
  scorePercent: number
): XpResult {
  const lesson = ALL_LESSONS.find((item) => item.id === lessonId);
  const firstTime = !state.completedLessons.includes(lessonId);
  let next: ProgressState = {
    ...state,
    completedLessons: firstTime
      ? [...state.completedLessons, lessonId]
      : state.completedLessons,
    lessonBest: {
      ...state.lessonBest,
      [lessonId]: Math.max(state.lessonBest[lessonId] ?? 0, scorePercent)
    }
  };

  const baseXp = lesson ? Math.round(lesson.xp * (firstTime ? 1 : 0.25)) : 20;
  const scoreBonus = Math.round((lesson?.xp ?? 40) * 0.25 * (scorePercent / 100));
  const result = addXp(next, baseXp + scoreBonus, {
    lessons: firstTime ? 1 : 0,
    awardAchievements: true
  });
  return result;
}

export function recordExam(
  state: ProgressState,
  result: Omit<ExamResult, 'date'>
): XpResult {
  const exam: ExamResult = { ...result, date: todayKey() };
  const next: ProgressState = {
    ...state,
    examResults: [exam, ...state.examResults].slice(0, 30)
  };
  const xp = result.passed ? 90 + Math.round((result.score / Math.max(1, result.total)) * 60) : 25;
  return addXp(next, xp, {
    questions: result.total,
    correct: result.score,
    awardAchievements: true
  });
}

export function recordQuizFinish(
  state: ProgressState,
  correct: number,
  total: number
): XpResult {
  const perfect = total > 0 && correct === total;
  const next: ProgressState = {
    ...state,
    totalQuizzes: state.totalQuizzes + 1,
    perfectQuizzes: state.perfectQuizzes + (perfect ? 1 : 0)
  };
  // Cada respuesta ya se registra con recordQuestion al comprobarla;
  // acá solo se otorga el XP de cierre para no duplicar las métricas diarias.
  const xp = 10 + correct * 6 + (perfect ? 40 : 0);
  return addXp(next, xp, { awardAchievements: true });
}

export function toggleLessonCompleted(state: ProgressState, lessonId: string): ProgressState {
  if (state.completedLessons.includes(lessonId)) {
    return { ...state, completedLessons: state.completedLessons.filter((id) => id !== lessonId) };
  }
  return { ...state, completedLessons: [...state.completedLessons, lessonId] };
}

export function recommendedLesson(state: ProgressState): string {
  const pending = ALL_LESSONS.find((lesson) => !state.completedLessons.includes(lesson.id));
  return pending?.id ?? ALL_LESSONS[ALL_LESSONS.length - 1].id;
}

export function questionPoolByDifficulty(
  state: ProgressState,
  difficulty?: 1 | 2 | 3
): Question[] {
  const pool = difficulty
    ? ALL_QUESTIONS.filter((question) => question.difficulty === difficulty)
    : ALL_QUESTIONS;
  return pool.filter((question) => {
    const stat = state.questionStats[question.id];
    return !stat || stat.correct === 0 || stat.attempts < 4;
  });
}

export function accuracyPercent(state: ProgressState): number {
  const attempts = totalAttempts(state);
  if (attempts === 0) return 0;
  return Math.round((totalCorrect(state) / attempts) * 100);
}
