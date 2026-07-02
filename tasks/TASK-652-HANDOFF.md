Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UX destinatarios
Tarea completada: TASK-652 - Ajustar UX de destinatarios y tabs en Enviar campanas

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/styles.css`
- `tasks/TASK-652-HANDOFF.md`

Implementacion:
- Se quito la pestaña `Configuración` del subnav de `Enviar campañas`.
- Se ajusto `setCommunicationView` para que las vistas disponibles sean:
  - `send`;
  - `customers`;
  - `history`.
- Se agrego buscador local en `Seleccionar destinatarios`:
  - label `Buscar destinatario`;
  - placeholder `Nombre o correo`;
  - filtra por nombre o email;
  - respeta tildes/mayusculas mediante `normalize`.
- El filtro de busqueda no cambia la seleccion existente.
- Si no hay coincidencias, muestra `No hay destinatarios para este filtro.`
- Al presionar `Limpiar selección` ahora tambien se limpia el panel de resultado/mensaje de selección.

Reglas preservadas:
- No se cambio API.
- No se cambio SQL.
- No se cambio ACS.
- No se cambiaron flags.
- No se enviaron correos.
- No se cambio la logica de destinatarios elegibles.
- No se cambia seleccion existente al buscar; solo cambia la lista visible.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check -- app\index.html app\src\app.js app\styles.css`

Uso Azure SQL:
- No.
- Motivo: ajuste local de UI/UX; no requiere DB real.

Riesgos o pendientes:
- Falta QA visual para confirmar que la busqueda de destinatarios funciona bien en desktop/mobile.
- Falta QA funcional para validar que una seleccion se conserva aunque el filtro oculte temporalmente un destinatario seleccionado.
- Publicacion queda para tarea posterior de release.
