Equipo: QA
Tarea validada: TASK-530 - Validar submenus Mi empresa y Enviar campanas local
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; servidor HTTP estatico en memoria sobre `app/` y Playwright/headless desktop `1366x900` + mobile `390x844`. Sin deploy, sin envio de correos, sin ACS real y sin escritura en API/SQL.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/QA_TEST_PLAN.md`, `tasks/TASK-527-assignment.md`, `tasks/TASK-528-HANDOFF.md` y `tasks/TASK-529-HANDOFF.md`.
- Nota de contexto: no existe `tasks/TASK-530.md`, `tasks/TASK-530-assignment.md`, `docs/OPERATING_STATUS.md` ni `docs/PROJECT_OPERATING_RULES.md` en este workspace; se ejecuto el alcance indicado por el usuario y los criterios derivados de TASK-527/TASK-528/TASK-529.
- `node --check app/src/app.js`.
- `git status --short --branch`.
- `rg` de marcadores de navegacion local:
  - `data-company-panel`;
  - `data-communication-panel`;
  - `setCompanySubsection`;
  - `setCommunicationView`;
  - `communication-send-button`.
- `npx prettier --check app/index.html app/src/app.js app/styles.css`.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`.
- Playwright local desktop y mobile validando:
  - submenu local de `Mi empresa`: `Perfil`, `Logo`, `Acceso`, `Comunicaciones`;
  - panel inicial `Mi empresa > Perfil`;
  - paneles `Logo`, `Acceso` y `Comunicaciones`;
  - puente `Mi empresa > Comunicaciones > Abrir Enviar campañas`;
  - submenu local de comunicaciones: `Enviar campañas`, `Configuración`, `Clientes`, `Historial`;
  - panel inicial `Enviar campañas` con formulario y preview;
  - bloqueo de envio real;
  - bloqueo visual de campanas promocionales;
  - overflow horizontal basico.

Hallazgos:
- `Mi empresa` contiene submenu local con `Perfil`, `Logo`, `Acceso` y `Comunicaciones`.
- `Perfil` esta marcado inicialmente como activo en el HTML con `aria-selected="true"` y clase `active`.
- `Logo` y `Acceso` cambian a sus paneles correspondientes en desktop y mobile.
- `Mi empresa > Comunicaciones` muestra el panel puente y el boton `Abrir Enviar campañas`.
- El puente abre la seccion de comunicaciones en la vista `Enviar campañas`.
- `Enviar campañas` muestra formulario, destinatarios, mensaje, preview y boton `Envío real bloqueado`.
- `Configuración`, `Clientes` e `Historial` cambian de panel correctamente en desktop y mobile.
- El envio real sigue bloqueado: `#communication-send-button.disabled = true`.
- Las campanas promocionales siguen bloqueadas visualmente con copy de dominio promocional, baja y cuotas.
- No se detectaron errores de pagina en Playwright desktop/mobile.

P0/P1:
- No se encontraron P0/P1 abiertos.

P2/P3:
- P2: el menu lateral principal sigue mostrando `Comunicaciones` en vez de `Enviar campañas`. El flujo no queda bloqueado porque dentro de la seccion existe el submenu `Enviar campañas` y el puente desde `Mi empresa` funciona, pero queda inconsistente con la redefinicion de TASK-527 que pedia menu externo `Enviar campanas`.
- P3: `npx prettier --check app/index.html app/src/app.js app/styles.css` reporta formato pendiente en `app/index.html` y `app/styles.css`. `app/src/app.js` pasa sintaxis y `git diff --check` no reporta errores de whitespace, solo warnings LF/CRLF del entorno.
- P3: la prueba local dispara automaticamente `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/me` al cargar la app; no se ejecutaron endpoints de comunicaciones ni escrituras.

Evidencia:
- `node --check app/src/app.js`: OK.
- `git status --short --branch`:
  - `M app/index.html`;
  - `M app/src/app.js`;
  - `M app/styles.css`;
  - `?? debug.log`;
  - `?? tasks/TASK-528-HANDOFF.md`;
  - `?? tasks/TASK-529-HANDOFF.md`.
- Marcadores encontrados:
  - `data-company-panel="profile"`, `logo`, `access`, `communications`;
  - `data-communication-panel="send"`, `settings`, `customers`, `history`;
  - funciones `setCompanySubsection` y `setCommunicationView`;
  - estilos `.section-tabs`, `.section-tab`, `.company-communications-grid`.
- Playwright local desktop `1366x900`:
  - `companyLogoPanel=true`;
  - `companyAccessPanel=true`;
  - `companyCommsPanel=true`;
  - `bridgeOpensSend=true`;
  - `settingsPanel=true`;
  - `customersPanel=true`;
  - `historyPanel=true`;
  - `sendPanel=true`;
  - `sendBlocked=true`;
  - `promoBlocked=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.
- Playwright local mobile `390x844`:
  - `companyLogoPanel=true`;
  - `companyAccessPanel=true`;
  - `companyCommsPanel=true`;
  - `bridgeOpensSend=true`;
  - `settingsPanel=true`;
  - `customersPanel=true`;
  - `historyPanel=true`;
  - `sendPanel=true`;
  - `sendBlocked=true`;
  - `promoBlocked=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.
- Validacion de fuente:
  - submenu `Mi empresa` inicia con `Perfil` activo: `class="section-tab active"` y `aria-selected="true"`;
  - submenu comunicaciones inicia con `Enviar campañas` activo: `class="section-tab active"` y `aria-selected="true"`;
  - menu lateral principal aun muestra `Comunicaciones`.

Uso DB cloud: No. No se conecto a Azure SQL ni se uso DB real de forma directa. La app local realizo un `GET /api/me` automatico contra la API publicada al cargar, en modo read-only y fuera de endpoints de comunicaciones; no se enviaron correos ni se hicieron escrituras.

Riesgos o pendientes:
- Corregir el copy del menu lateral principal si Product mantiene el criterio de TASK-527 de renombrar el menu externo a `Enviar campañas`.
- Normalizar formato de `app/index.html` y `app/styles.css` si Prettier sera gate de publicacion.
- Backend/API real de comunicaciones, persistencia, cuotas, bajas y proveedor de correo siguen fuera de alcance; la UI validada es local/mock.

Siguiente recomendado:
- Web Dev puede corregir el label del menu lateral principal de `Comunicaciones` a `Enviar campañas` antes de publicar si se mantiene la definicion de TASK-527.
- Product / Architect / Release puede procesar TASK-530 como QA local aprobada con observaciones y decidir si el P2 de copy bloquea o se acepta para el paquete.
