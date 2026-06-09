# TASK-200 - Revalidar logo de empresa publicado

Equipo responsable: QA

## Contexto

TASK-196 no aprobo porque API/Web de logo no estaban publicados. TASK-197/TASK-198 deben confirmar deploy. TASK-199 puede aportar evidencia PO de upload real con sesion.

## Objetivo

Cerrar validacion publicada de logo privado de empresa sin exponer secretos.

## Alcance

- Revisar handoffs TASK-197, TASK-198 y TASK-199 si existe.
- Validar sin sesion:
  - `GET /api/my-company/logo` -> `401`;
  - `POST /api/my-company/logo` -> `401`.
- Confirmar Web publicada contiene UI de logo.
- Confirmar storage sigue privado:
  - listado anonimo no permitido.
- Revisar evidencia PO de upload/refresh/logout-login si QA no maneja credenciales.
- Validar regresion basica:
  - `/api/me` sin sesion -> `401`;
  - operacion con cookie sintetica invalida -> `401`.
- No usar password real, cookie real, token real, SAS ni connection string.

## Entregable

Crear o actualizar `tasks/TASK-200-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
