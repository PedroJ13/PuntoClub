# TASK-995 - Handoff

Equipo: Ejecucion Tecnica
Modo: Web Dev
Tarea completada: TASK-995 - Aplicar copy de comunicaciones y admin en staging

## Resultado

Se aplico la ola de copy aprobada para `Enviar campañas` y `Admin empresas` en Web staging, sin cambiar reglas de envio, seleccion, reintentos, bajas, API, SQL ni configuracion.

Textos principales ajustados:

- `Refrescar lista` -> `Actualizar lista`.
- `Preview` / `preview` visible -> `Vista previa` / `vista previa`.
- `feature flag activo` -> `que la función esté habilitada`.
- `No aptos` / `No apto` visible -> `No elegibles` / `No elegible`.
- `Panel interno` visible en acceso admin -> `Admin empresas` en menu y `Sesión interna asistida` como eyebrow.
- Placeholder de token ajustado a `Ingresa el token interno`.
- Mensajes admin sin tilde corregidos: `Confirmar acción`, `esta acción`, `la acción`.
- Mensajes de acceso admin suavizados para no exponer detalle tecnico: sesion interna asistida en vez de diagnosticos sobre token vencido.

## Archivos cambiados

- `app/index.html`
- `app/src/app.js`

## Validacion ejecutada

- `npx prettier --check app/index.html app/src/app.js`: OK.
- `node --check app/src/app.js`: OK.
- Busqueda de remanentes visibles:
  - Sin `Refrescar lista`.
  - Sin `feature flag activo`.
  - Sin `No aptos` / `No apto`.
  - Sin `Preview de edición` / `Ver preview` / `Preview` como titulo visible.
  - La coincidencia restante de `Unexpected API error` es comparacion interna para mapear a mensaje seguro, no texto visible.
- Smoke local con servidor estatico temporal:
  - HTML servido contiene `Vista previa`, `Actualizar lista`, `No elegibles`, `Sesión interna asistida` y `Admin empresas`.
  - No contiene remanentes principales.
- Smoke local Playwright con secciones de comunicaciones/admin reveladas solo en DOM local:
  - Viewports `1366x768`, `1024x768`, `768x1024`.
  - Copy nuevo presente.
  - Remanentes principales ausentes.
  - Sin overflow horizontal.

## Uso Azure SQL

No. La tarea fue exclusivamente Web/copy. No se consulto ni modifico Azure SQL.

## P0/P1

No detectados.

## P2/P3

No detectados en validacion local.

## Riesgos o pendientes

- Pendiente confirmar el despliegue de Web staging y smoke publicado en `/app` para `Enviar campañas` y `/admin-companies` sin acciones sensibles.
- No se enviaron campañas, no se reintentaron fallidos, no se registraron bajas y no se ejecutaron acciones de admin.

## Siguiente recomendado

- Publicar/verificar el bundle en Web staging y pasar a QA visual/copy de TASK-995.
