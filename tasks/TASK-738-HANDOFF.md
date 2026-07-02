Equipo: QA
Tarea validada: TASK-738 - Validar copy publicado de destinatario duplicado
Ambiente: Web publicada `https://puntoclubcr.com/app?task=717-resume` con sesion real/controlada de Aurisbel Pasteleria. API publicada `https://api.puntoclubcr.com/api`. Fecha/hora QA: 2026-07-02 14:59:54 -06:00.
Resultado: no aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md, tasks/TASK-736-HANDOFF.md y tasks/TASK-737-HANDOFF.md.
- Nota de contexto: `tasks/TASK-738.md` no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Sesion publicada confirmada en Aurisbel Pasteleria, sin pedir ni registrar credenciales/cookies/tokens.
- Se abrio `Enviar campanas`.
- Se selecciono campana publicada `Nuevo - Nueva Bebida` (`campaignId=19`).
- Se filtro destinatario autorizado por Product Owner:
  - Pedro Gutierrez;
  - `pj13eros@hotmail.com`;
  - estado visible: suscrito;
  - puntos visibles: `100`.
- Se hizo un primer intento de envio controlado al destinatario autorizado.
- Product Owner confirmo recepcion del correo.
- Product Owner autorizo explicitamente repetir el intento para validar el bloqueo/copy duplicado.
- Se hizo segundo intento con la misma campana `campaignId=19` y el mismo destinatario autorizado.
- No se probaron otros destinatarios ni se hizo envio masivo.

Hallazgos:
- P1: El bloqueo anti-duplicado no se activo en Web/API publicada. Al intentar enviar por segunda vez la misma campana `campaignId=19` al mismo destinatario `pj13eros@hotmail.com`, la UI/API volvio a finalizar con `1 enviado, 0 fallidos y 0 omitidos` en lugar de mostrar el aviso de duplicado.
- P1: No se pudo validar el copy publicado `Destinatario ya incluido` porque el caso duplicado no devolvio el error esperado. Tampoco aparecio el texto tecnico en ingles, pero esto no cuenta como aprobado porque no hubo bloqueo.

P0/P1:
- P1 abierto: reenvio duplicado permitido para la misma campana y el mismo cliente en publicado.
- P1 abierto: copy de duplicado no observable en publicado porque el backend/flujo no bloquea el duplicado en el caso probado.

P2/P3:
- Ninguno adicional.

Evidencia:
- Primer envio controlado:
  - Campana: `Nuevo - Nueva Bebida`;
  - `campaignId=19`;
  - destinatario: Pedro Gutierrez / `pj13eros@hotmail.com`;
  - UI despues del intento: `Envío finalizado: 1 enviado, 0 fallidos y 0 omitidos. Resultado guardado para los destinatarios seleccionados. Enviado: Pedro Gutierrez`;
  - Product Owner confirmo recepcion.
- Segundo intento autorizado por Product Owner para validar duplicado:
  - misma campana `campaignId=19`;
  - mismo destinatario Pedro Gutierrez / `pj13eros@hotmail.com`;
  - antes de enviar: boton `Enviar a 1` habilitado;
  - despues del intento: `Envío finalizado: 1 enviado, 0 fallidos y 0 omitidos. Resultado guardado para los destinatarios seleccionados. Enviado: Pedro Gutierrez`;
  - no aparecio `Destinatario ya incluido`;
  - no aparecio `Este cliente ya fue incluido en esta campaña. Para volver a enviarle una promoción, crea una nueva campaña o selecciona otra.`;
  - no aparecio `Promotional recipient is already selected for this campaign.`;
  - `communication-campaign-error` quedo vacio.
- El resultado observado contradice el alcance aprobado en TASK-736:
  - mantener bloqueo anti-duplicado vigente;
  - mostrar aviso en panel `Resultado`.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicada solicitada explicitamente con sesion real/controlada.
- Alcance: lectura UI de campanas/destinatarios y dos envios reales controlados al mailbox autorizado por Product Owner (`pj13eros@hotmail.com`) para validar bloqueo/copy duplicado. No se consulto Azure SQL directamente desde QA. No hubo envio masivo ni envios a otros clientes.

Riesgos o pendientes:
- El destinatario autorizado recibio al menos dos correos de la misma campana durante esta validacion publicada.
- La regla anti-duplicado puede estar aplicandose solo en preparacion/seleccion previa, pero el endpoint/flujo de envio con `customerIds` podria estar reemplazando o recreando destinatarios y permitiendo reenvio. Requiere investigacion Backend/API y/o Web.
- No aprobar publicacion/cierre de TASK-738 mientras el P1 siga abierto.

Siguiente recomendado:
- Backend/API debe revisar el endpoint de envio promocional publicado para impedir reenvio de `campaignId + customerId` ya procesado/incluido y devolver `PROMOTIONAL_RECIPIENT_ALREADY_SELECTED` o equivalente controlado.
- Web Dev debe revalidar que, cuando el backend devuelva ese error, el copy publicado muestre `Destinatario ya incluido` y no texto tecnico.
- Luego ejecutar QA local y publicada focal sin enviar a clientes reales salvo mailbox autorizado.
