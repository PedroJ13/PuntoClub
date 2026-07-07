Equipo: QA
Tarea validada: TASK-845 - Revalidar flujo Web de reintento de fallidos promocionales
Ambiente: Local Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`; revision estatica Web/API; Playwright headless contra servidor HTTP local temporal con API mock controlada en memoria. Sin Azure SQL, sin ACS y sin envio de correos reales.
Resultado: aprobado

Checks ejecutados:
- Lectura de contexto minimo: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-843-HANDOFF.md`, `tasks/TASK-844-HANDOFF.md` y handoff previo `tasks/TASK-845-HANDOFF.md`.
- `node --check app/src/app.js`: OK.
- `node --check app/src/customerApi.js`: OK.
- `node --check api/src/functions/promotionalCampaigns.js`: OK.
- `npx prettier --check app/index.html app/styles.css app/src/app.js app/src/customerApi.js`: OK.
- `git diff --check`: OK; solo advertencias CRLF.
- `npm --prefix api test -- --test-name-pattern=promotional`: 183/183 OK.
- Revision focal de Web:
  - `app/src/customerApi.js` envia `{ confirmSend: true, retryFailedOnly: true }` cuando `options.retryFailedOnly` esta activo.
  - `app/src/customerApi.js` mock local reintenta solo recipients `failed`, no toca `sent`, recalcula conteos y devuelve solo reintentados.
  - `app/src/app.js` agrega `retryFailedPromotionalCampaign`, confirmacion, merge de recipients y render condicional del boton.
- Prueba navegada local con API mock controlada:
  - inicio en `/app` con empresa mock autenticada `QA Local Retry`.
  - antes de cualquier fallo: `retryButtons=0`.
  - envio parcial simulado de 3 destinatarios: 1 `sent`, 2 `failed`.
  - panel de resultado mostro `Envío finalizado: 1 enviado, 2 fallidos y 0 omitidos.` y boton `Reintentar fallidos` habilitado.
  - retry aceptado via confirmacion controlada.
  - payload capturado para retry: `{ "confirmSend": true, "retryFailedOnly": true }`, sin `customerIds`.
  - resultado post-retry: `Reintento finalizado: 2 enviados, 0 fallidos y 0 omitidos.`
  - historial post-retry mostro 3 filas `Enviado` y sin boton visible de reintento.

Hallazgos:
- El P1 del primer intento queda cerrado: TASK-844 ya esta presente en workspace y Web expone el flujo de reintento.
- El boton aparece cuando corresponde en el panel de resultado tras un envio parcial con fallidos y desaparece despues de reintentar exitosamente.
- El payload de reintento usa `retryFailedOnly: true` sin `customerIds`, por lo que no re-prepara ni reenvia la seleccion original.
- La prueba local controlada confirma que los destinatarios ya enviados permanecen como enviados y solo los fallidos son procesados por el retry.
- Los motivos tecnicos seguros se muestran con copy operativo en espanol:
  - `acs_email_throttled_retry_exhausted` -> `El proveedor pidió reintentar más tarde.`
  - `acs_email_transient_retry_exhausted` -> `El proveedor tuvo un fallo temporal.`

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno abierto.

Evidencia:
- `TASK-844-HANDOFF.md`: declara implementacion Web local para `Reintentar fallidos` con `retryFailedOnly: true`.
- `rg` local confirma `retryFailedOnly` en `app/src/customerApi.js` y llamada desde `app/src/app.js`.
- Prueba navegada local:
  - antes del fallo: `retryButtons=0`.
  - resultado parcial: `Envío finalizado: 1 enviado, 2 fallidos y 0 omitidos.` + boton `Reintentar fallidos`.
  - request normal capturado: `{ "confirmSend": true, "customerIds": ["101", "102", "103"] }`.
  - request retry capturado: `{ "confirmSend": true, "retryFailedOnly": true }`.
  - resultado retry: `Reintento finalizado: 2 enviados, 0 fallidos y 0 omitidos.`
  - historial final: 3 destinatarios en estado `Enviado`, sin accion visible de retry.
- API tests promocionales: `# tests 183`, `# pass 183`, `# fail 0`.

Uso DB cloud: No.

Riesgos o pendientes:
- La validacion fue local con API mock controlada; no se probo envio real ni ACS real por restriccion explicita de la tarea.
- La validacion publicada debe hacerse en una tarea separada despues de publicar Web/API y con datos fallidos reales o fixture controlado.
- En la prueba mock controlada se observaron errores 404 no funcionales en consola por recursos secundarios no servidos por el servidor temporal; no afectaron el flujo validado.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff como aprobado. Si corresponde, avanzar a release/publicacion del cambio Web y luego abrir QA publicada para reintento de fallidos sin envio masivo.
