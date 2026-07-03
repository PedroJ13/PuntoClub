Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-751 - Decidir publicacion de subnavegacion Crear / actualizar campanas implementada

Resultado:
- Se revisaron `TASK-749` y `TASK-750`.
- Se aprueba publicar Web para la subnavegacion `Crear / actualizar campanas` implementada.
- QA local aprobo los cuatro subnavs, la separacion de gestion/envio, los previews y el boton `Ir a Enviar campanas`.
- Alcance confirmado: Web/UI solamente.
- No se aprueban cambios API, SQL, ACS, sender, storage, DNS, CORS, app settings ni feature flags.
- No se aprueba enviar correos reales durante el release.

Handoffs procesados:
- `tasks/TASK-749-HANDOFF.md`
- `tasks/TASK-750-HANDOFF.md`

Decision:
- Aprobar publicacion Web.
- Incluir:
  - `app/index.html`
  - `app/src/app.js`
  - `tasks/TASK-749-HANDOFF.md`
  - `tasks/TASK-750-HANDOFF.md`
  - `tasks/TASK-751-HANDOFF.md`
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados.

Alcance aprobado:
- Mostrar cuatro subnavs en Comunicaciones:
  - `Enviar campanas`
  - `Crear / actualizar campanas`
  - `Clientes`
  - `Historial`
- Mover `Crear/Editar campana` al subnav `Crear / actualizar campanas`.
- Mantener en `Enviar campanas` selector de campana, preview, destinatarios y envio.
- Mantener preview en `Enviar campanas` y agregar preview de edicion en `Crear / actualizar campanas`.
- Agregar boton `Ir a Enviar campanas` y seleccionar la campana gestionada cuando aplique.

Uso Azure SQL:
- No.
- Motivo: decision de release y revision de handoffs sin acceso a datos.

Riesgos o pendientes:
- Falta QA publicada focal despues del deploy.
- P3 observado por QA local: despues de seleccionar destinatarios, el panel de resultado muestra estado de seleccion. No bloquea el release, pero conviene vigilar que no se confunda con resultado post-envio.

Siguiente recomendado:
- Ejecutar `TASK-752` para commit/push controlado y verificar workflow Web.
- Luego crear QA publicada focal para validar la subnavegacion en ambiente publicado.
