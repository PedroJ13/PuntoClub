# TASK-846 - Handoff

Nombre del Equipo: Backend/API
Modo: Comunicaciones / Pacing y cola
Fecha: 2026-07-07

## Estado

Completada localmente.

## Resumen

Se implemento pacing controlado para envios promocionales sobre el retry existente.

El envio promocional sigue siendo secuencial y ahora aplica una pausa configurable entre destinatarios procesables para reducir throttling de Azure Communication Services Email.

## Cambios realizados

- `api/src/functions/promotionalCampaigns.js`
  - Agregado `getPromotionalSendPaceDelayMs`.
  - Agregado default `DEFAULT_PROMOTIONAL_SEND_PACE_DELAY_MS = 750`.
  - Agregado maximo defensivo `MAX_PROMOTIONAL_SEND_PACE_DELAY_MS = 10000`.
  - Agregado soporte de env var:
    - `PROMOTIONAL_EMAIL_SEND_PACE_DELAY_MS`
  - El loop de envio:
    - no espera antes del primer destinatario elegible;
    - espera entre destinatarios elegibles;
    - no aplica pausa por destinatarios omitidos antes de enviar;
    - conserva retry, anti-duplicado y reintento solo de fallidos.

- `api/test/promotional-campaigns.test.js`
  - Agregadas pruebas para delay default/configurado/acotado.
  - Agregada prueba de pacing entre destinatarios elegibles sin retrasar omitidos.
  - Ajustadas pruebas no relacionadas para inyectar `paceDelayMs: 0` y evitar latencia artificial en suite.

## Configuracion propuesta

Valor por defecto:

```txt
PROMOTIONAL_EMAIL_SEND_PACE_DELAY_MS=750
```

Para prueba controlada:

```txt
PROMOTIONAL_EMAIL_SEND_PACE_DELAY_MS=1000
```

Para desactivar pacing temporalmente en local/test:

```txt
PROMOTIONAL_EMAIL_SEND_PACE_DELAY_MS=0
```

El valor queda acotado a `10000` ms para evitar configuraciones accidentales demasiado largas.

## Impacto en costos

No agrega recursos cloud nuevos.

El costo directo de ACS Email no cambia por el pacing; sigue asociado a emails enviados y MB transferidos.

El impacto esperado es solo mayor tiempo de ejecucion de la Azure Function durante envios con varios destinatarios. En Consumption/Premium puede implicar costo marginal por duracion/ejecucion, pero no crea cola, storage, service bus ni otro recurso facturable.

Ejemplo con default `750 ms`:

- 10 destinatarios elegibles: ~6.75 segundos extra maximo entre envios.
- 50 destinatarios elegibles: ~36.75 segundos extra.

Para volumen mayor conviene decidir cola real posterior, por ejemplo Azure Queue/Service Bus + worker, antes de subir volumen.

## Validaciones

- `node --check api/src/functions/promotionalCampaigns.js`: OK
- `node --check api/test/promotional-campaigns.test.js`: OK
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/test/promotional-campaigns.test.js`: OK
- `npm test -- --test-name-pattern=promotional` desde `api/`: 185/185 OK

## Restricciones respetadas

- No se cambio sender.
- No se cambio DNS.
- No se cambio SQL.
- No se cambiaron flags de envio.
- No se envio ningun correo real.
- No se relajo anti-duplicado.
- No se reenvian recipients ya `sent`.
- Se mantiene reintento solo de fallidos.

## Uso Azure SQL

No se uso Azure SQL.

## Riesgos o pendientes

- El enfoque reduce velocidad para bajar probabilidad de throttling, pero no garantiza evitar todos los limites de ACS.
- La ejecucion sigue dentro de la Function; si se decide enviar cientos/miles por campana, se recomienda cola real con persistencia de trabajo y reanudacion.
- Si el timeout de la Function App fuera bajo, se debe validar el volumen maximo por envio antes de aumentar destinatarios.

## Siguiente recomendado

- Publicar junto con TASK-840/TASK-844 si Product aprueba el paquete.
- Configurar `PROMOTIONAL_EMAIL_SEND_PACE_DELAY_MS` en Azure Functions solo despues de decision Infra/Release.
- Validar con prueba PO controlada que el envio parcial registra sent/failed/skipped como antes.
