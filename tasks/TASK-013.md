# TASK-013 - Revalidar SQL/API base despues de Backend/API

## Estado

Asignada a QA.

## Contexto

TASK-012 no fue aprobada porque no existe todavia API ejecutable ni evidencia de ejecucion de `database/schema.sql` y `database/seed.sql` contra una base accesible.

## Objetivo

Repetir validacion SQL/API base cuando Backend/API entregue `tasks/TASK-009-HANDOFF.md` y exista ambiente local o Azure con SQL ejecutado.

## Alcance

- Validar crear cliente.
- Validar cliente duplicado.
- Validar registrar compra.
- Validar factura duplicada.
- Validar consultar saldo.
- Validar redencion si endpoint existe.
- Confirmar errores HTTP:
  - `409 DUPLICATE_CUSTOMER`
  - `409 DUPLICATE_INVOICE`
  - `409 INSUFFICIENT_POINTS`
  - `404 COMPANY_NOT_FOUND`
  - `404 CUSTOMER_NOT_FOUND`
  - `400 VALIDATION_ERROR`

## No tocar

- No cambiar codigo.
- No aprobar release completo.
- No validar UI salvo que la tarea lo pida.

## Dependencias

- `tasks/TASK-009-HANDOFF.md` debe existir.
- `database/schema.sql` y `database/seed.sql` deben estar ejecutados en una base accesible.
- Debe existir `PILOT_COMPANY_ID=1` configurado server-side.

## Handoff esperado

Crear `tasks/TASK-013-HANDOFF.md`.
