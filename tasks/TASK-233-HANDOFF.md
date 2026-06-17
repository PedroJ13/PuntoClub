# TASK-233 HANDOFF - Aislar pagina publica de registro de empresa

Estado: Completado.

## Resultado

Se ajusto `/company-registration` para que la vista publica de registro no vuelva a mostrar secciones operativas al hacer scroll.

La causa identificada fue una regla CSS de modo publico que aplicaba `display: block` a `.workspace-section` y podia sobreponerse a secciones marcadas como `hidden`.

## Cambios realizados

- `app/styles.css`
  - Se reemplazo la regla publica generica de `.workspace-section` por una regla especifica para `data-section="company"`.
  - Se agrego regla explicita para mantener ocultas en modo publico:
    - secciones con `[hidden]`;
    - `data-section="operations"`;
    - `data-section="reports"`;
    - `data-section="adminCompanies"`.

- `app/src/app.js`
  - Se agrego `isolatePublicCompanyRegistrationView()`.
  - En `showPublicCompanyRegistrationPage()` se reafirma que solo `data-section="company"` quede visible.

No se tocaron endpoints, tokens, cookies, passwords ni contratos API.

## Deploy

- Commit publicado: `023306c`
- Mensaje: `Isolate public company registration page`
- Branch: `main`
- Remote: `origin/main`
- Workflow esperado: `Deploy Punto Club frontend`

## Rutas verificadas

Publicado:

- `https://calm-dune-075dc5c0f.7.azurestaticapps.net/company-registration`
  - Resultado: `200`

Marcadores publicados confirmados:

- `isolatePublicCompanyRegistrationView`: presente en `app.js`.
- llamada a `isolatePublicCompanyRegistrationView()`: presente.
- `.public-registration-mode .workspace-section[hidden]`: presente en `styles.css`.
- `.public-registration-mode [data-section="operations"]`: presente en `styles.css`.
- regla anterior generica `.public-registration-mode .workspace-section { display: block; }`: no encontrada.
- `window.confirm`: no encontrado.

## Pruebas ejecutadas

- `node --check app/src/app.js` - OK.
- Inspeccion de bundle/CSS publicado con `curl.exe` - OK.
- `GET /company-registration` publicado - `200`.

## Riesgos o pendientes para QA

- No se ejecuto QA visual con navegador en este turno porque no estuvo disponible la herramienta Browser.
- QA debe confirmar visualmente en desktop/mobile que al hacer scroll en `/company-registration` no aparecen:
  - Operaciones;
  - Mi empresa;
  - Reportes;
  - Admin empresas;
  - paneles autenticados u operativos.
- QA debe confirmar que `/`, `/login` y `/company-invitations/accept` siguen sin regresion visual.
