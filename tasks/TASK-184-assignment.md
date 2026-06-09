# TASK-184 - Confirmar deploy Web de operacion con credentials

Equipo responsable: Web Dev

## Contexto

TASK-180 completo cambios locales para que la Web envie cookie de sesion en operaciones privadas y use la empresa devuelta por `/api/me` como empresa activa.

QA en TASK-181 no aprobo porque el bundle publicado todavia no contenia `credentials: "include"` en las llamadas operativas privadas.

## Objetivo

Confirmar que el cambio de TASK-180 esta publicado en Static Web Apps y que el bundle publicado contiene la regla correcta de credentials.

## Alcance

- Confirmar workflow/deploy Web exitoso posterior al commit que contiene TASK-180.
- Revisar bundle publicado o fuente publicada para confirmar `credentials: "include"` en:
  - settings;
  - customers;
  - purchases;
  - redemptions;
  - reports;
  - audit.
- Confirmar que invitacion publica y registro publico siguen sin `credentials: "include"` cuando corresponda.
- Smoke visual basico:
  - `/`;
  - `/login`;
  - `/company-invitations/accept?token=<fake-redacted>`.
- No usar credenciales reales.
- No pegar cookies, tokens ni passwords.

## Entregable

Crear o actualizar `tasks/TASK-184-HANDOFF.md` con:

- Resultado.
- Commit/run publicado validado.
- Evidencia redaccionada de bundle o fuente publicada.
- Smoke visual basico.
- Pendientes o bloqueos.
