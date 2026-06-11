# TASK-217 - Definir UX de administracion para aprobar imagenes por separado

Equipo responsable: Diseno / UX

## Contexto

Cambio de regla de producto: la aprobacion del servicio y la aprobacion de imagenes son procesos separados.

Administracion necesita revisar imagenes asociadas a un servicio ya aprobado y aceptar o declinar cada una individualmente.

## Objetivo

Definir el flujo UX y copy para moderacion individual de imagenes dentro de un servicio.

## Alcance

- Definir como se muestra un servicio aprobado con imagenes pendientes/aprobadas/rechazadas.
- Definir acciones por imagen:
  - aprobar imagen;
  - rechazar/declinar imagen;
  - ver motivo/estado.
- Definir mensajes para caso de 10 imagenes donde solo 2 se rechazan y 8 quedan aprobadas.
- Definir copy para dejar claro que rechazar una imagen no rechaza el servicio completo.
- Definir estados visuales:
  - pendiente;
  - aprobada/publicada;
  - rechazada/no publicada.
- Definir comportamiento responsive basico.
- No implementar UI.

## Entregable

Crear o actualizar `tasks/TASK-217-HANDOFF.md` con:

- Flujo UX recomendado.
- Copy de acciones, confirmaciones y errores.
- Estados visuales.
- Reglas de seguridad/privacidad para imagenes.
