Equipo: Backend/API
Modo de ejecucion: Bugfix / Promociones
Tarea completada: TASK-574 - Corregir error 500 al guardar destinatarios promocionales

Resultado:
- Se reforzo el contrato de seleccion de destinatarios promocionales para evitar `500 INTERNAL_ERROR` ante errores SQL esperables.
- Se agregaron mapeos controlados para errores de destinatarios promocionales:
  - duplicado de destinatario por campana;
  - cliente inexistente;
  - campana inexistente;
  - empresa inexistente.
- El flujo de seleccion mantiene limite MVP de 5 destinatarios.
- No se habilito envio real.

Archivos modificados:
- `api/src/lib/errors.js`
- `api/test/promotional-campaigns.test.js`

Errores controlados agregados:
- `PROMOTIONAL_RECIPIENT_ALREADY_SELECTED` -> `409`
- `CUSTOMER_NOT_FOUND` para FK de cliente -> `404`
- `PROMOTIONAL_CAMPAIGN_NOT_FOUND` para FK de campana -> `404`
- `COMPANY_NOT_FOUND` para FK de empresa -> `404`

Verificacion ejecutada:
- `node --test test/promotional-campaigns.test.js test/errors.test.js`
  - Resultado: 17/17 OK.
- `npm test`
  - Resultado: 150/150 OK.
- `node --check api/src/lib/errors.js`
- `node --check api/test/promotional-campaigns.test.js`
- `npx prettier --check ...`
  - Resultado: OK.

Uso Azure SQL:
- No.
- Motivo: bugfix local de mapeo de errores y tests unitarios.

Riesgos o pendientes:
- Requiere deploy API para corregir el 500 publicado.
- QA debe repetir `PUT /api/companies/{companyId}/promotional-campaigns/{campaignId}/recipients` con sesion valida despues de publicar.
