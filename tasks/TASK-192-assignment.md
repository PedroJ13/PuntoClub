# TASK-192 - Revalidar rate limiting auth propia publicado

Equipo responsable: QA

## Contexto

TASK-190 no aprobo porque el hardening de TASK-189 aun no estaba visible en la API publicada. TASK-191 debe confirmar el deploy publicado.

## Objetivo

Revalidar en ambiente publicado que el rate limiting/lockout de auth propia funciona y no introduce regresiones basicas.

## Alcance

- Leer handoff de TASK-191.
- Validar con sujetos sinteticos nuevos:
  - `POST /api/company-auth/login` con email/password sinteticos repetidos hasta `429 TOO_MANY_ATTEMPTS`;
  - `POST /api/company-invitations/accept` con token sintetico/no real repetido hasta `429 TOO_MANY_ATTEMPTS`.
- Confirmar que mensajes no revelan si email o invitacion existen.
- Confirmar regresion segura:
  - `/api/me` sin sesion -> `401`;
  - endpoint operativo con cookie sintetica invalida -> `401`.
- Si se requiere login correcto de cuenta no bloqueada, usar evidencia PO redaccionada, no password real en handoff.
- No usar token real, cookie real ni password real.

## Entregable

Crear o actualizar `tasks/TASK-192-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
