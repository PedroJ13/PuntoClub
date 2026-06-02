# TASK-032 - Preparar API estable en Azure Functions

## Estado

Asignada a Infra / Azure.

## Contexto

El flujo de clientes fue validado localmente contra Azure SQL con regla temporal de firewall. Para prueba comoda de usuario/equipos se necesita una API estable que no dependa de la IP local.

## Objetivo

Preparar Azure Functions para exponer una URL API estable con app settings seguros.

## Alcance

- Confirmar si se crea Function App ahora o si se usa una existente.
- Configurar app settings sin revelar secretos:
  - `SQL_CONNECTION_STRING`
  - `PILOT_COMPANY_ID=1`
  - `FUNCTIONS_WORKER_RUNTIME=node`
  - storage runtime requerido
- Publicar o preparar pasos de deploy de `api/`.
- Entregar URL base `/api` para QA/Web si queda disponible.
- Mantener Static Web Apps fuera de alcance por ahora.

## No tocar

- No crear Static Web Apps.
- No guardar secretos.
- No crear otra DB.

## Handoff esperado

Crear `tasks/TASK-032-HANDOFF.md`.
