# TASK-176 - Handoff Backend API

## Resultado

Completado. API publicada confirmada con el fix de TASK-172 desplegado.

El workflow `Deploy Punto Club API` corrio exitosamente sobre el commit que contiene TASK-172, y la API publicada ya responde de forma controlada para login invalido y logout sin sesion.

## Evidencia de deploy

Commit validado:

- `6e912adb055673a81dc2ec87744698eab4d2e187`
- Mensaje: `Fix auth login resilience`
- Incluye:
  - limpieza de `poolPromise` fallido en `getPool()`;
  - mapeo de errores SQL transitorios a `503 SERVICE_UNAVAILABLE`;
  - cookie productiva `SameSite=None; Secure`;
  - pruebas `db`, `company-auth` y `errors`.

Workflow GitHub Actions:

- Nombre: `Deploy Punto Club API`
- Run: `https://github.com/PedroJ13/PuntoClub/actions/runs/27173769773`
- Estado: `completed`
- Conclusion: `success`
- `head_sha`: `6e912adb055673a81dc2ec87744698eab4d2e187`
- Creado: `2026-06-08T23:34:20Z`
- Actualizado: `2026-06-08T23:36:36Z`

Job validado:

- `Test and deploy API`: `success`
- Pasos relevantes en verde:
  - `Run tests`
  - `Azure login`
  - `Package API`
  - `Deploy Azure Functions`
  - `Smoke test stable API`

## Validacion publicada

Ambiente:

- API publicada: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Origen SWA publicado usado para CORS: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

### Login invalido

Request seguro:

- Endpoint: `POST /api/company-auth/login`
- Credenciales: sinteticas/no reales.

Respuesta observada:

```text
HTTP 401
{"error":{"code":"UNAUTHORIZED","message":"Invalid email or password."}}
```

Duracion observada:

- `652ms`

Interpretacion:

- Con DB disponible, el login invalido responde `401 UNAUTHORIZED` controlado.
- No se reprodujo timeout.
- No se reprodujo `500 INTERNAL_ERROR`.
- Si SQL estuviera temporalmente no disponible, el codigo desplegado ya contiene el mapeo a `503 SERVICE_UNAVAILABLE`.

### Logout sin sesion

Request seguro:

- Endpoint: `POST /api/company-auth/logout`
- Sin cookie/sesion.

Respuesta observada:

```text
HTTP 200
{"ok":true}
```

`Set-Cookie` redaccionado:

```text
puntoclub_company_session=<redacted>; Path=/; HttpOnly; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure
```

Interpretacion:

- Logout sin sesion responde `200`.
- La cookie de limpieza publicada usa `SameSite=None; Secure`, compatible con Web/API cross-site.
- No se pego valor de cookie.

### CORS credentialed para logout

Preflight:

```text
OPTIONS /api/company-auth/logout
Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

Respuesta observada:

```text
HTTP 204
Access-Control-Allow-Origin: https://calm-dune-075dc5c0f.7.azurestaticapps.net
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: content-type
```

## Cookie de sesion

No se ejecuto login correcto porque la tarea prohibe usar password real y no se recibio un acceso/invitacion fresca segura para crear credenciales controladas.

Evidencia disponible:

- El commit desplegado contiene el cambio de `buildSessionCookie()` para emitir `SameSite=None; Secure` en produccion/entorno seguro.
- `buildClearSessionCookie()` usa la misma estrategia y fue validado publicado mediante logout sin sesion.

La validacion de cookie de sesion real queda para QA con E2E y link fresco/no comprometido.

## Seguridad

- No se uso password real.
- No se uso token real de invitacion.
- No se imprimieron secretos.
- No se imprimio cookie completa con valor sensible; el valor fue redaccionado.
- No se uso `INTERNAL_ADMIN_TOKEN`.

## Pendientes

- QA / TASK-177:
  - Reintentar E2E auth propia con link fresco/no comprometido o evidencia redaccionada del Product Owner.
  - Confirmar login correcto, cookie de sesion real, `/api/me` con sesion y logout desde navegador publicado.
- Monitoreo:
  - Vigilar latencia de `POST /api/company-auth/login`; en esta validacion fue normal, pero TASK-175 observo una corrida previa lenta.
