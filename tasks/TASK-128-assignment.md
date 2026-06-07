# TASK-128 - Aplicar migracion SQL de registro de empresas e invitaciones

## Equipo

SQL DEV

## Prioridad

P1

## Contexto

SQL DEV preparo `database/migrations/20260607_company_registration_invitations.sql` en TASK-121. Backend/API reviso la migracion en TASK-122 y la considero apta como base, con ajustes contractuales ya documentados en TASK-124.

La migracion aun no ha sido aplicada en Azure SQL.

## Objetivo

Aplicar la migracion de registro de empresas/invitaciones/usuarios en Azure SQL existente, con prevalidaciones y sin crear seeds productivos.

## Alcance

- Usar Azure SQL existente:
  - `sqlserver-pj13-brazil/sql-db-puntoclub`
- Ejecutar prevalidaciones indicadas en TASK-121:
  - emails duplicados en `Companies`;
  - statuses fuera de catalogo;
  - eventos de auditoria fuera de catalogo.
- Si prevalidaciones fallan, no aplicar migracion y documentar bloqueo.
- Si prevalidaciones pasan, aplicar:
  - `database/migrations/20260607_company_registration_invitations.sql`
- Validar que existan:
  - columnas nuevas en `Companies`;
  - `CompanyRegistrationRequests`;
  - `CompanyInvitations`;
  - `CompanyUsers`;
  - indices/constraints principales.
- No insertar datos reales ni seeds.
- No modificar passwords/secrets.

## Fuera de alcance

- Crear recursos Azure.
- Cambiar API.
- Cambiar UI.
- Crear empresas/invitaciones reales.

## Entregable

Crear `tasks/TASK-128-HANDOFF.md` con:

- Resultado de prevalidaciones.
- Si la migracion fue aplicada o bloqueada.
- Evidencia de validacion posterior.
- Cualquier regla temporal usada y si fue retirada.
- Riesgos o siguientes pasos.

## Validacion esperada

Backend/API debe poder implementar repositorios/endpoints contra el modelo real solo si la migracion queda aplicada.
