Equipo: QA
Tarea validada: TASK-532 - Revalidar ajuste de menu Enviar campañas y formato local
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; validacion estatica, `node`, Prettier, `git diff --check` y Playwright/headless contra servidor HTTP local en memoria sobre `app/`. Se intercepto `/api/me` con mock local para no tocar cloud. Sin deploy, sin Azure SQL, sin ACS real y sin envio de correos.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-530-HANDOFF.md` y `tasks/TASK-531-HANDOFF.md`.
- Nota de contexto: no existe `tasks/TASK-532.md` ni `tasks/TASK-532-assignment.md`; se ejecuto el alcance indicado por el usuario y el seguimiento de TASK-530/TASK-531.
- `git status --short --branch`.
- Busqueda estatica de:
  - `data-section-target="communications"`;
  - `Enviar campañas`;
  - `#company-open-campaigns-button`;
  - `#communication-send-button`;
  - `setCommunicationView("send")`.
- `node --check app/src/app.js`.
- `npx prettier --check app/index.html app/src/app.js app/styles.css`.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`.
- Playwright/headless local desktop `1366x900` y mobile `390x844`, con `/api/me` interceptado, validando:
  - menu lateral principal;
  - apertura de seccion `communications`;
  - vista inicial `Enviar campañas`;
  - panel `Mi empresa > Comunicaciones`;
  - vistas `Configuración`, `Clientes`, `Historial` y `Enviar campañas`;
  - boton de envio real bloqueado;
  - bloqueo promocional;
  - overflow horizontal basico.

Hallazgos:
- El menu lateral principal que apunta a `data-section-target="communications"` ahora muestra `Enviar campañas`.
- No queda el label viejo `Comunicaciones` en el boton lateral principal de esa seccion.
- El menu lateral abre la seccion funcional de comunicaciones y deja visible la vista `Enviar campañas`.
- La vista `Enviar campañas` muestra formulario, destinatarios, mensaje, preview y boton `Envío real bloqueado`.
- `Mi empresa > Comunicaciones` sigue mostrando el panel puente con `Abrir Enviar campañas`.
- La conexion JS del puente esta presente: `#company-open-campaigns-button` ejecuta `setActiveSection("communications")` y `setCommunicationView("send")`.
- Las vistas `Configuración`, `Clientes` e `Historial` siguen disponibles.
- El envio real sigue bloqueado con `#communication-send-button disabled`.
- Las campanas promocionales siguen bloqueadas visualmente con copy de dominio promocional, baja y cuotas.
- No se detectaron errores de pagina en la salida Playwright obtenida para desktop/mobile.

P0/P1:
- No se encontraron P0/P1 abiertos.

P2/P3:
- P3: `npx prettier --check app/index.html app/src/app.js app/styles.css` sigue fallando en `app/index.html` y `app/styles.css`. El ajuste funcional esta validado, pero el criterio de formato local no queda limpio si Prettier es gate formal.
- P3: la corrida Playwright completa devolvio evidencia funcional desktop/mobile, pero el proceso termino por timeout del shell despues de imprimir resultados. Se complemento con validacion estatica de fuente para el puente `Mi empresa > Comunicaciones > Enviar campañas`.

Evidencia:
- `git status --short --branch`:
  - `M app/index.html`;
  - `M app/src/app.js`;
  - `M app/styles.css`;
  - `?? debug.log`;
  - `?? tasks/TASK-528-HANDOFF.md`;
  - `?? tasks/TASK-529-HANDOFF.md`;
  - `?? tasks/TASK-530-HANDOFF.md`;
  - `?? tasks/TASK-531-HANDOFF.md`.
- `node --check app/src/app.js`: OK.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`: OK; solo warnings LF/CRLF del entorno.
- `npx prettier --check app/index.html app/src/app.js app/styles.css`:
  - warning `app/index.html`;
  - warning `app/styles.css`;
  - `Code style issues found in 2 files`.
- Fuente:
  - `app/index.html:840-842`: `data-section-target="communications"` muestra `Enviar campañas`.
  - `app/index.html:1990-1994`: existe `#company-open-campaigns-button` con texto `Abrir Enviar campañas`.
  - `app/src/app.js:1543-1545`: el boton puente llama `setActiveSection("communications")` y `setCommunicationView("send")`.
  - `app/index.html:3169-3174`: la vista `data-communication-view="send"` inicia activa con label `Enviar campañas`.
  - `app/index.html:3330-3332`: `#communication-send-button` mantiene `disabled`.
- Playwright local desktop `1366x900`:
  - `mainMenuLabelEnviarCampanas=true`;
  - `mainMenuNoOldLabel=true`;
  - `mainMenuOpensCommunications=true`;
  - `sendViewVisible=true`;
  - `companyCommsPanel=true`;
  - `settingsStillAvailable=true`;
  - `customersStillAvailable=true`;
  - `historyStillAvailable=true`;
  - `sendPanelStillAvailable=true`;
  - `realSendStillBlocked=true`;
  - `promoStillBlocked=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.
- Playwright local mobile `390x844`:
  - `mainMenuLabelEnviarCampanas=true`;
  - `mainMenuNoOldLabel=true`;
  - `mainMenuOpensCommunications=true`;
  - `sendViewVisible=true`;
  - `companyCommsPanel=true`;
  - `settingsStillAvailable=true`;
  - `customersStillAvailable=true`;
  - `historyStillAvailable=true`;
  - `sendPanelStillAvailable=true`;
  - `realSendStillBlocked=true`;
  - `promoStillBlocked=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.

Uso DB cloud: No. No se conecto a Azure SQL ni se uso DB real. La llamada automatica `/api/me` fue interceptada con mock local en la prueba Playwright; no se enviaron correos ni se hicieron escrituras.

Riesgos o pendientes:
- Si Prettier es condicion de publicacion, falta normalizar `app/index.html` y `app/styles.css` antes de cerrar el criterio de formato local.
- La UI de comunicaciones sigue siendo local/mock; backend/API real, persistencia, bajas, cuotas y proveedor de correo quedan fuera de alcance.
- `debug.log` sigue como archivo local no trackeado y debe permanecer fuera de commit/deploy.

Siguiente recomendado:
- Web Dev debe decidir si corrige Prettier antes de publicar; funcionalmente el label y la navegacion local quedan validados sin P0/P1.
- Product / Architect / Release puede procesar TASK-532 como QA local aprobada con observaciones, dejando el formato como pendiente P3 si no sera gate.
