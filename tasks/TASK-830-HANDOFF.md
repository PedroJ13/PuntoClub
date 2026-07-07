Equipo: Web Dev
Modo de ejecucion: Logo empresa / Diagnostico UI
Tarea completada: TASK-830 - Validar render de logo en Mi empresa y encabezado

Resultado:
- Revisado el flujo Web de logo de empresa.
- `GET /api/my-company` expone `logoUrl` como ruta controlada cuando existe metadata de logo.
- La UI de `Mi empresa > Logo` usa `settings.logoUrl` y `api.getCompanyLogoUrl()` para renderizar el preview.
- El encabezado superior derecho usa `active-company-logo-image` cuando hay `logoUrl` y fallback de iniciales cuando no hay logo.
- Se corrigio el caso de error de carga de imagen:
  - en `Mi empresa > Logo`, si la imagen falla, se oculta el `img` y se muestra mensaje claro;
  - en el encabezado, si la imagen falla, se oculta el `img` y vuelve el fallback de iniciales.
- Se mantiene el logo en el encabezado superior derecho junto a la identidad de empresa.
- No se cambio API.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-830-HANDOFF.md`

Detalle UI:
- `renderCompanyLogo(settings)`:
  - conserva el comportamiento con `logoUrl`;
  - limpia `onerror` cuando no hay logo o cuando se previsualiza un archivo local;
  - agrega fallback si `/api/my-company/logo` no carga.
- `renderActiveCompanyIdentity(company)`:
  - conserva fallback de iniciales cuando no hay logo;
  - agrega fallback de iniciales cuando el `img` del header falla al cargar.

Validaciones:
- `node --check app/src/app.js`
- `npx prettier --check app/src/app.js`
- `git diff --check`

Resultado de validaciones:
- Sintaxis Web OK.
- Prettier OK.
- `git diff --check` sin errores; solo avisos LF/CRLF.

Uso Azure SQL:
- No para TASK-830.
- Motivo: diagnostico y fix Web local, sin datos reales.

Riesgos o pendientes:
- La verificacion de metadata real de Aurisbel queda pendiente por TASK-829 bloqueada por firewall.
- QA debe validar con sesion real que, cuando `logoUrl` exista y el endpoint responda 200, el logo se vea en `Mi empresa > Logo` y en el header.
