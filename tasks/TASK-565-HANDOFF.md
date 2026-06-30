Equipo: Web Dev
Modo de ejecucion: Comunicaciones / Promociones
Tarea completada: TASK-565 - Implementar UI local de promociones con envio real bloqueado

Resultado:
- Se conecto `Enviar campanas` a flujo local/API para promociones MVP.
- La UI permite:
  - guardar borrador promocional;
  - generar preview;
  - listar clientes por preferencia;
  - seleccionar manualmente destinatarios elegibles;
  - guardar destinatarios;
  - ver historial/resumen local por destinatario.
- El boton de envio real sigue deshabilitado y bloqueado.
- No se habilito envio real.

Archivos modificados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`

Integracion Web/API:
- Nuevos metodos en `customerApi`:
  - `listPromotionalCampaigns`
  - `createPromotionalCampaign`
  - `getPromotionalCampaign`
  - `previewPromotionalCampaign`
  - `listPromotionalRecipients`
  - `selectPromotionalCampaignRecipients`
  - `sendPromotionalCampaign`
- Modo mock soporta los mismos metodos para QA local sin API publicada.

Bloqueo de envio:
- `#communication-send-button` sigue `disabled`.
- Copy visible: `Envio real bloqueado`.
- La accion de envio mock/API devuelve bloqueo y no llama proveedor.

Verificacion ejecutada:
- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- `npx prettier --check app/src/app.js app/src/customerApi.js app/index.html app/styles.css`
  - Resultado: OK.

Uso Azure SQL:
- No.
- Motivo: UI local/mock y contratos cliente; no se consulto Azure SQL.

Riesgos o pendientes:
- Requiere aplicar migracion y publicar API antes de probar contra backend real.
- Falta QA local visual del flujo completo.
- Falta decision de release para cualquier envio real.
