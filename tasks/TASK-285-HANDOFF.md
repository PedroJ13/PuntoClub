# TASK-285 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Estado: Completed
Fecha: 2026-06-15

## Resultado

La ficha `Atender cliente` puede implementarse con endpoints existentes.

No se implemento endpoint agregado.
No se cambio API.
No se cambio SQL.

## Endpoints actuales relevantes

Clientes y puntos:

- `GET /api/companies/{companyId}/customers?search=...`
- `POST /api/companies/{companyId}/customers`
- `GET /api/companies/{companyId}/customers/{customerId}/balance`
- `GET /api/companies/{companyId}/customers/{customerId}/activity`
- `POST /api/companies/{companyId}/purchases`
- `POST /api/companies/{companyId}/redemptions`

Membresias:

- `GET /api/membership-plans`
- `GET /api/membership-plans/{planId}/benefits`
- `POST /api/customers/{customerId}/memberships`
- `POST /api/customers/{customerId}/memberships/{customerMembershipId}/renew`
- `GET /api/customers/{customerId}/memberships`
- `GET /api/customers/{customerId}/membership-benefit-usages`
- `POST /api/customers/{customerId}/membership-benefit-usages`
- `GET /api/customers/{customerId}/membership-transactions`
- `GET /api/memberships/expiration-alerts`

Empresa/configuracion:

- `GET /api/companies/{companyId}/settings`
- `PATCH /api/companies/{companyId}/settings`
- `GET /api/me`

## Decision

Usar endpoints existentes para TASK-287.

Motivo:

- La pantalla puede buscar/crear cliente con los endpoints actuales.
- Despues de seleccionar cliente, Web puede componer la ficha con:
  - balance;
  - actividad;
  - membresias;
  - beneficios del plan;
  - usos recientes;
  - transacciones.
- Las acciones operativas ya tienen endpoints:
  - compra;
  - redencion;
  - activacion;
  - renovacion;
  - uso de beneficio.

## Contrato agregado opcional

No requerido para TASK-287.

Si luego se busca optimizar latencia, contrato sugerido:

```http
GET /api/customers/{customerId}/profile
```

Respuesta sugerida:

```json
{
  "customer": {},
  "balance": {},
  "activity": { "items": [] },
  "memberships": { "items": [] },
  "activeOrRenewableMembership": {},
  "benefits": { "items": [] },
  "benefitUsages": { "items": [] },
  "membershipTransactions": { "items": [] },
  "alerts": []
}
```

## Riesgos de performance/latencia

- Ficha unificada con endpoints actuales implica varias llamadas al seleccionar cliente.
- Para MVP Web puede ejecutar llamadas en paralelo y renderizar estados de carga por seccion.
- Si empresas con mucho volumen usan caja intensivamente, conviene crear el endpoint agregado posterior para reducir round trips.

## Recomendacion para Web Dev

- Implementar TASK-287 componiendo con endpoints existentes.
- Usar llamadas paralelas al seleccionar cliente:
  - `getCustomerBalance`
  - `getCustomerActivity`
  - `listCustomerMemberships`
  - `listMembershipTransactions`
  - `listMembershipBenefitUsages`
  - `listMembershipBenefits` solo si hay membresia activa/renovable con plan.
- No bloquear la ficha completa si una seccion secundaria falla; mostrar error inline en esa seccion.
