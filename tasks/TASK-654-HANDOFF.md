Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-654 - Decidir publicacion de ajustes UX destinatarios y tabs

Resultado:
- Se revisaron los handoffs `TASK-652` y `TASK-653`.
- Se aprueba publicar los ajustes UX de destinatarios y tabs en `Enviar campañas`.
- La publicacion aprobada incluye solo Web:
  - `app/index.html`;
  - `app/src/app.js`;
  - `app/styles.css`.

Hallazgos procesados:
- `TASK-652` implemento:
  - quitar la pestaña `Configuración` de `Enviar campañas`;
  - limitar el subnav a `Enviar campañas`, `Clientes` e `Historial`;
  - agregar buscador local de destinatarios por nombre o correo;
  - mantener seleccion existente al filtrar;
  - limpiar/ocultar panel de resultado al presionar `Limpiar selección`.
- `TASK-653` aprobo QA local/mock:
  - no aparece la pestaña `Configuración`;
  - busqueda por nombre/correo funciona;
  - busqueda sin coincidencias muestra estado vacio;
  - clientes dados de baja siguen visibles/deshabilitados;
  - seleccion manual se conserva al cambiar filtro;
  - limite MVP de 5 se mantiene;
  - responsive mobile sin overflow horizontal;
  - sin P0/P1/P2/P3 abiertos.

Decision:
- Publicar el ajuste UX.
- No requerir API/SQL/ACS porque el cambio es de UI local y QA local lo aprobo.

Confirmaciones de alcance:
- No cambiar API.
- No cambiar SQL.
- No cambiar ACS.
- No cambiar sender.
- No cambiar secretos.
- No activar ni desactivar feature flags.
- No reenviar correos.
- No ejecutar envio real.

Validacion adicional ejecutada por Product / Architect / Release:
- `node --check app\src\app.js`: OK.
- `node --check app\src\customerApi.js`: OK.
- `git diff --check -- app\index.html app\src\app.js app\styles.css`: OK.

Riesgos o pendientes:
- Falta QA publicado despues del deploy.
- La validacion fue local/mock; no se usaron datos reales ni envios reales.

Uso Azure SQL:
- No.
- Motivo: decision de release Web/UX sin datos reales.

Siguiente recomendado:
- Ejecutar `TASK-655` para commit y push controlado del ajuste UX.
