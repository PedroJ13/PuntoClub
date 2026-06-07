Equipo:
Backend API

Tarea completada:
TASK-108 - Implementar API de configuracion de empresa piloto.

Archivos cambiados:
- api/src/functions/companies.js
- api/src/lib/repository.js
- api/src/lib/validators.js
- api/test/repository-formatters.test.js
- api/test/validators.test.js
- docs/API_CONTRACTS.md
- docs/TASK_BOARD.md
- tasks/TASK-108-HANDOFF.md

Contrato final:
- `GET /api/companies/{companyId}/settings` se mantiene con el formato existente.
- `PATCH /api/companies/{companyId}/settings` actualiza parcialmente la configuracion de la empresa piloto.
- Campos aceptados:
  - `name`
  - `email`
  - `phone`
  - `logoUrl`
  - `pointsPercentage`
- Campos omitidos conservan su valor actual.
- `email`, `phone` y `logoUrl` pueden enviarse como `null` o texto vacio para limpiarlos.
- Respuesta `200`: mismo formato que `GET /settings`.
- `pointsPercentage` afecta solo compras futuras; no recalcula historicos.

Validaciones implementadas:
- `companyId` del path debe coincidir con `PILOT_COMPANY_ID`; si no, `404 COMPANY_NOT_FOUND`.
- Body debe ser JSON valido.
- Debe enviarse al menos un campo editable.
- `name`: no vacio si se envia, maximo 160 caracteres.
- `email`: opcional, formato email, maximo 254 caracteres.
- `phone`: opcional, entre 7 y 32 caracteres si se provee.
- `logoUrl`: opcional, URL `http(s)` valida, maximo 2048 caracteres.
- `pointsPercentage`: numero mayor que 0 y menor o igual que 100.

Persistencia:
- `PATCH /settings` ejecuta `UPDATE dbo.Companies`.
- Actualiza explicitamente `updated_at = SYSUTCDATETIME()` cuando hay cambios reales.
- Si el PATCH no cambia valores reales, responde `200` con la configuracion actual y no actualiza `updated_at`.
- No requiere migracion sobre `dbo.Companies`; TASK-107 confirmo columnas existentes.

Auditoria:
- Si hay cambios reales, registra auditoria best-effort:
  - `event_type`: `company.settings.updated`
  - `entity_type`: `company`
  - `entity_id`: companyId
  - `customer_id`: null
  - `metadata.changedFields`: campos cambiados
  - `metadata.requestId`: invocationId si esta disponible
  - `metadata.affectsPurchases`: `future_only`
- El registro es best-effort: si falla, el PATCH no falla.
- Para que el evento persista en SQL, debe estar aplicada la migracion de TASK-112 que amplia checks de auditoria para `company.settings.updated` y `entity_type=company`.

Pruebas:
- `npm test` desde `api/`.
- Resultado: 23/23 tests pasando.
- Nota: primer intento dentro del sandbox fallo por `spawn EPERM`; se repitio con permiso elevado y paso.

Validacion local Azure Functions:
- No se ejecuto `func start` porque la tarea no requeria validar Azure Functions local; el cambio quedo cubierto con pruebas unitarias y contrato.

Pendientes:
- Deploy de API para publicar `PATCH /settings`.
- Aplicar/desplegar TASK-112 antes de esperar auditoria persistida para cambios de settings.
- QA debe validar publicado despues del deploy API y de la migracion de auditoria.

Riesgos:
- Mientras TASK-112 no este aplicada, el PATCH funcionara, pero el evento `company.settings.updated` podria no quedar persistido por constraints SQL; el helper lo degradara a warning best-effort.
