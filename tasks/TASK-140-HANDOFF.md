# TASK-140 - Handoff Backend/API

## Resumen

Se conecto `POST /api/company-registration-requests/{requestId}/approve` con la creacion automatica de una invitacion `owner` para el `companyEmail` de la solicitud aprobada.

La invitacion se crea con token raw solo en memoria, persiste exclusivamente `token_hash` y envia email por ACS usando el notifier existente. La respuesta no incluye token raw ni hash.

## Archivos modificados

- `api/src/functions/companyRegistrationRequests.js`
- `api/src/lib/companyRegistration.js`
- `api/src/lib/repository.js`
- `api/test/company-registration.test.js`
- `api/test/repository-approval.test.js`
- `api/package.json`

## Comportamiento implementado

- Se mantienen los requisitos internos existentes:
  - `COMPANY_REGISTRATION_REVIEW_ENABLED=true`
  - header `x-puntoclub-admin-token` valido contra `INTERNAL_ADMIN_TOKEN`
- Al aprobar una solicitud pendiente:
  - crea empresa en `pending_activation`;
  - marca solicitud como `approved`;
  - crea invitacion `owner` para el correo principal de la empresa;
  - guarda solo SHA-256 `token_hash`;
  - enlaza `registration_request_id`;
  - devuelve resumen no sensible de `invitation`.
- La empresa, la aprobacion y la invitacion se crean dentro de la misma transaccion SQL.
- El envio de email ocurre despues del commit y es best-effort; si ACS falla, la invitacion queda persistida para seguimiento/reenvio.
- Se audita best-effort:
  - `company.invitation.created`
  - `company.registration.approved`

## Respuesta de aprobacion

La respuesta ahora incluye:

```json
{
  "invitation": {
    "id": "300",
    "companyId": "10",
    "email": "empresa@example.com",
    "role": "owner",
    "status": "pending",
    "expiresAt": "2026-06-14T19:00:00.000Z",
    "createdAt": "2026-06-07T19:02:00.000Z"
  }
}
```

No incluye token raw, `tokenHash`, links completos ni secretos.

## Idempotencia / conflictos

- El patron actual de aprobacion solo opera sobre solicitudes `pending`.
- Si la solicitud ya fue aprobada o rechazada, el repositorio conserva el comportamiento existente de no encontrar solicitud pendiente.
- Si SQL detecta una invitacion pendiente duplicada para la misma empresa/email, aplica el mapeo existente `409 INVITATION_ALREADY_PENDING`.

## Pruebas ejecutadas

- `npm test` desde `api/`.
- Primer intento en sandbox fallo por `spawn EPERM`.
- Reintento elevado completo correctamente.
- Resultado: 72 tests pasan.
- `node -e "require('./src/functions/companyRegistrationRequests')"` desde `api/`.
- `node -e "require('./src/functions/companyInvitations')"` desde `api/`.
- Ambos cargan sin errores; `@azure/functions` emitio warnings esperados de test mode fuera del runtime.

## Cobertura agregada

- Test unitario con mock de SQL/transaccion confirma que `approveCompanyRegistrationRequest` crea empresa e invitacion `owner` con `token_hash`.
- Test confirma que la respuesta de aprobacion no contiene token raw ni hash.
- La cobertura previa de TASK-134 sigue confirmando `403` sin token admin.

## Fuera de alcance mantenido

- No se implemento `POST /api/company-invitations/accept`.
- No se crean `CompanyUsers`.
- No se valida JWT de Entra.
- No se cambia UI.
- No se exponen tokens en response, logs, handoff ni tests.
