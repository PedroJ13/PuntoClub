Equipo: Product / Architect / Release
Modo de ejecucion: API Release
Tarea completada: TASK-729 - Commit y push controlado del fix imagen en correo promocional

Resultado:
- Se commiteo y publico el fix API para que la imagen de campana promocional use URL absoluta HTTPS publica en el HTML del correo.
- Workflow API termino correctamente.
- No se cambio Web.
- No se cambio SQL, ACS, sender, storage, DNS, CORS, app settings ni feature flags.
- No se enviaron correos reales.

Commit creado y publicado:
- `6f2bbfe`
- Mensaje:
  - `Fix promotional email image URL`

Nota de push:
- El push tambien publico el commit local previo `6189b8d` de handoffs de cierre de campanas, porque ya estaba en `main` local antes de esta tarea.

Archivos incluidos en `6f2bbfe`:
- `api/src/functions/promotionalCampaigns.js`
- `api/test/promotional-campaigns.test.js`
- `tasks/TASK-725-HANDOFF.md`
- `tasks/TASK-726-HANDOFF.md`
- `tasks/TASK-727-HANDOFF.md`
- `tasks/TASK-728-HANDOFF.md`

Exclusiones:
- `debug.log`
- `tmp/`
- handoffs antiguos no relacionados.

Validacion local antes del commit:
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/test/promotional-campaigns.test.js`
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/test/promotional-campaigns.test.js`
- `git diff --check -- api/src/functions/promotionalCampaigns.js api/test/promotional-campaigns.test.js`
- `node --test api/test/promotional-campaigns.test.js`
  - 18/18 OK.
- `npm test` en `api/`
  - 166/166 OK.

Workflow publicado:
- Deploy Punto Club API:
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28617667543`

Smoke publicado:
- `GET https://api.puntoclubcr.com/api/me`
  - `401` sin sesion, respuesta controlada esperada.

Uso Azure SQL:
- No.
- Motivo: release API sin migracion ni validacion con datos reales.

Riesgos o pendientes:
- Falta prueba real controlada en mailbox autorizado para confirmar render visual de la imagen en cliente de correo.
- `tasks/TASK-729-HANDOFF.md` queda local porque se creo despues del commit/push.
- No se debe enviar correo promocional real salvo autorizacion explicita posterior.

Siguiente recomendado:
- Ejecutar `TASK-730` si Product Owner autoriza prueba real controlada con una campana con imagen activa y un unico destinatario autorizado.
