Equipo: Web Dev
Modo de ejecucion: Promociones / Fix sincronizacion UI
Tarea completada: TASK-718 - Corregir estado UI despues de editar campana draft

Resultado:
- Se corrigio la desincronizacion del panel `Crear/Editar campaña` despues de guardar cambios sobre una campaña editable/draft.
- Despues de un `PATCH` exitoso, la UI conserva el objeto real de campaña actualizado, mantiene el formulario editable y refresca listas de gestion/envio.
- Si la campaña editada esta seleccionada para envio, el preview se actualiza con asunto/mensaje/includePoints vigentes.
- No se cambio API, SQL, ACS, flags, sender ni reglas de envio.
- No se enviaron correos reales.

Causa:
- El endpoint publicado de actualizacion devuelve la campaña dentro de `{ campaign }`.
- El cliente Web estaba usando esa respuesta como si fuera directamente la campaña.
- Al no encontrar `id/status` en el objeto esperado, el panel interpretaba la campaña como no editable y dejaba campos/listas desincronizados.

Cambios realizados:
- `app/src/customerApi.js`
  - `updatePromotionalCampaign` ahora normaliza la respuesta HTTP y devuelve `result.campaign || result`.
- `app/src/app.js`
  - `submitPromotionalCampaignDraft` tambien normaliza defensivamente `savedCampaign?.campaign || savedCampaign` antes de refrescar estado local, listas y preview.

Validacion local:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `npx prettier --check app/src/app.js app/src/customerApi.js`
- `git diff --check`
- Smoke local con navegador Playwright y mock API:
  - Login mock correcto.
  - Crear campaña draft.
  - Seleccionar la campaña para envio.
  - Editar nombre/asunto/mensaje/includePoints desde `Crear/Editar campaña`.
  - Confirmar boton `Guardar cambios`.
  - Confirmar campos habilitados.
  - Confirmar listas de gestion y envio con nombre actualizado y sin nombre anterior.
  - Confirmar preview de envio actualizado con el asunto/mensaje editado.

Uso Azure SQL:
- No.
- Motivo: tarea Web local de sincronizacion UI; no requeria datos reales ni migracion.

Riesgos o pendientes:
- Pendiente QA publicada focal con sesion real/controlada para confirmar el fix contra `https://api.puntoclubcr.com/api`.
- Pendiente revalidar, despues del fix publicado, reemplazo/eliminacion de imagen en campaña draft segun observacion de TASK-717.
- No se probo envio real promocional y debe seguir sin ejecutarse salvo autorizacion explicita.

Notas de proceso:
- `docs/OPERATING_STATUS.md`, `docs/PROJECT_OPERATING_RULES.md` y `tasks/TASK-718.md` no existen en este checkout; se uso como fuente la tarea pegada por Product Owner y el handoff `tasks/TASK-717-HANDOFF.md`.
