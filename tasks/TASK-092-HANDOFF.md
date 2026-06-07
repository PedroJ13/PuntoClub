Equipo:
SQL DEV

Tarea completada:
TASK-092 - Disenar consultas SQL para reporte operativo.

Archivos cambiados:
- tasks/TASK-092-HANDOFF.md

SQL agregado o modificado:
- Ninguno aplicado a la base.
- Se proponen queries de solo lectura para Backend/API.
- No se modifico schema.
- No se modificaron datos.
- No se imprimieron ni guardaron secretos.

Verificacion ejecutada:
- Leido tasks/TASK-092-assignment.md.
- Leido chat-start/SQL_DEV.md.
- Leido AGENTS.md.
- Leido database/schema.sql.
- Leido docs/API_CONTRACTS.md.
- Se intento revisar indices reales en Azure SQL, pero la conexion fue bloqueada por firewall:
  - Client with IP address '200.229.6.103' is not allowed to access the server.
- La recomendacion de indices se basa en database/schema.sql y en TASK-078-HANDOFF.md, donde se confirmo que los indices/constraints criticos estaban presentes y activos.

Queries propuestas:

1. Resumen por empresa y rango de fechas

```sql
DECLARE @company_id bigint = @CompanyId;
DECLARE @date_from date = @DateFrom;
DECLARE @date_to date = @DateTo;

WITH purchase_summary AS (
    SELECT
        p.company_id,
        COUNT_BIG(*) AS purchase_count,
        COALESCE(SUM(p.amount), 0) AS total_sold,
        COALESCE(SUM(p.points_earned), 0) AS points_earned
    FROM dbo.Purchases AS p
    WHERE p.company_id = @company_id
      AND p.purchase_date >= @date_from
      AND p.purchase_date <= @date_to
    GROUP BY p.company_id
),
redemption_summary AS (
    SELECT
        r.company_id,
        COUNT_BIG(*) AS redemption_count,
        COALESCE(SUM(r.points_redeemed), 0) AS points_redeemed
    FROM dbo.Redemptions AS r
    WHERE r.company_id = @company_id
      AND r.redemption_date >= @date_from
      AND r.redemption_date <= @date_to
    GROUP BY r.company_id
),
active_customers AS (
    SELECT p.customer_id
    FROM dbo.Purchases AS p
    WHERE p.company_id = @company_id
      AND p.purchase_date >= @date_from
      AND p.purchase_date <= @date_to
    UNION
    SELECT r.customer_id
    FROM dbo.Redemptions AS r
    WHERE r.company_id = @company_id
      AND r.redemption_date >= @date_from
      AND r.redemption_date <= @date_to
)
SELECT
    @company_id AS company_id,
    @date_from AS date_from,
    @date_to AS date_to,
    COALESCE(ps.purchase_count, 0) AS purchase_count,
    COALESCE(ps.total_sold, 0) AS total_sold,
    COALESCE(ps.points_earned, 0) AS points_earned,
    COALESCE(rs.redemption_count, 0) AS redemption_count,
    COALESCE(rs.points_redeemed, 0) AS points_redeemed,
    (SELECT COUNT_BIG(*) FROM active_customers) AS active_customer_count
FROM (SELECT @company_id AS company_id) AS base
LEFT JOIN purchase_summary AS ps ON ps.company_id = base.company_id
LEFT JOIN redemption_summary AS rs ON rs.company_id = base.company_id;
```

Notas:
- No une Purchases y Redemptions directamente para evitar multiplicar filas.
- `company_id` se filtra en cada CTE para no mezclar empresas.
- Compatible con JSON y CSV: una fila, columnas escalares.

2. Detalle combinado de actividad

```sql
DECLARE @company_id bigint = @CompanyId;
DECLARE @date_from date = @DateFrom;
DECLARE @date_to date = @DateTo;
DECLARE @activity_type varchar(10) = @ActivityType; -- all | purchase | redemption
DECLARE @offset int = @Offset;
DECLARE @limit int = @Limit;

WITH activity AS (
    SELECT
        'purchase' AS activity_type,
        p.id AS activity_id,
        p.purchase_date AS activity_date,
        p.created_at,
        p.customer_id,
        c.name AS customer_name,
        c.phone AS customer_phone,
        c.email AS customer_email,
        p.invoice_number,
        p.amount,
        CAST(NULL AS nvarchar(500)) AS note,
        p.points_earned AS points
    FROM dbo.Purchases AS p
    JOIN dbo.Customers AS c
      ON c.company_id = p.company_id
     AND c.id = p.customer_id
    WHERE p.company_id = @company_id
      AND p.purchase_date >= @date_from
      AND p.purchase_date <= @date_to
      AND @activity_type IN ('all', 'purchase')

    UNION ALL

    SELECT
        'redemption' AS activity_type,
        r.id AS activity_id,
        r.redemption_date AS activity_date,
        r.created_at,
        r.customer_id,
        c.name AS customer_name,
        c.phone AS customer_phone,
        c.email AS customer_email,
        CAST(NULL AS nvarchar(80)) AS invoice_number,
        CAST(NULL AS decimal(18,2)) AS amount,
        r.note,
        -r.points_redeemed AS points
    FROM dbo.Redemptions AS r
    JOIN dbo.Customers AS c
      ON c.company_id = r.company_id
     AND c.id = r.customer_id
    WHERE r.company_id = @company_id
      AND r.redemption_date >= @date_from
      AND r.redemption_date <= @date_to
      AND @activity_type IN ('all', 'redemption')
)
SELECT
    activity_type,
    activity_id,
    activity_date,
    created_at,
    customer_id,
    customer_name,
    customer_phone,
    customer_email,
    invoice_number,
    amount,
    note,
    points
FROM activity
ORDER BY activity_date DESC, created_at DESC, activity_id DESC
OFFSET @offset ROWS
FETCH NEXT @limit ROWS ONLY;
```

Notas:
- Usa `UNION ALL` porque compras y redenciones son entidades distintas.
- Devuelve columnas estables para API JSON y export CSV.
- Puntos de compras salen positivos; puntos de redenciones salen negativos.
- `@activity_type` debe validarse en Backend/API antes de llamar SQL: `all`, `purchase`, `redemption`.
- `@limit` debe tener maximo server-side para proteger API/export.

3. Conteo total para paginacion/export metadata

```sql
DECLARE @company_id bigint = @CompanyId;
DECLARE @date_from date = @DateFrom;
DECLARE @date_to date = @DateTo;
DECLARE @activity_type varchar(10) = @ActivityType; -- all | purchase | redemption

SELECT
    (
        CASE WHEN @activity_type IN ('all', 'purchase') THEN
            (
                SELECT COUNT_BIG(*)
                FROM dbo.Purchases AS p
                WHERE p.company_id = @company_id
                  AND p.purchase_date >= @date_from
                  AND p.purchase_date <= @date_to
            )
        ELSE 0 END
    )
    +
    (
        CASE WHEN @activity_type IN ('all', 'redemption') THEN
            (
                SELECT COUNT_BIG(*)
                FROM dbo.Redemptions AS r
                WHERE r.company_id = @company_id
                  AND r.redemption_date >= @date_from
                  AND r.redemption_date <= @date_to
            )
        ELSE 0 END
    ) AS total_count;
```

Recomendacion de indices:
- Existentes segun schema/TASK-078:
  - IX_Purchases_customer_date: `(company_id, customer_id, purchase_date DESC)` INCLUDE `(amount, points_earned, invoice_number)`.
  - IX_Redemptions_customer_date: `(company_id, customer_id, redemption_date DESC)` INCLUDE `(points_redeemed)`.
  - UQ_Customers_company_id_id: `(company_id, id)`.
- Esos indices sirven bien para historial por cliente, pero no son ideales para reporte por empresa y rango de fechas porque `customer_id` queda antes de la fecha.
- Recomendacion si el reporte se usara con rangos amplios o export frecuentes:

```sql
-- Propuesta para tarea futura; no aplicar en TASK-092.
CREATE INDEX IX_Purchases_company_date
ON dbo.Purchases (company_id, purchase_date DESC, created_at DESC, id DESC)
INCLUDE (customer_id, invoice_number, amount, points_earned);

CREATE INDEX IX_Redemptions_company_date
ON dbo.Redemptions (company_id, redemption_date DESC, created_at DESC, id DESC)
INCLUDE (customer_id, points_redeemed, note);
```

Riesgos de performance:
- Con volumen actual auditado en TASK-078 (37 compras, 29 redenciones), los indices existentes son suficientes.
- Al crecer la data, los reportes por empresa/rango pueden hacer mas lecturas de las necesarias si solo existen indices por `(company_id, customer_id, fecha)`.
- Export CSV sin limite puede crecer rapido; Backend/API debe imponer rango maximo o proceso por paginas.
- `ORDER BY` combinado sobre `UNION ALL` puede requerir sort; los indices propuestos reducen el costo de lectura, pero el merge final puede seguir ordenando si se pide `all`.
- Para fechas tipo `date`, `<= @date_to` es correcto. Si en el futuro se cambia a `datetime/datetime2`, usar limite exclusivo `< DATEADD(day, 1, @date_to)`.

Recomendacion para Backend/API:
- Crear endpoint sugerido:
  - `GET /api/companies/{companyId}/reports/activity?from=YYYY-MM-DD&to=YYYY-MM-DD&type=all|purchase|redemption&offset=0&limit=100`
- Validar server-side:
  - `companyId` coincide con `PILOT_COMPANY_ID`.
  - `from` y `to` son fechas validas.
  - `from <= to`.
  - rango maximo inicial recomendado: 31 a 90 dias para UI; export puede permitir mas con paginacion.
  - `type` solo permite `all`, `purchase`, `redemption`.
  - `limit` maximo recomendado para UI: 100; para CSV: 1000 por pagina.
- Serializar IDs `bigint` como string en JSON.
- Para CSV, usar los mismos nombres de columna que la query de detalle y escapar correctamente `note`, `customer_name`, `customer_email`.
- No aceptar `company_id` desde query/body como autoridad; usar path validado contra configuracion server-side.

Resultado:
Consultas propuestas listas para Backend/API. No se aplicaron cambios SQL.

Riesgos o pendientes:
- No se pudo revisar metadato vivo de indices en Azure SQL en esta ejecucion por firewall. La recomendacion se apoya en schema local y auditoria TASK-078.
- Aplicar indices nuevos requiere tarea separada, idealmente despues de que Backend/API implemente el reporte y QA confirme patrones reales de uso.

Siguiente recomendado:
Backend/API puede implementar el endpoint de reporte usando estas queries parametrizadas. Si pruebas con datos mayores muestran scans costosos, crear nueva tarea SQL para aplicar `IX_Purchases_company_date` e `IX_Redemptions_company_date`.
