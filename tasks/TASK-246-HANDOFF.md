# TASK-246 - Handoff SQL DEV / Data

Equipo: SQL DEV / Data

Modo de ejecucion: SQL DEV / Data

## Resultado

Completado.

Se creo migracion SQL versionada para membresias MVP y habilitacion simple de tipos de fidelizacion por empresa.

## Archivo de migracion creado

- `database/migrations/20260613_memberships_mvp.sql`

## Resumen de cambios SQL

### `dbo.Companies`

Columnas nuevas idempotentes:

- `loyalty_points_enabled bit NOT NULL DEFAULT 1`
- `loyalty_memberships_enabled bit NOT NULL DEFAULT 0`

### `dbo.MembershipPlans`

Tabla para planes de membresia por empresa.

Campos principales:

- `company_id`
- `name`
- `description`
- `duration_days`
- `price`
- `renewal_notice_days`
- `status`
- `created_at`
- `updated_at`

Constraints:

- FK a `Companies`.
- `duration_days > 0`.
- `price >= 0`.
- `renewal_notice_days >= 0`.
- `status IN ('active', 'inactive')`.

Indice:

- `IX_MembershipPlans_company_status`

### `dbo.MembershipBenefits`

Tabla para beneficios de un plan.

Campos principales:

- `company_id`
- `membership_plan_id`
- `name`
- `description`
- `benefit_type`
- `applies_to_type`
- `applies_to_name`
- `discount_percent`
- `included_quantity`
- `usage_limit`
- `usage_period`
- `status`

Constraints:

- FK a `Companies`.
- FK a `MembershipPlans`.
- `benefit_type IN ('informational', 'discount', 'allowance', 'free_item')`.
- `applies_to_type IN ('product', 'service', 'category', 'text')`.
- `usage_period IN ('none', 'day', 'week', 'month', 'membership_term')`.
- `status IN ('active', 'inactive')`.
- porcentajes, cantidades y limites positivos cuando aplican.
- descuentos requieren `discount_percent`.
- beneficios `allowance`/`free_item` requieren periodo/limite/cantidad.

Indice:

- `IX_MembershipBenefits_plan_status`

### `dbo.CustomerMemberships`

Tabla para membresias activadas por cliente.

Campos principales:

- `company_id`
- `customer_id`
- `membership_plan_id`
- `start_date`
- `end_date`
- `status`
- `price_paid`
- `created_at`
- `cancelled_at`
- `cancelled_by_label`
- `cancel_note`

Constraints:

- FK a `Companies`.
- FK a `Customers`.
- FK a `MembershipPlans`.
- `end_date >= start_date`.
- `price_paid >= 0`.
- `status IN ('active', 'expired', 'cancelled')`.
- coherencia de `cancelled_at` con `status = 'cancelled'`.

Indices:

- `IX_CustomerMemberships_customer_status_dates`
- `UX_CustomerMemberships_one_active_per_customer` filtrado por `status = 'active'`

### `dbo.MembershipBenefitUsages`

Ledger de usos de beneficios controlables.

Campos principales:

- `company_id`
- `customer_membership_id`
- `membership_benefit_id`
- `customer_id`
- `used_at`
- `usage_date`
- `usage_period_start_date`
- `quantity`
- `note`
- `created_by_label`

Constraints:

- FK a `Companies`.
- FK a `CustomerMemberships`.
- FK a `MembershipBenefits`.
- FK a `Customers`.
- `quantity > 0`.

Indices:

- `IX_MembershipBenefitUsages_period`
- `IX_MembershipBenefitUsages_membership`

### Auditoria

La migracion amplia allowlists de `OperationalAuditEvents` si la tabla existe:

Eventos nuevos:

- `membership.plan.created`
- `membership.plan.updated`
- `membership.benefit.created`
- `membership.benefit.updated`
- `customer.membership.activated`
- `customer.membership.cancelled`
- `membership.benefit.used`

Entidades nuevas:

- `membership_plan`
- `membership_benefit`
- `customer_membership`
- `membership_benefit_usage`

## Aplicacion

No aplicada en Azure SQL en esta tarea.

Motivo:

- La asignacion pide crear la migracion versionada y permite no aplicar si no hay patron seguro en el turno.
- No se abrio firewall ni se usaron credenciales.
- No se modificaron datos.

## Validacion ejecutada

Validacion estatica local:

- Archivo creado en `database/migrations/`.
- Marcadores verificados:
  - `CREATE TABLE dbo.MembershipPlans`
  - `CREATE TABLE dbo.MembershipBenefits`
  - `CREATE TABLE dbo.CustomerMemberships`
  - `CREATE TABLE dbo.MembershipBenefitUsages`
  - `loyalty_points_enabled`
  - `loyalty_memberships_enabled`
  - `UX_CustomerMemberships_one_active_per_customer`
  - eventos de auditoria `membership.*`
- Separadores `GO`: 14.
- Busqueda de `password`, `token`, `secret`, `connection string`, `SAS`: sin resultados.

## Riesgos o pendientes para Backend/API

- Backend/API debe validar pertenencia por empresa de plan, beneficio, cliente y membresia antes de escribir.
- La migracion usa FKs simples; si Product requiere aislamiento SQL compuesto estricto, se puede ampliar con unique keys/FKs compuestas.
- Antes de probar endpoints contra Azure SQL, Infra/SQL debe aplicar la migracion en la base objetivo.
- Los flags `loyalty_memberships_enabled` quedan por defecto en `0`; una empresa no vera membresias hasta que se habilite explicitamente.
