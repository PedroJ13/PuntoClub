# TASK-249 - Handoff QA

Equipo: QA

Tarea validada: TASK-249 - Validar configuracion de membresias publicada

Ambiente: publicado

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-13

## Resultado

No aprobado.

La configuracion de membresias no esta disponible en el ambiente publicado:

- La Web publicada no contiene la navegacion ni paneles de `Membresias`.
- El bundle publicado no contiene los metodos `listMembershipPlans` / `listMembershipBenefits` ni llamadas a `/api/membership-plans`.
- La API publicada responde `404` para endpoints de membresias.

Esto impide validar listar/crear/editar planes y beneficios, validaciones de payload y visibilidad condicional real del menu. Con P1 abierto no se aprueba.

No se modifico codigo.

## Evidencia revisada

Se leyeron:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-246-HANDOFF.md`
- `tasks/TASK-247-HANDOFF.md`
- `tasks/TASK-248-HANDOFF.md`

Resumen de dependencias:

- TASK-246 creo `database/migrations/20260613_memberships_mvp.sql`, pero reporto que no fue aplicada en Azure SQL.
- TASK-247 implemento endpoints de configuracion de planes/beneficios y reporto `npm test` OK con 107 tests, pero dejo pendiente probar contra Azure SQL porque la migracion no estaba aplicada.
- TASK-248 implemento UI de `Membresias` local/mock y dejo pendiente validar contra Azure despues de aplicar la migracion.

## Checks publicados ejecutados

### Web / bundle

Rutas y assets publicados:

- `/`: `200`, `htmlLength=36181`.
- `/src/app.js`: `200`, `appLength=114359`.
- `/src/customerApi.js`: `200`, `customerApiLength=48433`.
- `/styles.css`: `200`, `cssLength=24460`.
- `Last-Modified`: `Fri, 12 Jun 2026 23:06:54 GMT`.
- `ETag`: `"04202342"`.

Marcadores de membresias:

- Navegacion `Membresias`: no encontrada.
- `data-section-target="memberships"`: no encontrado.
- `memberships-section`: no encontrado.
- `membership-plans-list`: no encontrado.
- `listMembershipPlans`: no encontrado.
- `listMembershipBenefits`: no encontrado.
- `/api/membership-plans`: no encontrado.
- `loyaltyMembershipsEnabled`: no encontrado en el bundle publicado.
- `isMembershipsEnabled`: no encontrado.

Marcadores de regresion/menu:

- `data-section-target="adminCompanies" hidden`: presente.
- `Operaciones`: presente.
- `Mi empresa`: presente.
- `Reportes`: presente.
- `localStorage`: no encontrado.
- `sessionStorage`: no encontrado.
- `window.confirm`: no encontrado.

Resultado:

- P1: Web publicada no refleja TASK-248.
- Regresion basica de menu normal: OK; `Admin empresas` sigue fuera del menu normal y `Operaciones`/`Mi empresa`/`Reportes` siguen presentes.

### API membresias sin sesion

Endpoints publicados:

- `GET /api/membership-plans?status=all` sin sesion:
  - `404`.

- `POST /api/membership-plans` sin sesion:
  - `404`.

- `GET /api/membership-plans/1/benefits?status=all` sin sesion:
  - `404`.

- `POST /api/membership-plans/1/benefits` sin sesion:
  - `404`.

- `PATCH /api/membership-benefits/1` sin sesion:
  - `404`.

Control de sesion existente:

- `GET /api/me` sin sesion:
  - `401`.

Resultado:

- P1: API publicada no refleja TASK-247; no se puede confirmar proteccion esperada `401/403` de endpoints de membresias porque las rutas aun no existen publicadas.
- Regresion de sesion base: OK; `/me` sigue protegido sin sesion.

## No ejecutado

No se ejecuto:

- login real;
- listar/crear/editar plan con sesion;
- listar/crear/editar beneficios con sesion;
- validaciones server-side de payload autenticado;
- validacion visual de `Membresias` visible con `loyaltyMembershipsEnabled = true`;
- validacion de empresa con `loyaltyMembershipsEnabled = false`.

Motivos:

- QA no recibio credenciales reales/evidencia PO segura.
- Web y API publicadas no contienen el bloque de membresias.
- TASK-246 reporta migracion SQL no aplicada en Azure; esto queda como prerequisito probable antes de una validacion positiva real.

## P0/P1

- P0: ninguno.
- P1: Web publicada no contiene UI ni integracion de `Membresias`.
- P1: API publicada responde `404` para endpoints de planes/beneficios de membresias.
- P1: no se puede validar configuracion publicada de membresias hasta publicar API/Web y confirmar migracion SQL aplicada en Azure.

## P2/P3

- P2: falta prueba positiva con sesion real o evidencia PO redaccionada:
  - `Membresias` visible solo si la empresa tiene `loyaltyMembershipsEnabled = true`;
  - listar/crear/editar plan;
  - listar/crear/editar beneficio;
  - validaciones de payload;
  - usuario `staff` con lectura permitida y escritura bloqueada, si existe usuario/rol para probarlo.
- P3: ninguno nuevo.

## Regresion ejecutada

- Web publicada carga `200`.
- Menu normal conserva:
  - `Operaciones`;
  - `Mi empresa`;
  - `Reportes`.
- `Admin empresas` sigue oculto en el menu normal.
- No se observaron usos publicados de `localStorage`, `sessionStorage` ni `window.confirm`.
- `/api/me` sin sesion sigue respondiendo `401`.

## Riesgos o pendientes

- Aplicar la migracion `database/migrations/20260613_memberships_mvp.sql` en Azure SQL antes de probar endpoints reales.
- Publicar Backend/API con `api/src/functions/memberships.js`.
- Publicar Web con la seccion `Membresias` y los metodos de `customerApi`.
- Habilitar `loyalty_memberships_enabled` en una empresa de prueba por ruta segura/controlada para validar visibilidad condicional.
- Aportar credenciales/evidencia PO redaccionada para la prueba positiva, sin exponer passwords, cookies ni tokens.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token interno real.
- No se uso token de invitacion real.
- No se imprimieron hashes, SAS, blob paths internos ni links tokenizados.
- Los payloads usados contra endpoints de membresias fueron sinteticos y sin datos sensibles.
