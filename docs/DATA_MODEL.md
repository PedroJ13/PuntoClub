# Data Model

## Entidades iniciales

### Companies

- id
- name
- email
- phone
- logo_url
- points_percentage
- status
- created_at
- updated_at

### Customers

- id
- company_id
- name
- phone
- email
- created_at
- updated_at

### Purchases

- id
- company_id
- customer_id
- invoice_number
- purchase_date
- amount
- points_earned
- created_at

Restriccion: `invoice_number` unico por `company_id`.

### Redemptions

- id
- company_id
- customer_id
- redemption_date
- points_redeemed
- note
- created_at

## Saldo de puntos

Para MVP, calcular saldo como:

- suma de `points_earned` en compras
- menos suma de `points_redeemed` en redenciones

Si el volumen crece, evaluar tabla de movimientos o saldo materializado.

## Reglas pendientes

- Precision decimal para montos.
- Redondeo de puntos.
- Borrado logico vs borrado fisico.
- Unicidad de cliente por empresa.
- Validacion SQL o API para redencion contra saldo.
