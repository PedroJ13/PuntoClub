Equipo: QA
Tarea validada: TASK-858 - Validar sender separado operativo/promocional
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; API con mocks/tests locales. Validacion realizada el 2026-07-08 13:28:30 -06:00. Sin Azure SQL, sin ACS real y sin envio de correos reales.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de contexto minimo:
  - `AGENTS.md`.
  - `docs/README.md`.
  - `docs/MVP_RELEASE_STATUS.md`.
- Intento de lectura de proceso nuevo:
  - `docs/OPERATING_STATUS.md`: no existe en el workspace actual.
  - `docs/PROJECT_OPERATING_RULES.md`: no existe en el workspace actual.
- Intento de lectura de tarea:
  - `tasks/TASK-858.md`: no existe en el workspace actual; se valido contra la instruccion pegada por Product Owner.
- Lectura de dependencia:
  - `tasks/TASK-857-HANDOFF.md`.
- Revision focal read-only:
  - `api/src/lib/notifier.js`.
  - `api/src/functions/promotionalCampaigns.js`.
  - `api/src/lib/operationalEmails.js`.
  - `api/test/company-registration.test.js`.
  - `api/test/operational-emails.test.js`.
  - `api/test/promotional-campaigns.test.js`.
- Busqueda focal:
  - `rg -n "getPromotionalEmailConfig|PROMOTIONAL_EMAIL_SENDER|ACS_EMAIL_SENDER|campanas@mail|operaciones@mail|getEmailConfig\(" api\src api\test -S`.
- Sintaxis:
  - `node --check api\src\lib\notifier.js`: OK.
  - `node --check api\src\functions\promotionalCampaigns.js`: OK.
  - `node --check api\test\company-registration.test.js`: OK.
  - `node --check api\test\operational-emails.test.js`: OK.
  - `node --check api\test\promotional-campaigns.test.js`: OK.
- Tests:
  - `npm --prefix api test`: 186/186 OK.
- Formato:
  - `npx prettier --check api\src\lib\notifier.js api\src\functions\promotionalCampaigns.js api\test\company-registration.test.js api\test\operational-emails.test.js api\test\promotional-campaigns.test.js`: falla por estilo en 3 archivos.
- Limpieza diff:
  - `git diff --check`: OK, solo advertencias CRLF.

Hallazgos:
- Correos operativos:
  - `api/src/lib/operationalEmails.js` sigue usando `notifier.getEmailConfig(options.env || process.env)`.
  - `getEmailConfig` lee `ACS_EMAIL_SENDER_ADDRESS` y `ACS_EMAIL_SENDER_DISPLAY_NAME`.
  - Test `operational welcome email uses reply-to and customer recipient` confirma sender operativo `operaciones@mail.puntoclubcr.com` y display `Punto Club Operaciones`.
- Correos promocionales:
  - `api/src/functions/promotionalCampaigns.js` usa `notifier.getPromotionalEmailConfig()` antes de enviar campanas.
  - `getPromotionalEmailConfig` lee `PROMOTIONAL_EMAIL_SENDER_ADDRESS` y `PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME`.
  - Test de promocionales confirma sender `campanas@mail.puntoclubcr.com` y display `Punto Club Campañas`.
- Fallback seguro:
  - `getPromotionalEmailConfig` usa `senderAddress`/`senderDisplayName` promocionales si existen; si faltan, conserva el sender global.
  - Test `getPromotionalEmailConfig prefers promotional sender with global fallback` valida promocional y fallback a global.
- No se enviaron correos reales; todos los checks fueron locales con mocks/tests.

P0/P1:
- Ninguno abierto.

P2/P3:
- P2: `npx prettier --check` falla en `api/src/lib/notifier.js`, `api/test/company-registration.test.js` y `api/test/operational-emails.test.js`. La funcionalidad pasa tests, pero debe limpiarse antes de release/commit final.

Evidencia:
- `npm --prefix api test`: `# tests 186`, `# pass 186`, `# fail 0`.
- `api/src/lib/notifier.js`:
  - `getEmailConfig` usa `ACS_EMAIL_SENDER_ADDRESS` / `ACS_EMAIL_SENDER_DISPLAY_NAME`.
  - `getPromotionalEmailConfig` usa `PROMOTIONAL_EMAIL_SENDER_ADDRESS` / `PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME` con fallback global.
- `api/src/functions/promotionalCampaigns.js`: `sendPromotionalCampaign` usa `notifier.getPromotionalEmailConfig()`.
- `api/src/lib/operationalEmails.js`: operativos usan `notifier.getEmailConfig()`.
- `api/test/company-registration.test.js`: valida sender promocional y fallback.
- `api/test/operational-emails.test.js`: valida sender operativo.
- `api/test/promotional-campaigns.test.js`: valida sender promocional en correo de campana.

Uso DB cloud: No.

Riesgos o pendientes:
- El cambio esta validado localmente, pero aun requiere limpieza de formato antes de release.
- No se valido en Azure Functions ni ACS real; eso corresponde a la tarea publicada/Infra posterior.
- La activacion productiva aun depende de app settings separados:
  - `ACS_EMAIL_SENDER_ADDRESS=operaciones@mail.puntoclubcr.com`.
  - `ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Operaciones`.
  - `PROMOTIONAL_EMAIL_SENDER_ADDRESS=campanas@mail.puntoclubcr.com`.
  - `PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Campañas`.

Siguiente recomendado:
- Backend/API debe corregir formato Prettier en los 3 archivos reportados y luego Product/Release puede avanzar a publicacion controlada. Despues de deploy e Infra apply de app settings, reabrir QA publicada con envios controlados a destinatario autorizado.
