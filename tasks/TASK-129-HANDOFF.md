# TASK-129 - Handoff Backend/API

## Resumen

Se implemento la base Backend/API para solicitudes de registro de empresa y revision interna:

- `POST /api/company-registration-requests`
- `POST /api/company-registration-requests/{requestId}/approve`
- `POST /api/company-registration-requests/{requestId}/reject`

La revision interna queda protegida por feature flag operativo: `COMPANY_REGISTRATION_REVIEW_ENABLED=true`. Sin esa variable, approve/reject responden `403 FORBIDDEN`, para evitar activar endpoints internos sin auth real.

## Archivos modificados

- `api/src/functions/companyRegistrationRequests.js`
- `api/src/lib/companyRegistration.js`
- `api/src/lib/notifier.js`
- `api/src/lib/repository.js`
- `api/test/company-registration.test.js`
- `api/package.json`

## Endpoints implementados

### `POST /api/company-registration-requests`

- Valida payload con `validateCompanyRegistrationRequestPayload`.
- Crea registro en `dbo.CompanyRegistrationRequests`.
- Retorna respuesta publica compacta con `id`, datos base de empresa, `status`, `createdAt` y `message`.
- Usa notifier noop (`api/src/lib/notifier.js`), sin envio real de email.

### `POST /api/company-registration-requests/{requestId}/approve`

- Requiere `COMPANY_REGISTRATION_REVIEW_ENABLED=true`.
- Valida `requestId` y payload con `validateCompanyRegistrationReviewPayload(..., 'approve')`.
- En transaccion SQL:
  - bloquea solicitud pendiente con `UPDLOCK, HOLDLOCK`;
  - crea empresa en `dbo.Companies` con `status = 'pending_activation'`;
  - marca la solicitud como `approved`;
  - enlaza `approved_company_id`.
- Retorna la solicitud aprobada con objeto `company`.
- Registra best-effort `company.registration.approved` porque ya existe `company_id`.

### `POST /api/company-registration-requests/{requestId}/reject`

- Requiere `COMPANY_REGISTRATION_REVIEW_ENABLED=true`.
- Valida `requestId` y payload con `validateCompanyRegistrationReviewPayload(..., 'reject')`.
- Marca solicitudes pendientes como `rejected`.
- Retorna respuesta compacta con `id`, `status` y `reviewedAt`.

## Partes bloqueadas / no activadas

- No se envio email real: no se encontro handoff disponible de TASK-127 que confirme ACS listo.
- No se aplico ni valido migracion SQL real: no se encontro handoff disponible de TASK-128 que confirme migracion aplicada.
- No se crearon invitaciones reales; queda fuera de alcance de TASK-129.
- No se auditan `company.registration.submitted` ni `company.registration.rejected` por ahora: `dbo.OperationalAuditEvents.company_id` es `NOT NULL`, y antes de aprobar no existe `company_id` asociado a la solicitud.
- `approve` usa `pointsPercentage` del payload cuando viene; si no viene, aplica default backend `5`.

## Pruebas ejecutadas

- `npm test` desde `api/`.
- Primer intento en sandbox fallo por `spawn EPERM`.
- Reintento elevado aprobado/ejecutado correctamente.
- Resultado: 45 tests pasan.
- `node -e "require('./src/functions/companyRegistrationRequests')"` desde `api/`: carga sin errores; `@azure/functions` emitio warnings esperados de test mode fuera del runtime.

## Dependencias pendientes para integracion real

- Confirmar/aplicar migracion SQL de TASK-128 para `CompanyRegistrationRequests` y columnas/tablas multiempresa.
- Definir mecanismo real de auth/autorizacion interna para approve/reject; por ahora quedan detras de feature flag.
- Conectar notifier real cuando ACS/email quede listo.
- Definir una estrategia de auditoria para eventos sin `company_id` o ajustar el modelo de auditoria si Product/Arquitectura quiere auditar submitted/rejected antes de crear empresa.
