import React, { useMemo, useRef, useState } from 'react';
import { ALL_LESSONS } from '../data/curriculum';
import Math3DScene, { SCENE_META, type Scene3DKind } from '../components/labs/Math3DScene';
import { askTutorAI, evaluateMathExpression, type TutorMessage } from '../lib/tutorAi';
import Icon from '../components/ui/Icon';
import { Pill } from '../components/ui/Primitives';
import RichText, { FormulaCard } from '../components/ui/RichText';
import { playClick, playLaser } from '../lib/sfx';

const QUICK_PROMPTS = [
  '¿Cómo diferencio seno, coseno y tangente?',
  'Explicame esta escena 3D',
  '¿Cómo despejo sin equivocarme?',
  'Dame una pista sin darme la respuesta'
];

export default function Cinema3DTutorView() {
  const defaultLesson = useMemo(
    () => ALL_LESSONS.find((l) => l.worldId === 'trigonometria') ?? ALL_LESSONS[0],
    []
  );

  const [activeScene, setActiveScene] = useState<Scene3DKind>('helix3d');
  const [sideTab, setSideTab] = useState<'chat' | 'guide'>('chat');
  const [input, setInput] = useState('');
  const [calcInput, setCalcInput] = useState('3/4 + 1/2');
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      role: 'tutor',
      text: '¡Hola! Soy tu **Tutor IA** (nunca tu autor: no hago la tarea por vos, te guío para que la domines). Rotá la escena 3D gigante a la izquierda y preguntame lo que quieras o tirame una cuenta para verificar.',
      formula: '\\operatorname{sen}\\alpha = \\frac{CO}{H},\\quad \\cos\\alpha = \\frac{CA}{H},\\quad \\tan\\alpha = \\frac{CO}{CA}',
      timestamp: 'Ahora'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const calcResult = useMemo(() => evaluateMathExpression(calcInput), [calcInput]);

  const sendMessage = (textToSend?: string) => {
    const content = (textToSend ?? input).trim();
    if (!content) return;
    playClick();

    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: now
    };

    const ai = askTutorAI(content, activeScene);
    const tutorMsg: TutorMessage = {
      id: `t-${Date.now() + 1}`,
      role: 'tutor',
      text: ai.reply,
      formula: ai.formula,
      timestamp: now
    };

    setMessages((prev) => [...prev, userMsg, tutorMsg]);
    if (!textToSend) setInput('');
    playLaser();

    window.setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="view cinema-view">
      <div className="cinema-header">
        <div>
          <span className="eyebrow">Pantalla Panorámica 3D + Tutoría Socrática</span>
          <h1>
            Cine 3D <span className="gradient-text">&amp; Tutor IA</span>
          </h1>
        </div>
        <div className="preset-row">
          <Pill icon="laser" color="#22d3ee">{SCENE_META[activeScene].title}</Pill>
          <Pill icon="brain" color="#a78bfa">Modo Tutor · Nunca Autor</Pill>
        </div>
      </div>

      <div className="cinema-layout">
        <section className="panel cinema-stage-panel">
          <Math3DScene
            lesson={defaultLesson}
            allowSwitch
            cinema
            onKindChange={setActiveScene}
          />
        </section>

        <aside className="panel cinema-tutor-panel">
          <div className="cinema-side-tabs">
            <button
              type="button"
              className={`chip ${sideTab === 'chat' ? 'active' : ''}`}
              onClick={() => setSideTab('chat')}
            >
              <Icon name="brain" size={14} /> Chat Tutor IA
            </button>
            <button
              type="button"
              className={`chip ${sideTab === 'guide' ? 'active' : ''}`}
              onClick={() => setSideTab('guide')}
            >
              <Icon name="book" size={14} /> Guía &amp; Calculadora
            </button>
          </div>

          {sideTab === 'chat' ? (
            <div className="tutor-chat-wrap">
              <div className="tutor-messages">
                {messages.map((m) => (
                  <article key={m.id} className={`tutor-bubble ${m.role}`}>
                    <div className="tutor-bubble-head">
                      <strong>{m.role === 'tutor' ? 'Tutor IA' : 'Vos'}</strong>
                      <span>{m.timestamp}</span>
                    </div>
                    <div className="tutor-bubble-body">
                      <RichText text={m.text} />
                    </div>
                    {m.formula ? (
                      <div className="tutor-bubble-formula">
                        <FormulaCard formula={m.formula} />
                      </div>
                    ) : null}
                  </article>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div className="tutor-quick-row">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="tutor-quick-chip"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form
                className="tutor-input-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  type="text"
                  className="tutor-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Preguntá o escribí una cuenta (ej: sin(30) + 1/2)..."
                  aria-label="Mensaje para el Tutor IA"
                />
                <button type="submit" className="btn btn-primary">
                  Enviar
                </button>
              </form>
            </div>
          ) : (
            <div className="tutor-guide-wrap">
              <div className="tutor-sohcahtoa">
                <span className="eyebrow">Ayuda memoria · Trigonometría</span>
                <h4>Las 3 razones: SOH · CAH · TOA</h4>
                <p>Las tres fundamentales son <strong>Seno</strong>, <strong>Coseno</strong> y <strong>Tangente</strong>:</p>
                <FormulaCard formula="\operatorname{sen}\alpha = \frac{CO}{H}" label="SOH" />
                <FormulaCard formula="\cos\alpha = \frac{CA}{H}" label="CAH" />
                <FormulaCard formula="\tan\alpha = \frac{CO}{CA}" label="TOA" />
              </div>

              <div className="tutor-calc-box">
                <span className="eyebrow">Calculadora verificadora</span>
                <h4>Probá cuentas en vivo</h4>
                <input
                  type="text"
                  className="tutor-input"
                  value={calcInput}
                  onChange={(e) => setCalcInput(e.target.value)}
                  placeholder="Ej: sqrt(144) + 2^3"
                  aria-label="Expresión matemática para calcular"
                />
                <div className="tutor-calc-res">
                  {calcResult !== null ? (
                    <>
                      <span>Resultado:</span>
                      <strong style={{ color: '#34d399' }}>
                        {Number.isInteger(calcResult) ? calcResult : Number(calcResult.toFixed(5))}
                      </strong>
                    </>
                  ) : (
                    <span style={{ color: '#fb7185' }}>Expresión inválida o división por cero</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
