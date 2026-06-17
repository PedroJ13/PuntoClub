# TASK-235 - Handoff SQL DEV / Data

Equipo: SQL DEV / Data

Modo de ejecucion: SQL DEV / Data

## Resultado

Completado.

Se limpio la base funcional `sql-db-puntoclub` para iniciar una prueba desde cero:

- `0` empresas.
- `0` usuarios/sesiones/invitaciones/solicitudes.
- `0` clientes/compras/redenciones.
- `0` eventos de auditoria operativa y limites auth.

No se borraron tablas, constraints, indices, vistas, stored procedures, migraciones, usuarios SQL, configuracion Azure ni secretos. No se borraron blobs fisicos de logos en Storage.

## Conteos antes/despues

| Tabla | Antes | Despues |
| --- | ---: | ---: |
| `dbo.Companies` | 1 | 0 |
| `dbo.CompanyUsers` | 1 | 0 |
| `dbo.CompanySessions` | 0 | 0 |
| `dbo.CompanyInvitations` | 0 | 0 |
| `dbo.CompanyRegistrationRequests` | 9 | 0 |
| `dbo.Customers` | 0 | 0 |
| `dbo.Purchases` | 0 | 0 |
| `dbo.Redemptions` | 0 | 0 |
| `dbo.OperationalAuditEvents` | 0 | 0 |
| `dbo.AuthAttemptLimits` | 3 | 0 |

## SQL ejecutado

Resumen seguro del procedimiento:

1. Se confirmo acceso SQL a `sql-db-puntoclub` despues de TASK-236.
2. Se ejecutaron conteos iniciales de las tablas del alcance.
3. Se revisaron las FKs relevantes antes de borrar.
4. Se ejecuto limpieza dentro de transaccion con `XACT_ABORT ON`.
5. Se usaron opciones ANSI requeridas por SQL Server para tablas con indices filtrados.
6. Se eliminaron datos en orden seguro:
   - `dbo.CompanySessions`
   - `dbo.AuthAttemptLimits`
   - `dbo.CompanyInvitations`
   - `dbo.CompanyRegistrationRequests`
   - `dbo.OperationalAuditEvents`
   - `dbo.Redemptions`
   - `dbo.Purchases`
   - `dbo.Customers`
   - `dbo.CompanyUsers`
   - `dbo.Companies`
7. Se ejecutaron conteos finales.

Filas afectadas por operacion:

| Operacion | Filas |
| --- | ---: |
| `DELETE dbo.CompanySessions` | 0 |
| `DELETE dbo.AuthAttemptLimits` | 3 |
| `DELETE dbo.CompanyInvitations` | 0 |
| `UPDATE dbo.CompanyRegistrationRequests approved_company_id NULL` | 0 |
| `DELETE dbo.CompanyRegistrationRequests` | 9 |
| `DELETE dbo.OperationalAuditEvents` | 0 |
| `DELETE dbo.Redemptions` | 0 |
| `DELETE dbo.Purchases` | 0 |
| `DELETE dbo.Customers` | 0 |
| `DELETE dbo.CompanyUsers` | 1 |
| `DELETE dbo.Companies` | 1 |

## Validacion posterior

Validacion completada con conteos finales:

- `dbo.Companies`: `0`
- `dbo.CompanyUsers`: `0`
- `dbo.CompanySessions`: `0`
- `dbo.CompanyInvitations`: `0`
- `dbo.CompanyRegistrationRequests`: `0`
- `dbo.Customers`: `0`
- `dbo.Purchases`: `0`
- `dbo.Redemptions`: `0`
- `dbo.OperationalAuditEvents`: `0`
- `dbo.AuthAttemptLimits`: `0`

La estructura de DB quedo intacta.

## Firewall temporal

TASK-236 creo la regla temporal:

- `tmp-task235-sql-cleanup-200-229-6-68`

La regla sigue pendiente de retiro por TASK-237.

## Riesgos o pendientes

- Retirar la regla temporal de firewall en TASK-237.
- La limpieza SQL no elimina blobs fisicos de logos en Storage, por instruccion explicita de la tarea.
- Al quedar `0` empresas y `0` usuarios, el siguiente flujo debe comenzar desde solicitud publica de empresa y aprobacion/invitacion nueva.
