# TASK-226 HANDOFF - Mejorar pagina publica de registro de empresa

Estado: Completado

## Cambios realizados

- `/company-registration` ahora se detecta como ruta publica y muestra directamente el formulario de registro.
- En modo publico se ocultan menu lateral, modulos operativos, login/logout y panel de `Mi empresa`.
- El formulario acepta logo opcional con preview local, validacion de PNG/JPG/WebP y limite de 1 MB.
- `app/src/customerApi.js` envia `multipart/form-data` cuando hay logo y mantiene JSON cuando no hay archivo.
- Mock API valida logo y devuelve `requestedLogo` seguro para probar el flujo local.
- Al enviar una solicitud exitosa, el formulario se oculta y queda un estado de `Solicitud recibida` con resumen seguro:
  - empresa;
  - correo de empresa;
  - correo de contacto;
  - estado;
  - logo incluido/no incluido.
- Se agrego accion `Enviar otra solicitud`, definida en UX, para limpiar y reabrir el formulario.

## Rutas/pantallas afectadas

- `GET /company-registration`
- Seccion `Mi empresa` donde vive el panel de registro en la app estatica.

## Estados validados

- Ruta publica sin menu operativo.
- Envio con JSON cuando no hay logo.
- Preparacion de envio multipart cuando hay logo.
- Validacion local de logo por tipo y tamano.
- Estado post-exito sin exponer tokens, rutas privadas ni datos sensibles.

## Pruebas ejecutadas

- `node --check app/src/app.js` - OK.
- `node --check app/src/customerApi.js` - OK.
- `npm test` en `api` fallo dentro del sandbox por `spawn EPERM`.
- `npm test` en `api` con permisos elevados - OK, 102/102 tests.

## Riesgos o pendientes para QA

- No se pudo usar Browser interno en este turno porque la herramienta no quedo expuesta; queda pendiente QA visual en desktop/mobile.
- QA debe probar carga real de logo contra Azure Storage/API desplegada.
