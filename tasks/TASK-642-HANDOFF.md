Equipo: Backend/API
Modo de ejecucion: Auth / Diagnostico sesion promociones
Tarea completada: TASK-642 - Diagnosticar sesion invalida en endpoints de campanas promocionales

Resultado:
- Se reviso el ambiente publicado con foco en Aurisbel `companyId=8`.
- No se modificaron datos.
- No se enviaron correos.
- No se cambiaron flags.
- No se cambiaron secretos ni configuracion.

Hallazgo principal:
- En los intentos recientes del PO, el backend no recibe una cookie de sesion valida en los requests posteriores al login.
- La sesion server-side si se crea en DB al hacer login, pero los endpoints siguientes llegan como no autenticados.
- Por eso:
  - `/api/me` responde `401`;
  - `GET /api/companies/8/settings` responde `404` por fallback sin sesion al `PILOT_COMPANY_ID=6`;
  - `POST /api/companies/8/promotional-campaigns` responde `401`.

Evidencia de Application Insights:
- Ventana revisada: `2026-07-01T21:05:00Z` a `2026-07-01T21:12:00Z`.
- Requests observados:
  - `2026-07-01T21:06:35Z` `companyAuthLogin` -> `200`.
  - `2026-07-01T21:07:28Z` `getCompanySettings /companies/8/settings` -> `404`.
  - `2026-07-01T21:08:24Z` `companyAuthLogin` -> `200`.
  - `2026-07-01T21:08:24Z` `getCompanySettings /companies/8/settings` -> `404`.
  - `2026-07-01T21:09:31Z` `getMe` -> `401`.
  - `2026-07-01T21:09:51Z` `companyAuthLogin` -> `200`.
  - `2026-07-01T21:09:51Z` `getCompanySettings /companies/8/settings` -> `404`.
  - `2026-07-01T21:10:33Z` `createPromotionalCampaign /companies/8/promotional-campaigns` -> `401`.
  - `2026-07-01T21:10:43Z` `companyAuthLogin` -> `200`.
  - `2026-07-01T21:10:44Z` `getCompanySettings /companies/8/settings` -> `404`.
  - `2026-07-01T21:11:02Z` `createPromotionalCampaign /companies/8/promotional-campaigns` -> `401`.

Evidencia SQL read-only:
- `dbo.CompanySessions` para `companyId=8`:
  - `activeValid = 12`;
  - `activeExpired = 20`;
  - `revoked = 2`;
  - `total = 34`;
  - `latestCreatedAt = 2026-07-01T21:10:44Z`;
  - `latestExpiresAt = 2026-07-02T09:10:44Z`.
- Sesiones recientes creadas para usuario de Aurisbel con email enmascarado `ev***@gmail.com`:
  - `sessionId=66`, creada `2026-07-01T21:10:44Z`, expira `2026-07-02T09:10:44Z`, `activeNow=true`, `lastSeenAt=NULL`.
  - `sessionId=65`, creada `2026-07-01T21:10:12Z`, expira `2026-07-02T09:10:12Z`, `activeNow=true`, `lastSeenAt=NULL`.
  - `sessionId=64`, creada `2026-07-01T21:09:51Z`, expira `2026-07-02T09:09:51Z`, `activeNow=true`, `lastSeenAt=NULL`.
- El `lastSeenAt=NULL` en sesiones recién creadas confirma que la sesion se crea, pero no vuelve a ser usada exitosamente por `/me` o settings.

CORS / cookie:
- CORS publicado:
  - `supportCredentials=true`.
  - Origen permitido: `https://puntoclubcr.com`.
  - Origen permitido: `https://www.puntoclubcr.com`.
- Preflight `OPTIONS /api/company-auth/login` desde `https://puntoclubcr.com`:
  - `204 No Content`;
  - `Access-Control-Allow-Credentials: true`;
  - `Access-Control-Allow-Origin: https://puntoclubcr.com`;
  - `Access-Control-Allow-Headers: content-type`;
  - `Access-Control-Allow-Methods: POST`.
- Preflight `OPTIONS /api/companies/8/promotional-campaigns` desde `https://puntoclubcr.com`:
  - `204 No Content`;
  - `Access-Control-Allow-Credentials: true`;
  - `Access-Control-Allow-Origin: https://puntoclubcr.com`.
- App settings no tienen overrides explicitos de:
  - `COMPANY_SESSION_COOKIE_NAME`;
  - `COMPANY_SESSION_COOKIE_SECURE`;
  - `COMPANY_SESSION_COOKIE_SAMESITE`;
  - `COMPANY_SESSION_TTL_HOURS`.
- Por codigo, los defaults publicados son:
  - cookie `puntoclub_company_session`;
  - `HttpOnly`;
  - `Secure`;
  - `SameSite=None`;
  - TTL default 12 horas.

Interpretacion tecnica:
- No se encontro diferencia Backend/API entre GET y POST que explique el fallo por metodo.
- La diferencia real es presencia/ausencia de cookie:
  - cuando hay cookie valida, los endpoints autenticados pueden resolver empresa;
  - en los intentos revisados, login crea sesion pero los requests posteriores no usan esa sesion.
- Inferencia: el navegador no esta almacenando o no esta reenviando la cookie cross-site de `func-puntoclub-prod-br-001.azurewebsites.net` al llamar desde `puntoclubcr.com`. Esto puede ocurrir por bloqueo de cookies de terceros o politica del navegador, aunque CORS y SameSite/Secure esten correctos para el modelo actual.

Uso Azure SQL:
- Si.
- Motivo: validar existencia, estado y expiracion de sesiones server-side.
- Alcance: consultas read-only a `dbo.CompanySessions` y `dbo.CompanyUsers`, sin leer ni exponer `token_hash`.

Firewall / acceso temporal:
- Se creo regla temporal estrecha:
  - `tmp-task642-sessiondiag-200-229-6-68`
  - `200.229.6.68-200.229.6.68`.
- El delete fue bloqueado por lock `puntoclub-sqlserver-cannotdelete`.
- No se retiro el lock desde esta tarea.
- Alternativa segura aplicada:
  - regla neutralizada a `0.0.0.1-0.0.0.1`.
- Verificacion final:
  - regla `tmp-task642-sessiondiag-200-229-6-68`: `0.0.0.1-0.0.0.1`;
  - lock SQL Server presente;
  - lock SQL DB presente.

Riesgos o pendientes:
- La arquitectura actual depende de cookie cross-site contra `azurewebsites.net`; si el navegador bloquea cookies de terceros, el login puede responder `200` pero la sesion no queda usable.
- Recomendacion tecnica posterior: evaluar dominio/API same-site bajo `puntoclubcr.com` o un proxy/API path same-site para evitar dependencia de cookies de terceros.
- TASK-643 mitiga el estado visual falso en Web validando `/me` antes de mostrar `Enviar campanas`.
