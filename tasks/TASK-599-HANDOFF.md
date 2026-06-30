Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-599 - Decidir publicacion del nuevo flujo de campanas y envios

Resultado:
- Se revisaron `TASK-593` a `TASK-598`.
- QA local aprobo el nuevo flujo de campanas/plantillas y seleccion de destinatarios al enviar.
- Infra pauso el flag de envio real promocional antes de publicar.
- Se aprueba publicar API/Web del nuevo flujo.
- La publicacion debe hacerse sin reactivar `PROMOTIONAL_EMAIL_SEND_ENABLED`.

Decision:
- Aprobado publicar el nuevo flujo API/Web.
- Mantener `PROMOTIONAL_EMAIL_SEND_ENABLED=false` durante el deploy y QA publicado.
- No ejecutar envios reales en esta publicacion.
- Reabrir la ventana de prueba PO solo con tarea/decision posterior.

Alcance aprobado:
- Separacion funcional:
  - Campana/plantilla: nombre interno, asunto, mensaje, placeholders e incluir puntos.
  - Envio: seleccion de una campana guardada + seleccion de destinatarios en ese momento.
- La campana guardada no debe guardar destinatarios permanentes.
- El envio usa solo destinatarios seleccionados en la accion actual.
- Dados de baja visibles pero deshabilitados.
- Acciones rapidas:
  - seleccionar elegibles;
  - seleccionar clientes con puntos;
  - limpiar seleccion.
- Mantener limite MVP de 5 destinatarios por envio real controlado.

Evidencia revisada:
- `TASK-593`: decision funcional de separar campana/plantilla y envio.
- `TASK-594`: UX definido y aplicado localmente.
- `TASK-595`: API ajustada para recibir `customerIds` en el payload de envio junto con `confirmSend`.
- `TASK-596`: UI implementada para elegir campana y seleccionar destinatarios al enviar.
- `TASK-597`: QA local aprobado.
  - Focal API: 21/21 OK.
  - API completo: 154/154 OK.
  - Prettier OK.
  - Smoke Web mock aprobado.
- `TASK-598`: `PROMOTIONAL_EMAIL_SEND_ENABLED=false` confirmado en Azure Functions.

Condiciones para release:
- Incluir cambios API/Web del nuevo flujo.
- Incluir handoffs `TASK-588`, `TASK-589`, `TASK-593` a `TASK-599`.
- Excluir `debug.log`.
- Verificar workflows API y Web hasta `success`.
- Ejecutar smoke publicado sin envio real.
- No activar `PROMOTIONAL_EMAIL_SEND_ENABLED` desde el release.

Uso Azure SQL:
- No.
- Motivo: decision de release basada en handoffs; no se consulto ni modifico DB real.

Riesgos o pendientes:
- La API reutiliza `PromotionalCampaignRecipients` como registro asociado a la campana; si se requiere historial completo de multiples envios por plantilla, se recomienda tarea futura para `PromotionalCampaignSends`.
- Requiere QA publicado posterior antes de reactivar envio real.
- La prueba PO real debe esperar a que el nuevo flujo este publicado y validado.

Siguiente recomendado:
- Ejecutar `TASK-600` para commit/push/deploy controlado.
- Ejecutar `TASK-601` para QA Web del nuevo flujo sin envio real.
