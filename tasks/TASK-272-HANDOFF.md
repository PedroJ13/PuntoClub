# TASK-272 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Estado: Completed
Fecha: 2026-06-14

## Resultado

Se implemento API para registrar transacciones economicas en activacion de membresia, renovar membresias y consultar transacciones por cliente.

## Endpoints implementados/publicados

- Ajustado: `POST /api/customers/{customerId}/memberships`
  - Ahora requiere metodo de pago y monto.
  - Registra `MembershipTransactions.transaction_type = new_membership`.
- Nuevo: `POST /api/customers/{customerId}/memberships/{customerMembershipId}/renew`
  - Registra renovacion y actualiza vigencia.
  - Registra `MembershipTransactions.transaction_type = renewal`.
- Nuevo: `GET /api/customers/{customerId}/membership-transactions?from=YYYY-MM-DD&to=YYYY-MM-DD`
  - Lista transacciones filtradas por empresa de sesion, cliente y rango.

## Reglas aplicadas

- `paymentMethod` requerido: `cash`, `card`, `credit`, `transfer`, `other`.
- `amount` requerido, mayor o igual a `0`.
- Activacion acepta `amount` o `pricePaid` como monto economico para mantener compatibilidad con el nombre historico.
- Si la membresia esta activa y aun no vence, la renovacion extiende desde el `endDate` actual.
- Si la membresia esta vencida o con fecha de vencimiento pasada, la renovacion inicia desde la fecha de transaccion.
- No se permite renovar membresias canceladas.
- Todas las consultas/escrituras usan `company_id` de la sesion server-side.

## Evidencia de pruebas

- `node --check api/src/lib/validators.js`: OK
- `node --check api/src/lib/repository.js`: OK
- `node --check api/src/functions/memberships.js`: OK
- `npm test`: OK, 121 passing, 0 failing
- Se agregaron pruebas para:
  - payload de renovacion;
  - query de transacciones;
  - formateo de `MembershipTransactions`.

## Evidencia publicada

- API publicada en Azure Functions: `func-puntoclub-prod-br-001`
- URL base: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Validaciones publicadas sin sesion real:
  - `GET /api/customers/1/membership-transactions?from=2026-06-01&to=2026-06-14` con cookie sintetica invalida -> `401`
  - `POST /api/customers/1/memberships/1/renew` sin sesion -> `401`
  - `POST /api/customers/1/memberships` con cookie sintetica invalida -> `401`

## Notas para QA

- No se ejecuto activacion/renovacion positiva con sesion real porque no se usaron credenciales ni cookie real.
- QA debe validar con empresa activa:
  - activacion crea transaccion `new_membership`;
  - renovacion crea transaccion `renewal`;
  - consulta de transacciones devuelve solo datos de la empresa/cliente autenticado.
