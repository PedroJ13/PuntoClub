# TASK-252 - Handoff Web Dev

Equipo: Web Dev

Modo de ejecucion: Web Dev

## Resultado

Completado.

La Web publicada ya contiene la seccion `Membresias`, los paneles de planes/beneficios y los metodos de `customerApi` implementados en TASK-248.

## Dependencia API

Confirmado antes de validar Web:

- TASK-250 aplico la migracion SQL de membresias.
- TASK-251 publico la API de membresias.
- Endpoints de membresias publicados responden `401` sin sesion, no `404`.

## Deploy

Se publico la carpeta `app/` en Azure Static Web Apps usando SWA CLI y deployment token leido desde Azure sin imprimirlo.

Ambiente:

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

Notas:

- No hubo commit nuevo en esta tarea.
- No se imprimieron tokens ni secretos.

## Marcadores publicados confirmados

Assets revisados:

- `/`
- `/login`
- `/company-registration`
- `/admin-companies`
- `/src/app.js`
- `/src/customerApi.js`
- `/styles.css`

Status:

- Todas las rutas/assets revisados respondieron `200`.
- `Last-Modified` observado: `Sat, 13 Jun 2026 20:21:03 GMT`.

Marcadores confirmados:

- Navegacion `Membresias`: presente.
- `data-section-target="memberships"`: presente.
- `memberships-section`: presente.
- `membership-plans-list`: presente.
- `membership-benefits-list`: presente.
- `listMembershipPlans`: presente.
- `listMembershipBenefits`: presente.
- llamada a `/api/membership-plans`: presente.
- `loyaltyMembershipsEnabled`: presente.
- `data-section-target="adminCompanies" hidden`: presente.

Marcadores de seguridad/regresion:

- `localStorage`: no encontrado en `app.js`/`customerApi.js` publicados.
- `sessionStorage`: no encontrado en `app.js`/`customerApi.js` publicados.
- `window.confirm`: no encontrado en `app.js` publicado.

## Rutas verificadas con navegador

Sin credenciales ni sesion real:

- `/`
  - Renderiza shell `Punto Club`.
  - Boton `Iniciar sesion` visible.
  - Markup de membresias presente.
  - `Admin empresas` sigue oculto en menu normal.

- `/login`
  - Renderiza pantalla de login.
  - Sin errores visibles.

## Pruebas locales previas relevantes

- `node --check app/src/app.js`: OK.
- `node --check app/src/customerApi.js`: OK.
- Browser mock local de TASK-248:
  - menu `Membresias` visible con flag activo;
  - crear plan;
  - crear beneficio;
  - responsive movil sin overflow horizontal.

## Riesgos o pendientes para QA

- Validar flujo positivo con sesion real o evidencia PO redaccionada:
  - `Membresias` visible para `companyId=6` / `DEMO 1`;
  - crear/editar/activar/inactivar plan;
  - crear/editar/activar/inactivar beneficio.
- Validar que una empresa sin `loyaltyMembershipsEnabled=1` no vea `Membresias`.
- Validar permisos por rol: `staff` lectura permitida y escritura bloqueada, si existe usuario disponible para esa prueba.
