# TASK-170 - Handoff Web Dev

## Resultado

Se aplico ajuste Web local para el hallazgo de TASK-169.

El submit de `Crear acceso` ya no envia cookies en `POST /api/company-invitations/accept`, porque ese endpoint acepta la invitacion con token y no requiere sesion previa. Esto evita que el navegador exija `Access-Control-Allow-Credentials: true` para esa llamada especifica.

Las llamadas que si pertenecen a la sesion de auth propia mantienen `credentials: "include"`:

- `POST /api/company-auth/login`
- `POST /api/company-auth/logout`
- `GET /api/me`

## Cambios realizados

- `app/src/customerApi.js`
  - Se removio `credentials: "include"` solo de `acceptCompanyInvitation`.
  - No se cambio payload.
  - No se guarda token, password ni cookie en storage.
  - No se muestra token ni URL completa.

## Pruebas ejecutadas

Locales:

- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- Revision de diff para confirmar que el cambio fue solo una linea en `acceptCompanyInvitation`.
- Revision de `app/src/customerApi.js` para confirmar que `credentials: "include"` sigue presente en `loginCompany`, `logoutCompany` y `getCurrentCompanyUser`.

Publicadas:

- No se ejecuto smoke publicado del cambio porque el ajuste queda pendiente de commit/deploy.
- No se uso token real de invitacion.
- No se uso password real.
- No se inspeccionaron ni pegaron cookies reales.

## Riesgos / pendientes

- QA debe revalidar `Crear acceso` con invitacion fresca despues del deploy.
- Si Infra habilita `Access-Control-Allow-Credentials: true` en Function App, este ajuste sigue siendo compatible porque `accept` no necesita cookie previa.
- Login, logout y `/api/me` todavia dependen de CORS con credentials para sesion; si falta `Access-Control-Allow-Credentials: true` en esos endpoints, el problema podria reaparecer durante login o refresh de sesion.
