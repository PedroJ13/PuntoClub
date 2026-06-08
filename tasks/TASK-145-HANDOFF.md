Equipo: QA

Tarea validada: TASK-145 - Revalidar fallback publicado despues del deploy de config SWA

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08

Resultado: aprobado

Checks ejecutados:
- Navegacion publicada a `/company-invitations/accept`.
- Navegacion publicada a `/company-invitations/accept?token=[token-sintacticamente-valido-no-real]`.
- Confirmacion de que ya no aparece `Azure Static Web Apps - 404: Not found`.
- Confirmacion de estado controlado sin token.
- Confirmacion de estado controlado con token invalido.
- Confirmacion de que el token completo no aparece en texto visible.
- Confirmacion de rutas normales publicadas `/` y `/index.html`.
- Smoke operativo publicado: crear cliente, registrar compra, rechazar factura duplicada, registrar redencion y consultar saldo.

Hallazgos:
- No se detectaron hallazgos bloqueantes.
- La ruta profunda publicada ya sirve la app `Punto Club` y no la pagina 404 de Azure Static Web Apps.
- Sin token y con token no real, la app muestra `Invitacion no disponible` como estado controlado.

P0/P1:
- Sin P0/P1 abiertos para esta tarea.

P2/P3:
- Sin P2/P3 nuevos.

Evidencia:
- Ruta invitacion sin token:
  - URL: `/company-invitations/accept`.
  - Titulo: `Punto Club`.
  - Texto visible incluye: `INVITACION DE EMPRESA`, `Active el acceso de su empresa`, `Invitacion no disponible`.
  - No aparece `Azure Static Web Apps - 404: Not found`.
- Ruta invitacion con token no real:
  - URL: `/company-invitations/accept?token=[redacted]`.
  - Titulo: `Punto Club`.
  - Texto visible incluye: `INVITACION DE EMPRESA`, `Active el acceso de su empresa`, `Invitacion no disponible`.
  - Token completo visible: no.
  - No aparece `Azure Static Web Apps - 404: Not found`.
- Rutas normales:
  - `/`: carga `Punto Club`, muestra `API real` y `Operaciones`; no hay 404.
  - `/index.html`: carga `Punto Club`, muestra `API real` y `Operaciones`; no hay 404.
- Smoke operativo:
  - Cliente QA creado: id `93`, `201`.
  - Compra QA: `201`, `pointsEarned = 800`.
  - Factura duplicada: `409 DUPLICATE_INVOICE`.
  - Redencion QA: `201`, `pointsRedeemed = 100`.
  - Saldo final: `pointsEarned = 800`, `pointsRedeemed = 100`, `pointsBalance = 700`.

Riesgos o pendientes:
- No se valido link real ni invitacion valida porque no se entrego `INTERNAL_ADMIN_TOKEN` ni link real por canal seguro. Esta validacion queda fuera de alcance de TASK-145.
- No se valido login/password real por fuera de alcance.

Siguiente recomendado:
- Continuar con la validacion de invitacion real cuando Product/Infra entregue token admin y link real por canal seguro, sin documentar secretos ni URLs completas con token.
