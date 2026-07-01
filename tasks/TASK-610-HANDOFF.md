Equipo: Diseno / UX
Tarea completada: TASK-610 - Refinar UX de campanas guardadas y seleccion de destinatarios

Flujo revisado:
- `Enviar campanas` dentro del centro de comunicaciones.
- Seleccion de campana guardada.
- Creacion de campana nueva.
- Preview de campana seleccionada.
- Seleccion manual y rapida de destinatarios.

Friccion detectada:
- La lista de campanas como botones/cards escala mal cuando existan muchas campanas.
- El formulario de campana siempre visible mezcla dos intenciones:
  - elegir una campana existente;
  - crear una campana nueva.
- El preview podia percibirse como dependiente del formulario y no de la campana seleccionada.
- Los botones de seleccion rapida compiten visualmente con el contador.
- Las filas de clientes estaban altas por mostrar email separado y repetir motivo de baja aunque el badge ya lo indicaba.

Criterio UX definido:
- Campanas guardadas:
  - usar selector desplegable como control principal;
  - agregar busqueda por nombre/asunto para cuando la lista crezca;
  - mantener una campana seleccionada como contexto unico del envio.
- Crear campana:
  - mostrar un boton `Crear campana`;
  - el boton abre/cierra el formulario;
  - el formulario representa solo un nuevo borrador, no edicion de la seleccion actual;
  - al guardar, la nueva campana queda seleccionada automaticamente;
  - luego el formulario puede colapsarse para devolver foco al envio.
- Preview:
  - permanecer visible en la vista de envio;
  - mostrar siempre la campana seleccionada;
  - si no hay seleccion, mostrar estado neutro.
- Destinatarios:
  - agrupar acciones rapidas junto al contador:
    - `Seleccionar elegibles`
    - `Con puntos`
    - `Limpiar seleccion`
  - compactar filas:
    - nombre y email en el mismo bloque;
    - puntos como columna corta;
    - badge de estado visible;
    - no repetir texto de baja promocional si ya existe badge `Baja promocional`;
    - conservar motivo cuando agrega informacion distinta, por ejemplo `Sin correo`.

Severidad UX:
- P2.
- No bloquea funcionalidad, pero reduce claridad para el flujo de envio controlado y puede crecer mal con varias campanas.

Recomendacion:
- Implementar como ajuste visual/local sin cambiar reglas backend.
- No habilitar envio real.
- Mantener confirmacion y feature flag existentes.
- No agregar reenvio ni edicion de campanas en esta iteracion.

Uso Azure SQL:
- No.
- Motivo: definicion UX sin necesidad de datos reales.

Riesgos o pendientes:
- Validar con QA visual en desktop/mobile que el selector, preview y filas compactas no generen solapamientos.
- Evaluar edicion de campanas en una tarea futura si Product lo solicita.
