Nombre del Equipo: Product / Architect / Release
Modo: Promociones / Error handling
Nombre de la tarea: TASK-733 - Definir manejo de destinatario duplicado en envio promocional

Contexto:
- Durante pruebas de envio promocional, la UI mostro el mensaje tecnico en ingles:
  - `Promotional recipient is already selected for this campaign.`
- El caso no significa que el correo fallo.
- Significa que el cliente ya estaba asociado a esa campana promocional y el sistema bloqueo repetirlo para evitar duplicados.
- El bloqueo anti-duplicado por campana debe mantenerse.

Decision funcional:
- Mantener bloqueo anti-duplicado por campana.
- No permitir reenvio al mismo cliente dentro de la misma campana sin decision explicita futura.
- Interpretar el caso como seleccion/envio previo, no como fallo tecnico.
- La UI debe mostrar un mensaje claro en espanol, sin texto tecnico de API.

Regla esperada:
- Si un cliente ya esta asociado a una campana, no se debe insertar de nuevo.
- Si la empresa quiere volver a enviar la misma promocion al mismo cliente, debe:
  - crear una nueva campana;
  - duplicar la campana cuando exista esa funcionalidad;
  - o seleccionar otra campana existente distinta.
- No se debe borrar historial automaticamente.
- No se debe relajar el indice unico ni permitir duplicados silenciosos.

Copy recomendado:
- Para caso general:
  - `Este cliente ya fue incluido en esta campana. Para volver a enviarle una promocion, crea una nueva campana o selecciona otra.`
- Si el cliente estaba preparado pero aun no enviado:
  - `Este cliente ya esta preparado para esta campana. Revisa la seleccion actual antes de continuar.`
- Si el cliente ya fue enviado:
  - `Este cliente ya recibio esta campana. Para reenviarle, crea una nueva campana.`
- Fallback seguro:
  - `No pudimos preparar ese destinatario porque ya estaba incluido en esta campana.`

Estado visual esperado:
- Mostrar el mensaje en el panel `Resultado`.
- Usar estilo de advertencia o informacion, no error critico.
- No mostrar stack traces ni mensajes tecnicos en ingles.
- Mantener visible la campana seleccionada.
- Mantener visible la lista de destinatarios.
- Si aplica, refrescar destinatarios/historial para que el usuario entienda el estado actual.

Alcance fuera de esta decision:
- No cambiar API/SQL.
- No cambiar reglas de envio.
- No cambiar `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No enviar correos reales.
- No implementar duplicar campana en esta tarea.

Criterios de aceptacion:
- El mensaje tecnico `Promotional recipient is already selected for this campaign.` no debe aparecer en la UI.
- El usuario debe entender que el cliente ya estaba incluido.
- El bloqueo anti-duplicado debe seguir activo.
- El flujo normal con clientes nuevos debe seguir funcionando.

Al finalizar, debe crear o actualizar tasks/TASK-733-HANDOFF.md usando el formato de handoff indicado en la tarea.
