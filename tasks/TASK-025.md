# TASK-025 - Revalidar SQL/API real despues de smoke test

## Estado

Asignada a QA.

## Contexto

TASK-021 no fue aprobada porque no habia API real disponible. TASK-024 debe entregar smoke test exitoso y URL/comandos seguros.

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

- TASK-024 completada con smoke test exitoso.

## Handoff esperado

Crear `tasks/TASK-025-HANDOFF.md`.
