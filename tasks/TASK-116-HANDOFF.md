Equipo:
Backend API

Tarea completada:
TASK-116 - Definir contratos API para registro e invitacion de empresas.

Archivos cambiados:
- docs/TASK_BOARD.md
- tasks/TASK-116-HANDOFF.md

Verificacion ejecutada:
- Leido `tasks/TASK-116-assignment.md`.
- Leido `docs/TASK_BOARD.md`.
- Confirmado que `TASK-116` estaba en `Assigned`, asignada a Backend API.
- Confirmado que dependencias `TASK-113`, `TASK-114` y `TASK-115` estan en `Done`.
- Movida `TASK-116` de `Assigned` a `In Progress`.
- Leidos handoffs:
  - `tasks/TASK-113-HANDOFF.md`
  - `tasks/TASK-114-HANDOFF.md`
  - `tasks/TASK-115-HANDOFF.md`
- Leidos docs tecnicos relevantes:
  - `AGENTS.md`
  - `docs/API_CONTRACTS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DATA_MODEL.md`
- No se ejecuto `func start` ni `npm test` porque el alcance es contrato/documentacion, sin codigo.

Resultado:
Contratos API propuestos para registro de empresas, invitacion, validacion de invite, acceso, Mi empresa y logo upload. No se implementaron endpoints, SQL, auth, email ni storage.

## Resumen de arquitectura recomendada

Basado en TASK-113, TASK-114 y TASK-115:

- Email transaccional: Azure Communication Services Email.
- Auth/password: Microsoft Entra External ID como objetivo recomendado.
- Logo upload: Azure Blob Storage privado, validado y controlado por Backend/API.
- SQL futuro: `CompanyRegistrationRequests`, `CompanyInvitations`, `CompanyUsers` y ampliacion controlada de `Companies`.
- UX: menu lateral con `Operaciones`, `Mi empresa` y `Reportes`.

Principio de seguridad:
- El `companyId` efectivo de endpoints operativos multiempresa debe venir del usuario autenticado y su mapeo SQL, no del frontend.
- Mientras no se implemente auth multiempresa, los endpoints operativos actuales deben seguir en modo empresa piloto unica con `PILOT_COMPANY_ID`.

## Convenciones nuevas propuestas

Base API:

```text
/api
```

IDs:
- IDs SQL `bigint` serializados como string.

Timestamps:
- UTC ISO 8601.

Estados sugeridos:
- Registration request: `pending`, `approved`, `rejected`, `cancelled`.
- Invitation: `pending`, `accepted`, `revoked`, `expired`.
- Company: `pending_activation`, `active`, `inactive`.
- Company user: `invited`, `active`, `disabled`.

Errores nuevos sugeridos:

| HTTP | Code | Uso |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Payload invalido, token mal formado, archivo invalido. |
| 401 | `UNAUTHORIZED` | Falta token/JWT valido para endpoint autenticado. |
| 403 | `FORBIDDEN` | Usuario autenticado no pertenece a la empresa o no tiene rol requerido. |
| 404 | `COMPANY_NOT_FOUND` | Empresa no existe o no esta disponible para el usuario. |
| 404 | `INVITATION_NOT_FOUND` | Invite no existe, no es valido o no debe revelarse. |
| 409 | `COMPANY_ALREADY_EXISTS` | Email de empresa ya registrado/activo. |
| 409 | `REGISTRATION_ALREADY_PENDING` | Ya hay solicitud pendiente para ese email. |
| 409 | `INVITATION_ALREADY_ACCEPTED` | Invite ya fue usado. |
| 409 | `INVITATION_EXPIRED` | Invite expiro. |
| 413 | `UPLOAD_TOO_LARGE` | Logo excede limite permitido. |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Tipo de archivo no permitido. |
| 429 | `RATE_LIMITED` | Mitigacion basica ante abuso. |
| 500 | `INTERNAL_ERROR` | Error inesperado sin detalles internos. |

Formato de error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "companyEmail",
        "message": "Company email must be valid."
      }
    ]
  }
}
```

## Endpoints publicos o pre-auth

### POST `/api/company-registration-requests`

Registra una solicitud de empresa. No crea acceso operativo inmediato.

Payload:

```json
{
  "companyName": "Cafe Central",
  "companyEmail": "hola@cafecentral.test",
  "companyPhone": "+50622223333",
  "contactName": "Maria Soto",
  "contactEmail": "maria@cafecentral.test",
  "contactPhone": "+50688887777",
  "requestedLogoUrl": null
}
```

Respuesta `201`:

```json
{
  "id": "200",
  "companyName": "Cafe Central",
  "companyEmail": "hola@cafecentral.test",
  "status": "pending",
  "createdAt": "2026-06-07T18:30:00Z",
  "message": "Solicitud recibida."
}
```

Validaciones:
- `companyName` requerido, maximo 160.
- `companyEmail` requerido, email valido, maximo 254.
- `companyPhone` opcional, maximo 32.
- `contactName` opcional/recomendado, maximo 160.
- `contactEmail` requerido, email valido, maximo 254.
- `contactPhone` opcional, maximo 32.
- `requestedLogoUrl` opcional, URL `http(s)` si se permite URL externa temporal.

Comportamiento:
- Crear `CompanyRegistrationRequests.status = pending`.
- No crear empresa activa ni permitir acceso operativo.
- Notificar internamente a `INTERNAL_NOTIFICATION_EMAIL`.
- Opcional: enviar acuse de recibo al contacto si Product lo aprueba.

Errores:
- `400 VALIDATION_ERROR`.
- `409 REGISTRATION_ALREADY_PENDING`.
- `409 COMPANY_ALREADY_EXISTS`.
- `429 RATE_LIMITED`.

### POST `/api/company-invitations`

Envia o reenvia invitacion para una empresa. Recomendado como endpoint interno/admin hasta que Product decida aprobacion manual.

Auth:
- Requiere usuario interno/admin cuando exista auth.
- En fase inicial puede quedar detras de proceso operativo, no publico.

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
  "expiresAt": "2026-06-14T18:30:00Z",
  "createdAt": "2026-06-07T18:30:00Z"
}
```

Validaciones:
- `companyId` requerido y empresa `pending_activation` o `active`.
- `registrationRequestId` opcional y debe corresponder a la empresa si se envia.
- `email` requerido y valido.
- `role` permitido: `owner`, `admin`, `staff`; default recomendado `owner`.

Comportamiento:
- Generar token de invitacion server-side con entropia suficiente.
- Guardar solo `token_hash`, nunca token plano.
- Enviar link por ACS Email usando `APP_PUBLIC_BASE_URL`.
- Notificar internamente a `INTERNAL_NOTIFICATION_EMAIL` si Product lo mantiene como requisito.
- Si existe invite pendiente para mismo email/empresa, decidir entre `409` o rotacion/reenvio controlado. Recomendacion: endpoint separado para reenvio.

Errores:
- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `404 COMPANY_NOT_FOUND`.
- `409 COMPANY_ALREADY_EXISTS`.
- `409 REGISTRATION_ALREADY_PENDING` si hay conflicto de flujo.
- `429 RATE_LIMITED`.

### POST `/api/company-invitations/{invitationId}/resend`

Reenvia una invitacion pendiente sin crear otra fila.

Auth:
- Admin interno o usuario con rol `owner/admin` de la empresa.

Respuesta `200`:

```json
{
  "id": "300",
  "status": "pending",
  "email": "hola@cafecentral.test",
  "expiresAt": "2026-06-14T18:30:00Z",
  "resentAt": "2026-06-07T19:00:00Z"
}
```

Errores:
- `404 INVITATION_NOT_FOUND`.
- `409 INVITATION_ALREADY_ACCEPTED`.
- `409 INVITATION_EXPIRED`, salvo que Product apruebe renovar expiracion en reenvio.

### GET `/api/company-invitations/validate?token=...`

Valida token de invitacion antes de mostrar pantalla de crear acceso.

Respuesta `200`:

```json
{
  "valid": true,
  "invitationId": "300",
  "companyId": "10",
  "companyName": "Cafe Central",
  "email": "hola@cafecentral.test",
  "role": "owner",
  "expiresAt": "2026-06-14T18:30:00Z"
}
```

Respuesta sugerida para token invalido, expirado o usado:

```json
{
  "valid": false,
  "reason": "expired"
}
```

Validaciones:
- `token` requerido.
- Comparar hash del token recibido contra `CompanyInvitations.token_hash`.
- No devolver token ni hash.
- No revelar si un email existe.

Errores:
- `400 VALIDATION_ERROR` si falta token o formato imposible.
- `200 valid=false` para estados esperados de UX, o `404 INVITATION_NOT_FOUND` si se prefiere contrato estricto.

Recomendacion Backend:
- Usar `200 valid=false` para que Web pueda mostrar mensaje claro sin tratarlo como error tecnico.

### POST `/api/company-invitations/accept`

Acepta invitacion y completa acceso.

Opcion recomendada con Entra External ID:

```json
{
  "token": "raw-invite-token",
  "externalSubject": "entra-subject",
  "displayName": "Maria Soto"
}
```

Opcion fallback si Product decide password local:

```json
{
  "token": "raw-invite-token",
  "password": "never-log-this",
  "displayName": "Maria Soto"
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
  "createdAt": "2026-06-07T18:35:00Z"
}
```

Comportamiento recomendado con Entra External ID:
- El password real lo gestiona Entra External ID, no la API.
- API acepta invite solo despues de validar identidad externa/claim del usuario.
- Crear o activar `CompanyUsers` con `auth_provider = external` y `external_subject`.
- Marcar invitacion como `accepted`.
- Activar empresa si Product decide que aceptar invite activa empresa.

Comportamiento fallback local:
- Hash server-side con algoritmo aprobado; nunca guardar password plano.
- Definir politica de password, reset, lockout y rotacion antes de implementar.
- No recomendado por Infra.

Errores:
- `400 VALIDATION_ERROR`.
- `404 INVITATION_NOT_FOUND`.
- `409 INVITATION_ALREADY_ACCEPTED`.
- `409 INVITATION_EXPIRED`.
- `409 COMPANY_ALREADY_EXISTS` si hay conflicto de unicidad al activar.
- `500 INTERNAL_ERROR` sin exponer proveedor auth/email.

## Endpoints autenticados de empresa

Estos endpoints requieren JWT valido y mapeo SQL `auth subject/email -> CompanyUsers -> company_id`.

### GET `/api/me`

Devuelve identidad efectiva y empresa activa para la sesion.

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

Uso:
- Web deja de depender de `PILOT_COMPANY_ID` cuando multiempresa este activo.
- La API usa este mapeo para autorizar endpoints operativos.

Errores:
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN` si usuario no esta activo o no tiene empresa.

### GET `/api/my-company`

Consulta datos de Mi empresa para el usuario autenticado.

Respuesta `200`:

```json
{
  "id": "10",
  "name": "Cafe Central",
  "email": "hola@cafecentral.test",
  "phone": "+50622223333",
  "logoUrl": "https://controlled-url-or-api-route",
  "pointsPercentage": 5,
  "status": "active",
  "updatedAt": "2026-06-07T18:35:00Z"
}
```

Regla:
- No recibe `companyId` desde frontend.
- `companyId` sale de la sesion/JWT + `CompanyUsers`.

### PATCH `/api/my-company`

Actualiza datos editables de Mi empresa.

Payload:

```json
{
  "name": "Cafe Central",
  "phone": "+50622223333",
  "pointsPercentage": 6
}
```

Campos editables iniciales:
- `name`
- `phone`
- `pointsPercentage`
- `logoUrl` solo si se decide seguir permitiendo URL externa.

Campos no recomendados como self-service sin verificacion:
- `email` de acceso/empresa. Requiere flujo de cambio de email o aprobacion.
- `status`. Solo admin/proceso interno.

Validaciones:
- Mismas reglas de `PATCH /api/companies/{companyId}/settings` donde apliquen.
- Requiere rol `owner` o `admin`.
- `pointsPercentage` afecta compras futuras; no recalcula historicos.

Respuesta `200`:
- Mismo formato de `GET /api/my-company`.

Errores:
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `400 VALIDATION_ERROR`.
- `404 COMPANY_NOT_FOUND`.

### GET `/api/my-company/invitations`

Lista invitaciones de la empresa autenticada.

Auth:
- Rol `owner` o `admin`.

Respuesta `200`:

```json
{
  "items": [
    {
      "id": "300",
      "email": "staff@cafecentral.test",
      "role": "staff",
      "status": "pending",
      "expiresAt": "2026-06-14T18:30:00Z",
      "createdAt": "2026-06-07T18:30:00Z"
    }
  ]
}
```

### POST `/api/my-company/invitations`

Invita otro usuario de la empresa autenticada.

Payload:

```json
{
  "email": "staff@cafecentral.test",
  "role": "staff"
}
```

Validaciones:
- `email` requerido, valido.
- `role` permitido y no superior al rol del actor.
- No permitir duplicado pendiente para mismo email/empresa.

Respuesta `201`:
- Mismo formato de item de invitacion.

## Logo upload

### POST `/api/my-company/logo`

Sube logo de empresa a storage privado.

Auth:
- Rol `owner` o `admin`.

Request:
- `multipart/form-data`
- Campo `file`.

Tipos permitidos:
- `image/png`
- `image/jpeg`
- `image/webp`

No permitir:
- `image/svg+xml` en piloto.
- Archivos sin MIME detectable.
- Archivos mayores al limite aprobado, recomendado 1 MB o 2 MB.

Respuesta `200`:

```json
{
  "logoUrl": "/api/my-company/logo",
  "contentType": "image/png",
  "updatedAt": "2026-06-07T18:35:00Z"
}
```

Comportamiento:
- Validar MIME y extension server-side.
- Generar blob path server-side: `companies/{companyId}/logo/{uuid}.{ext}`.
- Guardar en SQL solo referencia controlada: `logo_blob_path` futuro o `logo_url` si Product acepta ruta API.
- No exponer connection strings ni SAS largos.
- Actualizar `Companies.updated_at`.

Errores:
- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `413 UPLOAD_TOO_LARGE`.
- `415 UNSUPPORTED_MEDIA_TYPE`.

### GET `/api/my-company/logo`

Sirve logo actual o redirige a SAS corto de lectura.

Recomendacion:
- Para piloto, servir por API o generar SAS corto server-side.
- No habilitar public blob access.

Respuesta:
- `200 image/png|image/jpeg|image/webp`, o
- `302` a SAS corto si Infra lo aprueba.

Errores:
- `404 COMPANY_LOGO_NOT_FOUND` si no hay logo.

## Notificacion interna a Product Owner

La notificacion interna no necesita endpoint publico separado si se dispara desde:
- `POST /api/company-registration-requests`
- `POST /api/company-invitations`

Si Product quiere reintento manual:

### POST `/api/company-registration-requests/{requestId}/notify-owner`

Auth:
- Admin interno.

Respuesta `202`:

```json
{
  "requestId": "200",
  "sentTo": "pj13eros_business@outlook.com",
  "status": "queued"
}
```

Recomendacion:
- Mantener esto interno/admin; no exponer a empresa final.

## Seguridad server-side

Fuente confiable de `companyId`:
- Fase actual piloto: `PILOT_COMPANY_ID` en app settings.
- Fase multiempresa: JWT validado + mapeo SQL `CompanyUsers.external_subject/email -> company_id`.
- El frontend nunca es autoridad para separar empresas.

Aislamiento:
- Cada query operativa debe filtrar por `company_id` efectivo.
- Si se conservan rutas `/api/companies/{companyId}/...`, validar que el path coincide con el `company_id` autorizado.
- Alternativa recomendada para nueva UI multiempresa: endpoints `/api/my-company` y `/api/me` para evitar depender del path.

Tokens e invitaciones:
- Token raw solo vive en email/link.
- SQL guarda `token_hash` con SHA-256/HMAC o estrategia equivalente.
- Expiracion default recomendada: 7 dias, pendiente de Product.
- Aceptar invite debe ser transaccional: marcar invite accepted, crear usuario y activar empresa si aplica.
- No loggear token, password, JWT, connection strings ni links completos con token.

Rate limit / mitigaciones:
- Aplicar rate limit por IP y email normalizado en:
  - `POST /company-registration-requests`
  - `GET /company-invitations/validate`
  - `POST /company-invitations/accept`
  - reenvios de invitacion
- Responder `429 RATE_LIMITED` con mensaje generico.
- Agregar captcha o aprobacion interna si aparece abuso.

Auth:
- Recomendado: Entra External ID.
- API valida issuer, audience, firma/JWKS y expiracion.
- Rechazar tokens sin mapeo activo en `CompanyUsers`.
- Roles iniciales: `owner`, `admin`, `staff`.

## Eventos de auditoria propuestos

Eventos:
- `company.registration.submitted`
- `company.registration.approved`
- `company.registration.rejected`
- `company.invitation.created`
- `company.invitation.resent`
- `company.invitation.accepted`
- `company.invitation.revoked`
- `company.user.created`
- `company.user.disabled`
- `company.logo.updated`
- `company.settings.updated` ya existe por TASK-108/TASK-112.

Metadata segura:
- `registrationRequestId`
- `invitationId`
- `changedFields`
- `role`
- `emailDomain` o `emailHash` si se quiere reducir PII.
- No guardar token raw, password, JWT ni SAS.

Impacto SQL:
- `OperationalAuditEvents` tiene checks cerrados.
- Para estos eventos, SQL debe ampliar checks o migrar a catalogo `AuditEventTypes`.
- Recomendacion: catalogo de tipos si se confirma esta fase, para evitar migracion por cada evento nuevo.

## Compatibilidad con empresa piloto actual

Estado recomendado:
- Mantener endpoints existentes y `PILOT_COMPANY_ID`.
- No romper:
  - clientes
  - compras
  - redenciones
  - historial
  - reportes
  - auditoria
  - settings de empresa piloto

Transicion posible:
1. Mantener `GET/PATCH /api/companies/{companyId}/settings` para piloto.
2. Agregar `/api/me` y `/api/my-company` cuando auth este listo.
3. Adaptar frontend multiempresa a `/api/me` para resolver empresa activa.
4. Conservar rutas `/api/companies/{companyId}/...` validando path contra empresa autorizada, o crear alias `/api/my-company/...` gradualmente.

No recomendado:
- Permitir que una empresa nueva opere datos antes de tener auth/autorizacion server-side.
- Usar `companyId` editable en frontend.
- Implementar password propio salvo decision explicita.

## Decisiones pendientes para Product / Architect / Release

- Confirmar si registro de empresa es publico, interno/admin o mixto.
- Confirmar si solicitud requiere aprobacion interna antes de enviar invite.
- Confirmar si aceptar invite activa empresa automaticamente.
- Confirmar expiracion de invitacion, recomendado 7 dias.
- Confirmar proveedor auth: Entra External ID recomendado por Infra.
- Confirmar si se permite fallback de password local. Backend/API no lo recomienda.
- Confirmar storage de logo: storage dedicado vs contenedor privado en storage existente.
- Confirmar limite final de logo: 1 MB o 2 MB.
- Confirmar si `email` de empresa puede cambiarse desde Mi empresa o requiere flujo separado.
- Confirmar si se crea catalogo de eventos de auditoria.
- Confirmar si `address` sera requerido. UX lo menciona como requerido o recomendado, pero SQL propuesto no lo incluye en `Companies`.

## Riesgos

- P0: Confiar en `companyId` del frontend mezclaria datos entre empresas.
- P0: Guardar token de invitacion o password en texto plano.
- P1: Implementar auth local introduce superficie de seguridad que Entra External ID ya resuelve.
- P1: Checks cerrados de auditoria bloquearan eventos nuevos si no se migran.
- P1: Registro publico sin rate limit/aprobacion puede generar abuso.
- P1: Upload de logo sin validacion server-side puede exponer contenido malicioso.
- P2: ACS con dominio administrado puede afectar confianza; dominio propio mejora entrega.
- P2: `address` no esta resuelto entre UX y SQL.

## Siguiente recomendado

Product / Architect / Release debe usar este handoff en TASK-119 para decidir arquitectura final antes de cualquier implementacion. Backend/API queda listo para una futura tarea de implementacion solo despues de confirmar auth, email, storage, SQL aplicado y politica de aprobacion.
