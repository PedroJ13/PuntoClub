Equipo: QA
Tarea validada: TASK-658 - Validar navegacion estable en Enviar campanas
Ambiente: Local/mock en navegador interno Codex, `http://127.0.0.1:4186/app`, servido desde `app/` con `PUNTO_CLUB_USE_MOCK_API=true`. Se uso usuario mock del repo `owner@mock.test` y harness temporal en memoria para ampliar destinatarios mock a 8. No se uso ambiente cloud, DB cloud ni ACS real.
Resultado: aprobado

Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md` y `tasks/TASK-657-HANDOFF.md`.
- Nota de proceso: `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md` no existen en este workspace al momento de la validacion.
- Nota de numeracion: este archivo tenia un handoff previo de SQL DEV para otra definicion de TASK-658 sobre imagen opcional de campana. Se actualiza segun la asignacion actual pegada por Product Owner: QA Local / Navegacion comunicaciones.
- Login local mock exitoso: empresa `Cafe Central`, usuario `owner@mock.test`, badge `Modo de prueba`.
- Estado previo al click lateral: modulo visible `operations`; comunicaciones oculto; URL `http://127.0.0.1:4186/app`.
- Click en menu lateral `Enviar campañas`: modulo visible cambia a `communications`; `operationsVisible=false`; subvista `send:Enviar campañas`; URL permanece `/app`.
- Tabs internas:
  - `Clientes`: mantiene `communications`, muestra panel `Seleccionar destinatarios`, no vuelve a `operations`.
  - `Historial`: mantiene `communications`, muestra panel `Historial local`, no vuelve a `operations`.
  - `Enviar campañas`: mantiene `communications`, muestra paneles `Enviar campañas`, `Preview` y `Seleccionar destinatarios`, no vuelve a `operations`.
- Filtros de destinatarios dentro de Enviar campañas:
  - `Suscritos`: mantiene `communications`, URL estable, 7 cards visibles.
  - `Bajas`: mantiene `communications`, URL estable, 1 card visible.
  - `No aptos`: mantiene `communications`, URL estable, empty state/lista sin cards.
  - `Todos`: mantiene `communications`, URL estable, 8 cards visibles.
- Botones de seleccion:
  - `Seleccionar elegibles`: mantiene `communications`, selecciona 5 de 5, habilita `Enviar a 5`, no dispara envio.
  - `Con puntos`: mantiene `communications`, conserva 5 de 5, no dispara envio.
  - `Limpiar selección`: mantiene `communications`, vuelve a `0 seleccionados de 5`, oculta panel de resultado, deshabilita envio.
- Repeticion de navegacion `Clientes` -> `Enviar campañas` -> `Historial` -> `Enviar campañas`: mantiene siempre `communications`, URL estable `/app`, sin rebote a `Atender cliente`.
- Consola navegador: sin errores ni warnings capturados durante la prueba.
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check -- app\src\app.js app\index.html app\styles.css`

Hallazgos:
- Sin hallazgos P0/P1/P2/P3 abiertos.
- Observacion no bloqueante: `git diff --check` paso sin errores, pero Git reporto warning de conversion LF/CRLF en `app/src/app.js`.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- Fecha/hora local QA: 2026-07-01 20:00:23 -06:00.
- Antes del click lateral: `activeSections=["operations"]`, `communicationsVisible=false`, `operationsVisible=true`.
- Despues del click lateral `Enviar campañas`: `activeSections=["communications"]`, `communicationsVisible=true`, `operationsVisible=false`, `selectedCommunicationView=["send:Enviar campañas"]`, URL `/app`.
- Tabs internas: `customers:Clientes`, `history:Historial` y `send:Enviar campañas` mantuvieron `activeSections=["communications"]`.
- Filtros y botones: todas las acciones conservaron URL `http://127.0.0.1:4186/app` y `operationsVisible=false`.
- No se hizo click en el boton final `Enviar a 5`; no hubo dialogo de confirmacion ni envio simulado/real.

Uso DB cloud: No.

Riesgos o pendientes:
- La validacion fue local/mock; no valida la URL publicada.
- No se probaron sesiones vencidas en esta tarea; el alcance pedido fue sesion local/mock activa y navegacion estable.
- Existe colision historica de numeracion TASK-658 con un handoff previo de SQL DEV sobre imagen opcional de campana; Product / Architect / Release deberia reconciliarlo si necesita conservar ambos registros.

Siguiente recomendado:
- Procesar TASK-658 como QA local aprobado.
- Si estos cambios se publican, crear QA web focal para repetir la secuencia en `puntoclubcr.com` con sesion controlada, sin ejecutar envios reales.
