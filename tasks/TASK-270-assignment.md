# TASK-270 - QA alertas internas de vencimiento de membresias

Equipo: QA
Round: 16
Depende de: TASK-268, TASK-269
Estado: Assigned

## Objetivo

Validar en Azure que las alertas internas de vencimiento de membresias estan publicadas y protegidas.

## Alcance

1. Leer handoffs de TASK-268 y TASK-269.
2. Validar API publicada de alertas de vencimiento.
3. Validar que sin sesion o con cookie invalida el endpoint este protegido.
4. Validar Web publicada:
   - seccion de proximas a vencer;
   - seccion de vencidas;
   - textos claros;
   - sin regresion visible.
5. Si hay sesion real o evidencia segura, validar con datos:
   - membresia proxima a vencer;
   - membresia vencida.

## Validaciones minimas

- API publicada no responde 404 para alertas.
- Web publicada contiene markers/textos de vencimiento.
- No hay `window.confirm`, `localStorage` ni `sessionStorage`.
- No hay regresion en Operaciones, Mi empresa, Reportes ni Login.

## Handoff esperado

Actualizar `tasks/TASK-270-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia API.
- Evidencia Web.
- Evidencia con datos reales o bloqueo parcial.
- Hallazgos P1/P2/P3.
