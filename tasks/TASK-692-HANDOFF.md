Equipo: QA
Modo de ejecucion: Comunicaciones / Prueba controlada imagen antes de envio
Tarea completada: TASK-692 - Validar campana editable con imagen antes de envio

Resultado QA:
- No aprobado completo en ambiente publicado.
- Motivo: no hay sesion/credenciales PO disponibles en este chat para crear una campana real editable en `companyId=8` y recargar la pantalla contra API publicada.
- No se enviaron correos reales.
- No se modificaron datos reales.

Validacion local/estatica ejecutada:
- Se confirmo por codigo que el upload real usa:
  - `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/image`
  - `credentials: include`
  - `FormData` con campo `file`.
- Se confirmo por codigo que el preview usa `image.imageUrl` y `api.getCampaignImageUrl(image.imageUrl)`, por lo que una imagen persistida debe renderizar desde `/api/public/promotional-campaign-images/{publicId}`.
- Se valido que TASK-691 evita falso positivo:
  - si la imagen esta solo seleccionada localmente y no subida, el boton `Enviar campaña` queda deshabilitado;
  - el usuario ve `Guarda la imagen`;
  - no se permite avanzar asumiendo que el preview `blob:` local ya esta guardado.

Checks ejecutados:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- `git diff --check`

Casos QA pendientes en ambiente publicado:
- Crear campana nueva editable.
- Subir imagen valida.
- Confirmar `Imagen agregada`.
- Confirmar preview con URL publica.
- Recargar pantalla.
- Confirmar persistencia de imagen.
- Confirmar que no se envia correo real.

Uso Azure SQL:
- No.
- Motivo: no se ejecuto prueba publicada ni se crearon datos reales por falta de sesion/credenciales PO.

Severidad / estado:
- P1 pendiente de validacion publicada: confirmar persistencia real de imagen despues de recarga.
- Sin P0 confirmado en codigo local.

Siguiente recomendado:
- Ejecutar QA publicado con credenciales PO o sesion controlada de empresa.
- No habilitar/envio real durante esta prueba.
