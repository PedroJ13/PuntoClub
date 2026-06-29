Equipo: QA
Tarea validada: TASK-543 - Validar submenu lateral Mi empresa publicado
Ambiente: Web publicado `https://puntoclubcr.com`; validacion HTTP read-only y Playwright/headless desktop `1366x900` + mobile `390x844` desde Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`. En Playwright se intercepto `app-config.js` para usar mock local de UI y no consumir servicios reales. Sin Azure SQL, sin ACS real, sin envio de correos, sin commit, sin push y sin deploy.
Resultado: aprobado

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-540-HANDOFF.md`, `tasks/TASK-541-HANDOFF.md` y `tasks/TASK-542-HANDOFF.md`.
- Nota de contexto: no existe `tasks/TASK-543.md` ni `tasks/TASK-543-assignment.md`; se ejecuto el alcance indicado por el usuario y el seguimiento post-deploy de TASK-542.
- Revision Git local:
  - `git status --short --branch`;
  - `git log --oneline --decorate --max-count=8`.
- HTTP publicado con cache-buster para:
  - `https://puntoclubcr.com/`;
  - `https://puntoclubcr.com/app`;
  - `https://puntoclubcr.com/src/app.js`;
  - `https://puntoclubcr.com/styles.css`.
- Playwright publicado desktop y mobile validando:
  - `Mi empresa` como grupo colapsable;
  - subitems `Perfil`, `Logo`, `Acceso`, `Membresías` y `Comunicaciones`;
  - ausencia de tabs internos `.company-subnav`;
  - `Membresías` como vista propia;
  - `Membresías` no visible en `Perfil`, `Logo`, `Acceso` ni `Comunicaciones`;
  - `Enviar campañas` como item principal separado;
  - envio real bloqueado;
  - overflow horizontal basico;
  - errores de pagina.

Hallazgos:
- La Web publicada contiene el paquete de submenu lateral de `Mi empresa` de TASK-542.
- `Mi empresa` despliega submenu lateral y muestra `Perfil` por defecto.
- El submenu contiene `Perfil`, `Logo`, `Acceso`, `Membresías` y `Comunicaciones`.
- No existen tabs internos de `Mi empresa` (`company-subnav` ausente).
- Cada subitem muestra solo su panel activo en desktop y mobile.
- `Membresías` queda aislada como vista propia y no aparece visible en `Perfil`, `Logo`, `Acceso` ni `Comunicaciones`.
- `Enviar campañas` sigue como item principal separado del menu lateral.
- `Enviar campañas` abre la seccion de comunicaciones con vista de envio y preview.
- El envio real sigue bloqueado: `#communication-send-button` esta deshabilitado y muestra `Envío real bloqueado`.
- No se detectaron errores de pagina ni overflow horizontal en desktop/mobile.

P0/P1:
- No se encontraron P0/P1 abiertos.

P2/P3:
- No se encontraron P2/P3 nuevos en el alcance publicado validado.

Evidencia:
- Estado Git local:
  - `main` alineado con `origin/main`;
  - HEAD local/publicado: `fb5e79a chore: record company sidebar submenu release`;
  - commit del paquete: `744968b chore: release company sidebar submenu`;
  - `debug.log` sigue no trackeado y fuera del release.
- HTTP publicado:
  - `/`: `200`, contiene `company-side-subnav`, `data-company-subsection="memberships"`, `data-company-panel="memberships"`, `Enviar campañas`, `Envío real bloqueado`; no contiene `company-subnav`.
  - `/app`: `200`, contiene `company-side-subnav`, `data-company-subsection="memberships"`, `data-company-panel="memberships"`, `Enviar campañas`, `Envío real bloqueado`; no contiene `company-subnav`.
  - `/src/app.js`: `200`, contiene `company-side-subnav` y `setCompanySubsection`.
  - `/styles.css`: `200`.
- Playwright publicado desktop `1366x900`:
  - `mockLoginOk=true`;
  - `companyNavExists=true`;
  - `campaignsSeparate=true`;
  - `noInternalCompanyTabs=true`;
  - `subnavExpandsOnCompany=true`;
  - `subitemsComplete=true`;
  - `defaultProfile=true`;
  - `profileOnly=true`;
  - `logoOnly=true`;
  - `accessOnly=true`;
  - `membershipsOnly=true`;
  - `communicationsOnly=true`;
  - `membershipsNotInOtherCompanyViews=true`;
  - `campaignsOpenSeparateSection=true`;
  - `realSendBlocked=true`;
  - `companySubnavCollapsesOutside=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.
- Playwright publicado mobile `390x844`:
  - `mockLoginOk=true`;
  - `companyNavExists=true`;
  - `campaignsSeparate=true`;
  - `noInternalCompanyTabs=true`;
  - `subnavExpandsOnCompany=true`;
  - `subitemsComplete=true`;
  - `defaultProfile=true`;
  - `profileOnly=true`;
  - `logoOnly=true`;
  - `accessOnly=true`;
  - `membershipsOnly=true`;
  - `communicationsOnly=true`;
  - `membershipsNotInOtherCompanyViews=true`;
  - `campaignsOpenSeparateSection=true`;
  - `realSendBlocked=true`;
  - `companySubnavCollapsesOutside=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.

Uso DB cloud: No. No se conecto a Azure SQL ni se uso DB real. Se uso HTTP/Playwright read-only contra `puntoclubcr.com`; en Playwright se intercepto `app-config.js` para activar mock local de UI y evitar llamadas a servicios reales. No se enviaron correos ni se hicieron escrituras.

Riesgos o pendientes:
- La configuracion real de membresias depende del comportamiento existente de API/datos; esta tarea valida reorganizacion de navegacion y visibilidad publicada.
- Cualquier cambio real de comunicaciones o envio de correos requiere paquete separado con Backend/API, SQL, Infra/ACS y QA especifico.
- `debug.log` permanece local no trackeado y debe seguir fuera de commit/deploy.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-543 como QA Web publicada aprobada.
- Mantener envio real bloqueado hasta que exista paquete backend/infra/SQL aprobado y QA especifico.
