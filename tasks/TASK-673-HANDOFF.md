Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-673 - Decidir publicacion de imagen opcional en campanas

Resultado:
- Se revisaron `TASK-656` y `TASK-664` a `TASK-672`.
- Se aprueba avanzar con release de imagen opcional en campanas promocionales.
- La secuencia aprobada es:
  1. Aplicar migracion SQL en Azure SQL.
  2. Publicar API/Web.
  3. Ejecutar QA Web publicado sin enviar correos reales.

Decision:
- Aprobar aplicacion de la migracion SQL `database/migrations/20260701_promotional_campaign_images.sql`.
- Aprobar publicacion posterior de API/Web si la migracion queda aplicada y verificada.
- No enviar correos reales durante release.
- No activar ni desactivar feature flags durante release.

Confirmaciones de alcance:
- Storage listo:
  - `TASK-668` creo/configuro contenedor privado `campaign-assets` en `stpuntoclublogosbr001`.
  - Public access no fue habilitado.
  - Function App `func-puntoclub-prod-br-001` tiene Managed Identity con `Storage Blob Data Contributor` a nivel storage account.
- SQL listo local:
  - `TASK-669` creo migracion local versionada `database/migrations/20260701_promotional_campaign_images.sql`.
  - La migracion crea `dbo.PromotionalCampaignImages`, constraints e indices.
  - No guarda binarios en SQL.
- Backend/API listo local:
  - `TASK-670` implemento endpoints privados de imagen y endpoint publico opaco.
  - Integro imagen activa en preview y HTML de correo promocional.
  - Valida tipo, extension, magic bytes y tamano maximo 1 MB.
- Web listo local:
  - `TASK-671` implemento UI para agregar, previsualizar, reemplazar y eliminar imagen.
  - Preview colapsable muestra imagen cuando existe.
- QA local aprobado:
  - `TASK-672` aprobo local/mock con observaciones.
  - Tests API relacionados pasaron con `162` tests passed, `0` failed.
  - No hubo P0/P1/P2/P3 de producto.

Reglas de release:
- No publicar API antes de aplicar la migracion SQL.
- No enviar correos reales durante la publicacion.
- No cambiar sender ACS.
- No cambiar secretos.
- No habilitar public access del contenedor.
- No guardar binarios en SQL.
- Excluir `debug.log`.

Riesgos aceptados:
- QA local no uso storage real ni ACS.
- Selector nativo de archivo no fue operado manualmente por limitacion de herramienta; la ruta se cubrio con mock API local y tests server-side.
- WebP queda permitido tecnicamente, pero debe observarse compatibilidad real en clientes de correo.
- Limpieza fisica de blobs reemplazados/eliminados queda fuera del MVP inmediato.

Pendientes obligatorios antes de prueba PO:
- `TASK-674`: aplicar migracion SQL en Azure SQL y verificar tabla/indices.
- `TASK-675`: publicar API/Web y verificar workflows.
- `TASK-676`: QA Web publicado sin envio real.

Uso Azure SQL:
- No en esta tarea.
- Motivo: decision de release; la aplicacion real queda para `TASK-674`.

Siguiente recomendado:
- Ejecutar `TASK-674` con SQL DEV.
