# TASK-196 - Handoff QA

Equipo: QA

Tarea validada: TASK-196 - Validar logo de empresa publicado

Ambiente: publicado

- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Storage logos: `stpuntoclublogosbr001` / `company-logos`
- Fecha QA: 2026-06-09

## Resultado

No aprobado / bloqueado por cambios no publicados.

La API y la Web publicadas no parecen contener todavia los cambios de TASK-194/TASK-195:

- `GET /api/my-company/logo` sin sesion responde `404`, no `401`.
- `POST /api/my-company/logo` sin sesion responde `404`, no `401`.
- El bundle Web publicado no contiene `/api/my-company/logo`.
- El bundle Web publicado no contiene el estado `Logo listo para subir`.

Sin endpoints publicados ni UI publicada, QA no puede validar upload real, rechazos de archivo, persistencia tras refresh ni logout/login.

## Checks ejecutados

### Dependencias revisadas

- `tasks/TASK-193-HANDOFF.md`:
  - storage privado confirmado;
  - public blob access deshabilitado;
  - Function App con Managed Identity y RBAC;
  - app settings de logos presentes;
  - no hay `LOGO_STORAGE_CONNECTION_STRING`.

- `tasks/TASK-194-HANDOFF.md`:
  - API de logo implementada en codigo local;
  - endpoints esperados:
    - `POST /api/my-company/logo`;
    - `GET /api/my-company/logo`;
  - tarea no valido contra Azure real.

- `tasks/TASK-195-HANDOFF.md`:
  - UI de `Mi empresa` implementada en codigo local;
  - no ejecuto upload real contra API publicada;
  - pendiente QA publicado con sesion real.

### API publicada sin sesion

- `GET /api/my-company/logo`:
  - Esperado si endpoint esta publicado: `401 UNAUTHORIZED` sin sesion.
  - Observado: `404`.
  - Resultado: no aprobado.

- `POST /api/my-company/logo` con PNG sintetico y sin sesion:
  - Esperado si endpoint esta publicado: `401 UNAUTHORIZED` sin sesion.
  - Observado: `404`.
  - Resultado: no aprobado.

### Web publicada

Se revisaron recursos servidos por Static Web Apps:

- `/src/app.js`
- `/src/customerApi.js`
- `/`

Resultado:

- `customerApi.js` publicado no contiene `/api/my-company/logo`.
- `customerApi.js` publicado no contiene soporte evidente de `FormData`/multipart para logo.
- `app.js` publicado no contiene `/api/my-company/logo`.
- `app.js` publicado no contiene `Logo listo para subir`.

Resultado: no aprobado. La UI publicada no refleja TASK-195.

### Storage privado

Se intento listar el contenedor de logos de forma anonima:

```text
GET https://stpuntoclublogosbr001.blob.core.windows.net/company-logos?restype=container&comp=list
```

Resultado observado:

- `409 PublicAccessNotPermitted`.
- No se listaron blobs.
- No se expuso contenido.

Resultado: aprobado para privacidad basica del storage.

### Regresion segura

- `GET /api/me` sin sesion:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- Endpoint operativo con cookie sintetica invalida:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

## No ejecutado

No se pudo ejecutar por falta de cambios publicados y falta de sesion real/evidencia PO redaccionada:

- Upload de logo PNG/JPG/WebP valido.
- Rechazo de archivo no permitido.
- Rechazo de archivo sobre limite.
- Refresh mantiene logo visible.
- Logout/login conserva logo visible para la empresa.
- Validacion de roles `owner/admin`.
- Validacion de imagen servida autenticada por `GET /api/my-company/logo`.

## Hallazgos

### P1 - API publicada no expone endpoints de logo

`GET` y `POST /api/my-company/logo` responden `404` en publicado. Si el endpoint estuviera desplegado, la respuesta sin sesion deberia ser `401 UNAUTHORIZED`.

Impacto: no se puede validar ni usar logo de empresa publicado.

### P1 - Web publicada no contiene UI/cliente de logo

El bundle publicado no contiene `/api/my-company/logo` ni los textos/flujo de upload esperados de TASK-195.

Impacto: la persona usuaria no puede cargar logo desde `Mi empresa` en publicado.

## P0/P1

- P1: API de logo no esta publicada o no esta activa.
- P1: UI de logo no esta publicada.

## P2/P3

Ninguno nuevo.

## Evidencia redaccionada

- `GET /api/my-company/logo` sin sesion: `404`.
- `POST /api/my-company/logo` sin sesion con PNG sintetico: `404`.
- Bundle Web publicado:
  - no contiene `/api/my-company/logo`;
  - no contiene `Logo listo para subir`;
  - no muestra soporte publicado de multipart/logo en `customerApi.js`.
- Storage anonimo:
  - `409 PublicAccessNotPermitted`.
- Regresion auth:
  - `/api/me` sin sesion: `401`;
  - endpoint operativo con cookie sintetica invalida: `401`.

## Riesgos o pendientes

- Backend/API debe confirmar deploy publicado de TASK-194.
- Web Dev debe confirmar deploy publicado de TASK-195.
- Luego QA debe revalidar con sesion real o evidencia PO redaccionada:
  - upload valido;
  - rechazos de archivo;
  - refresh;
  - logout/login;
  - no exposicion de SAS/blob publico.

## Siguiente recomendado

Publicar API y Web con TASK-194/TASK-195, confirmar deploys y reintentar TASK-196. Si QA no debe manejar credenciales, pedir a PO Test evidencia redaccionada de upload, refresh y logout/login sin compartir password, cookie, token, SAS ni URL privada de blob.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token real.
- No se uso SAS.
- No se uso connection string.
- No se subio archivo real autenticado.
- La prueba de upload fue sin sesion y con PNG sintetico minimo.
