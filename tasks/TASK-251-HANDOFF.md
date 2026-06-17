# TASK-251 - Handoff Backend/API

Equipo: Backend/API

Modo de ejecucion: Backend/API

## Resultado

Completado.

La API publicada ya contiene los endpoints de configuracion de membresias implementados en TASK-247.

## Dependencia SQL

Confirmado antes de validar:

- TASK-250 aplico `database/migrations/20260613_memberships_mvp.sql` en Azure SQL.
- Se habilito `loyalty_memberships_enabled=1` solo para `companyId=6`, nombre seguro `DEMO 1`.

## Deploy

Se publico la API local a Azure Functions con zip deploy directo.

Ambiente:

- Function App: `func-puntoclub-prod-br-001`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

Notas:

- No hubo commit nuevo en esta tarea.
- No se imprimieron secretos ni app settings sensibles.
- El paquete excluyo `local.settings.json`, logs y tests.

## Endpoints publicados validados sin sesion

Todos los endpoints de membresias dejaron de responder `404` y responden protegidos con `401` sin sesion:

```text
GET   /api/membership-plans?status=all             -> 401
POST  /api/membership-plans                        -> 401
GET   /api/membership-plans/1/benefits?status=all  -> 401
POST  /api/membership-plans/1/benefits             -> 401
PATCH /api/membership-benefits/1                   -> 401
```

Control de regresion:

```text
GET /api/me -> 401
```

No se usaron cookies, passwords ni tokens reales.

## Tests ejecutados

- `npm test` en `api` fuera del sandbox:
  - tests: 107
  - pass: 107
  - fail: 0

## Riesgos o pendientes para Web Dev/QA

- Web debe publicarse con la seccion `Membresias` y metodos de `customerApi` de TASK-248.
- QA debe ejecutar prueba positiva con sesion real o evidencia PO redaccionada.
- Sin sesion solo se confirmo proteccion y existencia de rutas; no se crearon planes/beneficios reales en esta tarea.
