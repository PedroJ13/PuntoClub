Equipo: Web Dev
Modo de ejecucion: Promociones / UI state separation
Tarea parcialmente completada: TASK-709 - Implementar panel independiente Crear/Editar campana

Resultado:
- Se creo un panel separado `Crear/Editar campaña` dentro de `Enviar campañas`.
- El panel de gestion permite:
  - iniciar una nueva campaña con formulario limpio;
  - guardar una nueva campaña usando el contrato existente;
  - seleccionar una campaña existente para gestionarla;
  - ver imagen asociada a la campaña gestionada;
  - agregar/reemplazar imagen de una campaña guardada editable;
  - eliminar imagen de una campaña guardada editable;
  - refrescar la lista de campañas.
- Se separo el estado de campaña gestionada del estado de campaña seleccionada para envío.
- Se corrigio el bug donde la imagen podia guardarse sobre la campaña seleccionada para envío en vez de la campaña nueva/editada.
- No se enviaron correos reales.
- No se cambiaron API, SQL, ACS, storage ni flags.

Cambios implementados:
- `managedPromotionalCampaign` queda como estado independiente para el panel `Crear/Editar campaña`.
- `currentPromotionalCampaign` queda reservado para el panel `Enviar campañas`.
- La carga, reemplazo y eliminacion de imagen usan siempre `managedPromotionalCampaign.id`.
- Crear nueva campaña ya no selecciona automaticamente esa campaña en el panel de envío.
- La lista de campañas se refresca y alimenta dos selects:
  - `communication-manage-campaign-list` para gestionar campaña;
  - `communication-campaign-list` para preparar envío.
- Una campaña nueva sin `campaignId` mantiene imagen deshabilitada con:
  - `Guarda la campaña para agregar una imagen`
- Al guardar una campaña nueva, los controles de imagen quedan habilitados para esa campaña gestionada.

Limitacion detectada:
- El contrato frontend/API existente no incluye endpoint para actualizar contenido de una campaña existente.
- Se confirmo por busqueda local que existen contratos para:
  - listar campañas;
  - crear campaña;
  - obtener campaña;
  - preview;
  - imagen;
  - destinatarios;
  - envío.
- No se encontro contrato `PATCH/PUT` para editar nombre/asunto/mensaje/includePoints de campaña promocional.
- Por eso, en campañas existentes el contenido queda de solo lectura y la UI indica que la actualizacion no esta disponible; la imagen sí puede gestionarse si la campaña esta editable.

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`

Validacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `npx prettier --check app\index.html app\src\app.js app\styles.css`
- `git diff --check`
- Playwright local con mock:
  - login mock;
  - abrir `Enviar campañas`;
  - confirmar que existe panel `Crear/Editar campaña`;
  - crear campaña nueva;
  - confirmar imagen deshabilitada antes de guardar;
  - guardar borrador;
  - subir imagen mock;
  - confirmar que la imagen aparece en panel de gestion;
  - confirmar que la campaña aparece en lista de gestion y lista de envío;
  - confirmar que el panel de envío no auto-selecciona la campaña recién creada;
  - seleccionar la campaña en el panel de envío y confirmar preview con imagen.

Uso Azure SQL:
- No.

Pendiente recomendado:
- Backend/API: definir endpoint de actualización de campaña existente si se requiere editar nombre/asunto/mensaje/includePoints.
- QA publicado: validar imagen real contra API/Blob con sesion real, sin enviar correos.
