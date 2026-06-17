# TASK-251 - Confirmar deploy API de configuracion de membresias

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Backend/API

## Contexto

TASK-249 no aprobo porque la API publicada responde `404` para endpoints de membresias.

TASK-247 implemento endpoints localmente. TASK-250 debe aplicar la migracion SQL.

## Objetivo

Publicar/confirmar la API de configuracion de membresias en Azure Functions.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-247-HANDOFF.md`, `tasks/TASK-249-HANDOFF.md` y `tasks/TASK-250-HANDOFF.md`.
- Confirmar que la migracion SQL fue aplicada antes de validar endpoints reales.
- Publicar o disparar deploy API si hace falta.
- Validar publicado:
  - `GET /api/membership-plans?status=all` sin sesion ya no es `404` y responde `401/403` segun patron auth;
  - `POST /api/membership-plans` sin sesion ya no es `404` y responde protegido;
  - endpoints de beneficios ya no son `404`;
  - `/api/me` sin sesion sigue `401`;
  - no se exponen datos de otras empresas ni secretos.
- Ejecutar tests backend razonables.

## Entregable

Crear o actualizar `tasks/TASK-251-HANDOFF.md` con:

- Resultado.
- Commit/deploy si aplica.
- Endpoints publicados validados.
- Tests ejecutados.
- Riesgos o pendientes para Web Dev/QA.
