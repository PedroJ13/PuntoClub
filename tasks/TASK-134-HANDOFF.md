# TASK-134 - Handoff Backend/API

## Resumen

Se agrego autorizacion temporal para endpoints internos de revision de empresa e invitaciones mientras Entra External ID/admin real sigue pendiente.

El mecanismo conserva los feature flags existentes y ademas exige un header secreto por request.

## Archivos modificados

- `api/src/lib/internalAdmin.js`
- `api/src/functions/companyRegistrationRequests.js`
- `api/src/functions/companyInvitations.js`
- `api/test/internal-admin.test.js`
- `api/package.json`

## Mecanismo implementado

- Header requerido:
  - `x-puntoclub-admin-token`
- App setting requerido:
  - `INTERNAL_ADMIN_TOKEN`
- Si el feature flag del endpoint esta apagado, responde `403 FORBIDDEN`.
- Si el feature flag esta encendido pero falta `INTERNAL_ADMIN_TOKEN`, falta el header o el valor no coincide, responde `403 FORBIDDEN`.
- La comparacion usa `crypto.timingSafeEqual` cuando ambos tokens tienen longitud compatible.
- No se imprime ni registra el token.

## Endpoints protegidos

### Solicitudes de empresa

- `POST /api/company-registration-requests/{requestId}/approve`
- `POST /api/company-registration-requests/{requestId}/reject`

Requisitos:

- `COMPANY_REGISTRATION_REVIEW_ENABLED=true`
- Header `x-puntoclub-admin-token` igual a `INTERNAL_ADMIN_TOKEN`

### Invitaciones internas

- `POST /api/company-invitations`
- `POST /api/company-invitations/{invitationId}/resend`

Requisitos:

- `COMPANY_INVITATION_MANAGEMENT_ENABLED=true`
- Header `x-puntoclub-admin-token` igual a `INTERNAL_ADMIN_TOKEN`

### Sin cambios

- `POST /api/company-registration-requests` sigue publico.
- `GET /api/company-invitations/validate?token=...` sigue publico para la futura pantalla de crear acceso.

## Pruebas ejecutadas

- `npm test` desde `api/`.
- Primer intento en sandbox fallo por `spawn EPERM`.
- Reintento elevado completo correctamente.
- Resultado: 70 tests pasan.
- `node -e "require('./src/functions/companyRegistrationRequests')"` desde `api/`.
- `node -e "require('./src/functions/companyInvitations')"` desde `api/`.
- Ambos cargan sin errores; `@azure/functions` emitio warnings esperados de test mode fuera del runtime.

## Riesgos / notas

- Es una proteccion temporal compartida, no reemplaza Entra External ID ni roles admin reales.
- El secreto debe configurarlo Infra/Azure como app setting; no debe guardarse en repo ni exponerse al frontend.
- Se debe rotar el valor si se comparte por canales no seguros o si se sospecha exposicion.
- QA podra validar endpoints internos pasando el header controlado sin abrirlos publicamente solo con feature flag.
