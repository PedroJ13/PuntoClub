Equipo: Infra / Azure
Modo de ejecucion: Auth / Dominio API
Tarea completada: TASK-700 - Completar asociacion Azure de api.puntoclubcr.com

Resultado:
- Se confirmo que PO/Cloudflare ya creo los registros requeridos:
  - TXT `asuid.api.puntoclubcr.com`
  - CNAME `api.puntoclubcr.com`
- Se agrego `api.puntoclubcr.com` como hostname custom en la Function App:
  - `func-puntoclub-prod-br-001`
- Se creo certificado administrado de App Service para:
  - `api.puntoclubcr.com`
- Se enlazo el certificado al hostname con SNI.
- Se confirmo HTTPS funcional en:
  - `https://api.puntoclubcr.com`
- Se confirmo CORS estricto con credentials.
- No se cambio `app-config.js`.
- No se tocaron secretos, SQL, ACS, sender ni datos de negocio.

DNS confirmado:
- TXT:
  - `asuid.api.puntoclubcr.com`
  - valor confirmado: `d35ebbb98d4e875e5d10653b12884d137eed0203041e4415e921c5dbab0dbad1`
- CNAME:
  - `api.puntoclubcr.com -> func-puntoclub-prod-br-001.azurewebsites.net`

Azure Functions:
- Function App:
  - `func-puntoclub-prod-br-001`
- Resource group:
  - `resource_group_main`
- Hostnames al cierre:
  - `api.puntoclubcr.com`
  - `func-puntoclub-prod-br-001.azurewebsites.net`
- Hostname binding:
  - `api.puntoclubcr.com`
  - `hostNameType: Verified`
  - `sslState: SniEnabled`
  - `thumbprint: 0F6AB93F79AEBE9A27AE9F51925731F92FEE55F6`
- `httpsOnly`:
  - `true`

Certificado:
- Tipo:
  - App Service Managed Certificate
- Subject:
  - `api.puntoclubcr.com`
- Issuer:
  - `GeoTrust TLS RSA CA G1`
- Expira:
  - `2027-01-02T23:59:59+00:00`
- Thumbprint:
  - `0F6AB93F79AEBE9A27AE9F51925731F92FEE55F6`

CORS final:
- `allowedOrigins`:
  - `https://puntoclubcr.com`
  - `https://www.puntoclubcr.com`
- `supportCredentials`:
  - `true`
- Sin wildcard.

Validacion ejecutada:
- `GET https://api.puntoclubcr.com/api/me`
  - resultado esperado sin sesion: `401 UNAUTHORIZED`
  - respuesta: `{"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}`
- Preflight CORS desde `https://puntoclubcr.com`:
  - `204 No Content`
  - `Access-Control-Allow-Credentials: true`
  - `Access-Control-Allow-Origin: https://puntoclubcr.com`
- Preflight CORS desde `https://www.puntoclubcr.com`:
  - `204 No Content`
  - `Access-Control-Allow-Credentials: true`
  - `Access-Control-Allow-Origin: https://www.puntoclubcr.com`
- Preflight desde origen no permitido `https://evil.example`:
  - `204 No Content`
  - sin `Access-Control-Allow-Origin`
  - sin `Access-Control-Allow-Credentials`
- `app/app-config.js` sigue apuntando a:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net`

Observacion operativa:
- Despues del bind SSL hubo una propagacion breve donde el borde aun servia certificado incorrecto.
- Tras esperar aproximadamente 45 segundos, HTTPS quedo funcional y `curl` valido el dominio sin `--insecure`.

Uso Azure SQL:
- No.

Riesgos:
- El frontend publicado aun no usa `https://api.puntoclubcr.com`; esto queda para TASK-698 o una tarea equivalente de Web/Release.
- Si se requiere QA local contra API publicada, CORS actualmente no permite localhost por decision de TASK-697/TASK-700.
- Mantener `azurewebsites.net` disponible como fallback operativo hasta que Web y QA validen el cambio.

Siguiente recomendado:
- Web Dev: actualizar `PUNTO_CLUB_API_BASE_URL` a `https://api.puntoclubcr.com` sin cambiar UI.
- QA: validar login normal/incognito, refresh, logout y endpoints privados con API same-site.
