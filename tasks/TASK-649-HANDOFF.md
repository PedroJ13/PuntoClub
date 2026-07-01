Equipo: QA
Tarea validada: TASK-649 - Validar UX refinada de envio de campanas
Ambiente: Local/mock en navegador interno Codex, `http://127.0.0.1:4184/app`, servido desde `app/` con `PUNTO_CLUB_USE_MOCK_API=true`. Se uso usuario mock del repo `owner@mock.test` y un harness temporal en memoria para agregar destinatarios mock suficientes. No se uso ambiente cloud ni ACS real.
Resultado: aprobado

Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md` y `tasks/TASK-648-HANDOFF.md`.
- Nota de proceso: `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md` no existen en este workspace al momento de la validacion.
- Confirmado que no existe `tasks/TASK-649.md`; se valido con la asignacion pegada por Product Owner y el handoff previo TASK-648.
- Login local mock exitoso: empresa visible `Cafe Central`, usuario `owner@mock.test`, badge `Modo de prueba`.
- Enviar campanas: preview inicia colapsado, `#communication-preview-content` oculto, `aria-expanded=false`, texto `Ver preview` y clase `is-collapsed`.
- Toggle preview: abre con texto `Ocultar preview`, `aria-expanded=true`, contenido visible y preview renderizado; cierra nuevamente a `Ver preview`, `aria-expanded=false` y contenido oculto.
- Ubicacion de envio: boton `Enviar campana` permanece en el panel principal antes del bloque de preview; resultado inicia oculto en `#communication-result-panel`.
- Seleccion de destinatarios con 8 clientes mock: `Seleccionar elegibles` marca solo 5, muestra `5 seleccionados de 5`, habilita `Enviar a 5` y deja los no seleccionados/deshabilitados fuera.
- `Limpiar` desmarca todo, vuelve a `0 seleccionados de 5` y deshabilita el envio.
- `Con puntos` marca 5 elegibles con puntos y no marca cliente dado de baja.
- Envio simulado mock confirmado: no se contacto ACS ni correo real; se muestra resultado visible y enfocado con `Envío finalizado: 5 enviados, 0 fallidos y 0 omitidos`, detalle por 5 destinatarios y seleccion limpiada.
- Persistencia: al cambiar a subvista de configuracion y volver a enviar campanas, el resultado post-envio sigue visible con su detalle.
- Responsive mobile 390x844: sin overflow horizontal; boton, resultado, preview colapsado y listado respetan ancho del viewport.
- Consola navegador: sin errores ni warnings capturados durante la prueba.
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check -- app\index.html app\src\app.js app\styles.css`

Hallazgos:
- Sin hallazgos P0/P1/P2/P3 abiertos.
- Observacion no bloqueante: `git diff --check` paso sin errores, pero Git reporto warnings de conversion LF/CRLF en `app/index.html`, `app/src/app.js` y `app/styles.css`.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- Fecha/hora local QA: 2026-07-01 16:55:19 -06:00.
- Estado inicial: 8 cards mock, 1 baja promocional deshabilitada, `0 seleccionados de 5`, resultado oculto, boton `Enviar campana` deshabilitado, preview colapsado.
- Seleccion: `Seleccionar elegibles` y `Con puntos` limitaron a 5 seleccionados; baja promocional no quedo marcada.
- Resultado mock: `Envío finalizado: 5 enviados, 0 fallidos y 0 omitidos`; lista de 5 destinatarios con estado `Enviado`; foco activo en `communication-campaign-status`.
- Responsive mobile: `horizontalOverflow=false`, viewport 375px efectivo, resultado visible con 5 items y preview colapsado.

Uso DB cloud: No.

Riesgos o pendientes:
- La validacion fue local/mock; no valida publicacion ni datos reales.
- La prueba de envio fue simulada en mock local. No se enviaron correos reales.

Siguiente recomendado:
- Procesar TASK-649 como QA local aprobado y, si Product / Release decide publicar este bloque, crear tarea separada de QA publicado para confirmar el mismo comportamiento en `puntoclubcr.com` sin activar envio real promocional salvo autorizacion explicita.
