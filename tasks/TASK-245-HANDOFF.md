# TASK-245 - Handoff Backend/API

Equipo: Backend/API

Modo de ejecucion: Backend/API

## Resultado

Completado.

Se definen contratos API MVP para membresias. No se implementaron endpoints ni se modifico codigo.

## Convenciones

- Base: `/api`
- Auth: sesion de empresa autenticada por cookie server-side.
- La empresa efectiva sale de la sesion (`CompanySessions` + `CompanyUsers`), no de `companyId` enviado por frontend.
- IDs SQL `bigint` se serializan como string.
- Fechas operativas: `YYYY-MM-DD`.
- Timestamps: UTC ISO.
- No se incluye email automatico de vencimiento en MVP.
- No devolver tokens, cookies, password hashes, SAS ni blob paths internos.

## Endpoints propuestos

### GET `/api/membership-plans?status=active|inactive|all`

Lista planes de membresia de la empresa autenticada.

Respuesta `200`:

```json
{
  "status": "active",
  "items": [
    {
      "id": "10",
      "name": "Membresia mensual",
      "description": "Beneficios mensuales",
      "durationDays": 30,
      "price": 12000,
      "renewalNoticeDays": 5,
      "status": "active",
      "benefitCount": 3,
      "createdAt": "2026-06-13T12:00:00Z",
      "updatedAt": "2026-06-13T12:00:00Z"
    }
  ]
}
```

### POST `/api/membership-plans`

Crea plan.

Auth:

- Requiere rol `owner` o `admin`.

Payload:

```json
{
  "name": "Membresia mensual",
  "description": "Beneficios mensuales",
  "durationDays": 30,
  "price": 12000,
  "renewalNoticeDays": 5
}
```

Respuesta `201`: plan creado.

Validaciones:

- `name` requerido, maximo 160.
- `description` opcional, maximo 500.
- `durationDays > 0`.
- `price >= 0`.
- `renewalNoticeDays >= 0`.

### PATCH `/api/membership-plans/{planId}`

Edita plan.

Auth:

- Requiere rol `owner` o `admin`.

Payload parcial:

```json
{
  "name": "Membresia mensual",
  "durationDays": 30,
  "price": 12000,
  "renewalNoticeDays": 5,
  "status": "active"
}
```

Reglas:

- `planId` debe pertenecer a la empresa de sesion.
- `status`: `active` o `inactive`.
- No borra beneficios existentes.

### POST `/api/membership-plans/{planId}/activate`

Activa un plan inactivo.

Respuesta `200`:

```json
{
  "id": "10",
  "status": "active",
  "updatedAt": "2026-06-13T12:05:00Z"
}
```

### POST `/api/membership-plans/{planId}/deactivate`

Inactiva un plan.

Regla:

- Inactivar plan impide nuevas activaciones, pero no cancela membresias de clientes ya activadas.

### GET `/api/membership-plans/{planId}/benefits?status=active|inactive|all`

Lista beneficios de un plan.

Respuesta `200`:

```json
{
  "planId": "10",
  "items": [
    {
      "id": "101",
      "name": "1 cafe americano gratis por dia",
      "description": "Valido una vez por dia",
      "benefitType": "free_item",
      "appliesToType": "product",
      "appliesToName": "Cafe americano",
      "discountPercent": null,
      "includedQuantity": 1,
      "usageLimit": 1,
      "usagePeriod": "day",
      "status": "active"
    }
  ]
}
```

### POST `/api/membership-plans/{planId}/benefits`

Crea beneficio.

Auth:

- Requiere rol `owner` o `admin`.

Payload descuento ilimitado:

```json
{
  "name": "15% descuento en pasteles",
  "description": "Aplica a categoria Pasteles",
  "benefitType": "discount",
  "appliesToType": "category",
  "appliesToName": "Pasteles",
  "discountPercent": 15,
  "usagePeriod": "none"
}
```

Payload cafe diario:

```json
{
  "name": "1 cafe americano gratis por dia",
  "benefitType": "free_item",
  "appliesToType": "product",
  "appliesToName": "Cafe americano",
  "includedQuantity": 1,
  "usageLimit": 1,
  "usagePeriod": "day"
}
```

Validaciones:

- `benefitType`: `informational`, `discount`, `allowance`, `free_item`.
- `appliesToType`: `product`, `service`, `category`, `text`.
- `usagePeriod`: `none`, `day`, `week`, `month`, `membership_term`.
- `discountPercent` requerido para `discount`, entre 0 y 100.
- `includedQuantity`, `usageLimit` positivos para `allowance` y `free_item` controlables.
- `planId` debe existir y pertenecer a empresa de sesion.

### PATCH `/api/membership-benefits/{benefitId}`

Edita beneficio.

Auth:

- Requiere rol `owner` o `admin`.

Payload parcial:

```json
{
  "name": "1 cafe americano gratis por dia",
  "usageLimit": 1,
  "status": "active"
}
```

Regla:

- Cambios aplican hacia adelante. Los usos historicos no se recalculan.

### POST `/api/customers/{customerId}/memberships`

Activa membresia para cliente.

Auth:

- Requiere usuario autenticado de empresa.

Payload:

```json
{
  "planId": "10",
  "startDate": "2026-06-13",
  "pricePaid": 12000
}
```

Respuesta `201`:

```json
{
  "id": "500",
  "customerId": "80",
  "plan": {
    "id": "10",
    "name": "Membresia mensual"
  },
  "startDate": "2026-06-13",
  "endDate": "2026-07-12",
  "status": "active",
  "pricePaid": 12000,
  "renewalNoticeDays": 5,
  "expirationAlert": {
    "state": "none",
    "daysUntilExpiration": 29,
    "message": null
  },
  "createdAt": "2026-06-13T12:10:00Z"
}
```

Reglas:

- `customerId` debe pertenecer a empresa de sesion.
- `planId` debe pertenecer a empresa de sesion y estar `active`.
- `endDate` lo calcula Backend con `durationDays`.
- MVP: rechazar si el cliente ya tiene membresia `active`.

### GET `/api/customers/{customerId}/memberships?status=active|expired|cancelled|all`

Consulta membresias del cliente.

Respuesta `200`:

```json
{
  "customerId": "80",
  "items": [
    {
      "id": "500",
      "planId": "10",
      "planName": "Membresia mensual",
      "startDate": "2026-06-13",
      "endDate": "2026-07-12",
      "status": "active",
      "expirationAlert": {
        "state": "none",
        "daysUntilExpiration": 29,
        "message": null
      }
    }
  ]
}
```

Estados de `expirationAlert.state`:

- `none`
- `expires_today`
- `expiring_soon`
- `expired`

### GET `/api/customers/{customerId}/membership-benefits?date=YYYY-MM-DD`

Consulta beneficios disponibles/usados del cliente para una fecha operativa.

Respuesta `200`:

```json
{
  "customerId": "80",
  "date": "2026-06-13",
  "memberships": [
    {
      "id": "500",
      "planName": "Membresia mensual",
      "status": "active",
      "startDate": "2026-06-13",
      "endDate": "2026-07-12",
      "benefits": [
        {
          "id": "101",
          "name": "1 cafe americano gratis por dia",
          "benefitType": "free_item",
          "appliesToType": "product",
          "appliesToName": "Cafe americano",
          "usagePeriod": "day",
          "usageLimit": 1,
          "usedQuantity": 0,
          "remainingQuantity": 1,
          "availability": "available",
          "message": "Disponible para usar."
        },
        {
          "id": "102",
          "name": "15% descuento en pasteles",
          "benefitType": "discount",
          "discountPercent": 15,
          "usagePeriod": "none",
          "availability": "available",
          "message": "Disponible mientras la membresia este activa."
        }
      ]
    }
  ]
}
```

`availability`:

- `available`
- `used`
- `informational`
- `membership_expired`
- `membership_cancelled`
- `benefit_inactive`

### POST `/api/customers/{customerId}/membership-benefit-usages`

Registra uso de beneficio controlable.

Auth:

- Requiere usuario autenticado de empresa.

Payload:

```json
{
  "customerMembershipId": "500",
  "benefitId": "101",
  "usageDate": "2026-06-13",
  "quantity": 1,
  "note": "Cafe entregado en caja"
}
```

Respuesta `201`:

```json
{
  "id": "900",
  "customerId": "80",
  "customerMembershipId": "500",
  "benefitId": "101",
  "usageDate": "2026-06-13",
  "usagePeriod": "day",
  "quantity": 1,
  "usedQuantity": 1,
  "remainingQuantity": 0,
  "availability": "used",
  "message": "Ya usado en este periodo.",
  "usedAt": "2026-06-13T12:20:00Z"
}
```

Reglas transaccionales:

1. Resolver empresa desde sesion.
2. Validar cliente de esa empresa.
3. Validar membresia del cliente y empresa.
4. Validar membresia `active` y dentro de rango de fechas.
5. Validar beneficio activo, controlable y del plan.
6. Calcular `usagePeriodStartDate`.
7. Contar usos existentes del periodo.
8. Rechazar si excede limite.
9. Insertar uso.
10. Auditar `membership.benefit.used` best-effort.

### GET `/api/memberships/expiration-alerts?withinDays=5&status=active`

Lista alertas internas de vencimiento para la empresa autenticada.

Respuesta `200`:

```json
{
  "withinDays": 5,
  "items": [
    {
      "customerId": "80",
      "customerName": "Maria Soto",
      "customerPhone": "+50688887777",
      "customerMembershipId": "500",
      "planName": "Membresia mensual",
      "endDate": "2026-06-18",
      "daysUntilExpiration": 5,
      "state": "expiring_soon",
      "message": "La membresia vence en 5 dias."
    }
  ]
}
```

Reglas:

- No envia correos.
- `withinDays` default puede salir de `renewalNoticeDays`; query permite filtrar vista operativa.

## Validaciones y errores

Errores nuevos sugeridos:

| HTTP | Code | Uso |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Payload o query invalido. |
| 401 | `UNAUTHORIZED` | Sin sesion valida. |
| 403 | `FORBIDDEN` | Rol insuficiente. |
| 404 | `MEMBERSHIP_PLAN_NOT_FOUND` | Plan no existe en la empresa. |
| 404 | `MEMBERSHIP_BENEFIT_NOT_FOUND` | Beneficio no existe en la empresa. |
| 404 | `CUSTOMER_MEMBERSHIP_NOT_FOUND` | Membresia del cliente no existe en la empresa. |
| 409 | `MEMBERSHIP_PLAN_INACTIVE` | Plan inactivo para activacion. |
| 409 | `CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP` | MVP de una membresia activa por cliente. |
| 409 | `CUSTOMER_MEMBERSHIP_EXPIRED` | Membresia vencida. |
| 409 | `CUSTOMER_MEMBERSHIP_CANCELLED` | Membresia cancelada. |
| 409 | `MEMBERSHIP_BENEFIT_INACTIVE` | Beneficio inactivo. |
| 409 | `MEMBERSHIP_BENEFIT_NOT_CONTROLLABLE` | Beneficio informativo o descuento no controlable. |
| 409 | `MEMBERSHIP_BENEFIT_ALREADY_USED` | Limite del periodo ya consumido. |
| 409 | `MEMBERSHIP_BENEFIT_LIMIT_EXCEEDED` | Cantidad excede restante. |

Ejemplo de error beneficio ya usado:

```json
{
  "error": {
    "code": "MEMBERSHIP_BENEFIT_ALREADY_USED",
    "message": "Benefit has already been used for this period.",
    "details": [
      {
        "field": "benefitId",
        "message": "Ya usado en este periodo."
      }
    ]
  }
}
```

## Reglas de seguridad por sesion/empresa

- Ningun endpoint acepta `companyId` editable como autoridad.
- Todos los queries filtran por `company_id` derivado de sesion.
- `customerId`, `planId`, `benefitId`, `customerMembershipId` deben pertenecer a la empresa de sesion.
- Roles:
  - `owner/admin`: crear/editar planes y beneficios.
  - `owner/admin/staff`: activar membresia y registrar usos, salvo que Product decida limitar activacion.
- No se exponen datos de otras empresas.
- No se loggean datos sensibles.

## Dependencias SQL/Data

Requiere migracion no aplicada de TASK-244:

- `MembershipPlans`
- `MembershipBenefits`
- `CustomerMemberships`
- `MembershipBenefitUsages`

Requiere decision/migracion para habilitacion de tipos de fidelizacion:

- columnas simples en `Companies`; o
- `CompanyLoyaltyFeatures`.

Requiere extender auditoria si se quieren persistir eventos:

- `membership.plan.created`
- `membership.plan.updated`
- `membership.benefit.created`
- `membership.benefit.updated`
- `customer.membership.activated`
- `customer.membership.cancelled`
- `membership.benefit.used`

## Riesgos o pendientes para Web Dev/QA

- Web debe ocultar `Membresias` si la empresa no tiene membresias habilitadas.
- Web debe mostrar disponibilidad calculada por API, no recalcular reglas complejas en frontend.
- QA necesita fixtures:
  - plan mensual activo;
  - beneficio descuento ilimitado;
  - beneficio cafe diario disponible;
  - beneficio cafe diario ya usado;
  - membresia vencida;
  - plan inactivo;
  - beneficio inactivo.
- Pendiente Product: renovacion antes de vencer.
- Pendiente Product/API: si descuentos ilimitados se auditan como usos o solo se muestran.
- No implementar email automatico de vencimiento en MVP.
