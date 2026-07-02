Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-742 - Decidir publicacion del anti-duplicado real en envio promocional

Resultado:
- Se revisaron `TASK-738` a `TASK-741`.
- Se aprueba publicar API/Web para corregir el anti-duplicado real en envio promocional.
- QA local aprobo el bloqueo anti-duplicado, copy en espanol y flujo normal con cliente nuevo.
- No se enviaron correos reales durante la validacion local.
- No se aprueban cambios SQL, ACS, sender, storage, DNS, CORS, app settings ni feature flags.

Handoffs procesados:
- `tasks/TASK-738-HANDOFF.md`
- `tasks/TASK-739-HANDOFF.md`
- `tasks/TASK-740-HANDOFF.md`
- `tasks/TASK-741-HANDOFF.md`

Decision:
- Aprobar publicacion API/Web.
- Incluir:
  - `api/src/lib/repository.js`
  - `api/test/promotional-campaigns.test.js`
  - `app/src/customerApi.js`
  - `tasks/TASK-738-HANDOFF.md`
  - `tasks/TASK-739-HANDOFF.md`
  - `tasks/TASK-740-HANDOFF.md`
  - `tasks/TASK-741-HANDOFF.md`
  - `tasks/TASK-742-HANDOFF.md`
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados.

Alcance aprobado:
- Bloquear reenvio de la misma campana al mismo cliente.
- No reabrir campanas `sent`/`failed` para preparar destinatarios.
- Mantener bloqueo anti-duplicado por `campaignId + customerId`.
- Mostrar copy en espanol cuando API devuelva duplicado.
- Mantener flujo normal con cliente/campana nueva.

Uso Azure SQL:
- No.
- Motivo: decision de release sin acceso a datos ni migracion.

Riesgos o pendientes:
- Falta QA publicada focal despues de deploy API/Web.
- No se debe enviar correo real durante release; cualquier prueba real posterior debe tener autorizacion explicita del Product Owner y mailbox autorizado.

Siguiente recomendado:
- Ejecutar `TASK-743` para commit/push controlado.
- Luego ejecutar `TASK-744` para QA publicada focal.
