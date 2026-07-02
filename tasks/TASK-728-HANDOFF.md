Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-728 - Decidir publicacion del fix imagen en correo promocional

Resultado:
- Se revisaron `TASK-725` a `TASK-727`.
- Se aprueba publicar el fix API para que la imagen de campana promocional se renderice en el correo con URL absoluta HTTPS publica.
- QA local/mock aprobo render con imagen y sin imagen.
- No se aprueban cambios Web, SQL, ACS, sender, storage, DNS, CORS, app settings ni feature flags.
- No se autoriza envio real de correos durante el release.

Handoffs procesados:
- `tasks/TASK-725-HANDOFF.md`
- `tasks/TASK-726-HANDOFF.md`
- `tasks/TASK-727-HANDOFF.md`

Decision:
- Aprobar publicacion API.
- Incluir:
  - `api/src/functions/promotionalCampaigns.js`
  - `api/test/promotional-campaigns.test.js`
  - `tasks/TASK-725-HANDOFF.md`
  - `tasks/TASK-726-HANDOFF.md`
  - `tasks/TASK-727-HANDOFF.md`
  - `tasks/TASK-728-HANDOFF.md`
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados.

Alcance aprobado:
- El HTML de correo promocional debe usar `src` absoluto HTTPS para imagen de campana.
- La URL debe apuntar al dominio API publico, por ejemplo:
  - `https://api.puntoclubcr.com/api/public/promotional-campaign-images/{publicId}`
- No debe quedar `src="/api/public/..."`.
- El correo sin imagen debe seguir funcionando.

Uso Azure SQL:
- No.
- Motivo: decision de release API sin cambios de datos ni migracion.

Riesgos o pendientes:
- Falta QA publicada/end-to-end con una campana con imagen activa vigente y un mailbox autorizado.
- No se debe hacer envio promocional real durante la publicacion.

Siguiente recomendado:
- Ejecutar `TASK-729` para commit y push controlado del fix API.
- Luego ejecutar `TASK-730` si Product Owner autoriza una prueba real controlada de correo con imagen.
