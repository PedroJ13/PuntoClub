# TASK-193 - Handoff Infra / Azure

## Resumen

Se confirmo que el storage privado para logos de empresa esta listo para uso por Backend/API.

Resultado: completado.

Fecha/hora:

- `2026-06-09 09:08 -06:00`

No se hicieron cambios en Azure, codigo, SQL, pipeline ni secretos.

## Storage confirmado

Storage account:

- Nombre: `stpuntoclublogosbr001`
- Resource group: `resource_group_main`
- Tipo: `StorageV2`
- SKU: `Standard_LRS`
- Region: `brazilsouth`
- Provisioning: `Succeeded`
- HTTPS only: `true`
- Minimum TLS: `TLS1_2`
- Public blob access: `false`

Container:

- Nombre: `company-logos`
- Public access: `null` / privado
- Lease state: `available`
- Immutability policy: `false`
- Legal hold: `false`

Prueba anonima:

- Request anonimo a list container:
  - `GET https://stpuntoclublogosbr001.blob.core.windows.net/company-logos?restype=container&comp=list`
- Resultado:
  - `status=409`
  - no listo ningun contenido
  - `x-ms-request-id` presente, redaccionado

Interpretacion:

- El contenedor no lista blobs de forma anonima.
- El storage account no permite public blob access.
- No se debe exponer URL directa de blob como contrato publico.

## Acceso seguro desde Function App

Function App:

- Nombre: `func-puntoclub-prod-br-001`
- Managed Identity: `SystemAssigned`
- Principal ID: `33a788be-2637-4b8c-a780-16c47d72d8b4`

RBAC confirmado:

- Principal: Managed Identity de `func-puntoclub-prod-br-001`
- Role: `Storage Blob Data Contributor`
- Scope: storage account `stpuntoclublogosbr001`

Esto permite a Backend/API leer/escribir blobs usando Managed Identity, sin connection string de logos.

## App settings de logos

Presentes en Function App:

```text
LOGO_STORAGE_ACCOUNT=stpuntoclublogosbr001
LOGO_CONTAINER=company-logos
LOGO_MAX_BYTES=1048576
LOGO_ALLOWED_MIME_TYPES=image/png,image/jpeg,image/webp
LOGO_SERVE_MODE=api
```

No presente:

```text
LOGO_STORAGE_CONNECTION_STRING
```

Interpretacion:

- La ruta esperada es Managed Identity + RBAC.
- No hay connection string especifica para logos que Backend deba leer.
- No se imprimieron connection strings, account keys ni SAS.

## Recomendacion para Backend/API

Ruta recomendada:

1. Upload via API autenticada.
2. API deriva `companyId` desde sesion, no desde frontend.
3. API valida archivo server-side:
   - maximo `1048576` bytes;
   - MIME permitido: `image/png`, `image/jpeg`, `image/webp`;
   - rechazar SVG;
   - confirmar extension/contenido de forma conservadora.
4. API genera blob path server-side, por ejemplo:
   - `companies/{companyId}/logo/{uuid}.{ext}`
5. API sube a `stpuntoclublogosbr001/company-logos` con Managed Identity.
6. SQL guarda solo metadata controlada:
   - `logo_blob_path`;
   - `logo_content_type`;
   - `logo_updated_at`.
7. Serving:
   - `LOGO_SERVE_MODE=api`;
   - servir via endpoint API autenticado, por ejemplo `GET /api/my-company/logo`;
   - no devolver URL directa publica de blob;
   - no usar SAS largo ni persistente.

Contrato ya alineado:

- `docs/API_CONTRACTS.md` define:
  - `POST /api/my-company/logo`
  - `GET /api/my-company/logo`
  - `logoUrl` controlada como `/api/my-company/logo`

## Seguridad

- No se imprimieron secretos.
- No se imprimieron connection strings.
- No se imprimieron keys ni SAS.
- No se cambio configuracion de Azure.
- No se habilito public access.
- No se expusieron blobs ni rutas privadas reales.

## Riesgos / notas

- P1: Backend/API debe validar MIME/tamano/contenido; storage privado no reemplaza validacion de archivo.
- P1: No guardar ni aceptar `logoUrl` editable del frontend para el nuevo flujo privado.
- P1: No servir blobs anonimos ni habilitar public access del storage/container.
- P2: El storage account tiene network default action `Allow`; esto no hace publicos los blobs, pero una postura mas estricta futura podria evaluar Private Endpoint o restricciones de red. Para el piloto actual, Managed Identity + contenedor privado + public blob access disabled es suficiente.
- P2: El rol `Storage Blob Data Contributor` esta asignado a nivel storage account. Si se requiere minimo privilegio mas estricto, bajar scope al contenedor en tarea separada.

## Pendientes

- Backend/API TASK-194:
  - implementar upload/serving con Managed Identity;
  - agregar dependencia/cliente de Blob Storage si hace falta;
  - no requerir `LOGO_STORAGE_CONNECTION_STRING`.
- Web Dev TASK-195:
  - conectar UI de `Mi empresa` a endpoints de logo privado.
- QA TASK-196:
  - validar logo publicado;
  - confirmar que URL anonima de blob no funciona;
  - confirmar que logout/login conserva logo visible para la empresa autenticada.
