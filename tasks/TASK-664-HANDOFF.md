Equipo: Infra
Modo de ejecucion: Storage / Email assets
Tarea completada: TASK-664 - Definir almacenamiento seguro para imagenes de campanas

Resultado:
- Se definio estrategia recomendada de storage para imagenes opcionales de campanas promocionales, continuando desde `TASK-656`.
- No se crearon recursos.
- No se cambio configuracion de Azure.
- No se tocaron secretos, SQL, API, Web, ACS ni flags.

Decision recomendada:
- Reutilizar el storage account existente de logos:
  - `stpuntoclublogosbr001`
- No mezclar assets de campanas dentro del contenedor `company-logos`.
- Crear en tarea posterior aprobada un contenedor privado separado:
  - `campaign-assets`
- Mantener blobs privados y servir imagenes de email mediante un proxy publico controlado por API con identificador opaco.

Motivo:
- Los clientes de correo no tendran cookie ni sesion de empresa.
- Una URL autenticada no renderizaria correctamente dentro del email.
- Un contenedor publico expone superficie innecesaria.
- SAS largos dentro de correos son fragiles por expiracion, reenvios y control de revocacion.
- Un proxy publico con `publicId` no enumerable permite que el blob siga privado y que una imagen se revoque cambiando estado en metadata.

Arquitectura propuesta:
- Storage:
  - account: `stpuntoclublogosbr001`
  - container: `campaign-assets`
  - public blob access: disabled/private
  - acceso desde Function App por Managed Identity/RBAC
- Naming de blob:
  - `companies/{companyId}/campaigns/{campaignId}/images/{imageId}.{ext}`
- URL publica usable en emails:
  - `/api/public/promotional-campaign-images/{publicId}`
- `publicId`:
  - UUID/ULID generado server-side.
  - No debe incluir nombre de cliente, correo, asunto de campana ni informacion sensible.

Permisos:
- Mantener HTTPS only y TLS minimo actual del storage.
- Mantener contenedor privado.
- Function App conserva o recibe RBAC para escribir/leer blobs:
  - `Storage Blob Data Contributor`.
- Si se busca menor privilegio, bajar scope al contenedor `campaign-assets` en una tarea separada.
- Frontend no debe recibir SAS, connection strings, account keys ni blob paths internos.

Limites MVP recomendados:
- Tamano maximo:
  - `1048576` bytes (1 MB), alineado con logos y con `TASK-656`.
- Tipos permitidos:
  - `image/jpeg`
  - `image/png`
  - `image/webp` solo si Backend/QA confirma compatibilidad aceptable.
- Tipos rechazados:
  - SVG, GIF, HEIC, BMP, PDF, ZIP, HTML/XML/script.
- Validacion esperada:
  - MIME declarado.
  - extension.
  - magic bytes/firma real del archivo.
  - tamano mayor que 0.

Cache y revocacion:
- El proxy publico puede usar:
  - `Cache-Control: public, max-age=86400`
- Cada reemplazo debe generar nuevo blob y nuevo `publicId`.
- Imagenes eliminadas/reemplazadas no deben servirse por el proxy.

Limpieza:
- Reemplazo:
  - marcar metadata anterior como `replaced`.
  - crear nueva imagen `active`.
  - borrar blob anterior best-effort o conservarlo hasta 7 dias para rollback.
- Eliminacion:
  - marcar metadata como `deleted`.
  - borrar blob best-effort.
- Limpieza diferida:
  - job posterior/manual para blobs `replaced/deleted` con mas de 7 dias.

Costos:
- No se recomienda crear un storage account nuevo.
- Para piloto/MVP el costo esperado es marginal:
  - pocos MB almacenados;
  - pocas transacciones;
  - bajo ancho de banda por limite MVP de destinatarios.
- Riesgo de costo aparece con campanas masivas, imagenes grandes, alto numero de aperturas o CDN/procesamiento futuro.
- Antes de escalar, revisar precios vigentes de Azure Blob Storage, bandwidth y Azure Functions.

Verificacion ejecutada:
- Revision local/documental de:
  - `AGENTS.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `chat-start/INFRA.md`
  - `tasks/TASK-193-HANDOFF.md`
  - `tasks/TASK-656-HANDOFF.md`

Uso Azure SQL:
- No.

Riesgos o pendientes:
- P1: no usar URL directa de blob privado en email porque no renderizaria.
- P1: no habilitar public access del contenedor sin decision explicita.
- P1: no aceptar SVG.
- P2: el proxy publico debe ser no enumerable y no listar assets.
- P2: clientes de email pueden cachear imagenes; por eso reemplazo debe crear `publicId` nuevo.

Siguiente recomendado:
- Product / Architect / Release decide si aprueba:
  - contenedor privado `campaign-assets`;
  - proxy publico opaco;
  - limite 1 MB.
- Luego Infra puede crear/configurar contenedor y app settings en tarea separada.
