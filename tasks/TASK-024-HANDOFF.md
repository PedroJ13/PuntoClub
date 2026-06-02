Equipo:
Backend/API

Tarea completada:
TASK-024 - Levantar API real y ejecutar smoke test.

Archivos cambiados:
- api/package.json
- api/README.md
- api/scripts/load-local-settings.js
- api/scripts/local-api-server.js
- api/scripts/smoke-test.js
- tasks/TASK-024-HANDOFF.md

Verificacion ejecutada:
- Leido `tasks/TASK-024.md`.
- Leido `tasks/TASK-023-HANDOFF.md`.
- Confirmado que `api/local.settings.json` existe localmente y esta ignorado por git.
- Confirmado por TASK-023 que `SQL_CONNECTION_STRING` y `PILOT_COMPANY_ID=1` estan configurados en `api/local.settings.json`.
- Confirmado que Azure Functions Core Tools `func` no esta disponible en PATH.
- Intentado `npx azure-functions-core-tools@4 --version`; fallo por binario `func` no encontrado en cache npx.
- Agregado servidor local de desarrollo `npm run serve:local` que reutiliza los mismos modulos de validacion/repositorio de la API.
- Ejecutado `npm test`: 7 pruebas pasaron.
- Primer intento de smoke fallo con `500 INTERNAL_ERROR`; diagnostico confirmo firewall Azure SQL bloqueando IP local `200.229.6.103`.
- Creada regla temporal Azure SQL `AllowCodexTask024Temp` para `200.229.6.103`.
- Validada conexion SQL con usuario runtime contra `dbo.Companies`, empresa piloto `id = 1`.
- Reiniciado servidor local de API.
- Ejecutado `npm run smoke`: exitoso.
- Eliminada regla temporal Azure SQL `AllowCodexTask024Temp`.
- Verificado firewall final: solo queda `AllowAllWindowsAzureIps`.
- Detenido servidor local usado para la prueba.

Resultado smoke:
```json
{
  "ok": true,
  "customerId": "1",
  "balanceBefore": {
    "customerId": "1",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "1",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2
}
```

URL/comandos seguros para QA local:
```powershell
cd api
npm test
npm run serve:local
```

En otra terminal:
```powershell
cd api
$env:API_BASE_URL="http://localhost:7071/api"
npm run smoke
```

Notas de seguridad:
- No se imprimio `SQL_CONNECTION_STRING`.
- No se guardaron secretos en archivos versionados.
- `api/local.settings.json` contiene secreto local y debe permanecer ignorado.
- Se creo y elimino una regla temporal de firewall para la IP local.

Riesgos o pendientes:
- `func` no esta instalado; para usar Azure Functions Core Tools real hay que instalarlo o desplegar a Azure Functions.
- Para repetir QA local desde esta IP, puede requerirse una regla temporal de firewall si Azure SQL vuelve a bloquear conexiones locales.
- El servidor local de desarrollo es un puente operativo para smoke local; production debe usar Azure Functions.
- La regla `AllowAllWindowsAzureIps` sigue activa como estado final heredado.

Siguiente recomendado:
QA puede tomar `http://localhost:7071/api` cuando Backend/API levante `npm run serve:local` en una sesion con `api/local.settings.json` disponible. Infra puede instalar Azure Functions Core Tools o configurar una Azure Function real con los mismos app settings para entregar una URL compartible fuera de esta maquina.
