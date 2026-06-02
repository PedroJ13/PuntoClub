Equipo:
Backend/API

Tarea completada:
TASK-028 - Reintentar API real y smoke test con acceso estable/repetible.

Archivos cambiados:
- tasks/TASK-028-HANDOFF.md

Verificacion ejecutada:
- Leido `tasks/TASK-028.md`.
- Leido `tasks/TASK-027-HANDOFF.md`.
- Confirmado que `api/local.settings.json` existe localmente y no se imprimio su contenido.
- Confirmado que Azure Functions Core Tools `func` no esta disponible en PATH.
- Confirmada IP publica actual para validacion: `200.229.6.103`.
- Creada regla temporal Azure SQL `AllowTask028ValidationTemp` para `200.229.6.103`.
- Ejecutado `npm test`: 7 pruebas pasaron.
- Levantado servidor local Backend/API con `npm run serve:local` equivalente (`scripts/local-api-server.js`) en `http://localhost:7071/api`.
- Ejecutado `npm run smoke` dos veces contra Azure SQL real: ambos exitosos.
- Eliminada regla temporal Azure SQL `AllowTask028ValidationTemp`.
- Verificado firewall final: solo queda `AllowAllWindowsAzureIps`.
- Detenido servidor local usado para la prueba.

Resultado smoke 1:
```json
{
  "ok": true,
  "customerId": "2",
  "balanceBefore": {
    "customerId": "2",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "2",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2
}
```

Resultado smoke 2:
```json
{
  "ok": true,
  "customerId": "3",
  "balanceBefore": {
    "customerId": "3",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "3",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2
}
```

API_BASE_URL para QA local:
```text
http://localhost:7071/api
```

Comandos seguros para repetir desde esta maquina:
```powershell
cd api
$ip = (Invoke-RestMethod -Uri "https://api.ipify.org").Trim()
az sql server firewall-rule create `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name AllowTask028ValidationTemp `
  --start-ip-address $ip `
  --end-ip-address $ip

npm test
npm run serve:local
```

En otra terminal:
```powershell
cd api
$env:API_BASE_URL="http://localhost:7071/api"
npm run smoke
```

Limpieza obligatoria al terminar:
```powershell
az sql server firewall-rule delete `
  --resource-group resource_group_main `
  --server sqlserver-pj13-brazil `
  --name AllowTask028ValidationTemp
```

Riesgos o pendientes:
- La ruta local repetible depende de abrir/cerrar una regla temporal por IP local.
- Si cambia la IP publica, hay que recrear la regla temporal con la IP nueva.
- No dejar `AllowTask028ValidationTemp` abierta despues de QA.
- `func` no esta instalado; para una URL compartible estable se recomienda Azure Functions con app settings seguros.
- `AllowAllWindowsAzureIps` sigue activo como regla heredada y debe revisarse antes de endurecer production.

Siguiente recomendado:
QA puede repetir validacion local usando `http://localhost:7071/api` mientras Backend/API levante el servidor local y mantenga abierta la regla temporal. Para validacion compartible entre chats/equipos, Infra debe desplegar Azure Functions y configurar `SQL_CONNECTION_STRING` como Application setting secreto.
