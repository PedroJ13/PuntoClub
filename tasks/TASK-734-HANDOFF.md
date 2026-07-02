Equipo: Web Dev
Modo de ejecucion: Promociones / UX errores envio
Tarea completada: TASK-734 - Mostrar mensaje claro para destinatario duplicado en campana

Resultado:
- Se mapeo el error tecnico `Promotional recipient is already selected for this campaign.` a copy claro en espanol.
- El caso `PROMOTIONAL_RECIPIENT_ALREADY_SELECTED` ahora se muestra en el panel `Resultado` como aviso/informacion, no como fallo tecnico.
- Se mantiene vigente el bloqueo anti-duplicado del backend.
- Si ocurre el duplicado durante el envio, la UI refresca destinatarios, historial local y listas visibles en modo silencioso para mantener el panel consistente.
- No se cambio API, SQL, ACS, flags ni reglas de envio.
- No se enviaron correos reales.

Copy aplicado:
- Titulo: `Destinatario ya incluido`
- Mensaje: `Este cliente ya fue incluido en esta campaña. Para volver a enviarle una promoción, crea una nueva campaña o selecciona otra.`

Cambios realizados:
- `app/src/app.js`
  - Agregado helper `isPromotionalDuplicateRecipientError`.
  - Agregado render `showPromotionalDuplicateRecipientWarning`.
  - `renderCommunicationCampaignError` intercepta duplicados promocionales antes de mostrar mensajes tecnicos.
  - `sendPromotionalCampaign` refresca destinatarios/historial/listas despues del error duplicado sin borrar el aviso.

Validacion local:
- `node --check app/src/app.js`
- `npx prettier --check app/src/app.js`
- `git diff --check -- app/src/app.js`

Uso Azure SQL:
- No.
- Motivo: ajuste local de UX/mensajeria Web.

Correos reales / flags:
- No se enviaron correos reales.
- No se activo ni desactivo `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se tocaron ACS, sender, secretos ni configuracion Azure.

Riesgos o pendientes:
- Pendiente QA local/publicada reproduciendo el `409 PROMOTIONAL_RECIPIENT_ALREADY_SELECTED` real para confirmar que el aviso aparece en `Resultado`.
- En este checkout no existen `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md` ni `tasks/TASK-734.md`; se uso como fuente la tarea pegada por Product Owner.
