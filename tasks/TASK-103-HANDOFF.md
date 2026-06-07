Equipo:
Backend/API

Tarea completada:
TASK-103 - Exponer lectura API de auditoria operativa.

Endpoint implementado:
```text
GET /api/companies/{companyId}/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=10|25|50
```

Contrato final:
```json
{
  "from": "2026-06-01",
  "to": "2026-06-07",
  "limit": 25,
  "items": [
    {
      "id": "100",
      "occurredAt": "2026-06-07T18:20:00Z",
      "eventType": "purchase.registered",
      "entityType": "purchase",
      "entityId": "50",
      "customerId": "10",
      "customerName": "Maria Soto",
      "actorLabel": null,
      "source": "api",
      "metadata": {
        "invoiceNumber": "FAC-1001",
        "purchaseDate": "2026-06-07",
        "amount": 25000,
        "pointsEarned": 1250
      }
    }
  ]
}
```

Archivos modificados:
- api/src/functions/audit.js
- api/src/lib/audit.js
- api/src/lib/validators.js
- api/scripts/local-api-server.js
- api/test/audit.test.js
- api/test/validators.test.js
- docs/API_CONTRACTS.md
- tasks/TASK-103-HANDOFF.md

Validaciones agregadas:
- `companyId` se valida contra `PILOT_COMPANY_ID`.
- `from` requerido.
- `to` requerido.
- Fechas reales en formato `YYYY-MM-DD`.
- `from <= to`.
- Rango maximo inicial: 31 dias.
- `limit` opcional con default `25`.
- `limit` permitido: `10`, `25`, `50`.

Detalles de respuesta:
- `id`, `entityId` y `customerId` se serializan como string cuando existen.
- `entityId` y `customerId` pueden ser `null`.
- `customerName` se resuelve con `LEFT JOIN dbo.Customers` cuando hay cliente asociado.
- `metadata` se parsea como JSON o devuelve `null` si esta ausente/no parseable.
- Orden: `occurred_at DESC, id DESC`.

Pruebas ejecutadas:
- `npm test`: 19 pruebas pasaron.

Evidencia local/Azure:
- No se ejecuto smoke real contra Azure SQL para este endpoint.
- Motivo: `tasks/TASK-102-HANDOFF.md` indica que la migracion de auditoria no fue aplicada por bloqueo de firewall; por tanto `dbo.OperationalAuditEvents` puede no existir en Azure SQL.
- No se hizo redeploy de Azure Functions.
- No se imprimieron secretos.
- No se cambio DB.
- No se cambio UI.

Pendientes de deploy/validacion:
- Aplicar `database/migrations/20260606_operational_audit_events.sql` en Azure SQL.
- Redeployar API estable para publicar `listAuditEvents`.
- Ejecutar QA TASK-101 nuevamente contra:
  - `GET /api/companies/1/audit/events?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=10`
- Validar casos negativos:
  - sin `from`/`to`: `400 VALIDATION_ERROR`;
  - rango mayor a 31 dias: `400 VALIDATION_ERROR`;
  - `limit` invalido: `400 VALIDATION_ERROR`;
  - `companyId` distinto a `PILOT_COMPANY_ID`: `404 COMPANY_NOT_FOUND`.

Riesgos:
- Mientras la migracion SQL no este aplicada, la ruta fallara en runtime si se ejecuta contra esa DB.
- Si Web/QA consume la URL publicada antes del redeploy, seguira viendo `404`.
