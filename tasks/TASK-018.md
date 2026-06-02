# TASK-018 - Revalidar UI contra API real

## Estado

Asignada a Web Dev.

## Contexto

TASK-015 conecto la UI a API real por defecto, pero no se pudo validar contra Azure Functions + SQL real porque el ambiente no estaba disponible.

## Objetivo

Validar la UI de busqueda/listado y registro de cliente contra una API real disponible.

## Alcance

- Configurar `window.PUNTO_CLUB_API_BASE_URL` sin secretos.
- Confirmar `window.PUNTO_CLUB_COMPANY_ID = "1"`.
- Validar:
  - buscar clientes
  - registrar cliente
  - error de duplicado
  - errores de validacion
  - error controlado si API falla
- Probar desktop y mobile basico.

## No tocar

- No implementar compras/redenciones.
- No cambiar contratos API.
- No guardar secretos.

## Dependencias

- TASK-017 debe entregar API real/local accesible.
- QA TASK-013 debe no tener P0/P1 de API que bloqueen clientes.

## Handoff esperado

Crear `tasks/TASK-018-HANDOFF.md`.
