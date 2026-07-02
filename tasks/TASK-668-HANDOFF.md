Equipo: Infra
Modo de ejecucion: Storage / Email assets
Tarea completada: TASK-668 - Preparar storage privado para imagenes de campanas

Resultado:
- Se creo/configuro el contenedor privado `campaign-assets` en el storage account existente `stpuntoclublogosbr001`.
- No se habilito public access.
- No se tocaron secretos.
- No se cambio sender ACS.
- No se cambio SQL ni API publicada.

Configuracion aplicada:
- Storage account:
  - `stpuntoclublogosbr001`
- Contenedor:
  - `campaign-assets`
- Resultado de creacion:
  - `created=true`
- Public access:
  - `null` / privado
- Lease state:
  - `available`
- Immutability policy:
  - `false`
- Legal hold:
  - `false`

RBAC confirmado:
- Function App:
  - `func-puntoclub-prod-br-001`
- Managed Identity:
  - `SystemAssigned`
- Principal ID:
  - `33a788be-2637-4b8c-a780-16c47d72d8b4`
- Rol encontrado:
  - `Storage Blob Data Contributor`
- Scope:
  - storage account `stpuntoclublogosbr001`
- Interpretacion:
  - La Function App puede leer/escribir blobs en `campaign-assets` sin connection string nuevo.

Prueba anonima:
- URL probada:
  - `https://stpuntoclublogosbr001.blob.core.windows.net/campaign-assets?restype=container&comp=list`
- Resultado:
  - `anonymousListStatus=409`
- Interpretacion:
  - El contenedor no lista contenido anonimamente.

Costos esperados:
- No se creo storage account nuevo.
- Costo esperado MVP: marginal.
- Drivers de costo:
  - MB almacenados en Blob Storage;
  - lecturas del proxy publico de imagen;
  - ancho de banda por aperturas de email;
  - operaciones de escritura/reemplazo.
- Con limite de 1 MB por imagen y MVP de destinatarios controlado, el impacto esperado es bajo.

Comandos/verificacion ejecutada:
- `az storage container create --account-name stpuntoclublogosbr001 --name campaign-assets --auth-mode login --public-access off --output json`
- `az storage container show --account-name stpuntoclublogosbr001 --name campaign-assets --auth-mode login ...`
- `az functionapp show --name func-puntoclub-prod-br-001 --resource-group resource_group_main ...`
- `az role assignment list --assignee 33a788be-2637-4b8c-a780-16c47d72d8b4 --scope ...`
- `curl.exe` anonimo contra list container.

Uso Azure SQL:
- No.

Riesgos o pendientes:
- P1: la migracion SQL de metadata todavia no esta aplicada en Azure SQL.
- P1: API publicada aun no usa este contenedor hasta deploy posterior.
- P2: el rol RBAC esta a nivel storage account; si se requiere menor privilegio, crear tarea para bajar scope al contenedor.
- P2: limpieza fisica de blobs reemplazados/eliminados queda para tarea posterior; el MVP revoca por metadata.

Siguiente recomendado:
- SQL DEV: aplicar migracion cuando Product / Architect / Release apruebe release.
- Backend/API: publicar endpoints de imagen.
- QA: validar que el render publico solo sirve imagenes activas por `publicId` opaco.
