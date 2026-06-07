Equipo:
Infra / Azure

Tarea completada:
TASK-098 - Revisar observabilidad operativa Azure para piloto.

Archivos cambiados:
- `tasks/TASK-098-HANDOFF.md`

Verificacion ejecutada:
- Se leyo `tasks/TASK-098-assignment.md`.
- Se leyo contexto minimo Infra:
  - `chat-start/INFRA.md`
  - `AGENTS.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/PILOT_RUNBOOK.md`
- Se consultaron recursos Azure en modo solo lectura:
  - Function App `func-puntoclub-prod-br-001`
  - Static Web App `swa-puntoclub-prod-001`
  - Azure SQL `sqlserver-pj13-brazil/sql-db-puntoclub`
  - Application Insights `func-puntoclub-prod-br-001`
  - Azure Monitor metrics/diagnostic settings/alerts/action groups
- No se instalaron extensiones nuevas. El comando `az monitor app-insights query` pidio instalar extension `application-insights`; no se instalo por regla de la tarea.
- Se uso consulta REST con token local no impreso para obtener solo conteos agregados de Application Insights.
- No se imprimieron secretos, connection strings, tokens, payloads ni datos de negocio.

Estado actual:

1. Azure Functions
   - Recurso: `func-puntoclub-prod-br-001`
   - Estado: `Running`
   - Host: `func-puntoclub-prod-br-001.azurewebsites.net`
   - Runtime: `Node|22`
   - Region: `Brazil South`
   - App settings relevantes presentes, sin valores impresos:
     - `APPLICATIONINSIGHTS_CONNECTION_STRING`
     - `SQL_CONNECTION_STRING`
     - `AzureWebJobsStorage`
     - `PILOT_COMPANY_ID`
   - Application Insights esta conectado por app setting.
   - `az webapp log show` reporta:
     - `detailedErrorMessages=false`
     - `failedRequestsTracing=false`
     - `applicationLogging=null`
     - `httpLogging=null`
   - Diagnostic settings exportados para Function App:
     - No se encontraron settings hacia Log Analytics/storage/event hub.
   - Azure Monitor metrics disponibles/consultables:
     - `Requests`
     - `Http5xx`
     - `Http4xx`
     - `AverageResponseTime`
   - Consulta agregada en Application Insights, ultimas 24h:
     - Requests totales: `323`
     - Requests fallidos por `success == false`: `0`
     - Responses con `resultCode >= 500`: `6`
     - Exceptions: `0`
     - Traces por severidad:
       - severity `0`: `1`
       - severity `1`: `1723`
       - severity `3`: `22`

2. Application Insights
   - Recurso: `func-puntoclub-prod-br-001`
   - Region: `brazilsouth`
   - Tipo: `web`
   - AppId presente.
   - Connection string presente en Function App.
   - Permite consultar requests, exceptions y traces con KQL/REST.
   - Brecha: no hay alertas metricas explicitas configuradas para `Http5xx`, availability, SQL connection failures o errores del frontend.

3. Static Web Apps
   - Recurso: `swa-puntoclub-prod-001`
   - Host: `calm-dune-075dc5c0f.7.azurestaticapps.net`
   - Repo: `https://github.com/PedroJ13/PuntoClub`
   - Branch: `main`
   - Provider: `GitHub`
   - SKU: `Free`
   - Region: `East US 2`
   - Diagnostic settings exportados:
     - No se encontraron settings hacia Log Analytics/storage/event hub.
   - Azure Monitor expone metricas consultables:
     - `SiteHits`
     - `SiteErrors`
     - `FunctionHits`
     - `FunctionErrors`
     - `DataApiHits`
     - `DataApiErrors`
     - `BytesSent`
     - `CdnPercentageOf4XX`
     - `CdnPercentageOf5XX`
     - `CdnRequestCount`
     - `CdnResponseSize`
     - `CdnTotalLatency`
   - Diagnostico minimo disponible:
     - GitHub Actions del workflow frontend.
     - Static Web Apps > Deployment history / Environments.
     - Azure Monitor metrics de SWA.
   - Brecha: sin Application Insights propio del frontend y sin alertas explicitas de errores CDN/SiteErrors.

4. Azure SQL
   - Recurso: `sqlserver-pj13-brazil/sql-db-puntoclub`
   - Estado observado: `Paused`
   - Tier/SKU: `GeneralPurpose`, `GP_S_Gen5_2`
   - Serverless:
     - `autoPauseDelay=60`
     - `minCapacity=0.5`
     - `useFreeLimit=true`
   - Diagnostic settings exportados:
     - No se encontraron settings hacia Log Analytics/storage/event hub.
   - Metricas consultables utiles para piloto:
     - `availability`
     - `cpu_percent`
     - `app_cpu_percent`
     - `app_cpu_billed`
     - `storage_percent`
     - `connection_successful`
     - `connection_failed`
     - `connection_failed_user_error`
     - `blocked_by_firewall`
     - `deadlock`
     - `sessions_percent`
     - `workers_percent`
     - `free_amount_remaining`
     - `free_amount_consumed`
   - Ultima consulta agregada de metricas:
     - `availability`: `100`
     - `blocked_by_firewall`: `0`
     - `connection_successful`: `1`
     - `connection_failed`: `1`
   - Brecha: sin alerta explicita para SQL no disponible, conexiones fallidas, firewall blocks, deadlocks o consumo free/serverless.

5. Alertas / action groups
   - Metric alerts en `resource_group_main`:
     - Ninguna encontrada.
   - Action groups:
     - `Application Insights Smart Detection`, habilitado.
   - Brecha:
     - Smart Detection ayuda, pero no reemplaza alertas operativas explicitas para el piloto.

Estado de errores API visibles:
- Si hay 500 de API, quedan visibles de forma agregada en Application Insights como requests con `resultCode >= 500`.
- No se volcaron rutas, cuerpos, headers ni datos de negocio.
- Se detectaron `6` respuestas 5xx en ultimas 24h. Recomendacion: revisar en portal antes de ampliar piloto para clasificar si fueron pruebas controladas, calentamiento, deploy o fallo real.

Brechas:
- No hay alertas explicitas de Azure Monitor.
- No hay diagnostic settings exportando logs/metricas a Log Analytics o storage.
- App Service file/http logging clasico aparece deshabilitado.
- SWA no tiene trazabilidad frontend profunda; se depende de Deployment history, GitHub Actions, metricas SWA y reportes del navegador.
- SQL serverless puede estar `Paused`; visibilidad existe por estado y metricas, pero requiere runbook operativo para interpretar `Paused`/`Resuming`.
- No hay staging formal; observabilidad revisada es sobre production piloto.

Recomendaciones P0/P1/P2/P3:

- P0:
  - Ninguna accion bloqueante detectada.

- P1:
  - Revisar los `6` responses 5xx en Application Insights antes de ampliar piloto. No requiere cambio de infraestructura; es lectura/triage.
  - Definir responsable operativo para revisar Application Insights durante y despues de sesiones piloto.

- P2:
  - Crear alertas pequenas y baratas, con aprobacion explicita:
    - Function App `Http5xx > 0` en ventana corta.
    - SQL `availability < 100` o `connection_failed > 0`.
    - SQL `blocked_by_firewall > 0`.
    - SWA `CdnPercentageOf5XX > 0` o `SiteErrors > 0`.
  - Configurar destinatario/action group real para piloto si el usuario quiere notificaciones. Puede ser email del responsable operativo.
  - Documentar consulta KQL corta para requests 5xx y exceptions en el runbook operativo.

- P3:
  - Evaluar diagnostic settings a Log Analytics si el piloto crece o si se necesita retencion/busqueda centralizada.
  - Evaluar instrumentacion frontend mas adelante si aparecen errores UI dificiles de reproducir.
  - Considerar una mini rutina post-sesion: revisar `Http5xx`, `exceptions`, `connection_failed`, `blocked_by_firewall` y `SWA SiteErrors`.

Cambios pequenos recomendados, no aplicados:
- Opcion minima:
  - Crear 3 a 4 alertas metricas de Azure Monitor para Function/SWA/SQL.
  - Reutilizar o ajustar action group con destinatario real.
  - Impacto: mejora deteccion temprana; costo bajo o nulo segun volumen y reglas, pero requiere aprobacion porque cambia observabilidad.
- Opcion siguiente:
  - Crear diagnostic settings a Log Analytics.
  - Impacto: mejor busqueda y retencion; puede generar costo por ingesta/retencion.
- No recomiendo cambios de SKU, firewall ni arquitectura para esta tarea.

Apoyo requerido del usuario:
- Confirmar si quiere crear alertas metricas antes de ampliar piloto.
- Confirmar destinatario de notificaciones si se crean alertas.
- Confirmar si los 5xx recientes corresponden a pruebas conocidas; si no, Backend/API deberia revisar Application Insights con detalle.

Siguiente recomendado:
- Product / Architect / Release decide si abre una tarea pequena para:
  - crear alertas metricas minimas;
  - revisar los 5xx de Application Insights;
  - agregar consultas KQL al runbook.
