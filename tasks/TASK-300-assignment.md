# TASK-300 - QA tarjetas compactas de membresia

Equipo: QA
Round: 41
Depende de: TASK-299
Estado: Assigned

## Objetivo

Validar que las tarjetas compactas de membresia y beneficios quedan publicadas sin romper el flujo de `Atender cliente`.

## Alcance

1. Leer `tasks/TASK-299-HANDOFF.md`.
2. Validar Web publicada en Azure.
3. Con o sin sesion real segun disponibilidad:
   - revisar desktop;
   - revisar mobile/responsive;
   - confirmar que tarjetas de membresia/beneficios son mas delgadas;
   - confirmar que textos, chips y botones no se solapan;
   - confirmar que acciones principales siguen visibles.
4. Si hay sesion real disponible:
   - seleccionar cliente con membresia/beneficios;
   - abrir acciones bajo demanda;
   - confirmar que `Renovar membresia` y `Registrar uso` siguen funcionando visualmente.

## Validaciones minimas

- No hay solapes visuales en desktop/mobile.
- Las tarjetas ocupan menos alto que antes o se ven claramente mas compactas.
- No hay regresion visible en resumen del cliente.
- No reaparece seccion vacia de `Transacciones de membresia` antes de pagar/activar.
- No aparece `Admin empresas` para empresa normal.

## Handoff esperado

Crear o actualizar `tasks/TASK-300-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia visual/funcional.
- Hallazgos P0/P1/P2/P3 si aplica.
