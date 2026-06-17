# TASK-314 - Handoff

Equipo: Ejecucion Tecnica  
Modo de ejecucion: Backend/API  
Round: 50  
Estado: Bloqueado / causa confirmada

## Resultado

No se pudo corregir el fallo desde Backend/API en este paso.  
La causa raiz identificada es ambiental / SQL:

- La base Azure SQL de piloto aparece **pausada por cuota mensual gratuita**.
- Por ese motivo `GET /companies/1/settings` responde `500` con `INTERNAL_ERROR` en el smoke test.

## Evidencia técnica

1. Reproducción de smoke (paso reportado en workflow):
   - `npm run smoke` (con `API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api` y `PILOT_COMPANY_ID=1`)
   - Resultado: `GET /companies/1/settings expected 200, got 500: {"error":{"code":"INTERNAL_ERROR","message":"Unexpected API error."}}`

2. Diagnóstico directo contra base objetivo desde entorno local (`api`):
   - Ejecución de `getCompanySettings(1)` en `api/src/lib/repository.js` usando `SQL_CONNECTION_STRING` de `api/local.settings.json`.
   - Resultado:
     - mensaje: `This database has reached the monthly free amount allowance for the month of June 2026 and is paused for the remainder of the month...`
     - `code`: `ELOGIN`

3. Correlación en código:
   - `getCompanySettings` fuerza consulta SQL en `api/src/lib/repository.js`.
   - `mapSqlError` no clasifica este caso específico de DB pausada, así que emite `INTERNAL_ERROR`.

## Archivos tocados

- `tasks/TASK-314-HANDOFF.md` (creado)

## Tests/checks ejecutados

- `npm run smoke` (fallo controlado en el primer endpoint).
- Validación directa de `getCompanySettings(1)` contra `sql-db-puntoclub` (falla por DB pausada).
- `npm test` (no usable en este entorno: `EPERM` al spawnear subprocessos, sin relación con el fallo de settings).

## Estado de workflow / reintento

- Workflow API (`Deploy Punto Club API`) sigue bloqueado en `Smoke test stable API` mientras la DB continúe pausada.
- Reintento válido: **después** de que Infra/SQL reanude la DB y la configuración de endpoint vuelva estable.

## Qué pedir a Infra/SQL

- Reanudar `sqlserver-pj13-brazil / sql-db-puntoclub` en el plan objetivo (opción de pago si aplica).
- Confirmar fecha/hora exacta de reanudación y volver a ejecutar smoke API desde workflow.

## Nota de acción recomendada (no bloqueo de evidencia)

- Mantener este fallo como bloqueante de infraestructura (no workaround en código): sin conexión SQL estable no hay verificación de deploy funcional.

## Round 51 - Reintento de Infra

Objetivo solicitado:
- Reanudar `sqlserver-pj13-brazil / sql-db-puntoclub` y reintentar smoke API tras la reanudación.

Evidencia ejecutada en esta ronda:

1. Revisión directa de conexión con `SQL_CONNECTION_STRING` del runtime:
   - Se confirma nuevamente `ELOGIN` con texto de base pausada por cuota mensual free de junio.
   - Ejemplo: mensaje con fecha de renovación el `01-jul-2026 00:00 UTC`.

2. Intento de ejecución de control con usuario admin de DB (host local):
   - Conexión hacia `sqlserver-pj13-brazil` bloqueada por firewall para IP del entorno.
   - Mensaje: `Client with IP address ... is not allowed to access the server`.
   - Sin acceso temporal abierto, no se pudo ejecutar `ALTER DATABASE ... RESUME`.

3. Intento de operación de Infra (Azure CLI):
   - Falló por problema de sesión local (`az.sess`) y luego por falta de conectividad de autenticación (`ProxyError` al contactar `login.microsoftonline.com`).
   - Sin autenticación efectiva, no se pudo aplicar cambio de configuración en Azure.

4. Reintento del smoke de API:
   - Ejecutado en esta ronda.
   - Estado: sigue fallando en primer endpoint con `500 INTERNAL_ERROR` (`GET /companies/1/settings`), consistente con DB no reanudada.

Estado final de la tarea:

- `SQL DB` no reanudada desde esta sesión por bloqueo operativo externo (firewall/portal login/proxy).
- No se pudo reintentar workflow con éxito porque el precondición del DB resumido sigue sin resolverse.

Acción inmediata pendiente para Infra:

- Abrir `Azure Portal` > `sql-db-puntoclub` > `Compute + storage` > `Continue using database with additional charges` (o equivalente según configuración), confirmando costo estimado.
- Validar que la IP del equipo queda permitida o usar una regla temporal controlada mientras se valida.
- Confirmar al cierre: estado SQL activo y `resume` comprobable desde entorno runtime.
- Reintentar el workflow de API: `Deploy Punto Club API` y reportar resultado.
