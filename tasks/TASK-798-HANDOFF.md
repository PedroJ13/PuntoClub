Equipo: Web Dev
Modo de ejecucion: UX / Cumpleanos
Tarea completada: TASK-798 - Corregir reset desde menu lateral Enviar campanas

Resultado:
- Corregido el P1 reportado despues de TASK-796.
- Al entrar al flujo dedicado de cumpleanos, salir a `Atender cliente` y volver a `Enviar campañas` desde el menu lateral, la pantalla restablece el flujo comun.
- El selector deja de quedar limitado a campanas de cumpleanos.
- Si habia una campana de cumpleanos seleccionada, la entrada normal selecciona una campana comun disponible para cargar destinatarios normales.
- Si no existe campana comun disponible, deja la pantalla sin campana seleccionada para evitar mantener destinatarios birthday-only.
- El flujo dedicado desde la alerta/boton `Enviar campaña de cumpleaños` queda intacto.
- No se cambio API.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-798-HANDOFF.md`

Detalle tecnico:
- `openCommunicationSendView()` ahora acepta opciones y, por defecto, prefiere campanas comunes cuando la entrada es normal.
- La funcion siempre restablece `communicationSendCampaignTypeFilter = "all"` al entrar por `Enviar campañas`.
- Si `currentPromotionalCampaign` sigue siendo tipo `cumpleanos`, busca una campana con `campaignType !== "cumpleanos"` y llama a `selectPromotionalCampaign()` para recargar preview/destinatarios normales.
- Los clicks del subnav normal `Enviar campañas` y del menu lateral `Enviar campañas` pasan por `openCommunicationSendView()`.
- `openBirthdayCampaignSendView()` no fue modificado.

Validaciones locales:
- `npx prettier --write app/src/app.js`
- `node --check app/src/app.js`
- `npx prettier --check app/src/app.js`
- `git diff --check -- app/src/app.js`

Resultado de validaciones:
- Sintaxis OK.
- Prettier OK.
- `git diff --check` sin errores; solo aviso LF/CRLF.

Uso Azure SQL:
- No.
- Motivo: ajuste local de estado/navegacion Web.

Riesgos o pendientes:
- Requiere QA funcional: entrar por alerta de cumpleanos, navegar a `Atender cliente`, volver por menu lateral a `Enviar campañas` y confirmar selector/destinatarios de flujo comun.
- Si el ambiente solo tiene campanas de cumpleanos, el selector queda sin campana comun seleccionada; esto es intencional para no mantener el flujo dedicado.
