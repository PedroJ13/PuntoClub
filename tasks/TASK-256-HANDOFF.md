# TASK-256 - Handoff Backend/API

Equipo: Backend/API

Modo de ejecucion: Backend/API

## Resultado

Completado.

Se implemento API para activar y consultar membresias de un cliente usando la empresa de la sesion como autoridad.

No se ejecuto deploy publicado en esta tarea.

## Endpoints implementados

- `POST /api/customers/{customerId}/memberships`
- `GET /api/customers/{customerId}/memberships?status=active|expired|cancelled|all`
- `GET /api/memberships/expiration-alerts?withinDays=5&status=active`

## Validaciones/errores

- `customerId` debe pertenecer a la empresa autenticada.
- `planId` debe pertenecer a la empresa autenticada.
- El plan debe estar `active`; si no, responde `409 MEMBERSHIP_PLAN_INACTIVE`.
- `startDate` debe ser fecha calendario valida `YYYY-MM-DD`.
- `pricePaid` es opcional; si se omite, se usa el precio del plan. Si se envia, debe ser `>= 0`.
- Se rechazan campos controlados por backend: `companyId`, `customerId`, `endDate`, `status`.
- MVP rechaza una segunda membresia activa del cliente con `409 CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP`.
- La proteccion SQL del indice `UX_CustomerMemberships_one_active_per_customer` tambien se mapea a `409 CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP`.

## Calculos

- `endDate` se calcula en backend con termino inclusivo: `startDate + durationDays - 1`.
- Cada membresia devuelve `expirationAlert`:
  - `none`;
  - `expires_today`;
  - `expiring_soon`;
  - `expired`.

## Auditoria

- Se registra best-effort `customer.membership.activated` con entidad `customer_membership`.
- No se exponen secretos, cookies, tokens, hashes ni connection strings.

## Tests ejecutados

- `node --check api/src/functions/memberships.js`: OK.
- `node --check api/src/lib/repository.js`: OK.
- `node --check api/src/lib/validators.js`: OK.
- `node --check api/src/lib/errors.js`: OK.
- `npm test` en `api`: OK.
  - tests: 114
  - pass: 114
  - fail: 0

Nota: `npm test` fallo dentro del sandbox por `spawn EPERM`; se reejecuto fuera del sandbox con aprobacion y paso correctamente.

## Riesgos o pendientes para Web Dev/QA

- No se implemento registro de usos de beneficios.
- No se implemento envio de correos de vencimiento.
- Falta validacion positiva publicada con sesion real o evidencia PO redaccionada.
- Web debe mostrar error controlado para `CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP`.
- QA debe validar que la empresa de sesion aisla clientes, planes y membresias entre empresas.
