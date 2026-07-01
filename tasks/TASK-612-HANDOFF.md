Equipo: QA
Tarea validada: TASK-612 - Validar refinamiento UX local de campanas y destinatarios
Ambiente: Local/mock. Web servida en servidor efimero `http://127.0.0.1:4615/` con `PUNTO_CLUB_USE_MOCK_API=true` inyectado en memoria. Sin Azure SQL, sin ACS real, sin correos reales.
Resultado: aprobado
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`.
- `codex-project-templates/CHAT_MODEL.md`, `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`, `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md`: no existen en este workspace.
- `tasks/TASK-612.md` / `tasks/TASK-612-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- Lectura de handoffs previos `TASK-610` y `TASK-611`.
- `node --check app\src\app.js` -> OK.
- `node --check app\src\customerApi.js` -> OK.
- `git diff --check -- app\index.html app\src\app.js app\styles.css app\src\customerApi.js` -> sin errores; solo warnings de LF/CRLF.
- Smoke visual/interactivo local en desktop con login mock y modulo `Enviar campanas`.
- Smoke responsive mobile con viewport 390x844.
Hallazgos:
- El selector desplegable de campanas funciona como control principal y muestra la campana seleccionada.
- La busqueda por campana filtra correctamente: `QA TASK-612` reduce el selector a la campana QA; limpiar con teclado restaura las opciones.
- `Crear campana` abre el formulario y cambia a `Ocultar formulario`; volver a presionar lo colapsa.
- Al guardar una campana nueva (`QA TASK-612 399687`), queda seleccionada automaticamente y el formulario vuelve a colapsar.
- El preview permanece visible y refleja la campana seleccionada: al cambiar a `Promo clientes frecuentes` muestra el asunto/cuerpo original; al volver a la campana QA muestra `QA UX campanas 399687` y el cuerpo QA.
- Los botones de seleccion rapida estan agrupados y visibles: `Seleccionar elegibles`, `Con puntos`, `Limpiar seleccion`.
- Las filas de clientes en desktop quedan compactas: altura maxima observada 64px, nombre y correo juntos, puntos en bloque corto y badge de estado visible.
- Baja promocional local/mock: al dar de baja a `Maria Soto`, la fila queda visible, checkbox deshabilitado, badge `Baja promocional` y sin repetir texto redundante de baja.
- `Seleccionar elegibles` no marca filas deshabilitadas y selecciona solo el cliente elegible.
- `Limpiar seleccion` vuelve a `0 seleccionados de 5`.
- `Con puntos` no selecciona clientes cuando los clientes visibles tienen 0 puntos; no marca dados de baja.
- En mobile 390x844 no hay overflow horizontal; se mantienen visibles busqueda, selector, preview, acciones rapidas y estados de filas.
- No se ejecuto envio real ni se confirmo ningun envio.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existen `tasks/TASK-612.md` ni `tasks/TASK-612-assignment.md`.
Evidencia:
- Estado inicial local/mock: `Modo de prueba`, empresa mock `Cafe Central`, usuario mock `owner@mock.test`.
- Antes de crear campana: formulario oculto, selector con `Promo clientes frecuentes`, preview visible y contador `0 seleccionados de 5`.
- Crear/cerrar formulario: `formHidden=false` con boton `Ocultar formulario`; luego `formHidden=true` con boton `Crear campana`.
- Despues de guardar: `optionCount=2`, seleccion `QA TASK-612 399687 - QA UX campanas 399687`, formulario colapsado, contador `0 seleccionados de 5`.
- Busqueda: filtro `QA TASK-612` deja una opcion; limpiar por teclado restaura dos opciones.
- Selector/preview:
  - Seleccion original: preview `Promo especial para clientes frecuentes`.
  - Seleccion QA: preview `QA UX campanas 399687` y cuerpo QA local.
- Destinatarios desktop:
  - Antes de baja: 2 filas, 0 deshabilitadas, altura maxima 64px.
  - Despues de baja: 1 fila `Baja promocional`, 1 checkbox deshabilitado, sin texto redundante.
  - `Seleccionar elegibles`: `1 seleccionado de 5`, `disabledCheckedRows=0`.
  - `Limpiar seleccion`: `0 seleccionados de 5`.
  - `Con puntos`: `0 seleccionados de 5` porque ambos clientes visibles tienen 0 puntos.
- Mobile 390x844: `horizontalOverflow=false`, selector y preview visibles, acciones rapidas visibles, 1 fila deshabilitada conservada.
Uso DB cloud: No. No se uso Azure SQL ni ambiente cloud; toda la validacion fue local/mock.
Riesgos o pendientes:
- El smoke local uso datos mock con pocos clientes y 0 puntos; la rama `Con puntos` valido que no seleccione falsos positivos, pero no un positivo con puntos.
- Requiere QA publicado posterior despues de release/deploy del refinamiento.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff y decidir publicacion controlada del refinamiento UX, seguida por QA Web publicado.
