Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-706 - Decidir publicacion de fix imagen nueva campana

Resultado:
- Se revisaron `TASK-704` y `TASK-705`.
- Se aprueba publicar el fix Web para que `Crear campaña` no arrastre imagen, preview ni errores de una campaña anterior.
- No se aprueban cambios API, SQL, ACS, storage ni feature flags.
- No se autoriza envio real de correos.

Handoffs procesados:
- `tasks/TASK-704-HANDOFF.md`
- `tasks/TASK-705-HANDOFF.md`

Decision:
- Aprobar publicacion Web.
- Incluir:
  - `app/src/app.js`
  - `tasks/TASK-704-HANDOFF.md`
  - `tasks/TASK-705-HANDOFF.md`
  - `tasks/TASK-706-HANDOFF.md`
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados

Alcance aprobado:
- `Crear campaña` queda como borrador nuevo separado de la campaña seleccionada.
- No arrastra imagen previa.
- No arrastra preview previo.
- No arrastra errores previos.
- Antes de guardar borrador, los controles de imagen quedan deshabilitados.
- Antes de guardar borrador, se muestra:
  - `Guarda la campaña para agregar una imagen`
- Despues de guardar borrador, se habilitan controles de imagen para una campaña editable.
- El error `No se puede modificar la imagen de una campaña enviada.` queda reservado para campañas existentes no editables.

QA:
- `TASK-705` aprobo el bug principal en ambiente local/mock.
- No hubo P0/P1 para el bug local de arrastre de estado.
- Falta QA publicado con sesion real para persistencia de imagen tras recarga.

Reglas de release:
- No enviar correos reales.
- No cambiar `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No tocar API.
- No tocar Azure SQL.
- No tocar ACS ni sender.
- No tocar storage.
- No tocar DNS/CORS/app settings.

Uso Azure SQL:
- No.
- Motivo: decision de release Web sin cambios de datos.

Riesgos o pendientes:
- P1 pendiente de validacion publicada: subir imagen real, recargar y confirmar persistencia desde API/Blob.
- El envio real debe seguir fuera de alcance hasta que PO lo autorice expresamente.

Siguiente recomendado:
- Ejecutar `TASK-707` para commit y push controlado Web.
- Luego QA publicado con sesion real/controlada para persistencia de imagen.
