Equipo: QA
Tarea validada: TASK-777 - Validar localmente fecha de nacimiento, alertas y campanas de cumpleanos
Ambiente: Local/mock, app servida en http://127.0.0.1:4197 con app-config mock, Chromium Playwright, fecha fijada en 2026-07-05.
Resultado: no aprobado

Checks ejecutados:
- Lectura de contexto QA y handoffs previos TASK-773, TASK-775 y TASK-776.
- Smoke visual/interactivo local con `tmp/task777-qa.mjs`.
- Login mock y validacion de alerta de cumpleaneros despues del ingreso.
- Creacion de cliente nuevo con fecha de nacimiento.
- Revision de cliente existente sin fecha y validacion de indicador de datos incompletos.
- Actualizacion de fecha de nacimiento desde ficha/transaccion de cliente.
- Creacion y edicion de campana tipo `cumpleanos`.
- Navegacion a Enviar campanas desde campana de cumpleanos.
- Validacion de preview y seleccion de destinatarios sin enviar correos.
- Checks tecnicos: `node --check` en Web/API focal, `git diff --check`, `node --test api/test/validators.test.js api/test/promotional-campaigns.test.js`, `npx prettier --check` en archivos focales.

Hallazgos:
- Se confirma alerta post-login: `Campanita: 1 cliente cumple anos hoy. 1 apto para campana de cumpleanos.`
- Se confirma cliente nuevo con fecha `1990-07-05`.
- Se confirma cliente existente sin fecha con indicador `Datos incompletos: agrega fecha de nacimiento.`
- Se confirma actualizacion de fecha a `1991-07-05` desde ficha y desaparicion del indicador.
- Se confirma creacion/edicion de campana `cumpleanos` y preview actualizado.
- Se confirma que, al seleccionar una campana de cumpleanos, los destinatarios visibles quedan limitados a cumpleaneros del dia: QA777, Maria Soto y Jose Vega.
- Se confirma que no se ejecuto envio real.

P0/P1:
- P1: En el flujo de envio de cumpleanos, el selector de campanas no queda filtrado solo a campanas de cumpleanos. La lista muestra tambien una campana comun: `Promo clientes frecuentes - Promo especial para clientes frecuentes - Comun`. Esto incumple el criterio de TASK-777: "filtro de envio que muestra solo campanas de cumpleanos".

P2/P3:
- Sin P2/P3 nuevos.

Evidencia:
- `tmp/task777-qa.mjs` reporto `ok: false` por el P1 anterior.
- Selector observado en Enviar campanas: `Selecciona una campana para enviar`, `QA777 cumple ... - Feliz cumple ... editado - Cumpleanos`, `Promo clientes frecuentes - Promo especial para clientes frecuentes - Comun`.
- Recipients observados para campana de cumpleanos: `QA777 Cumple ...`, `Maria Soto`, `Jose Vega`; todos seleccionables y sin envio.
- Tests API focales: 56/56 pass.
- Prettier: `All matched files use Prettier code style!`
- `node --check` y `git diff --check`: sin errores; solo avisos LF/CRLF de Git.

Uso DB cloud: No

Riesgos o pendientes:
- Si el usuario puede cambiar desde una campana de cumpleanos a una campana comun dentro del flujo de envio de cumpleanos, el flujo queda ambiguo y no cumple el aislamiento esperado para campanas de cumpleanos.
- No se valido ambiente publicado; esta tarea era local/mock.

Siguiente recomendado:
- Web Dev debe ajustar el flujo de Enviar campanas iniciado desde cumpleanos para que el selector liste solo campanas tipo `cumpleanos`, manteniendo el filtro de destinatarios ya validado.
- Reejecutar QA local focal despues del ajuste.
