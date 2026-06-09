# TASK-191 - Confirmar deploy API de rate limiting auth propia

Equipo responsable: Backend API

## Contexto

TASK-189 implemento rate limiting/lockout en codigo local y las pruebas pasaron, pero TASK-190 no aprobo porque la API publicada aun no reflejaba el cambio: login y accept repetidos no llegaron a `429 TOO_MANY_ATTEMPTS`.

El commit con la implementacion debe publicarse antes de reintentar QA.

## Objetivo

Confirmar que el hardening de TASK-189 esta desplegado en Azure Functions y que los endpoints publicados responden con el contrato esperado.

## Alcance

- Confirmar workflow/deploy API exitoso posterior al commit que contiene TASK-189.
- Validar publicado con sujetos sinteticos nuevos:
  - login invalido repetido con mismo email sintetico hasta observar `429 TOO_MANY_ATTEMPTS`;
  - accept invitacion repetido con token sintetico/no real hasta observar `429 TOO_MANY_ATTEMPTS`;
  - `/api/me` sin sesion sigue `401`;
  - endpoint operativo con cookie sintetica invalida sigue `401`.
- No usar password real.
- No usar token real de invitacion.
- No usar cookie real.
- No imprimir hashes, cookies, tokens, passwords ni connection strings.

## Entregable

Crear o actualizar `tasks/TASK-191-HANDOFF.md` con:

- Resultado.
- Commit/run publicado validado.
- Respuestas HTTP redaccionadas.
- Confirmacion especifica de `429 TOO_MANY_ATTEMPTS`.
- Pendientes o bloqueos.
