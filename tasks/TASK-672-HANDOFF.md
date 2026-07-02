Equipo: QA
Tarea validada: TASK-672 - Validar imagen opcional en campanas localmente
Ambiente: Local mock en navegador integrado. Servidores temporales QA en `http://127.0.0.1:4187` sin imagen sembrada y `http://127.0.0.1:4188` con imagen mock sembrada. API/Web sin ACS real, sin Azure SQL y sin envio de correos reales.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de contexto: `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`, `tasks/TASK-666-HANDOFF.md`, `tasks/TASK-669-HANDOFF.md`, `tasks/TASK-670-HANDOFF.md`, `tasks/TASK-671-HANDOFF.md`.
- Sintaxis Web: `node --check app/src/app.js`.
- Sintaxis Web API client: `node --check app/src/customerApi.js`.
- Tests API relacionados: `npm test -- --test-reporter=spec test/promotional-campaigns.test.js test/logo-storage.test.js` en `api/`. Resultado del script actual: 162 passed, 0 failed.
- Whitespace check: `git diff --check`. Sin errores; solo warnings CRLF existentes.
- Mock API local directo: crear campana sin imagen, subir PNG valido, reemplazar por JPEG, rechazar SVG, rechazar archivo > 1 MB, eliminar imagen y confirmar `image: null`.
- Navegador local mock sin imagen: modulo `Enviar campanas`, panel `Imagen opcional`, accept `image/png,image/jpeg,image/webp`, texto `Sin imagen`, preview sin `<img>`, boton `Eliminar` deshabilitado y creacion de campana sin seleccionar imagen.
- Navegador local mock con imagen sembrada: miniatura visible, alt text correcto, estado `qa-promocion.png · 1 KB`, boton `Reemplazar`, boton `Eliminar` habilitado, preview colapsable abre y renderiza `<img>`.
- Eliminacion visual con mock: confirmacion de eliminacion completada; panel vuelve a `Sin imagen`, preview sin `<img>`, boton `Eliminar` deshabilitado y mensaje `Imagen eliminada.`.
- Responsive local 390x844 con imagen sembrada: sin overflow horizontal; panel y acciones de imagen mantienen estado correcto.
- Consola navegador: sin errores `error`.

Hallazgos:
- No se encontraron defectos bloqueantes ni regresiones funcionales en el alcance validado.
- Observacion QA: el navegador integrado no expone una accion directa de seleccion de archivo nativo; por eso la carga/reemplazo desde selector se cubrio con mock API local directo y el render visual se cubrio con imagen sembrada en servidor QA temporal.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno de producto.

Evidencia:
- API mock directo: `beforeImage=null`; upload valido `qa-promo.png` `image/png` con blob URL; reemplazo `qa-promo-reemplazo.jpg` `image/jpeg` con `replaced=true`; SVG rechazado con `PROMOTIONAL_CAMPAIGN_IMAGE_UNSUPPORTED_TYPE`; archivo >1 MB rechazado con `PROMOTIONAL_CAMPAIGN_IMAGE_TOO_LARGE`; eliminacion deja `afterDelete=null`.
- Visual sin imagen: campana `QA campana sin imagen - QA asunto sin imagen` guardada y seleccionada; preview de imagen oculto; `previewImgCount=0`; `Eliminar disabled=true`; `Agregar imagen`.
- Visual con imagen: `panelPreviewHidden=false`; `panelPreviewAlt=Promo clientes frecuentes`; `imageStatus=qa-promocion.png · 1 KB`; `uploadText=Reemplazar`; `deleteDisabled=false`; preview abierto con `previewImgCount=1`.
- Post-eliminacion: `imageStatus=Imagen eliminada.`; `imageText=Sin imagen`; `panelPreviewHidden=true`; `previewImgCount=0`; `uploadText=Agregar imagen`; `deleteDisabled=true`.
- Responsive 390x844: `hasHorizontalOverflow=false`, panel de imagen 321 px, acciones 295 px, imagen visible con alt correcto.
- Email render/mock con imagen cubierto por test API `promotional email renders only the selected recipient message`, que valida HTML con `<img>` y alt text.

Uso DB cloud: No

Riesgos o pendientes:
- La validacion fue local/mock; no se uso storage real ni ACS. La publicacion requerira migracion SQL y configuracion de storage/API segun handoffs de SQL/Backend.
- El selector nativo de archivo no fue operado manualmente por limitacion de herramienta, aunque la ruta de carga/reemplazo/rechazo quedo cubierta por mock API local y tests server-side.

Siguiente recomendado:
- Product / Release puede tomar esta QA local como aprobada para decision de publicar, considerando que el smoke publicado debera revalidar endpoints reales, storage configurado y render publico sin enviar correos reales salvo autorizacion explicita.
