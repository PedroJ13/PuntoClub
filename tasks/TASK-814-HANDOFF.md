Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UI real data
Tarea completada: TASK-814 - Reemplazar KPIs estaticos por resumen real

Resultado:
- Reemplazados KPIs estaticos del centro de comunicaciones por datos del endpoint real.
- La UI ya no muestra `5`, `128`, `9` ni `Pausadas` como placeholders quemados.
- En carga muestra `...`.
- En error muestra `-` y evita numeros falsos.
- El mock local calcula datos coherentes con la regla del API.
- No se cambio API adicional fuera del contrato de TASK-813.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `tasks/TASK-814-HANDOFF.md`

Detalle UI:
- Se agregaron IDs a los cuatro KPIs:
  - `communications-kpi-operational`;
  - `communications-kpi-subscribed`;
  - `communications-kpi-unsubscribed`;
  - `communications-kpi-promotions`.
- Se agrego `aria-live="polite"` al bloque de KPIs.
- Se agrego `api.getCommunicationsSummary()`.
- Se carga el resumen:
  - al cargar datos de empresa;
  - al entrar a `Enviar campañas`;
  - al presionar actualizar campañas;
  - despues de guardar configuracion de correos operativos;
  - despues de crear/editar campana;
  - despues de baja promocional;
  - despues de envio promocional.
- El mock local calcula:
  - operativos activos desde switches mock;
  - suscritos con email valido y preferencia `subscribed`;
  - bajas con preferencia `unsubscribed`;
  - promociones `Pausadas` por defecto mock.

Validaciones:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `npx prettier --check api/src/lib/repository.js api/src/functions/communicationsSummary.js api/test/communications-summary.test.js api/test/repository-customer-search.test.js api/package.json app/index.html app/src/app.js app/src/customerApi.js`
- `git diff --check`
- `npm --prefix api test` como regresion del contrato consumido.

Resultado de validaciones:
- Sintaxis Web OK.
- Prettier OK.
- `git diff --check` sin errores; solo avisos LF/CRLF.
- Suite API completa: 177/177 pass.

Uso Azure SQL:
- No.
- Motivo: cambio local de UI/API client con mock y contrato API cubierto por tests.

Riesgos o pendientes:
- Requiere publicacion Web junto con API de TASK-813.
- QA debe validar estado loading/error y que no aparezcan placeholders falsos si el endpoint falla.
