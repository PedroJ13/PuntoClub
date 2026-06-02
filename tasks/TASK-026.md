# TASK-026 - Revalidar UI contra API real despues de QA

## Estado

Asignada a Web Dev.

## Contexto

TASK-022 no fue aprobada porque no habia API real disponible. TASK-025 debe confirmar que endpoints de clientes no tienen P0/P1.

## Objetivo

Validar la UI de busqueda/listado y registro de cliente contra API real.

## Alcance

- Configurar `window.PUNTO_CLUB_API_BASE_URL` sin secretos.
- Confirmar `window.PUNTO_CLUB_COMPANY_ID = "1"`.
- Validar:
  - buscar/listar clientes
  - registrar cliente
  - duplicado
  - errores de campo
  - error controlado si API falla
- Probar desktop y mobile basico.

## No tocar

- No implementar compras/redenciones.
- No cambiar contratos API.
- No guardar secretos.

## Dependencias

- TASK-024 completada.
- TASK-025 sin P0/P1 en endpoints de clientes.

## Handoff esperado

Crear `tasks/TASK-026-HANDOFF.md`.
