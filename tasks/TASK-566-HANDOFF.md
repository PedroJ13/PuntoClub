Equipo: QA
Tarea validada: TASK-566 - Validar MVP local de promociones sin envio real
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; validacion de formato, sintaxis, suite API, pruebas focales de cliente mock Web/API y revision estatica de UI local. Sin Azure SQL, sin ACS real y sin envio de correos reales.
Resultado: no aprobado

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/QA_TEST_PLAN.md`, `tasks/TASK-561-HANDOFF.md`, `tasks/TASK-562-HANDOFF.md`, `tasks/TASK-563-HANDOFF.md`, `tasks/TASK-564-HANDOFF.md` y `tasks/TASK-565-HANDOFF.md`.
- `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/src/lib/validators.js api/test/promotional-campaigns.test.js`.
- `node --check` para:
  - `app/src/app.js`;
  - `app/src/customerApi.js`;
  - `api/src/functions/promotionalCampaigns.js`;
  - `api/src/lib/repository.js`;
  - `api/src/lib/validators.js`.
- `node --test test/promotional-campaigns.test.js` en `api/`.
- `npm test` en `api/`.
- Prueba focal Node del cliente mock Web:
  - listar campanas;
  - crear borrador promocional;
  - generar preview con puntos;
  - listar destinatarios suscritos/bajas/no aptos;
  - seleccionar destinatarios elegibles;
  - validar limite MVP de 5;
  - validar rechazo de duplicados;
  - confirmar bloqueo de envio real.
- Revision focal de UI/codigo para baja promocional:
  - `app/index.html`;
  - `app/src/app.js`;
  - `app/src/customerApi.js`;
  - `api/src/functions/promotionalCampaigns.js`;
  - `api/src/lib/repository.js`;
  - `database/migrations/20260629_promotional_campaigns_mvp.sql`.
- Intento de smoke Playwright local con servidor estatico/mock:
  - no se obtuvo evidencia estable por timeouts del automation runner local; se reemplazo por pruebas focales de cliente mock y revision estatica.

Hallazgos:
- Formato, sintaxis y suite API pasan:
  - Prettier OK;
  - `node --check` OK;
  - test focal promociones OK;
  - suite API completa OK.
- Creacion de campana en mock funciona:
  - campana `QA Promo TASK-566 API`;
  - estado `draft`;
  - limite `5`;
  - `includePoints=true`.
- Preview mock funciona:
  - renderiza variables de cliente/empresa;
  - incluye linea de puntos disponibles;
  - incluye footer de baja promocional;
  - el footer indica que la baja no elimina puntos/beneficios/historial.
- Seleccion de destinatarios en mock funciona para elegibles:
  - destinatarios suscritos elegibles encontrados;
  - seleccion guardada con estado `pending`;
  - snapshot de preferencia `subscribed`;
  - snapshot de puntos presente.
- Limites y negativos de destinatarios:
  - seleccionar 6 destinatarios devuelve `VALIDATION_ERROR`;
  - seleccionar duplicados devuelve `VALIDATION_ERROR`.
- Envio real permanece bloqueado:
  - cliente mock `sendPromotionalCampaign` devuelve `PROMOTIONAL_SEND_BLOCKED`;
  - API `POST .../send` mantiene bloqueo por `PROMOTIONAL_EMAIL_SEND_ENABLED` y aun con flag true lanza bloqueo hasta decision explicita;
  - UI mantiene `#communication-send-button disabled` y copy `Envío real bloqueado`.
- Modelo/API de baja promocional existen:
  - migracion propone `CustomerPromotionalEmailPreferences` y `PromotionalUnsubscribeEvents`;
  - API expone `POST /api/companies/{companyId}/promotional-unsubscribe`;
  - repositorio registra `promotionalStatus=unsubscribed` y mensaje seguro.
- Pero Web/mock local no permite ejecutar ni validar baja promocional end-to-end:
  - `app/src/customerApi.js` no expone metodo `unsubscribePromotionalCustomer` ni ruta `promotional-unsubscribe`;
  - `app/src/app.js` no tiene accion/formulario/boton para registrar baja promocional;
  - la UI solo muestra filtros/estados de `Baja promocional`, no una accion de baja;
  - el mock visible no contiene clientes `unsubscribed` ni `blocked` al listar destinatarios.

P0/P1:
- P1 abierto: no se puede aprobar el MVP local de promociones porque la baja promocional no es ejercitable end-to-end desde Web/mock local. El backend/modelo existe, pero el flujo validable por QA no permite registrar una baja promocional ni confirmar que un cliente dado de baja queda excluido desde la UI/local mock.

P2/P3:
- P2: el smoke Playwright local no produjo evidencia estable por timeouts del runner; conviene agregar un test e2e local focal o script QA mantenible para promociones.
- P3: `package.json` referencia `playwright.config.mjs` y `tests/qa`, pero esos paths no existen en este workspace; no bloquea promociones porque se usaron comandos directos.

Evidencia:
- Prettier:
  - `All matched files use Prettier code style!`
- `node --check`:
  - OK para Web/API revisados.
- `node --test test/promotional-campaigns.test.js`:
  - `# tests 4`;
  - `# pass 4`;
  - `# fail 0`.
- `npm test` en `api/`:
  - `# tests 145`;
  - `# pass 145`;
  - `# fail 0`.
- Cliente mock Web/API:
  - `source=Modo de prueba`;
  - campana creada `id=702`, `status=draft`, `limit=5`, `includePoints=true`;
  - preview `pointsLine=Tienes 1250 puntos disponibles en Cafe Central.`;
  - preview `sendBlocked=true`, `blockReason=feature_flag_disabled`;
  - destinatarios suscritos elegibles: clientes `10` y `11`;
  - seleccion guardada: `count=2`, estados `pending`;
  - limite 6 destinatarios: `ApiError VALIDATION_ERROR`;
  - duplicados: `ApiError VALIDATION_ERROR`;
  - envio real: `ApiError PROMOTIONAL_SEND_BLOCKED`.
- Busqueda focal baja promocional:
  - API/backend: `unsubscribePromotionalCustomer` y ruta `promotional-unsubscribe` presentes;
  - Web/mock: sin metodo cliente ni accion UI para registrar baja.

Uso DB cloud: No. No se uso Azure SQL ni ambiente cloud real. No se enviaron correos reales.

Riesgos o pendientes:
- No liberar envio real de promociones hasta que la baja promocional sea validable end-to-end en local y luego publicado.
- Falta exponer en Web/mock una accion o flujo controlado para registrar baja promocional y confirmar exclusion de destinatarios.
- Falta reintentar QA visual/e2e estable cuando exista un script local focal para promociones.

Siguiente recomendado:
- Web Dev/Backend API deben conectar `POST /promotional-unsubscribe` en `customerApi`, agregar accion/mock local para baja promocional y permitir validar que el cliente dado de baja queda fuera de elegibles.
- Luego crear tarea QA local focal para revalidar baja promocional, seleccion, historial y bloqueo de envio real.
