Equipo: QA
Tarea validada: TASK-540 - Validar submenu colapsable Mi empresa y vista Membresias
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; validacion estatica, `node`, Prettier, `git diff --check` y Playwright/headless desktop `1366x900` + mobile `390x844` contra servidor HTTP local en memoria sobre `app/`. Para la prueba autenticada local se sirvio `app-config.js` temporal desde el servidor de test con `PUNTO_CLUB_USE_MOCK_API=true`. Sin deploy, sin Azure SQL, sin ACS real y sin envio de correos.
Resultado: aprobado

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-538-HANDOFF.md` y `tasks/TASK-539-HANDOFF.md`.
- Nota de contexto: no existe `tasks/TASK-540.md` ni `tasks/TASK-540-assignment.md`; se ejecuto el alcance indicado por el usuario.
- `git status --short --branch`.
- `node --check app/src/app.js`.
- `npx prettier --check app/index.html app/src/app.js app/styles.css`.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`.
- Validacion estatica de marcadores:
  - `#company-side-subnav`;
  - `data-company-subsection="profile|logo|access|memberships|communications"`;
  - `data-company-panel="memberships"`;
  - ausencia de `.company-subnav` interna;
  - `data-section-target="communications"` con `Enviar campañas`;
  - `#communication-send-button disabled`.
- Playwright local con login mock (`owner@mock.test`) en desktop y mobile, validando:
  - `Mi empresa` despliega submenu lateral;
  - submenu lateral contiene `Perfil`, `Logo`, `Acceso`, `Membresías` y `Comunicaciones`;
  - `Mi empresa` entra por defecto a `Perfil`;
  - cada subitem marca activo con `aria-current="page"`;
  - cada subitem muestra solo su contenido visible;
  - `Membresías` no queda visible en `Perfil`, `Logo`, `Acceso` ni `Comunicaciones`;
  - `Enviar campañas` sigue como item principal separado;
  - envio real sigue bloqueado;
  - responsive/overflow basico.

Hallazgos:
- El submenu lateral de `Mi empresa` existe, se expande al abrir `Mi empresa` y se colapsa al salir hacia `Enviar campañas`.
- El submenu lateral contiene exactamente las vistas esperadas: `Perfil`, `Logo`, `Acceso`, `Membresías` y `Comunicaciones`.
- Ya no existe la navegacion interna `.company-subnav` dentro de `Mi empresa`.
- `Mi empresa` abre por defecto en `Perfil`.
- `Perfil`, `Logo`, `Acceso`, `Membresías` y `Comunicaciones` cambian de vista mediante `data-company-panel`; los paneles no seleccionados quedan `hidden`.
- `Membresías` esta aislado como `data-company-panel="memberships"` y no aparece visible en `Perfil`, `Logo`, `Acceso` ni `Comunicaciones`.
- `Enviar campañas` sigue como item principal separado del menu lateral.
- `Enviar campañas` abre la seccion de comunicaciones con vista de envio y preview.
- El envio real sigue bloqueado: `#communication-send-button` mantiene `disabled` y texto `Envío real bloqueado`.
- No se detectaron errores de pagina en Playwright desktop/mobile.

P0/P1:
- No se encontraron P0/P1 abiertos.

P2/P3:
- No se encontraron P2/P3 nuevos en el alcance validado.

Evidencia:
- `node --check app/src/app.js`: OK.
- `npx prettier --check app/index.html app/src/app.js app/styles.css`: `All matched files use Prettier code style!`
- `git diff --check -- app/index.html app/src/app.js app/styles.css`: OK; solo warnings LF/CRLF del entorno.
- `git status --short --branch`:
  - `M app/index.html`;
  - `M app/src/app.js`;
  - `M app/styles.css`;
  - `?? debug.log`;
  - `?? tasks/TASK-538-HANDOFF.md`;
  - `?? tasks/TASK-539-HANDOFF.md`.
- Fuente:
  - `app/index.html`: existe `#company-side-subnav` con subitems `profile`, `logo`, `access`, `memberships`, `communications`.
  - `app/index.html`: `membership-config-host` usa `data-company-panel="memberships"`.
  - `app/index.html`: `data-section-target="communications"` conserva label `Enviar campañas`.
  - `app/index.html`: `#communication-send-button` mantiene `disabled`.
  - `app/src/app.js`: `setCompanySubsection` incluye `memberships` y oculta paneles no activos.
- Playwright local desktop/mobile:
  - login mock OK;
  - `companyNavExists=true`;
  - `campaignsSeparate=true`;
  - `noInternalCompanyTabs=true`;
  - `subnavExpandsOnCompany=true`;
  - `subitemsComplete=true`;
  - `defaultProfile=true`;
  - `membershipsNotInOtherCompanyViews=true`;
  - `campaignsOpenSeparateSection=true`;
  - `realSendBlocked=true`;
  - `companySubnavCollapsesOutside=true`;
  - `noHorizontalOverflow=true`;
  - `pageErrors=[]`.
- Debug DOM por subitem:
  - `Perfil`: subitem activo con `aria-current="page"`; paneles visibles solo `profile`; `logo`, `access`, `communications` y `memberships` quedan hidden.
  - `Logo`: subitem activo con `aria-current="page"`; panel visible solo `logo`.
  - `Acceso`: subitem activo con `aria-current="page"`; panel visible solo `access`.
  - `Membresías`: subitem activo con `aria-current="page"`; panel visible solo `memberships`.
  - `Comunicaciones`: subitem activo con `aria-current="page"`; panel visible solo `communications`.

Uso DB cloud: No. No se conecto a Azure SQL ni se uso DB real. La prueba uso API mock local en navegador; no se enviaron correos ni se hicieron escrituras en servicios reales.

Riesgos o pendientes:
- La validacion se hizo en modo mock local autenticado; queda pendiente QA publicado si Product / Architect / Release decide publicar este paquete.
- `debug.log` sigue como archivo local no trackeado y debe permanecer fuera de commit/deploy.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-540 como QA local aprobada.
- Si se publica, ejecutar QA Web focal para el submenu colapsable de `Mi empresa` y vista `Membresías`.
