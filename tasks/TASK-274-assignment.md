# TASK-274 - QA renovacion y transacciones de membresias

Equipo: QA
Round: 18
Depende de: TASK-271, TASK-272, TASK-273
Estado: Assigned

## Objetivo

Validar en Azure que el flujo de renovacion y transacciones de membresias esta publicado, protegido y sin regresiones.

## Alcance

1. Leer handoffs de TASK-271, TASK-272 y TASK-273.
2. Validar API publicada:
   - activacion registra transaccion nueva si hay sesion/datos;
   - renovacion existe y esta protegida;
   - consulta de transacciones existe y esta protegida.
3. Validar Web publicada:
   - accion de renovar;
   - metodo de pago;
   - monto;
   - historial de transacciones.
4. Validar sin regresion visible:
   - Operaciones;
   - Membresias;
   - Mi empresa;
   - Reportes;
   - Login.

## Validaciones minimas

- Endpoints nuevos no responden 404.
- Sin sesion responden 401.
- Web contiene markers/textos publicados.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.
- Si hay sesion real o evidencia segura, validar renovacion positiva.

## Handoff esperado

Actualizar `tasks/TASK-274-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia API.
- Evidencia Web.
- Evidencia con datos reales o bloqueo parcial.
- Hallazgos P1/P2/P3.
