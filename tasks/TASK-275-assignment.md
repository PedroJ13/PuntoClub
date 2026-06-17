# TASK-275 - API reporte diario financiero de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 19
Depende de: TASK-271, TASK-272, TASK-274
Estado: Assigned

## Objetivo

Implementar reporte diario de membresias basado en `MembershipTransactions`.

## Contexto

Ya existe soporte para transacciones economicas de membresias: activacion registra `new_membership` y renovacion registra `renewal`. Ahora Reportes debe poder resumir la actividad economica diaria.

## Alcance

1. Revisar handoffs de TASK-271, TASK-272 y TASK-274.
2. Implementar endpoint o extender reporte existente para resumen financiero de membresias.
3. Incluir resumen por rango de fechas:
   - membresias nuevas;
   - monto de membresias nuevas;
   - renovaciones;
   - monto de renovaciones;
   - monto por metodo de pago.
4. Incluir detalle:
   - fecha/hora;
   - cliente;
   - plan;
   - tipo de transaccion;
   - metodo de pago;
   - monto;
   - nota si existe.
5. Publicar API en Azure Functions.

## Reglas MVP

- El reporte debe filtrar por empresa activa de la sesion.
- `type=new_membership` y `type=renewal` deben estar claramente separados.
- `amount=0` debe contar como transaccion valida, con monto 0.
- No incluir pagos reales/pasarelas.

## Validaciones minimas

- Pruebas automatizadas pasan.
- Endpoint protegido sin sesion.
- Reporte devuelve resumen y detalle.
- CSV/export futuro puede consumir los mismos campos.
- No mezcla datos entre empresas.

## Handoff esperado

Actualizar `tasks/TASK-275-HANDOFF.md` con:

- Resultado.
- Endpoint final.
- Campos devueltos.
- Evidencia de pruebas.
- Evidencia publicada.
