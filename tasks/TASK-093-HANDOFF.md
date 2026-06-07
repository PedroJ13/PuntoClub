Equipo:
Backend/API

Tarea completada:
TASK-093 - Implementar API de reporte operativo.

Endpoint implementado:
```text
GET /api/companies/{companyId}/reports/activity?from=YYYY-MM-DD&to=YYYY-MM-DD&type=all|purchase|redemption
```

Archivos modificados:
- api/src/functions/reports.js
- api/src/lib/repository.js
- api/src/lib/validators.js
- api/scripts/local-api-server.js
- api/scripts/smoke-test.js
- api/test/validators.test.js
- docs/API_CONTRACTS.md
- tasks/TASK-093-HANDOFF.md

Validaciones agregadas:
- `companyId` se valida contra `PILOT_COMPANY_ID` usando el flujo existente.
- `from` requerido.
- `to` requerido.
- Fechas reales en formato `YYYY-MM-DD`.
- `from <= to`.
- Rango maximo inicial: 31 dias.
- `type` opcional con default `all`.
- `type` permitido: `all`, `purchase`, `redemption`.

Comportamiento:
- Consulta compras y redenciones existentes sin cambiar schema.
- Une actividad con `dbo.Customers` para devolver datos operativos del cliente.
- IDs `bigint` se devuelven como string.
- Redenciones se devuelven con `points` negativo en `items`.
- `summary.pointsRedeemedTotal` suma puntos redimidos como valor positivo.
- `activeCustomerCount` cuenta clientes distintos presentes en el rango filtrado.

Ejemplo de respuesta:
```json
{
  "from": "2026-06-01",
  "to": "2026-06-07",
  "type": "all",
  "summary": {
    "purchaseCount": 10,
    "purchaseAmountTotal": 50000,
    "pointsEarnedTotal": 2500,
    "redemptionCount": 4,
    "pointsRedeemedTotal": 600,
    "activeCustomerCount": 8
  },
  "items": [
    {
      "type": "purchase",
      "id": "50",
      "date": "2026-06-06",
      "customerId": "10",
      "customerName": "Maria Soto",
      "customerPhone": "+50688887777",
      "customerEmail": "maria@example.com",
      "invoiceNumber": "FAC-1001",
      "amount": 25000,
      "points": 1250
    },
    {
      "type": "redemption",
      "id": "70",
      "date": "2026-06-06",
      "customerId": "10",
      "customerName": "Maria Soto",
      "customerPhone": "+50688887777",
      "customerEmail": "maria@example.com",
      "points": -500
    }
  ]
}
```

Pruebas ejecutadas:
- `npm test`: 12 pruebas pasaron.
- Smoke local contra Azure SQL real:
  - Se abrio regla temporal `AllowTask093ValidationTemp` para IP `200.229.6.103`.
  - Se levanto servidor local Backend/API.
  - Se ejecuto `npm run smoke`.
  - Resultado exitoso, incluyendo reporte operativo.
  - Se elimino la regla temporal.
  - Se detuvo servidor local.
- Firewall final verificado: solo queda `AllowAllWindowsAzureIps`.

Resultado smoke:
```json
{
  "ok": true,
  "customerId": "73",
  "balanceBefore": {
    "customerId": "73",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "73",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2,
  "reportItems": 74
}
```

Pendientes para frontend/QA:
- Frontend puede consumir el reporte con filtros `from`, `to` y `type`.
- QA debe validar:
  - `400 VALIDATION_ERROR` sin `from`/`to`.
  - `400 VALIDATION_ERROR` con rango mayor a 31 dias.
  - `400 VALIDATION_ERROR` con `type` invalido.
  - `404 COMPANY_NOT_FOUND` con empresa distinta a `PILOT_COMPANY_ID`.
  - Resumen y lista con `type=all`, `purchase` y `redemption`.
- La Azure Function estable necesita redeploy para exponer `getActivityReport`; esta tarea valido localmente contra SQL real, no actualizo cloud.

Riesgos o notas:
- No se cambio DB ni schema.
- No se tocaron secrets.
- No se cambio frontend.
- El reporte no pagina aun; si crece el volumen, agregar paginacion o limite por tarea separada.
