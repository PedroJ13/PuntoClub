Equipo: QA
Tarea validada: TASK-597 - Validar nuevo flujo local de campanas y destinatarios al enviar
Ambiente: Local/mock. API con tests locales en `api/`; Web servida en servidor efimero `127.0.0.1` con `PUNTO_CLUB_USE_MOCK_API=true` inyectado en memoria. Sin Azure SQL, sin ACS real, sin correos reales.
Resultado: aprobado
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`, `docs/AZURE_SQL_COST_GUARDRAILS.md`.
- `tasks/TASK-597.md` / `tasks/TASK-597-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- Lectura de handoffs previos `TASK-594`, `TASK-595`, `TASK-596`.
- `node --check` en `app/src/app.js`, `app/src/customerApi.js`, `api/src/functions/promotionalCampaigns.js`, `api/src/lib/validators.js`, `api/test/promotional-campaigns.test.js` -> OK.
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/src/lib/validators.js api/test/promotional-campaigns.test.js app/index.html app/src/app.js app/src/customerApi.js app/styles.css` -> OK.
- `node --test test/promotional-campaigns.test.js test/errors.test.js` en `api/` -> 21/21 OK.
- `npm test` en `api/` -> 154/154 OK.
- Smoke Web local/mock con login mock, compra local a `Jose Vega` para generar puntos, creacion de campana nueva, baja promocional de un cliente desde el flujo de campanas, seleccion rapida, limpiar seleccion y envio mock.
Hallazgos:
- Guardar campana agrega la plantilla a `Campanas guardadas` y no guarda destinatarios: contador queda `0 seleccionados de 5` y el historial de destinatarios no cambia.
- El flujo permite elegir/preparar una campana guardada y seleccionar destinatarios al momento de enviar.
- `Seleccionar elegibles` marca solo clientes elegibles; no marca el cliente dado de baja ni checkboxes deshabilitados.
- `Con puntos` marca solo clientes elegibles con puntos disponibles; en el smoke selecciono `Jose Vega` despues de registrar compra mock.
- `Limpiar seleccion` desmarca todos los checks y vuelve a `0 seleccionados de 5`.
- Los dados de baja quedan visibles en la lista y con checkbox deshabilitado.
- El boton de envio usa la seleccion actual: `Enviar a 1`; confirmacion previa aclara que no se envia a no seleccionados ni dados de baja.
- El envio mock finaliza con `Envio finalizado: 1 enviado, 0 fallidos y 0 omitidos.` e historial muestra estado `Enviado`.
- No se enviaron correos reales.
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existen `tasks/TASK-597.md` ni `tasks/TASK-597-assignment.md`.
Evidencia:
- Prettier: `All matched files use Prettier code style!`.
- Tests focales API: 21/21 OK.
- Suite API completa: 154/154 OK.
- Smoke Web mock:
  - `initialCampaignCount=1`, `campaignCountAfterSave=2`.
  - `selectedAfterSave=0 seleccionados de 5`.
  - `disabledVisible=1` despues de baja promocional.
  - `countAfterAll=1 seleccionado de 5`.
  - `countAfterClear=0 seleccionados de 5`.
  - `countAfterPoints=1 seleccionado de 5`.
  - `sendTextBefore=Enviar a 1`.
  - `finalStatus=Envio finalizado: 1 enviado, 0 fallidos y 0 omitidos.`
  - Confirmacion: no se enviara a clientes no seleccionados ni dados de baja.
Uso DB cloud: No. No se uso Azure SQL ni ambiente cloud; toda la validacion fue local/mock/tests.
Riesgos o pendientes:
- Requiere QA publicado despues de deploy antes de usar el flujo en `puntoclubcr.com`.
- Mantener ACS real fuera de QA local y no ejecutar envios reales sin autorizacion explicita de Product / Release.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff y decidir publicacion controlada o QA web posterior del nuevo flujo.
