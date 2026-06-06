# TASK-073 - Mostrar historial resumido de cliente en UI

## Equipo

Web Dev

## Contexto

El MVP Criteria incluye:

```text
Mostrar historial resumido de compras y redenciones.
```

El backend ya expone:

```text
GET /api/companies/{companyId}/customers/{customerId}/activity
```

La UI publicada ya permite buscar cliente, registrar compra y redimir puntos, pero no muestra historial resumido.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

## Objetivo

Agregar historial resumido de compras/redenciones para el cliente seleccionado, manteniendo la pantalla web por zonas y sin romper el flujo aprobado.

## Comportamiento esperado

- Desde un resultado de cliente debe existir una accion para ver historial.
- Al abrir historial:
  - usar el cliente seleccionado;
  - consultar `/activity`;
  - mostrar balance/resumen;
  - mostrar compras como puntos positivos;
  - mostrar redenciones como puntos negativos;
  - mostrar fecha, factura/monto cuando sea compra;
  - mostrar fecha, nota cuando sea redencion;
  - mostrar estado vacio claro si no hay movimientos.
- El historial debe actualizarse despues de registrar compra o redencion.
- No debe cargar historial automaticamente al abrir la app.
- Debe manejar error de API con mensaje claro.

## Layout

- Mantener la pantalla por zonas actual:
  - buscar arriba izquierda;
  - resultados debajo;
  - registrar derecha;
  - operacion abajo.
- El historial puede usar el panel inferior `Operacion` o un subpanel compacto dentro del area de resultados, siempre que no cree scroll/overflow innecesario.
- Debe funcionar en desktop y mobile.
- Mantener copy sin referencias a `Zona`/`zona`.

## API esperada

Respuesta esperada de `/activity`:

```json
{
  "customerId": "10",
  "balance": {
    "pointsEarned": 1250,
    "pointsRedeemed": 500,
    "pointsBalance": 750
  },
  "items": [
    {
      "type": "purchase",
      "id": "50",
      "date": "2026-06-02",
      "invoiceNumber": "FAC-1001",
      "amount": 25000,
      "points": 1250
    },
    {
      "type": "redemption",
      "id": "70",
      "date": "2026-06-02",
      "note": "Canje aplicado en caja",
      "points": -500
    }
  ]
}
```

## No tocar

- No cambiar contratos API.
- No cambiar backend/API salvo bug menor indispensable y documentado.
- No crear recursos Azure.
- No guardar secretos.
- No cambiar la logica de puntos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-073-HANDOFF.md
```

Incluye:

- Cambios realizados.
- Archivos modificados.
- Evidencia de historial con compra y redencion.
- Evidencia de historial vacio o cliente sin movimientos.
- Evidencia de actualizacion de historial despues de compra/redencion.
- Evidencia desktop/mobile sin overflow.
- Pruebas ejecutadas.
