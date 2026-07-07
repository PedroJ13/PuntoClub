Equipo: QA
Tarea validada: TASK-794 - Revalidar destinatarios cumpleaneros en ambiente publicado
Ambiente: Web publicada `https://puntoclubcr.com/app`, sesion real/controlada iniciada por Product Owner, fecha de validacion 2026-07-06.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de handoff TASK-793.
- Recarga de Web publicada con sesion activa.
- Validacion de alerta de cumpleaneros del dia.
- Apertura del flujo dedicado desde `Enviar campaña de cumpleaños`.
- Validacion de selector de campañas en flujo de cumpleaños.
- Validacion de destinatarios elegibles en flujo de cumpleaños.
- Busqueda de cliente no cumpleañero dentro del flujo de cumpleaños.
- Validacion de estado del boton de envio en flujo de cumpleaños.
- Validacion de flujo normal de campañas comunes en carga limpia.
- Seleccion rapida en campaña comun y limpieza posterior, sin enviar.

Hallazgos:
- La alerta publicada muestra `2 clientes cumplen años hoy` y `0 aptos para campaña de cumpleaños`.
- El flujo dedicado de cumpleaños muestra solo campañas tipo `cumpleanos`.
- El flujo dedicado de cumpleaños ya no muestra destinatarios no cumpleañeros.
- El listado de destinatarios elegibles de cumpleaños queda en 0, coincidiendo con los 0 aptos de la alerta.
- Al buscar un cliente no cumpleañero dentro del flujo de cumpleaños, el listado permanece vacio y el envio sigue deshabilitado.
- En carga limpia, las campañas comunes mantienen flujo normal: se muestran campañas comunes, destinatarios normales y la seleccion rapida prepara hasta 5 destinatarios sin enviar.

P0/P1:
- Ninguno. El P1 de TASK-785 queda corregido en ambiente publicado.

P2/P3:
- P2: Despues de entrar al flujo dedicado de cumpleaños, navegar fuera y volver a `Enviar campañas` mantuvo el filtro de campañas de cumpleaños hasta recargar la pagina. Workaround: recarga limpia. El flujo comun funciona correctamente despues de recargar.

Evidencia:
- Alerta: `Campanita: 2 clientes cumplen años hoy. 0 aptos para campaña de cumpleaños.`
- Flujo cumpleaños: selector efectivo con 1 campaña y etiqueta `Cumpleaños`; 0 tarjetas de destinatario; texto `No hay destinatarios para este filtro.`
- Busqueda no cumpleañero en flujo cumpleaños: 0 tarjetas, `0 seleccionados de 5`, boton `Enviar campaña` deshabilitado.
- Flujo comun en carga limpia: selector con campañas comunes y campaña de cumpleaños; campaña comun seleccionada con 19 tarjetas, 17 habilitadas y 2 deshabilitadas.
- Seleccion comun: `5 seleccionados de 5`, boton `Enviar a 5`; luego se limpio a `0 seleccionados de 5`.
- No se presiono el boton de envio en ningun flujo.

Uso DB cloud: Si, motivo y alcance: se uso la Web publicada con sesion real/controlada contra ambiente publicado. Alcance read-only funcional y seleccion visual en UI; no se crearon clientes/campañas, no se aplicaron migraciones, no se ejecuto envio y no se enviaron correos reales.

Riesgos o pendientes:
- Queda pendiente decidir si el P2 de persistencia del filtro tras navegar desde cumpleaños requiere ajuste UX/Web.
- No se valido envio real por estar fuera de alcance y no contar con autorizacion explicita de envio.

Siguiente recomendado:
- Product / Architect / Release puede cerrar el P1 de destinatarios cumpleañeros publicado.
- Crear tarea Web Dev focal si se desea que al volver a `Enviar campañas` desde el menu lateral se restablezca siempre el flujo comun sin requerir recarga.
