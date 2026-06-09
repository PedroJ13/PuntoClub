# TASK-184 - Handoff Web Dev

## Resultado

Deploy Web confirmado.

Static Web Apps publicada ya contiene el ajuste de TASK-180: las operaciones privadas usan `credentials: "include"` y las rutas publicas revisadas no lo usan.

Ambiente validado:

- Web publicada: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

## Commit / run publicado

Commit validado en GitHub:

- `37855f84ad722a16ce795707ec6ff3f3adddccbf`
- Mensaje: `Use authenticated company context for operations`
- URL: `https://github.com/PedroJ13/PuntoClub/commit/37855f84ad722a16ce795707ec6ff3f3adddccbf`

Run de GitHub Actions:

- No se obtuvo ID de run desde esta sesion.
- El conector GitHub no retorno workflow runs asociados al commit.
- `gh` no esta instalado en el entorno.
- La publicacion se confirmo por contenido servido en Static Web Apps.

## Evidencia redaccionada de bundle publicado

`/src/customerApi.js` publicado:

- `bundleLength`: `37426`
- contiene `setActiveCompanyId(companyId)`: `true`
- contiene `buildCompanyUrl`: `true`

Operaciones privadas con `credentials: "include"`:

- `getCompanySettings`: `true`
- `updateCompanySettings`: `true`
- `searchCustomers`: `true`
- `createCustomer`: `true`
- `getCustomerBalance`: `true`
- `getCustomerActivity`: `true`
- `getActivityReport`: `true`
- `getAuditEvents`: `true`
- `createPurchase`: `true`
- `createRedemption`: `true`

Rutas publicas sin `credentials: "include"`:

- `acceptCompanyInvitation`: `false`
- `validateCompanyInvitation`: `false`
- `createCompanyRegistrationRequest`: `false`

`/src/app.js` publicado:

- `appLength`: `73450`
- contiene `Empresa activa:`: `true`
- contiene `Inicie sesion para operar con la empresa activa.`: `true`

## Smoke visual publicado

Sin credenciales reales, usando solo token falso/redactado:

- `/`
  - titulo: `Punto Club`
  - estado auth: `Sesion no iniciada`
  - app visible: `true`
  - login visible: `false`
  - invitacion visible: `false`
  - overflow horizontal: `false`

- `/login`
  - titulo: `Punto Club`
  - estado auth: `Sesion no iniciada`
  - app visible: `false`
  - login visible: `true`
  - invitacion visible: `false`
  - overflow horizontal: `false`

- `/company-invitations/accept?token=<redacted-fake-token>`
  - path: `/company-invitations/accept`
  - titulo: `Punto Club`
  - app visible: `false`
  - login visible: `false`
  - invitacion visible: `true`
  - invitacion no disponible visible: `true`
  - token falso visible en pantalla: `false`
  - overflow horizontal: `false`

## Seguridad

- No se usaron credenciales reales.
- No se uso password real.
- No se inspeccionaron ni pegaron cookies reales.
- No se uso token real de invitacion.
- No se pego URL completa con token real.

## Pendientes / bloqueos

- QA debe reintentar la validacion autenticada despues de confirmar tambien TASK-183/TASK-185.
- La validacion E2E de cliente, compra, redencion, reportes y auditoria requiere sesion real o evidencia PO redaccionada.
