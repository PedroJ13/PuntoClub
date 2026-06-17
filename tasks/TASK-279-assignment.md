# TASK-279 - QA E2E real de membresias

Equipo: QA
Round: 22
Depende de: TASK-278
Estado: Assigned

## Objetivo

Validar con sesion real o evidencia segura el flujo completo de membresias publicado en Azure.

## Contexto

Las validaciones tecnicas ya confirmaron publicacion, proteccion y markers. Falta validar el comportamiento real con empresa autenticada y datos reales/controlados.

## Alcance

1. Leer handoff de TASK-278.
2. Validar flujo completo:
   - login de empresa;
   - configuracion de plan y beneficios;
   - buscar o registrar cliente;
   - activar membresia con metodo de pago y monto;
   - ver membresia activa;
   - registrar uso de beneficio;
   - ver historial de usos;
   - renovar membresia;
   - ver transacciones;
   - ver alertas de vencimiento;
   - ver reportes/auditoria;
   - exportar CSV financiero.
3. Validar que no se mezclan datos de otra empresa si hay forma segura de comprobarlo.
4. Registrar hallazgos por prioridad.

## Validaciones minimas

- Flujo E2E positivo completo o bloqueo documentado.
- No hay P0/P1 abiertos.
- Errores de negocio son claros.
- CSV descarga y contiene columnas esperadas.
- Reportes muestran eventos/montos esperados.

## Handoff esperado

Actualizar `tasks/TASK-279-HANDOFF.md` con:

- Resultado: aprobado, aprobado con observaciones o no aprobado.
- Evidencia paso a paso.
- Datos usados.
- Hallazgos P1/P2/P3.
- Recomendacion final para piloto operativo de membresias.
