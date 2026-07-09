# TASK-874 - Handoff

Nombre del Equipo: Web Dev
Modo: Staging / Web readiness
Fecha: 2026-07-09

## Estado

Completada como revision. No se cambio deploy productivo, no se crearon recursos y no se cambio codigo.

## Documento base leido

- `docs/STAGING_ENVIRONMENT_PHASE1.md`

## Mecanismo actual de API base

La Web lee configuracion desde `app/app-config.js`:

```txt
window.PUNTO_CLUB_API_BASE_URL = "https://api.puntoclubcr.com";
window.PUNTO_CLUB_COMPANY_ID = "1";
window.PUNTO_CLUB_USE_MOCK_API = false;
```

`app/src/config.js` expone:

```txt
apiBaseUrl: window.PUNTO_CLUB_API_BASE_URL ?? ""
companyId: window.PUNTO_CLUB_COMPANY_ID ?? "1"
useMockApi: window.PUNTO_CLUB_USE_MOCK_API === true
```

`app/src/customerApi.js` construye rutas con `buildApiUrl(config, "/api/...")` y usa `credentials: include` para endpoints privados.

Conclusion: Web staging puede consumir API staging solo cambiando `app/app-config.js` en el artefacto staging:

```txt
window.PUNTO_CLUB_API_BASE_URL = "https://<api-staging-host>"
window.PUNTO_CLUB_COMPANY_ID = "<empresa QA/controlada>"
window.PUNTO_CLUB_USE_MOCK_API = false
```

## Recomendacion de configuracion Web staging

Para URL temporal Azure:

```txt
PUNTO_CLUB_API_BASE_URL=https://func-puntoclub-stg-br-001.azurewebsites.net
```

Para dominio propio futuro:

```txt
PUNTO_CLUB_API_BASE_URL=https://api-staging.puntoclubcr.com
```

No incluir `/api` en `PUNTO_CLUB_API_BASE_URL`, porque el cliente ya llama rutas `/api/...`.

## Archivos/config requeridos

Mantener:

```txt
app/app-config.js
app/staticwebapp.config.json
.github/workflows/<nuevo-workflow-staging>.yml
```

Para staging se recomienda crear workflow separado, por ejemplo:

```txt
.github/workflows/azure-static-web-apps-swa-puntoclub-stg-001.yml
```

Ese workflow debe usar un secret distinto:

```txt
AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_STG_001
```

No reutilizar el token productivo.

## Rutas que deben responder en staging

Web publica:

```txt
/
/company-registration
/company-invitations/accept
/company-password-reset
```

Web autenticada:

```txt
/app
```

Panel interno:

```txt
/admin-companies
```

Nota: la app es SPA. Las rutas profundas deben caer a `/index.html`.

## Validacion de staticwebapp.config.json

Archivo actual:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": [
      "/styles.css",
      "/app-config.js",
      "/robots.txt",
      "/sitemap.xml",
      "/src/*"
    ]
  }
}
```

Estado: adecuado para staging porque conserva fallback de rutas profundas y excluye assets directos.

Riesgo: si en staging se agregan nuevos assets con rutas distintas, revisar `exclude`.

## CORS/cookies vistos desde Web

La Web llama endpoints privados con:

```txt
credentials: include
```

Por eso API staging debe tener:

```txt
CORS allowed origin = https://<web-staging-host>
supportCredentials = true
cookie SameSite=None; Secure
```

La API no define `Domain` en la cookie, por lo que una cookie emitida por API staging queda separada por host. Recomendado que Backend/Infra configure cookie name staging distinto para evitar confusion al alternar ambientes.

## Riesgos de cache/dominio

1. `app-config.js` es un archivo separado; si queda cacheado, Web staging puede seguir apuntando a API productiva.
2. Si se usa el mismo dominio o CDN que produccion, se puede confundir el cache de assets.
3. Si el workflow staging publica desde `main` sin control de branch, puede desplegar cambios antes de decision.
4. Si `PUNTO_CLUB_COMPANY_ID` queda en `1`, algunas rutas antiguas/mock o fallback visual pueden mostrar empresa equivocada aunque endpoints privados usen sesion.
5. Si Web staging apunta a API staging pero API staging apunta SQL productiva, los cambios reales siguen ocurriendo en datos productivos.

Mitigaciones:

- Publicar staging en Static Web App separada.
- Secret de deploy staging separado.
- `app-config.js` staging con API staging y empresa QA/controlada.
- Validar en navegador DevTools que `/app-config.js` descargado contiene API staging.
- Agregar cache busting/version si se observa configuracion vieja.
- No reutilizar dominio productivo para staging.

## Checks necesarios

Antes de deploy staging:

```txt
npm --prefix api test
node --check app/src/app.js
node --check app/src/customerApi.js
```

Despues de deploy staging:

```txt
GET https://<web-staging-host>/
GET https://<web-staging-host>/app
GET https://<web-staging-host>/company-registration
GET https://<web-staging-host>/company-invitations/accept
GET https://<web-staging-host>/company-password-reset
GET https://<web-staging-host>/admin-companies
GET https://<web-staging-host>/app-config.js
```

Validaciones en navegador:

- `app-config.js` apunta a API staging.
- Login usa `POST https://<api-staging-host>/api/company-auth/login`.
- `/api/me` posterior usa API staging y `credentials`.
- Logout limpia sesion staging.
- Rutas profundas no devuelven 404.
- No aparecen llamadas a `https://api.puntoclubcr.com` cuando se esta en staging.

Validaciones funcionales seguras:

- Home comercial renderiza.
- Pantalla login muestra estado correcto sin sesion.
- `GET /api/me` sin cookie devuelve 401 controlado.
- Admin empresas no expone datos sin token staging.
- Enviar campanas no permite envio real si API staging tiene flag deshabilitado.

## Recomendaciones Web para phase 1

No bloqueantes:

1. Considerar generar `app-config.js` por pipeline en vez de versionarlo con valor productivo.
2. Agregar una marca visual discreta `STAGING` solo en Web staging para evitar que PO/QA confundan ambientes.
3. Evitar que workflow staging publique automaticamente cualquier push a `main`; usar `workflow_dispatch` o rama `staging` hasta definir politica.
4. Mantener `PUNTO_CLUB_USE_MOCK_API=false` para validar integracion real Web/API staging; usar mock solo para desarrollo local.

## Restricciones respetadas

- No se cambio deploy productivo.
- No se crearon recursos.
- No se cambio codigo.
- No se cambio API.
- No se cambio SQL.
- No se cambio DNS.
- No se enviaron correos.

## Uso Azure SQL

No se uso Azure SQL.

## Siguiente paso recomendado

Despues de que Infra cree recursos staging y entregue URL de API staging, Web Dev debe preparar una tarea de implementacion para:

- workflow staging separado;
- `app-config.js` staging generado o reemplazado en pipeline;
- validacion publicada de rutas profundas;
- evidencia de que no hay llamadas a API productiva desde Web staging.
