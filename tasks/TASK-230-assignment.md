# TASK-230 - Confirmar deploy API de ajustes empresa/logo/correos

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Backend/API

## Contexto

TASK-229 no aprobo porque la API publicada todavia no refleja TASK-225:

- `POST /api/company-registration-requests` publicado sigue esperando JSON;
- `multipart/form-data` con logo responde `400 VALIDATION_ERROR`;
- no se puede validar logo opcional en solicitud ni transferencia al aprobar.

TASK-225 ya dejo cambios locales para API de registro de empresa, logo opcional y correos.

## Objetivo

Confirmar que los cambios de TASK-225 quedan publicados en Azure Functions.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-225-HANDOFF.md` y `tasks/TASK-229-HANDOFF.md`.
- Confirmar estado del repo/deploy API.
- Publicar o disparar el deploy API si los cambios no estan publicados y el flujo del proyecto lo permite.
- Validar en API publicada:
  - solicitud JSON sin logo sigue funcionando;
  - solicitud `multipart/form-data` con logo minimo funciona o devuelve error controlado esperado por contrato nuevo;
  - respuestas no exponen token, hash, SAS, blob path interno ni link de invitacion;
  - endpoints internos siguen protegidos sin token.
- No imprimir secretos.

## Entregable

Crear o actualizar `tasks/TASK-230-HANDOFF.md` con:

- Resultado.
- Commit/deploy/API version si aplica.
- Checks publicados ejecutados.
- Evidencia segura de soporte de logo en solicitud.
- Riesgos o pendientes para Web Dev/QA.
