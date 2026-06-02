# TASK-004 - Proponer contratos API MVP

## Estado

Asignada a Backend/API.

## Contexto

Punto Club usara Azure Functions como API y Azure SQL como persistencia. SQL DEV debe proponer el modelo inicial en TASK-003.

## Objetivo

Proponer endpoints, payloads, respuestas y errores para los flujos MVP.

## Alcance

- Proponer contratos para:
  - configuracion de empresa
  - clientes
  - compras
  - redenciones
  - saldo/historial de cliente
- Definir casos negativos:
  - factura duplicada
  - cliente no existe
  - redencion mayor al saldo
  - datos invalidos
  - empresa no valida
- Definir errores HTTP esperados.
- Identificar validaciones que dependen de SQL.
- Actualizar `docs/API_CONTRACTS.md` si corresponde.

## No tocar

- No implementar endpoints.
- No cambiar modelo SQL sin coordinar con SQL DEV.
- No implementar UI.
- No definir auth final sin decision Product / Architect / Release.

## Verificacion

- Contratos cubren todos los criterios MVP.
- Errores son claros para Web Dev.
- No exponen datos entre empresas.

## Handoff esperado

Crear `tasks/TASK-004-HANDOFF.md`.
