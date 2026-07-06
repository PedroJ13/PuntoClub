Equipo: QA
Tarea validada: TASK-781 - Revalidar flujo local de campanas de cumpleanos
Ambiente: Local/mock, app servida en http://127.0.0.1:4198 con app-config mock, Chromium Playwright, fecha fijada en 2026-07-05.
Resultado: aprobado

Checks ejecutados:
- Revalidacion funcional local/mock con `tmp/task781-qa.mjs`.
- Login mock con empresa autenticada.
- Creacion de cliente control no cumpleanero para validar regresion del flujo normal.
- Creacion de campana tipo `cumpleanos`.
- Entrada al flujo dedicado de cumpleanos mediante el listener de alerta `data-open-birthday-campaigns`.
- Validacion de selector de campanas en flujo cumpleanos.
- Validacion de destinatarios en flujo cumpleanos.
- Validacion de preview de campana seleccionada.
- Regresion de flujo normal de campanas comunes en sesion limpia.
- Seleccion de destinatarios en flujo normal sin ejecutar envio.
- Checks tecnicos: `node --check`, `git diff --check`, `node --test api/test/validators.test.js api/test/promotional-campaigns.test.js`, `npx prettier --check`.

Hallazgos:
- El flujo dedicado de cumpleanos muestra solo campanas tipo `cumpleanos`.
- No aparecen campanas comunes en el selector del flujo dedicado de cumpleanos.
- Los destinatarios del flujo dedicado quedan limitados a cumpleaneros del dia.
- El preview refleja la campana de cumpleanos seleccionada.
- El flujo normal conserva campanas comunes y no queda limitado a cumpleaneros.
- Se pudo preparar seleccion normal de destinatarios sin enviar correos.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- `tmp/task781-qa.mjs` reporto `ok: true`.
- Opciones en flujo cumpleanos: `Selecciona una campana para enviar`, `QA781 cumple ... - QA781 cumple asunto ... - Cumpleanos`.
- Destinatarios en flujo cumpleanos: `Maria Soto`.
- Opciones en flujo normal: `Selecciona una campana para enviar`, `Promo clientes frecuentes - Promo especial para clientes frecuentes - Comun`.
- Destinatarios en flujo normal: cliente QA781 no cumpleanero, `Maria Soto`, `Jose Vega`.
- Seleccion normal preparada: `3 seleccionados de 5`, boton `Enviar a 3`; no se hizo click en enviar.
- Tests API focales: 56/56 pass.
- Prettier: `All matched files use Prettier code style!`
- `node --check` y `git diff --check`: sin errores; solo avisos LF/CRLF de Git.

Uso DB cloud: No

Riesgos o pendientes:
- No se aplico migracion SQL.
- No se publico.
- No se enviaron correos reales.
- Validacion limitada a local/mock segun alcance de la tarea.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff de TASK-781 y decidir si el flujo queda listo para el siguiente paso del ciclo local -> QA local -> decision de publicar.
