Equipo: QA
Tarea validada: TASK-727 - Validar correo promocional con imagen visible
Ambiente: Local/mock API en `C:\Work\Productos Digitales\PuntoClub\api`, sin ACS real, sin Azure SQL y sin envio real. Fecha/hora QA: 2026-07-02 13:49:04 -06:00.
Resultado: aprobado con observaciones

Checks ejecutados:
- Contexto leido: AGENTS.md, chat-start/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md, tasks/TASK-725-HANDOFF.md y tasks/TASK-726-HANDOFF.md.
- Nota de contexto: `tasks/TASK-727.md` no existe en este checkout; se uso como fuente la tarea pegada por Product Owner.
- Revision de codigo focal:
  - `api/src/functions/promotionalCampaigns.js`
  - `api/test/promotional-campaigns.test.js`
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/test/promotional-campaigns.test.js`
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js`
  - Resultado observado: 166 tests passed, 0 failed.
- Smoke directo local de `buildPromotionalEmail` y `sendPromotionalCampaignToRecipients` con `sendEmail` stub:
  - campana con imagen;
  - campana sin imagen;
  - request simulado `https://api.puntoclubcr.com/api/companies/10/promotional-campaigns/77/send`;
  - repositorio fake con un destinatario suscrito y un destinatario dado de baja.
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/test/promotional-campaigns.test.js`
- `git diff --check -- api/src/functions/promotionalCampaigns.js api/test/promotional-campaigns.test.js`

Hallazgos:
- Sin P0/P1/P2/P3 nuevos en el alcance local/mock validado.
- Observacion: no se ejecuto prueba real de ACS ni se confirmo recepcion en mailbox real. La tarea permitia validacion local o prueba real controlada; QA eligio local/mock para evitar envio a clientes reales o masivo mientras no hubiera una autorizacion puntual de envio real para esta tarea.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno.

Evidencia:
- HTML con imagen generado localmente:
  - `subject`: `Promo para Fatima QA`;
  - `hasImg=true`;
  - `imageSrc=https://api.puntoclubcr.com/api/public/promotional-campaign-images/72727272-7272-4727-8727-727272727272`;
  - `hasAlt=true` para `alt="Imagen QA727"`;
  - `hasEmailWidthStyle=true` con `max-width:592px`;
  - `usesRelativeSrc=false`, no queda `src="/api/public/..."`.
- HTML sin imagen generado localmente:
  - `hasImg=false`;
  - conserva el cuerpo del mensaje para el destinatario de prueba.
- Envio mock/stub local:
  - `sentMessages=1`;
  - destinatario de prueba: `qa-authorized@example.test`;
  - resumen: `selected=2`, `sent=1`, `failed=0`, `skipped=1`;
  - proveedor: `mock-only`;
  - el destinatario dado de baja fue omitido.
- Pruebas automatizadas relevantes cubiertas por la suite:
  - `promotional email renders only the selected recipient message`;
  - `promotional preview includes active campaign image url`;
  - `promotional send skips unsubscribed recipients and sends selected subscribed recipients`.
- `git diff --check` solo reporto warnings LF/CRLF en archivos API ya modificados, sin errores de whitespace.

Uso DB cloud: No

Riesgos o pendientes:
- No se verifico una URL publica real con blob vigente ni recepcion visual en mailbox real; para eso se necesita una campana publicada con imagen activa y autorizacion explicita de envio controlado a un mailbox autorizado.
- No se activo ACS real ni `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se enviaron correos reales ni masivos.
- La evidencia confirma render HTML y flujo de envio con stub, no comportamiento de clientes de correo externos.

Siguiente recomendado:
- Si Product/Release necesita evidencia end-to-end visual en mailbox, publicar el fix de TASK-726 si aun no esta publicado y crear una tarea de QA real controlada con destinatario unico autorizado, campana con imagen activa y confirmacion explicita de envio.
