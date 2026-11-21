import React, { useState } from 'react';
import { ALL_LESSONS } from '../data/curriculum';
import type { Lesson } from '../data/types';
import { useLearning } from '../state/LearningContext';
import Icon from '../components/ui/Icon';
import { Pill, SectionTitle } from '../components/ui/Primitives';
import LabRenderer, { LAB_META } from '../components/labs/LabRenderer';
import Math3DScene from '../components/labs/Math3DScene';
import GuidedAnimationStudio from '../components/labs/GuidedAnimationStudio';
import { playLaser } from '../lib/sfx';

type LabKind = Lesson['lab'];
type LabTab = 'studio' | 'labs' | 'models3d';

const LAB_ORDER: LabKind[] = ['numberline', 'balance', 'unitcircle', 'parabola', 'tiles', 'systems', 'radicals', 'laser3d'];

export default function LabView() {
  const { navigate, openLesson, state } = useLearning();
  const [activeTab, setActiveTab] = useState<LabTab>('labs');
  const [kind, setKind] = useState<LabKind>('balance');

  const lesson = ALL_LESSONS.find((item) => item.lab === kind) ?? ALL_LESSONS[0];
  const related = ALL_LESSONS.filter((item) => item.lab === kind).slice(0, 4);

  return (
    <div className="view lab-view">
      <section className="lab-hero">
        <div>
          <div className="eyebrow">Zona libre · sin ejercicios</div>
          <h1>Laboratorio <span className="gradient-text">3D</span></h1>
          <p>
            Elegí un espacio de trabajo a la vez para experimentar sin ruido: simuladores interactivos,
            estudio animado HD o explorador de modelos 3D.
          </p>
          <div className="lab-mode-tabs" role="tablist" aria-label="Espacios del laboratorio">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'labs'}
              className={`lab-mode-tab ${activeTab === 'labs' ? 'active' : ''}`}
              onClick={() => { setActiveTab('labs'); playLaser(); }}
            >
              <Icon name="flask" size={15} />
              <span>8 Simuladores</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'studio'}
              className={`lab-mode-tab ${activeTab === 'studio' ? 'active' : ''}`}
              onClick={() => { setActiveTab('studio'); playLaser(); }}
            >
              <Icon name="play" size={15} />
              <span>Estudio Animado HD</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'models3d'}
              className={`lab-mode-tab ${activeTab === 'models3d' ? 'active' : ''}`}
              onClick={() => { setActiveTab('models3d'); playLaser(); }}
            >
              <Icon name="cube" size={15} />
              <span>Explorador 3D</span>
            </button>
          </div>
        </div>
        <div className="lab-hero-orbit">
          <div className="lab-orbit-ring" />
          <div className="lab-orbit-ring second" />
          <div className="lab-orbit-core"><Icon name="laser" size={36} /></div>
          <span className="orbit-dot" />
        </div>
      </section>

      {activeTab === 'studio' ? (
        <section className="panel" role="tabpanel" style={{ borderColor: 'rgba(34, 211, 238, 0.28)' }}>
          <SectionTitle
            eyebrow="Estudio Animado HD · Ciclos de 10 segundos"
            title="Guía visual: Trigonometría, Figuras, Ecuaciones, Inecuaciones y Lógica"
            description="Miralo en bucle con guía sincronizada o mové los controles de escala, ángulos y proposiciones en vivo."
            right={<Pill icon="laser" color="#fde047">60fps HiDPI</Pill>}
          />
          <GuidedAnimationStudio initialTopic="trig" />
        </section>
      ) : null}

      {activeTab === 'labs' ? (
        <div role="tabpanel" className="lab-tab-stack">
          <div className="lab-picker">
            {LAB_ORDER.map((item) => {
              const labMeta = LAB_META[item];
              const active = item === kind;
              return (
                <button key={item} className={`lab-pick ${active ? 'active' : ''}`} onClick={() => { setKind(item); playLaser(); }}>
                  <span className="lab-pick-icon"><Icon name={labMeta.icon} size={18} /></span>
                  <span>
                    <strong>{labMeta.name}</strong>
                    <small>{labMeta.blurb}</small>
                  </span>
                </button>
              );
            })}
          </div>

          <section className="panel lab-main" style={{ borderColor: 'rgba(34, 211, 238, 0.22)' }}>
            <div className="lab-main-bar">
              <Pill icon="flask" color="#22d3ee">
                {related.length} {related.length === 1 ? 'lección lo usa' : 'lecciones lo usan'}
              </Pill>
            </div>
            <LabRenderer lesson={lesson} />
          </section>
        </div>
      ) : null}

      {activeTab === 'models3d' ? (
        <section className="panel" role="tabpanel" style={{ borderColor: 'rgba(167, 139, 250, 0.25)' }}>
          <SectionTitle
            eyebrow="Creaciones Matemáticas 3D"
            title="Explorador de modelos 3D del cursillo"
            description="Cambiá entre las 9 escenas 3D interactivas: triángulo rectángulo con razones en vivo, cubo binomial (a+b)³, hélice trigonométrica, paraboloide de raíces y más."
          />
          <Math3DScene lesson={lesson} allowSwitch />
        </section>
      ) : null}

      <div className="lab-bottom-grid">
        <section className="panel">
          <SectionTitle eyebrow="Conectá con el curso" title="Lecciones que usan este simulador" />
          <div className="lab-related">
            {related.map((item) => {
              const done = state.completedLessons.includes(item.id);
              return (
                <button key={item.id} className="lab-related-row" onClick={() => openLesson(item.id)}>
                  <span className={done ? 'ok' : ''}><Icon name={done ? 'check' : 'play'} size={14} /></span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.tagline}</small>
                  </div>
                  <Icon name="chevron" size={15} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel">
          <SectionTitle eyebrow="Atajos" title="Seguí practicando" />
          <div className="lab-shortcuts">
            <button className="shortcut-card" onClick={() => navigate('map')}>
              <Icon name="map" size={20} />
              <strong>Mapa de mundos</strong>
              <span>Volvé a la ruta principal.</span>
            </button>
            <button className="shortcut-card" onClick={() => navigate('practice')}>
              <Icon name="target" size={20} />
              <strong>Práctica rápida</strong>
              <span>Diez preguntas con XP.</span>
            </button>
            <button className="shortcut-card" onClick={() => navigate('exam')}>
              <Icon name="trophy" size={20} />
              <strong>Simulacros</strong>
              <span>Probate contra el reloj.</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
