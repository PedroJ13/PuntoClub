# TASK-229 - Handoff QA

Equipo: QA

Tarea validada: TASK-229 - Validar ajustes visuales de flujo empresa y admin

Ambiente: publicado

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-12

## Resultado

No aprobado.

Los ajustes locales descritos en TASK-225 a TASK-228 no estan publicados en la Web/API estable. La publicacion sigue sirviendo el bundle anterior de TASK-212 para Web y la API publicada todavia no acepta `multipart/form-data` en `POST /api/company-registration-requests`.

No se cambiaron archivos de codigo. Solo se crea este handoff QA.

## Evidencia revisada

Se leyeron:

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-223-HANDOFF.md`
- `tasks/TASK-224-HANDOFF.md`
- `tasks/TASK-225-HANDOFF.md`
- `tasks/TASK-226-HANDOFF.md`
- `tasks/TASK-227-HANDOFF.md`
- `tasks/TASK-228-HANDOFF.md`

Resumen de dependencias:

- TASK-223 definio UX/copy esperado.
- TASK-224 confirmo que no hacia falta SQL nuevo porque el modelo ya tenia campos de logo.
- TASK-225 completo Backend/API local para logo opcional, transferencia a empresa y emails.
- TASK-226 completo Web local de `/company-registration`, logo opcional y estado post-exito.
- TASK-227 completo Web local de `Admin empresas` separado, drawer y modal in-app.
- TASK-228 completo Web local de logo/fallback de empresa activa.

## Checks publicados ejecutados

### Recursos Web publicados

- `/`: `200`, `htmlLength=33537`.
- `/company-registration`: `200`, `htmlLength=33537`.
- `/src/app.js`: `appLength=102275`.
- `/src/customerApi.js`: `customerApiLength=47409`.

Comparacion local/publicado:

- `app/src/app.js` local: `112659` caracteres.
- `/src/app.js` publicado: `102275` caracteres.
- `app/src/customerApi.js` local: `48433` caracteres.
- `/src/customerApi.js` publicado: `47409` caracteres.

Resultado QA: el bundle publicado no corresponde a los cambios locales de TASK-226/TASK-227/TASK-228.

### Presencia de ajustes esperados en bundle publicado

Publicado:

- ruta/logica `/company-registration`: no encontrada.
- copy `Solicitud recibida` / `Enviar otra solicitud`: no encontrado.
- soporte de logo en registro (`registrationLogoFileInput` + `FormData payload/file`): no encontrado.
- encabezado/admin separado con `Acceso interno activo` / `Cambiar token`: no encontrado.
- drawer admin: no encontrado.
- modal in-app `admin-confirmation-modal`: no encontrado.
- `window.confirm`: sigue presente.
- identidad visual de empresa activa (`activeCompanyLogo` / fallback): no encontrada.
- `localStorage`: no encontrado.
- `sessionStorage`: no encontrado.
- `invitationLink`, `invitationUrl`, `token_hash`: no encontrados.

Resultado QA: no aprobado para Web publicada.

### API publica de solicitud de empresa

Solicitud JSON sin logo:

- `POST /api/company-registration-requests`
- Observado: `201`.
- Respuesta segura: contiene `id`, datos de solicitud, `status=pending`, `createdAt`, `message`.
- No contiene token, hash, blob path, SAS, link de invitacion ni URL tokenizada.

Solicitud `multipart/form-data` con PNG minimo:

- `POST /api/company-registration-requests`
- Observado: `400 VALIDATION_ERROR`.
- Mensaje: `Request body must be valid JSON.`
- No contiene token, hash, blob path, SAS, link de invitacion ni URL tokenizada.

Resultado QA: la API publicada mantiene el contrato JSON anterior y no refleja TASK-225 para logo opcional en solicitud publica.

### Seguridad y negativos publicados

- `GET /api/company-registration-requests?status=pending&limit=25` sin token:
  - `403 FORBIDDEN`.

- `GET /api/company-registration-requests?status=pending&limit=25` con token sintetico invalido:
  - `403 FORBIDDEN`.

- `POST /api/company-registration-requests/1/approve` sin token:
  - `403 FORBIDDEN`.

- `GET /api/me` sin sesion:
  - `401 UNAUTHORIZED`.

- `POST /api/company-auth/login` con usuario/password sinteticos invalidos:
  - primer intento agoto timeout de 45s;
  - reintento con 90s: `401 UNAUTHORIZED`.

- `POST /api/company-registration-requests` con payload invalido:
  - `400 VALIDATION_ERROR`.

Resultado QA: negativos basicos de seguridad siguen protegidos.

## Regresion ejecutada

Ejecutada:

- Ruta Web publicada `/company-registration`: responde `200`, pero sirve el shell anterior sin la logica nueva publicada.
- Solicitud publica JSON sin logo: `201`, sin secretos en respuesta.
- Solicitud publica con logo PNG: falla `400`, por API publicada anterior.
- Endpoints internos sin token/token sintetico: `403`.
- `/api/me` sin sesion: `401`.
- Login invalido sintetico: `401` en reintento.

No ejecutada:

- login empresa real;
- buscar/registrar cliente autenticado;
- registrar compra autenticada;
- redimir puntos autenticado;
- reporte basico autenticado;
- aprobacion real desde resumen/detalle;
- validacion real de drawer/modal con token interno;
- transferencia de logo al aprobar y logo/fallback con empresa activa.

Motivo: QA no recibio credenciales reales de empresa ni token interno por canal seguro. Ademas, el bundle/API publicados no contienen los cambios que se deben validar.

## Hallazgos

### P1 - Web publicada no contiene TASK-226/TASK-227/TASK-228

El bundle publicado sigue con `appLength=102275`, igual al bundle anterior validado en TASK-212, y no contiene:

- logica/ruta publica `/company-registration`;
- estado `Solicitud recibida` / `Enviar otra solicitud`;
- logo opcional en registro;
- admin separado con acceso interno colapsado;
- drawer de detalle;
- modal de confirmacion in-app;
- identidad visual de empresa activa.

Esto bloquea validar los ajustes visuales publicados.

### P1 - API publicada no contiene soporte TASK-225 para logo en solicitud

La solicitud `multipart/form-data` con logo PNG minimo responde `400 VALIDATION_ERROR` con `Request body must be valid JSON.`

Esto bloquea:

- logo de empresa en registro publico;
- indicador seguro `requestedLogo`;
- aprobacion con transferencia de logo a empresa;
- validacion posterior de logo/fallback de empresa activa asociado a solicitud aprobada.

## P0/P1

- P0: ninguno.
- P1: Web publicada no refleja TASK-226/TASK-227/TASK-228.
- P1: API publicada no refleja TASK-225 para `multipart/form-data` con logo.

## P2/P3

- P2: regresion autenticada completa queda pendiente por falta de credenciales reales y porque los cambios publicados aun no estan disponibles.
- P2: flujo positivo admin con token real sigue pendiente; QA solo valido proteccion sin token/token sintetico.
- P3: ninguno nuevo.

## Riesgos o pendientes

- Publicar API con TASK-225.
- Publicar Web con TASK-226/TASK-227/TASK-228.
- Reintentar QA publicado despues de deploy.
- Para cierre completo, aportar por canal seguro:
  - credenciales de empresa o evidencia PO redaccionada para login/operacion;
  - token interno real o evidencia PO/Release redaccionada para admin positivo.

## Siguiente recomendado

Infra/Web Dev/Backend deben confirmar deploy publicado de TASK-225 a TASK-228. Luego QA debe reintentar TASK-229 validando:

- `/company-registration` publico real;
- solicitud con y sin logo;
- estado post-exito sin formulario visible por defecto;
- admin separado, token colapsado, drawer y modal in-app;
- aprobacion con logo si hay token seguro;
- logo/fallback post-login con empresa activa;
- regresion autenticada de cliente, compra, redencion y reporte.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token interno real.
- No se uso token de invitacion real.
- No se imprimieron hashes, SAS, blob paths internos ni links tokenizados.
- Se usaron email/datos QA generados para solicitudes publicas.
