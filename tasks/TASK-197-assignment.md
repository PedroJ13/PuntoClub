# TASK-197 - Confirmar deploy API de logo privado

Equipo responsable: Backend API

## Contexto

TASK-194 implemento API privada de logo en codigo local, pero TASK-196 no aprobo porque los endpoints publicados `/api/my-company/logo` respondian `404`.

El commit con TASK-194/TASK-195 debe publicarse antes de reintentar QA.

## Objetivo

Confirmar que la API de logo privado esta desplegada en Azure Functions.

## Alcance

- Confirmar workflow/deploy API exitoso posterior al commit que contiene TASK-194.
- Validar publicado sin secretos reales:
  - `GET /api/my-company/logo` sin sesion -> `401 UNAUTHORIZED` si el endpoint esta activo.
  - `POST /api/my-company/logo` sin sesion -> `401 UNAUTHORIZED` si el endpoint esta activo.
  - `/api/me` sin sesion sigue `401`.
- No usar cookie real.
- No usar password real.
- No usar SAS, account key ni connection string.
- No subir logo real autenticado.

## Entregable

Crear o actualizar `tasks/TASK-197-HANDOFF.md` con:

- Resultado.
- Commit/run publicado validado.
- Respuestas HTTP redaccionadas.
- Confirmacion especifica de endpoints de logo activos.
- Pendientes o bloqueos.
