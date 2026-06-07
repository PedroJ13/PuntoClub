Equipo:
QA

Tarea validada:
TASK-087 - Ejecutar smoke operativo pre-sesion.

Fecha / hora de ejecucion:
2026-06-06 19:58:22 -06:00

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- SQL: `sqlserver-pj13-brazil/sql-db-puntoclub`
- Company ID: `1`
- Navegador: Chrome headless con CDP

Resultado:
Listo para sesion piloto despues de calentamiento SQL.

Resumen:
El frontend publicado carga correctamente con `API real`, SQL paso de `Paused` a `Online`, `/api/companies/1/settings` respondio `200` despues del calentamiento y la busqueda simple desde UI funciono sin errores criticos. No se crearon datos nuevos porque el runbook indica no crear clientes/compras/redenciones salvo autorizacion explicita.

Checks ejecutados:
- Lectura de `docs/PILOT_RUNBOOK.md`.
- Lectura de `tasks/PO_TEST_CLIENTES_FLOW.md`.
- Carga HTTP del frontend publicado.
- Consulta de estado SQL con `az sql db show`.
- Llamada a endpoint liviano `/api/companies/1/settings`.
- Espera y reintento despues de detectar SQL `Paused`.
- Apertura de frontend publicado en Chrome headless.
- Confirmacion de UI con `API real`.
- Confirmacion de que no aparecen textos `Zona`/`zona`.
- Confirmacion de foco inicial en busqueda.
- Confirmacion de paneles principales.
- Busqueda simple desde UI sin crear datos.
- Revision de consola/CDP.
- Validacion desktop sin overflow horizontal.

Datos QA creados:
- Ninguno.

Evidencia runbook:
- Frontend publicado:
  - HTTP `200`
  - carga `Punto Club`
  - tiempo aproximado `993 ms`
  - `hasZona: false`
- SQL primer chequeo:
  - `status: Paused`
  - `currentServiceObjectiveName: GP_S_Gen5_2`
  - `autoPauseDelay: 60`
- Primer intento de `/settings`:
  - timeout a `30s`
  - consistente con base serverless en frio descrita por runbook.
- SQL despues de calentamiento:
  - `status: Online`
  - `currentServiceObjectiveName: GP_S_Gen5_2`
  - `autoPauseDelay: 60`
- `/settings` despues de calentamiento:
  - HTTP `200`
  - `ok: true`
  - tiempo aproximado `791 ms`
  - longitud de respuesta `151`

Evidencia UI:
- Estado inicial:
  - titulo `Punto Club`
  - `apiReal: true`
  - `puntoClub: true`
  - `bodyZona: []`
  - foco `customer-search`
  - no carga clientes automaticamente: `noAutoRows: 0`
  - paneles principales presentes: `Buscar cliente`, `Registrar cliente`, `Resultados`, `Operacion`
- Busqueda simple:
  - termino `+50671492617`
  - tiempo aproximado `1303 ms`
  - resultado `Task 071 Cliente 63492617 +50671492617 task071-63492617@example.com PTS. 75 Compra Historial Redimir`
  - `feedback: ""`
  - `hasApiError: false`
- Desktop:
  - `innerWidth: 1280`
  - `scrollWidth: 1280`
  - `overflowX: false`
  - `offscreenCount: 0`

Consola / errores:
- No hubo excepciones JS capturadas por la pagina.
- CDP registro un `404` de recurso no critico.
- No hubo `500`, error CORS visible ni error SQL persistente.

Hallazgos:
P0/P1:
- Ninguno.

P2/P3:
- Ninguno abierto.
- Nota operativa: SQL estaba `Paused` al inicio y requirio calentamiento. Es esperado por Azure SQL serverless y quedo resuelto siguiendo el runbook.

Recomendacion:
- Ejecutar la sesion piloto. Hacer el calentamiento 10 a 15 minutos antes, como indica `docs/PILOT_RUNBOOK.md`, para evitar que el primer usuario perciba el tiempo de reanudacion de SQL.

Riesgos o pendientes:
- Si el ambiente queda inactivo, SQL puede volver a `Paused`; repetir el endpoint liviano antes de la sesion.
- No se ejecuto flujo con creacion de datos QA porque no hubo autorizacion explicita para esta verificacion pre-sesion.
- No se tocaron codigo, Azure ni secretos.
