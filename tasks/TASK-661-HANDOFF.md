Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-661 - Decidir publicacion de fix navegacion Enviar campanas

Resultado:
- Se revisaron los handoffs `TASK-657` y `TASK-658`.
- Se aprueba publicar el fix Web de navegacion en `Enviar campanas`.
- La publicacion aprobada incluye solo:
  - `app/src/app.js`;
  - handoffs `TASK-657`, `TASK-658` y `TASK-661`.

Hallazgos procesados:
- `TASK-657` identifico la causa del rebote de `Enviar campanas` a `Atender cliente`:
  - `isLoginPage` se calculaba una sola vez al cargar el bundle;
  - despues de login, la ruta podia cambiar a `/app`, pero la constante conservaba el estado inicial;
  - `refreshAuthIdentity()` podia interpretar que seguia en login y ejecutar `showMainApp()`;
  - `showMainApp()` usaba la seccion default, normalmente `Atender cliente`.
- `TASK-657` corrigio:
  - `refreshAuthIdentity()` ahora consulta `isCompanyLoginRoute()` en tiempo real;
  - `showMainApp()` acepta `options.section` para preservar la seccion solicitada cuando aplica.
- `TASK-658` aprobo QA local/mock:
  - click lateral `Enviar campanas` mantiene modulo `communications`;
  - tabs `Clientes`, `Historial` y `Enviar campanas` no rebotan a operaciones;
  - filtros y botones de seleccion/limpieza mantienen URL/estado estable;
  - sin P0/P1/P2/P3 abiertos.

Decision:
- Publicar el fix Web.
- No mezclar con el refinamiento visual de `TASK-659`; queda como tarea separada posterior.
- No mezclar con tareas de imagen opcional de campana; esa trazabilidad se retoma con numeracion nueva.

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
- `git diff --check -- app\src\app.js`: OK.

Riesgos o pendientes:
- Falta QA publicado despues del deploy con sesion real/controlada.
- `TASK-657` y `TASK-658` documentan colision de numeracion previa con tareas de imagen de campana; se recomienda conservar la definicion funcional de `TASK-656` y continuar imagen con numeros nuevos.

Uso Azure SQL:
- No.
- Motivo: decision de release Web/navegacion sin datos reales.

Siguiente recomendado:
- Ejecutar `TASK-662` para commit y push controlado del fix.
