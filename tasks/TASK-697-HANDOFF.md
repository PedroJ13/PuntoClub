Equipo: Infra / Azure
Modo de ejecucion: Auth / Dominio API
Tarea parcialmente ejecutada: TASK-697 - Configurar API bajo dominio api.puntoclubcr.com

Resultado:
- Se preparo la configuracion Azure posible sin acceso Cloudflare/DNS.
- Se activo `httpsOnly=true` en la Function App productiva.
- Se dejo CORS estricto solo para:
  - `https://puntoclubcr.com`
  - `https://www.puntoclubcr.com`
- `supportCredentials` queda en `true`.
- No hay wildcard en CORS.
- No se cambio `app-config.js`.
- No se tocaron secretos, SQL, ACS, datos de negocio ni sender.

Estado de Azure Functions:
- Function App:
  - `func-puntoclub-prod-br-001`
- Resource group:
  - `resource_group_main`
- Hostname actual:
  - `func-puntoclub-prod-br-001.azurewebsites.net`
- `httpsOnly`:
  - `true`
- Hostnames habilitados al cierre:
  - `func-puntoclub-prod-br-001.azurewebsites.net`
  - `func-puntoclub-prod-br-001.scm.azurewebsites.net`
- `api.puntoclubcr.com` no quedo agregado porque Azure requiere validacion DNS previa.

Bloqueo DNS / Cloudflare:
- No hay conector Cloudflare ni variables de entorno Cloudflare disponibles en esta sesion.
- `api.puntoclubcr.com` no resuelve publicamente desde el entorno local.
- El intento de asociar el hostname en Azure fallo con validacion esperada:
  - falta TXT `asuid.api.puntoclubcr.com`
  - valor requerido por Azure: `d35ebbb98d4e875e5d10653b12884d137eed0203041e4415e921c5dbab0dbad1`

Registro DNS requerido:
- Crear en Cloudflare:
  - Tipo: `TXT`
  - Nombre: `asuid.api`
  - Valor: `d35ebbb98d4e875e5d10653b12884d137eed0203041e4415e921c5dbab0dbad1`
  - Proxy: no aplica para TXT
- Luego crear o confirmar el registro de routing para `api.puntoclubcr.com` hacia la Function App segun soporte de Azure/App Service:
  - recomendado: `CNAME api -> func-puntoclub-prod-br-001.azurewebsites.net`
  - si Cloudflare proxy causa problemas de validacion/certificado, dejarlo inicialmente en DNS only hasta completar Azure.

Verificacion ejecutada:
- `az functionapp show ...` confirmo `httpsOnly=true` y que `api.puntoclubcr.com` aun no esta en `hostNames`.
- `az functionapp cors show ...` confirmo:
  - `allowedOrigins`: `https://puntoclubcr.com`, `https://www.puntoclubcr.com`
  - `supportCredentials`: `true`
- `curl https://api.puntoclubcr.com/api/health` fallo por DNS:
  - `Could not resolve host: api.puntoclubcr.com`
- Smoke seguro de API actual:
  - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/me`
  - resultado esperado sin sesion: `401 UNAUTHORIZED`

Uso Azure SQL:
- No.

Riesgos:
- Mientras DNS no exista y Azure no acepte el hostname, Web no debe apuntar a `https://api.puntoclubcr.com`.
- Se retiraron origenes locales y el dominio SWA antiguo de CORS para cumplir la consigna estricta; si se requiere probar la Web local contra API publicada, Infra debe agregar temporalmente el origen local y retirarlo al cierre.
- Falta certificado/SSL del dominio custom una vez Azure acepte el hostname.

Siguiente recomendado:
- Product Owner / Cloudflare: crear TXT `asuid.api` y CNAME `api`.
- Infra / Azure: reintentar `az functionapp config hostname add`, emitir/asociar certificado administrado si aplica y validar `https://api.puntoclubcr.com/api/me`.
- Web Dev: ejecutar TASK-698 solo despues de que Infra confirme dominio HTTPS validado.
