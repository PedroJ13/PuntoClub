# TASK-201 - Handoff Backend/API

## Resultado

Completado en codigo local.

Se revisaron contratos y codigo de administracion interna de empresas. Los endpoints de aprobar/rechazar solicitudes, crear invitaciones y reenviar invitaciones ya existian, estaban protegidos por `x-puntoclub-admin-token` y no devuelven token raw/hash.

Gap encontrado e implementado:

- Faltaba endpoint minimo para listar solicitudes pendientes/recientes desde una UI/admin.
- Se agrego `GET /api/company-registration-requests` protegido con el mismo mecanismo temporal interno.

## Impacto

- Toca contrato API interno de administracion.
- No cambia auth principal de empresas.
- No introduce Entra External ID.
- No cambia modelo SQL.
- No expone secretos ni material de invitacion sensible.

## Endpoints disponibles y contratos

### GET `/api/company-registration-requests?status=pending&limit=25`

Nuevo endpoint interno para panel admin.

Auth:

- `COMPANY_REGISTRATION_REVIEW_ENABLED=true`.
- Header `x-puntoclub-admin-token`.

Query:

- `status`: `pending`, `approved`, `rejected`, `cancelled`, `all`; default `pending`.
- `limit`: `10`, `25`, `50`; default `25`.

Respuesta:

- `status`
- `limit`
- `items[]` con datos de solicitud.
- `items[].invitation` con resumen no sensible si existe invitacion asociada.

No devuelve:

- token raw;
- `token_hash`;
- cookies;
- passwords;
- SAS;
- connection strings;
- secretos.

### POST `/api/company-registration-requests/{requestId}/approve`

Existente.

- Protegido con feature flag + `x-puntoclub-admin-token`.
- Crea empresa `pending_activation`.
- Crea invitacion owner cuando corresponde.
- Respuesta incluye resumen no sensible de `invitation`.

### POST `/api/company-registration-requests/{requestId}/reject`

Existente.

- Protegido con feature flag + `x-puntoclub-admin-token`.
- Requiere `reviewNote`.
- Respuesta compacta: `id`, `status`, `reviewedAt`.

### POST `/api/company-invitations`

Existente.

- Protegido con `COMPANY_INVITATION_MANAGEMENT_ENABLED=true` + `x-puntoclub-admin-token`.
- Crea invitacion y envia email si ACS esta configurado.
- Respuesta no expone token raw/hash.

### POST `/api/company-invitations/{invitationId}/resend`

Existente.

- Protegido con `COMPANY_INVITATION_MANAGEMENT_ENABLED=true` + `x-puntoclub-admin-token`.
- Rota token hash y reenvia invitacion.
- Respuesta no expone token raw/hash.

## Estados y errores esperados

Proteccion interna:

- Sin feature flag: `403 FORBIDDEN`.
- Sin `x-puntoclub-admin-token`: `403 FORBIDDEN`.
- Token interno invalido: `403 FORBIDDEN`.

Solicitudes:

- Solicitud ya procesada en approve/reject: `404 COMPANY_REGISTRATION_REQUEST_NOT_FOUND` por no estar `pending`.
- Payload invalido: `400 VALIDATION_ERROR`.
- Empresa duplicada: `409 COMPANY_ALREADY_EXISTS`.

Invitaciones:

- Invitacion inexistente/no pendiente: `404 INVITATION_NOT_FOUND`.
- Invitacion ya aceptada: `409 INVITATION_ALREADY_ACCEPTED`.
- Invitacion expirada: `409 INVITATION_EXPIRED`.
- Invitacion pendiente duplicada: `409 INVITATION_ALREADY_PENDING`.

## Archivos modificados

- `api/src/functions/companyRegistrationRequests.js`
- `api/src/lib/companyRegistration.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/company-registration.test.js`
- `api/test/validators.test.js`
- `docs/API_CONTRACTS.md`

## Pruebas ejecutadas

Primero `npm test` fallo dentro del sandbox por `spawn EPERM`.

Luego se ejecuto fuera del sandbox:

```text
npm test
```

Resultado:

```text
tests 101
pass 101
fail 0
```

## Pendientes / bloqueos para Web Dev/QA

- El nuevo endpoint queda pendiente de commit/deploy API antes de validacion publicada.
- Web Dev puede construir el panel interno contra:
  - `GET /api/company-registration-requests`;
  - `POST /api/company-registration-requests/{requestId}/approve`;
  - `POST /api/company-registration-requests/{requestId}/reject`;
  - `POST /api/company-invitations/{invitationId}/resend`.
- QA debe validar publicado sin exponer el valor real de `x-puntoclub-admin-token`.
- El mecanismo admin final sigue diferido; Entra External ID no se introdujo en esta tarea.
