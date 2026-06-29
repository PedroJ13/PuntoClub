Equipo: QA
Tarea validada: TASK-549 - Validar correos operativos con mocks locales
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; pruebas unitarias API con mocks, script focal Node para estados de envio operativo, revision estatica de funciones API y Playwright/headless local con API mock Web. Sin Azure SQL, sin ACS real, sin envio de correos reales, sin commit, sin push y sin deploy.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-545-HANDOFF.md`, `tasks/TASK-546-HANDOFF.md`, `tasks/TASK-547-HANDOFF.md` y `tasks/TASK-548-HANDOFF.md`.
- Nota de contexto: no existe `tasks/TASK-549.md` ni `tasks/TASK-549-assignment.md`; se ejecuto el alcance indicado por el usuario.
- `npm test` en `api/`.
- `node --check` para:
  - `api/src/functions/operationalEmailSettings.js`;
  - `api/src/lib/operationalEmails.js`;
  - `api/src/lib/notifier.js`;
  - `app/src/customerApi.js`;
  - `app/src/app.js`.
- `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css`.
- `git diff --check -- api app database`.
- Script focal Node con repositorio/adaptador fake para:
  - envio mock exitoso;
  - envio mock fallido;
  - skip por setting apagado;
  - skip por cliente sin email;
  - skip por ACS/config no disponible.
- Revision estatica de triggers en:
  - `api/src/functions/customers.js`;
  - `api/src/functions/purchases.js`;
  - `api/src/functions/redemptions.js`.
- Playwright/headless local con `PUNTO_CLUB_USE_MOCK_API=true` para validar:
  - lectura de settings de correos operativos por empresa;
  - validacion de `reply-to`;
  - guardado mock de switches y `reply-to`;
  - promociones bloqueadas en `Mi empresa > Comunicaciones`;
  - `Enviar campañas` separado y con envio real bloqueado;
  - desktop `1366x900` y mobile `390x844`.

Hallazgos:
- API:
  - `npm test` pasa 141/141.
  - Plantillas operativas cubren bienvenida, compra y canje/redencion.
  - `sendOperationalEmailBestEffort` registra evento, mensaje e intento en escenarios success/fail/skipped.
  - Fallo del proveedor mock queda como `status="failed"` y no lanza excepcion hacia la operacion principal.
  - Skips quedan identificados por motivo: `disabled_by_company_settings`, `customer_without_email`, `not_configured` y `duplicate_event`.
- Registro de cliente:
  - `createCustomer` persiste cliente y auditoria antes de disparar correo `welcome`.
  - El correo usa `idempotencyKey` `welcome:customer:{customer.id}`.
  - Al fallar/skippear el correo, `sendOperationalEmailBestEffort` captura el resultado y la funcion puede devolver `created(customer)`.
- Compra:
  - `createPurchase` persiste compra antes de disparar correo `purchase`.
  - El correo usa snapshot de cliente, compra, balance y settings de empresa.
  - El correo usa `idempotencyKey` `purchase:{purchase.id}`.
  - Fallo de correo no revierte ni bloquea la compra.
- Canje/redencion:
  - `createRedemption` persiste canje antes de disparar correo `redemption`.
  - El correo usa snapshot de cliente, empresa y redencion.
  - El correo usa `idempotencyKey` `redemption:{redemption.id}`.
  - Fallo de correo no revierte ni bloquea el canje.
- Web local/mock:
  - `Mi empresa > Comunicaciones` carga settings iniciales mock: bienvenida, compra y canje activos, `replyToEmail=hola@cafecentral.test`.
  - `reply-to` invalido bloquea el guardado con error visible.
  - Guardado mock actualiza switches y `reply-to`.
  - Promociones/campanas siguen bloqueadas visualmente.
  - `Enviar campañas` sigue separado y `#communication-send-button` sigue deshabilitado.
  - No se detectaron errores de pagina en Playwright.

P0/P1:
- No se encontraron P0/P1 abiertos.

P2/P3:
- P3: `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css` reporta formato pendiente en `app/src/app.js` y `app/src/customerApi.js`. No bloquea la validacion funcional, pero debe corregirse si Prettier es gate de release.

Evidencia:
- `npm test` en `api/`: 141 tests OK.
- `node --check`: OK para API/Web modificados revisados.
- `git diff --check -- api app database`: OK; solo warnings LF/CRLF del entorno.
- `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css`:
  - warning `app/src/app.js`;
  - warning `app/src/customerApi.js`;
  - `Code style issues found in 2 files`.
- Script focal Node:
  - `purchase-success`: `status=sent`, `events=1`, `messages=1`, `attempts=1`.
  - `redemption-failed`: `status=failed`, `events=1`, `messages=1`, `attempts=1`.
  - `welcome-disabled`: `status=skipped`, `reason=disabled_by_company_settings`.
  - `welcome-no-email`: `status=skipped`, `reason=customer_without_email`.
  - `purchase-not-configured`: `status=skipped`, `reason=not_configured`.
- Playwright local desktop/mobile:
  - `settingsLoaded=true`;
  - `operationalPanelCopy=true`;
  - `operationalPromoLocked=true`;
  - `invalidReplyToBlocked=true`;
  - `settingsSaved=true`;
  - `campaignsSeparateAndBlocked=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.
- Mini-check adicional de `Comunicaciones > Configuración`:
  - `settingsPromoLocked=true`;
  - `sendStillDisabled=true`.
- Estado Git local:
  - cambios Web/API/SQL esperados de TASK-546/TASK-547/TASK-548;
  - `debug.log` sigue no trackeado y debe quedar fuera de commit/deploy.

Uso DB cloud: No. No se conecto a Azure SQL ni se uso DB real. No se uso ACS real ni se enviaron correos. Las pruebas usaron mocks/adaptadores locales y API mock del frontend.

Riesgos o pendientes:
- La migracion SQL `database/migrations/20260629_operational_emails.sql` no fue aplicada en Azure SQL; el uso real requiere tarea SQL/Infra aprobada.
- La API/Web no fueron publicados en esta validacion; queda pendiente ciclo de release y QA publicado cuando Product lo decida.
- Prettier pendiente en `app/src/app.js` y `app/src/customerApi.js`.
- No se valido envio real ACS ni entrega final; queda fuera de alcance por definicion de TASK-545.

Siguiente recomendado:
- Web Dev debe normalizar formato de `app/src/app.js` y `app/src/customerApi.js` si Prettier sera gate.
- Product / Architect / Release puede procesar TASK-549 como QA local aprobada con observacion P3.
- Antes de uso real: aplicar migracion SQL, publicar API/Web y ejecutar QA publicado controlado sin activar promociones.
