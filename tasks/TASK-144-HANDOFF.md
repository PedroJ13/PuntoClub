Equipo: QA

Tarea validada: TASK-144 - Revalidar invitacion publicada despues del fallback

Ambiente:
- Web publicado: https://calm-dune-075dc5c0f.7.azurestaticapps.net
- API publicada: https://func-puntoclub-prod-br-001.azurewebsites.net/api
- Fecha QA: 2026-06-08

Resultado: no aprobado

Checks ejecutados:
- Navegacion publicada a `/company-invitations/accept`.
- Navegacion publicada a `/company-invitations/accept?token=[token-sintacticamente-valido-no-real]`.
- Confirmacion de rutas normales publicadas `/` y `/index.html`.
- Verificacion de exposicion de token en texto visible.
- Smoke operativo publicado: crear cliente, registrar compra, rechazar factura duplicada, registrar redencion y consultar saldo.

Hallazgos:
- P1: La ruta profunda publicada de invitacion sigue devolviendo `Azure Static Web Apps - 404: Not found`.
  - `/company-invitations/accept` devuelve titulo `Azure Static Web Apps - 404: Not found` y texto `404: Not Found`.
  - `/company-invitations/accept?token=[redacted]` devuelve el mismo 404.
  - La app no llega a renderizar la vista controlada de invitacion, por lo que no se puede validar estado sin token ni token invalido desde UI publicada.
- No se observo el token completo en pantalla, pero esto ocurre porque Azure devuelve 404 antes de cargar la app; no cuenta como validacion positiva de la vista de invitacion.

P0/P1:
- P1 abierto: fallback/rewrite publicado aun no esta efectivo para `/company-invitations/accept`.
- No se detectaron P0.

P2/P3:
- Sin P2/P3 nuevos.

Evidencia:
- Ruta invitacion sin token:
  - URL: `/company-invitations/accept`.
  - Titulo: `Azure Static Web Apps - 404: Not found`.
  - Texto: `404: Not Found`.
  - Vista de invitacion: no renderizada.
- Ruta invitacion con token no real:
  - URL: `/company-invitations/accept?token=[redacted]`.
  - Titulo: `Azure Static Web Apps - 404: Not found`.
  - Texto: `404: Not Found`.
  - Token completo visible: no, pero por 404 previo a la app.
- Rutas normales:
  - `/`: carga `Punto Club`, muestra `API real` y `Operaciones`; no hay 404.
  - `/index.html`: carga `Punto Club`, muestra `API real` y `Operaciones`; no hay 404.
- Smoke operativo:
  - Cliente QA creado: id `92`, `201`.
  - Compra QA: `201`, `pointsEarned = 600`.
  - Factura duplicada: `409 DUPLICATE_INVOICE`.
  - Redencion QA: `201`, `pointsRedeemed = 100`.
  - Saldo final: `pointsEarned = 600`, `pointsRedeemed = 100`, `pointsBalance = 500`.

Riesgos o pendientes:
- Confirmar que el deploy frontend publicado incluyo `app/staticwebapp.config.json` en la raiz de Static Web Apps.
- Reintentar la revalidacion despues de un deploy confirmado del frontend.
- El flujo opcional con `INTERNAL_ADMIN_TOKEN` y link real no se ejecuto porque no se recibieron credenciales o link por canal seguro.

Siguiente recomendado:
- Infra/Web debe revisar el artefacto publicado o pipeline de Static Web Apps: el fallback local de TASK-143 no esta aplicado en el ambiente publicado validado.
- QA debe repetir TASK-144 cuando `/company-invitations/accept` deje de devolver 404 y renderice la app.
