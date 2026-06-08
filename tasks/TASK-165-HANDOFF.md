# TASK-165 - Handoff Web Dev

## Resultado

Confirmado en Static Web Apps publicada: la integracion Web de auth propia de TASK-161 esta presente en el despliegue.

URL base validada:

- `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

## Evidencia redaccionada

Smoke HTTP publicado:

- `/` -> `200 text/html`
- `/src/customerApi.js` -> `200 text/javascript`
- `/src/app.js` -> `200 text/javascript`
- `/login` -> `200 text/html`
- `/company-invitations/accept?token=<redacted-fake-token>` -> `200 text/html`

Validacion de bundles publicados:

- `customerApi.js` contiene llamada a `/api/company-auth/login`.
- `customerApi.js` contiene llamada a `/api/company-auth/logout`.
- `customerApi.js` contiene llamada a `/api/me`.
- `customerApi.js` contiene llamada a `/api/company-invitations/accept`.
- `customerApi.js` contiene `credentials: "include"` para llamadas de sesion.
- `app.js` contiene `#login-form`.
- `app.js` contiene `#create-access-form`.
- `app.js` contiene `submitCreateAccess`.
- `app.js` contiene `submitCompanyLogin`.
- `app.js` contiene `logoutCompany`.

Smoke visual publicado con browser headless:

- `/login` renderiza pantalla real de login.
- El formulario de login esta presente.
- El titulo visible de login es `Iniciar sesion`.
- No se detecto overflow horizontal en `/login`.
- `/company-invitations/accept?token=<redacted-fake-token>` renderiza la pantalla publica de invitacion.
- Con token falso/redactado, la pantalla muestra estado controlado `Invitacion no disponible`.
- La app privada queda oculta en la ruta publica de invitacion.
- El token falso/redactado no queda visible en pantalla.
- No se detecto overflow horizontal en la ruta de invitacion.

## No ejecutado por alcance

- No se uso token real de invitacion.
- No se uso password real.
- No se inspeccionaron ni pegaron cookies reales.
- No se valido el flujo completo con invitacion valida porque la tarea pidio smoke publicado sin exponer credenciales ni secretos.

## Riesgos / pendientes

- Falta validacion QA end-to-end con token real y password temporal controlados.
- La persistencia de sesion por cookie debe validarse con flujo real, especialmente `credentials: "include"` contra API publicada.
- Si API, migracion o datos de invitacion cambian despues de esta verificacion, conviene repetir el smoke publicado.
