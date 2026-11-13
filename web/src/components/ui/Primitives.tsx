import React, { useEffect } from 'react';
import Icon, { type IconName } from './Icon';

export function ProgressRing({
  value,
  size = 64,
  stroke = 5,
  color = '#22d3ee',
  track = 'rgba(148, 163, 184, 0.16)',
  children
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease', filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="progress-ring-content">{children ?? <span>{Math.round(clamped)}%</span>}</div>
    </div>
  );
}

export function Bar({
  value,
  color = '#22d3ee',
  height = 7,
  className = ''
}: {
  value: number;
  color?: string;
  height?: number;
  className?: string;
}) {
  return (
    <div className={`bar ${className}`} style={{ height }}>
      <div
        className="bar-fill"
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          boxShadow: `0 0 12px ${color}66`
        }}
      />
    </div>
  );
}

export function Pill({
  children,
  color = '#22d3ee',
  icon,
  className = ''
}: {
  children: React.ReactNode;
  color?: string;
  icon?: IconName;
  className?: string;
}) {
  return (
    <span
      className={`pill ${className}`}
      style={{ color, borderColor: `${color}55`, background: `${color}14` }}
    >
      {icon ? <Icon name={icon} size={13} /> : null}
      {children}
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  right
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
      {right ? <div className="section-title-right">{right}</div> : null}
    </div>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  wide = false
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-card ${wide ? 'modal-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-foot">{footer}</div> : null}
      </div>
    </div>
  );
}

export function LaserLine({ className = '' }: { className?: string }) {
  return (
    <svg className={`laser-line ${className}`} viewBox="0 0 600 4" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="laser-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="35%" stopColor="#22d3ee" />
          <stop offset="65%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d="M0 2 H600" stroke="url(#laser-gradient)" strokeWidth="2" className="laser-dash" />
    </svg>
  );
}

export function StatTile({
  icon,
  label,
  value,
  color = '#22d3ee',
  hint
}: {
  icon: IconName;
  label: string;
  value: React.ReactNode;
  color?: string;
  hint?: string;
}) {
  return (
    <div className="stat-tile">
      <div className="stat-icon" style={{ color, background: `${color}16`, borderColor: `${color}33` }}>
        <Icon name={icon} size={18} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {hint ? <div className="stat-hint">{hint}</div> : null}
      </div>
    </div>
  );
}
