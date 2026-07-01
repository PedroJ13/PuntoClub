Equipo: Backend/API
Tarea completada: TASK-608 - Exponer API de consulta de correos operativos

Archivos cambiados:
- `api/src/functions/operationalEmailHistory.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/operational-email-history.test.js`
- `api/package.json`

SQL agregado o modificado:
- Ninguno.
- Se agrego consulta read-only sobre tablas existentes:
  - `dbo.OperationalEmailEvents`
  - `dbo.OperationalEmailMessages`
  - `dbo.OperationalEmailAttempts`
  - `dbo.Customers`

Contrato API local:
- `GET /api/companies/{companyId}/operational-email-history`
- Requiere sesion autenticada de empresa.
- Valida que `companyId` de ruta coincida con la empresa de sesion.
- Filtros:
  - `from`: requerido, `YYYY-MM-DD`
  - `to`: requerido, `YYYY-MM-DD`
  - `type`: `welcome`, `purchase`, `redemption`, `all`
  - `status`: `pending`, `skipped`, `sent`, `failed`, `all`
  - `search`: opcional, cliente/email, max 254
  - `limit`: `10`, `25`, `50`
- Respuesta:
  - `filters`
  - `items[]` con `event`, `message`, `latestAttempt`, `customer`, `reason`

Seguridad:
- No expone secretos.
- No expone stack traces.
- No expone payload ACS completo.
- Sanitiza motivos tecnicos a codigos controlados:
  - `disabled_by_company_settings`
  - `customer_without_email`
  - `email_not_configured`
  - `provider_not_sent`
  - `send_failed`
- No permite consultar otra empresa usando solo `companyId` de ruta.

Verificacion ejecutada:
- `node --check api\src\functions\operationalEmailHistory.js`
- `node --check api\src\lib\validators.js`
- `node --check api\src\lib\repository.js`
- `node --test test\operational-email-history.test.js test\operational-emails.test.js`
- `npm test`

Resultado:
- Suite API completa aprobada: 159 tests pass.
- Tests nuevos cubren:
  - filtros validos;
  - tipo/rango invalido;
  - rechazo sin sesion;
  - rechazo si empresa de ruta no coincide con sesion;
  - uso correcto cuando ruta y sesion coinciden.

Uso Azure SQL:
- No.
- Motivo: esta tarea implemento contrato local y tests; no requirio consultar datos reales.

Riesgos o pendientes:
- Falta QA local con API levantada contra ambiente disponible si se quiere validar respuesta HTTP real.
- Falta deploy/publicacion en una tarea posterior.

Siguiente recomendado:
- QA local de endpoint autenticado con sesion de empresa y filtros basicos.
- Luego tarea de release si Product/Release decide publicar.
