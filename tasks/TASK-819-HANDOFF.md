Equipo: Backend/API
Modo de ejecucion: Promociones / Destinatarios
Tarea completada: TASK-819 - Eliminar limite MVP de 5 destinatarios promocionales

Resultado:
- Eliminado el limite server-side de 5 destinatarios en seleccion y envio promocional.
- La validacion de payload ahora acepta selecciones mayores a 5, mantiene seleccion obligatoria y rechazo de duplicados.
- El repositorio ya no bloquea por `recipient_limit` al preparar ni iniciar el envio.
- Se mantiene anti-duplicado por campana/cliente para destinatarios ya incluidos/enviados.
- Se mantiene aislamiento por empresa mediante el flujo existente autenticado por sesion.
- Se agrego rechazo server-side de destinatarios no elegibles antes de insertar:
  - cliente inexistente o fuera de empresa efectiva;
  - cumpleanos fuera del dia cuando la campana es de cumpleanos;
  - correo faltante o invalido;
  - preferencia promocional distinta de `subscribed`.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Archivos cambiados:
- `api/src/lib/validators.js`
- `api/src/lib/repository.js`
- `api/test/promotional-campaigns.test.js`
- `tasks/TASK-819-HANDOFF.md`

Detalle tecnico:
- `validatePromotionalRecipientSelectionPayload` deja de rechazar `customerIds.length > 5`.
- `beginPromotionalCampaignSend` deja de comparar pendientes contra `recipient_limit`.
- `replacePromotionalCampaignRecipients` deja de comparar seleccion contra `recipient_limit`.
- `replacePromotionalCampaignRecipients` ahora falla con `VALIDATION_ERROR` si algun `customerId` seleccionado no cumple reglas de elegibilidad.
- El flujo de envio sigue requiriendo `confirmSend: true`.

Validaciones:
- `node --check api/src/lib/validators.js`
- `node --check api/src/lib/repository.js`
- `node --check api/test/promotional-campaigns.test.js`
- `node --test api/test/promotional-campaigns.test.js`
- `npm --prefix api test`
- `npx prettier --check api/src/lib/validators.js api/src/lib/repository.js api/test/promotional-campaigns.test.js app/index.html app/src/app.js app/src/customerApi.js`
- `git diff --check`

Resultado de validaciones:
- Sintaxis OK.
- Test focal promociones: 23/23 pass.
- Suite API completa: 179/179 pass.
- Prettier OK.
- `git diff --check` sin errores; solo avisos LF/CRLF.

Uso Azure SQL:
- No.
- Motivo: cambio local de contrato/API con pruebas automatizadas; la tarea no requeria tocar SQL ni datos reales.

Riesgos o pendientes:
- El campo historico `recipient_limit` sigue existiendo en el contrato/modelo, pero ya no se usa para limitar seleccion/envio. Si Product quiere retirarlo del modelo publico, requiere tarea separada.
