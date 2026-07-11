# TASK-970 - Handoff

Equipo: Web Dev
Modo: Rediseño visual / Campañas staging
Tarea completada: Implementar rediseño visual de Campañas y Promociones
Fecha: 2026-07-11

## Resultado

Completada localmente en rama `staging`.

Se aplico la especificacion de TASK-969 al modulo `Enviar campañas`, manteniendo el shell aprobado y sin cambiar API, SQL, auth, envios, feature flags, reglas de baja promocional ni datos.

## Archivos cambiados

```txt
app/index.html
app/styles.css
tasks/TASK-970-HANDOFF.md
```

## Cambios realizados

- Se removio la seccion `Configuracion` dentro de Campañas. La configuracion operativa queda separada en `Mi empresa > Comunicaciones`.
- Subnav de Campañas actualizado con semantica `role="tablist"`, tabs con `role="tab"`, `aria-selected` y `aria-controls`.
- Paneles de Campañas actualizados con `role="tabpanel"` e ids estables.
- `Crear/Editar campaña` renombrado a `Crear / actualizar campaña`.
- `Historial local` renombrado a `Historial de campañas`.
- `Reintentar fallidos` queda presentado como accion sensible con estilo warning; la confirmacion existente por `window.confirm` se mantiene.
- Se agrego capa visual compacta para header, KPIs, subnav, cards/paneles, nota de envio real, seleccion de destinatarios, cards deshabilitadas e historial.
- Se agrego responsive para KPIs, subnav y cards de destinatarios en tablet/mobile.

## Validacion ejecutada

Checks locales:

```txt
npx prettier --write app/index.html app/styles.css app/src/app.js
Resultado: OK

npx prettier --check app/index.html app/styles.css app/src/app.js
Resultado: OK

node --check app/src/app.js
Resultado: OK
```

Validacion visual local con servidor estatico y Playwright, sin API real ni envios:

```txt
Subnavs validados:
- Enviar campañas
- Crear / actualizar campañas
- Clientes
- Historial

Viewports:
- 1366x768
- 1024x768
- 768x1024
- 390x844
- 360x740

Resultado:
- horizontalOverflow=false en todos los subnavs y viewports.
- settingsPanelCount=0 dentro del modulo Campañas.
- tabRoleCount=4.
- tabpanelCount=6.
- historyTitle=Historial de campañas.
- retrySensitive=true.
```

## Uso Azure SQL

No.

## P0/P1

Ninguno abierto.

## P2/P3

- P3: validacion visual fue local/sintetica, sin sesion real ni datos de API. QA debe validar en staging despues de publicar.

## Riesgos o pendientes

- No se hizo deploy ni se toco produccion.
- No se enviaron campañas reales.
- No se cambio API, SQL, auth, envios, feature flags, reglas de baja promocional ni datos.
- La accion `Reintentar fallidos` conserva la confirmacion existente antes de ejecutar.

## Siguiente recomendado

- Publicar en staging el paquete visual de Campañas.
- QA focal en staging para validar subnavs, ausencia de `Configuracion`, `Historial de campañas`, retry sensible, responsive y que no haya overflow horizontal.
