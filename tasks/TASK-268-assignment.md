# TASK-268 - API de vencimientos y alertas internas de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 15
Depende de: TASK-259, TASK-265, TASK-267
Estado: Assigned

## Objetivo

Consolidar el API para consultar membresias proximas a vencer y vencidas, de forma usable para seguimiento interno.

## Contexto

El aviso por correo queda diferido. Para MVP, la empresa necesita visibilidad interna de membresias activas proximas a vencer y membresias vencidas.

Ya existe un endpoint base:

- `GET /api/memberships/expiration-alerts?withinDays=5&status=active`

Esta tarea debe revisar si cubre el uso operativo completo o ajustar lo necesario.

## Alcance

1. Revisar handoffs de TASK-259, TASK-265 y TASK-267.
2. Revisar endpoint actual de alertas de vencimiento.
3. Asegurar soporte para:
   - proximas a vencer;
   - vencidas;
   - filtro por cantidad de dias;
   - datos suficientes para UI: cliente, plan, fecha inicio, fecha vencimiento, estado.
4. Asegurar proteccion por sesion/empresa.
5. Agregar pruebas automatizadas.
6. Publicar API en Azure Functions si hubo cambios.

## Reglas MVP

- No enviar correos automaticos.
- No renovar membresias en esta tarea.
- No crear jobs programados.
- La consulta debe ser por empresa activa de la sesion.

## Validaciones minimas

- Pruebas automatizadas pasan.
- Endpoint protegido sin sesion.
- Devuelve membresias proximas a vencer.
- Devuelve membresias vencidas.
- No filtra datos de otra empresa.

## Handoff esperado

Actualizar `tasks/TASK-268-HANDOFF.md` con:

- Resultado.
- Endpoint final confirmado.
- Campos devueltos.
- Evidencia de pruebas.
- Evidencia publicada si aplica.
