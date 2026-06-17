# TASK-224 - Handoff SQL DEV / Data

Equipo: SQL DEV / Data

Modo de ejecucion: SQL DEV / Data

## Resultado

Completado con observacion.

No se preparo ni aplico migracion nueva porque el modelo versionado ya contempla el soporte minimo para logo en solicitud de empresa y transferencia a empresa aprobada.

No se borraron datos. No se imprimieron secretos.

## Modelo actual revisado

Se revisaron:

- `docs/DATA_MODEL.md`
- `database/migrations/20260607_company_registration_invitations.sql`
- `tasks/TASK-193-HANDOFF.md`
- `tasks/TASK-194-HANDOFF.md`
- `tasks/TASK-200-HANDOFF.md`
- `tasks/TASK-223-HANDOFF.md`

### `dbo.CompanyRegistrationRequests`

La migracion versionada ya define:

- `requested_logo_blob_path nvarchar(512) NULL`
- `requested_logo_content_type nvarchar(100) NULL`
- `CK_CompanyRegistrationRequests_logo_content_type`
  - permite `NULL`
  - permite `image/png`
  - permite `image/jpeg`
  - permite `image/webp`

Estos campos son suficientes para guardar una referencia temporal/controlada del logo subido durante la solicitud.

### `dbo.Companies`

La migracion versionada ya define:

- `logo_blob_path nvarchar(512) NULL`
- `logo_content_type nvarchar(100) NULL`
- `logo_updated_at datetime2(0) NULL`
- `CK_Companies_logo_content_type`
  - permite `NULL`
  - permite `image/png`
  - permite `image/jpeg`
  - permite `image/webp`

Estos campos ya son los usados por el logo privado de empresa en `Mi empresa`, aprobado por QA en TASK-200.

### Storage/referencia privada

TASK-193/TASK-194/TASK-200 confirman que el logo productivo usa:

- Storage privado `stpuntoclublogosbr001/company-logos`
- Managed Identity desde Azure Functions
- SQL guarda solo metadata/referencia
- API sirve logo por ruta controlada, no por blob publico

## Migracion aplicada o propuesta

No se aplico migracion nueva.

Motivo:

- La migracion existente `20260607_company_registration_invitations.sql` ya incluye los campos de solicitud requeridos.
- `Companies` ya tiene los campos de logo privado usados por el flujo publicado.
- Agregar otra migracion seria duplicado y aumentaria riesgo sin aportar capacidad nueva.

Observacion:

- Se intento verificar columnas directamente en Azure SQL, pero la regla temporal de TASK-221 ya fue retirada en TASK-222.
- Azure SQL rechazo la conexion desde `200.229.6.68` por firewall.
- No se solicita reabrir firewall dentro de esta tarea porque no se requiere aplicar SQL nuevo.

## Campos/contrato recomendado para Backend/API

### Al recibir solicitud publica con logo opcional

Backend/API debe:

- Aceptar `multipart/form-data` para `POST /api/company-registration-requests`.
- Mantener soporte JSON actual cuando no hay logo.
- Validar archivo con las mismas reglas de logo privado:
  - maximo `LOGO_MAX_BYTES`;
  - MIME `image/png`, `image/jpeg`, `image/webp`;
  - rechazar SVG;
  - validar magic bytes basicos.
- Generar blob path server-side, por ejemplo:
  - `registration-requests/{requestId}/logo/{uuid}.{ext}`
- Guardar en `CompanyRegistrationRequests`:
  - `requested_logo_blob_path`;
  - `requested_logo_content_type`.
- No devolver blob path, SAS ni URL publica en la respuesta publica.

### En listado interno de solicitudes

Backend/API puede devolver indicador seguro:

```json
{
  "requestedLogo": {
    "available": true,
    "contentType": "image/png"
  }
}
```

No devolver `requestedLogoBlobPath`.

### Al aprobar solicitud

Backend/API debe copiar o mover la referencia controlada:

- Desde:
  - `CompanyRegistrationRequests.requested_logo_blob_path`
  - `CompanyRegistrationRequests.requested_logo_content_type`
- Hacia:
  - `Companies.logo_blob_path`
  - `Companies.logo_content_type`
  - `Companies.logo_updated_at = SYSUTCDATETIME()`

Recomendacion:

- Si el blob ya esta en storage privado y el path es estable, basta copiar metadata SQL.
- Si se prefiere separar ubicaciones, Backend/API puede copiar blob a `companies/{companyId}/logo/{uuid}.{ext}` y luego guardar el nuevo path en `Companies`.
- En ambos casos, no exponer paths internos ni SAS.

## Validacion ejecutada

- Revision de migracion local versionada.
- Revision de handoffs de Infra/Backend/QA para logo privado.
- Intento de verificacion directa de columnas en Azure SQL:
  - Resultado: bloqueado por firewall tras retiro correcto de regla temporal.
  - No se imprimieron datos ni secretos.

## Riesgos o pendientes

- Pendiente que Backend/API confirme en pruebas que el ambiente publicado ya tiene las columnas de `CompanyRegistrationRequests`; por historial del proyecto, la migracion multiempresa fue aplicada antes de auth/logo.
- Si el ambiente publicado no tuviera esas columnas, Backend/API fallara al guardar logo de solicitud y debera pedir tarea SQL/Infra para aplicar la migracion existente.
- El flujo debe evitar URLs publicas de blob; solo metadata SQL y serving controlado.
