Equipo: Backend/API
Modo de ejecucion: Comunicaciones / KPIs reales
Tarea completada: TASK-813 - Implementar endpoint de resumen real de comunicaciones

Resultado:
- Implementado endpoint autenticado por empresa para KPIs reales del centro de comunicaciones.
- El endpoint no confia en `companyId` del frontend: valida que `companyId` de ruta coincida con la empresa de la sesion.
- Los conteos se calculan server-side desde datos/configuracion reales.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Endpoint:
- `GET /api/companies/{companyId}/communications/summary`

Contrato devuelto:
- `operationalActiveCount`
- `promotionalSubscribedCount`
- `promotionalUnsubscribedCount`
- `promotionalSendStatus`
- `promotionalSendStatusLabel`
- `campaignDraftCount`
- `campaignSentCount`
- `generatedAt`

Reglas implementadas:
- `operationalActiveCount` cuenta switches operativos activos:
  - bienvenida;
  - compra;
  - canje/redencion.
- Si no existe fila de configuracion operativa, usa defaults reales del backend: los tres operativos activos.
- `promotionalSubscribedCount` cuenta clientes de la empresa con:
  - email no nulo;
  - formato minimo `LIKE '%_@_%._%'`;
  - preferencia efectiva `subscribed`;
  - si no existe preferencia explicita, cuenta como `subscribed`.
- `promotionalUnsubscribedCount` cuenta clientes con preferencia efectiva `unsubscribed`.
- `promotionalSendStatus` sale de `PROMOTIONAL_EMAIL_SEND_ENABLED`:
  - `active` / `Activas` si es `true`;
  - `paused` / `Pausadas` en cualquier otro caso.
- Se incluyen metadatos de campanas `draft/ready` y `sent`.

Archivos cambiados:
- `api/src/functions/communicationsSummary.js`
- `api/src/lib/repository.js`
- `api/test/communications-summary.test.js`
- `api/test/repository-customer-search.test.js`
- `api/package.json`
- `tasks/TASK-813-HANDOFF.md`

Validaciones:
- `node --check api/src/functions/communicationsSummary.js`
- `node --check api/src/lib/repository.js`
- `node --check api/test/communications-summary.test.js`
- `node --check api/test/repository-customer-search.test.js`
- `node --test api/test/communications-summary.test.js api/test/repository-customer-search.test.js`
- `npm --prefix api test`
- `npx prettier --check api/src/lib/repository.js api/src/functions/communicationsSummary.js api/test/communications-summary.test.js api/test/repository-customer-search.test.js api/package.json app/index.html app/src/app.js app/src/customerApi.js`
- `git diff --check`

Resultado de validaciones:
- Sintaxis OK.
- Tests focales: 8/8 pass.
- Suite API completa: 177/177 pass.
- Prettier OK.
- `git diff --check` sin errores; solo avisos LF/CRLF.

Uso Azure SQL:
- No.
- Motivo: implementacion local con tests unitarios/focales; no se requeria validar contra DB real.

Riesgos o pendientes:
- Requiere publicacion API para que Web publicada pueda consumir el endpoint.
- QA debe validar con sesion real/controlada que los conteos publicados correspondan a datos reales de la empresa autenticada.
