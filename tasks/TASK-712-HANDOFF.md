Equipo: Backend/API
Modo de ejecucion: Promociones / Campaign update contract
Tarea completada: TASK-712 - Implementar actualizacion de contenido de campanas promocionales

Resultado:
- Se implemento endpoint seguro para actualizar contenido de una campaña promocional existente.
- Contrato:
  - `PATCH /api/companies/{companyId}/promotional-campaigns/{campaignId}`
- Campos soportados:
  - `name`
  - `subject`
  - `bodyText`
  - `includePoints`
- Se valida empresa efectiva por sesion autenticada y `companyId` de ruta.
- Se rechaza operar sobre otra empresa.
- Se rechazan campañas no editables/enviadas.
- No se cambio envio real.
- No se cambio ACS, sender, flags ni configuracion.
- No se aplico SQL.

Reglas implementadas:
- Requiere sesion de empresa via `getPromotionalCompanyId`.
- El `companyId` de ruta debe coincidir con la empresa de sesion.
- La empresa debe estar activa.
- La campaña debe existir en la empresa autenticada.
- Solo estados editables:
  - `draft`
  - `ready`
- Estados como `sent`, `sending`, `cancelled` o `failed` quedan bloqueados con:
  - `409 PROMOTIONAL_CAMPAIGN_NOT_EDITABLE`
- Payload se valida con el validador existente en modo parcial.

Persistencia:
- El modelo actual alcanza.
- `dbo.PromotionalCampaigns` ya tiene:
  - `name`
  - `subject`
  - `body_text`
  - `include_points`
  - `status`
  - `updated_at`
- No requiere migracion.

Archivos cambiados:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/test/promotional-campaigns.test.js`

Validacion ejecutada:
- `node --check api\src\functions\promotionalCampaigns.js`
- `node --check api\src\lib\repository.js`
- `node --test api\test\promotional-campaigns.test.js`
- `npm test` dentro de `api/`

Resultado de pruebas:
- `api/test/promotional-campaigns.test.js`: 18/18 OK.
- Suite API completa: 166/166 OK.

Tests agregados:
- Actualiza contenido de campaña editable para empresa autenticada.
- Rechaza sesion de otra empresa.
- Rechaza campaña enviada/no editable.

Uso Azure SQL:
- No.

Riesgos / pendientes:
- Falta QA publicada contra API real despues de deploy.
- No se probo contra Azure SQL porque no se aplico migracion ni se necesito DB real para esta tarea.
