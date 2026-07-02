Equipo: Web Dev
Modo de ejecucion: Auth / Configuracion API
Tarea bloqueada: TASK-698 - Apuntar Web a api.puntoclubcr.com

Resultado:
- No se cambio `PUNTO_CLUB_API_BASE_URL`.
- No se modifico UI, copy, CSS ni flujo de login.
- No se publico cambio Web.

Motivo:
- TASK-698 depende de TASK-697.
- TASK-697 no pudo completar el dominio custom porque `api.puntoclubcr.com` aun no resuelve y Azure requiere validacion DNS previa.
- La consigna de TASK-697 indica explicitamente:
  - no cambiar `app-config` todavia sin validacion del dominio.

Estado actual de configuracion Web:
- `app/app-config.js` conserva:
  - `PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`
- Se confirmo por busqueda local que los metodos privados relevantes usan `credentials: "include"` en `app/src/customerApi.js`, incluyendo login, `/me`, logout y endpoints privados.

Validacion ejecutada:
- Lectura de `app/app-config.js`.
- Busqueda local de `PUNTO_CLUB_API_BASE_URL` y `credentials` en `app/src/customerApi.js`.

Uso Azure SQL:
- No.

Pendiente para desbloquear:
- Infra debe confirmar que `https://api.puntoclubcr.com`:
  - resuelve DNS;
  - esta asociado a Azure Functions;
  - tiene HTTPS/certificado valido;
  - responde endpoints seguros como `/api/me`;
  - conserva CORS estricto con credentials.
- Despues de eso, actualizar `app/app-config.js` a:
  - `https://api.puntoclubcr.com`
- Validar login, `/me`, logout y endpoints privados con `credentials: include`.
