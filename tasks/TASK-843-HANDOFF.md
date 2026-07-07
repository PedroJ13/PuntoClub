# TASK-843 - Handoff

## Estado

Completada.

## Resumen

Se publico el paquete Backend/API para retry controlado de envios promocionales ante errores transitorios/throttling de ACS.

El release incluye soporte API para:

- reintentar errores transitorios con backoff acotado;
- guardar razones tecnicas seguras;
- preparar reintento solo de destinatarios fallidos con `retryFailedOnly: true`;
- mantener proteccion anti-duplicado para destinatarios ya enviados.

## Commit publicado

- Commit: `fc44c6aa786847e50f595131fcfb8f80fc8b6333`
- Rama: `main`
- Remoto: `origin/main`
- Mensaje: `Add retry for promotional email sends`

## Archivos incluidos

- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`
- `tasks/TASK-840-HANDOFF.md`
- `tasks/TASK-841-HANDOFF.md`
- `tasks/TASK-842-HANDOFF.md`

## Validaciones locales

- `node --check api/src/functions/promotionalCampaigns.js`: OK
- `node --check api/src/lib/repository.js`: OK
- `node --check api/src/lib/validators.js`: OK
- `node --check api/test/promotional-campaigns.test.js`: OK
- `npm --prefix api test -- --test-name-pattern=promotional`: 183/183 OK

## Workflow publicado

- Deploy Punto Club API: success
  - https://github.com/PedroJ13/PuntoClub/actions/runs/28900766999

## Exclusiones confirmadas

No se incluyeron:

- `debug.log`
- `tmp/`
- `tasks/TASK-779-HANDOFF.md`
- `tasks/TASK-810-HANDOFF.md`
- `tasks/TASK-811-HANDOFF.md`
- `tasks/TASK-817-HANDOFF.md`
- `tasks/TASK-818-HANDOFF.md`
- handoffs antiguos/no relacionados

## Restricciones respetadas

- No se cambio SQL.
- No se cambio Web.
- No se cambio ACS.
- No se cambio sender.
- No se cambiaron flags.
- No se enviaron correos reales durante el release.

## Pendiente funcional

El soporte API para `retryFailedOnly` quedo publicado, pero aun no existe boton/flujo Web visible para que la empresa reintente solo fallidos desde historial/resultado.

Siguiente recomendado: ejecutar TASK-844 y luego QA TASK-845.
