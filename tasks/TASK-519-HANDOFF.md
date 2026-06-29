Equipo: QA
Tarea validada: TASK-519 - Validar modelo y UX local de comunicaciones a clientes
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; revision documental, revision estatica de Web, checks Node/npm locales y servidor estatico local puntual. Sin Azure, sin Azure SQL, sin API real, sin correos reales, sin commit, sin push y sin deploy.
Resultado: aprobado local con observaciones

Checks ejecutados:
- Lectura de contexto base disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `codex-project-templates/QA.md`, `docs/QA_TEST_PLAN.md` y `docs/TASK_BOARD.md`.
- Nota de contexto: en este workspace no existen `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md`, `codex-project-templates/CHAT_MODEL.md` ni `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`.
- Lectura de handoffs de comunicaciones:
  - `tasks/TASK-510-HANDOFF.md`;
  - `tasks/TASK-511-HANDOFF.md`;
  - `tasks/TASK-512-HANDOFF.md`;
  - `tasks/TASK-513-HANDOFF.md`;
  - `tasks/TASK-514-HANDOFF.md`;
  - `tasks/TASK-515-HANDOFF.md`;
  - `tasks/TASK-516-HANDOFF.md`;
  - `tasks/TASK-517-HANDOFF.md`;
  - `tasks/TASK-518-HANDOFF.md`.
- Revision de alcance local en `app/index.html`, `app/src/app.js` y `app/styles.css`.
- `git status --short --branch`.
- `git diff --name-status -- app/index.html app/src/app.js app/styles.css api database package.json`.
- `node --check app/src/app.js`.
- Busqueda de endpoints/API nuevos de comunicaciones en `api/**`, `database/**`, `app/src/customerApi.js`, `app/src/app.js` y `app/index.html`.
- Revision de funciones de compra/canje para confirmar que no invocan comunicaciones/correo.
- Revision estatica de responsive CSS para comunicaciones.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`.
- `npx prettier --check app/index.html app/src/app.js app/styles.css`.
- `npm run format:check -- --ignore-unknown app/index.html app/src/app.js app/styles.css`.
- `npm run lint -- --quiet`.
- Intentos de Playwright local sobre servidor estatico con `/app` y `/login` mock; se documento limitacion por timeouts de automatizacion.

P0/P1:
- No se encontraron P0/P1 abiertos.
- Las campanas promocionales no quedan habilitadas para envio real: el switch de `Campañas promocionales` esta `disabled` y el boton `Envío real bloqueado` tambien esta `disabled`.
- No hay cambios `api/**` ni `database/**` asociados a TASK-518/TASK-519.
- No se detectaron endpoints nuevos ni llamadas API reales para comunicaciones/campanas en el frontend; la pantalla es local/mock, consistente con TASK-518.
- Compra y redencion actuales no quedan acopladas a comunicaciones: `submitPurchase()` solo llama `api.createPurchase`, refresca saldo y abre historial; `submitRedemption()` solo llama `api.createRedemption`, refresca saldo y abre historial. No hay intento de correo que pueda bloquear esas transacciones en el estado local actual.

P2/P3:
- P2: no se pudo completar QA interactiva end-to-end con Playwright por timeout de carga/navegacion local en esta copia del workspace. Se compenso con inspeccion estatica de DOM/JS/CSS y checks ejecutables, pero queda pendiente una corrida visual interactiva estable antes de publicar.
- P3: el copy visible de Configuracion explica que operativos acompanian acciones y que promociones quedan protegidas, pero no incluye literalmente el criterio de TASK-515: "no deben bloquear la operacion". La regla si esta respetada por alcance local porque no hay envio real conectado a compra/canje.
- P3: `npx prettier --check app/index.html app/src/app.js app/styles.css` marca formato pendiente en `app/index.html` y `app/styles.css`. No es bloqueo funcional, pero conviene normalizar antes de commit si el proyecto usa Prettier como gate.
- P3: `npm run format:check` y `npm run lint` globales no son confiables en este workspace: fallan por archivos/configuracion ausentes (`playwright.config.mjs`, `tests/qa/**/*.js`, `eslint.config.*`) y por formato en archivos restaurados de tooling. No se clasifican como P1 de comunicaciones porque exceden el alcance funcional de TASK-519.

Evidencia:
- `git status --short --branch`: rama `main...origin/main [ahead 1]`; cambios locales visibles en `app/index.html`, `app/src/app.js`, `app/styles.css` y handoffs recientes no trackeados.
- `git diff --name-status -- app/index.html app/src/app.js app/styles.css api database package.json`:
  - `M app/index.html`;
  - `M app/src/app.js`;
  - `M app/styles.css`;
  - sin salida para `api/**` ni `database/**`.
- `node --check app/src/app.js`: OK.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`: OK, solo warnings LF/CRLF del entorno.
- `app/index.html` contiene:
  - menu lateral `Comunicaciones`;
  - seccion `Correos y campañas`;
  - resumen local con `Operativos`, `Suscritos`, `Bajas` y `Promociones Pausadas`;
  - configuracion con switches de bienvenida, compra registrada, canje/redencion, beneficio/membresia y campanas promocionales;
  - `Campañas promocionales` bloqueado con motivo `Requiere dominio promocional, baja y cuotas`;
  - formulario de campana local con nombre interno, asunto, destinatarios, mensaje e `Incluir puntos disponibles`;
  - opcion de destinatarios `Clientes con puntos disponibles`;
  - boton `Previsualizar`;
  - boton `Envío real bloqueado` deshabilitado;
  - preview con variables `{{customer.name}}`, `{{company.name}}`, `{{points.currentBalance}}`, `{{promotion.validUntil}}`;
  - clientes/preferencias con filtros `Suscritos`, `Bajas`, `No aptos`;
  - copy de baja: `La baja promocional no elimina puntos, beneficios ni historial`;
  - historial local con fecha, tipo, destinatario y estado.
- `app/src/app.js` contiene:
  - datos mock de comunicaciones con clientes suscritos, cliente dado de baja y cliente sin correo;
  - historial local con estados `Entregado`, `En cola` y `Bloqueado por baja`;
  - `renderCommunicationPreview()` reemplaza variables de cliente, empresa, puntos y vigencia;
  - el preview agrega `Puntos disponibles` solo si el checkbox esta activo;
  - el footer promocional indica que el cliente puede dejar de recibir promociones sin perder puntos, beneficios, membresias ni historial;
  - `renderCommunicationCustomers()` filtra por estado promocional;
  - `getCommunicationPreferenceLabel()` muestra `Baja promocional` y `No apto`.
- `app/styles.css` contiene responsive para comunicaciones:
  - `.communications-kpis`, `.communication-campaign-controls` y `.communication-customer-card` pasan a `grid-template-columns: 1fr` en mobile.
- Busqueda de API:
  - no aparecen contratos `communication-settings`, `communication-campaigns`, `email-preferences` ni endpoints equivalentes implementados;
  - `api/**` solo contiene infraestructura existente de ACS/notifier y tests historicos, no cambios del centro de comunicaciones.

Limitaciones:
- No existe `tasks/TASK-519-assignment.md`; se ejecuto el alcance indicado por el usuario y los criterios de TASK-510 a TASK-518.
- Playwright local no pudo completar una corrida interactiva estable en esta sesion; los intentos quedaron en timeouts de `page.goto`/navegacion aunque la inspeccion DOM previa cargo la SPA.
- No se envio correo real ni se valido ACS.
- No se valido persistencia SQL porque TASK-513 es modelo propuesto y no migracion aplicada.
- No se validaron bloqueos server-side de promociones porque los endpoints de TASK-514 no estan implementados.
- No se valido sesion real ni datos reales.

Uso cloud/SQL: No. No se uso Azure, Azure SQL, GSC, Cloudflare, DNS, ACS real, API publicada ni servicios externos.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-519 como QA local aprobada con observaciones para la UI/mock de comunicaciones.
- Antes de publicacion, corregir formato de `app/index.html` y `app/styles.css` si Prettier sera gate.
- Crear tarea Backend/API separada para implementar contratos con feature flags y tests, especialmente bloqueos server-side de promociones sin dominio/baja/cuotas.
- Crear QA posterior cuando existan endpoints mock/API para validar no bloqueo real de transacciones ante fallo de correo y bloqueos server-side de campanas.

Movimiento de tablero sugerido:
- Mover `TASK-519` a `Needs Review` para procesamiento por Product / Architect / Release.
