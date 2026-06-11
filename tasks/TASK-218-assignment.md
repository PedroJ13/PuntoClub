# TASK-218 - Implementar UI de moderacion individual de imagenes

Equipo responsable: Web Dev

## Contexto

Depende de TASK-216 y TASK-217.

La UI debe permitir que administracion apruebe o rechace imagenes individuales asociadas a un servicio, sin afectar el estado del servicio ni las otras imagenes.

## Objetivo

Implementar la UI necesaria para moderar imagenes por separado dentro de un servicio.

## Alcance

- Leer handoffs TASK-216 y TASK-217.
- Mostrar imagenes asociadas a un servicio con estado individual.
- Permitir aprobar una imagen individual.
- Permitir rechazar/declinar una imagen individual.
- Mostrar claramente que el servicio permanece aprobado si se rechaza una imagen.
- Asegurar que solo imagenes aprobadas aparezcan como publicables, segun contrato Backend/API.
- Manejar errores controlados:
  - imagen ya procesada;
  - imagen no pertenece al servicio;
  - permisos insuficientes;
  - error API.
- No exponer secretos ni datos internos innecesarios.

## Entregable

Crear o actualizar `tasks/TASK-218-HANDOFF.md` con:

- Resultado.
- Pantallas/secciones modificadas.
- Contratos usados.
- Pruebas ejecutadas.
- Pendientes o bloqueos.
---

## Estado

CANCELADA / NO APLICA para Punto Club.

Motivo: esta solicitud correspondia a otro proyecto/contexto y fue creada por error en este repo. No implementar, no ejecutar y no usar como dependencia.
