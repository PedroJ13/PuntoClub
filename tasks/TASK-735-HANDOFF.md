Equipo: QA
Tarea validada: TASK-735 - Validar mensaje de duplicado en envio promocional
Ambiente: Local/mock en `http://127.0.0.1:4186/login`, app servida desde `app/` con `PUNTO_CLUB_USE_MOCK_API=true`. Fecha/hora QA: 2026-07-02 14:45:03 -06:00.
Resultado: aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md, tasks/TASK-733-HANDOFF.md y tasks/TASK-734-HANDOFF.md.
- Nota de contexto: `tasks/TASK-735.md` no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Revision focal:
  - `app/src/app.js`
  - `api/src/lib/errors.js`
  - `api/test/promotional-campaigns.test.js`
- `node tmp/task735-qa.mjs`
- `node --check app/src/app.js`
- `node --test api/test/promotional-campaigns.test.js`
  - Resultado: 18 tests passed, 0 failed.
- `npx prettier --check app/src/app.js`
- `git diff --check -- app/src/app.js`

Hallazgos:
- Sin hallazgos P0/P1/P2/P3 en el alcance validado.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno.

Evidencia:
- Smoke local Playwright con mock API y stub controlado de error:
  - Login mock correcto.
  - Modulo `Enviar campanas` cargado.
  - Campana mock `Promo clientes frecuentes` seleccionada.
  - Destinatario elegible `Maria Soto / maria@example.com` seleccionado.
  - Se simulo respuesta cliente real con `ApiError("PROMOTIONAL_RECIPIENT_ALREADY_SELECTED", "Promotional recipient is already selected for this campaign.")`.
- Resultado visual del duplicado:
  - Panel `Resultado` visible.
  - Titulo mostrado: `Destinatario ya incluido`.
  - Mensaje mostrado: `Este cliente ya fue incluido en esta campaña. Para volver a enviarle una promoción, crea una nueva campaña o selecciona otra.`
  - No aparece el texto tecnico `Promotional recipient is already selected for this campaign.`
  - `communication-campaign-error` queda vacio.
  - Boton sale de estado `Enviando...` y queda operativo como `Enviar a 1`.
  - Campana y destinatario se mantienen visibles.
- Bloqueo anti-duplicado vigente:
  - `node --test api/test/promotional-campaigns.test.js` incluye y paso `promotional recipient duplicate SQL error maps to controlled conflict`.
  - Ese test confirma el mapeo backend a `PROMOTIONAL_RECIPIENT_ALREADY_SELECTED` sin relajar la restriccion.
- Flujo normal con destinatario nuevo:
  - Luego de restaurar el mock API, el envio mock finalizo con `Envío finalizado: 1 enviado, 0 fallidos y 0 omitidos.`
  - Resultado guardado para `Maria Soto`.
  - No se ejecuto ACS ni envio real.
- `git diff --check -- app/src/app.js` solo reporto warning LF/CRLF, sin errores de whitespace.

Uso DB cloud: No

Riesgos o pendientes:
- La reproduccion del duplicado en UI local se hizo con stub controlado porque el mock local no reproduce por si solo el 409 real de backend; la regla backend se valido con test API local.
- Falta QA publicada si Product/Release decide publicar el ajuste de TASK-734.
- No se enviaron correos reales ni se activo ACS.

Siguiente recomendado:
- Product/Release puede procesar este handoff como QA local aprobada y decidir publicacion/revalidacion publicada focal del copy anti-duplicado.
