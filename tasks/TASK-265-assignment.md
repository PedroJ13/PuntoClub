# TASK-265 - Reportes API para eventos de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 13
Depende de: TASK-262, TASK-264
Estado: Assigned

## Objetivo

Validar y, si hace falta, ajustar el API de reportes/auditoria para incluir eventos operativos de membresias.

## Contexto

Ya se publicaron activacion de membresias y registro de uso de beneficios. El API de uso audita best-effort con evento `membership.benefit.used`. Ahora necesitamos que esos eventos sean consultables desde reportes/auditoria para uso operativo.

## Alcance

1. Revisar handoffs de TASK-262, TASK-263 y TASK-264.
2. Revisar endpoints actuales de reportes y auditoria.
3. Confirmar si ya exponen eventos de membresias.
4. Si no los exponen, agregar soporte para:
   - activacion de membresia de cliente;
   - uso de beneficio de membresia;
   - errores/control de negocio relevantes si ya existe patron.
5. Asegurar que CSV/exportacion incluya eventos de membresias si el reporte actual exporta actividad.
6. Publicar API en Azure Functions si hubo cambios.

## Eventos minimos esperados

- `membership.customer.activated` o equivalente existente para activacion.
- `membership.benefit.used` para uso de beneficio.

Si el nombre exacto ya existe con otro formato, conservar el patron existente y documentarlo.

## Validaciones minimas

- Pruebas automatizadas pasan.
- Endpoints de reportes/auditoria siguen protegidos sin sesion.
- Reportes/auditoria pueden listar eventos de membresias.
- CSV no se rompe y contiene tipo/fecha/cliente/detalle cuando aplique.

## Fuera de alcance

- Crear dashboards nuevos.
- Cambios visuales.
- Alertas por correo.

## Handoff esperado

Actualizar `tasks/TASK-265-HANDOFF.md` con:

- Resultado.
- Endpoints revisados o modificados.
- Eventos soportados.
- Evidencia de pruebas.
- Evidencia publicada si hubo deploy.
