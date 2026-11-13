import React, { useMemo } from 'react';
import { LearningProvider, useLearning, type ViewName } from './state/LearningContext';
import Dashboard from './views/Dashboard';
import MapView from './views/MapView';
import LessonView from './views/LessonView';
import PracticeView from './views/PracticeView';
import ExamView from './views/ExamView';
import ProgressView from './views/ProgressView';
import PlanView from './views/PlanView';
import LabView from './views/LabView';
import StepsPracticeView from './views/StepsPracticeView';
import Cinema3DTutorView from './views/Cinema3DTutorView';
import Icon, { type IconName } from './components/ui/Icon';
import { Bar, Modal, ProgressRing } from './components/ui/Primitives';
import { LEVEL_TITLES } from './lib/gamification';

interface NavItem {
  view: ViewName;
  label: string;
  icon: IconName;
  hint: string;
}

const NAV_ITEMS: NavItem[] = [
  { view: 'dashboard', label: 'Panel', icon: 'home', hint: 'Tu misión de hoy' },
  { view: 'map', label: 'Mapa', icon: 'map', hint: 'Los 8 mundos' },
  { view: 'steps', label: 'Pasos 10+10', icon: 'route', hint: 'Teclado + IA en vivo' },
  { view: 'cinema', label: 'Cine 3D + IA', icon: 'laser', hint: '3D gigante + Tutor IA' },
  { view: 'practice', label: 'Práctica', icon: 'target', hint: '10 preguntas rápidas' },
  { view: 'exam', label: 'Simulacros', icon: 'trophy', hint: 'La Arena' },
  { view: 'progress', label: 'Progreso', icon: 'chart', hint: 'Tus números' },
  { view: 'plan', label: 'Plan 60 días', icon: 'calendar', hint: 'Semana a semana' },
  { view: 'lab', label: 'Laboratorio', icon: 'flask', hint: 'Jugar sin reglas' }
];

const MOBILE_ITEMS: NavItem[] = NAV_ITEMS.filter((item) =>
  ['dashboard', 'map', 'steps', 'practice', 'lab'].includes(item.view)
);

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? 'compact' : ''}`}>
      <div className="brand-mark">
        <span>P</span>
        <span>Z</span>
      </div>
      {!compact ? (
        <div className="brand-copy">
          <strong>Polymath<span>Zero</span></strong>
          <small>Ingreso 2027 · matemática</small>
        </div>
      ) : null}
    </div>
  );
}

function SideNav() {
  const { route, navigate, level, state } = useLearning();
  return (
    <aside className="side-nav">
      <div className="side-nav-top">
        <Brand />
        <div className="side-level">
          <div className="side-level-row">
            <span>Nivel {level.level}</span>
            <em>{level.title}</em>
          </div>
          <Bar value={level.percent} color="#22d3ee" height={5} />
          <div className="side-level-xp">{state.xp} XP · {level.remaining > 0 ? `faltan ${level.remaining}` : 'máximo'}</div>
        </div>
      </div>

      <nav className="side-links" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          const active = route.view === item.view || (route.view === 'lesson' && item.view === 'map');
          return (
            <button
              key={item.view}
              className={`side-link ${active ? 'active' : ''}`}
              onClick={() => navigate(item.view)}
              title={item.hint}
            >
              <span className="side-link-icon"><Icon name={item.icon} size={18} /></span>
              <span className="side-link-copy">
                <strong>{item.label}</strong>
                <small>{item.hint}</small>
              </span>
              <span className="side-link-arrow"><Icon name="chevron" size={13} /></span>
            </button>
          );
        })}
      </nav>

      <div className="side-nav-bottom">
        <a className="side-link legacy" href="/workbench">
          <span className="side-link-icon"><Icon name="flask" size={18} /></span>
          <span className="side-link-copy">
            <strong>Workbench clásico</strong>
            <small>REPL, demostraciones y canon</small>
          </span>
          <span className="side-link-arrow"><Icon name="arrow" size={13} /></span>
        </a>
        <div className="side-foot">
          <Icon name="laser" size={13} />
          <span>Hecho para aprender jugando</span>
        </div>
      </div>
    </aside>
  );
}

function TopHUD() {
  const { state, level, streak, planDay, navigate, toggleSound, toggleMotion, toggleLaser } = useLearning();
  const dailyPercent = Math.min(100, Math.round((state.daily.xp / Math.max(1, state.daily.goal)) * 100));

  return (
    <header className="top-hud">
      <div className="top-hud-mobile">
        <Brand compact />
        <span className="top-hud-day">Día {planDay}</span>
      </div>

      <div className="top-hud-left">
        <button className="hud-chip hud-xp" onClick={() => navigate('progress')} title="Ver progreso">
          <span className="hud-icon"><Icon name="bolt" size={15} /></span>
          <span className="hud-text"><strong>{state.xp} XP</strong><small>Nivel {level.level} · {level.title}</small></span>
        </button>
        <button className="hud-chip hud-streak" onClick={() => navigate('progress')} title="Racha de días">
          <span className="hud-icon"><Icon name="flame" size={15} /></span>
          <span className="hud-text"><strong>{streak} {streak === 1 ? 'día' : 'días'}</strong><small>racha</small></span>
        </button>
        <button className="hud-chip hud-coins" onClick={() => navigate('progress')} title="Monedas">
          <span className="hud-icon"><Icon name="star" size={15} /></span>
          <span className="hud-text"><strong>{state.coins}</strong><small>monedas</small></span>
        </button>
      </div>

      <div className="top-hud-right">
        <button className="hud-goal" onClick={() => navigate('practice')} title={`Meta diaria: ${state.daily.xp}/${state.daily.goal} XP`}>
          <ProgressRing value={dailyPercent} size={42} stroke={4} color="#34d399">
            <span className="hud-goal-value">{dailyPercent}%</span>
          </ProgressRing>
          <span className="hud-goal-copy">
            <strong>Meta diaria</strong>
            <small>{state.daily.xp}/{state.daily.goal} XP</small>
          </span>
        </button>

        <div className="hud-toggles">
          <button
            className={`icon-button ${state.settings.sound ? 'on' : ''}`}
            onClick={toggleSound}
            title={state.settings.sound ? 'Silenciar' : 'Activar sonido'}
            aria-label={state.settings.sound ? 'Silenciar efectos de sonido' : 'Activar efectos de sonido'}
            aria-pressed={state.settings.sound}
          >
            <Icon name={state.settings.sound ? 'sound' : 'mute'} size={17} />
          </button>
          <button
            className={`icon-button ${state.settings.reduceMotion ? 'on' : ''}`}
            onClick={toggleMotion}
            title={state.settings.reduceMotion ? 'Activar animaciones' : 'Reducir movimiento'}
            aria-label={state.settings.reduceMotion ? 'Activar animaciones' : 'Reducir movimiento'}
            aria-pressed={state.settings.reduceMotion}
          >
            <Icon name="eye" size={17} />
          </button>
          <button
            className={`icon-button ${state.settings.laser ? 'on' : ''}`}
            onClick={toggleLaser}
            title={state.settings.laser ? 'Ocultar haces láser' : 'Mostrar haces láser'}
            aria-label={state.settings.laser ? 'Ocultar haces láser' : 'Mostrar haces láser'}
            aria-pressed={state.settings.laser}
          >
            <Icon name="laser" size={17} />
          </button>
        </div>

        <a className="hud-workbench" href="/workbench" title="Abrir el workbench clásico">
          <Icon name="cube" size={15} />
          <span>Workbench</span>
        </a>
      </div>
    </header>
  );
}

function MobileNav() {
  const { route, navigate } = useLearning();
  return (
    <nav className="mobile-nav" aria-label="Navegación móvil">
      {MOBILE_ITEMS.map((item) => {
        const active = route.view === item.view || (route.view === 'lesson' && item.view === 'map');
        return (
          <button key={item.view} className={`mobile-link ${active ? 'active' : ''}`} onClick={() => navigate(item.view)}>
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
      <button className="mobile-link" onClick={() => navigate('exam')}>
        <Icon name="trophy" size={20} />
        <span>Arena</span>
      </button>
    </nav>
  );
}

function Toasts() {
  const { toasts } = useLearning();
  if (toasts.length === 0) return null;
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.tone}`}>
          <span className="toast-icon">
            <Icon name={toast.tone === 'xp' ? 'bolt' : toast.tone === 'warning' ? 'bulb' : toast.tone === 'success' ? 'check' : 'star'} size={16} />
          </span>
          <div>
            <strong>{toast.title}</strong>
            {toast.detail ? <span>{toast.detail}</span> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function LevelUpModal() {
  const { levelUp, level, dismissLevelUp, navigate } = useLearning();
  const title = levelUp ? LEVEL_TITLES[levelUp - 1] ?? 'Leyenda' : '';
  return (
    <Modal
      open={levelUp !== null}
      title="¡Subiste de nivel!"
      onClose={dismissLevelUp}
      footer={
        <div className="question-actions">
          <button className="btn btn-ghost" onClick={dismissLevelUp}>Seguir jugando</button>
          <button className="btn btn-primary" onClick={() => { dismissLevelUp(); navigate('progress'); }}>
            <Icon name="chart" size={15} /> Ver progreso
          </button>
        </div>
      }
    >
      <div className="levelup-body">
        <div className="levelup-orb">
          <span>Nv.</span>
          <strong>{levelUp ?? level.level}</strong>
        </div>
        <h3>{title}</h3>
        <p>Tu constancia está dando frutos. Nuevos desafíos, nuevas misiones y más XP te esperan.</p>
        <div className="levelup-stats">
          <span><Icon name="bolt" size={14} /> {level.level} · nivel actual</span>
          <span><Icon name="star" size={14} /> {Number(level.percent.toFixed(1))}% al siguiente</span>
        </div>
      </div>
    </Modal>
  );
}

function RoutedView() {
  const { route } = useLearning();
  switch (route.view) {
    case 'map':
      return <MapView />;
    case 'lesson':
      return <LessonView />;
    case 'practice':
      return <PracticeView />;
    case 'steps':
      return <StepsPracticeView />;
    case 'cinema':
      return <Cinema3DTutorView />;
    case 'exam':
      return <ExamView />;
    case 'progress':
      return <ProgressView />;
    case 'plan':
      return <PlanView />;
    case 'lab':
      return <LabView />;
    case 'dashboard':
    default:
      return <Dashboard />;
  }
}

function Splash() {
  return (
    <div className="splash">
      <div className="splash-orb">
        <div className="splash-ring" />
        <Brand compact />
      </div>
      <p>Cargando tu mapa de conocimiento…</p>
      <div className="splash-bar"><span /></div>
    </div>
  );
}

function Shell() {
  const { ready, route } = useLearning();
  const viewKey = useMemo(() => `${route.view}-${route.lessonId ?? ''}`, [route]);

  if (!ready) return <Splash />;

  return (
    <div className="app-shell">
      <div className="app-bg" aria-hidden="true">
        <span className="bg-grid" />
        <span className="bg-glow bg-glow-1" />
        <span className="bg-glow bg-glow-2" />
      </div>
      <SideNav />
      <div className="app-main">
        <TopHUD />
        <main className="app-content" key={viewKey}>
          <RoutedView />
        </main>
        <footer className="app-footer">
          <span>Polymath Zero · matemática del cursillo de ingreso 2027</span>
          <span>
            <Icon name="laser" size={12} /> 8 mundos · 32 misiones · 60 días
          </span>
        </footer>
      </div>
      <MobileNav />
      <Toasts />
      <LevelUpModal />
    </div>
  );
}

export default function App() {
  return (
    <LearningProvider>
      <Shell />
    </LearningProvider>
  );
}
