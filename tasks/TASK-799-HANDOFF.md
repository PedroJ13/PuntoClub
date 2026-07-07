Equipo: QA
Tarea validada: TASK-799 - Revalidar reset desde menu lateral Enviar campanas
Ambiente: Local/mock, app servida en http://127.0.0.1:4202 con app-config mock, Chromium Playwright, fecha fijada en 2026-07-05 para usar cumpleanero seed local.
Resultado: aprobado

Checks ejecutados:
- Lectura de handoff TASK-798.
- Smoke focal `tmp/task799-qa.mjs`.
- Login mock.
- Validacion de flujo comun inicial.
- Creacion de campana tipo `cumpleanos`.
- Entrada al flujo dedicado de cumpleaños.
- Validacion de filtro de campañas y destinatarios en flujo dedicado de cumpleaños.
- Salida a `Atender cliente` y vuelta a `Enviar campañas` desde menu lateral, sin recarga.
- Seleccion rapida en flujo comun y limpieza posterior, sin presionar envio.
- Reentrada a cumpleaños y vuelta mediante subnav normal `Enviar campañas`, sin recarga.
- Checks tecnicos: `node --check app/src/app.js`, `git diff --check -- app/src/app.js`, `npx prettier --check app/src/app.js`.

Hallazgos:
- El flujo comun inicial muestra campaña `Común` y destinatarios normales.
- El flujo dedicado de cumpleaños sigue filtrando correctamente: solo campaña `Cumpleaños` y 1 destinatario cumpleañero.
- El menu lateral `Enviar campañas` restablece el flujo comun sin recarga despues de entrar a cumpleaños.
- El selector normal muestra campaña `Cumpleaños` y campaña `Común`, seleccionando la campaña `Común`.
- El flujo comun carga 2 destinatarios normales, incluyendo el seed no cumpleañero.
- La seleccion rapida en comun prepara `2 seleccionados de 5` y boton `Enviar a 2`; no se presiono envio.
- El subnav normal `Enviar campañas` sigue restableciendo el flujo comun sin regresion.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- `tmp/task799-qa.mjs`: `ok: true`.
- Flujo comun inicial: `Promo clientes frecuentes ... · Común`, 2 destinatarios.
- Flujo cumpleaños: `QA799 ... · Cumpleaños`, 1 destinatario.
- Vuelta por menu lateral: selector con `QA799 ... · Cumpleaños` y `Promo clientes frecuentes ... · Común`, seleccionada la campaña `Común`, 2 destinatarios.
- Seleccion comun: `2 seleccionados de 5`, boton `Enviar a 2`; luego se limpio seleccion.
- Vuelta por subnav normal: tambien restablece campaña `Común` y 2 destinatarios.
- Checks tecnicos focales: sintaxis OK, Prettier OK, `git diff --check` sin errores; solo aviso LF/CRLF de Git.

Uso DB cloud: No

Riesgos o pendientes:
- Validacion limitada a local/mock segun alcance de la tarea.
- No se publico.
- No se aplico migracion SQL.
- No se enviaron correos reales ni se ejecuto envio promocional.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-799 como QA local aprobado y decidir si corresponde publicar/revalidar el fix en ambiente publicado.
