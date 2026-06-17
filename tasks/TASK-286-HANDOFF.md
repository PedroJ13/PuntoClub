# TASK-286 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: SQL/Data
Estado: Completed
Fecha: 2026-06-15

## Resultado

El modelo SQL actual soporta `Atender cliente` sin migracion nueva para TASK-287.

No se aplicaron migraciones.
No se modificaron datos.
No se implemento API.

## Estado del modelo

Tablas base disponibles:

- `Companies`
- `Customers`
- `Purchases`
- `Redemptions`
- `CustomerPointBalances`
- `MembershipPlans`
- `MembershipBenefits`
- `CustomerMemberships`
- `MembershipBenefitUsages`
- `MembershipTransactions`
- `OperationalAuditEvents`

El modelo cubre:

- busqueda/registro de cliente;
- saldo de puntos;
- historial de compras/redenciones;
- membresias del cliente;
- beneficios por plan;
- usos de beneficios;
- transacciones de membresia;
- alertas de vencimiento desde fechas/estado.

## Indices existentes relevantes

Clientes:

- `UX_Customers_company_phone` en `(company_id, phone)`
- `UX_Customers_company_email` en `(company_id, email)` filtrado por email no null
- `IX_Customers_company_name` en `(company_id, name)`

Puntos:

- `UX_Purchases_company_invoice` en `(company_id, invoice_number)`
- `IX_Purchases_customer_date` en `(company_id, customer_id, purchase_date DESC)`
- `IX_Redemptions_customer_date` en `(company_id, customer_id, redemption_date DESC)`
- `CustomerPointBalances` para saldo calculado por cliente.

Membresias:

- `IX_MembershipPlans_company_status` en `(company_id, status, name)`
- `IX_MembershipBenefits_plan_status` en `(company_id, membership_plan_id, status)`
- `IX_CustomerMemberships_customer_status_dates` en `(company_id, customer_id, status, start_date, end_date)`
- `UX_CustomerMemberships_one_active_per_customer` en `(company_id, customer_id)` filtrado por `status = 'active'`
- `IX_MembershipBenefitUsages_period` en `(company_id, customer_id, membership_benefit_id, usage_period_start_date)`
- `IX_MembershipBenefitUsages_membership` en `(company_id, customer_membership_id, used_at DESC)`
- `IX_MembershipTransactions_customer_date` en `(company_id, customer_id, transaction_date DESC, id DESC)`
- `IX_MembershipTransactions_membership_date` en `(company_id, customer_membership_id, transaction_date DESC, id DESC)`

## Consultas recomendadas para ficha

Buscar cliente:

```sql
SELECT TOP (25) id, name, phone, email
FROM dbo.Customers
WHERE company_id = @company_id
  AND (
    phone = @search
    OR email = @search
    OR name LIKE @search_like
  )
ORDER BY name;
```

Saldo de puntos:

```sql
SELECT points_earned, points_redeemed, points_balance
FROM dbo.CustomerPointBalances
WHERE company_id = @company_id
  AND customer_id = @customer_id;
```

Historial de puntos:

```sql
SELECT TOP (25) purchase_date, amount, points_earned, invoice_number
FROM dbo.Purchases
WHERE company_id = @company_id
  AND customer_id = @customer_id
ORDER BY purchase_date DESC, id DESC;
```

```sql
SELECT TOP (25) redemption_date, points_redeemed, note
FROM dbo.Redemptions
WHERE company_id = @company_id
  AND customer_id = @customer_id
ORDER BY redemption_date DESC, id DESC;
```

Membresias del cliente:

```sql
SELECT memberships.*, plans.name, plans.duration_days, plans.price, plans.renewal_notice_days
FROM dbo.CustomerMemberships AS memberships
INNER JOIN dbo.MembershipPlans AS plans
  ON plans.id = memberships.membership_plan_id
WHERE memberships.company_id = @company_id
  AND memberships.customer_id = @customer_id
ORDER BY memberships.end_date DESC, memberships.id DESC;
```

Beneficios de plan:

```sql
SELECT *
FROM dbo.MembershipBenefits
WHERE company_id = @company_id
  AND membership_plan_id = @membership_plan_id
  AND status = 'active'
ORDER BY name;
```

Usos recientes:

```sql
SELECT TOP (25) *
FROM dbo.MembershipBenefitUsages
WHERE company_id = @company_id
  AND customer_id = @customer_id
ORDER BY used_at DESC, id DESC;
```

Transacciones:

```sql
SELECT TOP (25) *
FROM dbo.MembershipTransactions
WHERE company_id = @company_id
  AND customer_id = @customer_id
ORDER BY transaction_date DESC, id DESC;
```

## Riesgos de performance

- La ficha puede hacer varias consultas por cliente. Para MVP esta bien porque cada consulta usa `company_id` + `customer_id` o indices por fecha/status.
- Si caja opera con alto volumen o alta latencia, convendra un endpoint agregado y posiblemente una consulta consolidada en Backend/API.
- `CustomerPointBalances` calcula saldo por agregacion; con volumen alto podria migrarse a saldo materializado, pero no es necesario para esta fase.

## Requiere tarea SQL posterior

No para TASK-287.

Tarea posterior opcional:

- Crear soporte agregado/materializado para ficha si se detecta latencia real en piloto.
