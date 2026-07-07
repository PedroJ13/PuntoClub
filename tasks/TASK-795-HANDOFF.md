Equipo: Web Dev
Modo de ejecucion: UX / Cumpleanos
Tarea completada: TASK-795 - Restablecer flujo comun al volver a Enviar campanas

Resultado:
- Corregido el estado de UI que podia dejar pegado el filtro de campanas de cumpleanos despues de entrar por la alerta/boton `Enviar campana de cumpleanos`.
- Al volver a `Enviar campanas` desde el menu lateral, el boton de Mi empresa o el subnav normal, el flujo vuelve a modo comun (`all`).
- El flujo dedicado de cumpleanos se mantiene intacto cuando se entra desde la alerta/boton `Enviar campana de cumpleanos`.
- No se cambio API.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-795-HANDOFF.md`

Detalle tecnico:
- `openCommunicationSendView()` ahora detecta si la pantalla venia del modo dedicado `cumpleanos`.
- Si venia de cumpleanos, restablece `communicationSendCampaignTypeFilter = "all"`, limpia mensajes de resultado y limpia seleccion de destinatarios.
- Si estaba seleccionada una campana tipo `cumpleanos`, intenta seleccionar una campana comun disponible para evitar que el usuario siga viendo un flujo birthday-only al regresar por la ruta normal.
- Si no existe campana comun disponible, deja el selector sin campana seleccionada y limpia preview/listado de destinatarios.
- Los clicks normales del subnav `Enviar campanas` y del menu lateral `Enviar campañas` ahora pasan por `openCommunicationSendView()`, compartiendo el mismo reset.
- `openBirthdayCampaignSendView()` no se cambio, por lo que el acceso dedicado desde la alerta conserva filtro de campanas tipo `cumpleanos`.

Validaciones locales:
- `npx prettier --write app/src/app.js`
- `node --check app/src/app.js`
- `npx prettier --check app/src/app.js`
- `git diff --check -- app/src/app.js`
- `npx eslint app/src/app.js`

Resultado de validaciones:
- Sintaxis OK.
- Prettier OK.
- `git diff --check` sin errores; solo aviso LF/CRLF.
- ESLint no ejecutable con la configuracion actual del repo: ESLint 10 reporta que no existe `eslint.config.(js|mjs|cjs)`.

Uso Azure SQL:
- No.
- Motivo: ajuste local de estado/navegacion Web.

Riesgos o pendientes:
- Requiere QA funcional en Web local/publicada: entrar por alerta de cumpleanos, salir a otro modulo y volver por menu/subnav normal a `Enviar campañas`; el selector debe mostrar campanas comunes y no quedar limitado a cumpleanos.
- Si no existen campanas comunes, el modo normal queda sin campana seleccionada, que es el comportamiento esperado para evitar mantener el flujo dedicado de cumpleanos.
