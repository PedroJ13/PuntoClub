# TASK-121 - Preparar migracion SQL para registro de empresas e invitaciones

## Equipo

SQL DEV

## Prioridad

P1

## Round

Round 4

## Depende de

`TASK-119`

## Contexto

Product / Architect / Release decidio avanzar a multiempresa controlado. SQL DEV ya propuso modelo en `tasks/TASK-115-HANDOFF.md`.

La siguiente tarea es preparar una migracion versionada y revisable, sin aplicarla aun en Azure SQL.

## Objetivo

Crear el script SQL versionado para soportar registro de empresas, invitaciones y usuarios por empresa, listo para revision y aplicacion posterior.

## Alcance

- Crear un archivo de migracion en `database/migrations/` siguiendo el estilo existente del repo.
- Basarse en `tasks/TASK-115-HANDOFF.md`.
- Incluir:
  - ampliacion de `Companies.status`;
  - unicidad filtrada para email de empresa si es segura;
  - `CompanyRegistrationRequests`;
  - `CompanyInvitations`;
  - `CompanyUsers`;
  - campo `address` si el modelo actual no lo tiene y es necesario para el flujo aprobado;
  - soporte minimo para metadata de logo si corresponde sin acoplarse a storage final.
- Incluir queries de prevalidacion para duplicados/riesgos.
- No aplicar la migracion en Azure SQL.
- No crear seeds productivos.
- No manejar passwords reales.

## Fuera de alcance

- Ejecutar la migracion en Azure.
- Cambiar API.
- Cambiar UI.
- Configurar auth/email/storage.

## Entregable

Crear `tasks/TASK-121-HANDOFF.md` con:

- Archivo de migracion creado.
- Resumen de tablas/cambios.
- Prevalidaciones recomendadas.
- Riesgos antes de aplicar.
- Dependencias para futura aplicacion.

## Validacion esperada

El script debe ser revisable por Product / Architect / Release y Backend/API antes de aplicarse a Azure SQL.
