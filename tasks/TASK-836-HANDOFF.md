Equipo: Web Dev
Modo de ejecucion: Logo empresa / UX estado
Tarea completada: TASK-836 - Corregir estado visual del logo al actualizar

Resultado:
- Corregido el estado visual del bloque logo al presionar Actualizar en Mi empresa.
- `loadCompanySettings()` ahora limpia tambien mensajes del bloque Logo antes de renderizar la respuesta fresca.
- Si `GET /companies/{companyId}/settings` trae `logoUrl`, se renderiza el logo persistido.
- Si el GET no trae `logoUrl`, se limpia el mensaje `Logo actualizado` y se muestra el estado real `Sin logo cargado`.
- No se agrego boton Guardar adicional.
- No se cambio API desde Web.
- No se cambio SQL.
- No se cambio Storage.
- No se cambio ACS, sender ni flags.

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-836-HANDOFF.md`

Validaciones:
- `node --check app/src/app.js`
- `npx prettier --check api/src/lib/repository.js api/test/repository-formatters.test.js app/src/app.js`
- `git diff --check`
- `npm --prefix api test` como regresion del contrato consumido.

Resultado de validaciones:
- Sintaxis Web OK.
- Prettier OK.
- Suite API completa: 180/180 pass.
- `git diff --check` sin errores; solo avisos LF/CRLF.

Uso Azure SQL:
- No para TASK-836.
- Motivo: ajuste local de estado UI; no requiere DB real.

Riesgos o pendientes:
- Requiere publicar Backend de TASK-834 para que el refresh reciba `logoUrl` persistido desde metadata privada.
- QA debe validar en publicado que despues de subir logo y presionar Actualizar no queda estado contradictorio.
