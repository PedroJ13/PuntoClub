Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Diagnostico imagen campana
Tarea completada: TASK-690 - Confirmar estado real de imagen para campana TEST Imagen

Resultado:
- Se reviso Azure SQL publicado en modo read-only.
- No se enviaron correos.
- No se modificaron datos de negocio.
- No se cambio API, Web, SQL schema, ACS, flags ni storage.

Campana revisada:
- `companyId=8`
- `campaignId=10`
- `name=TEST Imagen`
- `subject=TEST Imagen`
- `campaignStatus=sent`
- `campaignCreatedAt=2026-07-02T04:04:19Z`
- `campaignUpdatedAt=2026-07-02T14:03:41Z`

Hallazgo principal:
- La campana existe.
- No existe registro asociado en `dbo.PromotionalCampaignImages` para `company_id=8` y `campaign_id=10`.
- No existe imagen activa para esa campana.
- No hay `publicId`.
- No hay `imageUrl` posible hacia `/api/public/promotional-campaign-images/{publicId}`.
- Por contrato actual, `GET campaign`, `preview` y envio no pueden incluir imagen porque `getActivePromotionalCampaignImage(8, 10)` no encuentra fila `status='active'`.

Consulta adicional:
- Se buscaron campanas de la misma empresa con `name='TEST Imagen'` o `subject='TEST Imagen'`.
- Solo aparecio `campaignId=10`.
- No se encontro evidencia de que la imagen este asociada a otra campana con ese mismo nombre/asunto dentro de `companyId=8`.

Interpretacion:
- El problema no parece ser que la API oculte una imagen activa existente.
- El estado real publicado es: campana sin metadata de imagen.
- Posibles causas fuera de este diagnostico:
  - la imagen nunca se subio/guardo para esa campana;
  - se intento subir pero fallo antes de persistir metadata;
  - se creo/envio la campana antes de asociar imagen;
  - la UI pudo haber mostrado preview local/blob antes de guardar, pero no quedo metadata activa en SQL.

Verificacion ejecutada:
- Revision de contrato local:
  - `api/src/lib/repository.js`
  - `api/src/functions/promotionalCampaigns.js`
  - `database/migrations/20260701_promotional_campaign_images.sql`
- Consulta read-only en Azure SQL:
  - `dbo.PromotionalCampaigns`
  - `dbo.PromotionalCampaignImages`
- Hora de consulta: `2026-07-02T14:27:58Z`.

Uso Azure SQL:
- Si.
- Motivo: la tarea pide confirmar estado real en ambiente publicado.
- Alcance: consultas read-only acotadas a `companyId=8`, `campaignId=10` y busqueda por `TEST Imagen`.

Firewall / acceso temporal:
- Se creo regla temporal:
  - `tmp-task690-campaign-image-200-229-6-68`
  - `200.229.6.68-200.229.6.68`
- Al finalizar, el delete fue bloqueado por lock del SQL Server.
- Se neutralizo la regla a:
  - `0.0.0.1-0.0.0.1`
- Verificacion final:
  - regla existe neutralizada con `start=0.0.0.1`, `end=0.0.0.1`.

Pendientes / siguiente recomendado:
- Si el PO esperaba imagen en esa campana, crear tarea Web/API para revisar flujo de subida antes de envio o repetir upload controlado en una campana editable.
- Si se necesita limpiar la regla neutralizada, Infra debe retirar temporalmente el lock y borrar `tmp-task690-campaign-image-200-229-6-68`.
