Equipo:
Infra / Azure

Tarea completada:
TASK-074 - Checklist operativo Azure pre-piloto.

Archivos cambiados:
- `tasks/TASK-074-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `tasks/TASK-074-assignment.md`, `codex-project-templates/INFRA.md`, `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Azure Static Web Apps consultado en modo solo lectura:
  - Recurso: `swa-puntoclub-prod-001`
  - Host: `calm-dune-075dc5c0f.7.azurestaticapps.net`
  - Repo: `https://github.com/PedroJ13/PuntoClub`
  - Branch: `main`
  - Provider: `GitHub`
  - SKU: `Free`
  - Region: `East US 2`
- Frontend publicado validado con GET publico:
  - URL: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
  - Resultado: `200`
  - Contenido contiene `Punto Club`.
- Azure Function App consultada en modo solo lectura:
  - Recurso: `func-puntoclub-prod-br-001`
  - Host: `func-puntoclub-prod-br-001.azurewebsites.net`
  - Estado: `Running`
  - Runtime: `Node|22`
  - Region: `Brazil South`
- Funciones registradas en Azure:
  - `createCustomer`
  - `createPurchase`
  - `createRedemption`
  - `getCompanySettings`
  - `getCustomerActivity`
  - `getCustomerBalance`
  - `listCustomers`
- Azure SQL consultado en modo solo lectura:
  - Server/DB: `sqlserver-pj13-brazil/sql-db-puntoclub`
  - Estado inicial observado: `Resuming`
  - Estado posterior observado: `Online`
  - Tier: `GeneralPurpose`
  - SKU: `GP_S_Gen5_2`
  - Serverless/free limit: `useFreeLimit=true`, `autoPauseDelay=60`, `minCapacity=0.5`
- Firewall SQL consultado en modo solo lectura:
  - Regla existente: `AllowAllWindowsAzureIps` (`0.0.0.0` a `0.0.0.0`)
- CORS Function App consultado en modo solo lectura:
  - Permitido: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
  - Permitido para dev local: `http://127.0.0.1:4173`, `http://127.0.0.1:4175`
  - `supportCredentials=false`
- App settings revisados sin imprimir valores:
  - `APPLICATIONINSIGHTS_CONNECTION_STRING`
  - `AzureWebJobsStorage`
  - `FUNCTIONS_EXTENSION_VERSION`
  - `FUNCTIONS_WORKER_RUNTIME`
  - `PILOT_COMPANY_ID`
  - `SCM_DO_BUILD_DURING_DEPLOYMENT`
  - `SQL_CONNECTION_STRING`
  - `WEBSITE_CONTENTAZUREFILECONNECTIONSTRING`
  - `WEBSITE_CONTENTSHARE`
  - `WEBSITE_RUN_FROM_PACKAGE` ya no esta presente.
- Application Insights:
  - Existe componente en `resource_group_main`: `func-puntoclub-prod-br-001`
  - Region: `brazilsouth`
  - Function App tiene `APPLICATIONINSIGHTS_CONNECTION_STRING` configurado.
- Logs de Function App:
  - `az webapp log show` reporta `detailedErrorMessages=false`, `failedRequestsTracing=false`, y logging file/http no habilitado en esa configuracion.
  - Para operacion normal, usar Application Insights y Log stream del portal.
- GitHub Actions consultado en modo solo lectura:
  - Workflow frontend: `Deploy Punto Club frontend`
  - Ultima corrida observada: success, `2026-06-06T16:26:28Z`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/27067614108`
  - Workflow API: `Deploy Punto Club API`
  - Ultima corrida observada: success, `2026-06-05T22:12:48Z`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/27042830528`

Resultado:
- Los tres recursos base existen y responden:
  - Static Web App publicada y conectada a GitHub.
  - Function App en `Running` con funciones registradas.
  - Azure SQL quedo `Online` despues de reanudar desde serverless.
- Los deploys repetibles existen:
  - Frontend por GitHub Actions, con corridas exitosas recientes.
  - API por GitHub Actions/OIDC, con corrida exitosa reciente y `WEBSITE_RUN_FROM_PACKAGE` removido.
- Application Insights existe y esta conectado por app setting.
- CORS permite el frontend publicado y conserva dos origenes locales para desarrollo.
- No se imprimieron connection strings, tokens, passwords, deployment tokens ni SAS.
- No se invocaron endpoints de datos de clientes para evitar exponer datos reales del piloto en salida de terminal.

Rutas donde revisar logs:
- Frontend deploy:
  - GitHub Actions: `https://github.com/PedroJ13/PuntoClub/actions/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
  - Azure Portal: Static Web Apps > `swa-puntoclub-prod-001` > Deployment history / Environments.
- API deploy:
  - GitHub Actions: `https://github.com/PedroJ13/PuntoClub/actions/workflows/azure-functions-api.yml`
  - Azure Portal: Function App > `func-puntoclub-prod-br-001` > Deployment Center / Deployments.
- Function runtime logs:
  - Azure Portal: Function App > `func-puntoclub-prod-br-001` > Log stream.
  - Azure Portal: Function App > Application Insights > Failures / Performance / Logs.
  - CLI util: `az webapp log tail --resource-group resource_group_main --name func-puntoclub-prod-br-001`
- SQL:
  - Azure Portal: SQL Database > `sql-db-puntoclub` > Overview, Metrics, Query Performance Insight, Activity log.
  - Azure Portal: SQL server > `sqlserver-pj13-brazil` > Networking / Firewall rules.

Riesgos o pendientes:
- P0: Ninguno detectado en esta revision operativa.
- P1: SQL usa regla `AllowAllWindowsAzureIps`; es practica para que Azure Functions acceda, pero amplia el acceso desde servicios Azure. Endurecer requiere planificar conectividad, firewall o private access sin romper API.
- P1: SQL serverless puede estar en `Resuming` al primer acceso despues de pausa; para piloto real puede causar latencia inicial o falsos sustos operativos.
- P2: CORS conserva origenes locales `127.0.0.1`; util para dev, pero conviene retirarlos cuando ya no hagan falta para pruebas locales.
- P2: `az webapp log show` no muestra file/http logging habilitado; Application Insights cubre observabilidad principal, pero Log stream puede requerir ajustes si se necesita diagnostico inmediato mas verboso.
- P2: Static Web Apps esta en SKU Free; suficiente para piloto pequeno, pero revisar si se requiere SLA/capacidades superiores.

Runbook corto recomendado:
- Deploy frontend fallido:
  1. Abrir GitHub Actions workflow `Deploy Punto Club frontend`.
  2. Revisar paso `Deploy` y confirmar que el secreto `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001` existe sin revelar valor.
  3. Confirmar que el cambio toca `app/**` o ejecutar `workflow_dispatch`.
  4. Si GitHub pasa pero la web no cambia, revisar Azure Portal > Static Web Apps > Deployment history.
- Deploy API fallido:
  1. Abrir GitHub Actions workflow `Deploy Punto Club API`.
  2. Revisar si falla en `npm test`, `Azure login`, `config-zip` o `Smoke test stable API`.
  3. Si falla login, revisar OIDC/service principal/role assignment sin rotar credenciales hasta confirmar causa.
  4. Si falla smoke, revisar Function App > Application Insights y SQL estado/firewall.
- API 500:
  1. Revisar Application Insights > Failures para la excepcion y correlation id.
  2. Revisar Function App > Log stream durante una reproduccion controlada.
  3. Confirmar que `SQL_CONNECTION_STRING` existe sin imprimir valor.
  4. Confirmar SQL `Online` y revisar firewall si el error apunta a conectividad.
- UI no carga:
  1. Abrir `https://calm-dune-075dc5c0f.7.azurestaticapps.net` y verificar status HTTP.
  2. Revisar GitHub Actions frontend y Deployment history de SWA.
  3. Si carga HTML pero falla data, revisar consola del navegador y CORS/API.
  4. Confirmar que el frontend apunta a `https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
- SQL no responde/firewall:
  1. Revisar SQL Database overview: `Online`, `Resuming`, `Paused` o errores.
  2. Si esta `Resuming`, esperar y reintentar; documentar latencia si afecta piloto.
  3. Revisar SQL server > Networking para reglas de firewall.
  4. No cambiar firewall sin aprobacion explicita; si se requiere cambio, explicar impacto antes.

Siguiente recomendado:
- Mantener Application Insights como ruta principal de diagnostico para API.
- Decidir antes del piloto si se endurece firewall SQL o se acepta temporalmente `AllowAllWindowsAzureIps`.
- Decidir si se retiran origenes CORS locales cuando termine la ventana de pruebas dev.
- Considerar si SQL serverless con auto-pause es aceptable para el piloto o si conviene evitar pausas durante horarios de uso real.
