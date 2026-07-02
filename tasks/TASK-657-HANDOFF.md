Equipo: Web Dev
Modo de ejecucion: Comunicaciones / Navegacion
Tarea completada: TASK-657 - Corregir redireccion incorrecta al hacer click en Enviar campanas

Resultado:
- Se corrigio el manejo de sesion que podia devolver la app a la seccion por defecto `Atender cliente` al hacer click en `Enviar campanas`.
- `Enviar campanas`, `Clientes` e `Historial` se mantienen dentro del modulo de comunicaciones.
- No se cambio API.
- No se cambio SQL.
- No se cambio ACS.
- No se cambiaron flags.
- No se enviaron correos.

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-657-HANDOFF.md`

Causa identificada:
- `isLoginPage` se calculaba una sola vez al cargar el bundle.
- Despues de login, la URL podia cambiar a `/app`, pero la constante seguia reflejando el estado inicial.
- Cuando la navegacion hacia comunicaciones refrescaba la sesion, `refreshAuthIdentity()` podia interpretar que seguia en login y volver a ejecutar `showMainApp()`.
- `showMainApp()` usaba la seccion por defecto, que normalmente es `Atender cliente`.

Correccion aplicada:
- `refreshAuthIdentity()` ahora consulta la ruta actual con `isCompanyLoginRoute()` en tiempo real.
- `showMainApp()` ahora acepta una seccion solicitada via `options.section`, manteniendo el comportamiento por defecto cuando no se especifica.
- La navegacion principal de comunicaciones conserva `activeSection="communications"` y la subvista activa `send/customers/history` sin rebotar a operaciones.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`

Resultado de verificacion:
- Sintaxis OK.
- No se ejecutaron pruebas con API real.
- No se levanto servidor local.

Uso Azure SQL:
- No.
- Motivo: cambio exclusivo de navegacion frontend.

Riesgos o pendientes:
- P2: conviene que QA valide publicado el flujo exacto despues de deploy:
  - login empresa;
  - click en `Enviar campanas`;
  - cambiar a `Clientes`;
  - cambiar a `Historial`;
  - volver a `Enviar campanas`;
  - confirmar que no cae en `Atender cliente`.
- P3: existe choque de numeracion: este handoff reemplaza el `TASK-657-HANDOFF.md` creado previamente para una definicion de Infra sobre storage de imagenes de campanas. Product / Architect / Release deberia reconciliar la numeracion si ese handoff todavia se necesita como registro separado.

Siguiente recomendado:
- QA local/publicado debe validar navegacion de comunicaciones con sesion activa y sesion vencida.
