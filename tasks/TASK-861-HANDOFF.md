Equipo: QA
Tarea validada: TASK-861 - Revalidar sender separado despues de limpieza de formato
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; API con mocks/tests locales. Validacion realizada el 2026-07-08 14:38:15 -06:00. Sin Azure SQL, sin ACS real y sin envio de correos reales.
Resultado: aprobado

Checks ejecutados:
- Lectura de contexto minimo:
  - `AGENTS.md`.
  - `docs/README.md`.
  - `docs/MVP_RELEASE_STATUS.md`.
- Intento de lectura de proceso nuevo:
  - `docs/OPERATING_STATUS.md`: no existe en el workspace actual.
  - `docs/PROJECT_OPERATING_RULES.md`: no existe en el workspace actual.
- Intento de lectura de tarea:
  - `tasks/TASK-861.md`: no existe en el workspace actual; se valido contra la instruccion pegada por Product Owner.
- Lectura de dependencia:
  - `tasks/TASK-860-HANDOFF.md`.
- Revision focal read-only:
  - `api/src/lib/notifier.js`.
  - `api/src/functions/promotionalCampaigns.js`.
  - `api/src/lib/operationalEmails.js`.
  - `api/test/company-registration.test.js`.
  - `api/test/operational-emails.test.js`.
  - `api/test/promotional-campaigns.test.js`.
- Busqueda focal:
  - `rg -n "getPromotionalEmailConfig|PROMOTIONAL_EMAIL_SENDER|ACS_EMAIL_SENDER|campanas@mail|operaciones@mail|getEmailConfig\(" api\src api\test -S`.
- Formato:
  - `npx prettier --check api\src\lib\notifier.js api\src\functions\promotionalCampaigns.js api\test\company-registration.test.js api\test\operational-emails.test.js api\test\promotional-campaigns.test.js`: OK.
- Sintaxis:
  - `node --check api\src\lib\notifier.js`: OK.
  - `node --check api\src\functions\promotionalCampaigns.js`: OK.
  - `node --check api\test\company-registration.test.js`: OK.
  - `node --check api\test\operational-emails.test.js`: OK.
  - `node --check api\test\promotional-campaigns.test.js`: OK.
- Tests:
  - `npm --prefix api test`: 186/186 OK.
- Limpieza diff:
  - `git diff --check`: OK, solo advertencias CRLF del entorno.

Hallazgos:
- El P2 de TASK-858 queda cerrado: Prettier pasa en los archivos focales.
- Correos operativos siguen usando el sender global:
  - `api/src/lib/operationalEmails.js` usa `notifier.getEmailConfig(options.env || process.env)`.
  - `getEmailConfig` lee `ACS_EMAIL_SENDER_ADDRESS` y `ACS_EMAIL_SENDER_DISPLAY_NAME`.
  - Test operativo conserva verificacion de `operaciones@mail.puntoclubcr.com` y `Punto Club Operaciones`.
- Correos promocionales siguen usando sender promocional separado:
  - `api/src/functions/promotionalCampaigns.js` usa `notifier.getPromotionalEmailConfig()`.
  - `getPromotionalEmailConfig` lee `PROMOTIONAL_EMAIL_SENDER_ADDRESS` y `PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME`.
  - Test promocional conserva verificacion de `campanas@mail.puntoclubcr.com` y `Punto Club Campañas`.
- Fallback promocional al sender global sigue vigente:
  - `getPromotionalEmailConfig` devuelve `senderAddress`/`senderDisplayName` promocionales si existen; si faltan, conserva los globales.
  - Test `getPromotionalEmailConfig prefers promotional sender with global fallback` sigue pasando.
- No se enviaron correos reales; todos los checks fueron locales con mocks/tests.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno abierto.

Evidencia:
- Prettier: `All matched files use Prettier code style!`.
- `npm --prefix api test`: `# tests 186`, `# pass 186`, `# fail 0`.
- `api/src/lib/notifier.js`:
  - lineas 7-11: sender operativo/global desde `ACS_EMAIL_SENDER_*`.
  - lineas 29-41: sender promocional desde `PROMOTIONAL_EMAIL_SENDER_*` con fallback global.
- `api/src/functions/promotionalCampaigns.js`: linea 827 usa `notifier.getPromotionalEmailConfig()`.
- `api/src/lib/operationalEmails.js`: linea 184 usa `notifier.getEmailConfig(...)`.
- `git diff --check`: sin errores; solo advertencias CRLF existentes del entorno.

Uso DB cloud: No.

Riesgos o pendientes:
- No se valido en Azure Functions ni ACS real; esta tarea era local y sin correos reales.
- La activacion productiva aun depende de release Backend/API e Infra apply de app settings:
  - `ACS_EMAIL_SENDER_ADDRESS=operaciones@mail.puntoclubcr.com`.
  - `ACS_EMAIL_SENDER_DISPLAY_NAME=Punto Club Operaciones`.
  - `PROMOTIONAL_EMAIL_SENDER_ADDRESS=campanas@mail.puntoclubcr.com`.
  - `PROMOTIONAL_EMAIL_SENDER_DISPLAY_NAME=Punto Club Campañas`.

Siguiente recomendado:
- Product / Architect / Release puede procesar este handoff como aprobado. Siguiente paso: publicar Backend/API del sender separado y luego ejecutar Infra apply de app settings antes de QA publicada con envios controlados.
