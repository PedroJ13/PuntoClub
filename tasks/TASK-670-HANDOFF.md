Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Imagen campana
Tarea completada: TASK-670 - Implementar API de imagen opcional de campana

Archivos cambiados:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/campaignAssetStorage.js`
- `api/src/lib/logoStorage.js`
- `api/src/lib/repository.js`
- `api/test/logo-storage.test.js`
- `api/test/promotional-campaigns.test.js`
- `tasks/TASK-670-HANDOFF.md`

Implementacion:
- Se agrego libreria `campaignAssetStorage` para:
  - config de storage de campanas;
  - validacion MIME/tamano/extension/magic bytes;
  - build de blob path;
  - upload/download usando Managed Identity reutilizando patron de logos.
- Se agregaron endpoints privados:
  - `GET /api/companies/{companyId}/promotional-campaigns/{campaignId}/image`
  - `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/image`
  - `DELETE /api/companies/{companyId}/promotional-campaigns/{campaignId}/image`
- Se agrego endpoint publico opaco:
  - `GET /api/public/promotional-campaign-images/{publicId}`
- Se agregaron funciones repository para:
  - consultar imagen activa;
  - consultar por `publicId`;
  - reemplazar imagen activa;
  - marcar imagen como eliminada.
- Se integro imagen activa en:
  - preview promocional;
  - HTML de correo promocional.

Validaciones:
- Sesion de empresa obligatoria para endpoints privados.
- `companyId` de ruta debe coincidir con empresa de sesion.
- Campana debe pertenecer a la empresa.
- Cambio permitido solo en campanas `draft` o `ready`.
- Maximo 1 MB.
- Permitidos:
  - `image/png`
  - `image/jpeg`
  - `image/webp`
- Rechazados por validacion:
  - SVG y tipos no permitidos;
  - extension que no coincide;
  - magic bytes invalidos.

Seguridad:
- No se expone `blob_path` en contrato frontend.
- Render publico usa `publicId` UUID opaco.
- El endpoint publico no requiere sesion, pero solo sirve imagenes `active`.
- No se cambiaron reglas de envio promocional.
- No se cambiaron flags.
- No se enviaron correos reales.

Verificacion ejecutada:
- `node --check api\src\lib\campaignAssetStorage.js`
- `node --check api\src\lib\logoStorage.js`
- `node --check api\src\lib\repository.js`
- `node --check api\src\functions\promotionalCampaigns.js`
- `npm test -- --test-reporter=spec test/promotional-campaigns.test.js test/logo-storage.test.js`
- Nota: por el script actual de `package.json`, ese comando ejecuto el suite completo configurado.

Resultado pruebas:
- `162` tests passed.
- `0` failed.

Uso Azure SQL:
- No.
- Motivo: implementacion local y tests unitarios; la migracion de metadata no fue aplicada.

Riesgos o pendientes:
- P1: no publicar API antes de aplicar `database/migrations/20260701_promotional_campaign_images.sql` en Azure SQL.
- P2: DELETE marca metadata como `deleted`; limpieza fisica de blobs reemplazados/eliminados queda pendiente como tarea posterior.
- P2: si no existe `PUBLIC_API_BASE_URL`, el HTML de email puede usar ruta relativa en ambientes no configurados. Para produccion conviene confirmar app setting.

Siguiente recomendado:
- SQL DEV aplica migracion en Azure SQL cuando se apruebe release.
- Infra confirma app setting `PUBLIC_API_BASE_URL` si se publicara envio con imagen.
- QA valida negativos de upload y render publico.
