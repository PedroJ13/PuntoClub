# TASK-260 - Handoff Web Dev

Equipo: Web Dev

Modo de ejecucion: Web Dev

## Resultado

Completado.

La Web publicada ya contiene la UI de activacion y consulta de membresias de cliente implementada en TASK-257.

## URL publicada

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

## Deploy

Se publico `app/` en Azure Static Web Apps con SWA CLI.

Notas:

- Se uso deployment token leido desde Azure en variable de entorno temporal.
- No se imprimio el token ni ningun secreto.
- No hubo commit nuevo en esta tarea.
- El deploy final exitoso fue:
  - `swa deploy --app-location puntoclub-web-task260 --output-location "" --env production`
  - ejecutado desde una copia temporal de `app/`.

## Evidencia de build / validacion local

- `node --check app/src/app.js`: OK.
- `node --check app/src/customerApi.js`: OK.

No hay build compilado adicional porque la app Web es estatica.

## Evidencia de marcadores publicados

Assets publicados revisados:

```text
GET /                   -> 200 length=49657  Last-Modified=Sat, 13 Jun 2026 21:58:58 GMT
GET /src/app.js          -> 200 length=157884 Last-Modified=Sat, 13 Jun 2026 21:58:58 GMT
GET /src/customerApi.js  -> 200 length=68326  Last-Modified=Sat, 13 Jun 2026 21:58:58 GMT
GET /styles.css          -> 200 length=26972  Last-Modified=Sat, 13 Jun 2026 21:58:58 GMT
```

Marcadores confirmados:

```text
membership-activation-title                    -> presente
membership-customer-memberships-title          -> presente
createCustomerMembership                       -> presente
listCustomerMemberships                        -> presente
listMembershipExpirationAlerts                 -> presente
CUSTOMER_ALREADY_HAS_ACTIVE_MEMBERSHIP         -> presente
```

Marcadores de seguridad/regresion:

```text
localStorage     -> no encontrado
sessionStorage   -> no encontrado
window.confirm   -> no encontrado
```

## Dependencia API

TASK-259 quedo completada antes de este deploy:

- `POST /api/customers/1/memberships` sin sesion responde `401`, no `404`.
- `GET /api/customers/1/memberships?status=all` sin sesion responde `401`, no `404`.
- `GET /api/memberships/expiration-alerts?withinDays=5&status=active` sin sesion responde `401`, no `404`.

## Riesgos o notas para QA

- No se ejecuto prueba positiva real de activacion porque no se usaron credenciales, cookies ni sesiones reales.
- QA debe validar con sesion real o evidencia PO redaccionada:
  - buscar/seleccionar cliente existente;
  - activar membresia con plan activo;
  - ver membresias del cliente;
  - confirmar rechazo de segunda membresia activa;
  - confirmar que registro de uso de beneficios sigue fuera de alcance.
