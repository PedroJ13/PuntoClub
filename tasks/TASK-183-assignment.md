# TASK-183 - Confirmar deploy API de contexto por sesion

Equipo responsable: Backend API

## Contexto

TASK-179 completo cambios locales para que la API use `companyId` derivado de sesion cuando existe cookie valida, manteniendo fallback a empresa piloto solo cuando no hay sesion.

QA en TASK-181 no aprobo porque la API publicada todavia no reflejaba esa regla: una cookie sintetica invalida en endpoint operativo respondio `200` en vez de `401`.

## Objetivo

Confirmar que el cambio de TASK-179 esta publicado en Azure Functions y que la regla de cookie invalida ya aplica en ambiente publicado.

## Alcance

- Confirmar workflow/deploy API exitoso posterior al commit que contiene TASK-179.
- Validar API publicada sin usar secretos reales:
  - `GET /api/me` sin sesion -> `401`.
  - `GET /api/companies/999/customers` sin sesion -> `404 COMPANY_NOT_FOUND`.
  - `GET /api/companies/1/customers` con cookie sintetica invalida -> `401 UNAUTHORIZED`.
- No usar password real.
- No usar cookie real.
- No imprimir cookies, tokens, connection strings ni `INTERNAL_ADMIN_TOKEN`.
- No modificar codigo salvo que el deploy falle por un problema real del cambio.

## Entregable

Crear o actualizar `tasks/TASK-183-HANDOFF.md` con:

- Resultado.
- Commit/run publicado validado.
- Respuestas HTTP redaccionadas.
- Confirmacion especifica de cookie sintetica invalida -> `401`.
- Pendientes o bloqueos.
