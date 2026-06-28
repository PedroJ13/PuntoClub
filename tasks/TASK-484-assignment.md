# TASK-484 - Alinear tipos de movimiento legacy entre contrato y dry-run

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Estado: Ready
Prioridad: P1 correccion local
Depende de: TASK-483

## Objetivo

Corregir el P1 reportado por QA en TASK-483: el contrato documental y la herramienta de dry-run deben aceptar los mismos tipos de movimiento legacy antes de usar archivos reales.

## Contexto

TASK-483 no aprobo localmente porque `docs/DATA_MIGRATION_LEGACY_PLAN.md` define tipos como `redemption`, `legacy_balance_import` y `legacy_balance_reconciliation`, pero `tools/migration/dry-run-legacy-import.mjs` rechaza algunos de esos tipos como `INVALID_MOVEMENT_TYPE`.

Decision Product / Architect / Release para esta correccion:

- Vocabulario canonico del contrato:
  - `purchase`
  - `redemption`
  - `points_adjustment_positive`
  - `points_adjustment_negative`
  - `legacy_balance_import`
  - `legacy_balance_reconciliation`
- La herramienta puede aceptar aliases legacy para compatibilidad, pero debe normalizarlos al vocabulario canonico en outputs y reportes.
- Alias permitidos:
  - `redeem` -> `redemption`
  - `balance_snapshot` -> `legacy_balance_import`

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`
- `docs/TOOLS.md`
- `tasks/TASK-482-HANDOFF.md`
- `tasks/TASK-483-HANDOFF.md`

## Alcance

1. Actualizar `tools/migration/dry-run-legacy-import.mjs` para aceptar y normalizar los tipos canonicos.
2. Mantener compatibilidad con aliases `redeem` y `balance_snapshot`.
3. Actualizar `tools/migration/README.md` y plantillas/fixtures si corresponde.
4. Asegurar que los outputs de staging/reportes usen tipos canonicos.
5. Mejorar el error `.xlsx` para que no muestre stack trace innecesario al usuario si es viable dentro del alcance.
6. Ejecutar los mismos casos de verificacion local usados en TASK-482/TASK-483, incluyendo:
   - `redemption`;
   - `legacy_balance_import`;
   - `legacy_balance_reconciliation`;
   - alias `redeem`;
   - alias `balance_snapshot`;
   - tipo desconocido.

## Fuera de alcance

- No implementar parser nativo `.xlsx`.
- No usar Azure SQL.
- No cargar datos reales.
- No crear endpoints API.
- No aplicar staging en base real.
- No publicar Web/API.

## Criterios de aceptacion

- La herramienta acepta todos los tipos canonicos definidos en `docs/DATA_MIGRATION_LEGACY_PLAN.md`.
- Los aliases permitidos quedan documentados y normalizados.
- Los reportes/staging generados usan vocabulario canonico.
- Tipo desconocido sigue fallando con `INVALID_MOVEMENT_TYPE`.
- `.xlsx` sigue rechazado si no hay parser, pero con mensaje controlado y sin stack trace innecesario.
- `npm run lint`, `npm run format:check` y pruebas locales de dry-run pasan.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, API real, servicios externos ni datos reales.

Todo debe correr localmente con fixtures sinteticos.

## Handoff esperado

Crear o actualizar `tasks/TASK-484-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Archivos cambiados:
Verificacion ejecutada:
Evidencia:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

