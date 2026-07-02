Equipo: Web Dev
Modo de ejecucion: Promociones / Completar edicion UI
Tarea completada: TASK-713 - Conectar edicion real de campanas existentes

Resultado:
- Se conecto el panel `Crear/Editar campaña` al nuevo endpoint de actualizacion.
- Al seleccionar una campaña existente, el formulario carga:
  - nombre interno;
  - asunto;
  - mensaje;
  - incluir puntos;
  - imagen asociada.
- Las campañas existentes editables permiten guardar cambios reales de contenido.
- La gestion de imagen existente se mantiene.
- Si la campaña editada es la misma seleccionada para envío, se refrescan lista y preview de envío.
- Editar una campaña no altera la campaña seleccionada para envío salvo que sea la misma.
- No se enviaron correos reales.
- No se cambiaron flags, ACS, SQL ni reglas de envío.

Cambios implementados:
- `customerApi` agrega:
  - `updatePromotionalCampaign(campaignId, payload)`
  - HTTP `PATCH` con `credentials: include`.
  - mock equivalente para QA local.
- `submitPromotionalCampaignDraft()` ahora:
  - crea campaña si no hay `managedPromotionalCampaign.id`;
  - actualiza campaña si existe una gestionada;
  - preserva separacion entre campaña gestionada y campaña seleccionada para envío.
- `populatePromotionalCampaignForm()` ahora deja editable el contenido si la campaña esta en estado editable.
- El boton pasa a:
  - `Guardar borrador` para nueva campaña;
  - `Guardar cambios` para campaña existente editable;
  - `Campaña no editable` para campañas no editables.

Archivos cambiados:
- `app/src/customerApi.js`
- `app/src/app.js`
- Se mantuvieron los cambios previos de separacion de paneles en:
  - `app/index.html`
  - `app/styles.css`

Validacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `npx prettier --check app\index.html app\src\app.js app\src\customerApi.js app\styles.css api\src\functions\promotionalCampaigns.js api\src\lib\repository.js api\test\promotional-campaigns.test.js`
- `git diff --check`
- Playwright local con mock:
  - login mock;
  - abrir `Enviar campañas`;
  - crear campaña nueva;
  - seleccionar campaña nueva en envío;
  - seleccionar la misma campaña en gestión;
  - editar nombre/asunto/mensaje;
  - guardar cambios;
  - confirmar que listas de gestión/envío reflejan nuevo nombre/asunto;
  - confirmar que preview de envío muestra asunto y mensaje actualizados.

Uso Azure SQL:
- No.

Riesgos / pendientes:
- Falta QA publicada despues de deploy API/Web.
- No se enviaron correos reales por alcance.
