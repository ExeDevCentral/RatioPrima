# 📐 RatioPrima (`ExeDevCentral/RatioPrima`)

> **Del latín clásico *Ratio Prima* — "La Razón Primera" / "El Primer Principio Matemático".**
> Plataforma interactiva 3D de fundamentos matemáticos, práctica guiada desde Nivel 0 y demostración formal para ingreso terciario, politécnico e ingeniería.

---

## 🏛️ Qué incluye hoy (Verificado)
- **Currículo completo de 8 Mundos:** 4 misiones por mundo, **108 preguntas** con explicación paso a paso y prerrequisitos ordenados (`operaciones`, `reales`, `algebra`, `ecuaciones`, `inecuaciones`, `sistemas`, `trigonometria`, + fundamentos).
- **Práctica Escalonada Nivel 0 → Nivel 2:** 30 ejercicios guiados (`10 + 10 + 10`) con diagnóstico de errores clásicos y equivalencias inteligentes de teclado (fracciones, decimales, `x=`).
- **Laboratorio 3D Interactivo (`Math3DScene`):** proyección 3D pura, construcción paso a paso con explicaciones claras y escena estrella de trigonometría.
- **Tutor IA Socrático:** nunca resuelve la tarea por el alumno; calcula de forma segura y guía por preguntas.
- **Motor de Auditoría de Aprendizaje (`exerciseAudit`) + Plan de 60 Días:** detecta fortalezas, debilidades y falta de evidencia antes de avanzar de nivel.
- **Stack ligero y rápido:** Astro 5 + React 19 + TypeScript 5.7 + KaTeX (`build` estático en `< 3s`, **32 tests automatizados** en `~220ms`).

---

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install --prefix web

# Desarrollo en vivo
npm run dev

# Verificación completa (tests + typecheck + build)
npm run verify
```

---

## 🗓️ Hoja de Ruta — 7 Días a Producción

| Día | Objetivo concreto | Gate de salida |
| :---: | :--- | :--- |
| **Día 1** | Repositorio limpio en GitHub (`RatioPrima`), CI verde y deploy preview en Vercel | `npm run verify` + CI verde + URL preview |
| **Día 2** | Auditoría visual en vivo (Desktop + Mobile) de Dashboard, Lección, Laboratorio 3D y Práctica 0→2 | 0 errores de consola + responsive limpio |
| **Día 3** | Pulido de UI/UX (`frontend-design` + `better-layout` + `accessibility-engineering`): tipografía KaTeX, contraste y navegación clara | Contraste WCAG AA + flujo sin fricción |
| **Día 4** | Refinar Tutor Socrático y persistencia local/exportación de progreso del alumno | Tests de estado y recuperación 100% verdes |
| **Día 5** | Revisión pedagógica de los 8 mundos y el temario de ingreso terciario 2027 | 100% cobertura de temario + 0 errores de enunciados |
| **Día 6** | Performance & SEO (Lighthouse, meta OpenGraph, favicon, carga diferida de KaTeX/3D) | Build estático optimizado + Lighthouse ≥ 95 |
| **Día 7** | QA final con usuario real + deploy a producción (`vercel --prod`) | App publicada, estable y monitoreada |

---

## 🏗️ Estructura del Proyecto

```text
├── tests/                  # 32 tests automatizados (currículo, 3D, auditoría, tutor, REPL)
├── web/
│   ├── src/
│   │   ├── components/     # MathWorkbench, KaTeXView, labs/Math3DScene, scene3dConfig
│   │   ├── data/           # 8 mundos, stepExercises, memoryAnchors, tipos estrictos
│   │   ├── lib/            # geometry3d, exerciseAudit, tutorAi, motor REPL
│   │   ├── state/          # LearningContext (gamificación, XP, progreso)
│   │   └── views/          # Dashboard, LessonView, LabView, StepsPracticeView, Cinema3DTutorView
│   └── astro.config.mjs
├── vercel.json             # Deploy estático 1-click en Vercel
└── .github/workflows/ci.yml
```

Autor: **Exequiel Echevarría** · Licencia MIT.
