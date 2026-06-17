# TASK-267 - Handoff QA

Equipo: QA

Tarea validada: TASK-267 - QA reportes de membresias

Ambiente: publicado / Azure

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Fecha QA: 2026-06-13

## Resultado

Aprobado con observaciones.

La publicacion contiene soporte de reportes/auditoria para eventos de membresias:

- API publicada protege `reports/activity` y `audit/events` con cookie sintetica invalida: `401`.
- Web publicada contiene filtro/marker `membership`, etiquetas `Membresia activada` y `Beneficio usado`.
- Web publicada contiene `membershipCount`.
- El bundle publicado conserva exportacion CSV y las etiquetas legibles de membresias.
- No hay regresion visible en Operaciones, Mi empresa, Reportes, Login ni `Admin empresas`.
- No hay `window.confirm`, `localStorage` ni `sessionStorage` publicados.

Observacion: sin cookie/sesion, las rutas `/api/companies/{companyId}/reports/activity` y `/api/companies/{companyId}/audit/events` devuelven `404`, consistente con la nota de TASK-265 sobre contexto/empresa activa. Con cookie sintetica invalida devuelven `401`, lo cual confirma que las rutas estan publicadas y protegidas.

No se ejecuto prueba positiva real ni exportacion CSV con datos reales porque QA no recibio credenciales, cookie/sesion segura ni evidencia PO redaccionada para este flujo. Queda como bloqueo parcial/P2.

No se modifico codigo.

## Evidencia revisada

Se leyeron:

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-265-HANDOFF.md`
- `tasks/TASK-266-HANDOFF.md`

Resumen:

- TASK-265 ajusto reportes para eventos `customer.membership.activated` y `membership.benefit.used`; auditoria ya leia `OperationalAuditEvents`.
- TASK-266 agrego filtro `Membresias`, etiquetas legibles y conteo `membershipCount` en Web/CSV.

## Evidencia API

Checks con cookie sintetica invalida:

- `GET /api/companies/1/reports/activity?from=2026-06-01&to=2026-06-14&type=membership`
  - Observado: `401`.

- `GET /api/companies/1/reports/activity?from=2026-06-01&to=2026-06-14&type=all`
  - Observado: `401`.

- `GET /api/companies/1/audit/events?from=2026-06-01&to=2026-06-14&limit=10`
  - Observado: `401`.

- `GET /api/companies/6/reports/activity?from=2026-06-01&to=2026-06-14&type=membership`
  - Observado: `401`.

- `GET /api/companies/6/audit/events?from=2026-06-01&to=2026-06-14&limit=10`
  - Observado: `401`.

Checks sin cookie/sesion:

- `GET /api/companies/1/reports/activity?...type=membership`
  - Observado: `404`.

- `GET /api/companies/1/audit/events?...limit=10`
  - Observado: `404`.

- `GET /api/companies/6/reports/activity?...type=membership`
  - Observado: `404`.

- `GET /api/companies/6/audit/events?...limit=10`
  - Observado: `404`.

Control:

- `GET /api/me` sin sesion:
  - Observado: `401`.

Resultado:

- Aprobado para proteccion con cookie invalida.
- Observacion: sin cookie, reportes/auditoria devuelven `404` por contexto de empresa, segun comportamiento ya documentado por Backend/API.

## Evidencia Web

Assets publicados:

- `/`: `200`, `htmlLength=52472`.
- `/login`: `200`.
- `/src/app.js`: `200`, `appLength=174263`.
- `/src/customerApi.js`: `200`, `customerApiLength=76502`.
- `/styles.css`: `200`.
- `Last-Modified`: `Sun, 14 Jun 2026 03:03:54 GMT`.
- `ETag`: `"15435580"`.

Marcadores de reportes/auditoria de membresias:

- Filtro/marker `membership`: presente.
- Texto `Membresias`: presente.
- Etiqueta `Membresia activada`: presente.
- Etiqueta `Beneficio usado`: presente.
- `membershipCount`: presente.
- Cliente de reporte acepta tipo `membership`: presente.
- Marcadores de exportacion CSV: presentes.
- Etiquetas de membresias disponibles para CSV: presentes.
- Marcadores de auditoria (`getAuditEvents` / `audit/events`): presentes.

Regresion Web:

- `Operaciones`: presente.
- `Mi empresa`: presente.
- `Reportes`: presente.
- `Admin empresas` oculto: presente.
- Login carga `200` y contiene marcadores de pantalla de inicio de sesion.
- Marcadores de operacion de puntos: presentes.
- `localStorage`: no encontrado.
- `sessionStorage`: no encontrado.
- `window.confirm`: no encontrado.

Resultado:

- Aprobado para publicacion Web de reportes/auditoria de membresias.
- Aprobado para regresion visible por bundle.

## Evidencia CSV

No se ejecuto exportacion CSV real con datos porque no hubo sesion real.

Evidencia tecnica publicada:

- El bundle contiene marcadores de exportacion CSV.
- El bundle contiene etiquetas `Membresia activada` y `Beneficio usado`, usadas tambien por el reporte/export.

Clasificacion:

- P2 pendiente: exportar CSV con datos reales de membresias y confirmar que incluye activacion/uso de beneficio con texto legible.

## Prueba positiva o bloqueo parcial

No se valido con datos reales:

- activacion de membresia aparece en actividad/auditoria;
- uso de beneficio aparece en actividad/auditoria;
- exportacion CSV incluye esos eventos.

Motivo:

- QA no recibio credenciales reales, cookie/sesion segura ni evidencia PO redaccionada para este flujo.
- No se deben inventar credenciales ni exponer secretos.

## P1/P2/P3

- P1: ninguno.
- P2: falta prueba positiva real o evidencia PO redaccionada de:
  - reporte con activacion de membresia;
  - reporte con uso de beneficio;
  - auditoria con ambos eventos;
  - CSV con ambos eventos.
- P3: ninguno nuevo.

## Riesgos o pendientes

- Ejecutar prueba con sesion real cuando existan datos de membresias y usos de beneficios.
- Confirmar CSV descargado desde UI con datos reales.
- Mantener documentado que sin cookie las rutas por empresa devuelven `404`; con cookie invalida devuelven `401`.

## Seguridad

- No se uso password real.
- No se uso cookie real.
- No se uso token interno real.
- No se uso token de invitacion real.
- No se imprimieron hashes, SAS, blob paths internos ni links tokenizados.
- La cookie usada para regresion fue sintetica e invalida.
