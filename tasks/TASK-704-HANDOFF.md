Equipo: Web Dev
Modo de ejecucion: Comunicaciones / Bugfix imagen nueva campana
Tarea completada: TASK-704 - Corregir estado de imagen al crear nueva campana

Resultado:
- Se corrigio la UI de `Enviar campañas` para que `Crear campaña` no arrastre imagen, preview ni errores de la campaña previamente seleccionada.
- Una nueva campaña sin `campaignId` ahora deja el bloque de imagen limpio y deshabilitado.
- El mensaje visible antes de guardar el borrador queda como:
  - `Guarda la campaña para agregar una imagen`
- El error:
  - `No se puede modificar la imagen de una campaña enviada.`
  solo se muestra para campañas existentes con estado no editable.
- No se enviaron correos reales.
- No se cambiaron API, SQL, ACS, flags ni storage.

Cambios implementados:
- Se agrego estado UI `isCreatingPromotionalCampaignDraft` para distinguir un borrador nuevo en formulario de la campaña seleccionada existente.
- `resetPromotionalCampaignForm()` ahora:
  - limpia input de archivo;
  - limpia errores/estado;
  - renderiza imagen `null`;
  - renderiza preview sin imagen previa;
  - deshabilita controles de imagen hasta guardar.
- `renderCommunicationPreview()` ya no usa imagen ni copy de `currentPromotionalCampaign` mientras se esta creando una campaña nueva.
- `uploadPromotionalCampaignImage()` y `deletePromotionalCampaignImage()` ahora tienen guardas defensivas para no operar sobre la campaña anterior si el formulario nuevo aun no fue guardado.
- Despues de guardar el borrador, el formulario queda abierto para permitir agregar imagen inmediatamente.
- Los controles de imagen se habilitan solo cuando existe una campaña guardada editable.
- El boton `Enviar campaña` queda deshabilitado mientras se crea un borrador nuevo.

Archivo cambiado:
- `app/src/app.js`

Validacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check`
- QA local con Playwright + API mock:
  - login mock;
  - abrir `Enviar campañas`;
  - abrir `Crear campaña`;
  - confirmar imagen deshabilitada antes de guardar;
  - guardar borrador;
  - confirmar controles de imagen habilitados;
  - agregar imagen mock;
  - confirmar preview con imagen;
  - ocultar y abrir `Crear campaña` nuevamente;
  - confirmar que nueva campaña no arrastra imagen, preview ni errores.

Uso Azure SQL:
- No.

Riesgos / pendientes:
- Falta QA publicada con sesion real para validar persistencia tras recarga contra API/Blob Storage.
- No se probo envio real y queda fuera de alcance.
