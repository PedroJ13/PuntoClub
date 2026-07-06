Equipo: Web Dev
Modo de ejecucion: UI local / Cumpleanos
Tarea completada: TASK-776 - Implementar UI local de fecha de nacimiento, alerta y campanas de cumpleanos

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-776-HANDOFF.md`

Ambiente:
- Local/mock.
- No se hizo deploy.
- No se enviaron correos reales.
- No se cambiaron flags.

Implementacion:
- Formulario de registro de cliente incluye `Fecha de nacimiento`.
- Ficha del cliente muestra indicador de datos incompletos cuando falta fecha de nacimiento.
- Ficha del cliente permite actualizar fecha de nacimiento con accion explicita `Guardar fecha`.
- Al entrar al panel se consulta resumen de cumpleaneros del dia y se muestra alerta tipo campanita en el estado operativo.
- Crear/actualizar campanas incluye selector de tipo: `Comun` o `Cumpleanos`.
- El selector de campanas muestra el tipo de campana en la lista.
- Al seleccionar una campana tipo `cumpleanos`, la lista de destinatarios se filtra a cumpleaneros del dia.
- Mock local actualizado con clientes con/sin fecha, endpoint de cumpleaneros, `campaignType` y filtro `birthdayOnly`.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `npx prettier --check ...`

Resultado:
- Checks de sintaxis aprobados.
- Prettier aprobado.

Verificacion no ejecutable:
- `npm run stylelint -- app/styles.css` no pudo ejecutarse porque el repo no tiene configuracion Stylelint detectable (`No configuration provided`).

Uso Azure SQL:
- No.
- Motivo: alcance Web local/mock.

P0/P1:
- Ninguno abierto.

Riesgos o pendientes:
- Validacion visual manual en navegador queda recomendada para QA local.
- El filtro de cumpleanos depende de que API/DB tengan aplicada la migracion correspondiente antes de probar contra datos reales.
