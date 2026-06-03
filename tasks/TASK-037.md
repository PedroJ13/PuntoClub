# TASK-037 - Revalidar UI contra API estable con CORS

## Estado

Asignada a Web Dev.

## Contexto

TASK-034 no fue aprobada por CORS ausente en Azure Functions. TASK-035 debe resolverlo.

## Objetivo

Validar la UI de clientes en navegador contra API estable.

## Alcance

- Usar `window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`.
- Validar buscar/listar clientes.
- Validar registrar cliente.
- Validar duplicado.
- Validar errores de campo.
- Verificar desktop/mobile basico.

## No tocar

- No implementar compras/redenciones.
- No guardar secretos.
- No crear Static Web Apps.

## Dependencias

- TASK-035 completada.

## Handoff esperado

Crear `tasks/TASK-037-HANDOFF.md`.
