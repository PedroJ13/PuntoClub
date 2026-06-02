# TASK-034 - Validar UI contra API estable

## Estado

Asignada a Web Dev.

## Contexto

TASK-030 aprobo UI de clientes contra API real local. Falta validar contra URL API estable.

## Objetivo

Validar busqueda/listado y registro de cliente contra API estable.

## Alcance

- Configurar `window.PUNTO_CLUB_API_BASE_URL` con URL estable.
- Validar buscar/listar clientes.
- Validar registrar cliente.
- Validar duplicado.
- Validar errores de campo.
- Revisar desktop y mobile basico.

## No tocar

- No implementar compras/redenciones.
- No crear Static Web Apps.
- No guardar secretos.

## Dependencias

- TASK-032 completada.
- TASK-033 sin P0/P1 en endpoints de clientes.

## Handoff esperado

Crear `tasks/TASK-034-HANDOFF.md`.
