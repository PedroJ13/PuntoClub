Equipo: QA
Tarea validada: TASK-576 - Revalidar promociones local tras correcciones P0/P1
Ambiente: Local sin Azure SQL. API tests locales en `api/`; Web local/mock servido temporalmente en `http://127.0.0.1:4190/` con `PUNTO_CLUB_USE_MOCK_API=true` y `PUNTO_CLUB_COMPANY_ID="1"` en memoria; pruebas directas de cliente Web HTTP/mock.
Resultado: aprobado
Checks ejecutados:
- Lectura de `AGENTS.md`, `chat-start/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/AZURE_SQL_COST_GUARDRAILS.md` y handoffs `TASK-573`, `TASK-574`, `TASK-575`.
- `tasks/TASK-576.md` / `tasks/TASK-576-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- `node --check api/src/functions/promotionalCampaigns.js`, `api/src/lib/errors.js`, `api/test/promotional-campaigns.test.js`, `app/src/app.js`, `app/src/customerApi.js` -> OK.
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/errors.js api/test/promotional-campaigns.test.js app/src/app.js app/src/customerApi.js` -> OK.
- `node --test test/promotional-campaigns.test.js test/errors.test.js` en `api/` -> 17/17 OK.
- `npm test` en `api/` -> 150/150 OK.
- Web local pre-login: sin sesion, sin errores visibles de promociones, sin carga de cards/campanas y sin `COMPANY_NOT_FOUND`.
- Web local post-login mock: ingreso con `owner@mock.test`; comunicaciones carga sin errores, preview funciona, boton `Envio real bloqueado` permanece deshabilitado.
- Web local destinatarios: lista de clientes suscritos visible; seleccion de destinatario `10`; guardar destinatarios confirma `1 destinatarios guardados. El envio real sigue bloqueado.` sin 500.
- Web local campana/preview/historial: edicion de borrador `QA TASK-576`, preview actualizado con puntos, historial muestra destinatario pendiente.
- Web local baja promocional: baja de cliente `10`, desaparece de suscritos, seleccion vuelve a `0`, aparece en vista `Bajas` como `Baja promocional`, sin boton duplicado.
- Cliente Web mock directo: config publica `companyId=1`, sesion mock `company.id=9`, promociones operan, seleccion agrega 1 recipient, preview `sendBlocked=true`, send devuelve `PROMOTIONAL_SEND_BLOCKED`.
- Cliente Web HTTP directo: config real simulada `companyId=1`, despues de `setActiveCompanyId("9")` las URLs de promociones usan `/api/companies/9/...` para campaigns, recipients y preview.
Hallazgos:
- Las correcciones P0/P1 quedan validadas localmente.
- API local/test exige sesion para promociones: sin sesion -> `401 UNAUTHORIZED`; ruta con company diferente a sesion -> `403 FORBIDDEN`; ruta igual a sesion -> usa company autenticada.
- El mapeo de errores de seleccion ya cubre duplicados y FK esperables con errores controlados; no queda evidencia local del 500 anterior.
- Web local ya no carga promociones antes de confirmar sesion; tras sesion usa empresa activa por `setActiveCompanyId`.
- Seleccion de destinatarios, preview, historial y baja promocional funcionan en Web/mock.
- El envio real sigue bloqueado por UI/mock/API (`PROMOTIONAL_SEND_BLOCKED`, `feature_flag_disabled`).
P0/P1:
- Ninguno abierto en validacion local.
P2/P3:
- P3 documental: no existe archivo fuente `tasks/TASK-576.md`.
- P3 pendiente de release: falta QA publicado posterior para confirmar las mismas correcciones contra ambiente desplegado y sesion real/controlada.
Evidencia:
- Tests API: focal 17/17 OK; completo 150/150 OK.
- Web pre-login: `Sesion no iniciada`, sin errores de promociones ni cards cargadas.
- Web post-login: Comunicaciones visible, preview con puntos, `Envio real bloqueado` disabled.
- Destinatarios: antes `0 seleccionados de 5`; despues de guardar `1 seleccionado de 5`, status `1 destinatarios guardados. El envio real sigue bloqueado.`
- Historial: fila pendiente para `maria@example.com`.
- Baja: cliente `10` removido de suscritos, vista `Bajas` muestra `Maria Soto ... Baja promocional`, sin accion duplicada.
- HTTP client: antes active company `1`; despues de `setActiveCompanyId("9")`; URLs capturadas usan `/companies/9/`.
Uso DB cloud: No. No se uso Azure SQL ni ambiente publicado; todo fue local/mock/tests.
Riesgos o pendientes:
- La validacion local no reemplaza QA publicado; requiere deploy API/Web y revalidacion con sesion real/controlada.
- No se borro ni modifico la campana QA publicada creada en TASK-572; queda fuera de alcance.
- Mantener bloqueado envio real hasta decision explicita posterior.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff y decidir commit/push/deploy de correcciones; luego asignar QA publicado de revalidacion de promociones seguridad.
