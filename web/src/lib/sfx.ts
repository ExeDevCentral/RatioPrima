let audioContext: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

function getContext(): AudioContext | null {
  if (!soundEnabled || typeof window === 'undefined') return null;
  try {
    if (!audioContext) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      audioContext = new Ctor();
    }
    if (audioContext.state === 'suspended') {
      void audioContext.resume();
    }
    return audioContext;
  } catch {
    return null;
  }
}

function tone(
  frequency: number,
  duration: number,
  options: { type?: OscillatorType; delay?: number; gain?: number } = {}
): void {
  const ctx = getContext();
  if (!ctx) return;
  const start = ctx.currentTime + (options.delay ?? 0);
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = options.type ?? 'sine';
  oscillator.frequency.setValueAtTime(frequency, start);
  const peak = options.gain ?? 0.045;
  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.exponentialRampToValueAtTime(peak, start + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playClick(): void {
  tone(520, 0.05, { type: 'triangle', gain: 0.025 });
}

export function playCorrect(combo = 1): void {
  const base = 440 * Math.pow(2, Math.min(combo - 1, 6) / 12);
  tone(base, 0.12, { type: 'sine' });
  tone(base * 1.5, 0.16, { type: 'sine', delay: 0.06 });
}

export function playWrong(): void {
  tone(180, 0.16, { type: 'sawtooth', gain: 0.03 });
  tone(130, 0.22, { type: 'sawtooth', delay: 0.08, gain: 0.025 });
}

export function playLevelUp(): void {
  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    tone(frequency, 0.2, { type: 'triangle', delay: index * 0.09, gain: 0.05 });
  });
}

export function playLaser(): void {
  const ctx = getContext();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = 'sawtooth';
  const start = ctx.currentTime;
  oscillator.frequency.setValueAtTime(1400, start);
  oscillator.frequency.exponentialRampToValueAtTime(280, start + 0.22);
  gainNode.gain.setValueAtTime(0.0001, start);
  gainNode.gain.exponentialRampToValueAtTime(0.03, start + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, start + 0.24);
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.26);
}

export function playBadge(): void {
  [660, 880, 1100].forEach((frequency, index) => {
    tone(frequency, 0.25, { type: 'sine', delay: index * 0.1, gain: 0.04 });
  });
}

export function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignorar.
  }
}
