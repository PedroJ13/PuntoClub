Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Email image rendering
Tarea completada: TASK-725 - Diagnosticar imagen rota en correo promocional

Resultado:
- Se reviso el HTML generado por `buildPromotionalEmail` para campañas promocionales con imagen.
- Se confirmo causa probable de imagen rota: el render ya intentaba absolutizar `campaign.image.imageUrl`, pero el flujo real de envio no pasaba el `request` al builder del correo.
- Sin `PUBLIC_API_BASE_URL`, el fallback podia usar `APP_PUBLIC_BASE_URL + /api` o conservar una ruta relativa segun ambiente, dejando `src` no confiable para clientes de correo.
- ACS no reescribe el HTML en el codigo local: `sendEmailViaAcs` pasa `message.html` directamente como `content.html` al SDK de Azure Communication Services.
- El endpoint publico de imagen esta definido como `GET /api/public/promotional-campaign-images/{publicId}`, `authLevel: anonymous`, y cuando encuentra imagen responde el binario con `Content-Type` tomado de metadata (`image/png`, `image/jpeg` o `image/webp`) y cache publico.

Validacion de URL publica:
- Se intento validar sin cookies la URL documentada por QA en TASK-717:
  - `https://api.puntoclubcr.com/api/public/promotional-campaign-images/E261B459-F13C-4A77-9902-7FE96D6E84D0`
- Resultado observado el 2026-07-02:
  - `HEAD`: `404 Not Found`.
  - `GET` sin cookies: `404 Not Found`, `Content-Type: application/json`.
- Interpretacion:
  - Esa URL puntual ya no sirve como evidencia de imagen activa disponible.
  - No se modificaron datos para buscar o regenerar otra imagen activa.
  - El bug de render HTML se diagnostico por codigo y tests locales.

Archivos revisados:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/notifier.js`
- `api/test/promotional-campaigns.test.js`
- `tasks/TASK-680-HANDOFF.md`
- `tasks/TASK-687-HANDOFF.md`
- `tasks/TASK-688-HANDOFF.md`
- `tasks/TASK-717-HANDOFF.md`

Uso Azure SQL:
- No.
- Motivo: diagnostico de render backend y endpoint publico; no se requirio consultar ni modificar datos.

Correos reales / ACS:
- No se enviaron correos reales.
- No se cambio sender, ACS, secretos ni flags.

Riesgos o pendientes:
- Para confirmar entrega visual end-to-end falta una prueba publicada con una campaña que tenga imagen activa vigente y envio real controlado solo a mailbox autorizado por Product Owner.
- Si `PUBLIC_API_BASE_URL` no existe en produccion, el fix de TASK-726 debe usar el request del endpoint de envio para construir `https://api.puntoclubcr.com/api/public/...`.
