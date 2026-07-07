Equipo: QA
Tarea validada: TASK-826 - Validar confirmacion final con cantidad real de destinatarios
Ambiente: Local/mock en `127.0.0.1` con servidor temporal de QA, sin API real, sin Azure SQL y sin correos reales. Fecha QA: 2026-07-07 10:30:34 -06:00.
Resultado: aprobado con observaciones

Checks ejecutados:
- Se reviso `tasks/TASK-825-HANDOFF.md`.
- Se levanto app local en modo mock con configuracion temporal de QA.
- Se inicio sesion mock con empresa de prueba local.
- Se crearon 3 clientes mock temporales para ampliar destinatarios elegibles.
- Se abrio `Enviar campanas` y se uso la campana mock `Promo clientes frecuentes`.
- Se valido seleccion individual:
  - Estado visible: `1 seleccionado`.
  - Boton visible: `Enviar a 1`.
  - No hubo resultado de envio.
- Se valido seleccion multiple:
  - Estado visible: `2 seleccionados`.
  - Boton visible: `Enviar a 2`.
  - No hubo resultado de envio.
- Se valido `Limpiar seleccion`:
  - Estado visible: `0 seleccionados`.
  - Boton vuelve a estado `Enviar campana`.
- Se valido filtro `Todos`:
  - Lista 5 destinatarios elegibles.
  - Mantiene `0 seleccionados`; no selecciona automaticamente.
- Se valido `Seleccionar todos elegibles`:
  - Estado visible: `5 seleccionados`.
  - Boton visible: `Enviar a 5`.
- Se validaron filtros:
  - `Suscritos`: muestra 5 destinatarios, `0 seleccionados`.
  - `Bajas`: muestra `No hay destinatarios para este filtro.`, `0 seleccionados`.
  - `No aptos`: muestra `No hay destinatarios para este filtro.`, `0 seleccionados`.
- Se valido el cambio del modal por codigo:
  - `node --check app/src/app.js`: OK.
  - `npx prettier --check app/src/app.js`: OK.
  - El `window.confirm` ahora usa `recipientCount`/`recipientLabel` y el texto `Vas a enviar esta campana a N destinatario(s) seleccionado(s).`

Hallazgos:
- La UI local refleja correctamente los conteos antes de confirmar: `Enviar a 1`, `Enviar a 2` y `Enviar a 5`.
- La logica de copy del modal final esta implementada con singular/plural:
  - 1: `1 destinatario seleccionado`.
  - multiples/todos: `N destinatarios seleccionados`.
- Cancelar/no aceptar no genera resultado de envio; no se observaron `Enviados`, `Fallidos` u `Omitidos`.
- `Limpiar seleccion`, `Todos`, `Suscritos`, `Bajas` y `No aptos` no presentan regresion visible.
- No se enviaron correos reales.

P0/P1:
- Ninguno abierto.

P2/P3:
- P3: en la automatizacion local/mock el navegador no expuso el dialogo nativo de `window.confirm` para capturar visualmente el texto final; por seguridad no se acepto ningun flujo de envio. El contenido del modal se valido por codigo y los conteos previos del boton se validaron en UI.

Evidencia:
- `node --check app/src/app.js`: OK.
- `npx prettier --check app/src/app.js`: OK.
- Diff focal de `app/src/app.js`:
  - agrega `recipientCount`.
  - agrega `recipientLabel`.
  - mensaje de confirmacion: `Vas a enviar esta campana a ${recipientLabel}.`
- UI local/mock:
  - Individual: `1 seleccionado`, `Enviar a 1`.
  - Multiple: `2 seleccionados`, `Enviar a 2`.
  - Todos elegibles: `5 seleccionados`, `Enviar a 5`.
  - Limpiar: `0 seleccionados`.
  - `Todos`: 5 destinatarios, sin autoseleccion.
  - `Suscritos`: 5 destinatarios.
  - `Bajas` y `No aptos`: `No hay destinatarios para este filtro.`
- Console errors relevantes: ninguno observado.

Uso DB cloud: No

Riesgos o pendientes:
- Revalidar captura visual del texto del `window.confirm` en un navegador manual o publicado si Product / Architect / Release quiere evidencia visual estricta del dialogo nativo.
- El ambiente mock local tenia promociones pausadas; QA no confirmo envio ni ejecuto API de envio.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff. Si se requiere evidencia visual del dialogo nativo, abrir una QA focal manual/publicada sin aceptar el envio.
