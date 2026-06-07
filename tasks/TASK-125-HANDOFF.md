Equipo:
Backend API

Tarea completada:
TASK-125 - Preparar implementacion base Backend multiempresa sin providers reales.

Archivos modificados:
- api/src/lib/validators.js
- api/src/lib/repository.js
- api/src/lib/errors.js
- api/test/validators.test.js
- api/test/repository-formatters.test.js
- api/test/errors.test.js
- tasks/TASK-125-HANDOFF.md

No se cambio:
- No se expusieron endpoints nuevos.
- No se envio correo real.
- No se uso Entra External ID real.
- No se subio logo a Blob Storage real.
- No se aplico migracion SQL.
- No se cambio frontend.
- No se agregaron secretos ni app settings.

## Que quedo preparado

Validadores internos multiempresa en `api/src/lib/validators.js`:
- `validateCompanyRegistrationRequestPayload`
  - requiere `companyAddress`;
  - normaliza `companyEmail` y `contactEmail` con trim/lowercase;
  - rechaza `requestedLogoUrl`, `companyId` y `password`.
- `validateCompanyRegistrationReviewPayload`
  - soporta approve/reject;
  - requiere `reviewNote` para rechazo;
  - valida `pointsPercentage` si se provee.
- `validateCompanyInvitationPayload`
  - valida `companyId`, `registrationRequestId`, email normalizado y rol.
- `validateInvitationAcceptPayload`
  - requiere token;
  - rechaza `password` y `externalSubject` enviados por frontend.
- `validateMyCompanyPatchPayload`
  - permite `name`, `phone`, `address`, `pointsPercentage`;
  - rechaza `email`, `status`, `logoUrl`, `logoBlobPath`, `companyId`.
- `validateLogoFileMetadata`
  - valida MIME puro para `image/png`, `image/jpeg`, `image/webp`;
  - valida tamano contra `LOGO_MAX_BYTES` o parametro;
  - rechaza SVG.
- Helpers:
  - `normalizeEmail`
  - `validateCompanyRole`
  - `isAllowedCompanyStatus`
  - `isAllowedRegistrationRequestStatus`
  - `isAllowedInvitationStatus`
  - `isAllowedCompanyUserStatus`

Formatters internos en `api/src/lib/repository.js`:
- `mapCompanyRegistrationRequest`
- `mapCompanyInvitation`
- `mapCompanyUser`
- `mapMyCompany`

Estos formatters:
- serializan IDs `bigint` como string;
- serializan timestamps UTC;
- no exponen `token_hash`;
- no exponen `external_subject`;
- no exponen `logo_blob_path`;
- exponen logo como ruta controlada `/api/my-company/logo` cuando existe blob.

Errores SQL en `api/src/lib/errors.js`:
- `UX_Companies_email` -> `409 COMPANY_ALREADY_EXISTS`
- `UX_CompanyRegistrationRequests_pending_company_email` -> `409 REGISTRATION_ALREADY_PENDING`
- `UX_CompanyInvitations_pending_company_email` -> `409 INVITATION_ALREADY_PENDING`
- `UX_CompanyUsers_company_email` -> `409 COMPANY_USER_ALREADY_EXISTS`
- `UX_CompanyUsers_auth_subject` -> `409 COMPANY_USER_ALREADY_EXISTS`

## Pruebas ejecutadas

Comando:

```text
npm test
```

Resultado:
- Primer intento dentro del sandbox fallo con `spawn EPERM`, antes de ejecutar tests reales.
- Se repitio con permiso elevado por la limitacion del runner `node --test`.
- Resultado final: 40/40 tests pasando.

Cobertura agregada:
- Registro multiempresa con address requerido y emails normalizados.
- Rechazo de campos prohibidos en registro.
- Review approve/reject.
- Invitacion con roles permitidos.
- Estados/roles permitidos.
- Accept invite sin password ni externalSubject desde frontend.
- Patch de Mi empresa sin campos controlados.
- Logo MIME/tamano/SVG.
- Formatters multiempresa sin exponer datos sensibles.
- Mapeo de constraints SQL nuevas.

## Que sigue bloqueado

SQL:
- Aplicar `database/migrations/20260607_company_registration_invitations.sql` en ambiente objetivo.
- Ejecutar prevalidaciones de duplicados/status/auditoria antes de aplicar.

Azure:
- ACS Email real y app settings `ACS_EMAIL_*`.
- Entra External ID real y app settings `AUTH_*`.
- Blob Storage privado, Managed Identity/rol o credencial aprobada y app settings `LOGO_*`.

Contratos/decision:
- Confirmar claim estable de Entra que sera `external_subject`.
- Confirmar mecanismo de admin interno para aprobar/rechazar solicitudes e invitar empresas.
- Confirmar si aceptar invitacion owner activa `Companies.status = active`.
- Confirmar `LOGO_SERVE_MODE=api|short_sas`.

Implementacion pendiente:
- Repositorios SQL para registration requests.
- Endpoints reales.
- Adapters mock/reales de email/auth/storage.
- Aislamiento multiempresa en endpoints operativos existentes.
- QA de aislamiento por empresa.

## Riesgos

- Esta base no activa multiempresa productivo por si sola.
- Usar estos validadores en endpoints reales antes de resolver auth/mapeo `CompanyUsers -> company_id` no seria suficiente para aislar empresas.
- El upload real de logo sigue bloqueado hasta storage privado y validacion de contenido en capa de archivo.
- El envio real de invitaciones sigue bloqueado hasta ACS Email y politica de logging sin tokens.
