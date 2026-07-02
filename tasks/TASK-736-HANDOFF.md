Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-736 - Decidir publicacion de copy destinatario duplicado

Resultado:
- Se revisaron `TASK-733` a `TASK-735`.
- Se aprueba publicar Web solamente para mostrar copy claro en espanol cuando un destinatario ya esta incluido en una campana.
- QA local aprobo el caso duplicado y el flujo normal sin P0/P1/P2/P3 nuevos.
- Se mantiene el bloqueo anti-duplicado por campana.
- No se aprueban cambios API, SQL, ACS, sender, storage, DNS, CORS, app settings ni feature flags.
- No se autoriza envio real de correos durante esta publicacion.

Handoffs procesados:
- `tasks/TASK-733-HANDOFF.md`
- `tasks/TASK-734-HANDOFF.md`
- `tasks/TASK-735-HANDOFF.md`

Decision:
- Aprobar publicacion Web solamente.
- Incluir:
  - `app/src/app.js`
  - `tasks/TASK-733.md`
  - `tasks/TASK-733-HANDOFF.md`
  - `tasks/TASK-734-HANDOFF.md`
  - `tasks/TASK-735-HANDOFF.md`
  - `tasks/TASK-736-HANDOFF.md`
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados.

Copy aprobado:
- Titulo:
  - `Destinatario ya incluido`
- Mensaje:
  - `Este cliente ya fue incluido en esta campaña. Para volver a enviarle una promoción, crea una nueva campaña o selecciona otra.`

Alcance aprobado:
- No mostrar el texto tecnico `Promotional recipient is already selected for this campaign.`
- Mostrar el aviso en el panel `Resultado`.
- Mantener campana y destinatarios visibles.
- Mantener bloqueo anti-duplicado vigente.
- Refrescar destinatarios/historial/listas si aplica sin borrar el aviso.

Uso Azure SQL:
- No.
- Motivo: decision de release Web sin cambios de datos.

Riesgos o pendientes:
- Falta QA publicada focal despues del deploy Web.
- No se debe enviar correo real durante esta validacion salvo autorizacion explicita posterior.

Siguiente recomendado:
- Ejecutar `TASK-737` para commit y push controlado.
- Luego ejecutar `TASK-738` para QA publicada focal.
