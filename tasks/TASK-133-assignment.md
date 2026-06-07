# TASK-133 - Validar endpoints base de solicitudes de empresa publicados

## Equipo

QA

## Prioridad

P1

## Contexto

TASK-129 implemento endpoints base de solicitudes de empresa. El flujo de approve/reject queda detras de `COMPANY_REGISTRATION_REVIEW_ENABLED=true`. El envio real de email se conecta en TASK-131.

## Objetivo

Validar en ambiente publicado los endpoints base de solicitud de empresa, sin probar aun invitaciones/login/logo.

## Alcance

- Validar que la API publicada expone `POST /api/company-registration-requests` despues del deploy.
- Crear una solicitud QA controlada.
- Confirmar respuesta `201` y campos esperados.
- Validar errores:
  - falta `companyAddress`;
  - email invalido;
  - campos prohibidos como `password`, `companyId` o `requestedLogoUrl`.
- Validar que approve/reject responden `403` si `COMPANY_REGISTRATION_REVIEW_ENABLED` no esta habilitado.
- Validar que el flujo operativo existente de clientes/compra/redencion sigue funcionando.

## Fuera de alcance

- Crear empresa real aprobada.
- Enviar invitaciones.
- Login.
- Logo upload.
- Probar Entra External ID.

## Entregable

Crear `tasks/TASK-133-HANDOFF.md` con:

- Resultado aprobado/no aprobado.
- Endpoints probados.
- Datos QA creados.
- Hallazgos por severidad.

## Validacion esperada

Product / Architect / Release debe saber si la primera pieza publicada de registro de empresa es estable antes de seguir con invitaciones.
