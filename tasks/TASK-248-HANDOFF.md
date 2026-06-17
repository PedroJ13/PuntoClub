# TASK-248 - Handoff Web Dev

Equipo: Web Dev

Modo de ejecucion: Web Dev

## Resultado

Completado.

Se agrego la seccion `Membresias` para configuracion de planes y beneficios, visible solo cuando la empresa tiene membresias habilitadas.

## Archivos modificados

- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`

## Pantallas/secciones agregadas

- Navegacion `Membresias`, oculta por defecto y habilitada con `loyaltyMembershipsEnabled`.
- Panel de planes:
  - listado;
  - crear plan;
  - editar plan;
  - activar/inactivar plan.
- Panel de beneficios por plan:
  - listado del plan seleccionado;
  - crear beneficio;
  - editar beneficio;
  - activar/inactivar beneficio.

No se implemento activacion de membresia a cliente ni registro de usos.

## Integracion API

Se agregaron metodos en `customerApi` para:

- `listMembershipPlans`
- `createMembershipPlan`
- `updateMembershipPlan`
- `activateMembershipPlan`
- `deactivateMembershipPlan`
- `listMembershipBenefits`
- `createMembershipBenefit`
- `updateMembershipBenefit`

Tambien se amplio el mock local con planes/beneficios para validar UX sin depender de Azure.

## Reglas respetadas

- No se uso `localStorage` ni `sessionStorage`.
- `Admin empresas` se mantiene fuera del menu normal.
- La seccion se oculta si `loyaltyMembershipsEnabled` no esta activo.
- No se cambiaron flujos de puntos, reportes, registro de empresa, admin, invitacion o login.

## Pruebas ejecutadas

- `node --check app/src/app.js`: OK.
- `node --check app/src/customerApi.js`: OK.
- `node --check api/src/functions/memberships.js`: OK.
- Validacion Browser con copia temporal mock:
  - login mock;
  - menu `Membresias` visible con flag activo;
  - listado inicial de planes y beneficios renderiza;
  - creacion de plan mock: OK;
  - creacion de beneficio mock: OK;
  - viewport movil 390px: layout a una columna, sin overflow horizontal.
- `npm test` de API ya ejecutado en TASK-247: OK, 107 tests pasan.

## Riesgos o pendientes para QA

- Validar contra Azure despues de aplicar la migracion SQL de TASK-246.
- Validar empresa con `loyaltyMembershipsEnabled = 0`: el menu no debe aparecer.
- Validar permisos con usuario `staff`: lectura permitida, escritura bloqueada por API.
- Validar mensajes de error reales de API para campos de plan/beneficio.
