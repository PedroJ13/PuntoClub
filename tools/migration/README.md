# Legacy migration dry-run

Herramienta local para preparar archivos legacy antes de cualquier migracion real.

## Reglas

- Usar solo datos sinteticos o archivos provistos localmente por el responsable.
- No conecta con Azure SQL.
- No usa secretos.
- No aplica cambios productivos.
- CSV funciona sin dependencias nuevas.
- `.xlsx` se detecta y se rechaza con mensaje claro en esta version local; convertir a CSV para correr el dry-run.

## Plantillas

- `templates/customers-template.csv`
- `templates/movements-template.csv`
- `templates/compact-balance-template.csv`

## Comandos

Caso feliz con clientes y movimientos:

```powershell
npm run migration:dry-run -- --customers tools/migration/fixtures/happy-customers.csv --movements tools/migration/fixtures/happy-movements.csv --scenario full_history --source-system synthetic --out tools/migration/output/happy
```

Saldo compactado:

```powershell
npm run migration:dry-run -- --compact tools/migration/fixtures/compact-balance.csv --scenario compact_balance --source-system synthetic --out tools/migration/output/compact
```

Caso con errores esperados:

```powershell
npm run migration:dry-run -- --customers tools/migration/fixtures/duplicates-customers.csv --scenario full_history --source-system synthetic --out tools/migration/output/duplicates
```

Columnas faltantes:

```powershell
npm run migration:dry-run -- --customers tools/migration/fixtures/missing-headers-customers.csv --scenario full_history --source-system synthetic --out tools/migration/output/missing-headers
```

## Salidas

El dry-run genera:

- `summary.json`
- `summary.md`
- `validation-messages.jsonl`
- `staging-customers.jsonl`
- `staging-movements.jsonl`

Si hay errores de validacion, el proceso termina con codigo `1` y deja los reportes para revision.

## Columnas esperadas

Clientes:

- `legacy_customer_id`
- `customer_name`
- `phone`
- `email`
- `customer_status`
- `created_at`
- `notes`

Movimientos:

- `legacy_transaction_id`
- `legacy_customer_id`
- `phone`
- `email`
- `transaction_date`
- `type`
- `amount`
- `points`
- `description`

Saldo compactado:

- `legacy_customer_id`
- `customer_name`
- `phone`
- `email`
- `current_points_balance`
- `balance_as_of`
- `notes`

Tipos de movimiento aceptados:

- `purchase`
- `redemption`
- `points_adjustment_positive`
- `points_adjustment_negative`
- `legacy_balance_import`
- `legacy_balance_reconciliation`

Aliases legacy permitidos:

- `redeem` -> `redemption`
- `balance_snapshot` -> `legacy_balance_import`
