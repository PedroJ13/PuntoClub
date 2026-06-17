# TASK-287 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Estado: Completed
Fecha: 2026-06-15

## Resultado

Se implemento `Atender cliente` como entrada operativa principal para empresa normal.

La Web fue publicada en Azure Static Web Apps.

URL publicada:

- https://calm-dune-075dc5c0f.7.azurestaticapps.net

## Handoffs leidos

- `tasks/TASK-284-HANDOFF.md`
- `tasks/TASK-285-HANDOFF.md`
- `tasks/TASK-286-HANDOFF.md`
- `tasks/TASK-289-HANDOFF.md`

## Resumen de cambios

- Menu operativo normal ajustado a:
  - `Atender cliente`
  - `Mi empresa`
  - `Reportes`
- `Puntos` y `Membresias` ya no se muestran como entradas operativas principales.
- `Atender cliente` conserva la estructura cliente primero:
  - buscar cliente;
  - resultados;
  - registrar cliente;
  - ficha del cliente seleccionado;
  - resumen de puntos;
  - resumen de membresias;
  - alertas;
  - acciones disponibles.
- Al registrar un cliente nuevo, queda seleccionado y se muestra la ficha para continuar la atencion.
- Las acciones de puntos quedan disponibles desde la ficha:
  - `Registrar compra`
  - `Redimir puntos`
  - `Ver historial`
- Las acciones de membresias quedan disponibles desde la ficha/panel de membresias:
  - `Pagar membresia`
  - `Renovar membresia`
  - uso de beneficios;
  - transacciones.
- La configuracion de planes y beneficios permanece fuera de la operacion principal, en el host de configuracion de `Mi empresa`.
- Se mantuvo compatibilidad interna con ids/secciones existentes (`operations`, `memberships`) para evitar romper handlers previos; la seccion `memberships` queda oculta como entrada operativa.

## Archivos tocados

- `app/index.html`
- `app/src/app.js`
- `app/styles.css`

No se cambio API.
No se cambio SQL.

## Evidencia de checks locales

- `node --check .\app\src\app.js`: OK
- `node --check .\app\src\customerApi.js`: OK
- `Invoke-WebRequest http://127.0.0.1:4297/`: 200

Markers locales presentes:

- `Atender cliente`
- `Ficha del cliente`
- `Pagar membresia`
- `Registrar compra`
- `Redimir puntos`
- `membership-payment-host`
- `membership-config-host`

Markers prohibidos ausentes localmente:

- `window.confirm`
- `localStorage`
- `sessionStorage`
- `Buscar cliente para puntos`
- `Operacion de puntos`

## Evidencia publicada

Deploy completado con SWA CLI:

- `swa deploy --env production`: OK

Status publicados:

- `/`: 200
- `/styles.css`: 200
- `/src/app.js`: 200
- `/src/customerApi.js`: 200

Markers publicados presentes:

- `Atender cliente`: True
- `Ficha del cliente`: True
- `Pagar membresia`: True
- `Registrar compra`: True
- `Redimir puntos`: True
- `membership-payment-host`: True
- `membership-config-host`: True
- `Mi empresa`: True
- `Reportes`: True

Markers prohibidos publicados ausentes:

- `window.confirm`: False
- `localStorage`: False
- `sessionStorage`: False
- `Buscar cliente para puntos`: False
- `Operacion de puntos`: False

## Riesgos o notas para QA

- La ficha unificada compone datos con endpoints existentes; puede hacer varias llamadas al seleccionar cliente, segun lo documentado por TASK-285.
- La verificacion con Browser embebido no pudo completarse porque el runtime quedo inconsistente tras una interrupcion previa y Playwright local no tenia Chromium descargado. Se compenso con validacion HTTP local, checks de sintaxis, markers locales y markers publicados.
- QA debe validar funcionalmente con una empresa real:
  - menu visible `Atender cliente`, `Mi empresa`, `Reportes`;
  - registrar cliente deja la ficha seleccionada;
  - flags de puntos/membresias muestran u ocultan acciones correctamente;
  - `Pagar membresia` activa membresia para cliente sin membresia;
  - `Renovar membresia` funciona para membresia renovable/vencida;
  - reportes siguen cargando y exportando CSV.
