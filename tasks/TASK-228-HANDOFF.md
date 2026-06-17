# TASK-228 HANDOFF - Mostrar identidad visual de empresa en operacion

Estado: Completado

## Cambios realizados

- Se agrego identidad de empresa activa en el encabezado principal.
- Si la empresa tiene `logoUrl`, se muestra la imagen usando `api.getCompanyLogoUrl` y cache key por `logoUpdatedAt/updatedAt`.
- Si no hay logo, se muestra fallback con iniciales limpias del nombre de empresa.
- La identidad se refresca al:
  - iniciar sesion;
  - cargar configuracion de empresa;
  - guardar configuracion;
  - subir logo;
  - cerrar sesion.
- En `/company-registration` la identidad activa queda oculta porque es una ruta publica sin empresa operativa.

## Ubicacion del logo/fallback

- Encabezado superior, antes del estado de sesion.
- Fallback: bloque compacto con iniciales de la empresa y nombre truncado de forma responsive.

## Validaciones ejecutadas

- `node --check app/src/app.js` - OK.
- `node --check app/src/customerApi.js` - OK.
- `npm test` en `api` fallo dentro del sandbox por `spawn EPERM`.
- `npm test` en `api` con permisos elevados - OK, 102/102 tests.

## Riesgos o pendientes para QA

- Falta QA visual con Browser en desktop/mobile.
- QA debe validar logo real post-login con sesion de empresa y confirmar que logout limpia la identidad visual.
