# TASK-179 - Handoff Backend API

## Resultado

Completado en codigo local.

Los endpoints operativos ahora usan `companyId` derivado de la sesion de empresa cuando existe una sesion valida. Si no hay cookie de sesion, se conserva el fallback historico a `PILOT_COMPANY_ID` para no romper la operacion piloto sin login.

## Regla final de contexto

Helper central:

- `api/src/lib/http.js`
  - `getCompanyId(request)` ahora es async.
  - Si existe cookie de sesion:
    - lee el token desde cookie `puntoclub_company_session` o nombre configurado;
    - hashea el token;
    - consulta `repository.getAuthIdentityBySessionTokenHash()`;
    - devuelve `identity.company.id`;
    - ignora el `{companyId}` de la URL como autoridad.
  - Si no existe cookie de sesion:
    - mantiene compatibilidad piloto validando `{companyId}` contra `PILOT_COMPANY_ID`;
    - si no coincide, devuelve `404 COMPANY_NOT_FOUND`.
  - Si existe cookie pero es invalida/expirada/revocada:
    - no hace fallback silencioso;
    - devuelve `401 UNAUTHORIZED`.

Esta regla evita aceptar `companyId` enviado por frontend como fuente confiable cuando hay usuario autenticado.

## Endpoints revisados

### Clientes

- `GET /api/companies/{companyId}/customers`
- `POST /api/companies/{companyId}/customers`
- `GET /api/companies/{companyId}/customers/{customerId}/balance`
- `GET /api/companies/{companyId}/customers/{customerId}/activity`

Regla:

- Sesion valida: opera con `companyId` de sesion.
- Sin sesion: fallback a empresa piloto si `{companyId}` coincide con `PILOT_COMPANY_ID`.

### Compras

- `POST /api/companies/{companyId}/purchases`

Regla:

- Sesion valida: compra, validacion de cliente, calculo de puntos y auditoria usan `companyId` de sesion.
- Sin sesion: fallback piloto.

### Redenciones

- `POST /api/companies/{companyId}/redemptions`

Regla:

- Sesion valida: redencion, balance y auditoria usan `companyId` de sesion.
- Sin sesion: fallback piloto.

### Settings / Empresa

- `GET /api/companies/{companyId}/settings`
- `PATCH /api/companies/{companyId}/settings`

Regla:

- Sesion valida: lee/actualiza settings de la empresa autenticada.
- Sin sesion: fallback piloto.
- La auditoria de `company.settings.updated` queda asociada al `companyId` efectivo.

### Reportes

- `GET /api/companies/{companyId}/reports/activity`

Regla:

- Sesion valida: reporte de actividad usa empresa autenticada.
- Sin sesion: fallback piloto.

### Auditoria

- `GET /api/companies/{companyId}/audit/events`

Regla:

- Sesion valida: lista eventos de auditoria de la empresa autenticada.
- Sin sesion: fallback piloto.

## Fallback piloto

Se mantiene fallback sin sesion para compatibilidad del MVP publicado actual, porque la operacion historica funcionaba con empresa piloto fija y rutas `companies/{companyId}`.

Condiciones:

- Solo aplica cuando no hay cookie de sesion.
- Exige que `{companyId}` coincida con `PILOT_COMPANY_ID`.
- No aplica si hay cookie invalida, expirada o revocada.

Esto permite transicion gradual a multiempresa sin cortar el piloto, pero deja claro que el modo autenticado ya no confia en el `companyId` del frontend.

## Cambios realizados

- `api/src/lib/http.js`
  - `getCompanyId()` ahora resuelve contexto por sesion y fallback piloto.
- `api/src/functions/customers.js`
- `api/src/functions/purchases.js`
- `api/src/functions/redemptions.js`
- `api/src/functions/companies.js`
- `api/src/functions/reports.js`
- `api/src/functions/audit.js`
  - Se actualizo el uso de `getCompanyId()` a `await`.
- `api/test/company-context.test.js`
  - Nuevo test de contexto de empresa.
- `api/package.json`
  - Incluye `test/company-context.test.js` en `npm test`.

No se cambio schema SQL.

## Pruebas ejecutadas

- `npm test` desde `api/`.

Resultado:

- Primer intento en sandbox fallo con `spawn EPERM`, antes de ejecutar pruebas.
- Reejecucion elevada paso correctamente.
- `85` tests ejecutados.
- `85` pass.
- `0` fail.

Cobertura nueva:

- Sesion valida gana sobre `{companyId}` de la ruta.
- Sin sesion se conserva fallback a `PILOT_COMPANY_ID`.
- Cookie invalida no cae a fallback piloto y responde `401`.

## Riesgos o pendientes

- Web puede seguir enviando rutas con la empresa piloto; con sesion valida Backend operara sobre la empresa autenticada aunque el path diga otra cosa.
- Contratos publicos aun conservan `companies/{companyId}` por compatibilidad; una tarea futura puede simplificar rutas privadas a `/api/company/...` o `/api/me/...` si Product/Architect lo aprueba.
- QA debe validar que, con sesion real multiempresa, clientes/compras/redenciones/settings/reportes/auditoria quedan aislados por empresa autenticada.

## Seguridad

- No se imprimieron cookies ni tokens de sesion.
- No se imprimieron passwords, hashes ni connection strings.
- No se uso `INTERNAL_ADMIN_TOKEN`.
