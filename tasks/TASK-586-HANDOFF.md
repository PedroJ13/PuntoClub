Equipo: QA
Tarea validada: TASK-586 - Validar envio real promocional controlado en local sin correos reales
Ambiente: Local/mock. API con tests unitarios/mocks en `api/`; Web servida localmente en servidor efimero `127.0.0.1` con `PUNTO_CLUB_USE_MOCK_API=true` inyectado en memoria. Sin Azure SQL, sin ACS real, sin correos reales.
Resultado: aprobado
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`, `docs/AZURE_SQL_COST_GUARDRAILS.md`.
- `codex-project-templates/CHAT_MODEL.md` y `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`: no existen en este workspace.
- `tasks/TASK-586.md` / `tasks/TASK-586-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- Lectura de handoffs previos `TASK-583`, `TASK-584`, `TASK-585`.
- `node --check` en `api/src/functions/promotionalCampaigns.js`, `api/src/lib/repository.js`, `api/src/lib/validators.js`, `api/test/promotional-campaigns.test.js`, `app/src/app.js`, `app/src/customerApi.js` -> OK.
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/src/lib/validators.js api/test/promotional-campaigns.test.js app/index.html app/src/app.js app/src/customerApi.js` -> OK.
- `node --test test/promotional-campaigns.test.js test/errors.test.js` en `api/` -> 21/21 OK.
- `npm test` en `api/` -> 154/154 OK.
- Smoke ad hoc local/mock del helper `sendPromotionalCampaignToRecipients` con proveedor mock fallando -> summary `selected=1`, `sent=0`, `failed=1`, `skipped=0`, resultado persistido como `failed`.
- Smoke Web local/mock: login mock, abrir `Enviar campanas`, verificar boton inicial deshabilitado, seleccionar destinatarios elegibles, guardar, confirmar envio, validar resumen e historial.
Hallazgos:
- Sin sesion: cubierto por test `promotional endpoints require an authenticated company session` -> rechazo `401`.
- Empresa distinta: cubierto por test `promotional endpoints reject route company different from session company` -> rechazo `403 FORBIDDEN`.
- Sin `confirmSend`: cubierto por test `promotional send requires explicit confirmation payload` -> `VALIDATION_ERROR`.
- Solo destinatarios seleccionados: cubierto por test `promotional send skips unsubscribed recipients and sends selected subscribed recipients`; el mock ACS recibe solo `ana@example.com` y no envia al destinatario dado de baja.
- Bajas promocionales: cubierto por test de skip `unsubscribed` y por helper `getPromotionalRecipientSkipReason`; bajas/suppressed o correo faltante quedan `skipped`.
- Limite MVP de 5: cubierto por validador `promotional recipient selection enforces five-recipient MVP limit`; Web local muestra contador `2 seleccionados de 5` con los destinatarios mock disponibles.
- Registro `sent/failed/skipped`: tests cubren `sent` y `skipped`; smoke ad hoc QA cubrio `failed` con proveedor mock fallando.
- Web local muestra confirmacion previa explicita: `No se enviara a clientes no seleccionados ni dados de baja`.
- Web local muestra resultado correcto: `Envio finalizado: 2 enviados, 0 fallidos y 0 omitidos.` e historial con estado `Enviado`.
- No se uso ACS real ni se enviaron correos reales.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existen `tasks/TASK-586.md` ni `tasks/TASK-586-assignment.md`.
- P3 documental/proceso: no existen `codex-project-templates/CHAT_MODEL.md` ni `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`.
- P3 cobertura futura: el smoke Web local valida resumen exitoso; ramas visuales de `failed/skipped` quedan cubiertas por logica/API mock y etiquetas de UI, pero no por un e2e Web dedicado.
Evidencia:
- Focal API: 21 tests, 21 pass.
- API completo: 154 tests, 154 pass.
- Prettier: `All matched files use Prettier code style!`.
- Smoke failed mock: `{ selected: 1, sent: 0, failed: 1, skipped: 0 }`, resultado guardado con `status=failed` y `lastError=mock_provider_down`.
- Smoke Web mock: `eligibleRecipients=2`, `initialSendText=Enviar campaña`, `selectedText=2 seleccionados de 5`, `sendText=Enviar a 2`, status `Envio finalizado: 2 enviados, 0 fallidos y 0 omitidos.`, confirmacion previa con texto de no enviar a no seleccionados ni dados de baja, historial con `Enviado`.
Uso DB cloud: No. No se uso Azure SQL ni ambiente cloud; toda la validacion fue local/mock/tests.
Riesgos o pendientes:
- Falta QA publicado antes de habilitar prueba real de Product Owner.
- Mantener ACS real y `PROMOTIONAL_EMAIL_SEND_ENABLED=true` fuera de QA local salvo autorizacion explicita de Product / Release.
- Si se quiere evidencia visual dedicada de ramas `failed/skipped`, conviene agregar un mock Web controlable por escenario en una tarea futura.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff y decidir tarea de QA publicado/controlado o prueba PO real con destinatarios autorizados.
