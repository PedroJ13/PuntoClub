# TASK-093 - Implementar API de reporte operativo

## Equipo

Backend API

## Contexto

El flujo clientes + compra + redencion + historial ya esta validado. La siguiente fase de programacion agrega reporte operativo basico para revisar actividad por rango de fechas.

## Objetivo

Implementar endpoint API para reporte operativo de actividad.

## Endpoint propuesto

```text
GET /api/companies/{companyId}/reports/activity?from=YYYY-MM-DD&to=YYYY-MM-DD&type=all|purchase|redemption
```

## Respuesta JSON esperada

```json
{
  "from": "2026-06-01",
  "to": "2026-06-07",
  "type": "all",
  "summary": {
    "purchaseCount": 10,
    "purchaseAmountTotal": 50000,
    "pointsEarnedTotal": 2500,
    "redemptionCount": 4,
    "pointsRedeemedTotal": 600,
    "activeCustomerCount": 8
  },
  "items": [
    {
      "type": "purchase",
      "id": "50",
      "date": "2026-06-06",
      "customerId": "10",
      "customerName": "Maria Soto",
      "customerPhone": "+50688887777",
      "customerEmail": "maria@example.com",
      "invoiceNumber": "FAC-1001",
      "amount": 25000,
      "points": 1250
    }
  ]
}
```

## Validaciones

- `companyId` debe validarse contra `PILOT_COMPANY_ID`.
- `from` y `to` requeridos.
- Fechas en formato `YYYY-MM-DD`.
- `from <= to`.
- Rango maximo inicial recomendado: 31 dias.
- `type` opcional, default `all`.
- `type` solo puede ser `all`, `purchase`, `redemption`.

## Pruebas esperadas

- Unit tests de validadores.
- Test de formatter si aplica.
- Smoke local si hay ambiente disponible.
- No romper smoke existente.

## No tocar

- No cambiar frontend en esta tarea.
- No cambiar schema salvo que haya acuerdo con SQL DEV y nueva tarea.
- No imprimir secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-093-HANDOFF.md
```

Incluye:

- Endpoint implementado.
- Archivos modificados.
- Validaciones agregadas.
- Pruebas ejecutadas.
- Ejemplos de respuesta.
- Pendientes para frontend/QA.
