Equipo:
SQL DEV

Tarea completada:
TASK-128 - Aplicar migracion SQL de registro de empresas e invitaciones.

Archivos cambiados:
- tasks/TASK-128-HANDOFF.md

SQL agregado o modificado:
- Aplicada en Azure SQL existente `sqlserver-pj13-brazil/sql-db-puntoclub` la migracion:
  - `database/migrations/20260607_company_registration_invitations.sql`
- Objetos creados/confirmados:
  - columnas nuevas en `dbo.Companies`:
    - `address`
    - `logo_blob_path`
    - `logo_content_type`
    - `logo_updated_at`
  - `dbo.CompanyRegistrationRequests`
  - `dbo.CompanyInvitations`
  - `dbo.CompanyUsers`
  - indices unicos/operativos principales de las tablas nuevas.
  - checks/FKs principales confiables.
  - checks de `dbo.OperationalAuditEvents` ampliados para registro, invitaciones, usuarios y logo.
- No se insertaron datos reales.
- No se crearon seeds productivos.
- No se modificaron passwords ni secretos.

Prevalidaciones ejecutadas:
- Emails duplicados en `dbo.Companies`: 0 filas.
- Statuses de `dbo.Companies` fuera de catalogo objetivo: 0 filas.
- Eventos existentes de `dbo.OperationalAuditEvents` fuera del catalogo ampliado: 0 filas.

Aplicacion:
- Intento inicial con `puntoclub_app_user` bloqueado por permisos:
  - `can_select_companies = 1`
  - `can_alter_companies = 0`
  - `can_create_table = 0`
  - No se aplico ningun batch con ese usuario.
- Intento con `sqlcmd` admin bloqueado por negociacion de cifrado del driver ODBC local; no aplico cambios.
- Aplicacion final realizada con cliente Node `mssql` y credenciales admin locales cargadas solo en memoria:
  - 23/23 batches ejecutados correctamente.

Verificacion ejecutada:
- Tablas presentes:
  - `CompanyRegistrationRequests`
  - `CompanyInvitations`
  - `CompanyUsers`
- Columnas de `dbo.Companies` presentes:
  - `address` nvarchar nullable
  - `logo_blob_path` nvarchar nullable
  - `logo_content_type` nvarchar nullable
  - `logo_updated_at` datetime2 nullable
- Indices principales presentes:
  - `UX_Companies_email`
  - `IX_CompanyRegistrationRequests_status_created`
  - `UX_CompanyRegistrationRequests_pending_company_email`
  - `UX_CompanyInvitations_token_hash`
  - `UX_CompanyInvitations_pending_company_email`
  - `IX_CompanyInvitations_company_status`
  - `IX_CompanyInvitations_email_status`
  - `UX_CompanyUsers_company_email`
  - `UX_CompanyUsers_auth_subject`
  - `IX_CompanyUsers_company_status`
- Constraints principales presentes, habilitados y confiables:
  - `CK_Companies_status`
  - `CK_Companies_logo_content_type`
  - `CK_CompanyRegistrationRequests_status`
  - `CK_CompanyRegistrationRequests_logo_content_type`
  - `CK_CompanyInvitations_role`
  - `CK_CompanyInvitations_status`
  - `CK_CompanyUsers_role`
  - `CK_CompanyUsers_status`
  - `CK_CompanyUsers_auth_provider`
  - `CK_OperationalAuditEvents_event_type`
  - `CK_OperationalAuditEvents_entity_type`
- FKs principales presentes, habilitadas y confiables:
  - `FK_CompanyRegistrationRequests_ApprovedCompany`
  - `FK_CompanyInvitations_Companies`
  - `FK_CompanyInvitations_RegistrationRequests`
  - `FK_CompanyUsers_Companies`
- Conteos posteriores:
  - `CompanyRegistrationRequests`: 0 filas.
  - `CompanyInvitations`: 0 filas.
  - `CompanyUsers`: 0 filas.
- Validacion especifica de auditoria:
  - `CK_OperationalAuditEvents_event_type` incluye `company.registration.submitted`.
  - `CK_OperationalAuditEvents_entity_type` incluye `company_invitation`.

Regla temporal usada:
- Nombre: `tmp-task128-sql-migration-200-229-6-103`
- Motivo: permitir conexion temporal desde la IP local `200.229.6.103` para ejecutar prevalidaciones y migracion.
- Alcance: SQL Server `sqlserver-pj13-brazil`, resource group `resource_group_main`.

Regla temporal retirada:
- Si.
- Verificacion posterior:
  - `az sql server firewall-rule list ... --query "[?name=='tmp-task128-sql-migration-200-229-6-103']"` devolvio `[]`.

Resultado:
Migracion de registro de empresas, invitaciones y usuarios aplicada y validada en Azure SQL real. Backend/API puede continuar con repositorios/endpoints contra el modelo real, manteniendo auth/mapeo server-side como requisito antes de habilitar operacion multiempresa.

Riesgos o pendientes:
- `puntoclub_app_user` no tiene permisos de migracion; esto es esperado para runtime, pero futuras migraciones requieren cuenta admin/operator o pipeline dedicado.
- `updated_at` de tablas nuevas debe mantenerlo Backend/API; no hay triggers SQL.
- La migracion no crea usuarios, invitaciones ni empresas nuevas.
- El modelo no activa multiempresa operativo por si solo; Backend/API debe resolver `companyId` desde Entra External ID + `CompanyUsers`, nunca desde frontend.
- QA debe validar aislamiento multiempresa cuando existan endpoints y auth reales.

Siguiente recomendado:
Backend/API puede continuar TASK-129 implementando endpoints base de solicitudes de empresa contra Azure SQL real. Infra/Release deberia mantener el patron de migraciones con usuario admin/operator separado del usuario runtime.
