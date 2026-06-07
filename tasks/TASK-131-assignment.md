# TASK-131 - Conectar solicitudes de empresa con email real ACS

## Equipo

Backend API

## Prioridad

P1

## Contexto

TASK-127 dejo ACS Email configurado y app settings de email presentes. TASK-129 implemento solicitudes de empresa con notifier noop, porque aun no tenia handoff de Infra disponible.

## Objetivo

Conectar el flujo de solicitud de empresa al envio real de correos aprobado, manteniendo seguridad y no exponiendo invitaciones productivas completas aun.

## Alcance

- Implementar adapter/notifier ACS Email usando app settings existentes:
  - `ACS_EMAIL_CONNECTION_STRING`
  - `ACS_EMAIL_SENDER_ADDRESS`
  - `ACS_EMAIL_SENDER_DISPLAY_NAME`
  - `INTERNAL_NOTIFICATION_EMAIL`
  - `APP_PUBLIC_BASE_URL`
- Para `POST /api/company-registration-requests`:
  - enviar notificacion interna a `pj13eros_business@outlook.com`;
  - enviar acuse al solicitante si la informacion del request lo permite.
- Usar copy de `TASK-123-HANDOFF.md`.
- No loggear secrets, tokens, connection strings ni payload sensible innecesario.
- Mantener fallback seguro si ACS no esta configurado.
- Agregar pruebas unitarias con mock de email adapter.

## Fuera de alcance

- Invitaciones con token.
- Accept invite.
- Entra External ID.
- Logo upload.
- UI.

## Entregable

Crear `tasks/TASK-131-HANDOFF.md` con:

- Archivos modificados.
- Comportamiento implementado.
- Pruebas ejecutadas.
- Como se valida envio real de forma controlada.
- Riesgos.

## Validacion esperada

Debe quedar listo para que QA/Infra hagan una prueba controlada de envio de solicitud sin usar empresas externas reales.
