# TASK-194 - Handoff Backend/API

## Resultado

Implementada API privada para logo de empresa autenticada.

- La autoridad de `companyId` sale de la sesion de empresa, no del frontend.
- El upload guarda solo referencia segura en `Companies.logo_blob_path`, `logo_content_type` y `logo_updated_at`.
- `logoUrl` expuesto al frontend se mantiene como ruta controlada: `/api/my-company/logo`.
- El serving del logo se hace por endpoint autenticado y lee desde Blob Storage privado.
- No se generan ni exponen SAS, blob URLs publicos, tokens, cookies ni secretos.
- No se agregaron dependencias nuevas; Blob Storage se consume via REST con Managed Identity.

## Endpoints implementados

### POST `/api/my-company/logo`

- Auth: sesion de empresa valida.
- Roles permitidos: `owner`, `admin`.
- Request: `multipart/form-data` con campo `file`.
- Sube el archivo al contenedor privado configurado y actualiza metadata de empresa.
- Respuesta `200`:

```json
{
  "logoUrl": "/api/my-company/logo",
  "contentType": "image/png",
  "updatedAt": "2026-06-09T00:00:00.000Z"
}
```

### GET `/api/my-company/logo`

- Auth: sesion de empresa valida.
- Lee `logo_blob_path` de la empresa autenticada.
- Devuelve binario con:
  - `Content-Type`: `image/png`, `image/jpeg` o `image/webp`.
  - `Cache-Control`: `private, no-store`.
- Error esperado si no hay logo: `404 COMPANY_LOGO_NOT_FOUND`.

## Contrato final

El contrato existente en `docs/API_CONTRACTS.md` ya cubria estos endpoints y codigos relevantes:

- `400 VALIDATION_ERROR`.
- `401 UNAUTHORIZED`.
- `403 FORBIDDEN`.
- `404 COMPANY_LOGO_NOT_FOUND`.
- `413 UPLOAD_TOO_LARGE`.
- `415 UNSUPPORTED_MEDIA_TYPE`.

No se requirio cambio adicional de contrato.

## Validaciones de archivo

- Tipos permitidos: `image/png`, `image/jpeg`, `image/webp`.
- SVG rechazado con `415 UNSUPPORTED_MEDIA_TYPE`.
- Tamano maximo desde `LOGO_MAX_BYTES`; default seguro: `1048576`.
- Se valida `Content-Type`.
- Se valida extension cuando el filename viene en multipart:
  - PNG: `.png`.
  - JPEG: `.jpg` o `.jpeg`.
  - WebP: `.webp`.
- Se validan magic bytes basicos para PNG/JPEG/WebP.
- El blob path se genera server-side: `companies/{companyId}/logo/{uuid}.{ext}`.

## Archivos tocados

- `api/src/functions/myCompany.js`
- `api/src/lib/logoStorage.js`
- `api/src/lib/repository.js`
- `api/test/logo-storage.test.js`
- `api/package.json`

## Pruebas ejecutadas

Primero `npm test` fallo dentro del sandbox por `spawn EPERM`.

Luego se ejecuto fuera del sandbox:

```text
npm test
```

Resultado:

```text
tests 99
pass 99
fail 0
```

## Deploy/config

TASK-193 ya dejo documentada la configuracion esperada:

- `LOGO_STORAGE_ACCOUNT`
- `LOGO_CONTAINER`
- `LOGO_MAX_BYTES`
- `LOGO_ALLOWED_MIME_TYPES`
- `LOGO_SERVE_MODE=api`

La Function App debe ejecutar con Managed Identity y permisos sobre el contenedor privado. No se valido contra Azure Functions local ni contra Azure real en esta tarea porque el alcance quedo cubierto con pruebas unitarias y no se pidio smoke local de API.
