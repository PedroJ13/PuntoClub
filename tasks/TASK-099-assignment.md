# TASK-099 - Implementar auditoria operativa en API

## Equipo

Backend API

## Contexto

TASK-097 define el diseno SQL para auditoria operativa minima. La API debe registrar eventos criticos para poder investigar operaciones reales del piloto.

## Objetivo

Implementar escritura de auditoria para operaciones criticas sin cambiar el comportamiento exitoso del flujo actual.

## Alcance

- Agregar script SQL/migracion no destructiva segun TASK-097.
- Registrar evento cuando:
  - se crea un cliente;
  - se registra una compra;
  - se registra una redencion.
- Si es razonable y seguro, registrar rechazos relevantes:
  - factura duplicada;
  - cliente duplicado;
  - saldo insuficiente.
- La auditoria no debe romper la operacion principal si falla por un error menor; documenta criterio usado.
- Agregar pruebas unitarias o de repository donde aplique.
- Actualizar contratos/docs si se agrega endpoint de consulta.

## No tocar

- No implementar UI.
- No crear auth/roles.
- No cambiar reglas de puntos.
- No imprimir secretos.

## Dependencias

- TASK-097 completada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-099-HANDOFF.md
```

Incluye cambios, eventos registrados, pruebas, si aplicaste schema local/Azure y cualquier pendiente de deploy.
