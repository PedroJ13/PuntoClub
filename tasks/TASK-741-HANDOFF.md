Equipo: QA
Tarea validada: TASK-741 - Validar anti-duplicado local de envio promocional
Ambiente: Local/mock en `http://127.0.0.1:4187/login`, app servida desde `app/` con `PUNTO_CLUB_USE_MOCK_API=true`. Fecha/hora QA: 2026-07-02 15:13:46 -06:00.
Resultado: aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md, tasks/TASK-739-HANDOFF.md y tasks/TASK-740-HANDOFF.md.
- Nota de contexto: `tasks/TASK-741.md` no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Revision focal:
  - `api/src/lib/repository.js`
  - `api/test/promotional-campaigns.test.js`
  - `app/src/customerApi.js`
  - `app/src/app.js`
- `node tmp/task741-qa.mjs`
- `node --test api/test/promotional-campaigns.test.js`
  - Resultado: 19 tests passed, 0 failed.
- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- `npx prettier --check api/src/lib/repository.js api/test/promotional-campaigns.test.js app/src/customerApi.js app/src/app.js`
- `git diff --check -- api/src/lib/repository.js api/test/promotional-campaigns.test.js app/src/customerApi.js app/src/app.js`

Hallazgos:
- Sin hallazgos P0/P1/P2/P3 en el alcance local validado.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno.

Evidencia:
- Smoke local Playwright con mock API:
  - Login mock correcto.
  - Modulo `Enviar campanas` cargado.
  - Campana mock inicial: `Promo clientes frecuentes - Promo especial para clientes frecuentes`.
- Primer intento controlado:
  - destinatario: `María Soto / maria@example.com`;
  - resultado: `Envío finalizado: 1 enviado, 0 fallidos y 0 omitidos.`;
  - resultado guardado: `Enviado: María Soto`;
  - no mostro `Destinatario ya incluido`.
- Segundo intento con la misma campana y el mismo cliente:
  - resultado visible en panel `Resultado`: `Destinatario ya incluido`;
  - copy visible: `Este cliente ya fue incluido en esta campaña. Para volver a enviarle una promoción, crea una nueva campaña o selecciona otra.`;
  - no mostro `Promotional recipient is already selected for this campaign.`;
  - no mostro `Envío finalizado`;
  - `communication-campaign-error` quedo vacio;
  - boton quedo operativo como `Enviar a 1`, sin quedarse en `Enviando...`;
  - campana y destinatario quedaron visibles.
- Flujo normal con cliente nuevo:
  - campana nueva mock: `QA741 normal 1783026815905`;
  - destinatario: `José Vega / jose@example.com`;
  - resultado: `Envío finalizado: 1 enviado, 0 fallidos y 0 omitidos.`;
  - resultado guardado: `Enviado: José Vega`;
  - no mostro texto tecnico ni bloqueo de duplicado.
- Cobertura API:
  - `promotional send blocks duplicate selected recipients before sending email` paso.
  - `promotional recipient duplicate SQL error maps to controlled conflict` paso.
- `git diff --check` solo reporto warnings LF/CRLF en archivos ya modificados, sin errores de whitespace.

Uso DB cloud: No

Riesgos o pendientes:
- Validacion fue local/mock. Queda pendiente publicacion y QA publicada focal para confirmar el mismo comportamiento contra API desplegada.
- No se enviaron correos reales ni se activo ACS.
- El script temporal de evidencia `tmp/task741-qa.mjs` fue creado solo para QA local.

Siguiente recomendado:
- Product/Release puede procesar este handoff como QA local aprobada y decidir publicacion/revalidacion publicada del anti-duplicado.
