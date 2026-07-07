Equipo: QA
Tarea validada: TASK-821 - Validar seleccion masiva de destinatarios promocionales
Ambiente: Local/mock con servidor temporal en `127.0.0.1`, Playwright headless, API tests locales. No Azure SQL.
Resultado: aprobado

Checks ejecutados:
- Se revisaron TASK-819-HANDOFF y TASK-820-HANDOFF para confirmar contrato esperado.
- Sintaxis:
  - `node --check api/src/lib/validators.js`
  - `node --check api/src/lib/repository.js`
  - `node --check app/src/app.js`
  - `node --check app/src/customerApi.js`
- Tests focales:
  - `node --test api/test/promotional-campaigns.test.js`
- Regresion API:
  - `npm --prefix api test`
- Limpieza de diff:
  - `git diff --check`
- UI local/mock:
  - Login mock.
  - Seed local de mas de 5 clientes elegibles y clientes no elegibles.
  - Seleccion de campana guardada.
  - Filtro `Todos`.
  - Accion `Seleccionar todos elegibles`.
  - Baja promocional mock.
  - Cliente sin email/suprimido.
  - `Limpiar seleccion`.
  - Click en `Enviar a N` con dialogo de confirmacion descartado; no se confirmo envio.

Hallazgos:
- Ya no existe bloqueo visual ni server-side de 5 destinatarios:
  - API focal: `promotional recipient selection accepts more than five recipients`.
  - API focal: `promotional send accepts more than five selected eligible recipients`.
  - UI local: `Seleccionar todos elegibles` marco `9` destinatarios.
- `Todos` funciona como filtro/listado y no selecciona por si mismo:
  - Antes de `Todos`: `0 seleccionados`.
  - Despues de `Todos`: `0 seleccionados`.
- `Seleccionar todos elegibles` marca solo clientes elegibles del listado visible:
  - Resultado UI: `9 seleccionados`, boton `Enviar a 9`.
  - No aparece texto `de 5` ni `hasta 5`.
- Clientes no elegibles no se seleccionan:
  - Cliente dado de baja quedo visible como `Baja promocional`, checkbox deshabilitado y fuera de la seleccion.
  - Cliente sin email quedo visible como `Sin correo registrado / Suprimido`, checkbox deshabilitado y no se selecciono.
  - Tests API cubren `suppressed` y `missing_email` como motivos de omision/rechazo.
- `Limpiar seleccion` funciona:
  - Despues de limpiar: `0 seleccionados`, boton vuelve a `Enviar campana` y queda deshabilitado.
- Confirmacion de envio muestra cantidad correcta:
  - Dialogo: `Vas a enviar "Promo clientes frecuentes" a 9 destinatarios seleccionados...`
  - Dialogo descartado; no se confirmo envio.
- No se enviaron correos reales.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno abierto.

Evidencia:
- `node --test api/test/promotional-campaigns.test.js`: 23/23 pass.
- `npm --prefix api test`: 179/179 pass.
- `git diff --check`: sin errores; solo avisos LF/CRLF.
- UI local/mock:
  - `Seleccionar todos elegibles`: `9 seleccionados`.
  - `Baja promocional`: 1 destinatario deshabilitado, no seleccionado.
  - `Sin correo registrado / Suprimido`: deshabilitado, no seleccionado.
  - `Limpiar seleccion`: `0 seleccionados`.
  - Confirmacion: menciona `9 destinatarios seleccionados`.

Uso DB cloud: No

Riesgos o pendientes:
- Validacion realizada en local/mock por alcance de la tarea; no se valido publicado.
- El campo historico `recipientLimit: 5` sigue existiendo en datos mock/campana, pero no limita seleccion ni envio segun tests/UI.
- La confirmacion fue descartada para evitar cualquier envio; el envio real no fue ejecutado.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff. Si corresponde, publicar TASK-819/TASK-820 y abrir QA publicada del flujo de seleccion masiva.
