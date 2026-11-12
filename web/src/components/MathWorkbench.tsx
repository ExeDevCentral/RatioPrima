import React, { useState, useEffect } from 'react';
import { EXERCISES, type MathExercise } from '../data/exercises';
import { evaluateReplCommand, type ReplResult } from '../lib/replEngine';
import MathVisualizer from './MathVisualizer';
import { KaTeXBlock, KaTeXInline, FormattedMathText } from './KaTeXView';

type TabType = 'REPL' | 'PROOF' | 'VISUALIZER' | 'SOCRATIC' | 'CANON';

interface ReplEntry {
  id: string;
  cmd: string;
  result: ReplResult;
  timestamp: string;
}

export default function MathWorkbench() {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(EXERCISES[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<TabType>('REPL');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Progreso persistido en localStorage
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // REPL State
  const [replInput, setReplInput] = useState<string>('');
  const [replHistory, setReplHistory] = useState<ReplEntry[]>([
    {
      id: 'init-0',
      cmd: 'init_kernel --polymath-formal',
      result: {
        output: [
          '╔═════════════════════════════════════════════════════════════════════╗',
          '║  POLYMATH ZERO · WORKBENCH DE SISTEMAS FORMALES v2.4 (C23 STANDARDS)║',
          '║  Arquitectura de Verificación Axiomática & Simbólica (SymPy / GNU)  ║',
          '╚═════════════════════════════════════════════════════════════════════╝',
          'Kernel listo. Escribí "help" para ver la lista de comandos disponibles,',
          'o hacé clic en [⚡ Cargar en Terminal] en cualquier paso guiado.'
        ].join('\n'),
        ok: true
      },
      timestamp: '00:00:01'
    }
  ]);

  // Socratic Probes Toggle State
  const [revealedSocratic, setRevealedSocratic] = useState<Record<string, boolean>>({});

  // Cargar estado de localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('polymath_completed_exercises');
      if (saved) {
        setCompletedExercises(JSON.parse(saved));
      }
    } catch {
      // Ignorar errores de localStorage en entornos restringidos
    }
    setIsLoaded(true);
  }, []);

  // Guardar en localStorage
  const toggleExerciseCompleted = (id: string) => {
    setCompletedExercises((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('polymath_completed_exercises', JSON.stringify(next));
      } catch {
        // Ignorar
      }
      return next;
    });
  };

  const currentExercise = EXERCISES.find((e) => e.id === selectedExerciseId) || EXERCISES[0];

  const handleSelectExercise = (id: string) => {
    setSelectedExerciseId(id);
    setActiveStepIndex(0);
  };

  const handleExecuteRepl = (cmdToRun?: string) => {
    const rawCmd = (cmdToRun !== undefined ? cmdToRun : replInput).trim();
    if (!rawCmd) return;

    const currentStep = currentExercise.stepByStep[activeStepIndex];
    const res = evaluateReplCommand(rawCmd, {
      exerciseId: currentExercise.id,
      topic: currentExercise.topic,
      currentFormula: currentStep?.commandOrFormula,
      expectedOutput: currentStep?.expectedOutput,
      proofTheorem: currentExercise.formalProof.theorem,
      codeSnippet: currentExercise.computationalArtifact.codeSnippet
    });

    if (res.action === 'clear') {
      setReplHistory([]);
      setReplInput('');
      return;
    }

    if (res.action === 'proof') {
      setActiveTab('PROOF');
    } else if (res.action === 'plot') {
      setActiveTab('VISUALIZER');
    }

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

    setReplHistory((prev) => [
      ...prev,
      {
        id: `entry-${Date.now()}`,
        cmd: rawCmd,
        result: res,
        timestamp: timeStr
      }
    ]);
    setReplInput('');
  };

  const handleLoadStepIntoRepl = (formula: string, stepIdx: number) => {
    setActiveStepIndex(stepIdx);
    setActiveTab('REPL');
    handleExecuteRepl(formula);
  };

  const toggleSocraticProbe = (probeIndex: number) => {
    const key = `${currentExercise.id}-${probeIndex}`;
    setRevealedSocratic((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Categorías únicas
  const categories = ['Todos', ...Array.from(new Set(EXERCISES.map((e) => e.category)))];
  const filteredExercises = categoryFilter === 'Todos'
    ? EXERCISES
    : EXERCISES.filter((e) => e.category === categoryFilter);

  const progressPercentage = Math.round((completedExercises.length / EXERCISES.length) * 100);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#040608',
      color: '#e6edf3',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", monospace',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header / Bar de Ingeniería */}
      <header style={{
        background: '#0d1117',
        borderBottom: '1px solid #30363d',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            style={{
              background: '#161b22',
              border: '1px solid #30363d',
              color: '#8b949e',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
            title="Alternar panel de navegación"
          >
            {isSidebarCollapsed ? '☰ Temario' : '◀ Colapsar'}
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px', color: '#58a6ff' }}>
                POLYMATH ZERO
              </span>
              <span style={{ color: '#8b949e', fontSize: '14px' }}>/</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#c9d1d9' }}>
                Workbench de Sistemas Formales
              </span>
              <span style={{
                fontSize: '11px',
                background: 'rgba(56, 139, 253, 0.15)',
                border: '1px solid #388bfd',
                color: '#58a6ff',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: 600
              }}>
                Rigor Spivak · C23
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#8b949e' }}>
              Fundamentos Matemáticos, Deducción Axiomática y Verificación Simbólica para Ciencias e Ingeniería
            </p>
          </div>
        </div>

        {/* Indicador de Progreso Global */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#8b949e' }}>
              Progreso: <strong style={{ color: '#3fb950' }}>{completedExercises.length}</strong> de <strong>{EXERCISES.length}</strong> lecciones ({progressPercentage}%)
            </div>
            <div style={{
              width: '160px',
              height: '6px',
              background: '#21262d',
              borderRadius: '3px',
              overflow: 'hidden',
              marginTop: '4px'
            }}>
              <div style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #388bfd, #3fb950)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          <button
            onClick={() => toggleExerciseCompleted(currentExercise.id)}
            style={{
              background: completedExercises.includes(currentExercise.id) ? 'rgba(63, 185, 80, 0.2)' : '#161b22',
              border: `1px solid ${completedExercises.includes(currentExercise.id) ? '#3fb950' : '#30363d'}`,
              color: completedExercises.includes(currentExercise.id) ? '#3fb950' : '#c9d1d9',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {completedExercises.includes(currentExercise.id) ? '✓ Lección Completada' : 'Marcar como Completada'}
          </button>
        </div>
      </header>

      {/* Layout de 3 Columnas o Dual Panel Colapsable */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isSidebarCollapsed ? '1fr 1.25fr' : '280px 1fr 1.25fr',
        gap: '16px',
        padding: '16px 20px',
        flex: 1,
        alignItems: 'start'
      }}>
        {/* ========================================================
            COLUMNA 1: NAVEGACIÓN, TEMARIO & GLOSARIO
            ======================================================== */}
        {!isSidebarCollapsed && (
          <aside style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Filtros de Categoría */}
            <div style={{
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '8px',
              padding: '12px'
            }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#8b949e', fontWeight: 700, marginBottom: '8px' }}>
                Disciplina / Área
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    style={{
                      background: categoryFilter === cat ? 'rgba(88, 166, 255, 0.15)' : '#161b22',
                      border: `1px solid ${categoryFilter === cat ? '#58a6ff' : '#30363d'}`,
                      color: categoryFilter === cat ? '#58a6ff' : '#8b949e',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Árbol de Lecciones */}
            <div style={{
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '8px',
              padding: '14px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#8b949e', fontWeight: 700 }}>
                  Árbol de Lecciones
                </span>
                <span style={{ fontSize: '11px', color: '#58a6ff' }}>{filteredExercises.length} disponibles</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filteredExercises.map((ex, index) => {
                  const isSelected = ex.id === currentExercise.id;
                  const isDone = completedExercises.includes(ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => handleSelectExercise(ex.id)}
                      style={{
                        padding: '10px 12px',
                        background: isSelected ? 'rgba(88, 166, 255, 0.12)' : '#161b22',
                        border: `1px solid ${isSelected ? '#58a6ff' : '#21262d'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          fontSize: '11px',
                          color: isSelected ? '#58a6ff' : '#8b949e',
                          fontWeight: 600,
                          textTransform: 'uppercase'
                        }}>
                          {ex.category}
                        </span>
                        {isDone ? (
                          <span style={{ color: '#3fb950', fontSize: '12px', fontWeight: 'bold' }}>✓ Hecho</span>
                        ) : (
                          <span style={{ color: '#8b949e', fontSize: '11px' }}>Día {index + 1}</span>
                        )}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: isSelected ? '#e6edf3' : '#c9d1d9',
                        marginTop: '3px'
                      }}>
                        {ex.topic}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Glosario Contextual de la Lección Actual */}
            <div style={{
              background: '#0d1117',
              border: '1px solid #30363d',
              borderRadius: '8px',
              padding: '14px'
            }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: '#8b949e', fontWeight: 700, marginBottom: '10px' }}>
                📖 Glosario Axiomático Activo
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentExercise.glossaryTerms.map((term, i) => (
                  <div key={i} style={{
                    background: '#161b22',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid #30363d'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#bc8cff' }}>
                      {term.term}
                    </div>
                    <div style={{ fontSize: '11px', color: '#c9d1d9', marginTop: '3px', lineHeight: '1.4' }}>
                      {term.definition}
                    </div>
                    <div style={{ fontSize: '10px', color: '#8b949e', marginTop: '4px', fontStyle: 'italic', borderTop: '1px solid #21262d', paddingTop: '3px' }}>
                      Contexto: {term.rigorousContext}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* ========================================================
            COLUMNA 2: ENUNCIADO & PASO A PASO GUIADO
            ======================================================== */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Header de la Lección */}
          <div style={{
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '8px',
            padding: '18px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '11px',
                background: '#21262d',
                color: '#58a6ff',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                {currentExercise.category}
              </span>
              <span style={{ fontSize: '11px', color: '#8b949e' }}>ID: {currentExercise.id}</span>
            </div>
            <h1 style={{
              margin: '0 0 10px 0',
              fontSize: '20px',
              fontWeight: 700,
              color: '#f0f6fc',
              letterSpacing: '-0.3px'
            }}>
              {currentExercise.topic}
            </h1>

            {/* Fundamento Epistemológico: QUÉ y POR QUÉ */}
            <div style={{
              background: 'rgba(56, 139, 253, 0.08)',
              borderLeft: '4px solid #58a6ff',
              borderRadius: '4px',
              padding: '12px 14px',
              marginTop: '12px'
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#58a6ff',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '4px'
              }}>
                💡 Fundamento Ontológico: ¿Qué estamos aprendiendo y por qué?
              </div>
              <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: '#c9d1d9' }}>
                {currentExercise.whyWeLearnThis}
              </p>
            </div>
          </div>

          {/* Pasos Guiados Interactivos */}
          <div style={{
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '8px',
            padding: '18px 20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px'
            }}>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#8b949e', fontWeight: 700 }}>
                Secuencia Deductiva Guiada
              </span>
              <span style={{ fontSize: '12px', color: '#3fb950', fontWeight: 600 }}>
                {currentExercise.stepByStep.length} pasos axiomáticos
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {currentExercise.stepByStep.map((step, idx) => {
                const isActive = activeStepIndex === idx;
                return (
                  <div
                    key={step.stepNumber}
                    style={{
                      background: isActive ? '#161b22' : '#0d1117',
                      border: `1px solid ${isActive ? '#58a6ff' : '#21262d'}`,
                      borderRadius: '8px',
                      padding: '14px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: isActive ? '#58a6ff' : '#30363d',
                          color: isActive ? '#040608' : '#e6edf3',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {step.stepNumber}
                        </span>
                        <strong style={{ fontSize: '14px', color: '#f0f6fc' }}>
                          {step.title}
                        </strong>
                      </div>

                      {/* Botón de Carga al REPL */}
                      <button
                        onClick={() => handleLoadStepIntoRepl(step.commandOrFormula, idx)}
                        style={{
                          background: 'rgba(88, 166, 255, 0.15)',
                          border: '1px solid #58a6ff',
                          color: '#58a6ff',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flexShrink: 0
                        }}
                      >
                        ⚡ Cargar en Terminal
                      </button>
                    </div>

                    {/* Expresión / Comando Formal */}
                    <div style={{
                      margin: '10px 0 8px 0',
                      background: '#040608',
                      border: '1px solid #30363d',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                      fontSize: '12px',
                      color: '#3fb950',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>$ {step.commandOrFormula}</span>
                      <span style={{ fontSize: '10px', color: '#8b949e' }}>Sentencia computable</span>
                    </div>

                    {/* Rationale Axiomático */}
                    <div style={{ fontSize: '12px', color: '#c9d1d9', lineHeight: '1.5', marginTop: '6px' }}>
                      <strong style={{ color: '#e5a93c' }}>Justificación Axiomática:</strong> {step.rationale}
                    </div>

                    {/* Resultado Esperado */}
                    <div style={{
                      fontSize: '11px',
                      color: '#8b949e',
                      marginTop: '6px',
                      paddingTop: '6px',
                      borderTop: '1px solid #21262d'
                    }}>
                      Salida analítica esperada: <span style={{ color: '#58a6ff', fontWeight: 600 }}>{step.expectedOutput}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Artefacto Computacional de Referencia */}
          <div style={{
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '8px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px' }}>💻</span>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#8b949e' }}>
                  Artefacto Computacional ({currentExercise.computationalArtifact.engine})
                </span>
              </div>
              <button
                onClick={() => handleExecuteRepl('cat snippet')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#58a6ff',
                  fontSize: '11px',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Ver en REPL
              </button>
            </div>
            <pre style={{
              background: '#040608',
              border: '1px solid #21262d',
              borderRadius: '6px',
              padding: '10px 12px',
              fontFamily: 'ui-monospace, monospace',
              fontSize: '11px',
              color: '#e6edf3',
              overflowX: 'auto',
              margin: 0
            }}>
              {currentExercise.computationalArtifact.codeSnippet}
            </pre>
          </div>
        </main>

        {/* ========================================================
            COLUMNA 3: WORKBENCH (5 PESTAÑAS DE INSPECCIÓN)
            ======================================================== */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Barra de Pestañas de Inspección */}
          <div style={{
            display: 'flex',
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '8px',
            padding: '4px',
            gap: '4px',
            overflowX: 'auto'
          }}>
            {[
              { id: 'REPL', label: '💻 Terminal / REPL', key: '1' },
              { id: 'PROOF', label: '📐 Demostración', key: '2' },
              { id: 'VISUALIZER', label: '📊 Gráfico / Vectorial', key: '3' },
              { id: 'SOCRATIC', label: '❓ Desafío Socrático', key: '4' },
              { id: 'CANON', label: '📚 Canon Académico', key: '5' }
            ].map((tab) => {
              const isTabActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  style={{
                    flex: 1,
                    minWidth: '110px',
                    padding: '8px 10px',
                    background: isTabActive ? '#21262d' : 'transparent',
                    border: 'none',
                    borderRadius: '6px',
                    color: isTabActive ? '#58a6ff' : '#8b949e',
                    fontSize: '12px',
                    fontWeight: isTabActive ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Panel de Contenido de la Pestaña Activa */}
          <div style={{
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '8px',
            padding: '16px',
            minHeight: '560px'
          }}>
            {/* TAB 1: REPL MATEMÁTICO / TERMINAL */}
            {activeTab === 'REPL' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
                {/* Status Bar del Kernel */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#161b22',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #30363d',
                  fontSize: '11px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#3fb950' }}>●</span>
                    <strong style={{ color: '#c9d1d9' }}>Kernel Formal: SymPy 1.13.2 / Python 3.12</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => handleExecuteRepl('help')}
                      style={{ background: '#21262d', border: '1px solid #30363d', color: '#58a6ff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                    >
                      help
                    </button>
                    <button
                      onClick={() => handleExecuteRepl('test')}
                      style={{ background: '#21262d', border: '1px solid #30363d', color: '#3fb950', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                    >
                      test
                    </button>
                    <button
                      onClick={() => handleExecuteRepl('proof')}
                      style={{ background: '#21262d', border: '1px solid #30363d', color: '#bc8cff', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                    >
                      proof
                    </button>
                    <button
                      onClick={() => handleExecuteRepl('clear')}
                      style={{ background: '#21262d', border: '1px solid #30363d', color: '#8b949e', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer' }}
                    >
                      clear
                    </button>
                  </div>
                </div>

                {/* Historial de la Terminal */}
                <div style={{
                  background: '#040608',
                  border: '1px solid #21262d',
                  borderRadius: '6px',
                  padding: '12px',
                  minHeight: '380px',
                  maxHeight: '440px',
                  overflowY: 'auto',
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                  fontSize: '12px',
                  lineHeight: '1.45',
                  color: '#e6edf3'
                }}>
                  {replHistory.map((entry) => (
                    <div key={entry.id} style={{ marginBottom: '12px' }}>
                      <div style={{ color: '#58a6ff', fontWeight: 600 }}>
                        <span style={{ color: '#8b949e', fontSize: '10px', marginRight: '6px' }}>[{entry.timestamp}]</span>
                        polymath&gt; {entry.cmd}
                      </div>
                      <pre style={{
                        margin: '4px 0 0 0',
                        color: entry.result.ok ? '#c9d1d9' : '#f85149',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'inherit'
                      }}>
                        {entry.result.output}
                      </pre>
                      {entry.result.latex && (
                        <div style={{ marginTop: '4px', padding: '4px 8px', background: '#0d1117', borderRadius: '4px' }}>
                          <KaTeXInline math={entry.result.latex} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input Prompt de la Terminal */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleExecuteRepl();
                  }}
                  style={{ display: 'flex', gap: '8px' }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    background: '#040608',
                    border: '1px solid #30363d',
                    borderRadius: '6px',
                    padding: '0 10px'
                  }}>
                    <span style={{ color: '#58a6ff', fontWeight: 700, marginRight: '8px', fontSize: '13px' }}>&gt;</span>
                    <input
                      type="text"
                      value={replInput}
                      onChange={(e) => setReplInput(e.target.value)}
                      placeholder="Escribí: eval, diff, integrate, limit, plot, test, help..."
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        color: '#f0f6fc',
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '13px',
                        padding: '10px 0',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    style={{
                      background: '#238636',
                      border: '1px solid #2ea043',
                      color: '#ffffff',
                      padding: '0 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Ejecutar
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: DEMOSTRACIÓN FORMAL */}
            {activeTab === 'PROOF' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  background: '#161b22',
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: '1px solid #30363d'
                }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#bc8cff', fontWeight: 700 }}>
                    Teorema Formal
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0f6fc', marginTop: '4px' }}>
                    <FormattedMathText text={currentExercise.formalProof.theorem} />
                  </div>
                </div>

                {/* Premisas */}
                <div style={{
                  background: '#040608',
                  padding: '12px 14px',
                  borderRadius: '6px',
                  border: '1px solid #21262d'
                }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#8b949e', fontWeight: 700, marginBottom: '6px' }}>
                    Premisas & Axiomas de Partida
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#c9d1d9', lineHeight: '1.6' }}>
                    {currentExercise.formalProof.premises.map((p, idx) => (
                      <li key={idx}>
                        <FormattedMathText text={p} />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Desglose Deductivo Paso a Paso */}
                <div>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#8b949e', fontWeight: 700, marginBottom: '8px' }}>
                    Cadena Deductiva Rigurosa
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {currentExercise.formalProof.steps.map((s, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: '#161b22',
                          border: '1px solid #30363d',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <span style={{ color: '#58a6ff', fontWeight: 700, minWidth: '18px' }}>
                            {idx + 1}.
                          </span>
                          <div style={{ flex: 1, color: '#f0f6fc', fontWeight: 500 }}>
                            <FormattedMathText text={s.step} />
                          </div>
                        </div>
                        <div style={{
                          marginTop: '6px',
                          paddingLeft: '26px',
                          fontSize: '11px',
                          color: '#e5a93c'
                        }}>
                          ↳ <em>Justificación:</em> {s.justification}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q.E.D. */}
                <div style={{
                  background: 'rgba(63, 185, 80, 0.12)',
                  border: '1px solid #3fb950',
                  color: '#3fb950',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '13px'
                }}>
                  {currentExercise.formalProof.qed}
                </div>
              </div>
            )}

            {/* TAB 3: GRÁFICO / ESPACIO VECTORIAL REACTIVO */}
            {activeTab === 'VISUALIZER' && (
              <MathVisualizer exercise={currentExercise} />
            )}

            {/* TAB 4: DESAFÍO SOCRÁTICO */}
            {activeTab === 'SOCRATIC' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{
                  background: '#161b22',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #30363d',
                  fontSize: '12px',
                  color: '#8b949e'
                }}>
                  ⚠️ <strong>Chequeo a libro cerrado:</strong> Intentá responder mentalmente a estas preguntas conceptuales antes de revelar el análisis técnico.
                </div>

                {currentExercise.socraticProbes.map((probe, idx) => {
                  const key = `${currentExercise.id}-${idx}`;
                  const isRevealed = !!revealedSocratic[key];
                  return (
                    <div
                      key={idx}
                      style={{
                        background: '#040608',
                        border: '1px solid #30363d',
                        borderRadius: '8px',
                        padding: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          background: 'rgba(229, 169, 60, 0.15)',
                          border: '1px solid #e5a93c',
                          color: '#e5a93c',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700
                        }}>
                          {probe.coreConcept}
                        </span>
                        <span style={{ fontSize: '11px', color: '#8b949e' }}>Pregunta #{idx + 1}</span>
                      </div>

                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f6fc', lineHeight: '1.5' }}>
                        {probe.question}
                      </div>

                      <button
                        onClick={() => toggleSocraticProbe(idx)}
                        style={{
                          marginTop: '10px',
                          background: isRevealed ? '#21262d' : 'rgba(88, 166, 255, 0.15)',
                          border: `1px solid ${isRevealed ? '#30363d' : '#58a6ff'}`,
                          color: isRevealed ? '#8b949e' : '#58a6ff',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {isRevealed ? '▲ Ocultar análisis técnico' : '▼ Revelar análisis técnico'}
                      </button>

                      {isRevealed && (
                        <div style={{
                          marginTop: '10px',
                          background: '#161b22',
                          borderLeft: '3px solid #3fb950',
                          padding: '10px 12px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#c9d1d9',
                          lineHeight: '1.6'
                        }}>
                          <strong style={{ color: '#3fb950' }}>Deducción Rigurosa:</strong> {probe.deepExplanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 5: CANON ACADÉMICO */}
            {activeTab === 'CANON' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ fontSize: '12px', color: '#8b949e' }}>
                  Referencias formales y citas canónicas de los textos fundacionales de la matemática moderna.
                </div>

                {currentExercise.canonicalReferences.map((ref, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#161b22',
                      border: '1px solid #30363d',
                      borderRadius: '8px',
                      padding: '14px 16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#58a6ff' }}>{ref.book}</strong>
                        <div style={{ fontSize: '12px', color: '#8b949e' }}>
                          Autor: <span style={{ color: '#e6edf3' }}>{ref.author}</span>
                        </div>
                      </div>
                      <span style={{
                        background: '#21262d',
                        border: '1px solid #30363d',
                        color: '#bc8cff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 600
                      }}>
                        {ref.chapter}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#e5a93c', fontWeight: 600, marginTop: '8px' }}>
                      Tema: {ref.topic}
                    </div>

                    <blockquote style={{
                      margin: '10px 0 0 0',
                      padding: '10px 14px',
                      background: '#0d1117',
                      borderLeft: '3px solid #bc8cff',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#c9d1d9',
                      lineHeight: '1.6',
                      fontStyle: 'italic'
                    }}>
                      "{ref.quote}"
                    </blockquote>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Footer del Workbench */}
      <footer style={{
        background: '#0d1117',
        borderTop: '1px solid #30363d',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: '#8b949e'
      }}>
        <div>
          Polymath Zero · Workbench de Sistemas Formales · Desarrollado bajo rigor matemático C23
        </div>
        <div>
          Arquitectura: Astro 5 + React 19 + TypeScript Strict + KaTeX Simbólico
        </div>
      </footer>
    </div>
  );
}
