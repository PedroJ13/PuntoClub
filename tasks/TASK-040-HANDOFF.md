Equipo:
Infra / Azure

Tarea completada:
Preparacion de Azure Static Web Apps y CORS para publicar el frontend real de Punto Club, sin crear el recurso todavia.

Estado actual:
- API estable disponible: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Frontend actual en `app/`.
- `app/app-config.js` no contiene secretos y apunta a:
  - `window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`
  - `window.PUNTO_CLUB_COMPANY_ID = "1"`
  - `window.PUNTO_CLUB_USE_MOCK_API = false`
- Static Web Apps existente en la suscripcion:
  - `puntoevento`
  - hostname: `zealous-field-08fdd720f.7.azurestaticapps.net`
  - region: `East US 2`
  - plan: `Free`
- No se recomienda reutilizar `puntoevento` porque mezcla proyectos.

Decision recomendada:
- Crear una nueva Azure Static Web App para Punto Club.
- Nombre propuesto: `swa-puntoclub-prod-001`.
- Resource group: `resource_group_main`.
- Region: `East US 2`, consistente con Static Web Apps existente y disponibilidad del servicio.
- Plan: `Free` para piloto.
- No crear Static Web Apps hasta confirmacion explicita del usuario porque agrega recurso cloud.

Impacto/costo:
- Azure Static Web Apps Free deberia mantener costo USD 0/mes si el piloto queda dentro de limites del plan.
- Agrega una URL frontend estable para PO Test/usuario.
- No crea otra DB.
- No cambia API.
- No guarda secretos.

Configuracion frontend:
- Mantener `app/app-config.js` como archivo publico no secreto.
- Para el primer despliegue, usar los valores actuales:

```js
window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net";
window.PUNTO_CLUB_COMPANY_ID = "1";
window.PUNTO_CLUB_USE_MOCK_API = false;
```

- Esta configuracion es segura para frontend porque contiene URL publica y companyId operativo, no credenciales.
- Si luego se quiere separar ambientes, generar `app-config.js` por ambiente en pipeline o copiarlo durante deploy, siempre sin secretos.

Opciones de deploy:

Opcion A - GitHub Actions recomendado:
- Crear Static Web App conectada al repo `PedroJ13/PuntoClub`.
- App location: `app`
- API location: vacio, porque API vive en Azure Functions separada.
- Output location: vacio, porque `app/` es estatico sin build.
- Azure generara workflow de deploy.
- Impacto: agrega/cambia pipeline, por lo que requiere confirmacion explicita.

Opcion B - Deploy manual inicial:
- Crear Static Web App sin conectar pipeline o con deploy token.
- Subir contenido de `app/` como sitio estatico.
- Util para primer PO Test, pero menos repetible que GitHub Actions.

Comandos de referencia, no ejecutados:

```powershell
az staticwebapp create `
  --name swa-puntoclub-prod-001 `
  --resource-group resource_group_main `
  --location eastus2 `
  --sku Free
```

Si se conecta a GitHub Actions, completar con token/repo/branch/app-location segun el metodo elegido por Azure CLI o Portal. No guardar tokens en repo.

CORS despues de crear SWA:
- Cuando exista hostname real de Static Web Apps, agregarlo como origen permitido en Azure Functions.
- Ejemplo:

```powershell
az functionapp cors add `
  --name func-puntoclub-prod-br-001 `
  --resource-group resource_group_main `
  --allowed-origins https://<static-web-app-hostname>
```

- Mantener temporalmente los origenes locales `http://127.0.0.1:4173` y `http://127.0.0.1:4175` mientras Web Dev/QA sigan usandolos.
- No usar wildcard `*`.

Validacion esperada despues de crear SWA:
- Abrir URL de Static Web Apps.
- Confirmar que carga UI real.
- Confirmar en navegador:
  - listado de clientes carga desde API estable.
  - registro de cliente funciona.
  - duplicado muestra error controlado.
  - validacion de campos muestra error controlado.
- Validar CORS desde hostname real:

```text
OPTIONS /api/companies/1/customers -> 204 con Access-Control-Allow-Origin = https://<swa-hostname>
GET /api/companies/1/customers -> 200 con Access-Control-Allow-Origin = https://<swa-hostname>
POST /api/companies/1/customers -> 201 con Access-Control-Allow-Origin = https://<swa-hostname>
```

Verificacion ejecutada:
- Leidos `chat-start/INFRA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-035-HANDOFF.md`, `tasks/TASK-040.md` y `app/app-config.js`.
- Inventariado Static Web Apps existente con `az staticwebapp list`.
- Confirmado que `app/app-config.js` no contiene secretos.
- No se creo Static Web Apps.
- No se cambio CORS para hostname real porque aun no existe hostname de Punto Club.
- No se cambiaron archivos de frontend ni API.

Resultado:
Plan listo para crear Static Web Apps de Punto Club, pero queda pendiente la confirmacion explicita del usuario para crear el recurso y elegir deploy por GitHub Actions o deploy manual inicial.

Riesgos o pendientes:
- Frontend estable sigue pendiente hasta crear SWA.
- Si se usa GitHub Actions, se agrega pipeline y requiere token/conexion GitHub segura.
- Si se usa deploy manual, se resuelve PO Test rapido pero queda deuda de repetibilidad.
- Despues de crear SWA, CORS de Azure Functions debe incluir el hostname real.
- `GET /settings` aun depende de TASK-039/redeploy API si Web/QA lo requieren en URL estable.

Siguiente recomendado:
Pedir confirmacion explicita para crear `swa-puntoclub-prod-001` en plan Free. Para PO Test rapido, usar deploy manual inicial de `app/`; para flujo sostenible, conectar GitHub Actions con `app_location=app`, `api_location` vacio y `output_location` vacio.
