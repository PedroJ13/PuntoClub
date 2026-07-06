Equipo: Web Dev
Modo de ejecucion: UI local / Cumpleanos
Tarea completada: TASK-780 - Corregir filtro de campanas en flujo de envio de cumpleanos

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-780-HANDOFF.md`

Ambiente:
- Local.
- No se cambio API.
- No se cambio SQL.
- No se cambio ACS.
- No se cambiaron flags.
- No se enviaron correos reales.

Implementacion:
- Se agrego modo de envio `cumpleanos` para el flujo iniciado desde la alerta/boton de cumpleaneros.
- La alerta de cumpleaneros ahora muestra un boton `Enviar campana de cumpleaños`.
- Al entrar por ese boton, el selector de campanas de envio muestra solo campanas con `campaignType = "cumpleanos"`.
- La lista de gestion `Crear / actualizar campanas` sigue mostrando todas las campanas.
- Se conserva el filtro de destinatarios a cumpleaneros del dia mediante `birthdayOnly`.
- Se conserva seleccion manual, limite MVP de 5, preview y estado de envio existente.
- Si no hay campanas de cumpleaños, el selector muestra `No hay campañas de cumpleaños` y se informa que debe crearse una campana tipo Cumpleaños.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `npx prettier --check app/src/app.js app/styles.css`

Resultado:
- Checks aprobados.
- No se detectaron errores de sintaxis ni formato.

Uso Azure SQL:
- No.
- Motivo: alcance Web local sin datos reales.

P0/P1:
- Ninguno abierto.

Riesgos o pendientes:
- QA local debe validar visualmente el flujo desde la alerta con al menos una campana tipo `cumpleanos` y otra tipo `comun` para confirmar que el selector de envio solo muestra la de cumpleaños.
