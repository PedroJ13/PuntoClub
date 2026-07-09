# TASK-880 - Handoff

Equipo: QA

Tarea validada: TASK-880 - Ejecutar smoke QA staging phase 1

Ambiente: Web staging `https://calm-coast-0fabaec0f.7.azurestaticapps.net`; API staging `https://func-puntoclub-stg-br-001.azurewebsites.net/api`; fecha de ejecucion: 2026-07-09. Referencias revisadas: `tasks/TASK-875-HANDOFF.md`, `tasks/TASK-877-HANDOFF.md`, `tasks/TASK-878-HANDOFF.md`, `tasks/TASK-879-HANDOFF.md`.

Resultado: bloqueado

Checks ejecutados:
- Se confirmo por `app-config.js` que Web staging apunta a API staging `func-puntoclub-stg-br-001.azurewebsites.net` y no a `api.puntoclubcr.com`.
- Se valido `GET /api/me` sin sesion: `401 UNAUTHORIZED` con mensaje controlado `Authentication is required.`
- Se valido preflight CORS desde origen staging: `204`, `Access-Control-Allow-Origin: https://calm-coast-0fabaec0f.7.azurestaticapps.net`, `Access-Control-Allow-Credentials: true`.
- Se valido preflight CORS desde origen arbitrario `https://example.com`: `204` sin headers permisivos de `Access-Control-Allow-Origin` ni credentials.
- Se validaron rutas publicas en navegador: `/`, `/app`, `/company-registration`, `/company-invitations/accept`, `/company-invitations/accept?token=invalid-staging-qa`, `/company-password-reset`, `/admin-companies`, ruta profunda `/ruta-profunda-qa-staging`.
- Se valido `/app` sin sesion: redirige a `/login` y muestra acceso de empresa.
- Se valido invitacion sin token/token invalido: muestra `Acceso no disponible` sin 404/500.
- Se valido password reset sin token: muestra rechazo controlado sin 404/500.
- Se valido `/admin-companies` sin token: UI muestra solicitud de token interno y no carga empresas.
- Se valido API interna admin sin token/config habilitada: `403 FORBIDDEN` con `Company registration review is not enabled.`
- Se valido intento de envio promocional API sin sesion: `401 UNAUTHORIZED`; no se envio correo.
- Se hizo responsive basico en 390px para home, `/app` login y `/admin-companies`: sin overflow horizontal detectado.
- Se reviso consola en home staging: sin errores.

Hallazgos:
- Web staging responde y renderiza Punto Club en rutas publicas y profundas sin 404/500 visibles.
- `app-config.js` staging contiene `window.PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-stg-br-001.azurewebsites.net"` y `window.PUNTO_CLUB_COMPANY_ID = "6"`.
- API staging protege `/api/me` sin sesion con 401 controlado.
- CORS staging esta acotado al origen Web staging y no expone origen arbitrario.
- Admin empresas esta cerrado sin token y, adicionalmente, la revision interna esta deshabilitada por flag en staging.
- El endpoint de envio promocional no permite operar sin sesion; no se ejecuto ningun envio real.
- No se ejecutaron escrituras, migraciones, limpiezas, compras, canjes, subida de logo ni envios reales.
- No se pudo completar login/logout positivo, `/app` autenticado, flujo operativo autenticado, Mi empresa, Reportes, Comunicaciones autenticado ni admin positivo porque no hubo credenciales QA ni `INTERNAL_ADMIN_TOKEN` staging disponibles por canal seguro en esta tarea.

P0/P1:
- Sin P0/P1 confirmados en los checks ejecutados.
- Bloqueo de cobertura: login/logout positivo, smoke autenticado y admin positivo no ejecutados por falta de credenciales/token staging por canal seguro. No se clasifica como bug del producto, pero impide aprobar TASK-880 completo.

P2/P3:
- P2: staging phase 1 apunta temporalmente a SQL productiva segun TASK-877/TASK-878/TASK-879; cualquier prueba autenticada con escritura debe usar datos QA controlados y aprobacion explicita.
- P2: no hay marca visual `STAGING` en la UI; existe riesgo operativo de confusion si se alterna con produccion.
- P2: no existe workflow formal de deploy staging/app-config por ambiente; TASK-879 indica que el deploy Web staging fue manual desde copia temporal.
- P3: algunas verificaciones HTTP por lote con `curl` devolvieron timeout puntual para `/app` y `/company-invitations/accept`, pero ambas rutas fueron validadas correctamente en navegador sin 404/500.

Evidencia:
- `GET https://calm-coast-0fabaec0f.7.azurestaticapps.net/app-config.js` -> `200`, contiene API staging y no contiene `api.puntoclubcr.com`.
- `GET https://func-puntoclub-stg-br-001.azurewebsites.net/api/me` sin cookie -> `401`, body `{"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}`.
- `OPTIONS /api/me` con origin staging -> `204`, `Access-Control-Allow-Origin` staging, `Access-Control-Allow-Credentials=true`.
- `OPTIONS /api/me` con origin `https://example.com` -> `204` sin `Access-Control-Allow-Origin` permisivo.
- Navegador `/` -> home comercial Punto Club, sin 404/500.
- Navegador `/app` -> redirige a `/login`, muestra `Sesion no iniciada` y formulario de acceso.
- Navegador `/company-registration` -> formulario publico de registro de empresa.
- Navegador `/company-invitations/accept` y `?token=invalid-staging-qa` -> `Acceso no disponible`.
- Navegador `/company-password-reset` -> `El enlace de recuperacion no es valido`.
- Navegador `/admin-companies` -> panel interno solicita token y muestra mensaje para cargar empresas.
- `GET /api/company-registration-requests` sin token -> `403 FORBIDDEN`, `Company registration review is not enabled.`
- `POST /api/companies/6/promotional-campaigns/0/send` sin sesion -> `401 UNAUTHORIZED`.
- Responsive 390px: home, login y admin sin overflow horizontal (`scrollWidth == clientWidth`).

Uso DB cloud: Si, indirecto y limitado. Se uso Web/API staging publicados; API staging esta configurada con SQL productiva temporal segun phase 1. Las pruebas ejecutadas fueron de lectura/publicas o rechazos antes de operar datos; no se hicieron escrituras, migraciones, limpiezas ni envios reales.

Riesgos o pendientes:
- Para cerrar TASK-880 completo falta sesion QA staging por canal seguro y/o que Product Owner inicie sesion en navegador interno.
- Falta token admin staging por canal seguro para validar caso positivo de `/admin-companies` sin exponer secretos.
- Falta validar `/app` autenticado: shell operativo, Atender cliente, Mi empresa, Reportes, Comunicaciones y logout real.
- Falta validar que correos/campanas reales sigan bloqueados dentro de UI autenticada; por API sin sesion quedaron bloqueados y por settings handoff ACS esta vacio/flag promociones false.
- Mientras no exista SQL staging, cualquier smoke autenticado con escritura debe mantenerse minimo, trazable y con datos `QA-STAGING-*`.

Siguiente recomendado:
- Product Owner o Infra debe habilitar sesion QA staging en navegador interno o entregar credenciales por canal seguro fuera del chat.
- Infra debe facilitar `INTERNAL_ADMIN_TOKEN` staging por canal seguro para prueba positiva de admin, sin pegarlo en handoff ni chat.
- Reintentar TASK-880 autenticado con alcance minimo: login, `/app`, refresh, logout, Mi empresa/Reportes solo lectura, Comunicaciones sin envio, admin positivo solo lectura.
- Mantener bloqueados envios reales y no ejecutar compras/canjes/campanas hasta tener confirmacion explicita de datos QA controlados y alcance aprobado.
