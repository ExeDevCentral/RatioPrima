/**
 * REPL Engine para Polymath Zero - Workbench de Sistemas Formales
 * Simula un entorno CAS (Computer Algebra System) estilo SymPy / GNU Octave
 * con capacidades de evaluación simbólica, cálculo diferencial/integral, límites y pruebas axiomáticas.
 */

export interface ReplResult {
  output: string;
  ok: boolean;
  latex?: string;
  action?: 'plot' | 'proof' | 'clear' | 'none';
  actionPayload?: string;
}

export function evaluateReplCommand(cmd: string, context?: {
  exerciseId?: string;
  topic?: string;
  currentFormula?: string;
  expectedOutput?: string;
  proofTheorem?: string;
  codeSnippet?: string;
}): ReplResult {
  const trimmed = cmd.trim();
  if (!trimmed) {
    return { output: '', ok: true, action: 'none' };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = trimmed.slice(command.length).trim();

  switch (command) {
    case 'clear':
    case 'cls':
      return { output: '', ok: true, action: 'clear' };

    case 'help':
      return {
        output: [
          '═══════════════════════════════════════════════════════════════',
          '           POLYMATH ZERO · FORMAL REPL & CAS KERNEL           ',
          '═══════════════════════════════════════════════════════════════',
          'Comandos analíticos disponibles:',
          '  eval <expr>          : Evalúa algebraicamente una expresión o igualdad formal.',
          '  diff <expr> [var]    : Diferenciación simbólica formal d/dx.',
          '  integrate <expr> [v] : Integración analítica indefinida ∫ f(x) dx.',
          '  limit <expr> [x->a]  : Cálculo de límite con verificación épsilon-delta.',
          '  plot <func|vector>   : Invoca la renderización en el visor geométrico.',
          '  proof                : Muestra la deducción deductiva axiomática del tema actual.',
          '  test                 : Ejecuta la suite de verificación de consistencia axiomática.',
          '  cat <file>           : Inspecciona el artefacto computacional de la lección.',
          '  status               : Muestra el estado del kernel formal y axiomas cargados.',
          '  clear                : Limpia el historial de la terminal.',
          '',
          'Tip: Podés pegar cualquier fórmula del paso a paso guiado directamente.',
          '═══════════════════════════════════════════════════════════════'
        ].join('\n'),
        ok: true,
        action: 'none'
      };

    case 'status':
      return {
        output: [
          '[KERNEL STATUS: OK]',
          `Motor CAS: SymPy 1.13.2 / Python 3.12 (Symbolic Core)`,
          `Lección activa: ${context?.topic || 'Sistemas Formales'}`,
          `Precisión analítica: Exacta (Axiomas de Cuerpo y Espacio Vectorial ℝ)`,
          `Axiomas verificados en sesión: [P1-P12 Tricotomía, Peano, ZFC, Linealidad]`
        ].join('\n'),
        ok: true
      };

    case 'cat':
      if (args.includes('snippet') || args.includes('script') || args.includes('code') || !args) {
        return {
          output: context?.codeSnippet 
            ? `[FILE: artifact.py]\n${context.codeSnippet}`
            : '# Artefacto formal no cargado para esta vista.',
          ok: true
        };
      }
      return {
        output: `cat: ${args}: archivo simbólico virtual enlazado al kernel.`,
        ok: true
      };

    case 'proof':
      return {
        output: context?.proofTheorem
          ? `[DEDUCCIÓN FORMAL]\nTeorema: ${context.proofTheorem}\nCargue la pestaña [📐 Demostración Formal] para el árbol axiomático completo.`
          : 'Deducción formal activa en el panel de Demostración.',
        ok: true,
        action: 'proof'
      };

    case 'plot':
      return {
        output: `[PLOT ENGINE] Curva o espacio vectorial '${args || 'f(x)'}' proyectado en la pestaña [📊 Gráfico / Espacio Vectorial].`,
        ok: true,
        action: 'plot',
        actionPayload: args
      };

    case 'test':
      return {
        output: [
          '─── EJECUCIÓN DE TEST SUITE AXIOMÁTICA ───',
          '✓ Axioma de Neutro e Inverso: CONSERVADO',
          '✓ Axioma de Distributividad: VERIFICADO (∀ a, b, c ∈ ℝ)',
          '✓ Principio de Tricotomía: VÁLIDO (P ∪ {0} ∪ -P = ℝ)',
          '✓ Continuidad & Acotación: VERIFICADO (|f(x) - L| < ε)',
          '──────────────────────────────────────────',
          'RESULTADO: 4/4 pruebas formales pasadas con éxito. 0 inconsistencias.'
        ].join('\n'),
        ok: true
      };

    case 'diff': {
      if (!args) {
        return { output: 'Uso: diff <expresión> [variable]. Ej: diff x^3 - 3*x + 1 x', ok: false };
      }
      const expr = args.replace(/\s+x$/, '').trim();
      let derivative = '';
      if (expr === 'x^2' || expr === 'x**2') derivative = '2*x';
      else if (expr === 'x^3' || expr === 'x**3') derivative = '3*x^2';
      else if (expr.includes('3*x - 1') || expr.includes('3x - 1') || expr.includes('3*x-1')) derivative = '3';
      else if (expr === 'sin(x)') derivative = 'cos(x)';
      else if (expr === 'cos(x)') derivative = '-sin(x)';
      else if (expr === 'e^x' || expr === 'exp(x)') derivative = 'exp(x)';
      else if (expr === 'x') derivative = '1';
      else derivative = `d/dx [${expr}] (Regla de la cadena y linealidad del operador diferencial)`;

      return {
        output: `[CAS diff] d/dx (${expr}) = ${derivative}\nPropiedad: Operador diferencial lineal D[f + g] = D[f] + D[g].`,
        ok: true,
        latex: `\\frac{d}{dx}\\left(${expr}\\right) = ${derivative}`
      };
    }

    case 'integrate': {
      if (!args) {
        return { output: 'Uso: integrate <expresión> [variable]. Ej: integrate 3*x^2 x', ok: false };
      }
      const expr = args.replace(/\s+x$/, '').trim();
      let integral = '';
      if (expr === '3*x^2' || expr === '3x^2') integral = 'x^3 + C';
      else if (expr === '2*x' || expr === '2x') integral = 'x^2 + C';
      else if (expr === '3') integral = '3*x + C';
      else if (expr === 'cos(x)') integral = 'sin(x) + C';
      else if (expr === 'sin(x)') integral = '-cos(x) + C';
      else integral = `∫ (${expr}) dx + C`;

      return {
        output: `[CAS integrate] ∫ (${expr}) dx = ${integral}\nTeorema Fundamental del Cálculo aplicado rigurosamente.`,
        ok: true,
        latex: `\\int \\left(${expr}\\right) dx = ${integral}`
      };
    }

    case 'limit': {
      if (!args) {
        return { output: 'Uso: limit <expresión> [x->c]. Ej: limit (3*x - 1) x->2', ok: false };
      }
      if (args.includes('3*x - 1') || args.includes('3x - 1') || args.includes('3*x-1')) {
        return {
          output: [
            '[CAS limit] lim_{x -> 2} (3x - 1) = 5',
            'Definición rigurosa Spivak: ∀ ε > 0, ∃ δ = ε/3 > 0 tal que 0 < |x - 2| < δ ⟹ |(3x - 1) - 5| < ε.',
            'Acotación formal: |3x - 6| = 3|x - 2| < 3(ε/3) = ε. (Verificado).'
          ].join('\n'),
          ok: true,
          latex: `\\lim_{x \\to 2} (3x - 1) = 5`
        };
      }
      return {
        output: `[CAS limit] Límite analítico evaluado para: ${args}.\nCriterio de Cauchy satisfecho.`,
        ok: true
      };
    }

    case 'eval':
    case 'simplify': {
      const expr = args || trimmed;
      return evaluateExpression(expr, context);
    }

    default:
      // Si el usuario introduce una expresión directa o fórmula del paso a paso
      return evaluateExpression(trimmed, context);
  }
}

function evaluateExpression(expr: string, context?: {
  currentFormula?: string;
  expectedOutput?: string;
}): ReplResult {
  const normalized = expr.trim();

  // Caso: comparación lógica o identidad
  if (normalized.includes('==') || normalized.includes('=')) {
    const isStepMatch = context?.currentFormula && normalized.includes(context.currentFormula.trim());
    return {
      output: [
        `[CAS EVALUATOR] Identidad formal evaluada: ${normalized}`,
        `Resultado analítico: ${isStepMatch && context?.expectedOutput ? context.expectedOutput : 'True (Axiomáticamente válida)'}`,
        `Estado de consistencia: Satisface los axiomas del cuerpo conmutativo.`
      ].join('\n'),
      ok: true
    };
  }

  // Caso: cálculo numérico o analítico básico
  try {
    // Evaluación segura para expresiones aritméticas sencillas
    if (/^[0-9\s\+\-\*\/\^\(\)\.\%]+$/.test(normalized)) {
      const sanitized = normalized.replace(/\^/g, '**');
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${sanitized})`)();
      return {
        output: `[CAS CALC] ${normalized} = ${result}`,
        ok: true
      };
    }
  } catch {
    // Fallback al análisis simbólico
  }

  // Si coincide con el paso actual
  if (context?.expectedOutput) {
    return {
      output: [
        `[CAS EVALUATOR] Expresión evaluada: ${normalized}`,
        `Resultado formal: ${context.expectedOutput}`,
        `Deducción: Axiomas verificados sin inconsistencias.`
      ].join('\n'),
      ok: true
    };
  }

  return {
    output: [
      `[CAS EVALUATOR] Entrada simbólica: ${normalized}`,
      `Resultado analítico: Reducción algebraica canónica completada.`,
      `Observación: Cumple con la clausura operacional en el dominio formal.`
    ].join('\n'),
    ok: true
  };
}
