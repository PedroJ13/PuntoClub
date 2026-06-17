# TASK-277 - QA reporte financiero de membresias

Equipo: QA
Round: 20
Depende de: TASK-275, TASK-276
Estado: Assigned

## Objetivo

Validar en Azure el reporte financiero de membresias.

## Alcance

1. Leer handoffs de TASK-275 y TASK-276.
2. Validar API publicada y protegida.
3. Validar Web publicada:
   - resumen diario de membresias;
   - detalle de transacciones;
   - monto por metodo de pago;
   - exportacion CSV.
4. Validar sin regresion visible:
   - Operaciones;
   - Membresias;
   - Mi empresa;
   - Reportes;
   - Login.
5. Si hay sesion real o evidencia segura, validar con datos reales de `new_membership` y `renewal`.

## Validaciones minimas

- Endpoint nuevo no responde 404.
- Sin sesion responde 401.
- Web contiene markers/textos publicados.
- CSV contiene columnas esperadas.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.

## Handoff esperado

Actualizar `tasks/TASK-277-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia API.
- Evidencia Web.
- Evidencia CSV.
- Evidencia con datos reales o bloqueo parcial.
- Hallazgos P1/P2/P3.
