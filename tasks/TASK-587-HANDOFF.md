Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-587 - Decidir publicacion de envio real promocional controlado

Resultado:
- Se revisaron `TASK-584`, `TASK-585` y `TASK-586`.
- QA local aprobo el paquete de envio real promocional controlado sin usar ACS real ni enviar correos reales.
- Se aprueba publicar API/Web con la capacidad de envio real promocional controlado.
- La publicacion no equivale a apertura general de campanas masivas.

Decision:
- Aprobado avanzar a release controlado de API/Web.
- El envio real debe permanecer condicionado por `PROMOTIONAL_EMAIL_SEND_ENABLED=true`.
- El feature flag solo debe activarse para prueba controlada del Product Owner.
- La prueba real debe ejecutarse desde la Web publicada, no por scripts ni llamadas directas de otros chats, salvo tarea explicita posterior.
- Mantener Azure/ACS actual como sender por continuidad y costos.

Condiciones obligatorias:
- Envio solo a destinatarios seleccionados y guardados en la campana.
- No enviar a clientes no seleccionados.
- No enviar a clientes dados de baja/suppressed.
- Mantener limite MVP de 5 destinatarios.
- Exigir confirmacion explicita previa al envio.
- Exigir sesion autenticada de empresa y bloqueo cross-company.
- Registrar resultado por destinatario: `sent`, `failed` o `skipped`.

Evidencia revisada:
- `TASK-584`: decision funcional de permitir habilitacion controlada, con regla de destinatarios seleccionados.
- `TASK-585`: Ejecucion Tecnica implemento controles server-side y Web; no envio correos reales.
- `TASK-586`: QA local aprobado.
  - API focal: 21/21 OK.
  - API completo: 154/154 OK.
  - Prettier OK.
  - Web local/mock: confirmacion previa, seleccion, envio mock, resumen e historial.
  - Seguridad local: sin sesion `401`, empresa distinta `403`, sin `confirmSend` rechazado.

Uso Azure SQL:
- No.
- Motivo: decision de release basada en handoffs y QA local; no se consulto ni modifico DB real.

Riesgos o pendientes:
- Falta commit/push/deploy API/Web del paquete `TASK-585`.
- Falta configurar `PROMOTIONAL_EMAIL_SEND_ENABLED=true` solo cuando se autorice la prueba PO.
- Falta QA publicado/controlado antes o durante la prueba real para confirmar que el ambiente desplegado conserva:
  - seguridad por sesion;
  - bloqueo cross-company;
  - confirmacion explicita;
  - envio solo a seleccionados;
  - bajas promocionales omitidas.
- No se ha ejecutado prueba real de correo promocional.

Siguiente recomendado:
- Crear tarea de release para commit/push de API/Web y handoffs `TASK-584` a `TASK-587`.
- Crear tarea Infra/API para activar el flag solo en ventana de prueba PO, si no se incluye dentro del release controlado.
- Crear tarea PO Test/QA para prueba real con destinatarios controlados.
