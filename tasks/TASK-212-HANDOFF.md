# TASK-212 - Handoff QA

Equipo: QA

Tarea validada: TASK-212 - Revalidar login exitoso despues del deploy Web

Ambiente: publicado

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-11

## Resultado

No aprobado / bloqueado para cierre positivo.

QA confirma que el fix Web de TASK-209 ya esta publicado: el bundle contiene `showMainApp`, el login llama a `showMainApp({ replaceLoginRoute: true, focus: true, refreshCompany: true })`, la hidratacion de sesion activa en `/login` tambien llama a `showMainApp`, y logout vuelve a `showLoginPage`.

Sin embargo, QA no recibio credenciales reales por canal seguro ni un archivo de evidencia PO redaccionada para TASK-212 que confirme el flujo positivo actual:

- login exitoso desde `/login` lleva a `Operaciones` / panel principal;
- refresh con sesion activa conserva acceso al panel;
- logout vuelve a login.

Por seguridad no se pidieron ni registraron passwords, cookies, tokens, links de invitacion ni secretos.

## Checks ejecutados

### Dependencia revisada

Se reviso `tasks/TASK-211-HANDOFF.md`.

Resultado:

- TASK-211 confirma deploy Web con commit `9003f7e Fix post-login transition`.
- TASK-211 confirma que `/src/app.js` publicado contiene `showMainApp`.
- TASK-211 no ejecuto login positivo real, refresh ni logout con sesion real.

### Bundle Web publicado

Recursos revisados:

- `/`
- `/login`
- `/company-invitations/accept?token=<synthetic-redacted>`
- `/src/app.js`
- `/src/customerApi.js`

Resultados:

- `/`: `200`.
- `/login`: `200`.
- pantalla de invitacion: `200`, renderiza Punto Club/invitacion.
- `appLength`: `102275`.
- `customerApiLength`: `47409`.
- `showMainApp`: encontrado.
- login exitoso llama a `showMainApp({ replaceLoginRoute: true, focus: true, refreshCompany: true })`.
- login limpia el campo de password antes de mostrar panel.
- `refreshAuthIdentity` llama a `showMainApp({ replaceLoginRoute: true, refreshCompany: true })` cuando esta en `/login`.
- `showMainApp` oculta login/invitacion, muestra `appBody`, activa `operations` y reemplaza `/login` por `/`.
- logout ejecuta `showLoginPage({ replaceRoute: true })`.
- `loginCompany`, `getCurrentCompanyUser` y `logoutCompany` mantienen `credentials: "include"`.
- No se encontro uso de `localStorage`.
- No se encontro uso de `sessionStorage`.

Resultado QA: aprobado para evidencia de bundle publicado.

### API y regresiones seguras sin sesion real

- `GET /api/me` sin sesion:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- `POST /api/company-registration-requests` con payload invalido:
  - Observado: `400 VALIDATION_ERROR`.
  - Resultado: aprobado.

- `GET /api/company-invitations/validate?token=<synthetic-redacted>`:
  - Observado: `200`, `valid=false`, `reason=invalid`.
  - Resultado: aprobado.

- `POST /api/company-auth/login` con email/password sinteticos invalidos:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado.

- `GET /api/my-company/logo` sin sesion:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado como endpoint privado de empresa.

- `GET /api/my-company/logo` con cookie sintetica invalida:
  - Observado: `401 UNAUTHORIZED`.
  - Resultado: aprobado como endpoint privado de empresa.

## No ejecutado

No se ejecuto login positivo real ni refresh/logout con sesion real porque QA no recibio:

- credenciales validas por canal seguro; o
- evidencia PO redaccionada especifica de TASK-212.

## Hallazgos

### P1 - Falta evidencia positiva segura del flujo publicado

El fix esta publicado y el bundle muestra la transicion esperada, pero el objetivo de TASK-212 pide revalidar en publicado que un login exitoso o una sesion activa llevan al panel operativo y no dejan al usuario atrapado en `/login`.

Sin credenciales seguras ni evidencia PO redaccionada actual, QA no puede cerrar ese happy path.

## P0/P1

- P0: ninguno.
- P1: falta evidencia positiva segura para aprobar login exitoso, refresh con sesion activa y logout en publicado.

## P2/P3

- P2: ninguno nuevo.
- P3: ninguno nuevo.

## Evidencia redaccionada

Bundle publicado:

```text
elements.loginPasswordInput.value = "";
await showMainApp({ replaceLoginRoute: true, focus: true, refreshCompany: true });
```

```text
if (isLoginPage) {
  await showMainApp({ replaceLoginRoute: true, refreshCompany: true });
}
```

```text
elements.invitationPage.hidden = true;
elements.authPage.hidden = true;
elements.appBody.hidden = false;
setActiveSection("operations", { focus: options.focus !== false });
window.history.replaceState({}, "", "/");
```

API segura:

- `/api/me` sin sesion: `401 UNAUTHORIZED`.
- login sintetico invalido: `401 UNAUTHORIZED`.
- invitacion sintetica: `valid=false`.
- solicitud publica invalida: `400 VALIDATION_ERROR`.
- logo privado sin sesion/cookie sintetica invalida: `401 UNAUTHORIZED`.

## Riesgos o pendientes

- Pendiente recibir evidencia PO redaccionada de TASK-212 o ejecutar con credenciales por canal seguro:
  - login correcto desde `/login`;
  - llegada a `Operaciones` / panel principal;
  - refresh con sesion activa permanece en panel;
  - logout vuelve a login.

## Siguiente recomendado

Product Owner puede aportar evidencia redaccionada actual sin password/cookie/token, o ejecutar el flujo delante de QA y compartir solo resultado/captura sanitizada. Con esa evidencia, QA puede cerrar TASK-212 sin volver a tocar codigo.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token real de invitacion.
- No se uso token interno real.
- No se imprimieron links tokenizados ni secretos.
- Los tokens/cookies usados en checks negativos fueron sinteticos e invalidos.
