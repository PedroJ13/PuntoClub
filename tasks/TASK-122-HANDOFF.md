Equipo:
Backend API

Tarea completada:
TASK-122 - Revisar migracion SQL contra contratos API multiempresa.

Archivos cambiados:
- tasks/TASK-122-HANDOFF.md

No se cambio:
- Codigo API.
- Contratos versionados en `docs/API_CONTRACTS.md`.
- Migraciones SQL.
- Recursos Azure.
- Secretos/configuracion.

Verificacion ejecutada:
- Leido `AGENTS.md`.
- Leido `chat-start/BACKEND_API.md`.
- Leido `docs/README.md`.
- Leido `docs/MVP_RELEASE_STATUS.md`.
- Leido `docs/API_CONTRACTS.md` porque la tarea toca contratos.
- Leido `docs/DATA_MODEL.md` porque la tarea toca modelo.
- Leido `tasks/TASK-122-assignment.md`.
- Leido `tasks/TASK-116-HANDOFF.md`.
- Leido `tasks/TASK-120-HANDOFF.md`.
- Leido `tasks/TASK-121-HANDOFF.md`.
- Leido `database/migrations/20260607_company_registration_invitations.sql`.
- No se ejecuto `func start` ni tests porque el alcance era revision estatica/documental, sin codigo.

## Resultado de revision

La migracion `database/migrations/20260607_company_registration_invitations.sql` soporta la direccion general de los contratos API de TASK-116 y la arquitectura decidida despues en TASK-119/TASK-120:

- Empresas con ciclo `pending_activation`, `active`, `inactive`.
- Solicitudes de registro en `CompanyRegistrationRequests`.
- Invitaciones en `CompanyInvitations` con `token_hash varbinary(32)`, expiracion y estados.
- Usuarios de empresa en `CompanyUsers`, usando solo `entra_external_id`.
- Logo privado representado por `logo_blob_path`, `logo_content_type`, `logo_updated_at`.
- Auditoria ampliada para registro, invitaciones, usuarios y logo.
- Unicidad filtrada para emails de empresa y solicitudes/invitaciones pendientes.

Conclusion:
- La migracion es apta como base para implementar contratos multiempresa controlado.
- Backend/API debe ajustar el contrato de TASK-116 antes de codificar, porque la migracion incorpora decisiones posteriores: `address` requerido, logo por blob privado y Entra External ID obligatorio.

## Gaps o ajustes recomendados

### 1. `address` ahora es requerido

SQL:
- `CompanyRegistrationRequests.company_address nvarchar(300) NOT NULL`.
- `Companies.address nvarchar(300) NULL`, agregado para perfil/configuracion.

Ajuste API:
- `POST /api/company-registration-requests` debe requerir `companyAddress`.
- `companyAddress` maximo 300 caracteres.
- `GET/PATCH /api/my-company` debe exponer/permitir editar `address` cuando multiempresa este activo.

Payload recomendado actualizado:

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

### 2. Logo URL externa queda reemplazada por blob privado

SQL:
- `Companies.logo_blob_path`
- `Companies.logo_content_type`
- `Companies.logo_updated_at`
- `CompanyRegistrationRequests.requested_logo_blob_path`
- `CompanyRegistrationRequests.requested_logo_content_type`

Ajuste API:
- No aceptar `requestedLogoUrl` para registro multiempresa nuevo.
- No aceptar `logoUrl` arbitrario en `PATCH /api/my-company`.
- Usar upload controlado:
  - `POST /api/my-company/logo`
  - opcional futuro: `POST /api/company-registration-requests/{requestId}/logo` si Product quiere logo antes de aprobar.
- Responder `logoUrl` como ruta controlada API o URL/SAS corto generado server-side, no como valor editable.

### 3. Entra External ID es obligatorio

SQL:
- `CompanyUsers.auth_provider` solo acepta `entra_external_id`.
- `CompanyUsers.external_subject nvarchar(255) NOT NULL`.
- No existen columnas de password local.

Ajuste API:
- El endpoint `POST /api/company-invitations/accept` no debe aceptar `password`.
- La API debe aceptar/derivar `externalSubject` desde JWT validado de Entra, no desde frontend como fuente confiable.
- Para pruebas locales puede existir auth adapter/mock, pero el contrato productivo no debe permitir password propio.

Contrato recomendado para aceptar invitacion:

```json
{
  "token": "raw-invite-token",
  "displayName": "Maria Soto"
}
```

Regla:
- `externalSubject`, email y claims salen del JWT validado.

### 4. Falta contrato explicito de aprobacion de solicitud

SQL soporta:
- `CompanyRegistrationRequests.status`
- `reviewed_at`
- `reviewed_by_label`
- `review_note`
- `approved_company_id`
- `Companies.status = pending_activation`

TASK-116 definio registro e invitacion, pero no dejo cerrado el endpoint que convierte solicitud en empresa.

Endpoints recomendados antes de invitaciones:

```text
POST /api/company-registration-requests/{requestId}/approve
POST /api/company-registration-requests/{requestId}/reject
```

`approve` debe:
- Crear fila en `Companies` con `status = pending_activation`.
- Copiar `company_name`, `company_email`, `company_phone`, `company_address`.
- Setear `points_percentage` default definido por Product/Backend, por ejemplo el default actual de empresa piloto si se aprueba.
- Actualizar request a `approved`, `reviewed_at`, `reviewed_by_label`, `approved_company_id`.
- Opcionalmente crear invitacion owner en la misma transaccion o dejarlo para `POST /api/company-invitations`.

Sin este paso, `POST /api/company-invitations` no tiene `company_id` confiable para una solicitud nueva.

### 5. Reenvio de invitacion no tiene columnas dedicadas

SQL:
- `CompanyInvitations` tiene `created_at`, `expires_at`, `status`, pero no `last_sent_at`, `resent_count`, `delivery_status`.

Impacto:
- `POST /api/company-invitations/{invitationId}/resend` puede funcionar enviando email y devolviendo timestamp calculado por API, pero no persistira historial de reenvios.

Recomendacion:
- Para MVP controlado, aceptar sin columnas extra.
- Si Product quiere trazabilidad de reenvios, pedir SQL futuro:
  - `last_sent_at datetime2(0) NULL`
  - `resent_count int NOT NULL DEFAULT 0`
  - o tabla `CompanyInvitationEmailDeliveries`.

### 6. Estados expirados requieren logica API

SQL:
- `CompanyInvitations.status` permite `expired`, pero no hay job que expire automaticamente.

Regla Backend:
- Cualquier query/validacion debe tratar `status='pending' AND expires_at < SYSUTCDATETIME()` como expirado.
- Opcional: al validar/aceptar, actualizar status a `expired` best-effort.

### 7. Auditoria ampliada pero aun con check cerrado

SQL:
- Amplia `CK_OperationalAuditEvents_event_type` y `entity_type`.

Soporta eventos:
- `company.registration.submitted`
- `company.registration.approved`
- `company.registration.rejected`
- `company.invitation.created`
- `company.invitation.accepted`
- `company.invitation.revoked`
- `company.user.created`
- `company.user.disabled`
- `company.logo.updated`
- `company.settings.updated`

Gap:
- TASK-116 propuso `company.invitation.resent`, pero la migracion no lo incluye.

Recomendacion:
- No auditar `company.invitation.resent` por ahora, o pedir una mini migracion si Product lo necesita.
- Para MVP: auditar `created`, `accepted`, `revoked`; registrar reenvio solo en logs de App Insights sin evento SQL.

### 8. Unicidad y normalizacion de email

SQL:
- `UX_Companies_email` por email no NULL.
- `UX_CompanyRegistrationRequests_pending_company_email` por solicitud pendiente.
- `UX_CompanyInvitations_pending_company_email` por empresa/email pendiente.
- `UX_CompanyUsers_company_email` por empresa/email.
- `UX_CompanyUsers_auth_subject` global por provider/subject.

Regla Backend:
- Normalizar emails antes de persistir: trim + lowercase.
- Mapear errores SQL de unicidad a:
  - `COMPANY_ALREADY_EXISTS`
  - `REGISTRATION_ALREADY_PENDING`
  - `INVITATION_ALREADY_PENDING`
  - `COMPANY_USER_ALREADY_EXISTS`

### 9. `updated_at` depende de Backend/API

SQL no usa triggers.

Backend debe setear `updated_at = SYSUTCDATETIME()` al modificar:
- `Companies`.
- `CompanyRegistrationRequests`.
- `CompanyUsers`.

`CompanyInvitations` no tiene `updated_at`; usar `accepted_at`/`revoked_at` segun operacion.

## Contratos API ajustados recomendados

### Registro

```text
POST /api/company-registration-requests
```

Requiere:
- `companyName`
- `companyEmail`
- `companyAddress`
- `contactEmail`

Opcionales:
- `companyPhone`
- `contactName`
- `contactPhone`

No aceptar:
- `requestedLogoUrl`.
- password.
- `companyId`.

### Aprobacion interna

```text
POST /api/company-registration-requests/{requestId}/approve
POST /api/company-registration-requests/{requestId}/reject
```

Requiere auth/admin interno o feature flag operativo si aun no existe admin.

### Invitacion

```text
POST /api/company-invitations
POST /api/company-invitations/{invitationId}/resend
GET /api/company-invitations/validate?token=...
POST /api/company-invitations/accept
```

Ajustes:
- `accept` usa JWT de Entra para `external_subject`.
- No password local.
- Reenvio no auditable SQL por ahora salvo nueva migracion.

### Identidad y empresa

```text
GET /api/me
GET /api/my-company
PATCH /api/my-company
POST /api/my-company/logo
GET /api/my-company/logo
```

Ajustes:
- `GET/PATCH /api/my-company` debe incluir `address`.
- Logo solo por upload privado.

## Orden de implementacion Backend/API propuesto

### Tarea API 1 - Base de validadores/formatters multiempresa sin providers

Alcance:
- Validadores para:
  - registro de empresa con `companyAddress`.
  - approve/reject request.
  - roles `owner/admin/staff`.
  - email normalizado.
  - invite token requerido.
- Formatters para:
  - registration request.
  - company invitation.
  - company user.
  - my-company con `address` y metadata de logo.
- Mapeo de errores SQL nuevos.

Puede hacerse antes de recursos Azure:
- Si.

Pruebas:
- Unitarias puras de validators/formatters/errors.

### Tarea API 2 - Repositorio SQL de solicitudes y aprobacion

Alcance:
- Crear `CompanyRegistrationRequests`.
- Consultar request por id.
- Aprobar/rechazar request.
- Crear `Companies.status='pending_activation'` en transaccion al aprobar.
- Auditar `company.registration.submitted|approved|rejected` best-effort.

Puede hacerse antes de recursos Azure:
- Si, despues de aplicar migracion SQL en ambiente objetivo o con tests unitarios/mocks.
- Sin ACS real, la notificacion interna debe ser mock/noop tras feature flag.

Bloqueante:
- Migracion SQL aplicada en ambiente donde se pruebe integracion real.

### Tarea API 3 - Invitaciones sin envio real

Alcance:
- Crear invitacion con token raw generado por API y `token_hash`.
- Validar token.
- Manejar expiracion por `expires_at`.
- Revocar invitacion.
- Reenviar en modo mock/noop.
- Auditar `company.invitation.created|revoked`.

Puede hacerse antes de recursos Azure:
- Parcialmente si se usa email adapter mock y no se expone token en logs.

No hacer:
- No enviar correo real sin ACS/app settings.

Pruebas:
- Hash de token.
- No serializar token/hash en respuesta salvo solo en tests internos si se decide retornar link mock fuera de produccion.
- Expiracion.
- Duplicado pendiente por email/empresa.

### Tarea API 4 - Auth middleware Entra y `/api/me`

Alcance:
- Validar JWT issuer/audience/JWKS.
- Resolver `CompanyUsers` por `auth_provider='entra_external_id'` y `external_subject`.
- Rechazar usuarios disabled/no mapeados.
- Exponer `/api/me`.

Puede hacerse antes de recursos Azure:
- Unitariamente con JWT/JWKS mock.
- No validacion end-to-end publicada sin Entra External ID configurado.

Bloqueante para produccion:
- App settings `AUTH_ISSUER`, `AUTH_AUDIENCE`, `AUTH_JWKS_URI`, `AUTH_CLIENT_ID`.
- External tenant/app registration.

### Tarea API 5 - Accept invite con Entra External ID

Alcance:
- `POST /api/company-invitations/accept`.
- Requiere JWT validado.
- Token raw de invitacion + subject del JWT.
- Crear `CompanyUsers`.
- Marcar invitacion `accepted`.
- Activar `Companies.status='active'` si Product confirma activacion automatica.
- Auditar `company.invitation.accepted` y `company.user.created`.

Puede hacerse antes de recursos Azure:
- Solo con auth mock/local unit tests.

Bloqueante para real:
- Auth Entra configurado.
- Migracion aplicada.

### Tarea API 6 - `/api/my-company` y aislamiento operativo

Alcance:
- `GET /api/my-company`.
- `PATCH /api/my-company` con `name`, `phone`, `address`, `pointsPercentage`.
- Resolver company por usuario autenticado.
- Preparar patron para que endpoints operativos existentes validen company autorizada cuando se active multiempresa.

Puede hacerse antes de recursos Azure:
- Parcial con auth mock.

Riesgo:
- No reemplazar `PILOT_COMPANY_ID` de endpoints existentes hasta tener estrategia de convivencia y QA.

### Tarea API 7 - Logo upload privado

Alcance:
- `POST /api/my-company/logo`.
- Validar MIME/tamano.
- Subir a Blob privado.
- Guardar `logo_blob_path`, `logo_content_type`, `logo_updated_at`.
- `GET /api/my-company/logo` via API o SAS corto.
- Auditar `company.logo.updated`.

Puede hacerse antes de recursos Azure:
- Solo validadores y storage adapter mock.

Bloqueante real:
- Storage/container configurado.
- Managed Identity/rol o connection string.
- App settings `LOGO_*`.

### Tarea API 8 - ACS Email real

Alcance:
- Email adapter para ACS.
- Envio de invitacion.
- Notificacion interna.
- Logs controlados sin tokens completos ni secretos.

Puede hacerse antes de recursos Azure:
- Solo interfaz/mock.

Bloqueante real:
- ACS Email resource.
- Sender address.
- App settings `ACS_EMAIL_*`, `APP_PUBLIC_BASE_URL`, `INTERNAL_NOTIFICATION_EMAIL`, `INVITE_TOKEN_SECRET`.

## Endpoints que pueden implementarse antes de Azure resources reales

Con mocks/adapters/feature flags:
- Validadores/formatters.
- Repositorio SQL si migracion esta aplicada en local/dev.
- `POST /company-registration-requests` sin email real, usando notifier noop.
- Approve/reject de solicitud.
- Crear/validar/revocar invitaciones sin envio real.
- Tests unitarios de token hash/expiracion.
- Auth middleware con JWKS/JWT mock en unit tests.
- Logo validators con storage mock.

No deberian exponerse como flujo productivo sin recursos reales:
- Envio real de invitaciones.
- Aceptacion real de invite con Entra.
- `/api/me` productivo.
- `/api/my-company` productivo multiempresa.
- Upload/serve de logo productivo.
- Aislamiento multiempresa en endpoints operativos.

## Validaciones necesarias

Registro:
- `companyName`: requerido, trim, max 160.
- `companyEmail`: requerido, email, trim/lowercase, max 254.
- `companyAddress`: requerido, trim, max 300.
- `companyPhone`: opcional, max 32.
- `contactName`: opcional, max 160.
- `contactEmail`: requerido, email, trim/lowercase, max 254.
- `contactPhone`: opcional, max 32.

Invitacion:
- `companyId`: id positivo si endpoint admin lo recibe.
- `registrationRequestId`: id positivo si se envia.
- `email`: requerido, email, trim/lowercase.
- `role`: `owner`, `admin`, `staff`.
- `token`: requerido; no loggear; hashear antes de buscar.
- `expiresAt`: generado server-side.

Auth:
- JWT requerido en endpoints autenticados.
- Validar issuer/audience/firma/expiracion.
- Resolver `external_subject` desde claim estable aprobado.
- Usuario debe existir en `CompanyUsers` y `status='active'`.

Mi empresa:
- `name`: requerido/no vacio si se envia, max 160.
- `phone`: opcional, max 32.
- `address`: requerido/no vacio si se envia, max 300.
- `pointsPercentage`: > 0 y <= 100.
- `email`: no editable self-service en esta fase.

Logo:
- MIME permitido: `image/png`, `image/jpeg`, `image/webp`.
- Max bytes: usar `LOGO_MAX_BYTES`.
- No SVG.
- Extension coherente con MIME.
- Nombre/blob path generado server-side.

## Pruebas unitarias necesarias

- Validadores de registro con `companyAddress` requerido.
- Normalizacion lowercase de emails.
- Mapeo de errores SQL por indices:
  - `UX_Companies_email`
  - `UX_CompanyRegistrationRequests_pending_company_email`
  - `UX_CompanyInvitations_pending_company_email`
  - `UX_CompanyUsers_company_email`
  - `UX_CompanyUsers_auth_subject`
- Hash de invite token produce `varbinary(32)` equivalente SHA-256/HMAC.
- Validate invite:
  - token pendiente vigente.
  - token expirado.
  - token accepted/revoked.
  - token inexistente.
- Formatter de registration request/invitation/user/my-company.
- Auth middleware:
  - sin Authorization -> `401`.
  - token invalido -> `401`.
  - subject sin CompanyUsers -> `403`.
  - user disabled -> `403`.
  - user active -> contexto con `companyId`.
- Logo validator:
  - acepta png/jpeg/webp bajo limite.
  - rechaza svg.
  - rechaza exceso tamano.
- Auditoria metadata:
  - no contiene token raw, JWT, password, SAS ni connection strings.

## Riesgos

- P0: activar endpoints operativos multiempresa usando `companyId` de frontend antes de resolver auth/mapeo SQL.
- P0: loggear token raw de invitacion, JWT, SAS o secretos.
- P1: `CompanyRegistrationRequests.company_address NOT NULL` rompe contrato anterior si Web/API siguen enviando payload sin address.
- P1: `company.invitation.resent` no existe en check de auditoria; intentar auditarlo fallara.
- P1: aceptar invite sin JWT real permitiria vincular `external_subject` no confiable.
- P1: aplicar `UX_Companies_email` puede fallar si hay duplicados.
- P1: logo upload sin storage privado/validacion MIME puede exponer contenido inseguro.
- P2: sin columnas de reenvio/delivery, la trazabilidad de email queda limitada a ACS/App Insights.
- P2: `updated_at` depende de Backend/API, sin triggers SQL.

## Dependencias bloqueantes antes de codificar productivo

Para escribir codigo unitario/mocks:
- No hay bloqueos fuertes; se puede preparar validators, formatters, adapters y tests.

Para integrar contra SQL real:
- Migracion `20260607_company_registration_invitations.sql` aplicada en ambiente objetivo.
- Prevalidaciones SQL de TASK-121 sin conflictos.

Para envio real de email:
- ACS Email creado/configurado.
- App settings `ACS_EMAIL_*`, `APP_PUBLIC_BASE_URL`, `INTERNAL_NOTIFICATION_EMAIL`, `INVITE_TOKEN_SECRET`.

Para auth real:
- Entra External ID tenant/app/user flow configurado.
- App settings `AUTH_*`.
- Definir claim estable para `external_subject` y confirmarlo con Infra/Web.

Para logo real:
- Storage/container privado.
- Managed Identity/rol o credencial aprobada.
- App settings `LOGO_*`.

Para activar multiempresa operativo:
- QA de aislamiento por empresa.
- Decision de convivencia con `PILOT_COMPANY_ID`.
- Ajuste gradual de endpoints existentes para autorizar por usuario autenticado.

## Recomendacion final

Product / Architect / Release puede crear tareas Backend/API pequenas en este orden:

1. Validators/formatters/errors multiempresa.
2. Repository SQL para registration requests + approve/reject.
3. Invitation token repository + validate/revoke/mock send.
4. Auth middleware Entra con tests mock + `/api/me`.
5. Accept invitation con JWT + crear `CompanyUsers`.
6. `/api/my-company` con address y settings.
7. Logo upload con storage adapter.
8. ACS Email adapter real.
9. Convivencia/aislamiento de endpoints operativos existentes.

Antes de implementar endpoints publicos reales, actualizar contratos finales para reflejar:
- `companyAddress` requerido.
- Logo por blob privado, no URL externa.
- No password local.
- `externalSubject` derivado de JWT, no enviado por frontend.
- Endpoint de aprobacion/rechazo de solicitud.
