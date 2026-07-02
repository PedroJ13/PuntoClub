Equipo: Product / Architect / Release
Modo de ejecucion: Auth / Dominio API
Tarea completada: TASK-696 - Decidir correccion estructural de sesion con API same-site

Resultado:
- Se procesa evidencia de login en navegador incognito donde el usuario/password son correctos, pero la sesion no se conserva.
- Se confirma que el problema no apunta a password incorrecto.
- Se decide avanzar con una correccion estructural: exponer la API autenticada bajo dominio same-site controlado por Punto Club.
- Ruta recomendada: `https://api.puntoclubcr.com`.
- No se hicieron cambios DNS, Azure, CORS, app settings, API, Web, SQL ni ACS en esta tarea.

Evidencia procesada:
- Captura PO en incognito muestra el mensaje:
  - `No pudimos conservar la sesión en este navegador. Actualiza la página o revisa si el navegador está bloqueando cookies.`
- Ese mensaje fue agregado en `TASK-685` y publicado en `TASK-688`.
- Por implementacion, ese mensaje solo aparece cuando:
  1. `POST /api/company-auth/login` responde correctamente; y
  2. `GET /api/me` falla con `401 UNAUTHORIZED` porque la cookie/sesion no quedo disponible para la llamada siguiente.

Handoffs revisados:
- `tasks/TASK-683-HANDOFF.md`
- `tasks/TASK-684-HANDOFF.md`
- `tasks/TASK-685-HANDOFF.md`
- `tasks/TASK-686-HANDOFF.md`
- `tasks/TASK-688-HANDOFF.md`

Diagnostico consolidado:
- Frontend publicado:
  - `https://puntoclubcr.com`
- API publicada actual:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net`
- Config actual:
  - `PUNTO_CLUB_API_BASE_URL = "https://func-puntoclub-prod-br-001.azurewebsites.net"`
- La cookie de sesion se emite desde `azurewebsites.net`.
- Desde una pagina en `puntoclubcr.com`, esa cookie se comporta como third-party/cross-site para navegadores modernos.
- CORS y `SameSite=None; Secure` son necesarios, pero no evitan que incognito o protecciones anti-tracking bloqueen cookies de terceros.

Decision:
- Avanzar con API bajo dominio same-site controlado por Punto Club.
- Opcion aprobada para planificacion:
  - `https://api.puntoclubcr.com`
- Objetivo:
  - reducir o eliminar dependencia de cookies third-party/cross-site;
  - mejorar login en incognito y navegadores con bloqueo anti-tracking;
  - mantener separacion operativa API/Web sin reescribir auth.

No se elige por ahora:
- Mantener indefinidamente `azurewebsites.net` como host autenticado principal.
- Considerar el caso como error de password.
- Relajar seguridad de cookies.
- Usar CORS wildcard con credentials.

Requisitos para Infra:
- Preparar DNS/Cloudflare para `api.puntoclubcr.com`.
- Configurar dominio/certificado en Azure Functions o ruta equivalente soportada.
- Ajustar CORS de forma estricta:
  - `https://puntoclubcr.com`
  - `https://www.puntoclubcr.com`
  - sin wildcard con credentials.
- Confirmar que la API responde:
  - `/api/me`
  - `/api/company-auth/login`
  - endpoints privados principales.
- No cambiar app-config hasta que el dominio API este verificado.

Requisitos para Web:
- Despues de Infra, actualizar `PUNTO_CLUB_API_BASE_URL` a:
  - `https://api.puntoclubcr.com`
- Mantener `credentials: include`.
- No cambiar copy ni UX salvo que QA detecte algo.

Requisitos para QA:
- Validar login publicado con empresa autorizada:
  - navegador normal;
  - incognito;
  - refresh;
  - logout;
  - endpoints privados basicos.
- Confirmar que ya no aparece el mensaje de sesion no conservada en incognito.
- No exponer credenciales, cookies ni tokens.

Uso Azure SQL:
- No.
- Motivo: decision funcional/arquitectonica sin cambios cloud ni consultas DB.

Riesgos:
- Requiere coordinacion Cloudflare + Azure.
- Puede requerir validacion de certificado y CORS antes de cambiar Web.
- Durante la transicion, si Web apunta al nuevo dominio antes de que API/CORS este listo, login y endpoints privados pueden fallar.
- Debe mantenerse `azurewebsites.net` disponible como fallback operativo hasta confirmar QA publicado.

Siguiente recomendado:
- Infra / Azure: configurar `api.puntoclubcr.com` sin cambiar Web todavia.
- Web Dev / Release: cambiar `PUNTO_CLUB_API_BASE_URL` cuando Infra confirme dominio API listo.
- QA: validar login normal/incognito despues del cambio.
