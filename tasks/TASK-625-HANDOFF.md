Equipo: QA
Tarea validada: TASK-625 - Validar UX local de resultado de envio promocional
Ambiente: Local mock controlado en navegador interno, servido desde `app/` con `PUNTO_CLUB_USE_MOCK_API=true`. Sesion mock `owner@mock.test` / empresa `Cafe Central`. No se uso API publicada, Azure SQL ni ACS real.
Resultado: aprobado con observaciones
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`.
- `tasks/TASK-625.md`: no existe en workspace; se uso el alcance pegado por el Product Owner.
- Lectura de `tasks/TASK-623-HANDOFF.md`.
- Revisión focal de `app/src/app.js` y `app/src/customerApi.js` para entender el flujo de envio/promociones y mock local.
- Servidor local efimero en memoria para servir `app/` con override de `app-config.js` a mock; sin editar archivos.
- Login local con usuario mock del repo.
- Navegacion a `Enviar campanas`.
- Seleccion de destinatarios elegibles en mock.
- Confirmacion de envio solo contra mock local; no se ejecuto envio real ni se llamo ACS.
- Validacion de resultado visible/persistente despues de respuesta mock.
- Validacion de foco/scroll en error de API/mock con borrador invalido.
- `node --check app\src\app.js`.
- `node --check app\src\customerApi.js`.
- `git diff --check -- app\index.html app\src\app.js app\styles.css`.
Hallazgos:
- El ambiente local quedo en `Modo de prueba`, sin trafico a API real.
- Despues de confirmar envio mock, la UI muestra un bloque visible en `#communication-campaign-status`.
- El resumen persistente muestra: `Envio finalizado: 2 enviados, 0 fallidos y 0 omitidos`.
- El bloque incluye lista de detalle por destinatario con `Enviado: Maria Soto` y `Enviado: Jose Vega`.
- El foco queda en `#communication-campaign-status` despues del resultado exitoso.
- El resultado permanece visible al cambiar de vista de Comunicaciones y volver a `Enviar`.
- La seleccion se limpia despues del envio mock: `0 seleccionados de 5` y el boton vuelve a `Enviar campana`.
- Caso negativo con borrador invalido en mock: el error `Revisa los campos marcados de la campana.` queda visible, dentro del viewport y con foco en `#communication-campaign-error`.
- No se observaron secretos ni datos reales en el flujo local.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3: el mock local disponible genero solo destinatarios `sent`; se valido visualmente que el resumen incluye contadores de fallidos y omitidos en 0, pero no se observo una lista real con destinatarios `failed` o `skipped`.
- P3 documental: no existe archivo local `tasks/TASK-625.md`; se uso el alcance del chat.
Evidencia:
- Ambiente: `http://127.0.0.1:4181/app`, indicador `Modo de prueba`, empresa `Cafe Central`.
- Resultado exitoso mock: `Envio finalizado: 2 enviados, 0 fallidos y 0 omitidos. Resultado guardado para los destinatarios seleccionados. Enviado: Maria Soto Enviado: Jose Vega`.
- Foco exitoso: `activeElementId=communication-campaign-status`.
- Persistencia: al cambiar de vista y volver, `#communication-campaign-status` seguia visible con lista `.communication-send-results` de 2 items.
- Error API/mock: `activeElementId=communication-campaign-error`, mensaje visible en viewport, `statusHidden=true`.
- Verificacion tecnica: `node --check` OK para `app/src/app.js` y `app/src/customerApi.js`; `git diff --check` OK con warnings LF/CRLF no bloqueantes.
Uso DB cloud: No. La validacion fue local/mock; no se consulto Azure SQL ni se uso API publicada.
Riesgos o pendientes:
- Si Product quiere evidencia visual con destinatarios `failed` y `skipped` no-cero, se requiere ampliar el mock/control de QA o exponer un fixture local que devuelva esos estados sin ACS real.
- La prueba de envio real queda fuera de alcance; el Product Owner indico que esos envios los ejecuta por fuera o solo a destinatario autorizado.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff. Si se requiere cobertura visual de fallidos/omitidos no-cero, abrir tarea pequena para fixture/mock local de resultado mixto antes de QA publicado.
