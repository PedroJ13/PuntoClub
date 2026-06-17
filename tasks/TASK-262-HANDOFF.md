# TASK-262 - Handoff Backend/API

Equipo: Backend/API

Modo de ejecucion: Backend/API

## Resultado

Completado.

Se implemento y publico la API para registrar y consultar usos de beneficios de membresia.

## Endpoints implementados

- `POST /api/customers/{customerId}/membership-benefit-usages`
- `GET /api/customers/{customerId}/membership-benefit-usages?from=YYYY-MM-DD&to=YYYY-MM-DD`

## Resumen tecnico

Cambios principales:

- Se agregaron validadores de payload y query para usos de beneficios.
- Se agrego mapeo de `MembershipBenefitUsages` a contrato API.
- Se agrego calculo de `usage_period_start_date` para:
  - `day`
  - `week`
  - `month`
  - `membership_term`
  - `none`
- Se persiste el uso con:
  - empresa
  - cliente
  - membresia activa
  - beneficio
  - fecha de uso
  - periodo de uso
  - cantidad
  - nota opcional
  - actor operativo
- Se consulta historial por cliente y rango de fechas acotado a 31 dias.
- Se audita best-effort con:
  - evento `membership.benefit.used`
  - entidad `membership_benefit_usage`

## Validaciones funcionales de API

El POST valida:

- cliente pertenece a la empresa de la sesion;
- cliente tiene membresia activa;
- si se envia `customerMembershipId`, debe corresponder a la membresia activa;
- beneficio existe para la empresa;
- beneficio pertenece al plan activo del cliente;
- beneficio esta activo;
- payload no puede enviar campos controlados por API.

Control de limites:

- Si el beneficio tiene `usageLimit`, la API suma cantidad usada en el mismo periodo y rechaza excedentes con `MEMBERSHIP_BENEFIT_USAGE_LIMIT_EXCEEDED`.
- Si el beneficio no tiene limite, incluyendo descuentos sin limite, se permite registrar cada uso sin bloqueo.

Errores controlados relevantes:

- `CUSTOMER_NOT_FOUND`
- `CUSTOMER_MEMBERSHIP_NOT_ACTIVE`
- `MEMBERSHIP_BENEFIT_NOT_FOUND`
- `MEMBERSHIP_BENEFIT_NOT_IN_ACTIVE_PLAN`
- `MEMBERSHIP_BENEFIT_INACTIVE`
- `MEMBERSHIP_BENEFIT_USAGE_LIMIT_EXCEEDED`

## Archivos modificados

- `api/src/functions/memberships.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/repository-formatters.test.js`
- `api/test/validators.test.js`

## Tests ejecutados

Validacion sintactica:

```text
node --check api/src/functions/memberships.js -> OK
node --check api/src/lib/repository.js -> OK
node --check api/src/lib/validators.js -> OK
```

Suite API:

```text
npm test
tests: 118
pass: 118
fail: 0
```

Nota:

- Dentro del sandbox el runner de Node fallo con `spawn EPERM`.
- Se ejecuto `npm test` fuera del sandbox con aprobacion porque es el patron conocido del proyecto.

## Deploy

Publicado por ZIP deploy directo a Azure Functions.

Ambiente:

- Function App: `func-puntoclub-prod-br-001`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`

No se imprimieron secretos ni app settings sensibles.

## Evidencia publicada sin sesion

Validacion de existencia/proteccion:

```text
GET  /api/me -> 401
POST /api/customers/1/membership-benefit-usages -> 401
GET  /api/customers/1/membership-benefit-usages?from=2026-06-01&to=2026-06-13 -> 401
```

Resultado:

- Los endpoints nuevos ya no responden `404`.
- Siguen protegidos sin sesion valida.

## Pendientes o riesgos

- No se ejecuto prueba positiva real porque no se usaron credenciales, cookies ni sesiones reales.
- Web Dev debe consumir estos endpoints en TASK-263.
- QA debe validar flujo positivo con sesion real o evidencia PO redaccionada.
