Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-687 - Decidir publicacion de fixes imagen campana y mensaje sesion

Resultado:
- Se revisaron `TASK-680` a `TASK-686`.
- Se aprueba publicar el paquete API/Web con los fixes locales de imagen de campana y mensaje de sesion no persistida.
- No se aprueban cambios DNS, CORS, SQL, ACS ni feature flags dentro de esta publicacion.
- No se autoriza envio real de correos durante la publicacion.

Handoffs procesados:
- `tasks/TASK-680-HANDOFF.md`
- `tasks/TASK-681-HANDOFF.md`
- `tasks/TASK-682-HANDOFF.md`
- `tasks/TASK-683-HANDOFF.md`
- `tasks/TASK-684-HANDOFF.md`
- `tasks/TASK-685-HANDOFF.md`
- `tasks/TASK-686-HANDOFF.md`

Decision de publicacion:
- Aprobar publicacion API/Web.
- Incluir:
  - `api/src/functions/promotionalCampaigns.js`
  - `api/test/promotional-campaigns.test.js`
  - `app/src/app.js`
  - handoffs `TASK-680` a `TASK-687`
- Excluir:
  - `debug.log`
  - `tmp/`
  - handoffs antiguos no relacionados

Alcance aprobado:
- Backend/API:
  - Construir URL absoluta para imagen de campana en correo promocional usando `PUBLIC_API_BASE_URL`, `APP_PUBLIC_BASE_URL + /api` o URL del request cuando aplique.
  - Mantener imagen activa en `preview` y envio.
  - Agregar cobertura para preview y email con imagen activa.
- Web:
  - Sincronizar imagen activa devuelta por preview con la campana seleccionada.
  - Preservar imagen despues de envio si la respuesta no trae propiedad `image`.
  - Validar `/api/me` inmediatamente despues de login.
  - Mostrar mensaje especifico si el login responde OK pero la sesion no queda persistida en el navegador.

QA y riesgos:
- `TASK-682` quedo bloqueada para correo real con imagen porque falta evidencia PO/QA posterior a publicacion.
- `TASK-686` quedo no aprobada porque el bundle publicado aun no tenia `SESSION_NOT_PERSISTED`; precisamente este release publica ese fix.
- Sigue vigente el riesgo arquitectonico de cookies cross-site entre `puntoclubcr.com` y `func-puntoclub-prod-br-001.azurewebsites.net`.
- La solucion definitiva recomendada por Infra sigue siendo mover API a dominio same-site, por ejemplo `api.puntoclubcr.com`, o proxy same-origin equivalente.

Reglas de release:
- No enviar correos reales.
- No cambiar `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No cambiar DNS.
- No cambiar CORS.
- No cambiar app settings.
- No tocar Azure SQL.
- No tocar ACS ni sender.

Uso Azure SQL:
- No.
- Motivo: decision de release y publicacion de codigo sin migraciones.

Siguiente recomendado:
- Ejecutar `TASK-688` para commit y push controlado.
- Luego crear/repetir QA publicado para:
  - preview con imagen visible;
  - correo real controlado con imagen, solo si PO autoriza envio;
  - login normal/incognito y mensaje de sesion no persistida.
