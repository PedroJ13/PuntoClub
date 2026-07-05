Equipo: QA
Tarea validada: TASK-730 - Validar correo promocional con imagen en mailbox autorizado
Ambiente: Web publicada `https://puntoclubcr.com/app?task=717-resume` con sesion real/controlada de Aurisbel Pasteleria. API publicada `https://api.puntoclubcr.com/api`. Fecha/hora QA: 2026-07-02 14:11:54 -06:00.
Resultado: aprobado

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md, tasks/TASK-728-HANDOFF.md y tasks/TASK-729-HANDOFF.md.
- Nota de contexto: `tasks/TASK-730.md` no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Sesion publicada confirmada en Aurisbel Pasteleria, sin pedir ni registrar credenciales/cookies/tokens.
- Se abrio `Enviar campanas`.
- Se revisaron campanas con imagen activa vigente:
  - `TEST 2_Imagen - TEST 3` (`campaignId=12`);
  - `Nuevo - Nueva Bebida` (`campaignId=17`);
  - `Nuevo - Nueva Bebida` (`campaignId=19`).
- Se confirmo preview publicado con imagen visible para campanas `Nuevo - Nueva Bebida`.
- Se valido URL publica de imagen sin cookies con `GET`:
  - `https://api.puntoclubcr.com/api/public/promotional-campaign-images/D750ABD9-206B-456F-9345-8C42A03271C8`
  - resultado: `200`, `image/jpeg`, `177505` bytes.
  - `https://api.puntoclubcr.com/api/public/promotional-campaign-images/0504D65A-AFB9-47A4-8BAA-9221BEB9E921`
  - resultado: `200`, `image/jpeg`, `177505` bytes.
- Se busco cliente autorizado:
  - Cliente: Pedro Gutierrez;
  - correo autorizado por Product Owner: `pj13eros@hotmail.com`;
  - estado visible en destinatarios: suscrito.
- Se intento preparar envio desde QA solo para ese destinatario:
  - `campaignId=19`: API/UI respondio `Promotional recipient is already selected for this campaign.`;
  - `campaignId=17`: el destinatario aparecio elegible, pero el boton `Enviar` quedo deshabilitado en la sesion QA.
- Product Owner ejecuto manualmente el envio controlado al mismo mailbox autorizado y confirmo recepcion correcta del correo con imagen visible.
- No se enviaron correos a otros clientes desde QA y no se ejecuto envio masivo.

Hallazgos:
- Sin hallazgos P0/P1/P2/P3 en el alcance validado.
- Observacion: al intentar reutilizar una campana con el mismo destinatario, la UI/API puede bloquear duplicados con `Promotional recipient is already selected for this campaign.`. No bloquea TASK-730 porque el Product Owner completo el envio controlado y confirmo recepcion correcta.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno.

Evidencia:
- Preview publicado de `Nuevo - Nueva Bebida` mostro imagen activa:
  - `alt=Nuevo`;
  - dimensiones naturales observadas en navegador: `1086x1448`;
  - URL `https://api.puntoclubcr.com/api/public/promotional-campaign-images/D750ABD9-206B-456F-9345-8C42A03271C8`.
- URL publica sin cookies:
  - `GET` a `D750ABD9-206B-456F-9345-8C42A03271C8`: `status=200`, `content_type=image/jpeg`, `size=177505`.
  - `GET` a `0504D65A-AFB9-47A4-8BAA-9221BEB9E921`: `status=200`, `content_type=image/jpeg`, `size=177505`.
- Destinatario autorizado por PO:
  - `Pedro Gutierrez`, `pj13eros@hotmail.com`, suscrito, puntos visibles `100`.
- Confirmacion PO/mailbox autorizado:
  - Product Owner indico: `Ahora si me llego bien`.
  - Interpretacion QA: correo promocional recibido correctamente en mailbox autorizado y la imagen se ve.
- Caso sin imagen:
  - Ya cubierto local/mock en TASK-727: HTML sin imagen no incluye `<img>` y conserva cuerpo del mensaje.
  - En esta tarea publicada no se envio correo sin imagen para evitar correos adicionales innecesarios.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicada/end-to-end solicitada explicitamente con sesion real/controlada y mailbox autorizado.
- Alcance: lectura UI de campanas/destinatarios, validacion HTTP publica de imagen y envio real controlado ejecutado por Product Owner a `pj13eros@hotmail.com`. No se consulto Azure SQL directamente desde QA. No hubo envio masivo.

Riesgos o pendientes:
- Existen datos reales de historial/seleccion de destinatario asociados a la prueba controlada.
- La regla de duplicado de destinatario por campana merece documentarse como comportamiento esperado o ajustar copy si Product quiere hacerlo mas claro.
- No se adjunta captura del mailbox en el repo para evitar exponer datos personales; la evidencia queda como confirmacion directa del Product Owner/mailbox autorizado.

Siguiente recomendado:
- Product/Release puede cerrar la validacion end-to-end de imagen en correo promocional. Si se desea, crear tarea separada para mejorar mensaje de duplicado `Promotional recipient is already selected for this campaign.` en UI.
