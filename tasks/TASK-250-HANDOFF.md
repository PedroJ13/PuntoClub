# TASK-250 - Handoff SQL DEV / Data

Equipo: SQL DEV / Data

Modo de ejecucion: SQL DEV / Data

## Resultado

Completado.

Se aplico en Azure SQL la migracion de membresias MVP:

- `database/migrations/20260613_memberships_mvp.sql`

Base objetivo:

- Server: `sqlserver-pj13-brazil`
- Database: `sql-db-puntoclub`

## Migracion aplicada

La migracion se ejecuto por lotes separados por `GO`.

Resultado:

- `batch 1/14 ok`
- `batch 2/14 ok`
- `batch 3/14 ok`
- `batch 4/14 ok`
- `batch 5/14 ok`
- `batch 6/14 ok`
- `batch 7/14 ok`
- `batch 8/14 ok`
- `batch 9/14 ok`
- `batch 10/14 ok`
- `batch 11/14 ok`
- `batch 12/14 ok`
- `batch 13/14 ok`
- `batch 14/14 ok`

No se imprimieron secretos, connection strings, passwords, hashes, cookies ni tokens.

## Validacion de objetos

Columnas confirmadas en `dbo.Companies`:

- `loyalty_points_enabled`
- `loyalty_memberships_enabled`

Tablas confirmadas:

- `dbo.MembershipPlans`
- `dbo.MembershipBenefits`
- `dbo.CustomerMemberships`
- `dbo.MembershipBenefitUsages`

Indices confirmados:

- `IX_MembershipPlans_company_status`
- `IX_MembershipBenefits_plan_status`
- `IX_CustomerMemberships_customer_status_dates`
- `UX_CustomerMemberships_one_active_per_customer`
- `IX_MembershipBenefitUsages_period`
- `IX_MembershipBenefitUsages_membership`

## Empresa de prueba habilitada

Se encontro una empresa activa de prueba y se habilito solo para esa empresa:

- `companyId=6`
- nombre seguro: `DEMO 1`
- `loyalty_points_enabled=1`
- `loyalty_memberships_enabled=1`

No se listaron ni documentaron correos u otros datos sensibles.

## Firewall temporal

Se creo regla temporal estrecha para la IP local observada:

- `tmp-task250-sql-migration-200-229-6-68`

Se retiro al terminar.

Verificacion posterior:

```json
[]
```

## Riesgos o pendientes

- Backend/API debe estar publicado con los endpoints de TASK-247 para validar configuracion real.
- Web debe estar publicada con la seccion de TASK-248 para que QA vea `Membresias`.
- QA debe validar que empresas sin `loyalty_memberships_enabled=1` no vean el menu.
- Esta tarea no crea planes ni beneficios semilla; la configuracion debe crearse por API/UI.
