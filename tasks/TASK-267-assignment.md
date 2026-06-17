# TASK-267 - QA reportes de membresias

Equipo: QA
Round: 14
Depende de: TASK-265, TASK-266
Estado: Assigned

## Objetivo

Validar que los eventos de membresias se ven correctamente en Reportes/Auditoria publicados.

## Alcance

1. Leer handoffs de TASK-265 y TASK-266.
2. Validar que API publicada protege endpoints de reportes/auditoria sin sesion.
3. Validar que Reportes Web publicado carga sin regresion.
4. Validar que los textos/markers de membresias estan publicados.
5. Si hay datos reales o evidencia segura, validar:
   - activacion de membresia aparece en actividad/auditoria;
   - uso de beneficio aparece en actividad/auditoria;
   - exportacion CSV incluye esos eventos.

## Validaciones minimas

- No hay regresion en Operaciones, Mi empresa, Reportes ni Login.
- Reportes carga.
- CSV sigue disponible.
- Eventos de membresia aparecen con texto legible cuando hay datos.

## Handoff esperado

Actualizar `tasks/TASK-267-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia API.
- Evidencia Web.
- Evidencia CSV si aplica.
- Hallazgos P1/P2/P3.
