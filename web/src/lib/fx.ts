export function burstConfetti(): void {
  if (typeof document === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#22d3ee', '#a78bfa', '#fde047', '#34d399', '#fb7185', '#f59e0b'];
  const container = document.createElement('div');
  container.className = 'confetti-layer';
  container.setAttribute('aria-hidden', 'true');

  for (let index = 0; index < 36; index++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const x = 50 + (Math.random() - 0.5) * 40;
    const y = 45 + (Math.random() - 0.5) * 20;
    const dx = (Math.random() - 0.5) * 340;
    const dy = -80 - Math.random() * 260;
    const rotation = Math.random() * 720 - 360;
    piece.style.left = `${x}%`;
    piece.style.top = `${y}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty('--dx', `${dx}px`);
    piece.style.setProperty('--dy', `${dy}px`);
    piece.style.setProperty('--rot', `${rotation}deg`);
    piece.style.animationDelay = `${Math.random() * 0.12}s`;
    container.appendChild(piece);
  }

  document.body.appendChild(container);
  window.setTimeout(() => container.remove(), 1800);
}

export function scrollToTop(): void {
  try {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch {
    window.scrollTo(0, 0);
  }
}
