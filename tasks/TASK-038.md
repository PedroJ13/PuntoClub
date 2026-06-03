# TASK-038 - QA smoke UI/API despues de CORS

## Estado

Asignada a QA.

## Contexto

API estable fue aprobada por QA en TASK-033. UI contra API estable quedo bloqueada por CORS en TASK-034.

## Objetivo

Hacer smoke QA del flujo clientes desde navegador cuando CORS este resuelto.

## Alcance

- Abrir UI local.
- Buscar/listar clientes.
- Registrar cliente.
- Validar duplicado.
- Validar campos requeridos.
- Confirmar que no hay P0/P1 para el flujo clientes.

## No tocar

- No cambiar codigo.
- No validar compras/redenciones UI.

## Dependencias

- TASK-035 completada.
- TASK-037 idealmente completada o ejecutable.

## Handoff esperado

Crear `tasks/TASK-038-HANDOFF.md`.
