Equipo: Backend/API
Modo de ejecucion: Auth / Diagnostico promociones
Tarea completada: TASK-630 - Diagnosticar 401 al guardar campana promocional con sesion activa

Resultado:
- Se diagnostico el endpoint publicado `POST /api/companies/8/promotional-campaigns`.
- No se enviaron correos.
- No se cambiaron feature flags.
- No se modificaron datos de negocio.
- No se hicieron cambios Backend/API.

Hallazgo principal:
- El `401 Authentication is required` corresponde al comportamiento backend esperado cuando el request llega sin cookie de sesion valida.
- El preflight CORS publicado para `https://puntoclubcr.com` esta correcto:
  - `Access-Control-Allow-Origin: https://puntoclubcr.com`
  - `Access-Control-Allow-Credentials: true`
  - `Access-Control-Allow-Headers: content-type`
  - `Access-Control-Allow-Methods: POST`
- El frontend publicado contiene `credentials: "include"` para:
  - `listPromotionalCampaigns`
  - `createPromotionalCampaign`
  - `getPromotionalCampaign`
  - `previewPromotionalCampaign`
  - `listPromotionalRecipients`
  - `selectPromotionalCampaignRecipients`
  - `sendPromotionalCampaign`
- El contrato backend de promociones usa `requireSessionIdentity` y compara `companyId` de ruta contra `identity.company.id`; si no hay cookie, devuelve `401`; si la empresa no coincide, devolveria `403`.

Evidencia publicada:
- Prueba controlada sin cookie contra `POST /api/companies/8/promotional-campaigns` reprodujo:
  - HTTP `401`
  - body: `{"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}`
- Application Insights mostro requests promocionales recientes:
  - `listPromotionalCampaigns` `200` para `/api/companies/8/promotional-campaigns`
  - `getPromotionalCampaign` `200`
  - `previewPromotionalCampaign` `200`
  - `listPromotionalRecipients` `200`
  - `createPromotionalCampaign` `401` en varios intentos publicados
- En la misma ventana de logs tambien aparecen:
  - `getMe` `200`
  - `getCompanySettings` `200`
  - `listOperationalEmailHistory` `200`
- Esto confirma que hay momentos con sesion valida en GETs y momentos donde el POST de guardar campana llega sin sesion valida o con sesion ya no aceptada.

Limitacion de reproduccion:
- El navegador interno disponible para esta ejecucion no tenia sesion real activa de Aurisbel; la app publicada mostro `Sesion no iniciada`.
- Por seguridad no se pidieron ni usaron credenciales reales.
- No se pudo reproducir manualmente el flujo completo con sesion real/controlada desde este entorno.

Comparacion contra endpoints que si cargan:
- Los endpoints que cargan datos de la misma pantalla usan el mismo patron de `credentials: "include"` y pasan por la misma validacion de sesion.
- Si esos endpoints responden `200` y el POST responde `401`, el backend esta recibiendo el POST sin cookie de sesion valida en ese momento.
- No se encontro evidencia de mismatch `companyId` vs sesion; ese caso daria `403 FORBIDDEN`, no `401`.

Conclusion tecnica:
- No hay bug confirmado en contrato Backend/API ni CORS para `createPromotionalCampaign`.
- El problema visible para usuario queda en manejo Web de autenticacion expirada/invalida: la UI puede quedar mostrando empresa activa por estado local aunque el servidor ya no acepte la sesion para el POST.
- Se recomienda que Web trate `UNAUTHORIZED/FORBIDDEN` en promociones como sesion vencida, limpie estado local y redirija a login.

Uso Azure SQL:
- No.
- Motivo: el diagnostico se hizo con HTTP publicado, Application Insights y revision de contrato/codigo; no requirio consultar datos SQL.

Riesgos o pendientes:
- Se observo un `sendPromotionalCampaign` `500` reciente en logs, fuera del alcance directo de este diagnostico de `401` al guardar campana.
- Si el PO reproduce el caso luego del ajuste Web y sigue viendo `401` inmediatamente despues de un `getMe 200`, conviene capturar hora exacta y revisar cookies/headers de ese POST desde DevTools o navegador controlado con sesion real.
