# TASK-268 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Estado: Completed
Fecha: 2026-06-14

## Resultado

Se consolido el endpoint de alertas internas de vencimiento de membresias para cubrir membresias proximas a vencer y vencidas.

## Endpoint final confirmado

`GET /api/memberships/expiration-alerts?withinDays=5&status=active|expired|cancelled`

- `status=active`: devuelve membresias activas cuyo vencimiento esta entre hoy y `withinDays`.
- `status=expired`: devuelve membresias vencidas operativamente, incluyendo filas con `status=expired` y filas aun `active` cuyo `endDate` ya paso.
- `status=cancelled`: conserva consulta de canceladas si se necesita revisar ese estado.
- `withinDays`: entero de `0` a `365`; por defecto `5`.
- La consulta usa la empresa activa de la sesion server-side.

## Campos devueltos

Cada item incluye:

- `id`
- `companyId`
- `customerId`
- `customerName`
- `customerPhone`
- `customerEmail`
- `customerMembershipId`
- `planId`
- `membershipPlanId`
- `planName`
- `startDate`
- `endDate`
- `status`
- `daysUntilExpiration`
- `state`
- `message`

## Evidencia de pruebas

- `node --check api/src/lib/repository.js`: OK
- `node --check api/src/lib/validators.js`: OK
- `node --check api/src/functions/memberships.js`: OK
- `npm test`: OK, 118 passing, 0 failing
- Se agregaron/actualizaron pruebas de:
  - `validateExpirationAlertsQuery` con `status=expired`.
  - `mapMembershipExpirationAlert` con campos completos para UI.

## Evidencia publicada

- API publicado en Azure Functions: `func-puntoclub-prod-br-001`
- URL base: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Validacion de proteccion:
  - Sin sesion: `GET /api/memberships/expiration-alerts?withinDays=5&status=active` -> `401 UNAUTHORIZED`
  - Cookie sintetica invalida, `status=active` -> `401 UNAUTHORIZED`
  - Cookie sintetica invalida, `status=expired` -> `401 UNAUTHORIZED`

## Notas para QA

- No se ejecuto consulta positiva con datos reales porque no se usaron credenciales ni cookie real.
- La validacion positiva debe hacerse con sesion real de empresa activa y membresias con `endDate` vencido o dentro del rango `withinDays`.
