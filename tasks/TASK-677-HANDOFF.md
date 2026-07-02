Equipo: Product / Architect / Release
Modo de ejecucion: Release closure
Tarea completada: TASK-677 - Cerrar release de imagen opcional en campanas

Resultado:
- Se procesa el cierre de release de imagen opcional en campanas promocionales.
- API/Web quedaron publicados.
- QA Web publicado aprobo el flujo con observaciones no bloqueantes.
- No se enviaron correos reales.
- No se cambiaron feature flags.

Handoffs procesados:
- `tasks/TASK-675-HANDOFF.md`
- `tasks/TASK-676-HANDOFF.md`

Publicacion:
- Commit publicado:
  - `0d29a070c0301cd508f9c1b329027db90e27f8a7`
  - `Add promotional campaign images`
- Workflow Web:
  - `Deploy Punto Club frontend`
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28563163976`
- Workflow API:
  - `Deploy Punto Club API`
  - Estado: `success`
  - URL: `https://github.com/PedroJ13/PuntoClub/actions/runs/28563163983`

Validacion publicada:
- Ambiente Web:
  - `https://puntoclubcr.com/app`
- API:
  - `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Empresa de prueba controlada:
  - `Aurisbel Pasteleria`
  - `eventos.aurisbel@gmail.com`
- Campana QA creada:
  - `QA TASK-676 imagen 202607020338`
  - `campaignId` observado: `9`

QA aprobado:
- Crear campana sin imagen.
- Mostrar campana seleccionada y preview sin imagen.
- Subir PNG valido.
- Render publico de PNG sin sesion:
  - `200 image/png`
- Reemplazar por JPEG.
- Render publico de JPEG sin sesion:
  - `200 image/jpeg`
- Rechazar SVG con mensaje:
  - `Usa una imagen JPG, PNG o WebP.`
- Rechazar archivo mayor a 1 MB con mensaje:
  - `La imagen supera el limite de 1 MB.`
- Eliminar imagen.
- Confirmar que la URL publica de imagen eliminada queda inactiva:
  - `404 application/json`

Hallazgos:
- No hubo P0/P1/P2/P3 de producto.
- Observacion no bloqueante: algunas acciones de seleccion de archivo y confirmacion final de eliminacion fueron asistidas manualmente por Product Owner por limitacion de automatizacion del navegador integrado.

Confirmaciones de control:
- No se enviaron correos reales.
- No se cambio `PROMOTIONAL_EMAIL_SEND_ENABLED`.
- No se cambio sender ACS.
- No se cambiaron secretos.
- No se habilito public access del contenedor.
- No se consulto Azure SQL directamente desde Product / Release en esta tarea.

Uso Azure SQL:
- No directo en esta tarea.
- Motivo: esta fue una tarea de cierre de release.
- La validacion QA publicada si uso ambiente productivo de forma controlada para crear campana y cargar/reemplazar/eliminar imagen.

Riesgos o pendientes:
- Queda una campana QA creada en ambiente publicado:
  - `QA TASK-676 imagen 202607020338`
  - Sin imagen activa y sin envios reales.
- Compatibilidad amplia de WebP en clientes de correo queda como observacion futura si Product lo prioriza.
- Limpieza fisica de blobs reemplazados/eliminados queda fuera del alcance inmediato.

Decision:
- Cerrar release de imagen opcional en campanas como aprobado para uso controlado.
- Mantener envios promocionales reales bajo autorizacion explicita posterior.

Siguiente recomendado:
- Ejecutar `TASK-678` para commit controlado de handoffs de cierre.
