Equipo: Product / Architect / Release
Modo de ejecucion: Promociones / Redefinicion funcional
Tarea completada: TASK-593 - Redefinir modelo de campanas y envios promocionales

Resultado:
- Se redefine el modelo funcional de promociones separando claramente:
  - Campana / plantilla: contenido reutilizable.
  - Envio: ejecucion puntual con destinatarios elegidos en ese momento.
- El modelo anterior de guardar destinatarios dentro de la campana queda reemplazado para futuras tareas.
- Esta tarea no implementa cambios de codigo, SQL ni configuracion.

Decision funcional:
- Una campana promocional guardada debe representar solo la plantilla del mensaje.
- La campana no debe guardar destinatarios como parte permanente del contenido.
- Al momento de enviar, el usuario debe:
  - elegir una campana guardada;
  - revisar el preview;
  - seleccionar destinatarios desde una lista de clientes;
  - confirmar el envio.
- El envio real debe usar exclusivamente los destinatarios seleccionados en esa accion de envio.

Campana / plantilla debe incluir:
- Nombre interno.
- Asunto.
- Mensaje.
- Placeholders permitidos.
- Configuracion de incluir puntos disponibles.
- Estado de plantilla si aplica: borrador/activa/archivada, segun defina Backend/API y Web.

Envio debe incluir:
- Campana seleccionada.
- Lista de destinatarios seleccionados para ese envio.
- Snapshot de contenido usado al enviar, si Backend/API lo considera necesario para trazabilidad.
- Resultado por destinatario: enviado, fallido u omitido.
- Fecha/hora de ejecucion.
- Actor/empresa de la sesion.

Reglas de destinatarios:
- La pantalla de envio debe mostrar una lista de clientes.
- Los clientes elegibles deben poder marcarse con checkbox.
- Los clientes dados de baja promocional deben aparecer visibles, pero deshabilitados.
- Los clientes dados de baja no se pueden marcar.
- Los clientes dados de baja no deben recibir promociones aunque sean incluidos por error en un payload.
- La API debe revalidar elegibilidad en servidor antes de enviar.
- Clientes sin correo valido o suprimidos deben omitirse de forma controlada.

Acciones rapidas requeridas:
- Seleccionar todos los clientes elegibles.
- Seleccionar clientes elegibles con puntos disponibles.
- Limpiar seleccion.
- Las acciones rapidas no deben seleccionar clientes dados de baja, suprimidos o no elegibles.

Limite MVP:
- Se mantiene por ahora el limite MVP de 5 destinatarios por envio real controlado.
- Motivo: reducir riesgo de spam, costos y errores mientras se valida el flujo real.
- Cualquier aumento del limite requiere decision explicita posterior de Product / Architect / Release.

Reglas de seguridad y alcance:
- El envio real sigue condicionado por feature flag y confirmacion explicita.
- No se permite envio a clientes no seleccionados.
- No se permite envio cross-company.
- No se permite envio sin sesion autenticada de empresa.
- No se cambia el sender: se mantiene Azure/ACS actual por continuidad y costos.
- No se habilita envio masivo general en esta redefinicion.

Impacto esperado en tareas siguientes:
- Diseno / UX debe redisenar el flujo para que no parezca que la campana guarda destinatarios.
- Backend/API debe ajustar contratos para separar plantilla de envio.
- Web Dev debe ajustar UI:
  - lista de campanas guardadas;
  - seleccion de campana;
  - preview;
  - seleccion de destinatarios en el momento del envio;
  - acciones rapidas de seleccion;
  - bajas visibles pero inhabilitadas.
- QA debe validar que guardar campana no guarda destinatarios y que el envio solo alcanza seleccionados.

Uso Azure SQL:
- No.
- Motivo: decision funcional; no se consulto ni modifico DB real.

Riesgos o pendientes:
- Puede requerir cambios API/Web y posiblemente ajuste SQL si el modelo actual persiste destinatarios por campana y no por envio.
- Cuidar migracion/compatibilidad con campanas QA ya creadas durante pruebas anteriores.
- El feature flag de envio real no debe usarse para volumen abierto hasta validar este nuevo flujo.

Siguiente recomendado:
- TASK-594 Diseno / UX para flujo de seleccion de campana y destinatarios al enviar.
- TASK-595 Backend/API para contratos separados de campana y envio.
- TASK-596 Web Dev para UI del nuevo flujo.
- TASK-597 QA local para validar el comportamiento sin correos reales.
