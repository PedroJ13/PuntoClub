Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-626 - Decidir publicacion del feedback visible de envio promocional

Resultado:
- Se revisaron los handoffs `TASK-622`, `TASK-623`, `TASK-624` y `TASK-625`.
- Se aprueba publicar el ajuste UX de feedback visible de envio promocional antes de repetir la prueba real.
- La decision es publicar solo Web/trazabilidad, sin cambios API, SQL, ACS, secretos ni feature flags.

Hallazgos procesados:
- `TASK-622` confirmo que no hubo envio real persistido para Fatima Arraiz:
  - no existe fila en `dbo.PromotionalCampaignRecipients` para `companyId=8`, `customerId=112`;
  - no hay `providerMessageId`;
  - no hay `lastError`, `skippedReason`, `sentAt` ni `updatedAt` de destinatario;
  - las campanas recientes de `companyId=8` estaban en `draft` y sin destinatarios procesados.
- `TASK-624` confirmo que ACS no tenia telemetria aplicable porque no existia intento persistido ni `providerMessageId`.
- `TASK-623` implemento feedback visible/persistente en Web:
  - resumen de enviados, fallidos y omitidos;
  - detalle por destinatario cuando el API devuelve `recipients`;
  - foco/scroll al resultado o error;
  - mensajes de error seguros del API.
- `TASK-625` aprobo QA local en mock controlado:
  - resultado exitoso visible y persistente;
  - foco en el mensaje de resultado;
  - seleccion limpiada luego del envio mock;
  - error visible y enfocado en caso negativo;
  - sin uso de API publicada, Azure SQL ni ACS real.

Decision:
- Publicar el ajuste UX de `TASK-623`.
- Repetir la prueba real de envio promocional solo despues de que la publicacion Web este confirmada.
- Mantener la prueba real limitada a destinatarios autorizados por Product Owner.

Confirmaciones de alcance:
- No se reenvian correos desde esta decision.
- No se activa ni desactiva `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se modifica sender ACS.
- No se ejecutan migraciones SQL.
- No se modifican datos de clientes, preferencias, puntos, compras, canjes ni membresias.

Riesgos aceptados:
- QA local no observo una lista real con destinatarios `failed` o `skipped` no-cero; el mock disponible devolvio solo destinatarios `sent`.
- La validacion publicada debe confirmar que los assets Web actualizados estan disponibles antes de repetir prueba real.
- Si la prueba real vuelve a fallar, el nuevo feedback debe permitir diferenciar entre error API, cero destinatarios procesados, fallidos u omitidos.

Uso Azure SQL:
- No directo en esta tarea.
- Se proceso evidencia de `TASK-622`, que si consulto Azure SQL en modo read-only.

Siguiente recomendado:
- Ejecutar `TASK-627` para commit y push controlado del ajuste Web y handoffs relacionados.
