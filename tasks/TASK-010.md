# TASK-010 - Implementar busqueda/listado y registro de cliente

## Estado

Asignada a Web Dev.

## Contexto

TASK-005 propuso pantallas MVP. La primera pieza frontend debe cubrir operacion basica sin esperar todo el producto.

## Objetivo

Implementar la primera superficie operativa: buscar/listar clientes y registrar cliente.

## Alcance

- Crear base frontend si aun no existe.
- Implementar:
  - pantalla de busqueda/listado de clientes
  - formulario registrar cliente
  - estados loading, empty, error y confirmacion
- Integrar contra API si TASK-009 esta disponible; si no, dejar adapter/mock claramente aislado.
- Mantener diseño operativo, no landing marketing.

## No tocar

- No implementar compras/redenciones todavia.
- No cambiar contratos API.
- No guardar companyId editable como fuente confiable final.
- No agregar dependencias grandes sin justificar.

## Verificacion

- Revisar desktop y mobile basico.
- Validar errores de duplicado/validacion si API disponible.
- Confirmar que no se rompe flujo futuro de detalle/compra/redencion.

## Handoff esperado

Crear `tasks/TASK-010-HANDOFF.md`.
