# TASK-839 - Handoff

## Estado

Completada.

## Resumen

Se commiteo y pusheo el fix de persistencia visible de logo de empresa aprobado en TASK-838.

El release publico API/Web para que la configuracion de empresa exponga metadata de logo privado desde `logo_blob_path` y para que Web limpie mensajes visuales contradictorios al actualizar la pantalla de Logo.

## Commit publicado

- Commit: `9e86733cb16a44e2ebb7dd5bf04d0bf0d7a06367`
- Rama: `main`
- Remoto: `origin/main`
- Mensaje: `Fix company logo persistence in settings`

## Archivos incluidos

- `api/src/lib/repository.js`
- `api/test/repository-formatters.test.js`
- `app/src/app.js`
- `tasks/TASK-834-HANDOFF.md`
- `tasks/TASK-835-HANDOFF.md`
- `tasks/TASK-836-HANDOFF.md`
- `tasks/TASK-837-HANDOFF.md`
- `tasks/TASK-838-HANDOFF.md`

## Validaciones locales

- `node --check api/src/lib/repository.js`: OK
- `node --check api/test/repository-formatters.test.js`: OK
- `node --check app/src/app.js`: OK
- `npx prettier --check api/src/lib/repository.js api/test/repository-formatters.test.js app/src/app.js`: OK
- `node --test api/test/repository-formatters.test.js`: 18/18 OK
- `npm --prefix api test`: 180/180 OK

## Workflows publicados

- Deploy Punto Club frontend: success
  - https://github.com/PedroJ13/PuntoClub/actions/runs/28895041274
- Deploy Punto Club API: success
  - https://github.com/PedroJ13/PuntoClub/actions/runs/28895041315

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
- No se cambio Storage.
- No se cambio ACS.
- No se cambio sender.
- No se cambiaron flags.
- No se subieron, reemplazaron ni borraron logos durante el release.
- No se enviaron correos reales.

## Siguiente paso recomendado

Crear/asignar QA publicada para revalidar que Aurisbel conserva el logo visible despues de usar `Actualizar` en `Mi empresa > Logo` y que el header mantiene logo o fallback consistente.
