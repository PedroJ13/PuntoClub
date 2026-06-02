# TASK-033 - Validar API estable

## Estado

Asignada a QA.

## Contexto

TASK-029 aprobo API real local con observaciones. TASK-032 debe entregar una URL estable de API en Azure Functions o equivalente.

## Objetivo

Revalidar endpoints principales contra API estable.

## Alcance

- Ejecutar smoke test contra URL estable.
- Validar crear cliente.
- Validar duplicado.
- Validar compra, saldo y redencion.
- Confirmar que no hay P0/P1.

## No tocar

- No cambiar codigo.
- No validar UI completa.

## Dependencias

- TASK-032 completada.
- Si TASK-031 cambia API, incluirlo en validacion.

## Handoff esperado

Crear `tasks/TASK-033-HANDOFF.md`.
