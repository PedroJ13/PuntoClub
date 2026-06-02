# TASK-021 - Revalidar SQL/API base contra ambiente real

## Estado

Asignada a QA.

## Contexto

TASK-013 no fue aprobada porque no habia ambiente API/SQL real. TASK-020 debe entregar API corriendo contra Azure SQL con smoke test.

## Objetivo

Validar endpoints reales contra Azure SQL existente.

## Alcance

- Crear cliente.
- Validar cliente duplicado.
- Registrar compra.
- Validar factura duplicada.
- Consultar saldo.
- Validar redencion si endpoint esta disponible.
- Confirmar errores HTTP contratados.

## No tocar

- No cambiar codigo.
- No aprobar UI completa.

## Dependencias

- TASK-019 completada.
- TASK-020 completada.

## Handoff esperado

Crear `tasks/TASK-021-HANDOFF.md`.
