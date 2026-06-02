# TASK-030 - Revalidar UI contra API real con ambiente repetible

## Estado

Asignada a Web Dev.

## Contexto

TASK-026 no fue aprobada porque la API real fallaba contra SQL por conectividad/firewall. TASK-029 debe confirmar que endpoints de clientes no tienen P0/P1.

## Objetivo

Validar la UI de clientes contra API real disponible.

## Alcance

- Configurar `window.PUNTO_CLUB_API_BASE_URL` sin secretos.
- Confirmar `window.PUNTO_CLUB_COMPANY_ID = "1"`.
- Validar buscar/listar clientes.
- Validar registrar cliente.
- Validar duplicado y errores de campos.
- Probar desktop y mobile basico.

## No tocar

- No implementar compras/redenciones.
- No cambiar contratos API.
- No guardar secretos.

## Dependencias

- TASK-028 completada.
- TASK-029 sin P0/P1 en endpoints de clientes.

## Handoff esperado

Crear `tasks/TASK-030-HANDOFF.md`.
