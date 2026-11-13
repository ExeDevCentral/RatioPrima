import { STORAGE_KEY, createInitialState, normalizeState, type ProgressState } from './gamification';

export function loadProgress(): ProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    return normalizeState(JSON.parse(raw) as Partial<ProgressState>);
  } catch {
    return createInitialState();
  }
}

export function saveProgress(state: ProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // El almacenamiento puede estar bloqueado en modo incógnito o iframes restringidos.
  }
}

export function clearProgress(): ProgressState {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignorar.
  }
  return createInitialState();
}

export function exportProgress(state: ProgressState): string {
  return JSON.stringify(state, null, 2);
}

export function importProgress(json: string): ProgressState | null {
  try {
    const parsed = JSON.parse(json) as Partial<ProgressState>;
    return normalizeState(parsed);
  } catch {
    return null;
  }
}
