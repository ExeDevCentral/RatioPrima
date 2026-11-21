# AGENTS.md — RatioPrima

## Principios de Ingeniería
- **Autoría directa:** Exequiel Echevarría (Software & Web Architect).
- **Rigor matemático:** Ninguna fórmula, respuesta ni paso pedagógico puede tener errores aritméticos o algebraicos. Todo cambio en ejercicios/currículo debe pasar `tests/curriculum.test.ts` y `tests/exerciseAudit.test.ts`.
- **Módulos puros:** `web/src/lib/` (`geometry3d.ts`, `exerciseAudit.ts`, `tutorAi.ts`) es TypeScript puro, sin dependencias de DOM ni React, 100% testeable con `node --test`.

## Verificación Obligatoria (Feedback Loop)
Antes de cerrar cualquier cambio con código:
1. Correr `npm run verify` (`npm test` + `npm run check` + `npm run build`).
2. Prohibido usar `@ts-ignore`, `@ts-nocheck` o `debugger`.
3. En cambios de UI/3D, validar visualmente en vivo con el subagente `browser` (modelo `flash`, 0 errores de consola + mobile/desktop).
