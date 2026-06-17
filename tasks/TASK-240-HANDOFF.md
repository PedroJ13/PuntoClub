# TASK-240 - Handoff QA

Equipo: QA

Tarea validada: TASK-240 - Validar Mi empresa y menu autenticado

Ambiente: publicado

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-12

## Resultado

No aprobado.

La publicacion corrige parcialmente el alcance: `Admin empresas` esta oculto del menu normal y las rutas `/company-registration` y `/admin-companies` siguen respondiendo por URL directa.

Pero el bundle publicado todavia conserva comportamiento de `Mi empresa` apuntando al formulario publico de registro y no contiene la regla CSS esperada para ocultar `company-registration-panel` fuera de `/company-registration`. Esto mantiene abierto el problema principal reportado para TASK-239: `Mi empresa` autenticada puede seguir mostrando el registro publico por error.

No se modifico codigo. Solo se crea este handoff QA.

## Evidencia revisada

Se leyeron:

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-238-HANDOFF.md`
- `tasks/TASK-239-HANDOFF.md`

TASK-238 definio:

- `Mi empresa` autenticada debe mostrar gestion/configuracion de empresa activa.
- `Mi empresa` no debe mostrar formulario publico de `Registrar empresa`.
- `Admin empresas` no debe aparecer en menu normal de empresa autenticada.
- `/company-registration` y `/admin-companies` deben seguir aisladas.

TASK-239 reporto como completado:

- menu `Admin empresas` oculto con `hidden`;
- CSS para ocultar `.company-registration-panel` fuera de `/company-registration`;
- foco de `Mi empresa` hacia `company-name`;
- copy `Datos de empresa actualizados.`;
- fallback `Sin logo cargado`.

## Checks publicados ejecutados

### Rutas publicadas

- `/`: `200`, `htmlLength=35978`.
- `/company-registration`: `200`, `htmlLength=35978`.
- `/admin-companies`: `200`, `htmlLength=35978`.
- `/src/app.js`: `appLength=114364`.
- `/styles.css`: `cssLength=24357`.

Resultado:

- `/company-registration` sigue aislada por URL directa.
- `/admin-companies` sigue aislada por URL directa.

### Menu y secciones

Marcadores publicados:

- `data-section-target="adminCompanies" hidden`: encontrado.
- `Operaciones`: encontrado.
- `Mi empresa`: encontrado.
- `Reportes`: encontrado.
- `showPublicCompanyRegistrationPage`: encontrado.
- `showAdminCompaniesPage`: encontrado.
- `public-registration-mode`: encontrado.
- `admin-companies-page-mode`: encontrado.

Resultado:

- Aprobado para menu normal sin `Admin empresas`.
- Aprobado para rutas publicas/directas separadas.

### `Mi empresa` autenticada

Marcadores esperados segun TASK-239:

- foco de `Mi empresa` a configuracion (`company: elements.companyNameInput`):
  - No encontrado.
  - Publicado sigue apuntando a `company: elements.registrationCompanyNameInput`.

- CSS para ocultar registro publico fuera de `/company-registration`:
  - Esperado: `body:not(.public-registration-mode) .company-section .company-registration-panel`.
  - No encontrado.
  - CSS publicado solo contiene estilos de `.public-registration-mode .company-registration-panel`, pero no la regla de ocultamiento en modo autenticado/normal.

- copy `Datos de empresa actualizados.`:
  - No encontrado.

- fallback `Sin logo cargado`:
  - No encontrado.
  - Publicado sigue usando `Sin logo`.

Resultado:

- No aprobado para `Mi empresa` autenticada.

### Seguridad y negativos sin secretos

- `GET /api/me` sin sesion:
  - `401 UNAUTHORIZED`.

- `GET /api/company-registration-requests?status=pending&limit=25` sin token:
  - `403 FORBIDDEN`.

- `GET /api/company-registration-requests?status=pending&limit=25` con token sintetico invalido:
  - `403 FORBIDDEN`.

- `POST /api/company-auth/login` con usuario/password sinteticos invalidos:
  - `401 UNAUTHORIZED`.

Resultado:

- Aprobado para negativos seguros.
- No se observaron tokens, hashes, SAS, blob paths internos ni links tokenizados.

## No ejecutado

No se ejecuto login real ni navegacion autenticada real porque QA no recibio:

- credenciales reales por canal seguro; ni
- evidencia PO redaccionada de esta validacion.

Aun sin sesion real, los marcadores publicados son suficientes para bloquear el cierre porque el bundle mantiene referencias directas a `registrationCompanyNameInput` para la seccion `Mi empresa` y no contiene la regla CSS declarada por TASK-239 para ocultar el formulario publico en modo normal.

## Hallazgos

### P1 - `Mi empresa` publicada sigue apuntando al formulario publico de registro

En `/src/app.js` publicado, el foco de la seccion `company` sigue siendo:

```text
company: elements.registrationCompanyNameInput
```

Esto contradice TASK-239, que indicaba que el foco debia apuntar al formulario de configuracion (`company-name`) y no al formulario publico de registro.

### P1 - Falta regla CSS publicada para ocultar registro publico dentro de `Mi empresa`

No se encontro en `styles.css` publicado la regla:

```text
body:not(.public-registration-mode) .company-section .company-registration-panel
```

Sin esa regla, el panel publico `company-registration-panel` puede seguir visible dentro de `Mi empresa` en modo autenticado/normal.

## P0/P1

- P0: ninguno.
- P1: `Mi empresa` autenticada no queda validada porque el bundle publicado sigue apuntando al registro publico.
- P1: falta regla CSS publicada para ocultar `company-registration-panel` fuera de `/company-registration`.

## P2/P3

- P2: queda pendiente prueba visual con sesion real cuando Web Dev publique la correccion completa o cuando PO aporte evidencia redaccionada.
- P3: ninguno nuevo.

## Riesgos o pendientes

- Publicar la correccion completa de TASK-239 o confirmar si el deploy actual omitio parte de los cambios.
- Revalidar con sesion real o evidencia PO redaccionada:
  - menu autenticado sin `Admin empresas`;
  - `Mi empresa` muestra datos/configuracion/logo de empresa activa;
  - `Mi empresa` no muestra `Registrar empresa`;
  - `Operaciones` y `Reportes` siguen navegables.

## Siguiente recomendado

Web Dev debe revisar el bundle publicado y confirmar deploy con:

- `company: elements.companyNameInput`;
- regla CSS para ocultar `.company-registration-panel` fuera de `public-registration-mode`;
- copy/fallback esperados de TASK-239.

Luego QA debe reintentar TASK-240, idealmente con evidencia PO redaccionada o sesion real por canal seguro.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token interno real.
- No se uso token de invitacion real.
- No se imprimieron hashes, SAS, blob paths internos ni links tokenizados.
- Los valores usados para login negativo fueron sinteticos e invalidos.
