Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Promociones
Tarea completada: TASK-563 - Implementar contratos MVP de promociones con envio bloqueado por feature flag

Resultado:
- Se agrego API local para promociones MVP con envio real bloqueado.
- El contrato cubre:
  - crear/listar campanas;
  - obtener detalle de campana;
  - preview server-side;
  - listar destinatarios elegibles;
  - seleccionar destinatarios con limite MVP;
  - registrar baja promocional;
  - endpoint de envio bloqueado por feature flag.
- No se llama ACS desde promociones.
- No se habilito envio real.

Archivos principales:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`
- `api/package.json`

Endpoints agregados:
- `GET /api/companies/{companyId}/promotional-campaigns`
- `POST /api/companies/{companyId}/promotional-campaigns`
- `GET /api/companies/{companyId}/promotional-campaigns/{campaignId}`
- `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/preview`
- `GET /api/companies/{companyId}/promotional-recipients`
- `PUT /api/companies/{companyId}/promotional-campaigns/{campaignId}/recipients`
- `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/send`
- `POST /api/companies/{companyId}/promotional-unsubscribe`

Bloqueo de envio:
- `POST .../send` valida el feature flag `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- Si el flag no esta en `true`, devuelve `423 PROMOTIONAL_SEND_BLOCKED`.
- Aunque el flag estuviera en `true`, el endpoint sigue devolviendo bloqueo porque falta decision explicita para llamar ACS.

Verificacion ejecutada:
- `npm test` en `api/`
  - Resultado: 145/145 tests OK.
- `node --test test/promotional-campaigns.test.js`
  - Resultado: 4/4 tests OK.
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/src/lib/repository.js`
- `node --check api/src/lib/validators.js`
- `npx prettier --check` sobre archivos API modificados
  - Resultado: OK.

Uso Azure SQL:
- No.
- Motivo: implementacion local de contratos y repositorio; la migracion no fue aplicada.

Riesgos o pendientes:
- Los endpoints requieren aplicar la migracion SQL antes de funcionar contra Azure SQL real.
- El envio real queda fuera de alcance y bloqueado hasta decision explicita.
- Falta QA local/publicado del flujo completo.
