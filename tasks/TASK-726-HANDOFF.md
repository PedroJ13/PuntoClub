Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Email image fix
Tarea completada: TASK-726 - Corregir render de imagen en correo promocional

Resultado:
- Se corrigio el render de imagen en correos promocionales para que el `src` pueda salir como URL absoluta HTTPS publica basada en el host real del API.
- El flujo de envio ahora pasa el `request` al builder del correo.
- El fallback de URL absoluta prioriza:
  - `PUBLIC_API_BASE_URL`, si existe.
  - URL del request de Azure Functions, por ejemplo `https://api.puntoclubcr.com/api`.
  - `APP_PUBLIC_BASE_URL + /api`, solo como ultimo fallback.
- El HTML mantiene `alt` escapado, imagen hospedada por URL publica controlada, ancho compatible con email y sin adjuntar archivos pesados.
- No se cambio SQL, ACS, sender, secretos ni feature flags.
- No se enviaron correos reales.

Cambios realizados:
- `api/src/functions/promotionalCampaigns.js`
  - `buildAbsoluteApiUrl` ahora prefiere el API base derivado del request antes que `APP_PUBLIC_BASE_URL`.
  - `buildPromotionalEmail` acepta `options.request` y lo pasa a `buildPreview`.
  - `sendPromotionalCampaignToRecipients` acepta `request` y lo usa al construir cada email.
  - El handler `sendPromotionalCampaign` pasa el `request` real al flujo de envio.
- `api/test/promotional-campaigns.test.js`
  - El test de envio promocional con imagen ahora inyecta un request de `https://api.puntoclubcr.com/api/...`.
  - La prueba exige `src="https://api.puntoclubcr.com/api/public/promotional-campaign-images/{publicId}"`.
  - La prueba rechaza explicitamente `src="/api/public/..."`.

Validacion local:
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/test/promotional-campaigns.test.js`
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/test/promotional-campaigns.test.js`
- `git diff --check`
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js`
  - Resultado: `166` tests passed, `0` failed.

Uso Azure SQL:
- No.
- Motivo: fix de render HTML y contrato backend sin migracion ni consulta de datos reales.

Correos reales / ACS:
- No se enviaron correos reales.
- No se activo ni desactivo `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se cambio ACS, sender ni secretos.

Riesgos o pendientes:
- Falta publicar el cambio y ejecutar QA publicada con una campaña con imagen activa.
- Falta envio real controlado a mailbox autorizado por Product Owner para confirmar render en cliente de correo, si Product/Release lo aprueba.
- La URL antigua usada como evidencia de QA en TASK-717 devolvio `404` al consultarla sin cookies durante este diagnostico; se necesita una imagen activa vigente para validacion final.
