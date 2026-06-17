# TASK-232 - Handoff QA

Equipo: QA

Tarea validada: TASK-232 - Revalidar ajustes visuales publicados de empresa y admin

Ambiente: publicado

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-12

## Resultado

Aprobado con observaciones.

QA confirma que los P1 de TASK-229 quedaron corregidos:

- la Web publicada ya contiene el bundle nuevo de TASK-226/TASK-227/TASK-228;
- la API publicada ya acepta solicitud publica de empresa con JSON sin logo y `multipart/form-data` con logo PNG;
- los endpoints internos siguen protegidos sin token/token sintetico;
- no se observaron tokens, passwords, cookies, hashes, SAS, blob paths internos ni links tokenizados en respuestas revisadas.

Queda como P2 la validacion positiva real con token interno y sesion de empresa porque QA no recibio credenciales reales ni token interno por canal seguro en esta tarea.

## Evidencia revisada

Se leyeron:

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-229-HANDOFF.md`
- `tasks/TASK-230-HANDOFF.md`
- `tasks/TASK-231-HANDOFF.md`

Resumen:

- TASK-229 no aprobo porque API/Web publicados no reflejaban TASK-225 a TASK-228.
- TASK-230 confirmo deploy API con soporte de logo opcional y correos actualizados.
- TASK-231 confirmo deploy Web con `/company-registration`, mejoras admin y logo/fallback de empresa activa.

## Checks publicados ejecutados

### Web publicada

Recursos:

- `/`: `200`, `htmlLength=35978`.
- `/company-registration`: `200`, `htmlLength=35978`.
- `/src/app.js`: `appLength=112659`.
- `/src/customerApi.js`: `customerApiLength=48433`.

Marcadores publicados confirmados:

- ruta/logica publica `/company-registration`: presente.
- copy `Solicitud recibida`: presente.
- accion `Enviar otra solicitud`: presente.
- despues de exito, `companyRegistrationForm.hidden = true`: presente.
- logo opcional en registro: `registrationLogoFileInput`: presente.
- envio con `FormData` y campos `payload` + `file`: presente.
- estado de token interno activo: `Acceso interno activo en esta pestana.`: presente.
- detalle admin como drawer/panel: clase `is-admin-drawer-open`: presente.
- accion `Ver detalle`: presente.
- accion de aprobacion desde panel: presente.
- modal in-app `admin-confirmation-modal`: presente.
- confirmacion de aprobar usa `requestAdminConfirmation` con `Aprobar solicitud` / `Aprobar y enviar`: presente.
- `window.confirm`: no encontrado.
- identidad visual de empresa activa: `activeCompanyIdentity`, `activeCompanyLogoFallback`, `activeCompanyLogoImage`: presente.
- fallback por iniciales: `getCompanyInitials`: presente.

Marcadores de seguridad:

- `localStorage`: no encontrado.
- `sessionStorage`: no encontrado.
- `invitationLink`: no encontrado.
- `invitationUrl`: no encontrado.
- `token_hash`: no encontrado.

Resultado QA: aprobado para bundle publicado.

### API publica de solicitud de empresa

Solicitud JSON sin logo:

- `POST /api/company-registration-requests`
- Observado: `201`.
- Respuesta incluye:
  - `status=pending`;
  - `requestedLogo.available=false`;
  - `message=Solicitud recibida.`
- No contiene token/hash/blob/SAS/link tokenizado.

Solicitud `multipart/form-data` con PNG minimo:

- `POST /api/company-registration-requests`
- Observado: `201`.
- Respuesta incluye:
  - `status=pending`;
  - `requestedLogo.available=true`;
  - `requestedLogo.contentType=image/png`;
  - `message=Solicitud recibida.`
- No contiene token/hash/blob/SAS/link tokenizado.

Logo SVG:

- `POST /api/company-registration-requests` con `image/svg+xml`.
- Primer intento fallo por conexion a Functions.
- Reintento despues de calentamiento: `415 UNSUPPORTED_MEDIA_TYPE`.
- Mensaje: `Logo must be a PNG, JPEG, or WebP image.`

Resultado QA: aprobado para contrato publico con y sin logo y negativo de tipo no permitido.

### Seguridad y negativos sin secretos

- `GET /api/company-registration-requests?status=pending&limit=25` sin token:
  - `403 FORBIDDEN`.

- `GET /api/company-registration-requests?status=pending&limit=25` con token sintetico invalido:
  - `403 FORBIDDEN`.

- `POST /api/company-registration-requests/1/approve` sin token:
  - `403 FORBIDDEN`.

- `GET /api/me` sin sesion:
  - `401 UNAUTHORIZED`.

- `POST /api/company-auth/login` con usuario/password sinteticos invalidos:
  - `401 UNAUTHORIZED`.

- `POST /api/company-registration-requests` con payload invalido:
  - primer intento tuvo fallo puntual de conexion;
  - reintento: `400 VALIDATION_ERROR`.

Resultado QA: aprobado para negativos seguros.

## Correos

QA no accedio a mailbox ni a logs con contenido sensible.

Se acepta como evidencia segura el handoff TASK-230:

- correo al solicitante actualizado;
- correo interno actualizado;
- invitacion actualizada;
- notificacion interna de invitacion enviada actualizada;
- sin tokens, hashes, SAS, blob paths internos ni links expuestos en respuestas no autorizadas.

## Regresion ejecutada

Ejecutada:

- carga de `/company-registration`;
- inspeccion de bundle publicado para registro publico, estado post-exito, admin drawer/modal y logo/fallback;
- solicitud publica JSON sin logo;
- solicitud publica multipart con PNG minimo;
- rechazo de SVG;
- endpoints internos sin token/token sintetico;
- `/api/me` sin sesion;
- login invalido sintetico;
- payload invalido de solicitud publica.

No ejecutada con sesion real:

- login empresa real;
- buscar/registrar cliente autenticado;
- registrar compra autenticada;
- redimir puntos autenticado;
- reporte basico autenticado;
- aprobacion real desde resumen/detalle con token interno;
- transferencia real de logo al aprobar;
- logo/fallback observado en navegador con empresa activa.

Motivo:

- QA no recibio credenciales reales ni token interno real por canal seguro.
- Para login empresa se toma como antecedente la evidencia PO redaccionada de TASK-214 y las regresiones autenticadas aprobadas previamente en TASK-186/TASK-200.

## Hallazgos

No se encontraron P0/P1 abiertos para TASK-232.

Los P1 de TASK-229 quedan cerrados:

- Web publicada ya contiene cambios visuales de registro/admin/logo.
- API publicada ya contiene soporte de solicitud con logo.

## P0/P1

- P0: ninguno.
- P1: ninguno.

## P2/P3

- P2: pendiente validacion positiva completa con token interno real: token activo colapsado en UI con datos reales, aprobar desde resumen/detalle, drawer real con solicitud real y modal in-app ejecutando aprobacion.
- P2: pendiente validacion con sesion real o evidencia PO nueva para logo/fallback visible en empresa activa y regresion cliente/compra/redencion/reporte despues de estos cambios visuales.
- P3: la API mostro intermitencia de conexion en algunos intentos, pero los reintentos pasaron; vigilar en futuras pruebas.

## Riesgos o pendientes

- Las pruebas publicas crearon solicitudes reales QA:
  - solicitud JSON sin logo;
  - solicitud con logo PNG.
- Si Product/Release quiere cerrar tambien el positivo admin, debe entregar token interno por canal seguro o aportar evidencia redaccionada.
- Si Product/Release quiere cerrar tambien la regresion operativa autenticada en esta misma fase, debe aportar credenciales por canal seguro o evidencia PO redaccionada reciente.

## Siguiente recomendado

Product / Architect / Release puede procesar TASK-232 como aprobado con observaciones y decidir si el P2 de positivo admin/sesion se cubre en una tarea PO Test o QA posterior con canal seguro.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token interno real.
- No se uso token de invitacion real.
- No se imprimieron hashes, SAS, blob paths internos ni links tokenizados.
- Los emails/datos usados fueron generados para QA.
