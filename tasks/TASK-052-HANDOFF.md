Equipo:
Infra / Azure

Tarea completada:
Revision operativa pre-piloto de Static Web Apps, Azure Functions, Azure SQL, CORS, deploy y riesgos de costos/configuracion.

Estado operativo actual:
- Frontend publicado:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
  - Responde `200`.
  - Carga UI real de Punto Club, no pagina default de Azure Static Web Apps.
- Static Web App:
  - nombre: `swa-puntoclub-prod-001`
  - resource group: `resource_group_main`
  - region: `East US 2`
  - plan: `Free`
  - provider: `GitHub`
  - repo: `https://github.com/PedroJ13/PuntoClub`
  - branch: `main`
- GitHub Actions:
  - workflow: `Deploy Punto Club frontend`
  - ultimo run consultado: `completed / success`
  - run: `https://github.com/PedroJ13/PuntoClub/actions/runs/26984422494`
  - run anterior tambien `completed / success`: `https://github.com/PedroJ13/PuntoClub/actions/runs/26924420455`
- GitHub Secret de deploy:
  - No se puede leer el valor, correctamente.
  - Inferencia operativa: existe y funciona, porque el workflow `Deploy Punto Club frontend` completo exitosamente y publico la UI real.
- API estable:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
  - Function App `func-puntoclub-prod-br-001`
  - region: `Brazil South`
  - runtime: `Node|22`
  - estado: `Running`
- Azure SQL:
  - server: `sqlserver-pj13-brazil`
  - database: `sql-db-puntoclub`
  - region: `brazilsouth`
  - status: `Online`
  - tier actual: `GeneralPurpose`, `GP_S_Gen5_2`, serverless, 2 vCores
  - min capacity: `0.5`
  - auto-pause: `60` minutos
  - free limit: habilitado
- Storage runtime/API package:
  - storage: `stpuntoclubfuncbr001`
  - region: `brazilsouth`
  - sku: `Standard_LRS`
  - HTTPS only: `true`
  - minimum TLS: `TLS1_2`
  - blob public access: `false`

Confirmacion de `app-config.js`:
- URL: `https://calm-dune-075dc5c0f.7.azurestaticapps.net/app-config.js`
- Responde `200`.
- Contiene `PUNTO_CLUB_API_BASE_URL`.
- No se detectaron patrones obvios de secretos (`Password`, `SQL_CONNECTION`, `sig=`, `apiKey`, `token`).
- Configuracion publicada:

```js
window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net";
window.PUNTO_CLUB_COMPANY_ID = "1";
window.PUNTO_CLUB_USE_MOCK_API = false;
```

Confirmacion de CORS:
- Configuracion actual:

```json
{
  "allowedOrigins": [
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4175",
    "https://calm-dune-075dc5c0f.7.azurestaticapps.net"
  ],
  "supportCredentials": false
}
```

- Sin wildcard `*`.
- Validacion desde frontend publicado:

```text
OPTIONS_STATUS=204
OPTIONS_ACAO=https://calm-dune-075dc5c0f.7.azurestaticapps.net
GET_STATUS=200
GET_ACAO=https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

Riesgos P0/P1/P2/P3:

P0:
- Ninguno detectado en esta revision.

P1:
- `WEBSITE_RUN_FROM_PACKAGE` de Azure Functions usa un SAS privado con expiracion cercana:
  - storage host: `stpuntoclubfuncbr001.blob.core.windows.net`
  - package path: `/function-releases/api-task039-20260603152441.zip`
  - SAS presente: si
  - expiracion: `2026-06-10T21:28Z`
- Riesgo: si expira antes de reemplazarlo o redeployar con pipeline formal, la Function App puede quedar sin paquete accesible en reinicios/scale/cold start futuros.
- Impacto: API estable podria fallar aunque frontend siga publicado.

P1:
- Deploy API no es repetible formalmente todavia.
- El deploy actual de Azure Functions depende de paquete manual en Blob + `WEBSITE_RUN_FROM_PACKAGE`.
- Riesgo: proximo cambio de API puede requerir procedimiento manual delicado y facil de romper.

P1:
- SQL firewall mantiene `AllowAllWindowsAzureIps` (`0.0.0.0` a `0.0.0.0`).
- Riesgo: permite conexiones desde servicios Azure en general, no solo la Function App de Punto Club.
- Impacto mitigado por usuario SQL runtime con permisos minimos, pero sigue siendo una superficie amplia.

P2:
- CORS mantiene origenes locales `127.0.0.1:4173` y `127.0.0.1:4175`.
- Riesgo bajo para piloto, pero conviene retirarlos cuando PO/QA ya no necesiten pruebas locales.

P2:
- Azure SQL actual no coincide con costo minimo original Basic DTU; esta en General Purpose serverless con free limit.
- Riesgo: si el free limit cambia/se agota o aumenta trafico, costo puede ser mayor que el plan minimo inicial.

P2:
- Static Web Apps esta en plan Free.
- Riesgo aceptable para piloto; revisar si se requiere SLA, dominio custom, auth/control de acceso o reglas mas formales.

P3:
- No hay Application Insights formalmente revisado en esta pasada para trazabilidad de errores end-to-end.
- Recomendable antes de uso sostenido, no bloqueante para piloto corto.

Recomendacion concreta para API deploy repetible:
- Prioridad: P1 antes de ampliar piloto.
- Crear workflow GitHub Actions separado para API deploy a `func-puntoclub-prod-br-001`.
- Usar un mecanismo que no exponga secretos:
  - preferible: GitHub Actions con Azure OIDC/federated credentials y `azure/login`;
  - alternativa rapida: GitHub Secret con publish profile o deployment credentials, tratado como secreto.
- El workflow debe:
  - empaquetar `api/` excluyendo `local.settings.json`, logs y `local-secrets/`;
  - instalar dependencias o incluir `node_modules` de forma controlada;
  - publicar a Azure Functions;
  - renovar/reemplazar `WEBSITE_RUN_FROM_PACKAGE` automaticamente;
  - ejecutar smoke test contra `https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
- Accion urgente si no se arma pipeline hoy:
  - redeployar API o renovar `WEBSITE_RUN_FROM_PACKAGE` antes de `2026-06-10T21:28Z`.

Recomendacion concreta para firewall SQL:
- Mantener `AllowAllWindowsAzureIps` temporalmente durante piloto inmediato solo si se acepta el riesgo.
- No eliminarlo sin confirmacion explicita porque la Function App puede depender de esa regla para conectar.
- Endurecimiento recomendado P1:
  - evaluar Private Endpoint o networking mas restringido para Azure Functions;
  - o migrar a un patron de acceso mas acotado cuando haya pipeline/infra formal;
  - mantener usuario SQL runtime con permisos minimos y no usar admin en runtime.

Costo/plan basico observado:
- Static Web Apps: `Free`.
- Function App: Linux Azure Functions, Consumption inferido por creacion previa; runtime `Node|22`.
- Storage runtime/package: `Standard_LRS`.
- Azure SQL: `GeneralPurpose GP_S_Gen5_2` serverless con free limit, auto-pause 60 min.
- Riesgo de costo principal: SQL serverless General Purpose si aumenta uso o free limit no cubre el piloto.

Verificacion ejecutada:
- Leido `tasks/TASK-052-assignment.md`.
- Consultado `az staticwebapp show`.
- Consultado `az functionapp show`.
- Consultado `az sql db show`.
- Consultado `az sql server firewall-rule list`.
- Consultado `az functionapp cors show`.
- Consultado `az storage account show`.
- Consultado `WEBSITE_RUN_FROM_PACKAGE` sin imprimir URL completa ni SAS; solo host/path/expiracion.
- Consultados ultimos workflow runs publicos de GitHub Actions.
- Verificado frontend publicado con `fetch`.
- Verificado `app-config.js` publicado con `fetch`.
- Verificado CORS real desde el origen publicado.
- No se modificaron recursos.
- No se imprimieron tokens, SAS, connection strings ni passwords.

Apoyo requerido del usuario:
- Confirmar si aceptamos temporalmente `AllowAllWindowsAzureIps` durante el piloto o si se abre tarea P1 para endurecer SQL networking.
- Priorizar una tarea para workflow de deploy repetible de API antes del `2026-06-10T21:28Z`.
- Confirmar si los origenes locales CORS deben mantenerse durante QA o retirarse despues de PO Test.
