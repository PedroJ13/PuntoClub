Equipo: QA
Tarea validada: TASK-785 - Validar cumpleanos en ambiente publicado
Ambiente: Web publicada `https://puntoclubcr.com/app`, sesion real/controlada iniciada por Product Owner, fecha de validacion 2026-07-06.
Resultado: no aprobado

Checks ejecutados:
- Login publicado con sesion real/controlada provista por Product Owner.
- Registro publicado de cliente QA con fecha de nacimiento `1990-07-06` y sin correo, para evitar correo operativo real.
- Registro publicado de cliente QA sin fecha de nacimiento y sin correo.
- Validacion de indicador `Datos incompletos: agrega fecha de nacimiento.` en cliente sin fecha.
- Actualizacion publicada de fecha desde ficha de cliente a `1991-07-06`.
- Recarga con sesion activa para validar alerta de cumpleaneros del dia.
- Validacion de selector de tipo de campana con opciones `Común` y `Cumpleaños`.
- Creacion publicada de campana QA tipo `cumpleanos` sin imagen.
- Validacion de preview de campana de cumpleaños.
- Entrada al flujo dedicado desde `Enviar campaña de cumpleaños`.
- Validacion de selector de campanas en flujo de cumpleaños.
- Validacion visual del listado de destinatarios en flujo de cumpleaños.
- No se presiono el boton de envio.

Hallazgos:
- El registro de cliente publicado ya no falla despues del hotfix API: cliente con fecha se creo correctamente.
- Cliente sin fecha se creo correctamente y mostro indicador de datos incompletos.
- La actualizacion de fecha desde ficha funciono y elimino el indicador de datos incompletos.
- La alerta de cumpleaneros aparece al cargar con sesion activa.
- El selector de tipo de campana incluye `Común` y `Cumpleaños`.
- La campana tipo `cumpleanos` se guardo correctamente y el preview reflejo asunto/mensaje de la campana.
- El flujo dedicado de cumpleaños muestra solo campanas tipo `cumpleanos`.
- El flujo dedicado de cumpleaños no limita correctamente los destinatarios a cumpleaneros del dia.

P0/P1:
- P1: El flujo publicado de cumpleaños muestra destinatarios que no corresponden al total de cumpleaneros del dia. La alerta indica `2 clientes cumplen años hoy`, pero el listado de destinatarios del flujo de cumpleaños muestra 19 tarjetas. Esto contradice el mensaje visible `Mostrando solo campañas de cumpleaños y clientes que cumplen años hoy` y el criterio de TASK-785 de limitar destinatarios a cumpleaneros.

P2/P3:
- Ninguno.

Evidencia:
- Alta de cliente QA con fecha: ficha seleccionada con `birthDate=1990-07-06`.
- Alta de cliente QA sin fecha: ficha con indicador `Datos incompletos: agrega fecha de nacimiento.`
- Actualizacion de fecha: estado `Fecha de nacimiento actualizada.`, `birthDate=1991-07-06`, indicador removido.
- Alerta publicada: `Campanita: 2 clientes cumplen años hoy. 0 aptos para campaña de cumpleaños.`
- Campana creada: selector de gestion muestra campana QA con etiqueta `Cumpleaños`.
- Flujo cumpleaños: selector de envio contiene 1 campana efectiva y es `Cumpleaños`; no aparece campana `Común`.
- Flujo cumpleaños: listado de destinatarios muestra 19 tarjetas, no 2.
- Estado de envio al cierre: `0 seleccionados de 5`, boton `Enviar campaña` deshabilitado.

Uso DB cloud: Si, motivo y alcance: se uso la Web publicada con sesion real/controlada, por lo que las acciones operaron contra el ambiente publicado y su base de datos real. Alcance limitado a crear dos clientes QA sin correo, actualizar fecha de uno y crear una campana QA tipo cumpleaños. No se envio correo real ni se ejecuto envio promocional.

Riesgos o pendientes:
- Riesgo funcional: una campana de cumpleaños publicada podria seleccionar destinatarios que no cumplen años hoy si el usuario interactua con el listado actual.
- Quedan datos QA creados en ambiente publicado: dos clientes QA sin correo y una campana QA de cumpleaños.
- No se valido envio real ni recepcion de correos; estaba fuera de alcance y no hubo autorizacion explicita para enviar.

Siguiente recomendado:
- Backend/API o Web Dev debe corregir el filtro publicado de destinatarios para campañas de cumpleaños y revalidar que `birthdayOnly=true` o su equivalente limite la lista a cumpleaneros del dia.
- Reintentar QA publicado focal despues del fix, usando los datos QA existentes o nuevos datos sin correo para evitar envios reales.
