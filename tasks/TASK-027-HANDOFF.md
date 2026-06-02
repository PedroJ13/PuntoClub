Equipo:
Infra / Azure

Tarea completada:
Definicion de ruta repetible para que Backend/API y QA puedan conectarse a `sqlserver-pj13-brazil/sql-db-puntoclub` sin exponer secretos.

Contexto usado:
- TASK-023 creo `puntoclub_app_user`, configuro `api/local.settings.json` local y confirmo permisos minimos.
- TASK-024 logro smoke test real al abrir una regla temporal de firewall para la IP local.
- TASK-025/TASK-026 fallaron despues porque Azure SQL volvio a bloquear la IP local de validacion.
- `api/local.settings.json` contiene `SQL_CONNECTION_STRING` local y esta ignorado.
- `local-secrets/` contiene credenciales admin locales y esta ignorado.

Decision recomendada:
- Corto plazo para TASK-028: usar regla temporal de firewall por IP local, con apertura/cierre documentado en cada sesion de validacion.
- Ruta estable para QA compartible: preparar/desplegar Azure Functions con `SQL_CONNECTION_STRING` como Application setting secreto, para que la API conecte desde Azure y no dependa de IP local.
- No recomendar reglas amplias adicionales ni dejar IPs locales abiertas indefinidamente.

Opcion A - Validacion local con firewall temporal:
- Uso: Backend/API o QA local desde esta maquina.
- Duracion sugerida: abrir solo durante la ventana de prueba, idealmente menos de 2 horas.
- Limpieza obligatoria: eliminar la regla al terminar o si la prueba falla.
- Nombre de regla sugerido: `AllowTask028ValidationTemp`.
- IP de validacion: pendiente de confirmar al inicio de TASK-028. No se pudo confirmar desde shell en esta pasada.

Comandos para TASK-028, no ejecutados:

```powershell
$ip = (Invoke-RestMethod -Uri "https://api.ipify.org").Trim()
az sql server firewall-rule create `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name AllowTask028ValidationTemp `
  --start-ip-address $ip `
  --end-ip-address $ip
```

Al terminar TASK-028:

```powershell
az sql server firewall-rule delete `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name AllowTask028ValidationTemp
```

Verificacion posterior:

```powershell
az sql server firewall-rule list `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --output table
```

Opcion B - Ruta estable con Azure Functions:
- Uso: QA/Web Dev/Product acceden a una URL estable de API sin depender de IP local.
- Crear o usar Function App production/pilot.
- Configurar Application settings:
  - `SQL_CONNECTION_STRING=<secret>`
  - `PILOT_COMPANY_ID=1`
  - `FUNCTIONS_WORKER_RUNTIME=node`
  - `AzureWebJobsStorage=<secret/runtime storage>`
- Mantener `SQL_CONNECTION_STRING` fuera del repo y fuera de logs.
- Como el servidor SQL tiene `AllowAllWindowsAzureIps`, Azure Functions podria conectar sin abrir una IP local extra.
- Riesgo: `AllowAllWindowsAzureIps` es amplio; aceptable temporalmente para piloto, pero debe revisarse antes de endurecer production.

Opcion C - Alternativa mas controlada:
- Usar Private Endpoint/VNet integration o reglas de red mas restrictivas.
- No recomendada para desbloqueo inmediato del MVP por mayor configuracion y posible costo/operacion.
- Recomendable como P1/pre-lanzamiento si el piloto pasa a uso sostenido.

Secretos:
- No imprimir ni guardar `SQL_CONNECTION_STRING`.
- No copiar valores de `api/local.settings.json` a docs, handoffs o frontend.
- Para local, usar `api/local.settings.json` ignorado por git.
- Para Azure Functions, usar Application settings o GitHub/Azure secrets.

Verificacion ejecutada:
- Leidos `chat-start/INFRA.md`, `AGENTS.md`, `tasks/TASK-027.md`, `tasks/TASK-023-HANDOFF.md`, `tasks/TASK-024-HANDOFF.md` y `tasks/TASK-026-HANDOFF.md`.
- Confirmado con git que:
  - `api/local.settings.json` esta ignorado.
  - `local-secrets/` esta ignorado.
- Intentado confirmar IP publica via `https://api.ipify.org`; no disponible desde la shell en esta pasada.
- No se abrieron reglas firewall.
- No se desplego Azure Functions.
- No se cambiaron secretos, codigo ni pipeline.

Resultado:
La ruta repetible para TASK-028 queda definida. Para desbloqueo inmediato, abrir regla temporal por IP local, ejecutar smoke/QA, y cerrar la regla. Para estabilidad real, preparar Azure Functions con app settings seguros.

Riesgos o pendientes:
- Bloqueante para validacion local: confirmar IP publica actual al inicio de TASK-028.
- Riesgo operativo: olvidar cerrar la regla temporal.
- Riesgo heredado: `AllowAllWindowsAzureIps` sigue activo.
- Pendiente: decidir si TASK-028 sera validacion local con firewall temporal o preparacion/despliegue de Azure Functions.
- Pendiente: si se usa Azure Functions, crear/configurar recurso y secrets sin imprimir valores.

Siguiente recomendado para TASK-028:
Pedir confirmacion explicita para abrir una regla temporal de firewall por IP local. Luego ejecutar smoke test Backend/API y QA. Al terminar, eliminar la regla y documentar resultado. Si se necesita una URL compartible, cambiar TASK-028 a preparar Azure Functions con `SQL_CONNECTION_STRING` como secreto.
