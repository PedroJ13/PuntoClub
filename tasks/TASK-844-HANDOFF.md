# TASK-844 - Handoff

Nombre del Equipo: Web Dev
Modo: Comunicaciones / Reintento fallidos
Fecha: 2026-07-07

## Estado

Completada localmente.

## Resumen

Se expuso en Web el flujo visible para reintentar solo destinatarios fallidos de una campana promocional usando `retryFailedOnly: true`.

El flujo ahora:

- Muestra accion `Reintentar fallidos` en el panel de resultado cuando el envio queda con fallidos.
- Muestra accion `Reintentar fallidos` desde el historial local cuando la campana seleccionada tiene recipients `failed`.
- Pide confirmacion clara antes del reintento.
- Envia al API el payload de reintento sin `customerIds`:

```json
{
  "confirmSend": true,
  "retryFailedOnly": true
}
```

- Mantiene recipients ya enviados en el historial local y solo actualiza los recipients devueltos por el reintento.
- Actualiza conteos/listas/estado despues del reintento.
- Mapea motivos tecnicos seguros de retry agotado a copy operativo en espanol.
- Soporta mock local y API real.

## Cambios realizados

- `app/index.html`
  - Agregado bloque de acciones bajo `Historial local` para mostrar reintento de fallidos cuando aplique.

- `app/src/app.js`
  - Agregadas referencias DOM para acciones de historial.
  - Agregado `retryFailedPromotionalCampaign`.
  - Agregado merge de recipients para conservar enviados previos y actualizar solo resultados del reintento.
  - Agregado render condicional de accion de reintento en historial.
  - Agregado boton de reintento en panel de resultado cuando `summary.failed > 0`.
  - Agregado copy seguro para:
    - `acs_email_throttled_retry_exhausted`;
    - `acs_email_transient_retry_exhausted`.

- `app/src/customerApi.js`
  - `sendPromotionalCampaign` ahora acepta opciones.
  - Para `retryFailedOnly`, API real envia `{ confirmSend: true, retryFailedOnly: true }`.
  - Mock local reintenta solo recipients `failed`, no toca `sent`, recalcula conteos y devuelve solo recipients reintentados.

- `app/styles.css`
  - Agregados estilos compactos para acciones de reintento en resultado e historial.

## Validaciones

- `node --check app/src/app.js`: OK
- `node --check app/src/customerApi.js`: OK
- `npx prettier --check app/index.html app/styles.css app/src/app.js app/src/customerApi.js`: OK

## Restricciones respetadas

- No se cambio Backend/API.
- No se cambio SQL.
- No se cambio ACS.
- No se cambio sender.
- No se cambiaron flags.
- No se enviaron correos reales.
- No se relajo anti-duplicado.
- No se agregaron dependencias.

## Uso Azure SQL

No se uso Azure SQL.

## Riesgos o pendientes

- Requiere QA local/publicada con una campana que tenga recipients fallidos reales o mock preparados para confirmar visualmente el boton.
- El API debe estar publicado con TASK-840 para que `retryFailedOnly: true` funcione en ambiente publicado.
- El flujo no crea fallidos artificiales desde UI; solo actua si la campana ya tiene recipients `failed`.

## Siguiente recomendado

- Product / Architect / Release debe decidir publicacion conjunta de TASK-840 y TASK-844.
- QA debe validar que el reintento no reenvia recipients `sent` y que el historial queda actualizado despues del reintento.
