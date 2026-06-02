# TASK-009 - Implementar base API contra SQL

## Estado

Asignada a Backend API.

## Contexto

TASK-004 dejo contratos MVP en `docs/API_CONTRACTS.md`. TASK-003 dejo schema SQL. TASK-007 debe decidir auth/companyId antes de cerrar comportamiento final.

## Objetivo

Implementar una primera base API pequena contra SQL para clientes, compras, saldo e historial.

## Alcance

- Crear estructura de Azure Functions o API segun stack del repo cuando exista.
- Implementar endpoints P0:
  - listar/buscar clientes
  - crear cliente
  - registrar compra
  - consultar saldo
  - consultar historial
- Preparar redenciones si `dbo.RegisterRedemption` esta disponible.
- Mapear errores SQL a errores API.
- Usar `pointsEarned` server-side con regla confirmada.

## No tocar

- No implementar UI.
- No crear recursos Azure.
- No guardar secrets.
- No cerrar auth final si TASK-007 no esta resuelta.

## Verificacion

- Probar happy path y casos negativos basicos localmente si hay entorno.
- Confirmar factura duplicada como `409 DUPLICATE_INVOICE`.
- Confirmar cliente duplicado como `409 DUPLICATE_CUSTOMER`.
- Confirmar que `pointsEarned` no viene del frontend.

## Handoff esperado

Crear `tasks/TASK-009-HANDOFF.md`.
