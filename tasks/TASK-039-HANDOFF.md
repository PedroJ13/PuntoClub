Equipo:
Backend/API

Tarea completada:
TASK-039 - Redeployar Azure Functions con GET settings.

Archivos cambiados:
- tasks/TASK-039-HANDOFF.md

Deploy ejecutado:
- Se creo paquete limpio desde `api/`.
- Se excluyeron archivos no runtime:
  - `api/local.settings.json`
  - `local-secrets/`
  - logs
  - tests
- Se incluyeron:
  - `host.json`
  - `package.json`
  - `package-lock.json`
  - `src/`
  - `node_modules/`
- Paquete subido a blob privado:
  - `api-task039-20260603152441.zip`
- Se actualizo `WEBSITE_RUN_FROM_PACKAGE` via ARM `az rest` usando JSON temporal fuera del repo.
- Se reinicio Function App:
  - `func-puntoclub-prod-br-001`

Notas de seguridad:
- No se imprimio `SQL_CONNECTION_STRING`.
- No se imprimio SAS.
- No se guardaron secretos en el repo.
- El JSON temporal usado para app settings se borro al terminar.

Verificacion ejecutada:
- `npm test`: 9 pruebas pasaron.
- Validado `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/settings`: `200`.
- Validado payload de settings:
  - `id = "1"`
  - `name = "Cafe Central"`
  - `pointsPercentage = 5`
  - `status = "active"`
  - `updatedAt` timestamp UTC.
- Ejecutado `npm run smoke` contra URL estable Azure:
  - `API_BASE_URL=https://func-puntoclub-prod-br-001.azurewebsites.net/api`
  - resultado exitoso.
- Confirmado que Azure Functions indexa:
  - `getCompanySettings`
  - `listCustomers`
  - `createCustomer`
  - `createPurchase`
  - `createRedemption`
  - `getCustomerBalance`
  - `getCustomerActivity`

Resultado smoke:
```json
{
  "ok": true,
  "customerId": "26",
  "balanceBefore": {
    "customerId": "26",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "26",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2
}
```

URL estable para QA:
```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

Endpoint validado:
```text
GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/settings
```

Riesgos o pendientes:
- `WEBSITE_RUN_FROM_PACKAGE` sigue usando SAS privado con expiracion; preparar pipeline formal o renovar antes de vencer.
- `AllowAllWindowsAzureIps` sigue activo como regla SQL heredada.
- No se creo Static Web Apps ni se cambio DB.

Siguiente recomendado:
QA puede revalidar TASK-033/TASK-036 contra la URL estable y confirmar que `GET /companies/1/settings` ya no responde `404`.
