# API Contracts

## Estado

Propuesta inicial Backend/API para MVP. No implementa endpoints.

## Convenciones

- Base API sugerida: `/api`.
- Todas las rutas MVP reciben `companyId` en path para mantener aislamiento por empresa.
- Fechas en payload: `YYYY-MM-DD`.
- Montos: decimal con 2 posiciones.
- Puntos: enteros positivos.
- Timestamps de respuesta: UTC.
- Auth fase 1 pendiente de decision; hasta definirla, ningun contrato debe confiar en datos de empresa enviados por frontend sin validacion server-side.
- `pointsEarned` se calcula server-side como `ROUND(amount * pointsPercentage / 100, 0)` a entero para montos positivos.

## Formato de error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "amount",
        "message": "Amount must be greater than 0."
      }
    ]
  }
}
```

## Errores comunes

| HTTP | Code | Uso |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Payload invalido, tipos incorrectos, monto/puntos no positivos. |
| 404 | `COMPANY_NOT_FOUND` | Empresa no existe o no esta disponible para operar. |
| 404 | `CUSTOMER_NOT_FOUND` | Cliente no existe dentro de la empresa. |
| 409 | `DUPLICATE_INVOICE` | `invoiceNumber` ya existe dentro de la empresa. |
| 409 | `DUPLICATE_CUSTOMER` | Telefono o email ya existe dentro de la empresa. |
| 409 | `INSUFFICIENT_POINTS` | Redencion mayor al saldo disponible. |
| 500 | `INTERNAL_ERROR` | Error no esperado. No debe exponer detalles SQL. |

## Company settings

### GET `/api/companies/{companyId}/settings`

Devuelve configuracion operativa de la empresa.

Respuesta `200`:

```json
{
  "id": 1,
  "name": "Cafe Central",
  "email": "hola@cafecentral.test",
  "phone": "+50622223333",
  "logoUrl": "https://example.com/logo.png",
  "pointsPercentage": 5.00,
  "status": "active",
  "updatedAt": "2026-06-02T15:20:00Z"
}
```

Errores esperados:

- `404 COMPANY_NOT_FOUND` si la empresa no existe.
- `404 COMPANY_NOT_FOUND` si la empresa no existe o no esta disponible para operar.

### PATCH `/api/companies/{companyId}/settings`

Actualiza campos editables de configuracion.

Payload:

```json
{
  "name": "Cafe Central",
  "email": "hola@cafecentral.test",
  "phone": "+50622223333",
  "logoUrl": "https://example.com/logo.png",
  "pointsPercentage": 5.00
}
```

Respuesta `200`: mismo formato de `GET`.

Validaciones:

- `name` requerido si se envia, maximo 160 caracteres.
- `email` opcional, formato email, maximo 254 caracteres.
- `phone` opcional, maximo 32 caracteres.
- `logoUrl` opcional, URL valida, maximo 2048 caracteres.
- `pointsPercentage` mayor que 0 y menor o igual que 100.

## Customers

### GET `/api/companies/{companyId}/customers?search={text}`

Lista clientes de una empresa. `search` puede buscar por nombre, telefono o email.

Respuesta `200`:

```json
{
  "items": [
    {
      "id": 10,
      "name": "Maria Soto",
      "phone": "+50688887777",
      "email": "maria@example.com",
      "createdAt": "2026-06-02T15:20:00Z",
      "updatedAt": "2026-06-02T15:20:00Z"
    }
  ]
}
```

### POST `/api/companies/{companyId}/customers`

Crea cliente dentro de una empresa.

Payload:

```json
{
  "name": "Maria Soto",
  "phone": "+50688887777",
  "email": "maria@example.com"
}
```

Respuesta `201`:

```json
{
  "id": 10,
  "name": "Maria Soto",
  "phone": "+50688887777",
  "email": "maria@example.com",
  "createdAt": "2026-06-02T15:20:00Z",
  "updatedAt": "2026-06-02T15:20:00Z"
}
```

Validaciones:

- `name` requerido, maximo 160 caracteres.
- `phone` requerido, maximo 32 caracteres, unico por empresa.
- `email` opcional, formato email, maximo 254 caracteres, unico por empresa cuando existe.

Errores esperados:

- `404 COMPANY_NOT_FOUND`.
- `400 VALIDATION_ERROR`.
- `409 DUPLICATE_CUSTOMER`.

## Purchases

### POST `/api/companies/{companyId}/purchases`

Registra compra y calcula puntos ganados.

Payload:

```json
{
  "customerId": 10,
  "invoiceNumber": "FAC-1001",
  "purchaseDate": "2026-06-02",
  "amount": 25000.00
}
```

Respuesta `201`:

```json
{
  "id": 50,
  "customerId": 10,
  "invoiceNumber": "FAC-1001",
  "purchaseDate": "2026-06-02",
  "amount": 25000.00,
  "pointsEarned": 1250,
  "createdAt": "2026-06-02T15:20:00Z"
}
```

Validaciones:

- `customerId` requerido y debe pertenecer a `companyId`.
- `invoiceNumber` requerido, maximo 80 caracteres, unico por empresa.
- `purchaseDate` requerido.
- `amount` requerido, mayor que 0.
- `pointsEarned` lo calcula API con `amount` y `Companies.points_percentage`; frontend no lo envia.
- Redondeo: `ROUND(amount * pointsPercentage / 100, 0)` a entero.

Errores esperados:

- `404 COMPANY_NOT_FOUND`.
- `404 CUSTOMER_NOT_FOUND`.
- `400 VALIDATION_ERROR`.
- `409 DUPLICATE_INVOICE`.

## Redemptions

### POST `/api/companies/{companyId}/redemptions`

Registra redencion de puntos.

Payload:

```json
{
  "customerId": 10,
  "redemptionDate": "2026-06-02",
  "pointsRedeemed": 500,
  "note": "Canje aplicado en caja"
}
```

Respuesta `201`:

```json
{
  "id": 70,
  "customerId": 10,
  "redemptionDate": "2026-06-02",
  "pointsRedeemed": 500,
  "note": "Canje aplicado en caja",
  "createdAt": "2026-06-02T15:20:00Z",
  "balanceAfter": 750
}
```

Validaciones:

- `customerId` requerido y debe pertenecer a `companyId`.
- `redemptionDate` requerido.
- `pointsRedeemed` requerido, entero mayor que 0.
- `note` opcional, maximo 500 caracteres.
- La API debe usar `dbo.RegisterRedemption` o una transaccion equivalente para evitar redenciones concurrentes mayores al saldo.

Errores esperados:

- `404 COMPANY_NOT_FOUND`.
- `404 CUSTOMER_NOT_FOUND`.
- `400 VALIDATION_ERROR`.
- `409 INSUFFICIENT_POINTS`.

## Customer balance and history

### GET `/api/companies/{companyId}/customers/{customerId}/balance`

Devuelve saldo actual.

Respuesta `200`:

```json
{
  "customerId": 10,
  "pointsEarned": 1250,
  "pointsRedeemed": 500,
  "pointsBalance": 750
}
```

Validaciones:

- `customerId` debe pertenecer a `companyId`.
- Debe consultar `dbo.CustomerPointBalances`.

Errores esperados:

- `404 COMPANY_NOT_FOUND`.
- `404 CUSTOMER_NOT_FOUND`.

### GET `/api/companies/{companyId}/customers/{customerId}/activity`

Devuelve historial combinado de compras y redenciones.

Respuesta `200`:

```json
{
  "customerId": 10,
  "balance": {
    "pointsEarned": 1250,
    "pointsRedeemed": 500,
    "pointsBalance": 750
  },
  "items": [
    {
      "type": "purchase",
      "id": 50,
      "date": "2026-06-02",
      "invoiceNumber": "FAC-1001",
      "amount": 25000.00,
      "points": 1250
    },
    {
      "type": "redemption",
      "id": 70,
      "date": "2026-06-02",
      "note": "Canje aplicado en caja",
      "points": -500
    }
  ]
}
```

Validaciones:

- No mezclar actividad entre empresas.
- Orden sugerido: fecha descendente y luego `createdAt`/`id` descendente.

## Validaciones que dependen de SQL

- Empresa valida: `Companies.id` existe y `status` permite operar.
- Cliente pertenece a empresa: FK compuesta `(company_id, customer_id)`.
- Factura duplicada: indice unico `UX_Purchases_company_invoice`.
- Cliente duplicado: indices `UX_Customers_company_phone` y `UX_Customers_company_email`.
- Saldo suficiente: `dbo.CustomerPointBalances` para lectura y `dbo.RegisterRedemption` para escritura consistente.
- Restricciones positivas: `amount > 0`, `points_earned > 0`, `points_redeemed > 0`, `points_percentage > 0 AND <= 100`.

## Casos negativos MVP

- Factura duplicada: responder `409 DUPLICATE_INVOICE`.
- Cliente no existe en la empresa: responder `404 CUSTOMER_NOT_FOUND`.
- Redencion mayor al saldo: responder `409 INSUFFICIENT_POINTS`.
- Datos invalidos: responder `400 VALIDATION_ERROR` con `details`.
- Empresa no valida o inactiva: responder `404 COMPANY_NOT_FOUND`.

## Pendientes de decision

- Auth fase 1 y fuente confiable de `companyId`.
- Paginacion para listados e historial si el piloto supera volumen basico.
