# TASK-242 - Handoff QA

Equipo: QA

Tarea validada: TASK-242 - Revalidar Mi empresa autenticada despues de correccion publicada

Ambiente: publicado

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-12

## Resultado

Aprobado con observacion.

La publicacion ya contiene los marcadores que faltaban en TASK-240:

- `Mi empresa` enfoca la configuracion de empresa (`companyNameInput`) y ya no apunta al formulario publico de registro.
- `Admin empresas` sigue oculto del menu normal.
- `/company-registration` y `/admin-companies` siguen aisladas por ruta directa.
- La regla CSS para ocultar el panel publico de registro fuera de `public-registration-mode` esta publicada.
- Los negativos seguros sin sesion/token siguen protegidos.

No se ejecuto login real ni navegacion autenticada real porque QA no recibio credenciales reales ni evidencia PO nueva para esta tarea. La aprobacion cubre los checks publicados y los negativos seguros solicitados; queda como P2 diferido validar visualmente con una sesion real cuando haya canal seguro/evidencia PO.

No se modifico codigo.

## Evidencia revisada

Se leyeron:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-240-HANDOFF.md`
- `tasks/TASK-241-HANDOFF.md`

TASK-240 habia bloqueado por:

- `company: elements.companyNameInput` ausente.
- `company: elements.registrationCompanyNameInput` presente para la seccion `Mi empresa`.
- regla CSS de ocultamiento del panel publico ausente.
- copy `Datos de empresa actualizados.` ausente.
- fallback `Sin logo cargado` ausente.

TASK-241 reporto publicacion de esos marcadores en commit `713d7f5`.

## Checks publicados ejecutados

### Web / rutas

- `/`: `200`, `htmlLength=36181`.
- `/company-registration`: `200`.
- `/admin-companies`: `200`.
- `/src/app.js`: `200`, `appLength=114359`.
- `/styles.css`: `200`, `cssLength=24460`.
- `Last-Modified`: `Fri, 12 Jun 2026 23:06:54 GMT`.
- `ETag`: `"04202342"`.

Resultado:

- `/company-registration` sigue disponible solo por ruta directa.
- `/admin-companies` sigue disponible solo por ruta directa.
- La publicacion coincide con la evidencia de TASK-241.

### Menu normal

Marcadores publicados:

- `data-section-target="adminCompanies" hidden`: presente.
- `Operaciones`: presente.
- `Mi empresa`: presente.
- `Reportes`: presente.

Resultado:

- Aprobado. El menu normal no expone `Admin empresas`.

### `Mi empresa` y aislamiento de registro publico

Marcadores publicados:

- `company: elements.companyNameInput`: presente.
- `company: elements.registrationCompanyNameInput`: no encontrado.
- `Datos de empresa actualizados.`: presente.
- `Sin logo cargado`: presente.
- `body:not(.public-registration-mode) .company-section .company-registration-panel`: presente.
- `showPublicCompanyRegistrationPage`, `public-registration-mode`, `isCompanyRegistrationRoute`: presentes.
- `showAdminCompaniesPage`, `admin-companies-page-mode`, `isAdminCompaniesRoute`: presentes.

Resultado:

- Aprobado. El bundle publicado ya no conserva el foco de `Mi empresa` hacia el formulario publico de `Registrar empresa`.
- Aprobado. El CSS publicado contiene la regla esperada para ocultar el panel publico fuera de `/company-registration`.

### Seguridad estatica

Marcadores no encontrados en HTML/JS publicado:

- `localStorage`
- `sessionStorage`
- `window.confirm`
- `tokenHash`
- `invitationLink`

Resultado:

- Aprobado. No se observaron patrones inseguros obvios ni exposicion de tokens/hashes/links de invitacion en el bundle.

### Negativos seguros API

- `GET /api/me` sin sesion:
  - `401`.

- `GET /api/company-registration-requests?status=pending&limit=25` sin token:
  - `403`.

- `GET /api/company-registration-requests?status=pending&limit=25` con token sintetico invalido:
  - `403`.

- `POST /api/company-auth/login` con credenciales sinteticas invalidas:
  - `401`.

Resultado:

- Aprobado. Las rutas protegidas siguen cerradas sin sesion/token valido.

## No ejecutado

No se ejecuto flujo autenticado real:

- login empresa;
- navegacion visual a `Mi empresa`;
- confirmacion visual de que `Mi empresa` muestra datos/logo/configuracion de empresa activa;
- navegacion real por `Operaciones` y `Reportes` bajo sesion.

Motivo: QA no recibio credenciales reales, cookie/sesion segura ni evidencia PO nueva para esta tarea. No se deben inventar credenciales ni exponer secretos.

## P0/P1

- P0: ninguno.
- P1: ninguno.

## P2/P3

- P2: queda pendiente validacion visual autenticada con sesion real o evidencia PO redaccionada:
  - `Mi empresa` muestra configuracion de empresa activa;
  - no muestra `Registrar empresa`;
  - `Operaciones` y `Reportes` siguen navegables.
- P3: ninguno nuevo.

## Riesgos o pendientes

- El cierre funcional por marcadores publicados es positivo, pero la experiencia visual autenticada real no fue recorrida por QA en esta tarea.
- Mantener pendiente una prueba PO/QA con sesion real cuando haya credenciales/evidencia segura.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token interno real.
- No se uso token de invitacion real.
- No se imprimieron hashes, SAS, blob paths internos ni links tokenizados.
- Los valores usados para negativos fueron sinteticos e invalidos.
