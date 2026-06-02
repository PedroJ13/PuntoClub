# TASK-015 - Integrar UI de clientes contra API real

## Estado

Asignada a Web Dev.

## Contexto

TASK-010 puede iniciar UI con mock/adapter. La integracion real debe esperar a que Backend/API entregue `tasks/TASK-009-HANDOFF.md`.

## Objetivo

Conectar busqueda/listado y registro de cliente contra los endpoints reales de Backend/API.

## Alcance

- Usar `PILOT_COMPANY_ID` configurado no editable para construir rutas.
- Integrar busqueda/listado de clientes.
- Integrar crear cliente.
- Mostrar errores de validacion y duplicado.
- Mantener adapter/API client aislado para cambios futuros.

## No tocar

- No implementar compras/redenciones.
- No cambiar contratos API.
- No tratar `companyId` frontend como seguridad.

## Dependencias

- `tasks/TASK-009-HANDOFF.md` debe existir.
- Endpoints de clientes deben estar disponibles.

## Handoff esperado

Crear `tasks/TASK-015-HANDOFF.md`.
