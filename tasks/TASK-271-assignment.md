# TASK-271 - SQL/Data para transacciones de membresias

Equipo: Ejecucion Tecnica
Modo de ejecucion: SQL/Data
Round: 17
Depende de: TASK-246, TASK-270
Estado: Assigned

## Objetivo

Agregar soporte persistente para transacciones economicas de membresias.

## Contexto

El modelo actual permite configurar planes, activar membresias y registrar usos de beneficios. Falta registrar el movimiento economico asociado a una membresia nueva o renovacion para poder reportar ventas de membresias por fecha y metodo de pago.

## Alcance

1. Revisar `docs/NEXT_PHASE_MEMBERSHIPS.md` y handoffs de TASK-246 y TASK-270.
2. Crear migracion SQL para `MembershipTransactions`.
3. Definir indices y llaves foraneas necesarias.
4. Aplicar migracion en Azure SQL si corresponde al flujo del proyecto.
5. Validar que no rompe tablas existentes.

## Campos minimos esperados

- `id`
- `company_id`
- `customer_id`
- `customer_membership_id`
- `membership_plan_id`
- `transaction_type`
- `payment_method`
- `amount`
- `transaction_date`
- `note`
- `created_at`
- `created_by_label`

Valores esperados:

```text
transaction_type:
- new_membership
- renewal
- adjustment
- cancellation

payment_method:
- cash
- card
- credit
- transfer
- other
```

## Reglas

- `amount` debe permitir 0 para promociones, pero no negativos salvo que se defina `adjustment` con regla explicita.
- `company_id` debe estar presente en todas las consultas.
- Mantener compatibilidad con membresias ya activadas.

## Fuera de alcance

- Implementar endpoints.
- Cambios Web.
- Reportes financieros completos.

## Handoff esperado

Actualizar `tasks/TASK-271-HANDOFF.md` con:

- Resultado.
- Migracion creada/aplicada.
- Script o archivo creado.
- Validaciones ejecutadas.
- Riesgos o notas para Backend/API.
