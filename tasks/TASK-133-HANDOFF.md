# TASK-133 HANDOFF - QA

## Resultado

Aprobado.

La API publicada expone los endpoints base de solicitudes de empresa. `POST /api/company-registration-requests` crea una solicitud controlada con `201`, los casos negativos requeridos responden `400`, y `approve/reject` responden `403` con el review flag apagado. El flujo operativo existente de clientes, compra y redencion sigue funcionando. No encontre P0/P1 abiertos.

## Ambiente probado

- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha de prueba local: `2026-06-07`
- Timestamps API observados en UTC: `2026-06-08`
- Empresa piloto operativa para regresion: `companyId=1`

No se uso API local ni `func start`, porque la asignacion pide ambiente publicado.

## Endpoints probados

### POST `/api/company-registration-requests`

Payload QA:

```json
{
  "companyName": "QA Registro 20260607185840 505673",
  "companyEmail": "qa-reg-20260607185840-505673@example.com",
  "companyPhone": "+5064505673",
  "companyAddress": "San Jose QA TASK-133 505673",
  "contactName": "QA Contact 505673",
  "contactEmail": "qa-contact-20260607185840-505673@example.com",
  "contactPhone": "+5065505673"
}
```

Resultado:

- status: `201`
- `id`: `1`
- `companyName`: `QA Registro 20260607185840 505673`
- `companyEmail`: `qa-reg-20260607185840-505673@example.com`
- `companyAddress`: `San Jose QA TASK-133 505673`
- `status`: `pending`
- `createdAt`: `2026-06-08T00:59:25.000Z`
- `message`: `Company registration request received.`

Confirmacion:

- La solicitud queda en estado `pending`.
- No se creo empresa activa ni se probo aprobacion real.
- No se valido recepcion de email; el envio real/invitaciones queda fuera de alcance de TASK-133.

### Casos negativos de solicitud

Todos respondieron con error esperado `400 Bad Request`:

- Falta `companyAddress` -> `400`
- `companyEmail`/`contactEmail` invalidos -> `400`
- Campo prohibido `password` -> `400`
- Campo prohibido `companyId` -> `400`
- Campo prohibido `requestedLogoUrl` -> `400`

### POST `/api/company-registration-requests/{requestId}/approve`

Endpoint:

```text
POST /api/company-registration-requests/1/approve
```

Payload:

```json
{
  "reviewNote": "TASK-133 QA should be forbidden",
  "pointsPercentage": 5
}
```

Resultado:

- status: `403 Forbidden`

Conclusion:

- El endpoint esta protegido cuando `COMPANY_REGISTRATION_REVIEW_ENABLED` no esta habilitado.
- No se creo empresa real aprobada.

### POST `/api/company-registration-requests/{requestId}/reject`

Endpoint:

```text
POST /api/company-registration-requests/1/reject
```

Payload:

```json
{
  "reviewNote": "TASK-133 QA should be forbidden"
}
```

Resultado:

- status: `403 Forbidden`

Conclusion:

- El endpoint esta protegido cuando `COMPANY_REGISTRATION_REVIEW_ENABLED` no esta habilitado.
- No se rechazo la solicitud QA.

## Regresion flujo operativo existente

Datos QA creados:

- Cliente:
  - nombre: `Task 133 Cliente 505673`
  - telefono: `+5066505673`
  - email: `task133-505673@example.com`
  - `customerId`: `85`
- Compra:
  - factura: `T133-P-505673`
  - fecha: `2026-06-07`
  - monto: `1000`
  - `purchaseId`: `59`
  - puntos ganados: `50`
- Redencion:
  - fecha: `2026-06-07`
  - puntos: `10`
  - nota: `TASK-133 QA canje 505673`
  - `redemptionId`: `44`
  - balance posterior: `40`

Resultados happy path:

- `POST /api/companies/1/customers` -> `201`
- `POST /api/companies/1/purchases` -> `201`
- `POST /api/companies/1/redemptions` -> `201`
- `GET /api/companies/1/customers/85/balance` -> `200`
  - `pointsEarned`: `50`
  - `pointsRedeemed`: `10`
  - `pointsBalance`: `40`
- `GET /api/companies/1/customers/85/activity` -> `200`
  - `items`: `2`

Casos negativos operativos:

- Compra duplicada con factura `T133-P-505673` -> `409 Conflict`
- Redencion de `999999` puntos -> `409 Conflict`
- Balance posterior se mantiene:
  - `pointsEarned`: `50`
  - `pointsRedeemed`: `10`
  - `pointsBalance`: `40`

Reporte operativo:

- `GET /api/companies/1/reports/activity?from=2026-06-07&to=2026-06-07&type=all` -> `200`
- Factura `T133-P-505673`: presente una vez.
- Redencion de `customerId=85`: presente.

## Hallazgos

### P0/P1

Ninguno.

### P2/P3

Ninguno nuevo observado.

## Fuera de alcance no probado

- Crear empresa real aprobada.
- Enviar invitaciones.
- Login.
- Logo upload.
- Entra External ID.
- Recepcion real de correos ACS.

## Notas

- La solicitud QA `id=1` queda pendiente porque approve/reject estan correctamente protegidos con `403`.
- Se crearon datos reales de QA en la empresa piloto para la regresion operativa.
- No modifique codigo, Azure ni secretos.

## Siguiente recomendado

Product / Architect / Release puede continuar con la siguiente pieza de invitaciones/login/logo sabiendo que la base publicada de solicitudes de empresa esta estable y no rompe el flujo operativo existente.
