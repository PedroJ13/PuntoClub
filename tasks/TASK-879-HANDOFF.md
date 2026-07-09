# TASK-879 - Handoff

Nombre del Equipo: Web Dev
Modo: Staging / Web config
Fecha: 2026-07-09

## Estado

Completada.

Se publico Web staging apuntando a API staging sin cambiar Web produccion ni archivos del repo.

## Ambiente publicado

Web staging:

```txt
Static Web App: swa-puntoclub-stg-001
URL: https://calm-coast-0fabaec0f.7.azurestaticapps.net
```

API staging configurada en Web:

```txt
https://func-puntoclub-stg-br-001.azurewebsites.net
```

## Metodo de publicacion

Se hizo deploy desde una copia temporal de `app/`.

En esa copia temporal se reemplazo `app-config.js` por:

```txt
window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-stg-br-001.azurewebsites.net";
window.PUNTO_CLUB_COMPANY_ID = "6";
window.PUNTO_CLUB_USE_MOCK_API = false;
```

No se modifico:

```txt
app/app-config.js
app/staticwebapp.config.json
Web produccion
API produccion
```

## Validacion de rutas SPA

Resultados publicados:

```txt
GET /                           200
GET /app                        200
GET /company-registration       200
GET /company-invitations/accept 200
GET /company-password-reset     200
GET /admin-companies            200
GET /app-config.js              200
```

Todas las rutas profundas validaron fallback SPA a `index.html`.

## Validacion de app-config

Contenido publicado en staging:

```txt
window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-stg-br-001.azurewebsites.net";
window.PUNTO_CLUB_COMPANY_ID = "6";
window.PUNTO_CLUB_USE_MOCK_API = false;
```

Confirmado:

- `app-config.js` contiene API staging.
- `app-config.js` no contiene `api.puntoclubcr.com`.

## Validacion API desde Web staging

Request seguro:

```txt
GET https://func-puntoclub-stg-br-001.azurewebsites.net/api/me
Origin: https://calm-coast-0fabaec0f.7.azurestaticapps.net
```

Resultado:

```txt
Status: 401
Access-Control-Allow-Origin: https://calm-coast-0fabaec0f.7.azurestaticapps.net
Access-Control-Allow-Credentials: true
Body: {"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}
```

## Confirmacion de no llamadas a API productiva

Validacion por contenido publicado:

```txt
/app-config.js hasStagingApi=true
/app-config.js hasProdApi=false
```

No se ejecuto navegador interactivo con login porque no se recibieron credenciales QA. La validacion de red completa en DevTools queda para QA con sesion controlada.

## Riesgos / pendientes

- El deploy staging fue manual con copia temporal; falta workflow staging formal.
- `app-config.js` staging no esta generado por pipeline todavia.
- Si se redeploya staging desde workflow productivo o token incorrecto, puede volver a apuntar a API productiva.
- Staging API usa SQL productiva temporalmente, por lo que cualquier flujo de escritura desde Web staging crea datos reales.
- No hay marca visual `STAGING` en la UI; QA/PO debe distinguir por URL.

## Recomendaciones

Crear tarea Web/Release posterior para:

- workflow `azure-static-web-apps-swa-puntoclub-stg-001.yml`;
- secret `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_STG_001`;
- paso de pipeline que genere `app-config.js` con API staging;
- marca visual discreta de entorno staging;
- validacion automatica de que `app-config.js` staging no contiene `api.puntoclubcr.com`.

## Restricciones respetadas

- No se cambio Web produccion.
- No se cambio API produccion.
- No se cambio codigo en repo.
- No se cambio DNS.
- No se envio correo real.
- No se ejecuto flujo con escritura.

## Uso Azure SQL

No se uso Azure SQL directamente.

La Web staging apunta a API staging, y API staging usa SQL productiva temporalmente por phase 1; no se hicieron operaciones con escritura desde esta tarea.

## Siguiente paso recomendado

QA debe validar staging en navegador:

- home y rutas publicas;
- login/logout con credenciales QA por canal seguro;
- confirmar en Network que las llamadas van a `func-puntoclub-stg-br-001.azurewebsites.net`;
- no ejecutar compras/canjes/campanas reales sin aprobacion mientras no exista SQL staging.
