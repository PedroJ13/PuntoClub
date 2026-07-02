Nombre del Equipo: Product / Architect / Release
Modo: Promociones / Redefinicion UX funcional
Nombre de la tarea: TASK-708 - Separar Crear/Editar campana de Enviar campana

Contexto:
- El Product Owner confirmo que, al crear una campana nueva mientras otra campana existente esta seleccionada en el panel de envio, la imagen se termina guardando en la campana seleccionada de la lista y no en la campana nueva.
- La causa funcional probable es que la pantalla mezcla en el mismo bloque el estado de seleccion para envio con el estado de creacion/edicion de campana.
- Esto genera riesgo operativo alto porque una imagen, texto o configuracion podria asociarse a una campana equivocada.

Decision funcional:
- Separar la pantalla `Enviar campanas` en dos paneles independientes.

Panel 1: Crear / Editar campana
- Debe aparecer antes del panel de envio.
- Debe permitir crear campanas nuevas desde cero.
- Debe permitir seleccionar una campana existente desde una lista que contenga todas las campanas de la empresa.
- Si se selecciona una campana existente, sus datos deben cargarse en el formulario de edicion.
- Si se presiona `Crear campana` o equivalente, el formulario debe quedar limpio:
  - nombre interno vacio;
  - asunto vacio;
  - mensaje vacio o con plantilla base definida;
  - incluir puntos segun default definido;
  - imagen limpia, sin preview heredado;
  - sin errores heredados.
- El formulario debe permitir editar:
  - nombre interno;
  - asunto;
  - mensaje;
  - placeholders permitidos;
  - incluir puntos disponibles;
  - imagen de campana.
- La imagen debe poder:
  - visualizarse si ya existe;
  - agregarse si no existe;
  - reemplazarse si la campana es editable;
  - eliminarse si la campana es editable.
- Al guardar una campana nueva, esta debe aparecer inmediatamente en la lista del panel de envio y quedar seleccionable.
- Al actualizar una campana existente, el panel de envio debe reflejar la version actualizada si esa campana esta seleccionada.

Panel 2: Enviar campana
- Debe quedar dedicado solamente a preparar y ejecutar el envio.
- Debe eliminar el boton `Crear campana` de este panel.
- Debe permitir buscar y seleccionar una campana existente.
- Debe usar la campana seleccionada solo para:
  - preview;
  - seleccion de destinatarios;
  - confirmacion de envio;
  - envio real si el feature flag y reglas lo permiten.
- No debe compartir estado de formulario ni estado de imagen con el panel Crear/Editar.
- No debe permitir que una imagen seleccionada en Crear/Editar se guarde sobre la campana seleccionada para envio.

Paneles existentes que se mantienen:
- Preview.
- Seleccion de destinatarios/clientes.
- Historial.
- Reglas de baja promocional.
- Limite MVP vigente de destinatarios, salvo decision posterior.

Reglas de seguridad y alcance:
- No enviar correos reales durante esta redefinicion.
- No cambiar `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No cambiar sender ACS.
- No cambiar SQL ni API salvo que Web Dev confirme que el contrato actual no permite separar correctamente crear/editar de enviar.
- Si se requiere API/SQL adicional, debe volver a Product / Architect / Release para crear tareas separadas.

Criterios de aceptacion funcional:
- Crear una campana nueva con imagen guarda la imagen en esa campana nueva.
- Editar una campana existente con imagen actualiza esa misma campana, no otra.
- Seleccionar una campana para envio no modifica el formulario de crear nueva salvo que el usuario elija editarla en Panel 1.
- Limpiar o cambiar imagen en Panel 1 no afecta la campana seleccionada para envio hasta guardar explicitamente la campana correspondiente.
- Despues de crear una campana, aparece en la lista del Panel 2.
- Preview y destinatarios usan siempre la campana seleccionada en Panel 2.

Al finalizar, debe crear o actualizar tasks/TASK-708-HANDOFF.md usando el formato de handoff indicado en la tarea.
