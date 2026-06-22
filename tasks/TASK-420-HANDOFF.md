# TASK-420 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: SQL DEV

Tarea completada:
- Migracion de reset de password aplicada en Azure SQL para habilitar `dbo.CompanyPasswordResets`.

Credencial usada:
- Sesion autenticada de Azure CLI con token Azure AD para `https://database.windows.net/`.
- No se uso `SQL_CONNECTION_STRING` runtime para DDL.
- No se encontro ni se creo `local-secrets/sql_admin.ps1`.
- No se imprimieron ni guardaron tokens, passwords, connection strings ni credenciales.

Migracion aplicada:
- `database/migrations/20260621_company_password_resets.sql`.

Validaciones SQL:
- Antes de aplicar: `dbo.CompanyPasswordResets` no existia.
- Despues de aplicar:
  - `table_exists`: 1
  - columnas: 11
  - checks: 1
  - foreign keys: 2
  - indices: 2
  - registros en `dbo.CompanyPasswordResets`: 0
- Validado que la migracion creo tabla, constraint de estado, FKs hacia empresa/usuario e indices esperados.

Datos afectados:
- No se modificaron usuarios, passwords, sesiones ni empresas existentes.
- Conteos antes/despues:
  - `CompanyUsers`: 4 / 4
  - `CompanySessions`: 29 / 29
  - `Companies`: 4 / 4

Firewall temporal:
- Se creo regla estrecha para la IP local: `tmp-task420-sql-migration-200-229-6-68`.
- Se retiro al finalizar.
- Verificacion posterior: la busqueda de la regla devolvio `[]`.

Uso DB cloud: Si, motivo: migracion SQL aprobada para reset de password, alcance: DDL de `dbo.CompanyPasswordResets` y validaciones cortas de metadata/conteos.

Datos sensibles expuestos: No

Riesgos o pendientes:
- Ningun pendiente SQL detectado para continuar con publicacion API.
- La validacion funcional publicada queda para TASK-421/TASK-422 y QA posterior.

Siguiente recomendado:
- Ejecutar TASK-421 para publicar API de cambio/reset de password y validar endpoints publicados con smoke no destructivo.
