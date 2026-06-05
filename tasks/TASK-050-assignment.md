# TASK-050 - Implementar redencion/canje de puntos desde cliente

## Equipo

Web Dev

## Contexto

El flujo publicado cliente + compra fue aprobado por QA en TASK-049. El siguiente paso del MVP real piloto es permitir canjear/redimir puntos desde el mismo contexto del cliente.

URL publicada:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:

```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

## Objetivo

Permitir redimir puntos de un cliente seleccionado, mostrar saldo actualizado y manejar errores principales de redencion.

## Alcance

- Agregar accion/panel `Redimir puntos` para el cliente seleccionado.
- Mostrar cliente seleccionado y puntos actuales antes de redimir.
- Campos minimos:
  - fecha de redencion, por defecto hoy;
  - puntos a redimir;
  - nota opcional.
- Usar endpoint existente:
  - `POST /api/companies/{companyId}/redemptions`
- Refrescar puntos del cliente despues de redimir.
- Manejar errores:
  - puntos requeridos/mayor que cero;
  - saldo insuficiente (`INSUFFICIENT_POINTS`);
  - cliente inexistente (`CUSTOMER_NOT_FOUND`);
  - validaciones de API.
- Mantener flujo de compra existente sin regresiones.
- Mantener responsive desktop/mobile.
- Actualizar mock local para redenciones si aplica.

## No tocar

- No implementar login/auth.
- No cambiar contratos API salvo bloqueo real.
- No crear recursos Azure.
- No guardar secretos.
- No implementar historial completo si no hace falta para redimir.

## Consideraciones tecnicas

- La API ya tiene contrato para redenciones:
  - `POST /api/companies/{companyId}/redemptions`
- La API ya tiene contrato para saldo:
  - `GET /api/companies/{companyId}/customers/{customerId}/balance`
- Si aparece bloqueo de API, documentarlo con endpoint, payload, response y pasos reproducibles.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-050-HANDOFF.md
```

Incluye:

- URL/ambiente probado.
- Cambios realizados.
- Evidencia de redimir puntos exitosamente.
- Evidencia de saldo actualizado.
- Evidencia de saldo insuficiente.
- Evidencia de validaciones de redencion.
- Confirmacion de que compra sigue funcionando.
- Pendientes o bloqueos si aparecen.
