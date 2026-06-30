Equipo: Product / Architect / Release
Modo de ejecucion: Release closure
Tarea completada: TASK-581 - Cerrar paquete publicado de promociones MVP sin envio real

Resultado:
- Se procesaron los handoffs `TASK-579` y `TASK-580`.
- El paquete publicado de promociones MVP queda cerrado como validado para el alcance aprobado: preparar campanas, seleccionar destinatarios, preview, historial, baja promocional y controles de seguridad basicos.
- El envio real promocional sigue bloqueado y no fue habilitado.
- No se enviaron correos promocionales reales.

Validacion publicada revisada:
- Web publicada con sesion real/controlada:
  - Empresa autenticada visible: `Aurisbel Pasteleria`.
  - Usuario de sesion visible.
  - Indicador `Datos reales`.
  - Modulo `Enviar campanas` disponible.
- Flujo visible de promociones:
  - Formulario de campana cargado.
  - Preview visible y sin error.
  - Boton `Envio real bloqueado` visible/deshabilitado.
  - Tab `Clientes` carga destinatarios suscritos.
  - Se selecciono un destinatario controlado sin reproducir el `500` anterior.
  - Tab `Historial` carga filas visibles.
  - Baja promocional funciona visualmente y remueve al cliente de suscritos.
- Seguridad publicada:
  - Endpoints de promociones sin sesion responden `401 UNAUTHORIZED`.
  - Con sesion real/controlada de `companyId=8`, intentar acceder a promociones de `companyId=9` responde error controlado `FORBIDDEN`.
  - No se observo acceso cross-company en el check puntual de `TASK-580`.

Estado final de P0/P1:
- P0 de acceso/modificacion de promociones sin sesion: cerrado.
- P1 de seleccion de destinatarios con `500 INTERNAL_ERROR`: cerrado en QA publicado funcional.
- P1 de uso de `companyId` publico antes de sesion: cerrado por validacion Web publicada con empresa autenticada y check puntual cross-company.
- No quedan P0/P1 abiertos para el paquete publicado de promociones MVP sin envio real.

Datos de prueba y trazabilidad:
- Durante `TASK-579`, `Fatima Arraiz` quedo en baja promocional por prueba controlada.
- No se borro ni restauro ese estado en esta tarea.
- Si Product Owner requiere que `Fatima Arraiz` vuelva a estar suscrita, debe abrirse una tarea controlada de restauracion.

Confirmacion de alcance:
- Este cierre no habilita envio real de promociones.
- Este cierre no autoriza campanas masivas.
- El sender sigue siendo el actual de Azure/ACS por decisiones previas de costo.
- Cualquier habilitacion de envio real promocional requiere decision explicita posterior.

Uso DB cloud:
- No directo desde esta tarea.
- Motivo: tarea de cierre basada en handoffs QA publicados.
- Referencia: `TASK-579` uso Web publicada con sesion y realizo writes controlados de seleccion/baja; `TASK-580` realizo solo requests GET de verificacion de acceso.

Riesgos o pendientes:
- Envio real promocional permanece fuera de alcance.
- Pendiente opcional: decidir si se restaura la suscripcion promocional de `Fatima Arraiz`.
- Pendiente de higiene: commitear handoffs de cierre `TASK-578` a `TASK-581` excluyendo `debug.log`.

Siguiente recomendado:
- Ejecutar `TASK-582` para commit de handoffs de cierre.
