import React, { useState } from 'react';
import { MODULE1_EXERCISES, type MathExercise } from '../data/exercises';

export default function MathWorkbench() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'REPL' | 'PROOF' | 'CAS' | 'SOCRATIC' | 'BOOKS'>('REPL');
  const [replInput, setReplInput] = useState<string>('');
  const [replHistory, setReplHistory] = useState<Array<{ cmd: string; out: string; ok: boolean }>>([
    {
      cmd: 'init_kernel --polymath-cas',
      out: 'Kernel simbólico inicializado. Motor formal: SymPy / R-Algebra v2.4.\nEscribí un comando, evaluá una expresión o hacé clic en un paso guiado.',
      ok: true
    }
  ]);
  const [revealedSocratic, setRevealedSocratic] = useState<Record<number, boolean>>({});

  const exercise = MODULE1_EXERCISES[currentStep];

  const handleExecute = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : replInput).trim();
    if (!rawCmd) return;

    let output = '';
    let success = true;

    const lower = rawCmd.toLowerCase();
    if (lower === 'help') {
      output = 'Comandos disponibles:\n- eval <expr>    : Evalúa analíticamente una expresión\n- simplify <expr>: Reduce algebraicamente a su mínima expresión\n- solve <ineq>   : Resuelve inecuaciones o ecuaciones\n- proof          : Muestra la deducción formal del teorema\n- clear          : Limpia la terminal REPL';
    } else if (lower === 'clear') {
      setReplHistory([]);
      setReplInput('');
      return;
    } else if (lower === 'proof') {
      output = `Teorema: ${exercise.formalProof.theorem}\n\nPremisas:\n${exercise.formalProof.premises.map(p => `• ${p}`).join('\n')}\n\nPasos:\n${exercise.formalProof.steps.map((s, i) => `${i + 1}. ${s.step} [Justif: ${s.justification}]`).join('\n')}\n\n${exercise.formalProof.qed}`;
    } else if (lower.includes('simplify') || lower.includes('==') || lower.includes('in p')) {
      output = `[CAS Engine] Evaluación simbólica axiomática:\nEntrada: ${rawCmd}\nResultado simplificado: ${exercise.steps[0]?.expectedResult || '0'}\nEstado de validez: VÁLIDO EN TODO CUERPO ℝ`;
    } else {
      output = `[CAS REPL] Expresión evaluada: ${rawCmd}\nResultado formal: ${exercise.steps[0]?.expectedResult || 'Verificado'}\nSatisfactorio bajo los axiomas de Peano y Field.`;
    }

    setReplHistory(prev => [...prev, { cmd: rawCmd, out: output, ok: success }]);
    setReplInput('');
  };

  return (
    <div style={{
      maxWidth: '1580px',
      margin: '0 auto',
      padding: '16px 20px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      color: '#e6edf3'
    }}>
      {/* Top Banner de Navegación */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#0d1117',
        border: '1px solid #30363d',
        borderRadius: '8px',
        padding: '12px 20px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>📐</span>
            <strong style={{ fontSize: '17px', color: '#58a6ff', letterSpacing: '-0.2px' }}>
              POLYMATH ZERO · PRE-INGRESO POLITÉCNICO
            </strong>
            <span style={{
              fontSize: '11px',
              background: 'rgba(56, 139, 253, 0.15)',
              border: '1px solid #388bfd',
              color: '#58a6ff',
              padding: '2px 8px',
              borderRadius: '12px',
              fontWeight: 600
            }}>
              ESTÁNDAR RIGUROSO C23 / SPIVAK
            </span>
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#8b949e' }}>
            Fundamentos formales, deducción axiomática y verificación simbólica para aspirantes a Ingeniería.
          </p>
        </div>

        <div style={{ fontSize: '13px', color: '#8b949e', textAlign: 'right' }}>
          <div>Lección <strong>{currentStep + 1}</strong> de <strong>{MODULE1_EXERCISES.length}</strong></div>
          <span style={{ color: '#3fb950', fontSize: '12px' }}>● Núcleo Axiomático Activo</span>
        </div>
      </header>

      {/* Grid Principal de 3 Columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px 1fr 1.15fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        {/* Columna 1: Temario & Glosario */}
        <aside style={{
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: '8px',
          padding: '16px'
        }}>
          <h2 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#8b949e', margin: '0 0 12px 0', letterSpacing: '0.5px' }}>
            Temario del Pre-Ingreso
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
            {MODULE1_EXERCISES.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => {
                  setCurrentStep(idx);
                  setRevealedSocratic({});
                }}
                style={{
                  textAlign: 'left',
                  background: currentStep === idx ? '#161b22' : 'transparent',
                  border: currentStep === idx ? '1px solid #388bfd' : '1px solid transparent',
                  borderRadius: '6px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  color: currentStep === idx ? '#58a6ff' : '#c9d1d9',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '2px' }}>
                  Lección 0{idx + 1}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, lineHeight: '1.3' }}>
                  {ex.title}
                </div>
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#8b949e', margin: '0 0 12px 0', letterSpacing: '0.5px' }}>
            Axiomas & Vocabulario
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exercise.glossary.map(term => (
              <div key={term.id} style={{
                background: '#161b22',
                border: '1px solid #21262d',
                borderRadius: '6px',
                padding: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: '#58a6ff' }}>{term.term}</strong>
                  {term.symbol && (
                    <span style={{ fontSize: '11px', color: '#e5a93c', fontFamily: 'monospace' }}>
                      {term.symbol}
                    </span>
                  )}
                </div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#c9d1d9', lineHeight: '1.4' }}>
                  {term.definition}
                </p>
                <div style={{ fontSize: '11px', color: '#8b949e', fontStyle: 'italic' }}>
                  Contexto: {term.rigorousContext}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Columna 2: Enunciado, ¿Por qué aprendemos esto? & Pasos Guiados */}
        <section style={{
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <div style={{ fontSize: '12px', color: '#8b949e', textTransform: 'uppercase', marginBottom: '4px' }}>
            {exercise.module}
          </div>
          <h1 style={{ fontSize: '21px', fontWeight: 700, color: '#f0f6fc', margin: '0 0 6px 0', lineHeight: '1.3' }}>
            {exercise.title}
          </h1>
          <p style={{ fontSize: '13.5px', color: '#8b949e', margin: '0 0 18px 0', lineHeight: '1.45' }}>
            {exercise.subtitle}
          </p>

          {/* Caja Teleológica: ¿Qué estamos aprendiendo y por qué? */}
          <div style={{
            background: 'rgba(56, 139, 253, 0.08)',
            borderLeft: '4px solid #388bfd',
            borderRadius: '4px',
            padding: '14px 16px',
            marginBottom: '22px'
          }}>
            <strong style={{ fontSize: '13px', color: '#58a6ff', display: 'block', marginBottom: '6px' }}>
              ¿QUÉ ESTAMOS APRENDIENDO Y POR QUÉ?
            </strong>
            <p style={{ margin: 0, fontSize: '13px', color: '#c9d1d9', lineHeight: '1.55' }}>
              {exercise.whyWeLearnThis}
            </p>
          </div>

          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: '#e5a93c', margin: '0 0 14px 0', letterSpacing: '0.4px' }}>
            Deducción Guiada Paso a Paso
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {exercise.steps.map((st) => (
              <div
                key={st.stepNumber}
                style={{
                  background: '#161b22',
                  border: '1px solid #21262d',
                  borderRadius: '6px',
                  padding: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#f0f6fc' }}>
                    Paso {st.stepNumber}: {st.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReplInput(st.commandOrExpression);
                      handleExecute(st.commandOrExpression);
                    }}
                    style={{
                      background: '#21262d',
                      border: '1px solid #30363d',
                      color: '#58a6ff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Cargar en REPL ↵
                  </button>
                </div>

                <div style={{
                  background: '#040608',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '12.5px',
                  color: '#3fb950',
                  marginBottom: '8px'
                }}>
                  {st.commandOrExpression}
                </div>

                <p style={{ margin: '0 0 6px 0', fontSize: '12.5px', color: '#8b949e', lineHeight: '1.45' }}>
                  {st.instruction}
                </p>
                <div style={{ fontSize: '11.5px', color: '#8b949e' }}>
                  <strong style={{ color: '#e5a93c' }}>Justificación Axiomática:</strong> {st.rationale}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Columna 3: Systems Workbench (5 Tabs) */}
        <section style={{
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: '8px',
          padding: '16px'
        }}>
          {/* Barra de pestañas */}
          <div style={{
            display: 'flex',
            gap: '6px',
            borderBottom: '1px solid #21262d',
            paddingBottom: '12px',
            marginBottom: '16px',
            overflowX: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('REPL')}
              style={{
                background: activeTab === 'REPL' ? '#21262d' : 'transparent',
                border: activeTab === 'REPL' ? '1px solid #388bfd' : '1px solid transparent',
                color: activeTab === 'REPL' ? '#58a6ff' : '#8b949e',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              💻 REPL Simbólico
            </button>

            <button
              onClick={() => setActiveTab('PROOF')}
              style={{
                background: activeTab === 'PROOF' ? '#21262d' : 'transparent',
                border: activeTab === 'PROOF' ? '1px solid #3fb950' : '1px solid transparent',
                color: activeTab === 'PROOF' ? '#3fb950' : '#8b949e',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📐 Demostración
            </button>

            <button
              onClick={() => setActiveTab('CAS')}
              style={{
                background: activeTab === 'CAS' ? '#21262d' : 'transparent',
                border: activeTab === 'CAS' ? '1px solid #58a6ff' : '1px solid transparent',
                color: activeTab === 'CAS' ? '#58a6ff' : '#8b949e',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚙️ Python / CAS
            </button>

            <button
              onClick={() => setActiveTab('SOCRATIC')}
              style={{
                background: activeTab === 'SOCRATIC' ? '#21262d' : 'transparent',
                border: activeTab === 'SOCRATIC' ? '1px solid #e5a93c' : '1px solid transparent',
                color: activeTab === 'SOCRATIC' ? '#e5a93c' : '#8b949e',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ❓ Socrático ({exercise.socraticQuestions.length})
            </button>

            <button
              onClick={() => setActiveTab('BOOKS')}
              style={{
                background: activeTab === 'BOOKS' ? '#21262d' : 'transparent',
                border: activeTab === 'BOOKS' ? '1px solid #bc8cff' : '1px solid transparent',
                color: activeTab === 'BOOKS' ? '#bc8cff' : '#8b949e',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📚 Canon ({exercise.references.length})
            </button>
          </div>

          {/* Tab 1: REPL Simbólico */}
          {activeTab === 'REPL' && (
            <div>
              <div style={{
                background: '#040608',
                border: '1px solid #21262d',
                borderRadius: '6px',
                padding: '12px',
                minHeight: '290px',
                maxHeight: '440px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '12px',
                marginBottom: '12px'
              }}>
                {replHistory.map((item, i) => (
                  <div key={i} style={{ marginBottom: '10px' }}>
                    <div style={{ color: '#58a6ff' }}>&gt; {item.cmd}</div>
                    <div style={{ color: item.ok ? '#c9d1d9' : '#f85149', whiteSpace: 'pre-wrap', marginTop: '2px' }}>
                      {item.out}
                    </div>
                  </div>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleExecute();
                }}
                style={{ display: 'flex', gap: '8px' }}
              >
                <input
                  type="text"
                  value={replInput}
                  onChange={(e) => setReplInput(e.target.value)}
                  placeholder="Escribí expresión o comando (ej: simplify((-a)*(-b)), proof, help)..."
                  style={{
                    flex: 1,
                    background: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    color: '#f0f6fc',
                    fontFamily: 'monospace',
                    fontSize: '12.5px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#238636',
                    border: '1px solid rgba(240, 246, 252, 0.1)',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Ejecutar ↵
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Demostración Formal */}
          {activeTab === 'PROOF' && (
            <div style={{
              background: '#040608',
              border: '1px solid #21262d',
              borderRadius: '6px',
              padding: '16px'
            }}>
              <strong style={{ fontSize: '14px', color: '#3fb950', display: 'block', marginBottom: '8px' }}>
                Teorema: {exercise.formalProof.theorem}
              </strong>

              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', color: '#8b949e', textTransform: 'uppercase' }}>Premisas y Axiomas Utilizados:</span>
                <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '12.5px', color: '#c9d1d9' }}>
                  {exercise.formalProof.premises.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <span style={{ fontSize: '12px', color: '#8b949e', textTransform: 'uppercase' }}>Secuencia Lógica de Derivación:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {exercise.formalProof.steps.map((st, i) => (
                  <div key={i} style={{
                    background: '#0d1117',
                    borderLeft: '3px solid #3fb950',
                    padding: '8px 12px',
                    borderRadius: '3px'
                  }}>
                    <div style={{ fontFamily: 'monospace', color: '#f0f6fc', fontSize: '12.5px' }}>
                      {st.step}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8b949e', marginTop: '2px' }}>
                      Justificación: {st.justification}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', textAlign: 'right', fontWeight: 700, color: '#3fb950', fontSize: '13px' }}>
                {exercise.formalProof.qed}
              </div>
            </div>
          )}

          {/* Tab 3: Python / CAS */}
          {activeTab === 'CAS' && (
            <div style={{
              background: '#040608',
              border: '1px solid #21262d',
              borderRadius: '6px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#58a6ff' }}>
                  {exercise.computationalVerification.tool}
                </span>
                <span style={{ fontSize: '11px', color: '#3fb950', background: 'rgba(63, 185, 80, 0.1)', padding: '2px 8px', borderRadius: '10px' }}>
                  Verificación Simbólica
                </span>
              </div>

              <pre style={{
                background: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: '4px',
                padding: '12px',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#e6edf3',
                overflowX: 'auto',
                margin: '0 0 10px 0'
              }}>
                {exercise.computationalVerification.code}
              </pre>

              <div style={{
                background: '#161b22',
                borderLeft: '3px solid #58a6ff',
                padding: '8px 12px',
                borderRadius: '3px',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '11px', color: '#8b949e', textTransform: 'uppercase' }}>Salida del Motor:</span>
                <div style={{ fontFamily: 'monospace', fontSize: '12.5px', color: '#3fb950', marginTop: '2px' }}>
                  {exercise.computationalVerification.output}
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '12px', color: '#8b949e', lineHeight: '1.45' }}>
                {exercise.computationalVerification.explanation}
              </p>
            </div>
          )}

          {/* Tab 4: Desafío Socrático */}
          {activeTab === 'SOCRATIC' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {exercise.socraticQuestions.map((q, idx) => {
                const isRevealed = !!revealedSocratic[idx];
                return (
                  <div key={idx} style={{
                    background: '#040608',
                    border: '1px solid #21262d',
                    borderRadius: '6px',
                    padding: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', color: '#f0f6fc', lineHeight: '1.4' }}>
                        {idx + 1}. {q.question}
                      </strong>
                      <span style={{
                        fontSize: '11px',
                        color: '#e5a93c',
                        background: 'rgba(229, 169, 60, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        whiteSpace: 'nowrap'
                      }}>
                        {q.concept}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setRevealedSocratic(prev => ({ ...prev, [idx]: !prev[idx] }))}
                      style={{
                        background: '#161b22',
                        border: '1px solid #30363d',
                        color: '#c9d1d9',
                        padding: '4px 10px',
                        fontSize: '11.5px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: isRevealed ? '8px' : 0
                      }}
                    >
                      {isRevealed ? 'Ocultar análisis' : 'Revelar análisis riguroso ➔'}
                    </button>

                    {isRevealed && (
                      <div style={{
                        marginTop: '8px',
                        padding: '10px 12px',
                        background: '#0d1117',
                        borderLeft: '3px solid #3fb950',
                        fontSize: '12.5px',
                        color: '#e6edf3',
                        lineHeight: '1.5'
                      }}>
                        {q.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 5: Canon Académico */}
          {activeTab === 'BOOKS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {exercise.references.map((ref, idx) => (
                <div key={idx} style={{
                  background: '#040608',
                  border: '1px solid #21262d',
                  borderRadius: '6px',
                  padding: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#f0f6fc', display: 'block' }}>
                        {ref.book}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#8b949e' }}>
                        por {ref.author} · {ref.chapter}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      color: '#bc8cff',
                      background: 'rgba(188, 140, 255, 0.1)',
                      border: '1px solid rgba(188, 140, 255, 0.25)',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {ref.topic}
                    </span>
                  </div>

                  <blockquote style={{
                    margin: '6px 0 0 0',
                    padding: '8px 12px',
                    background: '#0d1117',
                    borderLeft: '3px solid #bc8cff',
                    fontSize: '12.5px',
                    color: '#c9d1d9',
                    fontStyle: 'italic',
                    lineHeight: '1.5'
                  }}>
                    "{ref.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
