# TASK-253 - Handoff QA

Equipo: QA

Tarea validada: TASK-253 - Revalidar configuracion de membresias publicada

Ambiente: publicado

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-13

## Resultado

Aprobado con observacion.

La revalidacion corrige los P1 de TASK-249:

- La API publicada ya contiene endpoints de membresias y ya no responde `404`.
- Los endpoints de membresias estan protegidos sin sesion y responden `401`.
- La Web publicada ya contiene la seccion `Membresias`, paneles de planes/beneficios y metodos de `customerApi`.
- `Admin empresas` sigue oculto del menu normal.
- La operacion de puntos no muestra regresion en los checks seguros ejecutados.

No se ejecuto CRUD positivo real de planes/beneficios porque QA no recibio credenciales reales, cookie segura ni evidencia PO nueva para esta tarea. Queda como P2 pendiente.

No se modifico codigo.

## Evidencia revisada

Se leyeron:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-249-HANDOFF.md`
- `tasks/TASK-250-HANDOFF.md`
- `tasks/TASK-251-HANDOFF.md`
- `tasks/TASK-252-HANDOFF.md`

Resumen de dependencias:

- TASK-249 no aprobo porque Web/API publicadas no contenian membresias.
- TASK-250 aplico `database/migrations/20260613_memberships_mvp.sql` en Azure SQL y habilito membresias solo para una empresa de prueba segura (`companyId=6`, `DEMO 1`).
- TASK-251 publico API de membresias y reporto endpoints protegidos con `401` sin sesion.
- TASK-252 publico Web con seccion `Membresias` y marcadores de UI/API.

## Checks publicados ejecutados

### Web / bundle

Rutas y assets publicados:

- `/`: `200`, `htmlLength=45809`.
- `/login`: `200`.
- `/company-registration`: `200`.
- `/admin-companies`: `200`.
- `/src/app.js`: `200`, `appLength=140785`.
- `/src/customerApi.js`: `200`, `customerApiLength=61187`.
- `/styles.css`: `200`, `cssLength=26465`.
- `Last-Modified`: `Sat, 13 Jun 2026 20:21:03 GMT`.
- `ETag`: `"73889698"`.

Marcadores de membresias:

- Navegacion `Membresias`: presente.
- `data-section-target="memberships"`: presente.
- Navegacion `Membresias` oculta por defecto (`hidden`): presente.
- `memberships-section`: presente.
- `membership-plans-list`: presente.
- `membership-benefits-list`: presente.
- `listMembershipPlans`: presente.
- `listMembershipBenefits`: presente.
- `/api/membership-plans`: presente.
- `loyaltyMembershipsEnabled`: presente.
- `isMembershipsEnabled`: presente.
- Copy defensivo `Membresias no esta habilitado para esta empresa.`: presente.

Resultado:

- Aprobado para publicacion Web de membresias.
- Aprobado para ocultamiento inicial por defecto y uso del flag `loyaltyMembershipsEnabled`.
- La validacion visual real de visibilidad con sesion/empresa habilitada queda pendiente por falta de sesion real.

### Regresion Web / menu

Marcadores publicados:

- `data-section-target="adminCompanies" hidden`: presente.
- `Operaciones`: presente.
- `Mi empresa`: presente.
- `Reportes`: presente.
- `Buscar cliente`: presente.
- `Registrar cliente`: presente.
- `Operacion`: presente.
- `localStorage`: no encontrado en HTML/JS publicado revisado.
- `sessionStorage`: no encontrado en HTML/JS publicado revisado.
- `window.confirm`: no encontrado en JS publicado revisado.

Resultado:

- Aprobado. `Admin empresas` sigue fuera del menu normal y la pantalla de puntos/operacion sigue presente en el bundle publicado.

### API membresias sin sesion

Endpoints publicados:

- `GET /api/membership-plans?status=all` sin sesion:
  - `401`.

- `POST /api/membership-plans` sin sesion:
  - `401`.

- `PATCH /api/membership-plans/1` sin sesion:
  - `401`.

- `POST /api/membership-plans/1/activate` sin sesion:
  - `401`.

- `POST /api/membership-plans/1/deactivate` sin sesion:
  - `401`.

- `GET /api/membership-plans/1/benefits?status=all` sin sesion:
  - `401`.

- `POST /api/membership-plans/1/benefits` sin sesion:
  - `401`.

- `PATCH /api/membership-benefits/1` sin sesion:
  - `401`.

Resultado:

- Aprobado. Los endpoints ya no responden `404` y quedan protegidos sin sesion.

### Regresion API segura

- `GET /api/me` sin sesion:
  - `401`.

- `GET /api/my-company/logo` sin sesion:
  - `401`.

- `GET /api/companies/1/customers?search=qa-task253-smoke` con cookie sintetica invalida:
  - `401`.

- `GET /api/companies/6/customers?search=qa-task253-smoke` con cookie sintetica invalida:
  - `401`.

- `GET /api/companies/999/customers?search=qa-task253-smoke` sin sesion:
  - `404`.

Resultado:

- Aprobado. Se conserva el comportamiento seguro validado en TASK-186: cookie sintetica invalida no autoriza operaciones y empresa inexistente/no permitida sin sesion responde `404`.

## No ejecutado

No se ejecuto:

- login real;
- listar/crear/editar plan con sesion;
- activar/inactivar plan con sesion;
- listar/crear/editar beneficios con sesion;
- validaciones server-side de payload autenticado;
- prueba visual real de `Membresias` visible para `companyId=6` / `DEMO 1`;
- prueba visual real de empresa con `loyaltyMembershipsEnabled = false`;
- prueba por rol `staff`.

Motivo:

- QA no recibio credenciales reales, cookie/sesion segura ni evidencia PO nueva para esta tarea.
- No se deben inventar credenciales ni exponer secretos.

## P0/P1

- P0: ninguno.
- P1: ninguno.

## P2/P3

- P2: falta prueba positiva real o evidencia PO redaccionada:
  - `Membresias` visible solo si `loyaltyMembershipsEnabled = true`;
  - listar/crear/editar/activar/inactivar plan;
  - listar/crear/editar/activar/inactivar beneficio;
  - validaciones de payload con sesion;
  - permisos por rol `staff`, si existe usuario disponible.
- P3: ninguno nuevo.

## Regresion ejecutada

- Web publicada carga y contiene el shell operativo.
- Menu normal conserva `Operaciones`, `Mi empresa` y `Reportes`.
- `Admin empresas` sigue oculto.
- Pantalla de operacion de puntos conserva marcadores de buscar/registrar cliente y operacion.
- `/api/me` sin sesion sigue protegido con `401`.
- Operacion con cookie sintetica invalida sigue protegida con `401`.

## Riesgos o pendientes

- La aprobacion es tecnica/publicada con negativos seguros; no sustituye una prueba funcional positiva con sesion real.
- Validar CRUD de membresias apenas haya credenciales/evidencia PO segura.
- Mantener cuidado con empresas sin membresias habilitadas; Web contiene el flag y ocultamiento, pero falta prueba visual real con una sesion de empresa no habilitada.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token interno real.
- No se uso token de invitacion real.
- No se imprimieron hashes, SAS, blob paths internos ni links tokenizados.
- La cookie usada para regresion fue sintetica e invalida.
- Los payloads usados contra endpoints protegidos fueron sinteticos y sin datos sensibles.
