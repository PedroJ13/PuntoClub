Equipo: QA
Tarea validada: TASK-802 - Validar reset de flujo comun publicado
Ambiente: Web publicada `https://puntoclubcr.com/app`, sesion real/controlada iniciada por Product Owner, fecha de validacion 2026-07-07 segun API publicada.
Resultado: aprobado

Checks ejecutados:
- Lectura de handoff TASK-801.
- Recarga de Web publicada para tomar bundle nuevo.
- Validacion de sesion activa.
- Creacion de cliente QA sin correo con fecha de nacimiento `1990-07-07` para activar alerta sin disparar correos operativos.
- Validacion de alerta de cumpleaneros.
- Entrada al flujo dedicado desde `Enviar campaña de cumpleaños`.
- Validacion de campañas/destinatarios en flujo cumpleaños.
- Salida a `Atender cliente` y regreso a `Enviar campañas` desde menu lateral, sin recarga.
- Validacion de flujo comun restaurado desde menu lateral.
- Seleccion rapida en campaña comun y limpieza posterior, sin enviar.
- Reentrada a cumpleaños y regreso por subnav normal `Enviar campañas`, sin recarga.
- Validacion de flujo comun restaurado desde subnav normal.

Hallazgos:
- La alerta publicada aparece con `1 cliente cumple años hoy` y `0 aptos para campaña de cumpleaños`.
- El flujo dedicado de cumpleaños muestra solo campaña `Cumpleaños`.
- El flujo dedicado de cumpleaños no muestra destinatarios elegibles cuando el cumpleañero no tiene correo.
- El boton de envio permanece deshabilitado en cumpleaños con `0 seleccionados de 5`.
- Al volver desde `Atender cliente` al menu lateral `Enviar campañas`, el flujo comun se restablece sin recarga.
- El flujo comun selecciona campaña `Común`, muestra destinatarios normales y permite preparar seleccion sin enviar.
- El subnav normal `Enviar campañas` tambien restablece el flujo comun sin recarga.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- Alerta: `Campanita: 1 cliente cumple años hoy. 0 aptos para campaña de cumpleaños.`
- Flujo cumpleaños: selector con `QA785 ... · Cumpleaños`, 0 tarjetas, texto `No hay destinatarios para este filtro.`, envio deshabilitado.
- Reset por menu lateral: selector con 2 campañas `Común` y 1 `Cumpleaños`; seleccionada `Energía para el Lunes ... · Común`; 20 tarjetas de destinatarios y clientes normales visibles.
- Seleccion comun: `5 seleccionados de 5`, boton `Enviar a 5`; luego limpieza a `0 seleccionados de 5`.
- Reset por subnav normal: despues de reentrar a cumpleaños, subnav `Enviar campañas` selecciona de nuevo `Energía para el Lunes ... · Común` y muestra 20 destinatarios.
- No se presiono el boton de envio en ningun flujo.

Uso DB cloud: Si, motivo y alcance: se uso la Web publicada con sesion real/controlada contra ambiente publicado. Alcance limitado a crear un cliente QA sin correo para activar alerta y a validar navegacion/seleccion visual en UI. No se aplicaron migraciones, no se publicaron cambios, no se ejecuto envio y no se enviaron correos reales.

Riesgos o pendientes:
- Queda un cliente QA sin correo creado en ambiente publicado para esta validacion.
- No se valido envio real por estar fuera de alcance y no contar con autorizacion explicita de envio.

Siguiente recomendado:
- Product / Architect / Release puede cerrar el release de cumpleaños como validado en publicado para el reset del flujo comun.
