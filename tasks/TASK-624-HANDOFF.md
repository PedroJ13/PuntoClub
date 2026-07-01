Equipo: Infra
Modo de ejecucion: ACS Email / Diagnostico entrega
Tarea completada: TASK-624 - Verificar entrega ACS del correo promocional de prueba

Resultado:
- TASK-622 no encontro `providerMessageId` ni intento enviado por ACS para Fatima Arraiz (`companyId=8`, `customerId=112`, email enmascarado `fa***@gmail.com`).
- No existe fila en `PromotionalCampaignRecipients` para ese destinatario.
- Las campanas recientes de `companyId=8` estan en estado `draft` y con `providerMessages=0`.
- Por tanto, no hay identificador de ACS ni intento de envio persistido que consultar en ACS Email para este caso.

Acciones realizadas:
- No se consulto ACS Email por mensaje especifico porque no hay `providerMessageId`.
- No se reenviaron correos.
- No se cambio sender.
- No se cambiaron secretos.
- No se modifico configuracion.

Estado de entrega:
- `accepted`: no confirmado para Fatima.
- `delivered`: no confirmado para Fatima.
- `bounced`: no confirmado para Fatima.
- `suppressed`: no confirmado para Fatima.
- `throttled`: no confirmado para Fatima.
- Resultado aplicable: sin telemetria disponible para el destinatario solicitado porque el envio no quedo persistido como intento ACS.

Uso Azure SQL:
- Indirecto, por evidencia de TASK-622.
- Esta tarea no ejecuto consultas adicionales a datos de negocio.

Riesgos o pendientes:
- Si se obtiene un `providerMessageId` posterior en una nueva prueba controlada, Infra puede consultar telemetria ACS o logs disponibles para esa ventana.
- El hallazgo apunta a revisar feedback de UI y/o respuesta del endpoint antes de diagnosticar entregabilidad ACS.
