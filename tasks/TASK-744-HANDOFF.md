Equipo: QA
Tarea validada: TASK-744 - Validar anti-duplicado promocional publicado
Ambiente: Web publicada `https://puntoclubcr.com/app?task=717-resume` con sesion real/controlada de Aurisbel Pasteleria. API publicada `https://api.puntoclubcr.com/api`. Fecha/hora QA: 2026-07-02 15:55:29 -06:00.
Resultado: aprobado con observaciones

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md, tasks/TASK-742-HANDOFF.md y tasks/TASK-743-HANDOFF.md.
- Nota de contexto: `tasks/TASK-744.md` no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Sesion publicada confirmada en Aurisbel Pasteleria, sin pedir ni registrar credenciales/cookies/tokens.
- Se abrio `Enviar campanas`.
- Se valido caso duplicado publicado con campana previamente enviada:
  - campana: `Nuevo - Nueva Bebida`;
  - `campaignId=19`;
  - destinatario: Pedro Gutierrez / `pj13eros@hotmail.com`.
- Product Owner autorizo explicitamente el intento duplicado real controlado al mailbox `pj13eros@hotmail.com`.
- Se recargo la app publicada para asegurar bundle Web actualizado.
- Se repitio el intento duplicado con la misma campana y el mismo destinatario.
- Product Owner autorizo ejecutar flujo normal real controlado con campana nueva al mismo mailbox.
- Se creo campana nueva `QA744 normal 1783029272711` y se envio solo a Pedro Gutierrez / `pj13eros@hotmail.com`.
- No se probaron otros destinatarios ni se hizo envio masivo.

Hallazgos:
- Sin P0/P1/P2/P3 abiertos al cierre.
- Observacion: en la sesion abierta antes de recargar, el backend ya bloqueaba el duplicado pero la UI mostro el texto tecnico `Promotional recipient is already selected for this campaign.`. Despues de recargar la app publicada, el copy correcto en espanol se mostro. Esto sugiere bundle/sesion previa desactualizada, no fallo del bundle publicado actual.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno.

Evidencia:
- Duplicado despues de recargar bundle:
  - campana: `Nuevo - Nueva Bebida` (`campaignId=19`);
  - destinatario: Pedro Gutierrez / `pj13eros@hotmail.com`;
  - antes del intento: boton `Enviar a 1` habilitado;
  - resultado visible en panel `Resultado`: `Destinatario ya incluido`;
  - copy visible: `Este cliente ya fue incluido en esta campaña. Para volver a enviarle una promoción, crea una nueva campaña o selecciona otra.`;
  - no aparecio `Promotional recipient is already selected for this campaign.`;
  - no aparecio `Envío finalizado`;
  - boton quedo operativo como `Enviar a 1`;
  - campana y destinatario quedaron visibles.
- Ausencia de envio duplicado:
  - en el intento duplicado valido no hubo mensaje de envio finalizado ni conteo `1 enviado`;
  - la UI mostro bloqueo informativo, no resultado de envio.
- Flujo normal publicado con campana nueva:
  - campana creada: `QA744 normal 1783029272711`;
  - `campaignId=20`;
  - destinatario unico: Pedro Gutierrez / `pj13eros@hotmail.com`;
  - antes de enviar: boton `Enviar a 1` habilitado;
  - despues de enviar: `Envío finalizado: 1 enviado, 0 fallidos y 0 omitidos. Resultado guardado para los destinatarios seleccionados. Enviado: Pedro Gutierrez`;
  - `communication-campaign-error` vacio;
  - no aparecio texto tecnico.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicada solicitada explicitamente con sesion real/controlada.
- Alcance: lectura UI de campanas/destinatarios, intento duplicado controlado contra campana enviada y envio normal real controlado de una campana nueva al mailbox autorizado por Product Owner (`pj13eros@hotmail.com`). No se consulto Azure SQL directamente desde QA. No hubo envio masivo ni envios a otros clientes.

Riesgos o pendientes:
- Queda dato QA real en Aurisbel:
  - campana `QA744 normal 1783029272711` (`campaignId=20`) enviada a Pedro Gutierrez.
- El mailbox autorizado recibio un correo real de la campana nueva de QA durante la validacion normal.
- Recomendacion operativa: para QA publicada despues de deploy Web, recargar la app antes de validar copy de bundle recien publicado.

Siguiente recomendado:
- Product/Release puede cerrar el P1 de TASK-738 como corregido en publicado. Si se desea mayor claridad, documentar que una sesion abierta antes del deploy puede requerir recarga para tomar el bundle nuevo.
