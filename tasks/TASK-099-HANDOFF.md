Equipo:
Backend/API

Tarea completada:
TASK-099 - Implementar auditoria operativa en API.

Cambios realizados:
- Agregada migracion SQL no destructiva:
  - `database/migrations/20260606_operational_audit_events.sql`
- Agregado helper interno de auditoria:
  - `api/src/lib/audit.js`
- Integrada auditoria best-effort en handlers Azure Functions:
  - `api/src/functions/customers.js`
  - `api/src/functions/purchases.js`
  - `api/src/functions/redemptions.js`
- Agregadas pruebas unitarias:
  - `api/test/audit.test.js`
- Actualizado script de tests:
  - `api/package.json`

Eventos registrados:
- Exitosos:
  - `customer.created`
  - `purchase.registered`
  - `redemption.registered`
- Rechazos relevantes:
  - `customer.rejected_duplicate`
  - `purchase.rejected_duplicate_invoice`
  - `redemption.rejected_insufficient_points`

Criterio de auditoria:
- La auditoria se implemento como best-effort fuera de la operacion principal.
- Si la operacion principal fue exitosa y falla el insert de auditoria, la API mantiene la respuesta exitosa.
- Si un rechazo esperado ocurre y falla el insert de auditoria, la API mantiene el error contratado original.
- Motivo: en piloto, caja/operacion no debe bloquearse por una falla menor de auditoria o por migracion aun no aplicada.
- Los fallos de auditoria se registran con `context.warn` cuando el runtime Azure Functions lo provee.

Metadata usada:
- No se guardan secrets.
- No se repiten telefono/email en metadata.
- `customer.created`: `{ "emailProvided": true|false }`.
- `purchase.registered`: `invoiceNumber`, `purchaseDate`, `amount`, `pointsEarned`.
- `redemption.registered`: `redemptionDate`, `pointsRedeemed`, `balanceAfter`.
- Rechazos: razon operativa minima, `invoiceNumber` para factura duplicada, fecha/puntos para redencion insuficiente.

Pruebas ejecutadas:
- `npm test`: 14 pruebas pasaron.
- Smoke local contra Azure SQL real con servidor local auxiliar:
  - Se abrio regla temporal `AllowTask099ValidationTemp` para IP `200.229.6.103`.
  - Se ejecuto `npm run smoke`.
  - Resultado exitoso; flujo actual no se rompio.
  - Se elimino la regla temporal.
  - Se detuvo servidor local.
- Firewall final verificado: solo queda `AllowAllWindowsAzureIps`.

Resultado smoke:
```json
{
  "ok": true,
  "customerId": "75",
  "balanceBefore": {
    "customerId": "75",
    "pointsEarned": 50,
    "pointsRedeemed": 0,
    "pointsBalance": 50
  },
  "balanceAfter": {
    "customerId": "75",
    "pointsEarned": 50,
    "pointsRedeemed": 1,
    "pointsBalance": 49
  },
  "activityItems": 2,
  "reportItems": 80
}
```

Schema local/Azure:
- Migracion SQL agregada al repo, pero no aplicada en Azure SQL.
- No se cambio `database/schema.sql`.
- No se cambio DB real.
- La API no rompe el flujo si la tabla `dbo.OperationalAuditEvents` aun no existe, porque auditoria es best-effort.

Validacion con Azure Functions Core Tools:
- No ejecutada.
- Aunque los docs indican que `func` esta disponible, en esta sesion `func` no esta en PATH ni en rutas comunes revisadas.
- No se instalaron herramientas nuevas, siguiendo la instruccion del usuario.

Pendientes de deploy:
- Aplicar migracion `database/migrations/20260606_operational_audit_events.sql` en Azure SQL con aprobacion de SQL/Infra/Release.
- Redeployar API estable para que los handlers publicados escriban auditoria.
- QA TASK-101 debe validar que los eventos se insertan despues de migracion + redeploy.

Riesgos o pendientes:
- Mientras la migracion no este aplicada, la auditoria no quedara persistida, aunque la operacion principal seguira funcionando.
- Si Product/Release decide que auditoria debe ser obligatoria, se requiere nueva tarea para mover operaciones exitosas y auditoria a una transaccion que pueda bloquear en caso de fallo.
- La tabla de auditoria crecera con el uso; post-piloto conviene definir retencion/export.
