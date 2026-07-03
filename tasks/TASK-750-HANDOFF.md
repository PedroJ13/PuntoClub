Equipo: QA
Tarea validada: TASK-750 - Validar subnavegacion Crear / actualizar campanas implementada
Ambiente: Local mock, `http://127.0.0.1:4190/app`, navegador Playwright Chromium, fecha 2026-07-02 18:29 -06:00
Resultado: aprobado

Checks ejecutados:
- Lectura de contexto QA y handoff de implementacion `tasks/TASK-749-HANDOFF.md`.
- Validacion local automatizada con `node tmp/task750-qa.mjs`.
- `node --check app/src/app.js`.
- `node --check app/src/customerApi.js`.
- `npx prettier --check app/index.html app/src/app.js app/styles.css`.
- `git diff --check -- app/index.html app/src/app.js app/styles.css`.

Hallazgos:
- No se encontraron P0/P1.
- La subnavegacion de Comunicaciones muestra cuatro opciones: `Enviar campañas`, `Crear / actualizar campañas`, `Clientes`, `Historial`.
- En `Enviar campañas` ya no queda visible el panel `Crear/Editar campaña`; se mantiene selector de campana, preview, destinatarios y boton de envio.
- En `Crear / actualizar campañas` se valido crear campana, editar nombre/asunto/mensaje, reemplazar imagen y ver preview de edicion con imagen.
- El boton `Ir a Enviar campañas` navega correctamente a envio y deja seleccionada la campana gestionada.
- En envio se valido seleccion de destinatarios elegibles y boton listo (`Enviar a 2`) sin ejecutar el envio.
- Responsive basico mobile 390x844: cuatro tabs visibles, sin overflow horizontal detectable.

P0/P1:
- Ninguno.

P2/P3:
- P3 observacion: despues de seleccionar destinatarios, el panel de resultado muestra el estado de seleccion (`2 destinatarios seleccionados para este envío.`). No bloquea el flujo ni implica envio real, pero conviene mantenerlo vigilado para que no se confunda con resultado post-envio.

Evidencia:
- `node tmp/task750-qa.mjs` paso con `ok: true`.
- Evidencia del script:
  - subnavs: `send`, `manage`, `customers`, `history`.
  - send view scoped: panel manage oculto, selector/preview/destinatarios/boton visibles.
  - manage view controls: formulario, selector, imagen, preview y boton `Ir a Enviar campañas` visibles.
  - create/edit image preview: campana `QA750 ... editada` actualizada con preview e imagen visible.
  - go to send selection: campana editada seleccionada en `Enviar campañas` y preview actualizado.
  - send flow preserved without sending: destinatarios seleccionados y boton habilitado, sin hacer click en enviar.
  - responsive basic: cuatro tabs visibles y overflow 0.
- `node --check` sin errores para `app/src/app.js` y `app/src/customerApi.js`.
- Prettier limpio en `app/index.html`, `app/src/app.js`, `app/styles.css`.
- `git diff --check` sin errores; solo warnings CRLF normales de Windows.

Uso DB cloud: No
- Motivo y alcance: QA local/mock de UI; no se uso Azure SQL, no se usaron endpoints cloud y no se enviaron correos reales.

Riesgos o pendientes:
- La tarea `tasks/TASK-750.md` o `tasks/TASK-750-assignment.md` no existe en este checkout; se uso la asignacion pegada por Product Owner y el handoff de TASK-749 como fuente de alcance.
- No se valido ambiente publicado en esta tarea.
- No se ejecuto envio real ni se cambio ningun flag.

Siguiente recomendado:
- Procesar TASK-750 como aprobado y, si corresponde al ciclo del proyecto, crear tarea separada para QA publicado despues de deploy.
