Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-715 - Decidir publicacion de separacion y edicion de campanas

Resultado:
- Se revisaron `TASK-708` a `TASK-714`.
- Se aprueba publicar el paquete API/Web para separar Crear/Editar campana de Enviar campana y habilitar edicion real de campanas existentes.
- QA local aprobo la regresion funcional sin P0/P1/P2/P3 nuevos.
- No se autoriza envio real de correos durante esta publicacion.
- No se autoriza cambiar `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se requieren cambios SQL ni migraciones.
- No se cambia ACS, sender, storage, DNS, CORS ni app settings.

Handoffs procesados:
- `tasks/TASK-708-HANDOFF.md`
- `tasks/TASK-709-HANDOFF.md`
- `tasks/TASK-710-HANDOFF.md`
- `tasks/TASK-711-HANDOFF.md`
- `tasks/TASK-712-HANDOFF.md`
- `tasks/TASK-713-HANDOFF.md`
- `tasks/TASK-714-HANDOFF.md`

Decision:
- Aprobar publicacion API/Web.
- Incluir cambios de:
  - `api/src/functions/promotionalCampaigns.js`
  - `api/src/lib/repository.js`
  - `api/test/promotional-campaigns.test.js`
  - `app/index.html`
  - `app/src/app.js`
  - `app/src/customerApi.js`
  - `app/styles.css`
- Incluir handoffs relacionados `TASK-708` a `TASK-715`.
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados.

Alcance aprobado:
- Panel independiente `Crear/Editar campaña`.
- Panel `Enviar campaña` dedicado solo a preparacion/envio.
- Edicion real de campanas existentes en estado editable.
- Gestion de imagen de campana desde el contexto de la campana gestionada.
- Preview actualizado desde la campana seleccionada para envio.
- Seleccion de destinatarios sin mezclar estado con el panel de gestion.
- Bloqueo de campañas no editables/enviadas.
- Reglas existentes de envio, bajas promocionales y limite MVP se mantienen.

Uso Azure SQL:
- No.
- Motivo: decision de release; no hubo migracion ni consulta de datos reales.

Riesgos o pendientes:
- Falta QA publicada con sesion real/controlada contra API/Blob reales.
- El envio real promocional debe seguir sujeto a autorizacion explicita posterior.

Siguiente recomendado:
- Ejecutar `TASK-716` para commit/push controlado y verificar workflows API/Web.
- Luego ejecutar QA publicada focal de `TASK-717` sin enviar correos reales.
