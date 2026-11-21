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

const LAB_ORDER: LabKind[] = ['numberline', 'balance', 'unitcircle', 'parabola', 'tiles', 'systems', 'radicals', 'laser3d'];

export default function LabView() {
  const { navigate, openLesson, state } = useLearning();
  const [kind, setKind] = useState<LabKind>('laser3d');

  const lesson = ALL_LESSONS.find((item) => item.lab === kind) ?? ALL_LESSONS[0];
  const meta = LAB_META[kind];
  const related = ALL_LESSONS.filter((item) => item.lab === kind).slice(0, 4);

  return (
    <div className="view lab-view">
      <section className="lab-hero">
        <div>
          <div className="eyebrow">Zona libre · sin ejercicios</div>
          <h1>Laboratorio <span className="gradient-text">3D</span></h1>
          <p>
            Ocho simuladores para tocar la matemática con las manos. Mové sliders, arrastrá el
            mouse y mirá qué pasa. Acá no se aprueba ni se reprueba: se experimenta.
          </p>
          <div className="practice-hero-stats">
            <Pill icon="flask" color="#22d3ee">{LAB_ORDER.length} laboratorios</Pill>
            <Pill icon="laser" color="#a78bfa">haces en vivo</Pill>
            <Pill icon="eye" color="#fde047">sin corrección</Pill>
          </div>
        </div>
        <div className="lab-hero-orbit">
          <div className="lab-orbit-ring" />
          <div className="lab-orbit-ring second" />
          <div className="lab-orbit-core"><Icon name="laser" size={36} /></div>
          <span className="orbit-dot" />
        </div>
      </section>

      <section className="panel" style={{ borderColor: 'rgba(34, 211, 238, 0.28)' }}>
        <SectionTitle
          eyebrow="Estudio Animado HD · Ciclos de 10 segundos"
          title="Guía visual interactiva: Trigonometría, Figuras, Ecuaciones, Inecuaciones y Lógica"
          description="Miralo en bucle de 10s con guía sincronizada o mové los controles de escala, ángulos y proposiciones en vivo."
          right={<Pill icon="laser" color="#fde047">60fps HiDPI</Pill>}
        />
        <GuidedAnimationStudio initialTopic="trig" />
      </section>

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
        <SectionTitle
          eyebrow="Laboratorio abierto"
          title={meta.name}
          description={meta.blurb}
          right={<Pill icon="flask" color="#22d3ee">{related.length} {related.length === 1 ? 'lección lo usa' : 'lecciones lo usan'}</Pill>}
        />
        <LabRenderer lesson={lesson} />
      </section>

      {kind === 'laser3d' ? (
        <section className="panel" style={{ borderColor: 'rgba(167, 139, 250, 0.25)' }}>
          <SectionTitle
            eyebrow="Creaciones Matemáticas 3D"
            title="Explorador de modelos 3D del cursillo"
            description="Cambiá entre las 9 creaciones 3D interactivas: triángulo rectángulo con razones en vivo, cubo binomial (a+b)³, hélice trigonométrica, paraboloide de raíces, superficie racional y más."
          />
          <Math3DScene lesson={lesson} allowSwitch />
        </section>
      ) : null}

      <div className="lab-bottom-grid">
        <section className="panel">
          <SectionTitle eyebrow="Conectá con el curso" title="Lecciones que usan este laboratorio" />
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
          <SectionTitle eyebrow="Atajos" title="Seguí jugando" />
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
