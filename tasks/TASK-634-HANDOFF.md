Equipo: Product / Architect / Release
Modo de ejecucion: Web Release
Tarea completada: TASK-634 - Commit y push controlado del manejo de sesion vencida en promociones

Resultado:
- Se realizo commit y push controlado del ajuste Web para manejo de sesion vencida en promociones.
- Se incluyo `app/src/app.js`.
- Se incluyeron handoffs `TASK-630`, `TASK-631`, `TASK-632` y `TASK-633`.
- `debug.log` quedo excluido.
- No se reenviaron correos.
- No se cambiaron feature flags.
- No se modifico API, SQL, ACS, sender ni secretos.

Commit publicado:
- `754f2212bad3242cc9c129f9e8273058048680b8`
- Mensaje: `Handle expired sessions in promotional campaigns`
- Push: `origin/main`

Validacion local previa:
- `node --check app\src\app.js`: OK.
- `node --check app\src\customerApi.js`: OK.
- `git diff --check -- app\src\app.js app\src\customerApi.js`: OK.
- Observacion: Git mostro warnings LF/CRLF no bloqueantes.

Workflow publicado:
- `Deploy Punto Club frontend`
- Run: `28535818787`
- URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28535818787`
- Estado: `completed`
- Conclusion: `success`
- SHA: `754f2212bad3242cc9c129f9e8273058048680b8`

Smoke publicado seguro:
- `GET https://puntoclubcr.com/?cb=task634` -> `200`.
- `GET https://puntoclubcr.com/src/app.js?cb=task634` -> `200`.
- `app.js` publicado contiene:
  - `Tu sesión expiró. Accede nuevamente a tu panel.`;
  - `isAuthRequiredError(error)`.

Confirmacion de alcance:
- No se abrio sesion real.
- No se llamo endpoint de campanas.
- No se llamo endpoint de envio.
- No se envio correo real.
- No se activo ni desactivo `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se ejecuto migracion SQL.
- No se consulto Azure SQL.

Pendientes:
- Repetir prueba publicada con sesion real/controlada:
  - si la sesion esta vencida, debe redirigir a login con mensaje claro;
  - si la sesion esta valida, guardar campana deberia crear/listar/seleccionar la campana.
- Si vuelve a aparecer `401` inmediatamente despues de login real, capturar hora exacta y evidencia de navegador para diagnostico de cookies/headers.
- `tasks/TASK-634-HANDOFF.md` queda local para trazabilidad posterior.

Uso Azure SQL:
- No.
- Motivo: release Web + workflow + smoke HTTP publicado sin sesion.

Siguiente recomendado:
- PO puede repetir primero guardado de campana con sesion recien iniciada.
- Solo despues de confirmar guardado estable, repetir prueba real controlada de envio promocional.
