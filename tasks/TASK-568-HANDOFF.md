Equipo: QA
Tarea validada: TASK-568 - Revalidar baja promocional end-to-end local
Ambiente: Local Web/mock en `http://127.0.0.1:4188/` con `app-config.js` servido temporalmente en memoria (`PUNTO_CLUB_USE_MOCK_API=true`, sin modificar archivos); navegador in-app desktop y smoke mobile 390x844; API tests locales.
Resultado: aprobado con observaciones
Checks ejecutados:
- Lectura de `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`, `codex-project-templates/QA.md` y handoff previo `tasks/TASK-567-HANDOFF.md`.
- `npx prettier --check app/src/customerApi.js app/src/app.js app/styles.css app/index.html api/src/functions/promotionalCampaigns.js api/src/lib/validators.js api/test/promotional-campaigns.test.js` -> OK.
- `node --check app/src/customerApi.js`, `node --check app/src/app.js`, `node --check api/src/functions/promotionalCampaigns.js`, `node --check api/src/lib/validators.js` -> OK.
- `node --test test/promotional-campaigns.test.js` en `api/` -> 4/4 tests OK.
- `npm test` en `api/` -> 145/145 tests OK.
- Validacion funcional directa del mock: crear campana QA, seleccionar clientes `10` y `11`, registrar baja promocional del cliente `10`, confirmar exclusion de suscritos/elegibles, removerlo de destinatarios pendientes, mantener preview y bloqueo de envio real.
- Validacion UI local: login mock, navegacion a `Enviar campanas`, vista `Clientes`, accion visible `Dar de baja`, baja del cliente `10`, vista `Bajas`, seleccion del cliente elegible restante, preview y historial local.
- Smoke mobile 390x844: Comunicaciones visible, subnav visible, sin overflow horizontal y boton `Envio real bloqueado` deshabilitado.
Hallazgos:
- La baja promocional end-to-end local queda validada desde Web/mock: cliente dado de baja deja de aparecer como suscrito/elegible, queda en vista `Bajas` como `Baja promocional`, no conserva accion duplicada `Dar de baja`, y no bloquea seleccion/preview/historial del destinatario elegible restante.
- El envio real permanece bloqueado en UI y mock (`PROMOTIONAL_SEND_BLOCKED` / boton `Envio real bloqueado` deshabilitado).
P0/P1:
- Ninguno abierto.
P2/P3:
- P3 documental: no existe `tasks/TASK-568.md` en el workspace; se valido con el alcance pegado por el usuario y el handoff previo `tasks/TASK-567-HANDOFF.md`.
- P3 documental: no existen `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md`, `codex-project-templates/CHAT_MODEL.md` ni `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md` en este workspace. No afecta el resultado funcional de QA.
Evidencia:
- Mock directo: antes de baja, suscritos/elegibles `10` y `11`; seleccion inicial `10`,`11`; baja de `10` responde `promotionalStatus=unsubscribed`; despues de baja solo `11` queda suscrito/elegible; destinatarios pendientes quedan solo `11`; preview mantiene puntos/footer de baja; envio real falla controladamente con `PROMOTIONAL_SEND_BLOCKED`.
- UI local desktop: panel `Clientes` mostro botones `Dar de baja` para `10` y `11`; al dar de baja `10`, desaparece el boton de `10`, queda visible solo `11`, aparece copy de baja y la vista `Bajas` muestra a Maria Soto con estado `Baja promocional`.
- Seleccion/historial: se selecciono y guardo el destinatario elegible restante; contador `1 seleccionado de 5`; historial local muestra `2026-06-30 Promo clientes frecuentes jose@example.com Pendiente`.
- Preview/envio: preview contiene `Puntos disponibles` y footer de baja promocional sin perder puntos/beneficios; boton de envio real permanece deshabilitado con texto `Envio real bloqueado`.
- Responsive: viewport 390x844 sin overflow horizontal; subnav de Comunicaciones visible; envio real sigue bloqueado.
Uso DB cloud: No. No se uso Azure SQL, API publicada ni ambiente cloud; toda la validacion fue local/mock y tests locales.
Riesgos o pendientes:
- La publicacion real queda fuera de alcance de TASK-568; requiere tarea QA web/publicada posterior.
- La baja real publicada depende de endpoint/API, migracion SQL y feature flags del ambiente publicado.
- Mantener envio promocional real bloqueado hasta aprobacion explicita de Product Owner, dominio/bajas/cuotas listas y tarea especifica.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff y decidir siguiente paso: publicar el paquete de promociones o crear QA publicado especifico.
