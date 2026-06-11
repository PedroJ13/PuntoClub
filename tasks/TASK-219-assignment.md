# TASK-219 - Validar aprobacion independiente de imagenes

Equipo responsable: QA

## Contexto

Se cambio la regla de producto: aprobar un servicio y aprobar sus imagenes son procesos separados.

QA debe validar que administracion puede aprobar/rechazar imagenes individualmente sin afectar el servicio ni las demas imagenes.

## Objetivo

Validar el flujo publicado de moderacion individual de imagenes asociadas a un servicio.

## Alcance

- Leer handoffs TASK-215, TASK-216, TASK-217 y TASK-218.
- Validar con un servicio aprobado y varias imagenes:
  - subir/cargar o usar al menos 3 imagenes asociadas al servicio;
  - aprobar una imagen;
  - rechazar otra imagen;
  - confirmar que el servicio sigue aprobado;
  - confirmar que imagenes aprobadas siguen publicables;
  - confirmar que imagen rechazada no se muestra publicamente;
  - confirmar que rechazar una imagen no afecta las otras.
- Validar mensajes/copy de confirmacion.
- Validar regresion basica de servicio aprobado.
- No usar imagenes sensibles ni datos privados reales.

## Entregable

Crear o actualizar `tasks/TASK-219-HANDOFF.md` con:

- Resultado: aprobado, no aprobado o bloqueado.
- Checks ejecutados.
- Evidencia redaccionada.
- P0/P1/P2/P3.
- Pendientes o bloqueos.
