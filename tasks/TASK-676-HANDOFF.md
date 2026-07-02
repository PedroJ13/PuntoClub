Equipo: QA
Tarea validada: TASK-676 - Validar imagen opcional en campanas publicado
Ambiente: Publicado en `https://puntoclubcr.com/app` con sesion real/controlada de empresa `Aurisbel Pasteleria`. API publicada `https://func-puntoclub-prod-br-001.azurewebsites.net/api`. No se ejecutaron envios reales.
Resultado: aprobado con observaciones

Checks ejecutados:
- Contexto leido: `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/QA_TEST_PLAN.md`, `tasks/TASK-672-HANDOFF.md`, `tasks/TASK-673-HANDOFF.md`, `tasks/TASK-674-HANDOFF.md`, `tasks/TASK-675-HANDOFF.md`.
- Nota de contexto: `codex-project-templates/CHAT_MODEL.md`, `codex-project-templates/PROJECT_TOOLING_ONBOARDING.md`, `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md` no existen en este checkout.
- Sesion publicada: visible empresa `Aurisbel Pasteleria` / `eventos.aurisbel@gmail.com`.
- En `Enviar campanas`, se creo campana QA publicada sin imagen:
  - `QA TASK-676 imagen 202607020338`
  - asunto `QA TASK-676 imagen publicada 202607020338`
  - campaignId observado: `9`.
- Se valido crear campana sin imagen: queda seleccionada/listada, preview sin `<img>`, texto `Sin imagen`, boton `Eliminar` deshabilitado, sin errores.
- Se valido upload de PNG valido `qa-campaign.png`: UI muestra `Imagen agregada.`, boton cambia a `Reemplazar`, `Eliminar` queda habilitado, preview/panel muestran imagen.
- Se valido render publico de imagen PNG sin sesion:
  - `GET /api/public/promotional-campaign-images/627CF91B-BC78-48A7-93F4-2B515EEE4B7E`
  - resultado `200 image/png`, 68 bytes.
- Se valido negativo de tipo invalido con `qa-invalid.svg`: UI muestra `Usa una imagen JPG, PNG o WebP.` y conserva la imagen valida anterior.
- Se valido reemplazo con JPEG `qa-replace.jpg`: UI actualiza a nueva URL publica y preview sigue renderizando imagen.
- Se valido render publico de imagen JPEG sin sesion:
  - `GET /api/public/promotional-campaign-images/7C66E3B0-04BF-4BB5-8F4B-8C57357C3266`
  - resultado `200 image/jpeg`, 516 bytes.
- Se valido negativo de tamano con `qa-too-large.png` de 1,048,577 bytes: UI muestra `La imagen supera el limite de 1 MB.` y conserva la imagen valida anterior.
- Se valido eliminacion desde UI con confirmacion manual del Product Owner por bloqueo de automatizacion: pantalla final muestra `Imagen eliminada.`, `Sin imagen`, boton `Eliminar` deshabilitado y `Agregar imagen`.
- Se valido que la URL publica de la imagen reemplazada queda inactiva tras eliminar:
  - `GET /api/public/promotional-campaign-images/7C66E3B0-04BF-4BB5-8F4B-8C57357C3266`
  - resultado `404 application/json`, 99 bytes.

Hallazgos:
- No se detectaron P0/P1/P2/P3 de producto en el alcance validado.
- Observacion QA: la automatizacion del navegador integrado no pudo seleccionar archivos por si sola ni mantener estable el click final de eliminacion; las selecciones de archivo y la confirmacion final de eliminacion fueron asistidas manualmente por el Product Owner en la misma sesion controlada. La evidencia visual y HTTP confirma el resultado.

P0/P1:
- Ninguno.

P2/P3:
- Ninguno.

Evidencia:
- Campana QA publicada creada sin imagen: `QA TASK-676 imagen 202607020338`, campaignId `9`.
- Upload PNG: `Imagen agregada.`, URL publica opaca `.../627CF91B-BC78-48A7-93F4-2B515EEE4B7E`, preview con `naturalWidth=1`, `naturalHeight=1`, GET publico `200 image/png`.
- Tipo invalido SVG: mensaje visible `Usa una imagen JPG, PNG o WebP.`.
- Reemplazo JPEG: URL publica opaca `.../7C66E3B0-04BF-4BB5-8F4B-8C57357C3266`, GET publico `200 image/jpeg`, 516 bytes.
- Tamano invalido: mensaje visible `La imagen supera el limite de 1 MB.`.
- Eliminacion: evidencia visual aportada por Product Owner muestra `Sin imagen`, boton `Eliminar` deshabilitado y mensaje `Imagen eliminada.`.
- Render publico post-eliminacion: GET de la ultima URL publica devuelve `404`, confirmando que imagen eliminada no queda servida como activa.

Uso DB cloud: Si, motivo y alcance
- Motivo: QA publicado con sesion real/controlada sobre ambiente productivo de Punto Club.
- Alcance: creacion de una campana QA, carga/reemplazo/eliminacion de metadata/imagen de campana y validaciones HTTP read-only del render publico. No se consulto Azure SQL directamente desde QA y no se enviaron correos reales.

Riesgos o pendientes:
- Queda una campana QA creada en ambiente publicado (`QA TASK-676 imagen 202607020338`) sin imagen activa. No se envio a destinatarios.
- WebP esta permitido por contrato, pero esta QA publicada cubrio PNG/JPEG y negativos SVG/tamano. Compatibilidad amplia de WebP en clientes de correo queda como observacion futura si Product lo prioriza.
- Limpieza fisica de blobs reemplazados/eliminados queda fuera del alcance, segun riesgo aceptado en TASK-673/TASK-675.

Siguiente recomendado:
- Product / Release puede cerrar la publicacion de imagen opcional en campanas como aprobada para uso controlado. Mantener restriccion de no enviar correos promocionales reales salvo autorizacion explicita posterior.
