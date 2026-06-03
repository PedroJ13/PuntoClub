# TASK-041 - Validar API estable despues de redeploy

## Estado

Asignada a QA.

## Contexto

TASK-039 debe redeployar Azure Functions con `GET /settings`.

## Objetivo

Confirmar que la API estable sigue sin P0/P1 despues del redeploy.

## Alcance

- Ejecutar smoke contra URL estable.
- Validar `GET /api/companies/1/settings`.
- Revalidar crear cliente y duplicado.
- Confirmar que no hay regresion en compra/saldo/redencion.

## No tocar

- No validar UI completa.
- No cambiar codigo.

## Dependencias

- TASK-039 completada.

## Handoff esperado

Crear `tasks/TASK-041-HANDOFF.md`.
