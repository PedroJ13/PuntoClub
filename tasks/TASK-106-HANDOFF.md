Equipo:
Backend/API

Tarea completada:
TASK-106 - Revisar responses 5xx recientes en Application Insights.

Fuentes consultadas:
- `tasks/TASK-106-assignment.md`.
- `tasks/TASK-098-HANDOFF.md`.
- Application Insights `func-puntoclub-prod-br-001` via REST/KQL con token local no impreso.
- Azure SQL metrics agregadas via Azure Monitor.
- Azure Activity Log de `resource_group_main`.

Resumen:
- Se revisaron requests `resultCode >= 500` recientes.
- En ultimas 24h hay 6 responses 500.
- Los 6 corresponden al mismo endpoint:
  - `GET /api/companies/1/settings`
  - operation/name: `getCompanySettings`
- No hay exceptions registradas asociadas.
- Si hay traces severity 3 asociados, todos son el mismo tipo:
  - `TimeoutError: operation timed out for an unknown reason`
  - stack en `node_modules/tarn/dist/PendingOperation.js`
- No se imprimieron tokens, connection strings, headers, query strings ni payloads.

Ventana horaria:
- UTC:
  - primer request 500: `2026-06-06T23:28:42Z`
  - ultimo request 500: `2026-06-06T23:28:44Z`
  - traces de timeout: `2026-06-06T23:29:12Z` a `2026-06-06T23:29:14Z`
- Costa Rica:
  - aproximadamente `2026-06-06 17:28:42` a `17:29:14`.

Evidencia Application Insights:
- Requests 5xx ultimas 24h:
  - `getCompanySettings`, resultCode `500`, count `6`.
  - duracion aproximada: `28.9s` a `30.0s`.
- Requests 5xx ultimos 7 dias:
  - mismos 6 de `getCompanySettings` en ultimas 24h.
  - adicional historico: 1 request `listCustomers` 500 el `2026-06-04T22:01:53Z`, fuera del foco de TASK-106.
- Exceptions:
  - `0` asociadas a la ventana revisada.
- Dependencies:
  - no se observaron dependency rows asociadas en Application Insights para esa ventana.
- Traces:
  - 6 traces severity 3 con timeout de pool/conexion.

Evidencia Azure SQL:
- Ventana revisada: `2026-06-06T23:20Z` a `23:40Z`.
- `connection_failed`:
  - `6` en `2026-06-06T23:29Z`.
  - `12` en `2026-06-06T23:30Z`.
- `connection_successful`:
  - `6` en `2026-06-06T23:30Z`.
- `availability`:
  - `100` en los minutos con datos alrededor de la ventana.

Correlacion con deploy/pruebas:
- Azure Activity Log no mostro operaciones sobre `func-puntoclub-prod-br-001` entre `2026-06-06T22:30Z` y `2026-06-07T00:30Z`.
- No hay evidencia de deploy/restart/config write en esa ventana.
- La concentracion en una ventana de ~1.4 segundos, duracion cercana a 30s, traces `tarn` y metricas SQL con conexiones fallidas/siguientes conexiones exitosas apuntan a conectividad SQL transitoria o calentamiento/pool, no a fallo logico del endpoint.

Clasificacion:
- Principal: `calentamiento/SQL paused o conectividad SQL transitoria`.
- No clasificado como deploy/transitorio por Activity Log, porque no hubo actividad de deploy observada.
- No clasificado como fallo real de codigo, porque:
  - no hay exceptions;
  - todos los 5xx son simultaneos;
  - todos son timeouts de pool/conexion;
  - SQL muestra connection_failed y luego connection_successful;
  - no hay patron repetido en otros endpoints dentro de ultimas 24h.

Recomendacion:
- No abrir tarea de codigo Backend/API por ahora.
- Antes de sesiones piloto, seguir usando el runbook de calentamiento SQL/API.
- Durante la siguiente sesion, revisar Application Insights post-sesion:
  - requests `resultCode >= 500`;
  - traces severity 3;
  - SQL `connection_failed`.
- Si se repite el patron durante uso real, abrir tarea pequena para evaluar:
  - retry controlado en apertura de conexion SQL para lecturas idempotentes;
  - warm-up automatico antes de validar;
  - alerta `Http5xx > 0` + `connection_failed > 0`.

Pendientes:
- Ningun P0/P1 detectado.
- No se cambiaron codigo, Azure, DB ni configuracion.
- No se instalaron extensiones.
