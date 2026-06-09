# TASK-195 - Handoff Web Dev

## Resultado

Completado en codigo local.

La pantalla `Mi empresa` ahora incluye una experiencia minima para logo privado de empresa:

- muestra estado del logo actual;
- permite seleccionar imagen local;
- valida tipo y tamano antes de subir;
- muestra preview local antes de upload;
- sube el archivo con `multipart/form-data` y `credentials: "include"`;
- conserva el resto de la configuracion de empresa sin enviar `logoUrl` editable.

## Pantallas / rutas modificadas

- `/`, seccion `Mi empresa`.

Archivos modificados:

- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`

## Contrato usado

De `tasks/TASK-194-HANDOFF.md` y `docs/API_CONTRACTS.md`:

- `POST /api/my-company/logo`
  - `multipart/form-data`
  - campo `file`
  - requiere sesion de empresa valida
  - requiere rol `owner` o `admin`
  - tipos permitidos: `image/png`, `image/jpeg`, `image/webp`
  - tamano maximo default: `1048576`
  - respuesta esperada: `logoUrl`, `contentType`, `updatedAt`

- `GET /api/my-company/logo`
  - logo servido por API privada
  - requiere sesion
  - sin SAS ni blob path publico

## Estados de UI cubiertos

- Sin logo actual: muestra `Sin logo`.
- Logo actual: usa `logoUrl` devuelto por API y agrega cache key con `updatedAt`.
- Seleccion valida: muestra preview local con `blob:` y estado `Logo listo para subir.`.
- Sin archivo: `Seleccione una imagen de logo.`.
- Tipo no permitido: `Use una imagen PNG, JPG o WebP.`.
- Archivo mayor a 1 MB: `El logo debe pesar 1 MB o menos.`.
- Sesion requerida o rol no permitido: `Inicie sesion para operar con la empresa activa.`.
- Error API controlado:
  - `UPLOAD_TOO_LARGE`
  - `UNSUPPORTED_MEDIA_TYPE`
  - `VALIDATION_ERROR`
- Error generico: `No se pudo subir el logo. Intente de nuevo.`.

## Regla de seguridad

- El upload usa `/api/my-company/logo`; no envia `companyId` como autoridad.
- El upload viaja con `credentials: "include"`.
- No se guarda token, password ni cookie en storage.
- No se loggean ni muestran cookies/tokens/passwords.
- `logoUrl` ya no se envia en `PATCH settings`.

## Pruebas ejecutadas

- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- Busqueda de referencias rotas al antiguo `company-logo-url`.
- Smoke local con servidor estatico temporal y Chrome headless:
  - `Mi empresa` desktop `1280px`: panel de logo existe, accept correcto, sin overflow.
  - `Mi empresa` mobile `390px`: panel de logo existe, accept correcto, sin overflow.
  - Preview local con PNG temporal: estado `Logo listo para subir.`, preview `blob:`, sin errores y sin overflow.

## No ejecutado

- No se ejecuto upload real contra API publicada porque no se uso sesion real.
- No se validaron roles `owner/admin` en navegador real.
- No se inspeccionaron cookies reales.
- No se usaron passwords, tokens ni secrets.

## Pendientes / bloqueos

- Backend/API debe estar desplegado con TASK-194 y configuracion de storage privado.
- QA debe validar publicado con sesion real:
  - upload PNG/JPG/WebP;
  - rechazo de SVG/tipo no permitido;
  - rechazo de archivo mayor a limite;
  - visualizacion del logo actual tras recargar;
  - comportamiento sin sesion o sin permisos.
