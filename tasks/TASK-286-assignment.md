# TASK-286 - Revision SQL/Data para Atender cliente

Equipo: Ejecucion Tecnica
Modo de ejecucion: SQL/Data
Round: 28
Depende de: TASK-284
Estado: Assigned

## Objetivo

Confirmar que el modelo SQL actual soporta el flujo `Atender cliente` sin migraciones nuevas, o identificar indices/consultas necesarias.

## Contexto

La pantalla unificada consultara informacion de clientes, puntos, membresias, beneficios, usos, transacciones y alertas. Antes del ajuste Web, SQL/Data debe revisar si el modelo e indices actuales son suficientes para una ficha operativa rapida.

## Alcance

1. Leer:
   - `tasks/TASK-284-HANDOFF.md`
   - `docs/NEXT_PHASE_CUSTOMER_FIRST_FLOW.md`
   - `docs/NEXT_PHASE_MEMBERSHIPS.md`
2. Revisar tablas relevantes:
   - `Customers`
   - compras/redenciones/puntos existentes;
   - `CustomerMemberships`
   - `MembershipPlans`
   - `MembershipBenefits`
   - `MembershipBenefitUsages`
   - `MembershipTransactions`
   - auditoria/reportes si aplica.
3. Confirmar si existen indices adecuados por:
   - `company_id`;
   - `customer_id`;
   - fechas operativas;
   - estado de membresia.
4. Recomendar consultas base para ficha de cliente.
5. Si hace falta migracion/indice, documentarlo y proponer tarea posterior; no aplicar cambios salvo instruccion explicita.

## Fuera de alcance

- No aplicar migraciones en esta tarea salvo aprobacion explicita.
- No modificar datos.
- No implementar API.

## Handoff esperado

Actualizar `tasks/TASK-286-HANDOFF.md` con:

- Estado del modelo.
- Indices existentes suficientes o faltantes.
- Consultas recomendadas.
- Riesgos de performance.
- Si requiere tarea SQL posterior.
