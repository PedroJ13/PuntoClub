# TASK-215 - Revisar modelo para aprobacion independiente de imagenes

Equipo responsable: SQL DEV

## Contexto

Cambio de regla de producto: aprobar un servicio y aprobar sus imagenes son procesos separados.

Una empresa puede solicitar/aprobar un servicio, por ejemplo `personalizados`, y luego cargar varias imagenes dentro de ese mismo servicio. Administracion debe poder aprobar o declinar cada imagen individualmente sin afectar el estado del servicio ni el estado de las otras imagenes.

Ejemplo esperado: si un servicio ya aprobado tiene 10 imagenes y 2 no son aptas, administracion debe poder rechazar solo esas 2 y mantener las otras 8 aprobadas/publicables.

## Objetivo

Revisar si el modelo actual soporta moderacion independiente por imagen ligada a un servicio, o proponer la migracion minima necesaria.

## Alcance

- Revisar tablas/relaciones actuales de servicios e imagenes, si existen.
- Confirmar o proponer estados separados:
  - servicio: pendiente/aprobado/rechazado/inactivo segun modelo actual;
  - imagen: pendiente/aprobada/rechazada.
- Confirmar que rechazar una imagen no cambia el estado del servicio.
- Confirmar que aprobar/rechazar una imagen no afecta otras imagenes del mismo servicio.
- Proponer campos minimos si faltan:
  - `moderation_status` o equivalente por imagen;
  - `reviewed_at`;
  - `reviewed_by` o label interno;
  - `review_note` opcional.
- No aplicar migraciones sin instruccion explicita.

## Entregable

Crear o actualizar `tasks/TASK-215-HANDOFF.md` con:

- Resultado.
- Modelo actual observado o supuestos si no existe todavia.
- Propuesta SQL minima si hace falta.
- Riesgos de integridad.
- Dependencias para Backend/API.
---

## Estado

CANCELADA / NO APLICA para Punto Club.

Motivo: esta solicitud correspondia a otro proyecto/contexto y fue creada por error en este repo. No implementar, no ejecutar y no usar como dependencia.
