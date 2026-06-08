# TASK-172 - Handoff Backend API

## Resultado

Completado en codigo local. Se corrigio el comportamiento Backend para que los fallos transitorios de conexion SQL durante `POST /api/company-auth/login` no queden como timeout/`500 INTERNAL_ERROR`, y se ajusto la estrategia de cookie de sesion para el entorno publicado cross-site.

El cambio queda pendiente de deploy de API para que QA pueda revalidar en publicado.

## Causa raiz del 500/timeout

App Insights para `companyAuthLogin` mostro respuestas `500` con duraciones altas y trazas de `ConnectionError` de SQL Server con codigo `ELOGIN`: la base de datos Azure SQL no estaba disponible temporalmente.

Impacto tecnico:

- El login invalido solo puede responder `401 UNAUTHORIZED` cuando la API puede consultar la base de datos y confirmar que las credenciales no coinciden.
- Si SQL no esta disponible, la API no puede verificar credenciales de forma segura; el resultado correcto es un error controlado de disponibilidad, no `401`.
- `getPool()` conservaba la promesa rechazada de conexion. Despues de un fallo de conexion, el proceso podia seguir reutilizando ese estado fallido y producir `500` rapidamente hasta reciclarse.

## Cambios realizados

- `api/src/lib/db.js`
  - `getPool()` ahora limpia el `poolPromise` cacheado si falla la conexion inicial, permitiendo reintentos reales en llamadas posteriores.
- `api/src/lib/errors.js`
  - Se mapean errores SQL transitorios de conexion a `503 SERVICE_UNAVAILABLE`.
  - Incluye `ELOGIN` con mensaje de base de datos temporalmente no disponible y codigos `ETIMEOUT`, `ESOCKET`, `ECONNCLOSED`.
- `api/src/lib/companyAuth.js`
  - Se agrego `getSessionSameSite()`.
  - Produccion/entorno seguro usa `SameSite=None; Secure` por defecto.
  - Local/no seguro conserva `SameSite=Lax`.
  - Se permite override con `COMPANY_SESSION_COOKIE_SAMESITE=lax|strict|none`.
  - `buildSessionCookie()` y `buildClearSessionCookie()` usan la misma estrategia.
- `api/test/company-auth.test.js`
  - Se actualizo la expectativa de cookie productiva a `SameSite=None; Secure`.
  - Se agregaron pruebas para defaults/override de `getSessionSameSite()`.
- `api/test/errors.test.js`
  - Se agrego cobertura para mapeo de errores SQL transitorios a `503`.
- `api/test/db.test.js`
  - Se agrego prueba para confirmar que `getPool()` limpia el cache despues de una conexion fallida y reintenta correctamente.
- `api/package.json`
  - Se incluyo `test/db.test.js` en `npm test`.

## Estrategia final de cookie publicada

Para Web publicada en Static Web Apps y API publicada en Azure Functions, los dominios son distintos:

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

Si Web usa `fetch(..., credentials: "include")` para login, `/api/me` y logout, la cookie de sesion debe viajar en contexto cross-site. Por eso Backend ahora emite cookie de sesion con:

```text
HttpOnly; SameSite=None; Secure
```

en produccion/entornos seguros.

Esto no elimina la dependencia de CORS: Azure Functions tambien debe devolver `Access-Control-Allow-Credentials: true` con origen acotado para que el navegador acepte respuestas credentialed.

## Pruebas ejecutadas

- `npm test` desde `api/`.

Resultado:

- Sandbox inicial fallo con `spawn EPERM`, consistente con ejecuciones previas del entorno.
- Reejecucion aprobada/elevada paso correctamente.
- `82` tests ejecutados.
- `82` pass.
- `0` fail.

## Pendientes para Infra / Web / QA

- Infra / Azure:
  - Habilitar `Access-Control-Allow-Credentials: true` en CORS de la Function App con origen acotado.
  - No usar wildcard con credentials.
- Backend / Release:
  - Desplegar la API con este cambio antes de revalidar publicado.
- Web:
  - Confirmar si el ajuste de `acceptCompanyInvitation` sin `credentials: "include"` ya fue desplegado.
  - Mantener `credentials: "include"` donde si se requiere sesion: login, `/api/me`, logout.
- QA:
  - Revalidar `POST /api/company-auth/login` con credenciales invalidas despues del deploy.
    - Esperado con DB disponible: `401 UNAUTHORIZED`.
    - Esperado si SQL esta temporalmente no disponible: `503 SERVICE_UNAVAILABLE` controlado.
  - Revalidar login correcto, cookie de sesion, `/api/me` y logout una vez habilitado CORS credentials.

## Confirmacion de seguridad

- No se imprimieron passwords reales.
- No se imprimieron cookies ni tokens de sesion.
- No se pidio ni imprimio `INTERNAL_ADMIN_TOKEN`.
- Las consultas de App Insights se hicieron sin recuperar payloads sensibles.
