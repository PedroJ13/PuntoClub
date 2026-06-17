# TASK-272 - API de renovacion y transacciones de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Round: 17
Depende de: TASK-271
Estado: Assigned

## Objetivo

Implementar API para registrar transacciones de membresia nueva y renovar membresias.

## Contexto

Actualmente una membresia puede activarse para un cliente, pero el flujo economico queda incompleto. Esta tarea conecta activacion/renovacion con `MembershipTransactions`.

## Alcance

1. Revisar handoff de TASK-271.
2. Ajustar activacion de membresia para registrar transaccion `new_membership`.
3. Implementar renovacion de membresia:
   - `POST /api/customers/{customerId}/memberships/{customerMembershipId}/renew`
4. Implementar consulta de transacciones:
   - `GET /api/customers/{customerId}/membership-transactions?from=YYYY-MM-DD&to=YYYY-MM-DD`
5. Publicar API en Azure Functions.

## Reglas MVP

- Si la membresia esta activa y se renueva antes de vencer, la nueva vigencia se extiende desde `endDate`.
- Si esta vencida, la nueva vigencia inicia desde hoy.
- Una renovacion registra `MembershipTransactions.transaction_type = renewal`.
- Activacion nueva registra `transaction_type = new_membership`.
- Metodo de pago requerido: `cash`, `card`, `credit`, `transfer` u `other`.
- Monto requerido, mayor o igual a 0.
- No permitir renovar membresia cancelada en esta tarea.

## Validaciones minimas

- Pruebas automatizadas pasan.
- Endpoints protegidos sin sesion.
- Activacion registra transaccion nueva.
- Renovacion registra transaccion y actualiza vigencia.
- Consulta de transacciones filtra por empresa y cliente.

## Fuera de alcance

- Facturacion fiscal.
- Cobros reales.
- Pasarelas de pago.
- Correos de renovacion.

## Handoff esperado

Actualizar `tasks/TASK-272-HANDOFF.md` con:

- Resultado.
- Endpoints implementados/publicados.
- Reglas aplicadas.
- Evidencia de pruebas.
- Evidencia publicada.
