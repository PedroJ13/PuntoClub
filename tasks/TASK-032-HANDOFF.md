Equipo:
Infra / Azure

Tarea completada:
Azure Functions creada, configurada y desplegada para exponer una API estable de Punto Club sin depender de IP local y sin exponer secretos.

Estado de inventario inicial:
- No existia Function App antes de TASK-032.
- Existia Storage Account `storagepuntoevento` en `eastus2`, pero no se reutilizo para Punto Club.
- Azure SQL existente:
  - Server: `sqlserver-pj13-brazil`
  - Database: `sql-db-puntoclub`
  - Region: `brazilsouth`
- `api/local.settings.json` esta ignorado por git y contiene la conexion local segura.
- `local-secrets/` esta ignorado por git.

Decision ejecutada:
- Se creo una nueva Azure Function App para Punto Club.
- Static Web Apps quedo fuera de alcance.
- Se creo storage runtime propio para Functions en la misma region que la SQL: `brazilsouth`.
- Se configuro `SQL_CONNECTION_STRING` como Application setting secreto, leyendo el valor local sin imprimirlo.

Recursos propuestos:
- Resource group: usar `resource_group_main` para quedar junto a la SQL existente.
- Region: `brazilsouth`.
- Storage runtime: `stpuntoclubfuncbr001`.
- Function App: `func-puntoclub-prod-br-001`.
- Runtime: Azure Functions v4, Node.
- Node runtime final: Node 22.
- Plan: Consumption.
- Application Insights: opcional para este paso; recomendado si se quiere logs cloud desde la primera prueba.

Impacto/costo:
- Se agregaria una Storage Account runtime de bajo costo.
- Se agregaria una Function App Consumption; costo esperado bajo para piloto con poco trafico.
- No se crea otra DB.
- No se crea Static Web Apps.
- No se cambia pipeline.
- El uso de `AllowAllWindowsAzureIps` en SQL permite que Functions conecte desde Azure sin regla local adicional, pero es una regla amplia ya existente.

App settings requeridos:
- `SQL_CONNECTION_STRING=<secret from api/local.settings.json>`
- `PILOT_COMPANY_ID=1`
- `FUNCTIONS_WORKER_RUNTIME=node`
- `AzureWebJobsStorage=<runtime storage connection managed by Function App>`

URL base disponible:
```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

Cambios cloud ejecutados:
- Creado Storage Account `stpuntoclubfuncbr001` en `brazilsouth`, `Standard_LRS`, HTTPS only, TLS 1.2 minimo, blob public access deshabilitado.
- Creada Function App `func-puntoclub-prod-br-001` en `brazilsouth`, Linux Consumption.
- Azure rechazo Node 20 por EOL; se creo inicialmente con Node 24.
- Node 24 quedo respondiendo `503`, por lo que se cambio a Node 22 via ARM REST con JSON temporal. Node 22 esta listado como runtime disponible por Azure CLI.
- Configurados app settings sin imprimir secretos:
  - `SQL_CONNECTION_STRING`
  - `PILOT_COMPANY_ID=1`
  - `FUNCTIONS_WORKER_RUNTIME=node`
- Se empaqueto `api/` en un zip limpio autosuficiente con `node_modules`, excluyendo `local.settings.json`, `local-secrets/`, logs y top-level tests.
- `config-zip` y `az functionapp deploy` fallaron por canal Kudu/OneDeploy (`Bad Request` / connection reset).
- Se subio el paquete a blob privado en `stpuntoclubfuncbr001/function-releases`.
- Se configuro `WEBSITE_RUN_FROM_PACKAGE` con SAS privado usando JSON temporal fuera del repo, sin imprimir el token.
- Se reinicio la Function App.

Comandos base usados:

```powershell
az storage account create `
  --name stpuntoclubfuncbr001 `
  --resource-group resource_group_main `
  --location brazilsouth `
  --sku Standard_LRS `
  --kind StorageV2

az functionapp create `
  --name func-puntoclub-prod-br-001 `
  --resource-group resource_group_main `
  --storage-account stpuntoclubfuncbr001 `
  --consumption-plan-location brazilsouth `
  --functions-version 4 `
  --runtime node `
  --runtime-version 24
```

Nota: Azure CLI rechazo Node 20 por EOL. Node 24 fue aceptado pero quedo inestable en esta app; el runtime final operativo es Node 22.

Configuracion de app settings sin imprimir secretos:

```powershell
$settings = Get-Content -LiteralPath ".\api\local.settings.json" -Raw | ConvertFrom-Json
$sqlConnectionString = $settings.Values.SQL_CONNECTION_STRING

az functionapp config appsettings set `
  --name func-puntoclub-prod-br-001 `
  --resource-group resource_group_main `
  --settings `
    SQL_CONNECTION_STRING="$sqlConnectionString" `
    PILOT_COMPANY_ID="1" `
    FUNCTIONS_WORKER_RUNTIME="node"
```

Deploy final:

```powershell
# Paquete limpio subido a blob privado y enlazado via WEBSITE_RUN_FROM_PACKAGE.
# No se imprime el SAS ni la connection string.
```

Verificacion ejecutada despues de deploy:

```powershell
$env:API_BASE_URL="https://func-puntoclub-prod-br-001.azurewebsites.net/api"
cd api
npm run smoke
```

Resultado smoke:

```json
{
  "ok": true,
  "customerId": "14",
  "balanceBefore": {
    "customerId": "14",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "14",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2
}
```

Funciones indexadas:
- `listCustomers`: `/api/companies/{companyId}/customers`
- `createCustomer`: `/api/companies/{companyId}/customers`
- `createPurchase`: `/api/companies/{companyId}/purchases`
- `createRedemption`: `/api/companies/{companyId}/redemptions`
- `getCustomerBalance`: `/api/companies/{companyId}/customers/{customerId}/balance`
- `getCustomerActivity`: `/api/companies/{companyId}/customers/{customerId}/activity`

Validacion manual observada:
- Smoke test crea cliente/compra/redencion y devuelve `ok: true`.
- `GET /api/companies/1/settings` responde `404` porque esa funcion no esta implementada/indexada en el paquete actual.

Secretos:
- No imprimir `SQL_CONNECTION_STRING`.
- No copiar `api/local.settings.json` al zip como archivo de configuracion runtime si se puede evitar.
- Si `api/local.settings.json` entra al zip por accidente, revisar despliegue: no debe quedar accesible publicamente, pero sigue siendo mejor excluirlo antes de publicar.
- Recomendacion para deploy: crear zip excluyendo `local.settings.json`, `node_modules` si Azure instala dependencias, `coverage` y logs.

Verificacion ejecutada:
- Leidos `chat-start/INFRA.md`, `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/ARCHITECTURE.md`, `tasks/TASK-023-HANDOFF.md`, `tasks/TASK-027-HANDOFF.md` y `tasks/TASK-032.md`.
- Inventario Azure de solo lectura:
  - `az functionapp list`: no hay Function Apps.
  - `az storage account list`: existe `storagepuntoevento` en `eastus2`.
- Confirmado que `api/local.settings.json` y `local-secrets/` estan ignorados.
- Creado y verificado `stpuntoclubfuncbr001`.
- Creada y verificada `func-puntoclub-prod-br-001`.
- Confirmado runtime final `Node|22`.
- Confirmadas funciones indexadas con `az functionapp function list`.
- Ejecutado `npm run smoke` contra URL Azure estable.
- No se imprimieron secretos.

Resultado:
API estable disponible en:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

QA/Web pueden usar esa URL base para validacion compartible sin abrir reglas temporales por IP local.

Riesgos o pendientes:
- `AllowAllWindowsAzureIps` sigue activo y es amplio.
- `WEBSITE_RUN_FROM_PACKAGE` usa SAS privado con expiracion; debe renovarse antes de vencer o reemplazarse por pipeline/deploy formal.
- Node 22 fue elegido porque Node 20 esta EOL y Node 24 preview quedo inestable en esta app.
- `GET /settings` no esta disponible en el paquete actual; QA debe validar solo rutas indexadas o Backend/API debe implementar esa funcion si sigue siendo parte del contrato.
- No hay Static Web Apps en esta tarea.

Siguiente recomendado:
Pasar a QA/Web la URL base `https://func-puntoclub-prod-br-001.azurewebsites.net/api`. Si TASK-031 cambio formatos de IDs/timestamps, redeployar despues de merge/cierre. Preparar pipeline formal para reemplazar el despliegue manual por paquete.
