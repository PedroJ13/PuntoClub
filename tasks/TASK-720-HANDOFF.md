Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-720 - Decidir publicacion del fix de sincronizacion UI campana editada

Resultado:
- Se revisaron `TASK-717` a `TASK-719`.
- Se aprueba publicar un fix Web solamente para corregir la sincronizacion UI despues de editar una campana `draft`.
- QA local aprobo el fix sin P0/P1/P2/P3 nuevos.
- No se aprueban cambios API, SQL, ACS, sender, storage, DNS, CORS, app settings ni feature flags.
- No se autoriza envio real de correos.

Handoffs procesados:
- `tasks/TASK-717-HANDOFF.md`
- `tasks/TASK-718-HANDOFF.md`
- `tasks/TASK-719-HANDOFF.md`

Decision:
- Aprobar publicacion Web solamente.
- Incluir:
  - `app/src/app.js`
  - `app/src/customerApi.js`
  - `tasks/TASK-716-HANDOFF.md`
  - `tasks/TASK-717-HANDOFF.md`
  - `tasks/TASK-718-HANDOFF.md`
  - `tasks/TASK-719-HANDOFF.md`
  - `tasks/TASK-720-HANDOFF.md`
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados.

Alcance aprobado:
- Despues de editar una campana `draft`, el formulario debe seguir editable.
- Las listas de gestion y envio deben reflejar nombre/asunto actualizados.
- El preview debe refrescarse si la campana editada esta seleccionada para envio.
- La gestion de imagen debe seguir disponible para campanas editables.
- La UI no debe mostrar `Campaña no editable` salvo que la API devuelva un estado realmente no editable.

Uso Azure SQL:
- No.
- Motivo: decision de release Web sin cambios de datos ni migracion.

Riesgos o pendientes:
- Falta QA publicada focal despues del deploy Web.
- No se debe enviar correo promocional real durante la revalidacion.

Siguiente recomendado:
- Ejecutar `TASK-721` para commit y push controlado del fix Web.
- Luego ejecutar `TASK-722` como QA publicada focal.
