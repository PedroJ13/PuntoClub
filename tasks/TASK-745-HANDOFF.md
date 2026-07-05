Equipo: Ejecucion Tecnica
Modo de ejecucion: Diseno / UX
Tarea completada: TASK-745 - Reorganizar subnavegacion de campanas promocionales

Resultado:
- Se definio la reorganizacion UX de la pantalla `Enviar campañas` para separar gestion de campanas, envio, clientes e historial.
- Alcance de esta tarea: definicion UX/Web UI solamente.
- No se implemento codigo en esta tarea porque el modo asignado es Diseno / UX.
- No se cambio API, SQL, ACS, sender, flags ni se enviaron correos reales.

Problema UX actual:
- La subnavegacion visible tiene tres opciones: `Enviar campañas`, `Clientes`, `Historial`.
- El panel `Crear/Editar campaña` vive actualmente dentro de la vista `Enviar campañas`.
- Esto mezcla dos trabajos distintos:
  - administrar plantillas/campanas;
  - preparar un envio con destinatarios.
- La mezcla aumenta confusion al guardar campana, editar imagen y luego enviar.

Subnavegacion propuesta:
- `Enviar campañas`
- `Crear / actualizar campañas`
- `Clientes`
- `Historial`

Vista `Enviar campañas`:
- Debe conservar solamente:
  - selector/buscador de campana existente;
  - preview de la campana seleccionada;
  - panel de destinatarios/clientes elegibles;
  - acciones rapidas de seleccion;
  - boton `Enviar campaña`;
  - panel `Resultado`.
- No debe mostrar:
  - boton `Nueva campaña`;
  - selector `Campaña para editar`;
  - formulario de nombre/asunto/mensaje;
  - bloque de imagen editable;
  - boton de guardar campana.
- El preview debe mantenerse visible como parte del flujo de envio, idealmente colapsable como hoy para no saturar la seleccion de destinatarios.

Vista `Crear / actualizar campañas`:
- Debe contener todo el flujo de gestion:
  - selector de campana existente para editar;
  - boton `Nueva campaña`;
  - boton/accion `Refrescar lista`;
  - formulario de nombre interno, asunto, destinatarios, incluir puntos y mensaje;
  - bloque `Imagen opcional` completo: agregar, previsualizar, reemplazar, eliminar y errores;
  - boton de guardar borrador/cambios;
  - preview de la campana que se esta creando/editando.
- Debe incluir un boton claro para continuar:
  - Texto recomendado: `Ir a Enviar campañas`.
  - Comportamiento: cambia al subnav `Enviar campañas` y deja seleccionada para envio la campana creada/editada cuando aplique.
- El preview de esta vista debe reflejar la campana gestionada, no necesariamente la campana seleccionada para envio.
- Si no hay campana guardada todavia, el preview puede mostrar el borrador textual del formulario o un estado vacio claro:
  - `Guarda la campaña para generar el preview final y agregar imagen.`

Vista `Clientes`:
- Debe mantener el listado/filtro de clientes y preferencias promocionales como consulta operativa.
- No debe duplicar acciones de envio si el usuario no esta en `Enviar campañas`.
- Puede conservar buscador/filtros y acciones de baja promocional controlada.

Vista `Historial`:
- Debe mantener historial local/resultados de campanas sin permitir reenvio en MVP.
- Debe seguir mostrando estado de enviados, fallidos u omitidos.

Jerarquia visual recomendada:
- En `Enviar campañas`, orden recomendado:
  1. Campana seleccionada.
  2. Preview.
  3. Seleccionar destinatarios.
  4. Resultado / enviar.
- En `Crear / actualizar campañas`, orden recomendado:
  1. Selector de campana o accion nueva.
  2. Formulario de contenido.
  3. Imagen opcional.
  4. Preview.
  5. Guardar y `Ir a Enviar campañas`.

Estados esperados:
- Crear nueva campana:
  - formulario limpio;
  - imagen limpia/deshabilitada hasta guardar si el contrato actual lo requiere;
  - preview no debe arrastrar imagen ni texto de otra campana.
- Editar campana existente:
  - formulario carga datos de la campana gestionada;
  - imagen asociada corresponde a la campana gestionada;
  - guardar cambios actualiza listas de gestion y envio.
- Ir a Enviar campañas:
  - si la campana gestionada tiene `id`, queda seleccionada en el selector de envio;
  - preview de envio se actualiza;
  - destinatarios siguen sin seleccionarse automaticamente.
- Enviar campañas:
  - no permite crear/editar desde esa vista;
  - no muestra formularios de gestion;
  - mantiene bloqueo anti-duplicado y mensajes existentes.

Criterios de aceptacion para Web Dev:
- La subnavegacion muestra exactamente cuatro opciones: `Enviar campañas`, `Crear / actualizar campañas`, `Clientes`, `Historial`.
- `Crear/Editar campaña` ya no aparece dentro de `Enviar campañas`.
- `Enviar campañas` conserva selector de campana existente, preview, destinatarios y envio.
- `Crear / actualizar campañas` contiene selector de edicion, nueva campana, formulario, imagen, guardado y preview.
- El boton `Ir a Enviar campañas` navega a la vista de envio y deja seleccionada la campana recien creada/editada si existe.
- El preview de gestion y el preview de envio no se pisan con estados de campanas distintas.
- No se habilita envio real por cambios de UI.
- No se cambia API, SQL, ACS, sender ni flags.

Uso Azure SQL:
- No.
- Motivo: definicion UX sin consultas ni cambios de datos.

Correos reales / flags:
- No se enviaron correos reales.
- No se activo ni desactivo `PROMOTIONAL_EMAIL_SEND_ENABLED`.

Archivos revisados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`

Riesgos o pendientes:
- Requiere tarea Web Dev para implementacion local.
- Requiere QA posterior para validar que crear/editar no contamina la campana seleccionada para envio.
- `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md` y `tasks/TASK-745.md` no existen en este checkout; se uso como fuente la tarea pegada por Product Owner.
