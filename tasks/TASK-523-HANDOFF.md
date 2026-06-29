Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea: TASK-523 - Decidir publicacion del paquete local de comunicaciones

Resultado:
- Decision tomada: aprobar publicacion controlada del paquete local de comunicaciones como UI local/mock bloqueada para envio real.
- No se hizo push en esta tarea.
- No se hizo deploy.
- No se uso Azure ni Azure SQL.

Decision:
- Publicar en una tarea separada los commits locales:
  - `a5986b3 chore: define customer communications model`
  - `2d4c1c2 chore: commit communications center package`
- La publicacion debe tratarse como deploy Web/frontend, porque el paquete modifica `app/**`.
- No hay publicacion API ni SQL en este bloque.

Justificacion:
- QA local TASK-521 aprobo sin P0/P1.
- El envio real sigue bloqueado en UI.
- Las campanas promocionales siguen bloqueadas visualmente.
- No hay cambios `api/**`.
- No hay cambios `database/**`.
- No hay cambios `.github/workflows/**`.
- El paquete permite revisar visualmente el centro de comunicaciones sin habilitar correos reales, ACS, SQL ni backend.

Observaciones aceptadas:
- P3: `npx prettier --check` puede seguir marcando formato en `app/index.html` y `app/styles.css`.
- Decision: no bloquear publicacion por este P3 si el objetivo es validar UI mock publicada y no existe gate formal de Prettier en el workflow actual.
- P3: QA interactiva fue local/mock sin sesion real completa.
- Decision: aceptar para publicacion controlada porque no hay API real ni envio real conectado.

Impacto esperado de push:
- Workflow frontend:
  - Si, deberia dispararse porque los commits modifican `app/**`.
- Workflow API:
  - No deberia dispararse porque no hay cambios `api/**` ni `.github/workflows/azure-functions-api.yml`.
- Azure SQL:
  - No aplica.

Verificacion ejecutada:
- `git status --short --branch`
- `git log --oneline --decorate origin/main..HEAD`
- `git diff --name-status origin/main..HEAD`
- `git diff --name-only origin/main..HEAD -- api database .github/workflows`
- Revision de `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
- Lectura de `tasks/TASK-521-HANDOFF.md`
- Lectura de `tasks/TASK-522-HANDOFF.md`
- `git diff --check origin/main..HEAD -- app/index.html app/src/app.js app/styles.css`

Uso cloud/SQL:
- No se uso cloud.
- No se uso Azure SQL.
- No hubo push ni deploy.

Riesgos o pendientes:
- El push publicara una UI mock de comunicaciones visible en Web.
- El envio real debe seguir bloqueado despues del deploy.
- La configuracion y datos de comunicaciones siguen siendo locales/mock hasta que se implemente SQL/API.
- `debug.log` sigue como archivo local no trackeado y debe excluirse de cualquier commit/push.

Siguiente recomendado:
- Crear/ejecutar tarea de release:
  - push controlado a `origin/main`;
  - confirmar workflow frontend;
  - validar que API workflow no se dispare.
- Crear/ejecutar QA Web publicada:
  - validar seccion `Comunicaciones`;
  - confirmar envio real bloqueado;
  - confirmar que campanas promocionales siguen bloqueadas;
  - confirmar que no hay regresion de navegacion principal.

Movimiento de tablero sugerido:
- TASK-523 a Done / Ready for Web release.
