Equipo: Web Dev
Modo de ejecucion: Promociones / Envio UI
Tarea completada: TASK-710 - Ajustar panel Enviar campana para solo preparar envio

Resultado:
- Se retiro el boton `Crear campaña` del panel `Enviar campañas`.
- El panel `Enviar campañas` queda enfocado solo en:
  - buscar campaña existente;
  - seleccionar campaña para envío;
  - mostrar preview;
  - seleccionar destinatarios;
  - enviar con confirmacion y reglas existentes.
- La lista de envío se mantiene sincronizada con campañas creadas desde el panel `Crear/Editar campaña`.
- El selector de envío incluye placeholder:
  - `Selecciona una campaña para enviar`
- Crear/editar campaña ya no comparte estado de imagen/formulario con la campaña seleccionada para envío.
- No se cambiaron reglas de envío, API, SQL, ACS ni flags.
- No se enviaron correos reales.

Cambios implementados:
- `Enviar campañas` conserva `communication-campaign-search` y `communication-campaign-list`.
- El panel de envío ya no contiene formulario de creación ni input de imagen.
- La imagen pendiente en el panel de gestion ya no bloquea ni modifica el boton `Enviar campaña`.
- El envio solo cambia de campaña cuando el usuario selecciona explicitamente una campaña en `communication-campaign-list`.
- Al seleccionar una campaña para envío, se mantiene el flujo existente de preview y destinatarios.

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
  - confirmar que el panel `Enviar campañas` no contiene `#communication-new-campaign-button`;
  - crear campaña desde panel independiente;
  - confirmar que la campaña aparece en el selector de envío;
  - confirmar que el selector de envío no adopta automaticamente la campaña nueva;
  - seleccionar explicitamente la campaña nueva;
  - confirmar que el preview de envío muestra la imagen.

Uso Azure SQL:
- No.

Riesgos / pendientes:
- Falta QA publicada con sesion real.
- La actualizacion de contenido de campañas existentes queda pendiente de contrato Backend/API; esta tarea solo separa UI/estado y mantiene flujo de envío.
