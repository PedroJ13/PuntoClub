# TASK-250 - Aplicar migracion SQL de membresias en Azure

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: SQL DEV / Data

## Contexto

TASK-249 no aprobo porque la configuracion de membresias no esta disponible publicada.

Prerequisito detectado:

- TASK-246 creo `database/migrations/20260613_memberships_mvp.sql`.
- La migracion no fue aplicada en Azure SQL.

Base objetivo:

- Servidor: `sqlserver-pj13-brazil`
- Base: `sql-db-puntoclub`

## Objetivo

Aplicar y validar la migracion SQL de membresias MVP en Azure SQL.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-246-HANDOFF.md` y `tasks/TASK-249-HANDOFF.md`.
- Aplicar `database/migrations/20260613_memberships_mvp.sql` en Azure SQL.
- Validar existencia de:
  - columnas `loyalty_points_enabled`, `loyalty_memberships_enabled` en `Companies`;
  - `MembershipPlans`;
  - `MembershipBenefits`;
  - `CustomerMemberships`;
  - `MembershipBenefitUsages`;
  - indices principales.
- Si existe una empresa de prueba activa para PO, habilitar `loyalty_memberships_enabled = 1` solo para esa empresa y documentarla de forma segura.
- Si no existe empresa activa, no crear empresa desde SQL; dejar pendiente que PO cree una por flujo normal.
- No borrar datos.
- No imprimir secretos, hashes, tokens, cookies ni connection strings.
- Si firewall bloquea acceso, dejar bloqueado con IP observada y SQL propuesto sin ejecutar.

## Entregable

Crear o actualizar `tasks/TASK-250-HANDOFF.md` con:

- Resultado.
- Migracion aplicada o bloqueo.
- Validacion de tablas/columnas/indices.
- Empresa de prueba habilitada para membresias, si aplica.
- Riesgos o pendientes para Backend/API y QA.
