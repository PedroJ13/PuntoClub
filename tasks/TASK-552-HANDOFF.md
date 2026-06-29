Equipo: QA
Tarea validada: TASK-552 - Revalidar formato y smoke local de correos operativos
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; validacion de formato, sintaxis, suite API, script focal Node y Playwright/headless local con API mock Web. Sin Azure SQL, sin ACS real, sin envio de correos reales, sin commit, sin push y sin deploy.
Resultado: aprobado

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-549-HANDOFF.md`, `tasks/TASK-550-HANDOFF.md` y `tasks/TASK-551-HANDOFF.md`.
- Nota de contexto: no existe `tasks/TASK-552.md` ni `tasks/TASK-552-assignment.md`; se ejecuto el alcance indicado por el usuario.
- `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css`.
- `node --check` para:
  - `api/src/functions/operationalEmailSettings.js`;
  - `api/src/lib/operationalEmails.js`;
  - `api/src/lib/notifier.js`;
  - `app/src/customerApi.js`;
  - `app/src/app.js`.
- `git diff --check -- api app database`.
- `npm test` en `api/`.
- Script focal Node con repositorio/adaptador fake para success/fail/skipped de correos operativos.
- Playwright/headless local desktop `1366x900` y mobile `390x844` con `PUNTO_CLUB_USE_MOCK_API=true`, validando:
  - settings de correos operativos por empresa;
  - validacion de `reply-to`;
  - guardado mock de switches y `reply-to`;
  - promociones bloqueadas en `Mi empresa > Comunicaciones`;
  - `Comunicaciones > Configuración` con campañas promocionales bloqueadas;
  - boton de envio real deshabilitado.

Hallazgos:
- Prettier queda limpio para `app/index.html`, `app/src/app.js`, `app/src/customerApi.js` y `app/styles.css`.
- `node --check` pasa para API/Web revisados.
- `npm test` en `api/` pasa 141/141.
- `git diff --check` no reporta errores de whitespace; solo warnings LF/CRLF del entorno.
- Script focal confirma:
  - `purchase-success`: correo operativo mock queda `sent`;
  - `redemption-failed`: fallo mock queda `failed` sin lanzar hacia la operacion principal;
  - `welcome-disabled`: queda `skipped` por setting apagado;
  - `welcome-no-email`: queda `skipped` por cliente sin email;
  - `purchase-not-configured`: queda `skipped` por email/ACS no configurado.
- UI local/mock:
  - carga settings iniciales de correos operativos por empresa;
  - bloquea `reply-to` invalido;
  - guarda switches y `reply-to` en mock;
  - promociones/campanas siguen bloqueadas visualmente;
  - envio real sigue deshabilitado;
  - sin errores de pagina en desktop/mobile.

P0/P1:
- No se encontraron P0/P1 abiertos.

P2/P3:
- No se encontraron P2/P3 abiertos en el alcance revalidado.

Evidencia:
- Prettier:
  - `All matched files use Prettier code style!`
- `node --check`: OK para archivos API/Web revisados.
- `npm test` en `api/`:
  - `# tests 141`;
  - `# pass 141`;
  - `# fail 0`.
- Script focal Node:
  - `purchase-success`: `status=sent`, `events=1`, `messages=1`, `attempts=1`;
  - `redemption-failed`: `status=failed`, `events=1`, `messages=1`, `attempts=1`;
  - `welcome-disabled`: `status=skipped`, `reason=disabled_by_company_settings`;
  - `welcome-no-email`: `status=skipped`, `reason=customer_without_email`;
  - `purchase-not-configured`: `status=skipped`, `reason=not_configured`.
- Playwright local desktop `1366x900`:
  - `settingsLoaded=true`;
  - `operationalPanelCopy=true`;
  - `operationalPromoLocked=true`;
  - `invalidReplyToBlocked=true`;
  - `settingsSaved=true`;
  - `settingsPromoLocked=true`;
  - `sendStillDisabled=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.
- Playwright local mobile `390x844`:
  - `settingsLoaded=true`;
  - `operationalPanelCopy=true`;
  - `operationalPromoLocked=true`;
  - `invalidReplyToBlocked=true`;
  - `settingsSaved=true`;
  - `settingsPromoLocked=true`;
  - `sendStillDisabled=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.
- Estado Git local:
  - cambios Web/API/SQL esperados del paquete de correos operativos;
  - `debug.log` sigue no trackeado y debe quedar fuera de commit/deploy.

Uso DB cloud: No. No se conecto a Azure SQL ni se uso DB real durante esta QA. TASK-550 ya habia aplicado la migracion con otro rol; esta revalidacion uso mocks locales y no envio correos reales.

Riesgos o pendientes:
- Aunque la migracion SQL ya fue aplicada en TASK-550, esta QA no valida ambiente publicado ni ACS real.
- Pendiente ciclo de release API/Web y QA publicado controlado antes de uso real.
- `debug.log` debe permanecer fuera de commit/deploy.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-552 como QA local aprobada.
- Si se decide publicar, ejecutar release API/Web y crear QA publicado de correos operativos con alcance controlado y sin promociones.
