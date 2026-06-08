# TASK-157 - Preparar integracion Backend API con Entra External ID

Equipo responsable: Backend API

## Dependencia

Esperar `tasks/TASK-156-HANDOFF.md` con resultado completado y valores publicos de Entra External ID.

## Contexto

Punto Club ya tiene solicitud de empresa, invitaciones con token hash y pantalla publica de invitacion validada. Falta conectar creacion de acceso/login/password con Entra External ID.

## Objetivo

Preparar la integracion Backend/API para validar identidad de usuarios empresa con Entra External ID y asociarlos de forma segura a `company_users` / empresa, sin confiar en `companyId` enviado por frontend.

## Alcance

- Leer `docs/API_CONTRACTS.md`.
- Leer `tasks/TASK-156-HANDOFF.md`.
- Definir/implementar solo lo necesario para validar tokens emitidos por Entra, si los valores estan completos.
- Mantener invitacion/token de Punto Club como prueba de autorizacion inicial para crear el usuario owner.
- No aceptar `companyId` como autoridad desde frontend.
- No guardar secretos en repo.
- Si falta configuracion de Entra, bloquear con nota clara.

## Entregable

Crear o actualizar `tasks/TASK-157-HANDOFF.md` con:

- Resultado.
- Cambios realizados o bloqueo.
- Endpoints/contratos afectados.
- Variables de configuracion requeridas, sin secretos.
- Pruebas ejecutadas.
