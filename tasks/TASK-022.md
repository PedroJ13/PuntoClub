# TASK-022 - Revalidar UI contra API real despues de smoke test

## Estado

Asignada a Web Dev.

## Contexto

TASK-018 no fue aprobada porque no habia API real accesible. TASK-020 debe entregar URL/comandos de API, y TASK-021 debe confirmar que endpoints base no tienen P0/P1.

## Objetivo

Validar la UI de clientes contra API real disponible.

## Alcance

- Configurar `window.PUNTO_CLUB_API_BASE_URL` sin secretos.
- Confirmar `window.PUNTO_CLUB_COMPANY_ID = "1"`.
- Validar busqueda/listado.
- Validar registrar cliente.
- Validar duplicado y errores de campos.
- Revisar desktop y mobile basico.

## No tocar

- No implementar compras/redenciones.
- No cambiar contratos API.
- No guardar secretos.

## Dependencias

- TASK-020 completada.
- TASK-021 sin P0/P1 en endpoints de clientes.

## Handoff esperado

Crear `tasks/TASK-022-HANDOFF.md`.
