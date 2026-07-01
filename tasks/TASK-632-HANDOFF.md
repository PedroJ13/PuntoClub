Equipo: QA
Tarea validada: TASK-632 - Validar guardado de campana promocional autenticado
Ambiente: Local controlado en navegador interno. Happy path con mock local `PUNTO_CLUB_USE_MOCK_API=true`; sesion vencida con API fake local que responde `401 UNAUTHORIZED` al POST de campana. Sin API publicada, sin Azure SQL, sin ACS y sin envio real.
Resultado: aprobado
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`.
- `tasks/TASK-632.md`: no existe en workspace; se uso el alcance pegado por el Product Owner.
- Lectura de `tasks/TASK-630-HANDOFF.md` y `tasks/TASK-631-HANDOFF.md`.
- Revision focal de contratos Web/API de promociones y manejo `UNAUTHORIZED/FORBIDDEN`.
- Happy path local mock: login, abrir `Enviar campanas`, crear campana promocional y validar seleccion/listado/preview.
- Caso sesion vencida: API fake local con login/me/settings/listado OK, pero `POST /api/companies/9/promotional-campaigns` devuelve `401` con `Authentication is required.`
- Confirmacion de que no se ejecuto envio promocional real.
- `node --check app\src\app.js`.
- `node --check app\src\customerApi.js`.
- `git diff --check -- app\src\app.js app\src\customerApi.js`.
Hallazgos:
- Con empresa logueada en mock local, se pudo crear la campana `QA TASK-632 926633`.
- La campana creada quedo listada y seleccionada como `QA TASK-632 926633 - QA TASK-632 autenticada 926633`.
- El preview se actualizo con asunto/cuerpo de la campana creada.
- No se mostro `Authentication is required` en el happy path autenticado.
- En el caso de sesion vencida, la app recibio `401 UNAUTHORIZED` al guardar campana.
- Ante el `401`, la UI limpio la identidad visible, oculto el panel operativo, navego a `/login` y mostro `Tu sesión expiró. Accede nuevamente a tu panel.`
- En el caso vencido no quedo visible el texto tecnico `Authentication is required`.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existe archivo local `tasks/TASK-632.md`; se uso el alcance del chat.
Evidencia:
- Happy path mock: `authStatus=owner@mock.test`, empresa `Cafe Central`, `dataSource=Modo de prueba`, `hasAuthenticationRequired=false`, `selectedIsCreated=true`, `hasCreatedOption=true`.
- Campana happy path: `QA TASK-632 926633`, asunto `QA TASK-632 autenticada 926633`.
- Preview happy path: asunto/cuerpo TASK-632 visibles con puntos disponibles.
- Sesion vencida: request fake registrado `POST /api/companies/9/promotional-campaigns`; respuesta 401 controlada.
- UI sesion vencida: URL `http://127.0.0.1:4183/login`, `authStatus=Sesión no iniciada`, `loginVisible=true`, `appBodyHidden=true`, `loginError=Tu sesión expiró. Accede nuevamente a tu panel.`, `hasAuthenticationRequired=false`.
- Checks: `node --check` OK para `app/src/app.js` y `app/src/customerApi.js`; `git diff --check` OK con warning LF/CRLF no bloqueante.
Uso DB cloud: No. Validacion local/mock y API fake local; no se consulto Azure SQL ni ambiente cloud.
Riesgos o pendientes:
- La validacion fue local controlada. Si el problema se reproduce publicado con sesion real recien iniciada, capturar hora exacta y abrir tarea de QA web/diagnostico con sesion controlada.
- El API fake cubrio el contrato de auth vencida para guardar campana; no reemplaza un smoke publicado posterior.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff. Si corresponde publicar, abrir QA web posterior para confirmar el mismo comportamiento en `puntoclubcr.com` con sesion real/controlada.
