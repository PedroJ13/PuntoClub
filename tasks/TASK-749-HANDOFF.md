Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UI local
Tarea completada: TASK-749 - Implementar subnavegacion Crear / actualizar campanas

Resultado:
- Se implemento la subnavegacion de Comunicaciones con cuatro opciones:
  - `Enviar campañas`
  - `Crear / actualizar campañas`
  - `Clientes`
  - `Historial`
- Se movio todo el panel `Crear/Editar campaña` al nuevo subnav `Crear / actualizar campañas`.
- `Enviar campañas` queda enfocado en seleccionar una campana existente, revisar preview, seleccionar destinatarios y enviar.
- Se agrego preview independiente en `Crear / actualizar campañas` para la campana gestionada.
- Se mantuvo el preview existente en `Enviar campañas` para la campana seleccionada para envio.
- Se agrego el boton `Ir a Enviar campañas`; si la campana gestionada tiene `id`, navega a envio y la deja seleccionada.
- No se cambio API, SQL, ACS, sender, flags ni reglas de envio.
- No se enviaron correos reales.

Cambios realizados:
- `app/index.html`
  - Agrega tab `Crear / actualizar campañas`.
  - Cambia el panel `Crear/Editar campaña` de `data-communication-panel="send"` a `data-communication-panel="manage"`.
  - Agrega `Ir a Enviar campañas` dentro del formulario de gestion.
  - Agrega `Preview de edición` para la vista de gestion.
- `app/src/app.js`
  - Agrega soporte para vista `manage`.
  - Agrega elementos `communicationGoToSendButton` y `communicationManagePreview`.
  - El formulario de gestion actualiza el preview de edicion, no el preview de envio.
  - Al guardar, seleccionar, resetear, subir o eliminar imagen se refresca el preview de edicion.
  - `Ir a Enviar campañas` selecciona la campana gestionada para envio cuando aplica.

Validacion local:
- `node --check app/src/app.js`
- `npx prettier --check app/index.html app/src/app.js app/styles.css`
- `git diff --check -- app/index.html app/src/app.js app/styles.css`
- Smoke local con Playwright y mock API:
  - login mock correcto;
  - subnav muestra exactamente `Enviar campañas`, `Crear / actualizar campañas`, `Clientes`, `Historial`;
  - `Crear/Editar campaña` no aparece dentro de `Enviar campañas`;
  - vista `Crear / actualizar campañas` muestra formulario de gestion y preview de edicion;
  - crear campana local actualiza preview de edicion;
  - `Ir a Enviar campañas` navega a envio, deja seleccionada la campana creada y actualiza preview de envio.

Uso Azure SQL:
- No.
- Motivo: cambio Web/UI local con mock.

Correos reales / flags:
- No se enviaron correos reales.
- No se activo ni desactivo `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se tocaron ACS, sender, secretos ni configuracion Azure.

Riesgos o pendientes:
- Pendiente QA local/publicada para confirmar que editar una campana existente con imagen no contamina la campana seleccionada para envio.
- Pendiente validar responsive visual manual/publicado despues de release.
- `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md` y `tasks/TASK-749.md` no existen en este checkout; se uso como fuente la tarea pegada por Product Owner y `tasks/TASK-745-HANDOFF.md`.
