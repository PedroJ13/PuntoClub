Equipo:
QA

Tarea validada:
TASK-095 - Validar reporte operativo publicado.

Fecha:
2026-06-06

Ambiente:
- Frontend publicado: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Navegador: Chrome headless con CDP
- Viewport: desktop `1280x800`

Resultado:
No aprobado.

Resumen:
El reporte operativo no esta disponible en ambiente publicado. El endpoint publicado de API responde `404` para `/reports/activity`, y el frontend publicado no contiene pantalla `Reporte`, consumo de `reports/activity` ni export CSV. El flujo de caja existente sigue cargando con `API real`, pero TASK-095 no es ejecutable hasta desplegar API y frontend de TASK-093/TASK-094.

Checks ejecutados:
- Lectura de handoffs TASK-093 y TASK-094.
- Consulta HTTP del endpoint publicado de reporte.
- Lectura HTTP de HTML publicado.
- Lectura HTTP de `src/app.js` publicado.
- Lectura HTTP de `styles.css` publicado.
- Busqueda estatica de referencias a `Reporte`, `reports/activity` y CSV.
- Apertura del frontend publicado en Chrome headless.
- Confirmacion visual de carga de Punto Club y flujo de caja existente.
- Validacion desktop basica sin overflow horizontal.

Hallazgos:
P0/P1:
- P1: El reporte operativo no esta publicado. `GET /api/companies/1/reports/activity?from=YYYY-MM-DD&to=YYYY-MM-DD&type=all` devuelve `404`, y la UI publicada no muestra acceso a `Reporte` ni `Exportar CSV`.

P2/P3:
- Ninguno adicional.

Evidencia API:
- Endpoint probado:
  - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/1/reports/activity?from=2026-06-06&to=2026-06-06&type=all`
- Resultado:
  - HTTP `404`
  - `ok: false`
  - mensaje `Response status code does not indicate success: 404 (Not Found).`

Evidencia frontend estatica:
- HTML publicado:
  - length `7181`
- JS publicado:
  - length `27234`
- CSS publicado:
  - length `8459`
- `hasReporte: false`
- `hasReportsApi: false`
- `hasExportCsv: false`
- coincidencias `zona|Zona`: `0`

Evidencia navegador:
- Titulo:
  - `Punto Club`
- UI:
  - `apiReal: true`
  - `hasPuntoClub: true`
  - `hasReporte: false`
  - `hasExport: false`
  - paneles presentes: `Buscar cliente`, `Registrar cliente`, `Resultados`, `Operacion`
  - `bodyZona: []`
- Desktop:
  - `innerWidth: 1280`
  - `scrollWidth: 1280`
  - `overflowX: false`

Checks no ejecutados por bloqueo:
- Consultar reporte por rango con datos existentes.
- Confirmar resumen de compras, monto total, puntos ganados, redenciones, puntos redimidos y clientes activos.
- Confirmar detalle de compras/redenciones.
- Probar filtro por tipo.
- Probar rango sin datos.
- Probar validaciones de fecha.
- Exportar CSV y revisar columnas/contenido.
- Validar mobile del reporte.

Motivo:
- La funcionalidad objetivo no esta desplegada en API ni frontend publicados.

Riesgos o pendientes:
- TASK-093 indica explicitamente que la Azure Function estable necesitaba redeploy para exponer `getActivityReport`.
- TASK-094 indica que la pantalla fue validada localmente con mock y que estaba pendiente deploy/redeploy.
- No se tocaron codigo, Azure ni secretos.

Siguiente recomendado:
- Backend/API y Release deben desplegar TASK-093 en Azure Functions.
- Web Dev / Release debe desplegar TASK-094 en Static Web Apps.
- Reintentar TASK-095 cuando:
  - `/api/companies/1/reports/activity` responda distinto de `404`;
  - el frontend publicado contenga `Reporte`, `reports/activity` y `Exportar CSV`.
