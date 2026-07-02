Equipo: Infra / Azure
Modo de ejecucion: Auth / Dominio y cookies
Tarea completada: TASK-684 - Evaluar configuracion de API bajo dominio propio para evitar cookies cross-site

Resultado:
- Se confirmo que el frontend publicado en `https://puntoclubcr.com` consume la API en `https://func-puntoclub-prod-br-001.azurewebsites.net`.
- Esto hace que la cookie de sesion sea cross-site/third-party para navegadores modernos cuando la pagina esta en `puntoclubcr.com`.
- No se cambio DNS.
- No se cambiaron app settings.
- No se tocaron secretos.

Evidencia publica:
- `https://puntoclubcr.com/app-config.js` contiene:
  - `PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`.
- `https://www.puntoclubcr.com/` redirige `301` hacia `https://puntoclubcr.com/`.
- CORS publicado permite:
  - `https://puntoclubcr.com`;
  - `https://www.puntoclubcr.com`;
  - `Access-Control-Allow-Credentials: true`.

Evaluacion:
- CORS y `SameSite=None; Secure` son necesarios, pero no suficientes si el navegador/incognito bloquea cookies de terceros.
- Mientras la API viva en `azurewebsites.net` y la Web en `puntoclubcr.com`, el sistema depende de que el navegador acepte cookies de tercero.
- Ese modelo es fragil para incognito y navegadores con proteccion anti-tracking.

Ruta recomendada:
- Mover el consumo autenticado de API a un dominio same-site controlado por Punto Club.
- Opcion recomendada practica:
  - configurar subdominio `api.puntoclubcr.com` apuntando a Azure Functions;
  - actualizar CORS para permitir `https://puntoclubcr.com` y `https://www.puntoclubcr.com`;
  - mantener cookie `SameSite=None; Secure` si frontend apex y API subdominio siguen siendo cross-origin, pero ya quedan same-site bajo eTLD+1 `puntoclubcr.com`;
  - actualizar `PUNTO_CLUB_API_BASE_URL` a `https://api.puntoclubcr.com`.
- Alternativa mas integrada:
  - proxy/rewrite same-origin `/api/*` desde Static Web Apps/edge hacia Functions, si la arquitectura elegida lo soporta de forma segura.

Riesgos:
- Requiere coordinacion DNS/Cloudflare + Azure Functions custom domain/certificado.
- Puede requerir ajuste de CORS antes de cambiar `app-config.js`.
- Debe validarse login, `/api/me`, logout y endpoints privados despues del cambio.
- No usar wildcard CORS con credentials.

Costos esperados:
- DNS/Cloudflare: sin costo adicional si se usa zona actual.
- Certificado: normalmente administrado/sin costo adicional si Azure/Cloudflare lo cubren segun ruta elegida.
- Azure Functions: no cambia SKU por si solo.
- Tráfico: sin cambio material para MVP.

Archivos cambiados:
- `tasks/TASK-684-HANDOFF.md`

Verificacion ejecutada:
- Probes publicos con `curl.exe` a:
  - `https://puntoclubcr.com/app-config.js`
  - `https://www.puntoclubcr.com/`
  - preflight CORS desde apex y www hacia `POST /api/company-auth/login`.

Uso Azure:
- No se ejecutaron cambios Azure.
- No se listaron app settings para evitar exponer secretos.
