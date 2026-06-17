# TASK-247 - Handoff Backend/API

Equipo: Backend/API

Modo de ejecucion: Backend/API

## Resultado

Completado.

Se implementaron endpoints de configuracion de planes y beneficios de membresias, acotados a la empresa de la sesion autenticada.

## Archivos modificados

- `api/src/functions/memberships.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/repository-formatters.test.js`
- `api/test/validators.test.js`

## Endpoints implementados

- `GET /api/membership-plans?status=active|inactive|all`
- `POST /api/membership-plans`
- `PATCH /api/membership-plans/{planId}`
- `POST /api/membership-plans/{planId}/activate`
- `POST /api/membership-plans/{planId}/deactivate`
- `GET /api/membership-plans/{planId}/benefits?status=active|inactive|all`
- `POST /api/membership-plans/{planId}/benefits`
- `PATCH /api/membership-benefits/{benefitId}`

## Seguridad y reglas aplicadas

- La empresa se resuelve desde `requireSessionIdentity`; no se acepta `companyId` desde el cliente.
- Crear/editar/activar/desactivar requiere rol `owner` o `admin`.
- Lectura requiere sesion valida.
- Planes y beneficios se validan por pertenencia a la empresa antes de operar.
- IDs se serializan como string en las respuestas.
- Validacion server-side para:
  - estados `active|inactive`;
  - filtros `active|inactive|all`;
  - tipos de beneficio `informational|discount|allowance|free_item`;
  - alcances `product|service|category|text`;
  - periodos `none|day|week|month|membership_term`;
  - requisitos de descuento, cantidad, limite y periodo segun tipo de beneficio.

## Auditoria

Se agrego auditoria best-effort para:

- `membership.plan.created`
- `membership.plan.updated`
- `membership.benefit.created`
- `membership.benefit.updated`

Incluye `actorLabel`, `companyId`, entidad, id y metadata minima de cambios.

## Contrato adicional expuesto

`GET /api/companies/{companyId}/settings` y respuestas internas de `mapMyCompany` ahora incluyen:

- `loyaltyPointsEnabled`
- `loyaltyMembershipsEnabled`

Esto habilita a Web Dev a mostrar/ocultar la configuracion de membresias segun flag de empresa.

## Validacion ejecutada

- `node --check api/src/functions/memberships.js`: OK.
- `node --check api/src/lib/repository.js`: OK.
- `node --check api/src/lib/validators.js`: OK.
- `npm test` dentro del sandbox: fallo por `spawn EPERM`.
- `npm test` fuera del sandbox con aprobacion: OK, 107 tests pasan.

## Pendientes o riesgos

- No se probo contra Azure SQL porque TASK-246 no aplico la migracion en Azure.
- Los endpoints dependen de que exista la migracion `database/migrations/20260613_memberships_mvp.sql`.
- La asignacion cubre solo configuracion de planes/beneficios; activacion de membresias de clientes y uso de beneficios queda fuera de esta tarea.
