Equipo: QA
Tarea validada: TASK-791 - Validar filtro de destinatarios cumpleaneros post-fix
Ambiente: Local/mock, app servida en http://127.0.0.1:4200 con app-config mock, Chromium Playwright, fecha fijada en 2026-07-05 para usar cumpleanero seed local.
Resultado: aprobado

Checks ejecutados:
- Smoke focal `tmp/task791-qa.mjs`.
- Login mock.
- Validacion de alerta de cumpleaneros del dia.
- Creacion de campana tipo `cumpleanos`.
- Entrada al flujo dedicado de cumpleaños mediante listener `data-open-birthday-campaigns`.
- Validacion de selector de campanas en flujo cumpleaños.
- Validacion de conteo alerta vs conteo de destinatarios.
- Busqueda de cliente no cumpleanero dentro del flujo cumpleaños.
- Seleccion rapida en flujo cumpleaños sin presionar envio.
- Regresion de flujo normal de campana comun en sesion local/mock limpia.
- Checks tecnicos: `node --check`, `git diff --check`, `node --test api/test/promotional-campaigns.test.js api/test/repository-customer-search.test.js api/test/validators.test.js`, `npx prettier --check`.

Hallazgos:
- La alerta local muestra 1 cumpleanero del dia y 1 apto para campaña de cumpleaños.
- El flujo de cumpleaños muestra solo campanas tipo `cumpleanos`.
- El listado de destinatarios de cumpleaños contiene 1 tarjeta, coincidiendo con la alerta.
- Al buscar un cliente no cumpleanero en el flujo de cumpleaños, el listado queda vacio y el boton de envio permanece deshabilitado.
- La seleccion rapida en cumpleaños solo prepara 1 destinatario cumpleanero.
- Las campanas comunes mantienen destinatarios normales y muestran tambien el cliente seed no cumpleanero.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- `tmp/task791-qa.mjs`: `ok: true`.
- Alerta: `Campanita: 1 cliente cumple años hoy. 1 apto para campaña de cumpleaños.`
- Flujo cumpleaños: selector con `Selecciona una campaña para enviar` y una campana QA `Cumpleaños`.
- Flujo cumpleaños: destinatarios `1`, igual al conteo de alerta.
- Busqueda de no cumpleanero en cumpleaños: `No hay destinatarios para este filtro.`, `0 seleccionados de 5`, envio deshabilitado.
- Seleccion cumpleaños: `1 seleccionado de 5`, boton `Enviar a 1`; no se presiono envio.
- Flujo comun: campana `Común`, `2` destinatarios, incluye seed no cumpleanero.
- Unit tests focales: 62/62 pass.
- Prettier: `All matched files use Prettier code style!`
- `node --check` y `git diff --check`: sin errores; solo avisos LF/CRLF de Git.

Uso DB cloud: No

Riesgos o pendientes:
- Validacion limitada a local/mock segun alcance de la tarea.
- No se publico.
- No se aplico migracion SQL.
- No se enviaron correos reales ni se ejecuto envio promocional.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-791 como QA local aprobado y decidir si corresponde publicar/revalidar el fix en ambiente publicado.
