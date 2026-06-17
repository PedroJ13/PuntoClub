# TASK-220 - Handoff SQL DEV / Data

Equipo: SQL DEV / Data

Modo de ejecucion: SQL DEV / Data

## Resultado

Completado.

Se preparo la base `sql-db-puntoclub` para una prueba completa controlada, conservando una sola empresa inicial utilizable para login y eliminando datos operativos/historicos de prueba.

No se borraron tablas, constraints, indices, vistas, stored procedures, migraciones ni usuarios SQL. No se imprimieron passwords, hashes, tokens, connection strings ni secretos.

## Empresa/cuenta inicial conservada

- Empresa conservada: `company_id=3`, nombre `TEST`.
- Correo de empresa: redaccionado como `pj***************@outlook.com`.
- Estado: `active`.
- Usuarios conservados: 1.
- Usuarios locales activos conservados: 1.
- Password/acceso: se conservo el acceso existente y su password hash; no se imprimio ni se modifico el hash.

Motivo de seleccion: `company_id=3` tenia usuario local activo con password y `last_login_at` mas reciente (`2026-06-12 12:46:33`). `company_id=1` tenia datos operativos previos y no tenia usuario local activo; `company_id=2` tenia usuario local activo pero login mas antiguo.

## Tablas revisadas

- `dbo.Companies`
- `dbo.CompanyUsers`
- `dbo.CompanySessions`
- `dbo.CompanyInvitations`
- `dbo.CompanyRegistrationRequests`
- `dbo.Customers`
- `dbo.Purchases`
- `dbo.Redemptions`
- `dbo.OperationalAuditEvents`
- `dbo.AuthAttemptLimits`

## Conteos antes/despues

| Tabla | Antes | Despues |
| --- | ---: | ---: |
| `dbo.AuthAttemptLimits` | 7 | 0 |
| `dbo.Companies` | 3 | 1 |
| `dbo.CompanyInvitations` | 2 | 0 |
| `dbo.CompanyRegistrationRequests` | 9 | 0 |
| `dbo.CompanySessions` | 5 | 0 |
| `dbo.CompanyUsers` | 2 | 1 |
| `dbo.Customers` | 70 | 0 |
| `dbo.OperationalAuditEvents` | 82 | 0 |
| `dbo.Purchases` | 67 | 0 |
| `dbo.Redemptions` | 57 | 0 |

Conteo final de la empresa conservada:

| Validacion | Resultado |
| --- | ---: |
| Empresas activas | 1 |
| Usuarios locales activos con password en empresa conservada | 1 |
| Clientes de empresa conservada | 0 |
| Compras de empresa conservada | 0 |
| Redenciones de empresa conservada | 0 |

## SQL ejecutado

Resumen seguro del procedimiento:

1. Se definio `@KeepCompanyId = 3`.
2. Se valido que la empresa exista y este `active`.
3. Se valido que tenga usuario `local_password` activo con `password_hash` no nulo.
4. Se ejecuto limpieza dentro de transaccion con `XACT_ABORT ON`.
5. Se usaron opciones ANSI requeridas por SQL Server para tablas con indices filtrados.
6. Se eliminaron datos en orden seguro:
   - `CompanySessions`
   - `AuthAttemptLimits`
   - `CompanyInvitations`
   - `CompanyRegistrationRequests`
   - `OperationalAuditEvents`
   - `Redemptions`
   - `Purchases`
   - `Customers`
   - `CompanyUsers` excepto la empresa conservada
   - `Companies` excepto la empresa conservada
7. Se aseguro que la empresa conservada quedara `active`.

Filas afectadas por operacion:

| Operacion | Filas |
| --- | ---: |
| `DELETE CompanySessions` | 5 |
| `DELETE AuthAttemptLimits` | 7 |
| `DELETE CompanyInvitations` | 2 |
| `UPDATE CompanyRegistrationRequests approved_company_id NULL` | 2 |
| `DELETE CompanyRegistrationRequests` | 9 |
| `DELETE OperationalAuditEvents` | 82 |
| `DELETE Redemptions` | 57 |
| `DELETE Purchases` | 67 |
| `DELETE Customers` | 70 |
| `DELETE CompanyUsers except kept company` | 1 |
| `DELETE Companies except kept company` | 2 |
| `UPDATE kept Companies status active` | 1 |

## Verificacion ejecutada

- Conexion SQL a `sql-db-puntoclub` validada despues de TASK-221.
- Conteos antes de limpieza.
- Verificacion de empresas candidatas y usuarios locales activos con correos redaccionados.
- Limpieza transaccional completada sin errores.
- Conteos despues de limpieza.
- Validacion posterior:
  - 1 empresa activa.
  - 1 usuario local activo con password para la empresa conservada.
  - 0 clientes.
  - 0 compras.
  - 0 redenciones.

Observacion: `DBCC CHECKCONSTRAINTS WITH NO_INFOMSGS` no se pudo ejecutar porque el usuario runtime `puntoclub_app_user` no tiene permiso para ese comando en `sql-db-puntoclub`. No se considera bloqueo para TASK-220 porque las operaciones se ejecutaron dentro de transaccion y respetando llaves foraneas.

## Validacion posterior recomendada

PO Test:

- Iniciar sesion con la cuenta existente de la empresa `TEST`.
- Confirmar que la Web entra al panel operativo.
- Confirmar que no hay clientes ni historial previo.
- Registrar un cliente nuevo, una compra y una redencion como prueba completa controlada.

Backend/API o QA:

- Validar que operaciones privadas siguen usando contexto por sesion.
- Validar que no quedan sesiones anteriores activas y que login crea una sesion nueva.

Infra:

- Retirar la regla temporal `tmp-task221-sql-cleanup-200-229-6-68` en TASK-222.

## Riesgos o pendientes

- La limpieza SQL no elimina blobs fisicos de logo en Storage; solo quedo conservada la referencia SQL asociada a la empresa `TEST` si existia.
- No se recreo password ni invitacion nueva; se conserva el acceso existente de la empresa `TEST`.
- El retiro de la regla temporal de firewall queda pendiente en TASK-222.
