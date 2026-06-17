# TASK-269 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Estado: Completed
Fecha: 2026-06-14

## Resultado

La Web publicada muestra alertas internas de vencimiento de membresias dentro de la seccion `Membresias`, con una seccion simple de seguimiento para proximas a vencer y vencidas.

## URL publicada

- `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

## Cambios realizados

- Se agrego panel `Seguimiento` en `Membresias`.
- Se agrego filtro simple `Dias de aviso`.
- Se consultan en paralelo:
  - `GET /api/memberships/expiration-alerts?status=active&withinDays={n}`
  - `GET /api/memberships/expiration-alerts?status=expired&withinDays={n}`
- Se muestran datos minimos:
  - cliente;
  - plan;
  - fecha de inicio;
  - fecha de vencimiento;
  - contacto;
  - estado operativo.
- Textos visibles incluidos:
  - `Proximas a vencer`
  - `Vencidas`
  - `Vence hoy`
  - `Vencio hace N dias`
- El mock Web fue alineado con el contrato de TASK-268 para simular proximas a vencer y vencidas por fecha.

## Evidencia de checks

- `node --check app/src/app.js`: OK
- `node --check app/src/customerApi.js`: OK
- Busqueda local de marcadores: OK
- Busqueda local de prohibidos `localStorage`, `sessionStorage`, `window.confirm`: sin coincidencias en archivos publicados revisados.

## Evidencia publicada

- Deploy SWA production completado con `swa deploy`.
- Assets publicados:
  - `/`: `200`
  - `/src/app.js`: `200`
  - `/src/customerApi.js`: `200`
  - `/styles.css`: `200`
- Marcadores publicados:
  - `Proximas a vencer`: presente
  - `Vencidas`: presente
  - `Vence hoy`: presente
  - `Vencio hace`: presente
  - `membership-expiration`: presente
  - `expiration-alerts`: presente
- Prohibidos publicados:
  - `localStorage`: no presente
  - `sessionStorage`: no presente
  - `window.confirm`: no presente

## Notas para QA

- Validar con sesion real de empresa activa y membresias con vencimiento cercano o vencido.
- La seccion vive en `Membresias`; si la empresa no tiene membresias habilitadas, mantiene el comportamiento existente.
- No se agregaron correos automaticos ni jobs programados.
- No se pudo ejecutar validacion visual en navegador local porque la herramienta de navegador no estaba disponible en esta sesion; se valido por sintaxis, marcadores publicados y carga HTTP de assets.
