Equipo: Backend/API
Modo de ejecucion: Seguridad / Promociones
Tarea completada: TASK-573 - Bloquear endpoints de promociones sin sesion de empresa

Resultado:
- Se corrigio el P0 de seguridad en endpoints de promociones.
- Los endpoints de promociones ya no usan `getCompanyId` con fallback a `PILOT_COMPANY_ID`.
- Ahora exigen sesion autenticada de empresa mediante `requireSessionIdentity`.
- El `companyId` de la ruta debe coincidir con la empresa de la sesion.
- Si no hay sesion, responde `401 UNAUTHORIZED`.
- Si la sesion intenta operar otra empresa, responde `403 FORBIDDEN`.
- El envio real promocional sigue bloqueado.

Endpoints protegidos:
- `GET /api/companies/{companyId}/promotional-campaigns`
- `POST /api/companies/{companyId}/promotional-campaigns`
- `GET /api/companies/{companyId}/promotional-campaigns/{campaignId}`
- `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/preview`
- `GET /api/companies/{companyId}/promotional-recipients`
- `PUT /api/companies/{companyId}/promotional-campaigns/{campaignId}/recipients`
- `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/send`
- `POST /api/companies/{companyId}/promotional-unsubscribe`

Archivos modificados:
- `api/src/functions/promotionalCampaigns.js`
- `api/test/promotional-campaigns.test.js`

Verificacion ejecutada:
- `node --test test/promotional-campaigns.test.js test/errors.test.js`
  - Resultado: 17/17 OK.
- `npm test`
  - Resultado: 150/150 OK.
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/test/promotional-campaigns.test.js`
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/errors.js api/test/promotional-campaigns.test.js app/src/app.js app/src/customerApi.js`
  - Resultado: OK.

Uso Azure SQL:
- No.
- Motivo: correccion local de seguridad y tests.

Riesgos o pendientes:
- Requiere publicar API para que la proteccion aplique en ambiente publicado.
- QA debe revalidar negativos publicados: sin cookie y con companyId de otra empresa.
