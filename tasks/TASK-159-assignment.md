# TASK-159 - Preparar SQL para auth propia MVP de empresas

Equipo responsable: SQL DEV

## Contexto

Product Owner aprobo cambiar direccion: pausar Microsoft Entra External ID para el piloto y avanzar con auth propia MVP, siguiendo un patron multiempresa logico probado en otro proyecto.

La migracion actual `database/migrations/20260607_company_registration_invitations.sql` fue preparada para Entra External ID: `CompanyUsers.auth_provider = entra_external_id` y `external_subject` obligatorio. Eso ya no calza con el piloto.

## Objetivo

Preparar una migracion SQL versionada para soportar usuarios empresa con password hash y sesiones server-side, sin aplicar cambios en Azure SQL salvo que Product / Architect / Release lo pida explicitamente.

## Alcance

- Revisar `docs/DECISION_LOG.md`.
- Revisar `docs/API_CONTRACTS.md`.
- Revisar `docs/DATA_MODEL.md`.
- Revisar la migracion vigente de registro/invitaciones.
- Proponer/crear migracion versionada nueva para:
  - permitir `CompanyUsers.auth_provider = local_password`;
  - soportar password hash fuerte y metadatos necesarios;
  - hacer `external_subject` nullable o no requerido para auth local;
  - crear `CompanySessions` con token hash, expiracion, estado y relacion con usuario/empresa;
  - indices para login por email y busqueda de sesion por token hash;
  - constraints de estado/rol compatibles con piloto.

## Reglas de seguridad

- No guardar password plano.
- No guardar token de sesion plano.
- No guardar token de invitacion plano.
- No agregar datos reales de credenciales.
- No aplicar migracion en Azure SQL en esta tarea.

## Entregable

Crear o actualizar `tasks/TASK-159-HANDOFF.md` con:

- Resultado.
- Archivo de migracion creado o propuesta exacta si no se crea.
- Riesgos.
- Validaciones/prevalidaciones sugeridas.
- Confirmacion de que no se aplico en Azure SQL.
