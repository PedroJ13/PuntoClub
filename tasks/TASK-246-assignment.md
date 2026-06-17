# TASK-246 - Crear migracion SQL MVP de membresias

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: SQL DEV / Data

## Contexto

Round 1 de membresias quedo completado:

- TASK-243 definio UX funcional.
- TASK-244 propuso modelo SQL.
- TASK-245 definio contratos API.

Decision Product / Architect / Release para MVP:

- Prioridad: `P2 recomendable`, pero se avanza como siguiente bloque funcional.
- MVP registra usos de beneficios controlables.
- Email automatico de vencimiento queda diferido.
- MVP permite una sola membresia activa por cliente/empresa.
- Renovacion antes de vencer queda diferida.
- Descuentos ilimitados se muestran como disponibles; no se auditan como uso obligatorio en esta fase.

## Objetivo

Crear migracion versionada para soportar membresias MVP y habilitacion de tipo de fidelizacion por empresa.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/DATA_MODEL.md`, `tasks/TASK-243-HANDOFF.md`, `tasks/TASK-244-HANDOFF.md` y `tasks/TASK-245-HANDOFF.md`.
- Crear migracion SQL versionada en `database/migrations/`.
- Incluir tablas:
  - `MembershipPlans`;
  - `MembershipBenefits`;
  - `CustomerMemberships`;
  - `MembershipBenefitUsages`.
- Incluir indices recomendados por TASK-244.
- Incluir constraints de integridad basicas.
- Incluir habilitacion simple en `Companies`:
  - `loyalty_points_enabled bit NOT NULL DEFAULT 1`;
  - `loyalty_memberships_enabled bit NOT NULL DEFAULT 0`.
- Incluir extensiones de auditoria si el modelo actual requiere allowlist/constraints para eventos nuevos.
- No aplicar en Azure SQL salvo que el patron actual del proyecto lo permita y la tarea pueda validar de forma segura.
- Si se aplica, documentar conteos/validacion y retirar cualquier regla temporal usada.
- No borrar datos.
- No imprimir secretos.

## Entregable

Crear o actualizar `tasks/TASK-246-HANDOFF.md` con:

- Resultado.
- Archivo de migracion creado.
- Resumen de tablas/campos/indices/constraints.
- Si fue aplicada o no.
- Validacion ejecutada.
- Riesgos o pendientes para Backend/API.
