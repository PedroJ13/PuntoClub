Equipo: QA
Tarea validada: TASK-653 - Validar ajustes UX destinatarios y tabs Enviar campanas
Ambiente: Local/mock en navegador interno Codex, `http://127.0.0.1:4185/app`, servido desde `app/` con `PUNTO_CLUB_USE_MOCK_API=true`. Se uso usuario mock del repo `owner@mock.test` y harness temporal en memoria para ampliar destinatarios mock a 8. No se uso ambiente cloud ni ACS real.
Resultado: aprobado

Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md` y `tasks/TASK-652-HANDOFF.md`.
- Nota de proceso: `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md` no existen en este workspace al momento de la validacion.
- Confirmado que no existe `tasks/TASK-653.md`; se valido con la asignacion pegada por Product Owner y el handoff previo TASK-652.
- Login local mock exitoso: empresa `Cafe Central`, usuario `owner@mock.test`, badge `Modo de prueba`.
- Tabs en Comunicaciones: subnav muestra solo `Enviar campañas`, `Clientes` e `Historial`; no existe tab `Configuración` ni `data-communication-view="settings"`.
- Panel `Configuración` de Comunicaciones queda oculto (`hidden=true`, `display=none`) al navegar por Enviar campañas/Clientes/Historial.
- Seleccion inicial: 8 destinatarios mock visibles, 1 baja promocional visible y deshabilitada, `0 seleccionados de 5`.
- `Seleccionar elegibles`: selecciona 5 de 5, no marca baja promocional, habilita `Enviar a 5` y muestra mensaje `5 destinatarios seleccionados para este envío.`.
- `Limpiar selección`: desmarca todo, vuelve a `0 seleccionados de 5`, deshabilita envío, oculta `#communication-result-panel`, oculta `#communication-campaign-status` y limpia texto de estado/error.
- Busqueda destinatarios:
  - Por nombre `laura`: muestra solo `Laura Campos`.
  - Por correo `carlos.qa@example.com`: muestra solo `Carlos Rojas`.
  - Sin coincidencias: muestra `No hay destinatarios para este filtro.`.
  - Baja `ana`: muestra `Ana Baja QA` deshabilitada y no seleccionable.
- Seleccion manual con busqueda:
  - Buscar `diego` y marcar `Diego Solis` deja `1 seleccionado de 5`.
  - Buscar `valeria` conserva el conteo aunque Diego quede oculto, permite marcar `Valeria Ruiz` y deja `2 seleccionados de 5`.
  - Limpiar busqueda restaura los 8 destinatarios y mantiene marcados `Diego Solis` y `Valeria Ruiz`.
- Limite de 5 despues de interacciones manuales: `Seleccionar elegibles` vuelve a `5 seleccionados de 5`, con 3 checkboxes no seleccionados/deshabilitados y baja promocional no marcada.
- Smoke responsive mobile 390x844: sin overflow horizontal; subnav conserva solo 3 tabs; buscador de destinatarios mantiene ancho dentro del viewport.
- Consola navegador: sin errores ni warnings capturados durante la prueba.
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check -- app\index.html app\src\app.js app\styles.css`

Hallazgos:
- Sin hallazgos P0/P1/P2/P3 abiertos.
- Observacion no bloqueante: `git diff --check` paso sin errores, pero Git reporto warnings de conversion LF/CRLF en `app/index.html`, `app/src/app.js` y `app/styles.css`.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- Fecha/hora local QA: 2026-07-01 17:19:42 -06:00.
- Tabs observados: `Enviar campañas`, `Clientes`, `Historial`; `settingsTabCount=0`.
- Estado tras limpiar seleccion: `checked=0`, `resultPanelHidden=true`, `statusHidden=true`, `statusText=""`, `sendText="Enviar campaña"`.
- Busqueda: `laura` => `Laura Campos`; `carlos.qa@example.com` => `Carlos Rojas`; `sin-coincidencia` => empty state correcto; `ana` => `Ana Baja QA` deshabilitada.
- Seleccion manual preservada al limpiar busqueda: `Diego Solis` y `Valeria Ruiz` marcados, `2 seleccionados de 5`.
- Limite preservado: seleccion rapida termina en `5 seleccionados de 5`, sin marcar baja promocional.

Uso DB cloud: No.

Riesgos o pendientes:
- La validacion fue local/mock; no valida publicacion ni datos reales.
- No se ejecutaron envios reales ni simulados de correo en esta tarea, por alcance del Product Owner.

Siguiente recomendado:
- Procesar TASK-653 como QA local aprobado y crear tarea separada de QA publicado si Product / Release decide publicar estos ajustes.
