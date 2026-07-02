Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Bugfix preview imagen
Tarea completada: TASK-680 - Corregir inclusion de imagen de campana en preview y correo promocional

Resultado:
- Se diagnostico que el contrato ya asociaba la imagen activa a la campana en `GET campaign`, `preview` y envio, pero el HTML de correo podia quedar con `src="/api/public/..."` relativo si no existia `PUBLIC_API_BASE_URL`.
- Se ajusto la construccion de URL publica para que el correo pueda resolver imagenes desde:
  - `PUBLIC_API_BASE_URL`, si existe.
  - `APP_PUBLIC_BASE_URL + /api`, si no existe `PUBLIC_API_BASE_URL`.
  - URL del request, cuando aplica en preview/API local.
- Se agrego cobertura para confirmar que:
  - `buildPreview` devuelve la imagen activa con `imageUrl` `/api/public/promotional-campaign-images/{publicId}`.
  - `buildPromotionalEmail` convierte esa ruta publica a URL absoluta usando `APP_PUBLIC_BASE_URL`.
  - El envio consulta la imagen activa de la campana correcta y la incluye en el HTML enviado.

Archivos cambiados:
- `api/src/functions/promotionalCampaigns.js`
- `api/test/promotional-campaigns.test.js`
- `tasks/TASK-680-HANDOFF.md`

Validacion ejecutada:
- `node --check api\src\functions\promotionalCampaigns.js`
- `node --check api\test\promotional-campaigns.test.js`
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js`
- `git diff --check`

Resultado pruebas:
- `163` tests passed.
- `0` failed.
- Nota: por el script actual de `api/package.json`, el comando de test ejecuto el suite completo configurado.

Uso Azure SQL:
- No.
- Motivo: bugfix local de contrato/render y tests unitarios; no requirio leer ni modificar datos reales.

Correos reales / flags:
- No se enviaron correos reales.
- No se cambio `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se tocaron secretos ni configuracion Azure.

Pendientes / riesgos:
- P2: confirmar en Infra/Release que produccion tenga `APP_PUBLIC_BASE_URL` correcto o `PUBLIC_API_BASE_URL` explicito antes de prueba real con imagen.
- P2: validar visual publicado despues de deploy con una campana real con imagen activa.
