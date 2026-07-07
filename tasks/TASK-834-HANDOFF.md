Equipo: Backend/API
Modo de ejecucion: Logo empresa / Diagnostico persistencia
Tarea completada: TASK-834 - Diagnosticar perdida de logo al refrescar Mi empresa

Resultado:
- Diagnosticada la causa probable de perdida visual del logo al refrescar Mi empresa.
- `POST /api/my-company/logo` si persiste metadata mediante `updateCompanyLogo`:
  - `logo_blob_path`;
  - `logo_content_type`;
  - `logo_updated_at`;
  - `updated_at`.
- El problema estaba en el contrato consumido por Web para refrescar Mi empresa:
  - Web llama `GET /api/companies/{companyId}/settings`;
  - `getCompanySettings` no leia `logo_blob_path`, `logo_content_type` ni `logo_updated_at`;
  - `mapCompanySettings` devolvia `logoUrl` desde `logo_url` legacy, por lo que el logo privado no reaparecia tras refresh.
- Corregido `getCompanySettings` para leer metadata privada del logo.
- Corregido `mapCompanySettings` para devolver:
  - `logoUrl: "/api/my-company/logo"` cuando existe `logo_blob_path`;
  - `logoContentType`;
  - `logoUpdatedAt`.
- Corregido `updateCompanySettings` para preservar esos campos en la respuesta cuando se actualizan datos de empresa.
- No se cambio SQL.
- No se cambio Storage.
- No se cambio ACS, sender ni flags.
- No se borraron ni reemplazaron logos reales.

Archivos cambiados:
- `api/src/lib/repository.js`
- `api/test/repository-formatters.test.js`
- `tasks/TASK-834-HANDOFF.md`

Validaciones:
- `node --check api/src/lib/repository.js`
- `node --check api/test/repository-formatters.test.js`
- `node --test api/test/repository-formatters.test.js`
- `npm --prefix api test`
- `npx prettier --check api/src/lib/repository.js api/test/repository-formatters.test.js app/src/app.js`
- `git diff --check`

Resultado de validaciones:
- Sintaxis OK.
- Test focal repository formatters: 18/18 pass.
- Suite API completa: 180/180 pass.
- Prettier OK.
- `git diff --check` sin errores; solo avisos LF/CRLF.

Uso Azure SQL:
- No para completar la correccion Backend.
- Motivo: el bug fue identificable por codigo/contrato y cubierto con tests locales.

Limitacion:
- No se reprodujo subida real publicada/local con credenciales de empresa para no reemplazar logos reales.
- La validacion SQL real de Aurisbel quedo separada en TASK-835 y bloqueada por firewall.
