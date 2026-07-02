Equipo: Web Dev
Modo de ejecucion: Promociones / UX errores envio
Tarea completada: TASK-740 - Alinear UI con bloqueo anti-duplicado real

Resultado:
- Se confirmo que la UI ya intercepta `PROMOTIONAL_RECIPIENT_ALREADY_SELECTED` y el mensaje tecnico `Promotional recipient is already selected for this campaign.`
- Cuando el API devuelve duplicado durante envio promocional, la UI muestra el aviso `Destinatario ya incluido` con copy en espanol.
- El duplicado se muestra en el panel `Resultado`, sin texto tecnico y sin mostrar `Envío finalizado`.
- Se mantiene la campaña/destinatarios visibles.
- No se cambio API real desde Web, SQL, ACS, flags ni reglas de envio.
- No se enviaron correos reales.

Cambios realizados:
- `app/src/customerApi.js`
  - El mock local de `sendPromotionalCampaign` ahora reproduce el contrato real:
    - Si el cliente ya fue incluido con estado distinto de `pending` en la misma campaña, lanza `ApiError("PROMOTIONAL_RECIPIENT_ALREADY_SELECTED", "Promotional recipient is already selected for this campaign.")`.
  - Esto permite validar localmente el bloqueo y el copy de UI sin enviar correos reales.

Comportamiento confirmado:
- Primer envio mock a un cliente elegible:
  - muestra `Envío finalizado`.
- Segundo envio mock de la misma campaña al mismo cliente:
  - muestra `Destinatario ya incluido`.
  - muestra `Este cliente ya fue incluido en esta campaña. Para volver a enviarle una promoción, crea una nueva campaña o selecciona otra.`
  - no muestra `Promotional recipient is already selected for this campaign.`
  - no muestra `Envío finalizado`.
  - no usa el campo de error tecnico.

Validacion local:
- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- `npx prettier --check api/src/lib/repository.js api/test/promotional-campaigns.test.js app/src/customerApi.js app/src/app.js`
- `git diff --check -- api/src/lib/repository.js api/test/promotional-campaigns.test.js app/src/customerApi.js app/src/app.js`
- Smoke local con Playwright + mock API:
  - login mock;
  - crear campaña;
  - seleccionar cliente;
  - primer envio mock exitoso;
  - segundo envio mismo cliente/misma campaña bloqueado con aviso en espanol.

Uso Azure SQL:
- No.
- Motivo: validacion Web local con mock.

Correos reales / flags:
- No se enviaron correos reales.
- No se activo ni desactivo `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se tocaron ACS, sender, secretos ni configuracion Azure.

Riesgos o pendientes:
- Pendiente QA formal de TASK-741.
- Pendiente validacion publicada despues de release para confirmar el mismo comportamiento contra API desplegada.
- `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md` y `tasks/TASK-740.md` no existen en este checkout; se uso como fuente la tarea pegada por Product Owner.
