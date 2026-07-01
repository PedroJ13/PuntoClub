Equipo: Infra
Modo de ejecucion: ACS Email / Diagnostico entrega
Tarea completada: TASK-636 - Verificar si ACS recibio intento promocional fallido

Resultado:
- TASK-635 no encontro `providerMessageId`.
- TASK-635 no encontro fila en `PromotionalCampaignRecipients` para Fatima/campana 7.
- Application Insights no mostro dependencias para el operation id del envio fallido.
- La excepcion ocurrio antes de invocar ACS:
  - `TypeError: repositoryAdapter.replacePromotionalCampaignRecipients is not a function`.
- Por tanto, ACS no recibio intento verificable para este caso.

Estado ACS para el intento:
- `accepted`: no aplica / no confirmado.
- `delivered`: no aplica / no confirmado.
- `bounced`: no aplica / no confirmado.
- `failed`: no aplica / no confirmado en ACS.
- `throttled`: no aplica / no confirmado.
- Resultado aplicable: sin telemetria ACS porque no hubo invocacion ACS evidenciada.

Acciones realizadas:
- No se reenviaron correos.
- No se cambio sender.
- No se cambiaron secretos.
- No se modificaron flags.
- No se hizo consulta ACS por mensaje especifico porque no existe `providerMessageId`.

Uso Azure SQL:
- No directo en esta tarea.
- Se uso evidencia de TASK-635, que consulto SQL read-only para confirmar ausencia de destinatario/provider.

Riesgos o pendientes:
- Despues de corregir Backend/API y repetir una prueba controlada, si aparece `providerMessageId`, Infra puede revisar telemetria ACS para ese mensaje o ventana horaria.
- Mientras el backend falle antes de ACS, el diagnostico de entregabilidad ACS no es accionable.
