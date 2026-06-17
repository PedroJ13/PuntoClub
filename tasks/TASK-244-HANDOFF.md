# TASK-244 - Handoff SQL DEV / Data

Equipo: SQL DEV / Data

Modo de ejecucion: SQL DEV / Data

## Resultado

Completado.

Se propone modelo SQL MVP para membresias, beneficios, membresias activadas por cliente y usos de beneficios. No se aplico migracion y no se modificaron datos.

## Modelo propuesto

### `dbo.MembershipPlans`

Define los planes que una empresa puede vender/activar.

Campos:

- `id bigint IDENTITY(1,1) PRIMARY KEY`
- `company_id bigint NOT NULL`
- `name nvarchar(160) NOT NULL`
- `description nvarchar(500) NULL`
- `duration_days int NOT NULL`
- `price decimal(18,2) NOT NULL`
- `renewal_notice_days int NOT NULL DEFAULT 5`
- `status nvarchar(20) NOT NULL DEFAULT 'active'`
- `created_at datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME()`
- `updated_at datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME()`

Estados:

- `active`
- `inactive`

### `dbo.MembershipBenefits`

Define beneficios incluidos en un plan.

Campos:

- `id bigint IDENTITY(1,1) PRIMARY KEY`
- `company_id bigint NOT NULL`
- `membership_plan_id bigint NOT NULL`
- `name nvarchar(160) NOT NULL`
- `description nvarchar(500) NULL`
- `benefit_type nvarchar(30) NOT NULL`
- `applies_to_type nvarchar(30) NOT NULL DEFAULT 'text'`
- `applies_to_name nvarchar(160) NULL`
- `discount_percent decimal(5,2) NULL`
- `included_quantity int NULL`
- `usage_limit int NULL`
- `usage_period nvarchar(30) NOT NULL DEFAULT 'none'`
- `status nvarchar(20) NOT NULL DEFAULT 'active'`
- `created_at datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME()`
- `updated_at datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME()`

Valores:

- `benefit_type`: `informational`, `discount`, `allowance`, `free_item`
- `applies_to_type`: `product`, `service`, `category`, `text`
- `usage_period`: `none`, `day`, `week`, `month`, `membership_term`
- `status`: `active`, `inactive`

Reglas:

- `informational`: sin uso controlable; no requiere `usage_limit`.
- `discount`: puede ser ilimitado (`usage_period = none`) o controlable si Product decide auditar usos.
- `allowance` / `free_item`: si son controlables deben tener `included_quantity`, `usage_limit` y `usage_period != none`.

### `dbo.CustomerMemberships`

Representa una membresia activada/comprada por un cliente.

Campos:

- `id bigint IDENTITY(1,1) PRIMARY KEY`
- `company_id bigint NOT NULL`
- `customer_id bigint NOT NULL`
- `membership_plan_id bigint NOT NULL`
- `start_date date NOT NULL`
- `end_date date NOT NULL`
- `status nvarchar(20) NOT NULL DEFAULT 'active'`
- `price_paid decimal(18,2) NOT NULL`
- `created_at datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME()`
- `cancelled_at datetime2(3) NULL`
- `cancelled_by_label nvarchar(160) NULL`
- `cancel_note nvarchar(500) NULL`

Estados:

- `active`
- `expired`
- `cancelled`

Recomendacion MVP: permitir una sola membresia `active` por cliente y empresa con indice unico filtrado.

### `dbo.MembershipBenefitUsages`

Ledger de usos de beneficios controlables.

Campos:

- `id bigint IDENTITY(1,1) PRIMARY KEY`
- `company_id bigint NOT NULL`
- `customer_membership_id bigint NOT NULL`
- `membership_benefit_id bigint NOT NULL`
- `customer_id bigint NOT NULL`
- `used_at datetime2(3) NOT NULL DEFAULT SYSUTCDATETIME()`
- `usage_date date NOT NULL`
- `usage_period_start_date date NOT NULL`
- `quantity int NOT NULL DEFAULT 1`
- `note nvarchar(500) NULL`
- `created_by_label nvarchar(160) NULL`

`usage_date` es la fecha operativa local usada por la empresa para mostrar/validar el dia. `used_at` queda en UTC para auditoria tecnica. `usage_period_start_date` facilita validacion consistente para dia, semana, mes o termino.

## SQL/migracion propuesta sin aplicar

```sql
CREATE TABLE dbo.MembershipPlans (
  id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_MembershipPlans PRIMARY KEY,
  company_id bigint NOT NULL,
  name nvarchar(160) NOT NULL,
  description nvarchar(500) NULL,
  duration_days int NOT NULL,
  price decimal(18,2) NOT NULL,
  renewal_notice_days int NOT NULL CONSTRAINT DF_MembershipPlans_renewal_notice_days DEFAULT (5),
  status nvarchar(20) NOT NULL CONSTRAINT DF_MembershipPlans_status DEFAULT (N'active'),
  created_at datetime2(3) NOT NULL CONSTRAINT DF_MembershipPlans_created_at DEFAULT SYSUTCDATETIME(),
  updated_at datetime2(3) NOT NULL CONSTRAINT DF_MembershipPlans_updated_at DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_MembershipPlans_Companies FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
  CONSTRAINT CK_MembershipPlans_duration_days CHECK (duration_days > 0),
  CONSTRAINT CK_MembershipPlans_price CHECK (price >= 0),
  CONSTRAINT CK_MembershipPlans_renewal_notice_days CHECK (renewal_notice_days >= 0),
  CONSTRAINT CK_MembershipPlans_status CHECK (status IN (N'active', N'inactive'))
);

CREATE TABLE dbo.MembershipBenefits (
  id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_MembershipBenefits PRIMARY KEY,
  company_id bigint NOT NULL,
  membership_plan_id bigint NOT NULL,
  name nvarchar(160) NOT NULL,
  description nvarchar(500) NULL,
  benefit_type nvarchar(30) NOT NULL,
  applies_to_type nvarchar(30) NOT NULL CONSTRAINT DF_MembershipBenefits_applies_to_type DEFAULT (N'text'),
  applies_to_name nvarchar(160) NULL,
  discount_percent decimal(5,2) NULL,
  included_quantity int NULL,
  usage_limit int NULL,
  usage_period nvarchar(30) NOT NULL CONSTRAINT DF_MembershipBenefits_usage_period DEFAULT (N'none'),
  status nvarchar(20) NOT NULL CONSTRAINT DF_MembershipBenefits_status DEFAULT (N'active'),
  created_at datetime2(3) NOT NULL CONSTRAINT DF_MembershipBenefits_created_at DEFAULT SYSUTCDATETIME(),
  updated_at datetime2(3) NOT NULL CONSTRAINT DF_MembershipBenefits_updated_at DEFAULT SYSUTCDATETIME(),
  CONSTRAINT FK_MembershipBenefits_Companies FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
  CONSTRAINT FK_MembershipBenefits_MembershipPlans FOREIGN KEY (membership_plan_id) REFERENCES dbo.MembershipPlans(id),
  CONSTRAINT CK_MembershipBenefits_type CHECK (benefit_type IN (N'informational', N'discount', N'allowance', N'free_item')),
  CONSTRAINT CK_MembershipBenefits_applies_to_type CHECK (applies_to_type IN (N'product', N'service', N'category', N'text')),
  CONSTRAINT CK_MembershipBenefits_usage_period CHECK (usage_period IN (N'none', N'day', N'week', N'month', N'membership_term')),
  CONSTRAINT CK_MembershipBenefits_status CHECK (status IN (N'active', N'inactive')),
  CONSTRAINT CK_MembershipBenefits_discount_percent CHECK (discount_percent IS NULL OR (discount_percent > 0 AND discount_percent <= 100)),
  CONSTRAINT CK_MembershipBenefits_included_quantity CHECK (included_quantity IS NULL OR included_quantity > 0),
  CONSTRAINT CK_MembershipBenefits_usage_limit CHECK (usage_limit IS NULL OR usage_limit > 0),
  CONSTRAINT CK_MembershipBenefits_controlled_usage CHECK (
    benefit_type IN (N'informational', N'discount')
    OR (usage_period <> N'none' AND usage_limit IS NOT NULL AND included_quantity IS NOT NULL)
  )
);

CREATE TABLE dbo.CustomerMemberships (
  id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_CustomerMemberships PRIMARY KEY,
  company_id bigint NOT NULL,
  customer_id bigint NOT NULL,
  membership_plan_id bigint NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status nvarchar(20) NOT NULL CONSTRAINT DF_CustomerMemberships_status DEFAULT (N'active'),
  price_paid decimal(18,2) NOT NULL,
  created_at datetime2(3) NOT NULL CONSTRAINT DF_CustomerMemberships_created_at DEFAULT SYSUTCDATETIME(),
  cancelled_at datetime2(3) NULL,
  cancelled_by_label nvarchar(160) NULL,
  cancel_note nvarchar(500) NULL,
  CONSTRAINT FK_CustomerMemberships_Companies FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
  CONSTRAINT FK_CustomerMemberships_Customers FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
  CONSTRAINT FK_CustomerMemberships_MembershipPlans FOREIGN KEY (membership_plan_id) REFERENCES dbo.MembershipPlans(id),
  CONSTRAINT CK_CustomerMemberships_dates CHECK (end_date >= start_date),
  CONSTRAINT CK_CustomerMemberships_price_paid CHECK (price_paid >= 0),
  CONSTRAINT CK_CustomerMemberships_status CHECK (status IN (N'active', N'expired', N'cancelled')),
  CONSTRAINT CK_CustomerMemberships_cancelled CHECK (
    (status <> N'cancelled' AND cancelled_at IS NULL)
    OR (status = N'cancelled' AND cancelled_at IS NOT NULL)
  )
);

CREATE TABLE dbo.MembershipBenefitUsages (
  id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_MembershipBenefitUsages PRIMARY KEY,
  company_id bigint NOT NULL,
  customer_membership_id bigint NOT NULL,
  membership_benefit_id bigint NOT NULL,
  customer_id bigint NOT NULL,
  used_at datetime2(3) NOT NULL CONSTRAINT DF_MembershipBenefitUsages_used_at DEFAULT SYSUTCDATETIME(),
  usage_date date NOT NULL,
  usage_period_start_date date NOT NULL,
  quantity int NOT NULL CONSTRAINT DF_MembershipBenefitUsages_quantity DEFAULT (1),
  note nvarchar(500) NULL,
  created_by_label nvarchar(160) NULL,
  CONSTRAINT FK_MembershipBenefitUsages_Companies FOREIGN KEY (company_id) REFERENCES dbo.Companies(id),
  CONSTRAINT FK_MembershipBenefitUsages_CustomerMemberships FOREIGN KEY (customer_membership_id) REFERENCES dbo.CustomerMemberships(id),
  CONSTRAINT FK_MembershipBenefitUsages_MembershipBenefits FOREIGN KEY (membership_benefit_id) REFERENCES dbo.MembershipBenefits(id),
  CONSTRAINT FK_MembershipBenefitUsages_Customers FOREIGN KEY (customer_id) REFERENCES dbo.Customers(id),
  CONSTRAINT CK_MembershipBenefitUsages_quantity CHECK (quantity > 0)
);

CREATE INDEX IX_MembershipPlans_company_status
  ON dbo.MembershipPlans(company_id, status, name);

CREATE INDEX IX_MembershipBenefits_plan_status
  ON dbo.MembershipBenefits(company_id, membership_plan_id, status);

CREATE INDEX IX_CustomerMemberships_customer_status_dates
  ON dbo.CustomerMemberships(company_id, customer_id, status, start_date, end_date);

CREATE UNIQUE INDEX UX_CustomerMemberships_one_active_per_customer
  ON dbo.CustomerMemberships(company_id, customer_id)
  WHERE status = N'active';

CREATE INDEX IX_MembershipBenefitUsages_period
  ON dbo.MembershipBenefitUsages(company_id, customer_id, membership_benefit_id, usage_period_start_date);

CREATE INDEX IX_MembershipBenefitUsages_membership
  ON dbo.MembershipBenefitUsages(company_id, customer_membership_id, used_at DESC);
```

Observacion: para garantizar que `MembershipBenefits.company_id` coincida con el plan y que usages coincidan con membership/benefit/customer en la misma empresa, conviene agregar constraints compuestas o validar transaccionalmente en Backend/API. La propuesta MVP mantiene FKs simples para reducir complejidad inicial, pero Backend debe validar pertenencia antes de escribir.

## Indices recomendados

- `IX_MembershipPlans_company_status`: listar planes activos/inactivos por empresa.
- `IX_MembershipBenefits_plan_status`: listar beneficios activos de un plan.
- `IX_CustomerMemberships_customer_status_dates`: consultar estado de membresia al buscar cliente.
- `UX_CustomerMemberships_one_active_per_customer`: MVP con una sola membresia activa por cliente.
- `IX_MembershipBenefitUsages_period`: validar uso por periodo, por ejemplo cafe diario.
- `IX_MembershipBenefitUsages_membership`: historial de usos de una membresia.

## Reglas de integridad

- Todas las tablas tienen `company_id`.
- Planes y beneficios tienen estado activo/inactivo.
- Membresias de cliente tienen estado `active`, `expired`, `cancelled`.
- Fechas de membresia: `end_date >= start_date`.
- Montos y cantidades no negativos/positivos segun corresponda.
- Beneficios controlables requieren limite y periodo.
- Para MVP, una sola membresia activa por cliente/empresa.
- `usage_date` debe ser fecha operativa local; `used_at` UTC.
- Backend debe impedir registrar usos si la membresia esta vencida/cancelada o el beneficio esta inactivo.

## Consulta clave: cafe diario disponible/usado

Para `1 cafe americano gratis por dia`, Backend debe resolver:

- empresa desde sesion;
- cliente;
- membresia activa;
- beneficio activo `free_item`;
- `usage_period = day`;
- `usage_limit = 1`;
- `usage_period_start_date = usage_date`.

Consulta de conteo diario:

```sql
SELECT COALESCE(SUM(u.quantity), 0) AS used_quantity
FROM dbo.MembershipBenefitUsages u
WHERE u.company_id = @CompanyId
  AND u.customer_id = @CustomerId
  AND u.customer_membership_id = @CustomerMembershipId
  AND u.membership_benefit_id = @MembershipBenefitId
  AND u.usage_period_start_date = @UsageDate;
```

Disponible si:

```text
used_quantity < MembershipBenefits.usage_limit
```

Registro recomendado en transaccion:

1. Validar membresia `active` y rango de fechas.
2. Validar beneficio `active`, controlable y asociado al plan.
3. Contar usos del periodo con locks adecuados.
4. Insertar `MembershipBenefitUsages`.
5. Auditar `membership.benefit.used` best-effort.

## Fechas

- `start_date`, `end_date`, `usage_date`, `usage_period_start_date`: tipo `date`, fecha operativa local de la empresa.
- `created_at`, `updated_at`, `used_at`, `cancelled_at`: `datetime2(3)` UTC.
- Para MVP, Backend puede calcular `end_date = DATEADD(day, duration_days - 1, start_date)` si se interpreta la membresia como inclusiva hasta fin de dia local.
- Semana/mes: Backend calcula `usage_period_start_date` segun regla de negocio local antes de insertar.

## Auditoria minima recomendada

Extender `OperationalAuditEvents` para permitir:

- `membership.plan.created`
- `membership.plan.updated`
- `membership.benefit.created`
- `membership.benefit.updated`
- `customer.membership.activated`
- `customer.membership.cancelled`
- `membership.benefit.used`

Entidades sugeridas:

- `membership_plan`
- `membership_benefit`
- `customer_membership`
- `membership_benefit_usage`

Metadata sin secretos:

- ids internos;
- `changedFields`;
- `usageDate`;
- `usagePeriod`;
- `quantity`;
- nunca tokens, cookies, passwords, hashes, connection strings ni SAS.

## Habilitacion de tipos de fidelizacion

Para cumplir UX de empresa con `Puntos`, `Membresias` o ambos, se recomienda una tarea SQL separada o ampliar una migracion futura con una de estas opciones:

1. Columnas simples en `Companies`:
   - `loyalty_points_enabled bit NOT NULL DEFAULT 1`
   - `loyalty_memberships_enabled bit NOT NULL DEFAULT 0`

2. Tabla extensible `CompanyLoyaltyFeatures`:
   - `company_id`
   - `feature_type` (`points`, `memberships`)
   - `status` (`enabled`, `disabled`, `pending`)

Recomendacion MVP: columnas simples si solo existiran dos tipos en el corto plazo; tabla extensible si Product espera mas tipos.

## Riesgos o pendientes para Backend/API

- Definir si descuentos ilimitados se registran como usos o solo se muestran.
- Definir comportamiento de renovacion antes de vencer.
- Definir si se permitira mas de una membresia activa por cliente; esta propuesta MVP lo evita.
- Si se requiere aislamiento fuerte por FKs compuestas, agregar unique keys compuestas en tablas padre antes de aplicar migracion.
- Antes de aplicar, revisar nombres de constraints contra convenciones existentes y agregar migracion versionada `database/migrations/YYYYMMDD_memberships_mvp.sql`.
