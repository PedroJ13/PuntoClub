Equipo: Product / Architect / Release
Modo de ejecucion: Promociones / Redefinicion UX funcional
Tarea completada: TASK-708 - Separar Crear/Editar campana de Enviar campana

Resultado:
- Se definio la separacion funcional de la pantalla `Enviar campanas` en dos paneles independientes:
  - Panel 1: Crear / Editar campana.
  - Panel 2: Enviar campana.
- Se documento la causa funcional del bug reportado por PO: el estado de imagen/formulario de una campana nueva se mezcla con la campana seleccionada para envio.
- Se dejo como regla que el panel de envio no debe contener el boton `Crear campana`.
- Se dejo como regla que crear/editar campanas y preparar/envio de campanas deben tener estados separados.

Decision:
- Avanzar con implementacion Web local primero.
- No abrir cambios API/SQL/ACS/flags en esta tarea.
- Si Web Dev detecta que el contrato actual no permite separar correctamente crear/editar de enviar, debe devolver el hallazgo para crear tareas Backend/API y SQL especificas.

Alcance definido:
- Crear campana nueva desde formulario limpio.
- Editar campana existente cargandola en el formulario de edicion.
- Agregar, visualizar, reemplazar o eliminar imagen desde el contexto de la campana que se esta creando/editando.
- Enviar campana solo desde seleccion de una campana ya guardada.
- Mantener preview, destinatarios, bajas promocionales, historial y limite MVP vigente.

Reglas clave:
- Una imagen seleccionada para una campana nueva no puede asociarse a otra campana seleccionada para envio.
- El panel de envio no debe compartir estado de formulario ni imagen con el panel Crear/Editar.
- Despues de crear una campana, debe aparecer en la lista de envio.
- La campana seleccionada para envio controla preview y destinatarios.

Uso Azure SQL:
- No.
- Motivo: redefinicion funcional y documentacion; sin consultas ni cambios de datos.

Cambios de archivos:
- `tasks/TASK-708.md`
- `tasks/TASK-708-HANDOFF.md`

Tareas siguientes recomendadas:
- `TASK-709`: Web Dev implementa panel independiente Crear/Editar campana.
- `TASK-710`: Web Dev ajusta panel Enviar campana para solo preparar/envio.
- `TASK-711`: QA valida regresion local de separacion Crear/Editar vs Enviar.

Riesgos o pendientes:
- P1 funcional hasta corregir: una imagen puede terminar asociada a una campana equivocada si se mantiene el flujo actual.
- Falta validar si los endpoints actuales soportan bien update de campana e imagen sin cambios API/SQL.
- No se deben hacer pruebas de envio real durante esta correccion.

Siguiente recomendado:
- Entregar TASK-709 y TASK-710 a Web Dev en la misma ventana porque son secuenciales y del mismo equipo.
- Luego entregar TASK-711 a QA local.
