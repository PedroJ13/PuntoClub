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

## Multiempresa controlado - auth propia MVP

### CompanyRegistrationRequests

- id
- company_name
- company_email
- company_phone
- company_address
- contact_name
- contact_email
- contact_phone
- status
- reviewed_at
- reviewed_by_label
- review_note
- approved_company_id
- created_at
- updated_at

### CompanyInvitations

- id
- company_id
- registration_request_id
- email
- token_hash
- role
- status
- expires_at
- accepted_at
- revoked_at
- created_at
- created_by_label

Regla: persistir solo `token_hash`, nunca token plano.

### CompanyUsers

- id
- company_id
- email
- display_name
- role
- status
- auth_provider
- password_hash
- password_salt / password_params segun algoritmo elegido
- password_updated_at
- last_login_at
- created_at
- updated_at

Regla piloto: `auth_provider = local_password`. El password nunca se guarda plano.

### CompanySessions

- id
- company_id
- company_user_id
- token_hash
- status
- expires_at
- created_at
- last_seen_at
- revoked_at

Regla: la cookie contiene solo un token aleatorio; SQL guarda solo hash. Los endpoints privados derivan `company_id` desde la sesion, no desde el frontend.
