import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Question } from '../data/types';
import { ALL_LESSONS, getLesson } from '../data/curriculum';
import {
  addXp,
  completeLesson,
  createInitialState,
  daysBetween,
  effectiveStreak,
  levelProgress,
  normalizeState,
  recordAnswer,
  recordExam,
  recordQuizFinish,
  todayKey,
  type ProgressState,
  type XpResult
} from '../lib/gamification';
import { clearProgress, loadProgress, saveProgress } from '../lib/storage';
import { burstConfetti } from '../lib/fx';
import { playBadge, playCorrect, playLevelUp, playWrong, setSoundEnabled } from '../lib/sfx';

export type ViewName =
  | 'dashboard'
  | 'map'
  | 'lesson'
  | 'practice'
  | 'steps'
  | 'exercises'
  | 'cinema'
  | 'exam'
  | 'progress'
  | 'plan'
  | 'lab';

export interface Route {
  view: ViewName;
  lessonId?: string;
}

export interface ToastMessage {
  id: number;
  title: string;
  detail?: string;
  tone: 'success' | 'info' | 'warning' | 'xp';
}

interface LearningContextValue {
  ready: boolean;
  state: ProgressState;
  route: Route;
  level: ReturnType<typeof levelProgress>;
  streak: number;
  planDay: number;
  toasts: ToastMessage[];
  levelUp: number | null;
  navigate: (view: ViewName, lessonId?: string) => void;
  openLesson: (lessonId: string) => void;
  recordQuestion: (question: Question, correct: boolean, xp?: number) => void;
  finishLesson: (lessonId: string, scorePercent: number) => void;
  finishQuiz: (correct: number, total: number) => void;
  saveExam: (result: { id: string; score: number; total: number; passed: boolean; worldId?: string }) => void;
  submitExam: (
    result: { id: string; score: number; total: number; passed: boolean; worldId?: string },
    answers: Array<{ question: Question; correct: boolean }>
  ) => void;
  toggleSound: () => void;
  toggleMotion: () => void;
  toggleLaser: () => void;
  resetAll: () => void;
  replaceState: (state: ProgressState) => void;
  dismissLevelUp: () => void;
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const LearningContext = createContext<LearningContextValue | null>(null);

function parseHash(): Route {
  if (typeof window === 'undefined') return { view: 'dashboard' };
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [view, lessonId] = hash.split('/');
  const views: ViewName[] = ['dashboard', 'map', 'lesson', 'practice', 'steps', 'exercises', 'cinema', 'exam', 'progress', 'plan', 'lab'];
  if (views.includes(view as ViewName)) {
    return { view: view as ViewName, lessonId };
  }
  return { view: 'dashboard' };
}

function hashFor(route: Route): string {
  return `#/${route.view}${route.lessonId ? `/${route.lessonId}` : ''}`;
}

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(createInitialState);
  const [ready, setReady] = useState(false);
  const [route, setRoute] = useState<Route>({ view: 'dashboard' });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const toastCounter = useRef(0);

  useEffect(() => {
    setState(loadProgress());
    setRoute(parseHash());
    setReady(true);
    const handleHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveProgress(state);
    setSoundEnabled(state.settings.sound);
    document.documentElement.classList.toggle('reduce-motion', state.settings.reduceMotion);
    document.documentElement.classList.toggle('laser-off', !state.settings.laser);
  }, [state, ready]);

  const pushToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = ++toastCounter.current;
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const applyResult = useCallback(
    (result: XpResult, message?: { title: string; detail?: string }) => {
      setState(result.state);
      if (result.leveledUp) {
        setLevelUp(result.newLevel);
        playLevelUp();
        burstConfetti();
      }
      if (result.newBadges.length > 0) {
        playBadge();
        result.newBadges.forEach((badge) => {
          pushToast({ title: 'Logro desbloqueado', detail: badge, tone: 'info' });
        });
      }
      if (message) {
        pushToast({ title: message.title, detail: message.detail, tone: 'xp' });
      }
    },
    [pushToast]
  );

  const navigate = useCallback((view: ViewName, lessonId?: string) => {
    const next = { view, lessonId };
    setRoute(next);
    try {
      window.history.replaceState(null, '', hashFor(next));
    } catch {
      // Ignorar restricciones del navegador.
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const openLesson = useCallback(
    (lessonId: string) => {
      const lesson = getLesson(lessonId);
      if (!lesson) return;
      navigate('lesson', lessonId);
    },
    [navigate]
  );

  const recordQuestion = useCallback(
    (question: Question, correct: boolean, xp?: number) => {
      const baseXp = xp ?? 8 + question.difficulty * 4;
      let next = recordAnswer(state, question, correct);
      if (correct) {
        const result = addXp(next, baseXp, { questions: 1, correct: 1 });
        applyResult(result);
        playCorrect(1);
      } else {
        const result = addXp(next, 0, { questions: 1 });
        setState(result.state);
        playWrong();
      }
    },
    [state, applyResult]
  );

  const finishLesson = useCallback(
    (lessonId: string, scorePercent: number) => {
      const lesson = getLesson(lessonId);
      const result = completeLesson(state, lessonId, scorePercent);
      applyResult(result, {
        title: 'Lección completada',
        detail: `${lesson?.title ?? lessonId} · +${lesson?.xp ?? 0} XP`
      });
      burstConfetti();
    },
    [state, applyResult]
  );

  const finishQuiz = useCallback(
    (correct: number, total: number) => {
      const result = recordQuizFinish(state, correct, total);
      applyResult(result, {
        title: 'Práctica terminada',
        detail: `${correct}/${total} correctas`
      });
      if (correct === total && total > 0) burstConfetti();
    },
    [state, applyResult]
  );

  const saveExam = useCallback(
    (exam: { id: string; score: number; total: number; passed: boolean; worldId?: string }) => {
      const result = recordExam(state, exam);
      applyResult(result, {
        title: exam.passed ? 'Simulacro aprobado' : 'Simulacro completado',
        detail: `${exam.score}/${exam.total} · ${Math.round((exam.score / Math.max(1, exam.total)) * 100)}%`
      });
    },
    [state, applyResult]
  );

  const submitExam = useCallback(
    (
      exam: { id: string; score: number; total: number; passed: boolean; worldId?: string },
      answers: Array<{ question: Question; correct: boolean }>
    ) => {
      let next = state;
      answers.forEach((answer) => {
        next = recordAnswer(next, answer.question, answer.correct);
      });
      const result = recordExam(next, exam);
      applyResult(result, {
        title: exam.passed ? 'Simulacro aprobado' : 'Simulacro completado',
        detail: `${exam.score}/${exam.total} · ${Math.round((exam.score / Math.max(1, exam.total)) * 100)}%`
      });
      if (exam.passed) burstConfetti();
    },
    [state, applyResult]
  );

  const toggleSound = useCallback(() => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, sound: !current.settings.sound }
    }));
  }, []);

  const toggleMotion = useCallback(() => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, reduceMotion: !current.settings.reduceMotion }
    }));
  }, []);

  const toggleLaser = useCallback(() => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, laser: !current.settings.laser }
    }));
  }, []);

  const resetAll = useCallback(() => {
    const fresh = clearProgress();
    setState(fresh);
    navigate('dashboard');
    pushToast({ title: 'Progreso reiniciado', detail: 'Empezás de cero. El mapa te espera.', tone: 'warning' });
  }, [navigate, pushToast]);

  const replaceState = useCallback((next: ProgressState) => {
    setState(normalizeState(next));
  }, []);

  const level = useMemo(() => levelProgress(state.xp), [state.xp]);
  const streak = useMemo(() => effectiveStreak(state), [state]);
  const planDay = useMemo(() => {
    const elapsed = daysBetween(state.startDate, todayKey()) + 1;
    return Math.max(1, Math.min(60, elapsed));
  }, [state.startDate]);

  const value = useMemo<LearningContextValue>(
    () => ({
      ready,
      state,
      route,
      level,
      streak,
      planDay,
      toasts,
      levelUp,
      navigate,
      openLesson,
      recordQuestion,
      finishLesson,
      finishQuiz,
      saveExam,
      submitExam,
      toggleSound,
      toggleMotion,
      toggleLaser,
      resetAll,
      replaceState,
      dismissLevelUp: () => setLevelUp(null),
      pushToast
    }),
    [
      ready,
      state,
      route,
      level,
      streak,
      planDay,
      toasts,
      levelUp,
      navigate,
      openLesson,
      recordQuestion,
      finishLesson,
      finishQuiz,
      saveExam,
      submitExam,
      toggleSound,
      toggleMotion,
      toggleLaser,
      resetAll,
      replaceState,
      pushToast
    ]
  );

  return <LearningContext.Provider value={value}>{children}</LearningContext.Provider>;
}

export function useLearning(): LearningContextValue {
  const context = useContext(LearningContext);
  if (!context) throw new Error('useLearning debe usarse dentro de LearningProvider');
  return context;
}

export function lessonUnlocked(state: ProgressState, lessonId: string): boolean {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return true;
  return state.completedLessons.length >= index;
}
