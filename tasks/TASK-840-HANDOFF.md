# TASK-840 - Handoff

Nombre del Equipo: Backend/API
Modo: Comunicaciones / Resiliencia envio
Fecha: 2026-07-07

## Estado

Completada localmente.

## Resumen

Se implemento manejo robusto para envios promocionales parciales ante errores transitorios/throttling de Azure Communication Services Email.

El flujo ahora:

- Reintenta errores transitorios de envio con backoff controlado antes de marcar fallo.
- Sanitiza el motivo tecnico guardado para no persistir mensajes crudos del proveedor.
- Permite reintentar solo destinatarios fallidos con `retryFailedOnly: true`.
- No reenvia destinatarios que ya quedaron en estado `sent`.
- Mantiene la proteccion anti-duplicado existente para selecciones nuevas.
- No aumenta volumen por decision de producto; el retry local usa intentos acotados por destinatario.

## Cambios realizados

- `api/src/functions/promotionalCampaigns.js`
  - Agregado `sendPromotionalEmailWithRetry`.
  - Agregada clasificacion de errores transitorios:
    - `try again after`;
    - throttling/rate limit;
    - timeouts;
    - errores 429/5xx transitorios.
  - Agregado guardado de errores seguros:
    - `acs_email_throttled_retry_exhausted`;
    - `acs_email_transient_retry_exhausted`;
    - `send_failed`.
  - `sendPromotionalCampaignToRecipients` acepta `retryFailedOnly`.
  - El endpoint `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/send` pasa `retryFailedOnly` desde el payload validado.

- `api/src/lib/repository.js`
  - Agregado `preparePromotionalCampaignFailedRetry(companyId, campaignId)`.
  - Reabre solo recipients `failed` a `pending`.
  - Solo permite preparar reintentos en campanas con estado `sent`, `failed` o `ready`.
  - Limpia provider/message/error de esos recipients fallidos antes del reintento.
  - No toca recipients `sent`, `skipped` ni datos de clientes.
  - Exportado el nuevo metodo en el repository adapter.

- `api/src/lib/validators.js`
  - `validatePromotionalSendPayload` ahora acepta dos modos:
    - envio normal: `confirmSend: true` + `customerIds`;
    - reintento de fallidos: `confirmSend: true` + `retryFailedOnly: true`.
  - Rechaza mezclar `retryFailedOnly` con `customerIds`.

- `api/test/promotional-campaigns.test.js`
  - Agregadas pruebas de payload `retryFailedOnly`.
  - Agregada prueba de retry exitoso despues de throttling transitorio.
  - Agregada prueba de error seguro al agotar retries.
  - Agregada prueba de reintento solo de fallidos sin llamar `replacePromotionalCampaignRecipients`.
  - Agregado check de export del nuevo metodo de repositorio.

## Contrato API local

Envio normal existente:

```json
{
  "confirmSend": true,
  "customerIds": [101, 102]
}
```

Nuevo reintento solo de fallidos:

```json
{
  "confirmSend": true,
  "retryFailedOnly": true
}
```

Respuesta esperada:

- Mantiene el formato actual con `campaign`, `summary` y `recipients`.
- `summary.selected` representa solo los recipients pendientes del intento actual.
- Si no existen fallidos para reintentar, responde error controlado `PROMOTIONAL_FAILED_RECIPIENTS_REQUIRED`.

## Validaciones

- `node --check api/src/functions/promotionalCampaigns.js`: OK
- `node --check api/src/lib/repository.js`: OK
- `node --check api/src/lib/validators.js`: OK
- `node --check api/test/promotional-campaigns.test.js`: OK
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/src/lib/validators.js api/test/promotional-campaigns.test.js`: OK
- `npm test -- --test-name-pattern=promotional` desde `api/`: 183/183 OK

## Restricciones respetadas

- No se envio ningun correo real.
- No se cambio SQL/migraciones.
- No se cambio ACS, sender ni flags.
- No se cambio Web/UI.
- No se tocaron secretos.
- No se relajo anti-duplicado.

## Uso Azure SQL

No se uso Azure SQL. La tarea se resolvio con codigo y pruebas locales.

## Riesgos o pendientes

- El reintento queda disponible a nivel API, pero Web aun no tiene boton/flujo dedicado para "reintentar fallidos".
- El backoff es intencionalmente corto y acotado para MVP; si Product decide volumen mayor, conviene mover a cola/job con limites por ventana.
- QA publicada debe validar el flujo con un caso controlado y sin envio masivo.

## Siguiente recomendado

- Crear tarea Web si se requiere boton visible para reintentar solo fallidos desde historial/resultado.
- Crear decision de release para publicar el cambio Backend/API.
