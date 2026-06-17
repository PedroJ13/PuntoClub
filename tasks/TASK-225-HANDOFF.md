# TASK-225 - Handoff Backend/API

Equipo: Backend/API

Modo de ejecucion: Backend/API

## Resultado

Completado.

Se ajusto Backend/API para soportar logo opcional en solicitud publica de empresa, transferir la referencia segura al aprobar y mejorar copy/formato de correos.

No se expusieron tokens, hashes, passwords, cookies, SAS, blob paths internos ni connection strings.

## Cambios realizados

### Solicitud publica de empresa

`POST /api/company-registration-requests` ahora soporta:

- JSON existente sin logo.
- `multipart/form-data` con:
  - campo `payload` con JSON de solicitud;
  - campo `file` opcional con logo.

Si hay logo:

- Se valida como PNG/JPEG/WebP.
- Se rechaza SVG.
- Se valida tamano con `LOGO_MAX_BYTES`.
- Se validan magic bytes basicos.
- Se sube a storage privado usando Managed Identity.
- Se guarda referencia segura en `CompanyRegistrationRequests`:
  - `requested_logo_blob_path`;
  - `requested_logo_content_type`.

La respuesta publica no devuelve blob path ni URL publica. Solo devuelve indicador seguro `requestedLogo`.

### Aprobacion de solicitud

`POST /api/company-registration-requests/{requestId}/approve` ahora:

- Lee metadata de logo solicitado desde la solicitud pendiente.
- Crea `Companies` copiando:
  - `logo_blob_path`;
  - `logo_content_type`;
  - `logo_updated_at` cuando existe logo.
- Devuelve en `company`:
  - `logoUrl: "/api/my-company/logo"` si hay logo;
  - `logoContentType`;
  - `logoUpdatedAt`.

No devuelve path interno ni SAS.

### Listado interno

`GET /api/company-registration-requests` ahora incluye indicador seguro:

```json
"requestedLogo": {
  "available": true,
  "contentType": "image/png"
}
```

### Emails

Se ajustaron asuntos/copy/HTML simple para:

- correo al solicitante confirmando recepcion;
- correo interno de nueva solicitud;
- correo de invitacion;
- correo interno de invitacion enviada.

El correo interno de solicitud incluye `Logo: Adjunto` o `Logo: No incluido`.

## Endpoints/contratos afectados

- `POST /api/company-registration-requests`
- `GET /api/company-registration-requests`
- `POST /api/company-registration-requests/{requestId}/approve`

El contrato sigue siendo seguro:

- no token raw;
- no `token_hash`;
- no password/password hash;
- no blob path interno;
- no SAS.

## Archivos cambiados

- `api/src/functions/companyRegistrationRequests.js`
- `api/src/lib/companyRegistration.js`
- `api/src/lib/logoStorage.js`
- `api/src/lib/notifier.js`
- `api/src/lib/repository.js`
- `api/test/company-registration.test.js`
- `api/test/logo-storage.test.js`
- `api/test/repository-approval.test.js`
- `api/test/repository-formatters.test.js`

## Pruebas ejecutadas

Primero se ejecuto:

```text
npm test
```

Resultado dentro del sandbox:

```text
spawn EPERM
```

Luego se ejecuto fuera del sandbox:

```text
npm test
```

Resultado:

```text
tests 102
pass 102
fail 0
```

## Riesgos o pendientes para Web Dev/QA

- Web Dev debe enviar `multipart/form-data` con `payload` JSON y `file` opcional desde `/company-registration`.
- Web Dev debe usar `requestedLogo.available` solo como indicador, no como imagen publica.
- QA debe validar:
  - solicitud sin logo;
  - solicitud con PNG/JPG/WebP;
  - rechazo de SVG/tipo invalido;
  - aprobacion con logo y posterior visibilidad autenticada por `/api/my-company/logo`.
- El deploy publicado debe tener las columnas SQL de TASK-224; si no, el flujo con logo fallara y se requerira aplicar la migracion existente.
