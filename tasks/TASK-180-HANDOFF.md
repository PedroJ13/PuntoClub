# TASK-180 - Handoff Web Dev

## Resultado

Web operativa alineada localmente para trabajar con sesion de empresa autenticada.

La UI ahora:

- Usa la empresa resuelta por `/api/me` como empresa activa cuando hay sesion.
- Mantiene fallback al `companyId` configurado solo cuando no hay sesion, para compatibilidad con el piloto si Backend/API conserva ese fallback.
- Envia cookie de sesion con las llamadas operativas privadas.
- Muestra `Empresa activa: <empresa> - <correo>` cuando hay sesion.
- Muestra mensaje de login requerido cuando una operacion privada responde `UNAUTHORIZED` o `FORBIDDEN`.

## Rutas / pantallas revisadas

- `/`: operaciones, Mi empresa, Reportes y Auditoria.
- `/login`: login de empresa.
- `/company-invitations/accept?token=<redacted-fake-token>`: invitacion publica.

La pantalla publica de invitacion no fue conectada a sesion y conserva el comportamiento publico.

## Llamadas API ajustadas

Con `credentials: "include"`:

- `POST /api/company-auth/login`
- `POST /api/company-auth/logout`
- `GET /api/me`
- `GET /api/companies/{activeCompanyId}/settings`
- `PATCH /api/companies/{activeCompanyId}/settings`
- `GET /api/companies/{activeCompanyId}/customers`
- `POST /api/companies/{activeCompanyId}/customers`
- `GET /api/companies/{activeCompanyId}/customers/{customerId}/balance`
- `GET /api/companies/{activeCompanyId}/customers/{customerId}/activity`
- `POST /api/companies/{activeCompanyId}/purchases`
- `POST /api/companies/{activeCompanyId}/redemptions`
- `GET /api/companies/{activeCompanyId}/reports/activity`
- `GET /api/companies/{activeCompanyId}/audit/events`

Sin `credentials: "include"`:

- `GET /api/company-invitations/validate`
- `POST /api/company-invitations/accept`
- `POST /api/company-registration-requests`

## Regla de companyId

- El `activeCompanyId` se actualiza desde `identity.company.id` devuelto por `/api/me`.
- El `companyId` configurado en frontend queda como fallback de compatibilidad, no como autoridad de seguridad.
- La autoridad final sigue siendo Backend/API, que debe validar la sesion y la empresa efectiva.

## Comportamiento esperado

Con sesion iniciada:

- La barra superior muestra empresa activa y correo.
- Las llamadas operativas viajan con cookie de sesion.
- Las rutas operativas usan el `companyId` de la empresa devuelta por `/api/me`.

Sin sesion:

- La barra superior muestra `Sesion no iniciada`.
- Si Backend/API mantiene fallback piloto, la operacion puede seguir funcionando con `companyId` configurado.
- Si Backend/API exige sesion, la UI muestra `Inicie sesion para operar con la empresa activa.` en las superficies operativas.

## Pruebas ejecutadas

- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- Revision de `fetch` en `app/src/customerApi.js` para confirmar la regla de credentials.
- Smoke local con servidor estatico temporal y Chrome headless:
  - `/` desktop `1280px`: app visible, sin overflow.
  - `/login` mobile `390px`: login visible, app/invitacion ocultas, sin overflow.
  - `/company-invitations/accept?token=<redacted-fake-token>` mobile `390px`: invitacion visible, token falso no visible, sin overflow.

## No ejecutado

- No se valido operacion publicada con sesion real.
- No se uso usuario real.
- No se uso password real.
- No se inspeccionaron ni pegaron cookies reales.
- No se uso token real de invitacion.

## Riesgos / pendientes

- Validacion publicada final depende de TASK-179 Backend/API.
- Si Backend/API cambia rutas para eliminar `{companyId}` del path, Web debera ajustar `buildCompanyUrl`.
- QA debe validar con sesion real que clientes, compras, redenciones, settings, reportes y auditoria operan sobre la empresa autenticada esperada.
