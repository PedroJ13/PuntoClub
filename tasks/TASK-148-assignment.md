# TASK-148 - Confirmar entrega ACS o reenviar invitacion real por canal seguro

Equipo responsable: Infra / Azure

## Contexto

TASK-146 genero una invitacion real owner:

- `requestId`: `8`
- `companyId`: `2`
- `invitationId`: `1`
- `invitationEmail`: `pj13eros_business+task146-20260608092947@outlook.com`
- `invitationStatus`: `pending`
- `invitationExpiresAt`: `06/15/2026 15:30:01`

TASK-147 quedo bloqueada porque QA no recibio el link real por canal seguro.

## Objetivo

Confirmar si el correo de invitacion fue entregado por ACS y, si hace falta, reenviar o generar una invitacion QA usable, entregando el link completo solo por canal seguro fuera del repo.

## Alcance

1. Revisar estado/logs de ACS Email o Function App relacionados con la invitacion, sin imprimir token raw ni link completo.
2. Confirmar si el correo fue aceptado/enviado/entregado o si fallo.
3. Si el correo no llego o no se puede recuperar el link:
   - usar endpoint interno de resend para `invitationId=1`, o
   - generar una nueva solicitud/invitacion QA controlada si es mas seguro.
4. Entregar el link completo de invitacion a QA/Product Owner por canal seguro fuera del repo.
5. Documentar en handoff solo datos no sensibles:
   - invitationId;
   - email destino;
   - status;
   - expiracion;
   - si se reenvio;
   - si el link fue entregado por canal seguro.

## Fuera de alcance

- No pegar link completo con token.
- No pegar `INTERNAL_ADMIN_TOKEN`.
- No pegar token raw, hash, screenshots con token ni payloads sensibles.
- No implementar login/password.
- No cambiar codigo.

## Entrega

Actualizar `tasks/TASK-148-HANDOFF.md`.
