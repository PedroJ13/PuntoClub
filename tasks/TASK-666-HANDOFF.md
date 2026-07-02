Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Imagen campana
Tarea completada: TASK-666 - Disenar contratos API para imagen de campana promocional

Resultado:
- Se definieron contratos API propuestos para imagen opcional de campana promocional, continuando desde `TASK-656`.
- No se implemento codigo.
- No se cambiaron endpoints existentes.
- No se activo ni desactivo ningun flag.
- No se enviaron correos.

Endpoints privados propuestos:

```text
GET /api/companies/{companyId}/promotional-campaigns/{campaignId}/image
POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/image
DELETE /api/companies/{companyId}/promotional-campaigns/{campaignId}/image
```

Endpoint publico de render para email:

```text
GET /api/public/promotional-campaign-images/{publicId}
```

Autorizacion:
- Endpoints privados:
  - requieren sesion de empresa.
  - empresa efectiva debe venir del contexto de sesion.
  - si `companyId` de ruta no coincide con sesion, devolver 403.
  - sin sesion, devolver 401.
  - no permitir leer/escribir imagen de otra empresa.
- Endpoint publico:
  - no requiere sesion porque lo consumen clientes de email.
  - solo sirve imagenes `active`.
  - no lista assets ni revela blob path, storage account, stack trace o metadata interna.

GET privado:
- Devuelve metadata de imagen activa o `image: null`.
- Respuesta sugerida:

```json
{
  "image": {
    "id": "123",
    "campaignId": "456",
    "fileName": "promo-julio.png",
    "contentType": "image/png",
    "sizeBytes": 534221,
    "altText": "Promocion de julio",
    "imageUrl": "https://func-puntoclub-prod-br-001.azurewebsites.net/api/public/promotional-campaign-images/{publicId}",
    "status": "active",
    "uploadedAt": "2026-07-01T18:00:00Z",
    "updatedAt": "2026-07-01T18:00:00Z"
  }
}
```

POST privado:
- `multipart/form-data`.
- Campos:
  - `file`: requerido.
  - `altText`: opcional, maximo 160 caracteres.
- Comportamiento:
  - primera carga crea imagen activa.
  - carga posterior reemplaza: marca anterior `replaced`, crea nueva `active`.
  - genera blob path y `publicId` server-side.
  - no acepta URL externa.

DELETE privado:
- Marca imagen activa como `deleted`.
- Borra blob best-effort.
- El proxy publico deja de servir ese `publicId`.

Validaciones server-side:
- Archivo requerido.
- Maximo 1 MB.
- MIME permitido:
  - `image/jpeg`
  - `image/png`
  - `image/webp` si se confirma compatibilidad.
- Rechazar:
  - SVG, GIF, HEIC, BMP, PDF, ZIP, HTML/XML/script.
- Validar:
  - extension;
  - MIME declarado;
  - magic bytes;
  - tamano mayor que 0;
  - campana existe y pertenece a empresa de sesion.
- Recomendacion:
  - permitir cambios solo en campanas `draft` o `ready`, no `sending`, `sent` ni `cancelled`.

Errores controlados sugeridos:
- `AUTHENTICATION_REQUIRED` - 401.
- `FORBIDDEN` - 403.
- `PROMOTIONAL_CAMPAIGN_NOT_FOUND` - 404.
- `PROMOTIONAL_CAMPAIGN_IMAGE_NOT_FOUND` - 404.
- `PROMOTIONAL_CAMPAIGN_IMAGE_REQUIRED` - 400.
- `PROMOTIONAL_CAMPAIGN_IMAGE_UNSUPPORTED_TYPE` - 400.
- `PROMOTIONAL_CAMPAIGN_IMAGE_TOO_LARGE` - 413.
- `PROMOTIONAL_CAMPAIGN_IMAGE_INVALID` - 400.
- `PROMOTIONAL_CAMPAIGN_NOT_EDITABLE` - 409.
- `PROMOTIONAL_CAMPAIGN_IMAGE_STORAGE_FAILED` - 500/502 controlado sin detalles internos.

Integracion con email promocional:
- Preview y envio consultan imagen activa de la campana.
- HTML email:
  - incluir imagen debajo del encabezado/marca y antes o cerca del cuerpo principal.
  - usar `src` con `imageUrl` del proxy publico.
  - usar `altText` o nombre de campana como `alt`.
  - mantener ancho maximo compatible con email.
- Texto plano:
  - no depender de imagen.
  - no es obligatorio incluir URL cruda.
- No cambiar:
  - seleccion manual de destinatarios;
  - bajas promocionales;
  - limite MVP de 5;
  - feature flag de envio.

Pruebas recomendadas al implementar:
- Upload sin sesion -> 401.
- Upload companyId ajeno -> 403.
- Upload SVG -> error controlado.
- Upload mayor a 1 MB -> 413.
- Reemplazo deja una sola imagen activa.
- DELETE revoca render publico.
- Email HTML incluye imagen si existe.
- Email sin imagen sigue funcionando.

Archivos cambiados:
- Solo este handoff:
  - `tasks/TASK-666-HANDOFF.md`

Verificacion ejecutada:
- Revision local/documental de:
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `chat-start/BACKEND_API.md`
  - `tasks/TASK-656-HANDOFF.md`
  - `database/migrations/20260629_promotional_campaigns_mvp.sql`

Uso Azure SQL:
- No.

Riesgos o pendientes:
- P1: endpoint autenticado no sirve como `src` de email.
- P1: ids publicos predecibles podrian exponer assets.
- P1: aceptar URL externa abre riesgo de tracking/contenido no controlado.
- P2: si se requiere auditoria exacta de imagen enviada, coordinar snapshot con SQL DEV.

Siguiente recomendado:
- Esperar decision sobre storage/modelo SQL.
- Implementar en tarea Backend/API separada con tests, sin cambiar reglas de envio.
