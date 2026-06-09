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
- IDs respaldados por SQL `bigint` se serializan como string en respuestas. El frontend debe tratarlos como identificadores opacos, no como numeros para calculo.
- Auth fase 1: modo empresa piloto unica. La fuente confiable de empresa es `PILOT_COMPANY_ID` configurado server-side.
- Todas las rutas con `{companyId}` deben validar que el valor del path coincide con `PILOT_COMPANY_ID`; si no coincide, responder `404 COMPANY_NOT_FOUND`.
- El frontend puede usar un `companyId` configurado para construir rutas, pero no es autoridad de seguridad.
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
| 409 | `COMPANY_ALREADY_EXISTS` | Email de empresa ya existe en `Companies`. |
| 409 | `REGISTRATION_ALREADY_PENDING` | Ya existe solicitud pendiente para ese email de empresa. |
| 409 | `INVITATION_ALREADY_PENDING` | Ya existe invitacion pendiente para ese email dentro de la empresa. |
| 409 | `INVITATION_ALREADY_ACCEPTED` | La invitacion ya fue aceptada. |
| 409 | `INVITATION_EXPIRED` | La invitacion expiro. |
| 409 | `COMPANY_USER_ALREADY_EXISTS` | Ya existe usuario con ese email o subject externo. |
| 413 | `UPLOAD_TOO_LARGE` | Archivo supera el limite permitido. |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Tipo de archivo no permitido. |
| 429 | `TOO_MANY_ATTEMPTS` | Demasiados intentos recientes. |
| 500 | `INTERNAL_ERROR` | Error no esperado. No debe exponer detalles SQL. |

## Multiempresa controlado

Estado:

- Contrato final propuesto para la fase multiempresa controlado.
- No reemplaza automaticamente el modo piloto actual.
- No implementar como flujo productivo hasta que existan migracion SQL aplicada, ACS Email, Blob Storage privado y auth propia MVP aprobada/configurada.

Convenciones:

- El email se normaliza server-side con `trim` y lowercase antes de persistir.
- Para piloto, se acepta password solo en activacion/login de empresa y se guarda como hash fuerte server-side; nunca password plano.
- La identidad de empresa se deriva de una sesion server-side validada por Backend/API, nunca de `companyId` enviado por frontend.
- El logo se administra por Blob Storage privado y rutas/API controladas, no por URL externa editable.
- El `companyId` efectivo para endpoints autenticados sale de `CompanySessions` + `CompanyUsers`, no del frontend.
- Los endpoints operativos existentes con `{companyId}` deben validar que el path coincide con la empresa autorizada cuando multiempresa este activo.

Estados:

- Empresa: `pending_activation`, `active`, `inactive`.
- Solicitud: `pending`, `approved`, `rejected`, `cancelled`.
- Invitacion: `pending`, `accepted`, `revoked`, `expired`.
- Usuario de empresa: `invited`, `active`, `disabled`.
- Roles: `owner`, `admin`, `staff`.

### POST `/api/company-registration-requests`

Registra una solicitud controlada de empresa. No crea acceso operativo inmediato.

Payload:

```json
{
  "companyName": "Cafe Central",
  "companyEmail": "hola@cafecentral.test",
  "companyPhone": "+50622223333",
  "companyAddress": "San Jose, Costa Rica",
  "contactName": "Maria Soto",
  "contactEmail": "maria@cafecentral.test",
  "contactPhone": "+50688887777"
}
```

Respuesta `201`:

```json
{
  "id": "200",
  "companyName": "Cafe Central",
  "companyEmail": "hola@cafecentral.test",
  "companyAddress": "San Jose, Costa Rica",
  "status": "pending",
  "createdAt": "2026-06-07T18:30:00Z",
  "message": "Solicitud recibida."
}
```

Validaciones:

- `companyName` requerido, maximo 160 caracteres.
- `companyEmail` requerido, email valido, maximo 254 caracteres, normalizado a lowercase.
- `companyAddress` requerido, maximo 300 caracteres.
- `companyPhone` opcional, maximo 32 caracteres.
- `contactName` opcional, maximo 160 caracteres.
- `contactEmail` requerido, email valido, maximo 254 caracteres, normalizado a lowercase.
- `contactPhone` opcional, maximo 32 caracteres.
- No acepta `requestedLogoUrl`, `companyId` ni password.

Efectos:

- Crea `CompanyRegistrationRequests.status = pending`.
- No crea empresa activa ni usuario.
- Registra auditoria best-effort `company.registration.submitted`.
- Puede notificar internamente a `INTERNAL_NOTIFICATION_EMAIL` cuando ACS Email este configurado.

Errores esperados:

- `400 VALIDATION_ERROR`.
- `409 COMPANY_ALREADY_EXISTS` por `UX_Companies_email`.
- `409 REGISTRATION_ALREADY_PENDING` por `UX_CompanyRegistrationRequests_pending_company_email`.
- `429 TOO_MANY_ATTEMPTS`.

### POST `/api/company-registration-requests/{requestId}/approve`

Aprueba una solicitud y crea la empresa en estado pendiente de activacion.

Auth:

- Requiere admin interno o mecanismo operativo aprobado.

Payload:

```json
{
  "reviewNote": "Aprobada para piloto controlado.",
  "pointsPercentage": 5
}
```

Respuesta `200`:

```json
{
  "id": "200",
  "status": "approved",
  "reviewedAt": "2026-06-07T19:00:00Z",
  "approvedCompanyId": "10",
  "company": {
    "id": "10",
    "name": "Cafe Central",
    "email": "hola@cafecentral.test",
    "phone": "+50622223333",
    "address": "San Jose, Costa Rica",
    "status": "pending_activation",
    "pointsPercentage": 5
  }
}
```

Validaciones:

- `requestId` debe ser id positivo.
- La solicitud debe existir y estar `pending`.
- `pointsPercentage` opcional; si se envia debe ser mayor que 0 y menor o igual que 100.
- `reviewNote` opcional, maximo 500 caracteres.

Efectos:

- Transaccion: crea `Companies.status = pending_activation`.
- Copia nombre, email, telefono y direccion desde la solicitud.
- Actualiza solicitud a `approved`, `reviewed_at`, `reviewed_by_label`, `approved_company_id` y `updated_at`.
- Registra auditoria best-effort `company.registration.approved`.

Errores esperados:

- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `404 COMPANY_NOT_FOUND` si no existe solicitud visible para el actor.
- `409 COMPANY_ALREADY_EXISTS`.

### POST `/api/company-registration-requests/{requestId}/reject`

Rechaza una solicitud pendiente.

Auth:

- Requiere admin interno o mecanismo operativo aprobado.

Payload:

```json
{
  "reviewNote": "Datos incompletos."
}
```

Respuesta `200`:

```json
{
  "id": "200",
  "status": "rejected",
  "reviewedAt": "2026-06-07T19:00:00Z"
}
```

Validaciones:

- `requestId` debe ser id positivo.
- La solicitud debe existir y estar `pending`.
- `reviewNote` requerido para rechazo, maximo 500 caracteres.

Efectos:

- Actualiza solicitud a `rejected`, `reviewed_at`, `reviewed_by_label`, `review_note` y `updated_at`.
- Registra auditoria best-effort `company.registration.rejected`.

Errores esperados:

- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.

### POST `/api/company-invitations`

Crea invitacion para una empresa ya creada en `pending_activation` o `active`.

Auth:

- Requiere admin interno, o usuario `owner/admin` de la empresa cuando el flujo ya tenga auth.

Payload:

```json
{
  "companyId": "10",
  "registrationRequestId": "200",
  "email": "hola@cafecentral.test",
  "role": "owner"
}
```

Respuesta `201`:

```json
{
  "id": "300",
  "companyId": "10",
  "email": "hola@cafecentral.test",
  "role": "owner",
  "status": "pending",
  "expiresAt": "2026-06-14T19:00:00Z",
  "createdAt": "2026-06-07T19:00:00Z"
}
```

Validaciones:

- `companyId` requerido, id positivo.
- Empresa debe existir con `status` `pending_activation` o `active`.
- `registrationRequestId` opcional, id positivo y relacionado con la empresa si se envia.
- `email` requerido, email valido, maximo 254, normalizado a lowercase.
- `role` permitido: `owner`, `admin`, `staff`.

Efectos:

- Genera token raw server-side con entropia suficiente.
- Persiste solo `token_hash varbinary(32)`, nunca token plano.
- Persiste `expires_at`; default recomendado 7 dias.
- Registra auditoria best-effort `company.invitation.created`.
- Envia email por ACS Email solo cuando el provider real este configurado.
- No debe loggear link completo, token raw, JWT, secrets ni SAS.

Errores esperados:

- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `404 COMPANY_NOT_FOUND`.
- `409 INVITATION_ALREADY_PENDING` por `UX_CompanyInvitations_pending_company_email`.
- `429 TOO_MANY_ATTEMPTS`.

### POST `/api/company-invitations/{invitationId}/resend`

Reenvia una invitacion pendiente. La migracion actual no persiste `resent_count` ni `last_sent_at`.

Auth:

- Admin interno o rol `owner/admin`.

Respuesta `200`:

```json
{
  "id": "300",
  "status": "pending",
  "email": "hola@cafecentral.test",
  "expiresAt": "2026-06-14T19:00:00Z",
  "resentAt": "2026-06-07T20:00:00Z"
}
```

Reglas:

- Solo reenviar si `status = pending` y `expiresAt` aun no paso.
- Registrar reenvio en logs operativos, no en `OperationalAuditEvents`, salvo migracion futura para `company.invitation.resent`.

Errores esperados:

- `404 INVITATION_NOT_FOUND`.
- `409 INVITATION_ALREADY_ACCEPTED`.
- `409 INVITATION_EXPIRED`.
- `429 TOO_MANY_ATTEMPTS`.

### GET `/api/company-invitations/validate?token=...`

Valida token de invitacion para mostrar la pantalla de crear acceso.

Respuesta `200` con token vigente:

```json
{
  "valid": true,
  "invitationId": "300",
  "companyId": "10",
  "companyName": "Cafe Central",
  "email": "hola@cafecentral.test",
  "role": "owner",
  "expiresAt": "2026-06-14T19:00:00Z"
}
```

Respuesta `200` con token no disponible:

```json
{
  "valid": false,
  "reason": "expired"
}
```

Valores de `reason`:

- `invalid`.
- `expired`.
- `accepted`.
- `revoked`.

Validaciones:

- `token` requerido.
- Hashear token recibido y comparar contra `CompanyInvitations.token_hash`.
- Tratar `status = pending` con `expires_at < now` como expirado.
- No devolver token raw ni hash.
- No revelar si un email existe.

Errores esperados:

- `400 VALIDATION_ERROR` si falta token o formato es imposible.
- Para estados esperados, preferir `200 valid=false` para facilitar UX.

### POST `/api/company-invitations/accept`

Acepta una invitacion y crea el usuario de empresa con password propio MVP.

Auth:

- Publico con token de invitacion vigente. No requiere sesion previa.

Payload:

```json
{
  "token": "raw-invite-token",
  "displayName": "Maria Soto",
  "password": "new-password"
}
```

Respuesta `201`:

```json
{
  "companyId": "10",
  "userId": "400",
  "email": "hola@cafecentral.test",
  "role": "owner",
  "companyStatus": "active",
  "createdAt": "2026-06-07T20:10:00Z"
}
```

Reglas:

- Acepta password solo en esta activacion inicial.
- Valida fortaleza minima de password server-side.
- Normaliza email desde la invitacion, no desde frontend.
- Crea `CompanyUsers.auth_provider = local_password` con `password_hash` y metadatos de algoritmo/salt segun diseno SQL.
- Marca invitacion como `accepted` y setea `accepted_at`.
- Puede activar `Companies.status = active` al aceptar invitacion owner.
- Operacion debe ser transaccional.
- Registra auditoria best-effort `company.invitation.accepted` y `company.user.created`.

Validaciones:

- `token` requerido.
- `displayName` opcional, maximo 160 caracteres.
- Invitacion debe estar pendiente y no expirada.
- Usuario no debe existir para la misma empresa/email.

Errores esperados:

- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `404 INVITATION_NOT_FOUND`.
- `409 INVITATION_ALREADY_ACCEPTED`.
- `409 INVITATION_EXPIRED`.
- `409 COMPANY_USER_ALREADY_EXISTS`.

### POST `/api/company-auth/login`

Inicia sesion para usuario de empresa con email y password.

Payload:

```json
{
  "email": "hola@cafecentral.test",
  "password": "password"
}
```

Respuesta `200`:

```json
{
  "user": {
    "id": "400",
    "email": "hola@cafecentral.test",
    "displayName": "Maria Soto",
    "role": "owner",
    "status": "active"
  },
  "company": {
    "id": "10",
    "name": "Cafe Central",
    "status": "active"
  }
}
```

Reglas:

- Validar password en Backend/API contra hash fuerte.
- Crear sesion server-side en `CompanySessions` con token aleatorio y guardar solo hash.
- Enviar cookie `HttpOnly`, `Secure`, `SameSite=Lax`.
- Frontend no debe leer ni persistir el token de sesion.
- No devolver password hash ni token raw.

Errores esperados:

- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `429 TOO_MANY_ATTEMPTS`.

### POST `/api/company-auth/logout`

Cierra la sesion actual invalidando la sesion server-side y limpiando cookie.

### GET `/api/me`

Devuelve identidad efectiva y empresa autorizada para la sesion actual.

Auth:

- Requiere cookie de sesion valida.

Respuesta `200`:

```json
{
  "user": {
    "id": "400",
    "email": "hola@cafecentral.test",
    "displayName": "Maria Soto",
    "role": "owner",
    "status": "active"
  },
  "company": {
    "id": "10",
    "name": "Cafe Central",
    "status": "active"
  }
}
```

Reglas:

- Resolver sesion por cookie, buscar `CompanySessions.token_hash`, validar expiracion/estado y luego resolver `CompanyUsers` por `company_user_id`.
- Rechazar usuario ausente, `disabled` o empresa no activa para operacion.

Errores esperados:

- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.

### GET `/api/my-company`

Consulta la empresa asociada al usuario autenticado.

Auth:

- Requiere usuario activo con sesion valida.

Respuesta `200`:

```json
{
  "id": "10",
  "name": "Cafe Central",
  "email": "hola@cafecentral.test",
  "phone": "+50622223333",
  "address": "San Jose, Costa Rica",
  "logoUrl": "/api/my-company/logo",
  "logoContentType": "image/png",
  "logoUpdatedAt": "2026-06-07T20:20:00Z",
  "pointsPercentage": 5,
  "status": "active",
  "updatedAt": "2026-06-07T20:20:00Z"
}
```

Reglas:

- No recibe `companyId`.
- No expone `logo_blob_path`.
- `logoUrl` es ruta controlada API o URL/SAS corto generado server-side, no valor editable.

Errores esperados:

- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `404 COMPANY_NOT_FOUND`.

### PATCH `/api/my-company`

Actualiza datos editables de la empresa asociada al usuario.

Auth:

- Requiere rol `owner` o `admin`.

Payload:

```json
{
  "name": "Cafe Central",
  "phone": "+50622223333",
  "address": "San Jose, Costa Rica",
  "pointsPercentage": 6
}
```

Validaciones:

- Debe enviarse al menos un campo editable.
- `name` no vacio si se envia, maximo 160 caracteres.
- `phone` opcional, maximo 32 caracteres.
- `address` no vacio si se envia, maximo 300 caracteres.
- `pointsPercentage` mayor que 0 y menor o igual que 100.
- No acepta `email`, `status`, `logoUrl`, `logoBlobPath` ni `companyId`.

Efectos:

- Actualiza `Companies.updated_at = SYSUTCDATETIME()`.
- `pointsPercentage` aplica solo a compras futuras; no recalcula historicos.
- Registra auditoria best-effort `company.settings.updated`.

Respuesta `200`:

- Mismo formato de `GET /api/my-company`.

Errores esperados:

- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `404 COMPANY_NOT_FOUND`.

### POST `/api/my-company/logo`

Sube logo de empresa a Blob Storage privado.

Auth:

- Requiere rol `owner` o `admin`.

Request:

- `multipart/form-data`.
- Campo `file`.

Tipos permitidos:

- `image/png`.
- `image/jpeg`.
- `image/webp`.

Respuesta `200`:

```json
{
  "logoUrl": "/api/my-company/logo",
  "contentType": "image/png",
  "updatedAt": "2026-06-07T20:20:00Z"
}
```

Validaciones:

- Archivo requerido.
- MIME permitido y coherente con extension/contenido detectable.
- Tamano maximo segun `LOGO_MAX_BYTES`.
- No permitir SVG.
- Generar blob path server-side: `companies/{companyId}/logo/{uuid}.{ext}`.

Efectos:

- Sube archivo a contenedor privado.
- Guarda `Companies.logo_blob_path`, `logo_content_type`, `logo_updated_at`.
- Actualiza `Companies.updated_at`.
- Registra auditoria best-effort `company.logo.updated`.
- No expone SAS largo ni blob path interno.

Errores esperados:

- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `413 UPLOAD_TOO_LARGE`.
- `415 UNSUPPORTED_MEDIA_TYPE`.

### GET `/api/my-company/logo`

Entrega logo actual por API o redirecciona a SAS corto generado server-side.

Auth:

- Requiere usuario activo de la empresa, salvo decision futura de hacer logo publico controlado.

Respuesta:

- `200` con `Content-Type` `image/png`, `image/jpeg` o `image/webp`; o
- `302` a SAS corto si Infra/Backend deciden `LOGO_SERVE_MODE=short_sas`.

Errores esperados:

- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `404 COMPANY_LOGO_NOT_FOUND`.

### Auditoria multiempresa

Eventos permitidos por la migracion preparada:

- `company.registration.submitted`.
- `company.registration.approved`.
- `company.registration.rejected`.
- `company.invitation.created`.
- `company.invitation.accepted`.
- `company.invitation.revoked`.
- `company.user.created`.
- `company.user.disabled`.
- `company.logo.updated`.
- `company.settings.updated`.

Entidades permitidas:

- `company`.
- `company_registration_request`.
- `company_invitation`.
- `company_user`.

Reglas:

- No auditar `company.invitation.resent` hasta que exista migracion para ese evento.
- Metadata no debe contener token raw, password, password hash, cookie, JWT, SAS, connection strings ni secretos.
- Preferir `emailDomain`, `emailHash`, ids internos y `changedFields` antes que PII completa.

## Company settings

### GET `/api/companies/{companyId}/settings`

Devuelve configuracion operativa de la empresa.

Respuesta `200`:

```json
{
  "id": "1",
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

Actualiza campos editables de configuracion de la empresa piloto. Es una actualizacion parcial: los campos omitidos conservan su valor actual. `email`, `phone` y `logoUrl` pueden enviarse como `null` o texto vacio para limpiarlos.

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

- Debe enviarse al menos uno de los campos editables.
- `companyId` debe coincidir con `PILOT_COMPANY_ID`.
- `name` requerido/no vacio si se envia, maximo 160 caracteres.
- `email` opcional, formato email, maximo 254 caracteres.
- `phone` opcional, entre 7 y 32 caracteres si se provee.
- `logoUrl` opcional, URL `http(s)` valida, maximo 2048 caracteres.
- `pointsPercentage` mayor que 0 y menor o igual que 100.

Efectos:

- `pointsPercentage` aplica solo a compras futuras; no recalcula compras historicas.
- Si cambia al menos un campo, la API actualiza `updatedAt`.
- La API registra auditoria best-effort `company.settings.updated` con `entityType = company`, `entityId = companyId` y metadata sin secretos:

```json
{
  "changedFields": ["name", "pointsPercentage"],
  "requestId": "...",
  "affectsPurchases": "future_only"
}
```

Errores esperados:

- `404 COMPANY_NOT_FOUND` si la empresa no existe, esta inactiva o el path no coincide con `PILOT_COMPANY_ID`.
- `400 VALIDATION_ERROR` si el payload no es JSON valido o algun campo es invalido.

## Customers

### GET `/api/companies/{companyId}/customers?search={text}`

Lista clientes de una empresa. `search` puede buscar por nombre, telefono o email.

Respuesta `200`:

```json
{
  "items": [
    {
      "id": "10",
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
  "id": "10",
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
  "customerId": "10",
  "invoiceNumber": "FAC-1001",
  "purchaseDate": "2026-06-02",
  "amount": 25000.00
}
```

Respuesta `201`:

```json
{
  "id": "50",
  "customerId": "10",
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
  "customerId": "10",
  "redemptionDate": "2026-06-02",
  "pointsRedeemed": 500,
  "note": "Canje aplicado en caja"
}
```

Respuesta `201`:

```json
{
  "id": "70",
  "customerId": "10",
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
  "customerId": "10",
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
  "customerId": "10",
  "balance": {
    "pointsEarned": 1250,
    "pointsRedeemed": 500,
    "pointsBalance": 750
  },
  "items": [
    {
      "type": "purchase",
      "id": "50",
      "date": "2026-06-02",
      "invoiceNumber": "FAC-1001",
      "amount": 25000.00,
      "points": 1250
    },
    {
      "type": "redemption",
      "id": "70",
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

## Operational reports

### GET `/api/companies/{companyId}/reports/activity?from=YYYY-MM-DD&to=YYYY-MM-DD&type=all|purchase|redemption`

Devuelve reporte operativo de compras/redenciones por rango de fechas.

Query params:

- `from` requerido, formato `YYYY-MM-DD`.
- `to` requerido, formato `YYYY-MM-DD`.
- `type` opcional, default `all`; valores permitidos: `all`, `purchase`, `redemption`.
- Rango maximo inicial: 31 dias.

Respuesta `200`:

```json
{
  "from": "2026-06-01",
  "to": "2026-06-07",
  "type": "all",
  "summary": {
    "purchaseCount": 10,
    "purchaseAmountTotal": 50000,
    "pointsEarnedTotal": 2500,
    "redemptionCount": 4,
    "pointsRedeemedTotal": 600,
    "activeCustomerCount": 8
  },
  "items": [
    {
      "type": "purchase",
      "id": "50",
      "date": "2026-06-06",
      "customerId": "10",
      "customerName": "Maria Soto",
      "customerPhone": "+50688887777",
      "customerEmail": "maria@example.com",
      "invoiceNumber": "FAC-1001",
      "amount": 25000,
      "points": 1250
    },
    {
      "type": "redemption",
      "id": "70",
      "date": "2026-06-06",
      "customerId": "10",
      "customerName": "Maria Soto",
      "customerPhone": "+50688887777",
      "customerEmail": "maria@example.com",
      "points": -500
    }
  ]
}
```

Validaciones:

- `companyId` debe coincidir con `PILOT_COMPANY_ID`.
- `from <= to`.
- `from` y `to` deben ser fechas reales en formato `YYYY-MM-DD`.
- `type` debe ser `all`, `purchase` o `redemption`.

Errores esperados:

- `404 COMPANY_NOT_FOUND`.
- `400 VALIDATION_ERROR`.

## Operational audit

### GET `/api/companies/{companyId}/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=10|25|50`

Devuelve eventos recientes de auditoria operativa por rango de fecha.

Query params:

- `from` requerido, formato `YYYY-MM-DD`.
- `to` requerido, formato `YYYY-MM-DD`.
- `limit` opcional, default `25`; valores permitidos: `10`, `25`, `50`.
- Rango maximo inicial: 31 dias.

Respuesta `200`:

```json
{
  "from": "2026-06-01",
  "to": "2026-06-07",
  "limit": 25,
  "items": [
    {
      "id": "100",
      "occurredAt": "2026-06-07T18:20:00Z",
      "eventType": "purchase.registered",
      "entityType": "purchase",
      "entityId": "50",
      "customerId": "10",
      "customerName": "Maria Soto",
      "actorLabel": null,
      "source": "api",
      "metadata": {
        "invoiceNumber": "FAC-1001",
        "purchaseDate": "2026-06-07",
        "amount": 25000,
        "pointsEarned": 1250
      }
    }
  ]
}
```

Campos:

- `entityId` y `customerId` pueden ser `null` en eventos de rechazo.
- `customerName` puede ser `null` si no hay cliente asociado o no se puede resolver.
- `metadata` es JSON parseado o `null`; no debe contener secretos.

Validaciones:

- `companyId` debe coincidir con `PILOT_COMPANY_ID`.
- `from <= to`.
- `from` y `to` deben ser fechas reales en formato `YYYY-MM-DD`.
- `limit` debe ser `10`, `25` o `50`.

Errores esperados:

- `404 COMPANY_NOT_FOUND`.
- `400 VALIDATION_ERROR`.

## Validaciones que dependen de SQL

- Empresa autorizada para MVP: `companyId` del path coincide con `PILOT_COMPANY_ID` configurado server-side.
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

- Paginacion para listados e historial si el piloto supera volumen basico.


