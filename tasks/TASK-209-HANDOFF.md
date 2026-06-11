# TASK-209 - Handoff

Equipo responsable: Web Dev

## Resultado

Completado en codigo local. Se corrigio la transicion posterior a login exitoso para que la Web muestre el panel operativo principal en lugar de dejar al usuario en la pantalla `/login`.

## Causa encontrada

La sesion se creaba correctamente y `renderAuthIdentity()` actualizaba el encabezado a `Empresa activa: ...`, pero la vista de login seguia visible porque el flujo no ocultaba `#auth-page` ni mostraba `.app-body` despues de:

- login exitoso con el boton `Entrar`;
- carga directa de `/login` cuando `/api/me` ya devolvia una sesion activa.

Por eso el usuario podia ver `Sesion iniciada.` pero seguir atrapado visualmente en el formulario.

## Archivos modificados

- `app/src/app.js`

## Cambio aplicado

- Se agrego `showMainApp()` para ocultar login/invitacion, mostrar el panel principal y activar `Operaciones`.
- Despues de login exitoso, la UI transiciona al panel principal y limpia el password del formulario.
- Si `/api/me` devuelve sesion activa al cargar `/login`, la UI tambien pasa al panel principal.
- La ruta `/login` se reemplaza por `/` al entrar al panel para evitar quedar anclado a la pantalla de login.
- `Cerrar sesion` ahora limpia estado visible y muestra la pantalla de login.

## Pruebas ejecutadas

```text
node --check app/src/app.js
```

Resultado: OK.

## Seguridad

- No se tocaron contratos Backend/API.
- No se usaron cookies, tokens, passwords ni secretos reales.
- No se agrego persistencia de sesion en `localStorage` ni `sessionStorage`.

## Pendientes o bloqueos

- Pendiente QA publicado en TASK-210 para validar con sesion real:
  - login exitoso lleva a `Operaciones`;
  - refrescar con sesion activa conserva acceso al panel;
  - cerrar sesion vuelve a login;
  - no hay regresion en invitacion, solicitud de empresa ni operaciones autenticadas.
