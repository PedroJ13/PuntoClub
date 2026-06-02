# TASK-029 - Revalidar SQL/API real con ambiente repetible

## Estado

Asignada a QA.

## Contexto

TASK-025 no fue aprobada porque el ambiente local devolvia `500 INTERNAL_ERROR` por conectividad SQL/firewall. TASK-028 debe entregar smoke test real repetible.

## Objetivo

Validar endpoints reales contra Azure SQL existente.

## Alcance

- Crear cliente.
- Validar cliente duplicado.
- Registrar compra.
- Validar factura duplicada.
- Consultar saldo.
- Validar redencion real.
- Confirmar errores HTTP contratados.

## No tocar

- No cambiar codigo.
- No aprobar UI completa.

## Dependencias

- TASK-028 completada con smoke test exitoso repetible.

## Handoff esperado

Crear `tasks/TASK-029-HANDOFF.md`.
