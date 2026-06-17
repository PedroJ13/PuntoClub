# TASK-234 HANDOFF - Separar Admin empresas en pagina propia

Estado: Completado.

## Resultado

Se implemento `/admin-companies` como pagina/ruta separada para el panel interno de administracion de empresas.

La pagina reutiliza la seguridad temporal existente por token interno en memoria de la pestana y mantiene las acciones del panel:

- carga de solicitudes;
- token activo colapsado;
- aprobar desde resumen;
- ver detalle en drawer;
- aprobar/rechazar/reenviar desde detalle;
- confirmacion in-app.

No se agrego `localStorage` ni `sessionStorage`.

## Ruta implementada

```text
/admin-companies
```

URL publicada validada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net/admin-companies
```

## Cambios realizados

- `app/src/app.js`
  - Se agrego `isAdminCompaniesRoute()`.
  - Se agrego `showAdminCompaniesPage()`.
  - Se agrego `isolateAdminCompaniesView()`.
  - La inicializacion ahora detecta `/admin-companies` y muestra solo Admin empresas.
  - El menu `Admin empresas` navega a `/admin-companies` con ruta limpia.
  - Las vistas `/`, `/login`, `/company-registration` e invitacion limpian la clase de modo admin.

- `app/styles.css`
  - Se agrego `.admin-companies-page-mode`.
  - En modo admin se ocultan:
    - menu lateral;
    - Operaciones;
    - Mi empresa;
    - Reportes;
    - registro publico de empresa por estar dentro de `Mi empresa`;
    - secciones `hidden`.
  - En modo admin queda visible solo `data-section="adminCompanies"`.

## Deploy

- Commit publicado: `1db29e0`
- Mensaje: `Add isolated admin companies page`
- Branch: `main`
- Remote: `origin/main`
- Workflow esperado: `Deploy Punto Club frontend`

## Rutas verificadas

Publicado:

- `/admin-companies`: `200`
- `/`: `200`
- `/login`: `200`
- `/company-registration`: `200`

Marcadores publicados confirmados:

- `isAdminCompaniesRoute`: presente.
- `showAdminCompaniesPage`: presente.
- `isolateAdminCompaniesView`: presente.
- `window.location.assign("/admin-companies")`: presente para menu.
- `.admin-companies-page-mode`: presente.
- `.admin-companies-page-mode [data-section="company"]`: presente para ocultar `Mi empresa`/registro.
- `window.confirm`: no encontrado.
- `localStorage`: no encontrado.
- `sessionStorage`: no encontrado.

## Pruebas ejecutadas

- `node --check app/src/app.js` - OK.
- Busqueda local de `window.confirm`, `localStorage`, `sessionStorage` - sin resultados.
- Inspeccion de bundle/CSS publicado con `curl.exe` - OK.
- Verificacion HTTP publicada de rutas principales - OK.

## Riesgos o pendientes para QA/PO Test

- No se ejecuto QA visual con navegador en este turno porque no estuvo disponible la herramienta Browser.
- QA debe confirmar visualmente en desktop/mobile que al hacer scroll en `/admin-companies` no aparecen:
  - Operaciones;
  - Mi empresa;
  - Reportes;
  - registro publico de empresa;
  - paneles autenticados no relacionados.
- Flujo positivo con token interno real sigue pendiente de canal seguro:
  - token valido;
  - lista real de solicitudes;
  - aprobacion desde resumen/detalle;
  - drawer real;
  - modal in-app ejecutando accion real.
