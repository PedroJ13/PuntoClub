Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-747 - Decidir publicacion de subnavegacion Crear / actualizar campanas

Resultado:
- Se revisaron los handoffs `TASK-745` y `TASK-746`.
- No se aprueba publicacion Web en este momento.
- No se ejecuta `TASK-748` porque no hay QA local aprobada ni cambios Web pendientes para publicar.
- No se cambio API, SQL, ACS, sender, flags ni se enviaron correos reales.

Handoffs procesados:
- `tasks/TASK-745-HANDOFF.md`
- `tasks/TASK-746-HANDOFF.md`

Decision:
- Bloquear publicacion Web de esta mejora hasta que exista implementacion Web y QA local aprobada.
- Crear una tarea de Web Dev para implementar la subnavegacion de cuatro vistas.
- Repetir QA local despues de la implementacion.

Motivo:
- `TASK-745` fue una definicion UX/Web UI, sin implementacion de codigo.
- `TASK-746` quedo `no aprobado`.
- Hallazgos P1 de `TASK-746`:
  - falta el cuarto subnav `Crear / actualizar campanas`;
  - el panel `Crear/Editar campana` sigue dentro de `Enviar campanas`;
  - falta accion visible para navegar desde gestion hacia `Enviar campanas`.
- `git status` no muestra cambios Web modificados para publicar.

Alcance confirmado:
- Web/UI solamente cuando se implemente.
- No cambiar API, SQL, ACS, sender ni flags.
- No enviar correos reales.

Uso Azure SQL:
- No.
- Motivo: decision de release y revision de handoffs sin acceso a datos.

Riesgos o pendientes:
- La experiencia actual sigue mezclando gestion de campanas y envio en la misma vista.
- Publicar ahora no cambiaria la Web porque no hay implementacion lista.
- `TASK-748` debe quedar pendiente/no ejecutada hasta que QA local apruebe una implementacion.

Siguiente recomendado:
- Crear tarea Web Dev para implementar:
  - subnavs `Enviar campanas`, `Crear / actualizar campanas`, `Clientes`, `Historial`;
  - mover panel Crear/Editar a la nueva vista;
  - agregar preview tambien en Crear/Actualizar;
  - agregar boton `Ir a Enviar campanas`.
- Crear tarea QA local para validar la implementacion.
