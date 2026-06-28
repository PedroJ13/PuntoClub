Equipo: Product / Architect / Release
Modo de ejecucion: Git / Release decision
Tarea: TASK-507 - Decidir publicacion del paquete local de trazabilidad y migracion legacy

Resultado:
- Decision tomada: aprobar publicacion controlada del paquete local de trazabilidad/migracion legacy a `origin/main`, pero en una tarea separada de push.
- No se hizo push en esta tarea.
- No se hizo deploy.
- No se uso Azure, Azure SQL ni servicios externos.
- No se aplico ni publico `d777038`.

Decision:
- Publicar solo los commits locales actuales de `main`:
  - `d510c0c chore: restore legacy migration traceability package`
  - commit local `chore: record release hygiene handoffs`
  - commit local de esta decision `TASK-507`, si se commitea antes del push
- Mantener fuera:
  - `d777038`
  - rama `codex/pre-seo-reconcile-main-task500`
  - `stash@{0}`

Justificacion:
- Los commits ahead son de trazabilidad, documentacion, tooling local de migracion y scripts SQL de preparacion.
- No hay cambios bajo `api/**`.
- No hay cambios bajo `app/**`.
- No hay cambios en `.github/workflows/**`.
- Los workflows actuales solo disparan en push a `main` si cambian:
  - API: `api/**` o `.github/workflows/azure-functions-api.yml`
  - Frontend: `app/**` o `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
- Por lo tanto, un push de estos commits no deberia desplegar API ni frontend.

Verificacion ejecutada:
- `git status --short --branch`
- `git log --oneline --decorate origin/main..HEAD`
- Revision de `.github/workflows/azure-functions-api.yml`
- Revision de `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`

Uso cloud/SQL:
- No se uso cloud.
- No se uso Azure SQL.
- No se uso GitHub remoto en escritura.
- Solo Git local y lectura de archivos.

Riesgos o pendientes:
- Aunque los filtros de workflow no deberian disparar deploy, conviene verificar GitHub Actions despues del push.
- No borrar `stash@{0}` ni la rama de resguardo hasta confirmar que la publicacion quedo correcta y que no se necesita recuperar nada mas.
- `d777038` sigue siendo un paquete mixto grande; no publicarlo sin tareas por bloque.

Siguiente recomendado:
- Crear/ejecutar una tarea de push controlado:
  - empujar `main` a `origin/main`;
  - confirmar que no se dispararon deployments API/Web, o que no hubo cambios operativos;
  - documentar resultado.
- Luego crear una tarea final de limpieza para decidir si conservar o borrar `stash@{0}` y la rama `codex/pre-seo-reconcile-main-task500`.

Movimiento de tablero sugerido:
- TASK-507 a Done / Ready for push task.
