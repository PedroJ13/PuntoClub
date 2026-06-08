# TASK-164 - Confirmar deploy publicado de Backend auth propia

Equipo responsable: Backend API

## Dependencia

Esperar que Product / Architect / Release haya subido a `main` los cambios de TASK-160 y que TASK-163 haya aplicado la migracion SQL.

## Contexto

TASK-160 implemento endpoints de auth propia localmente y paso 79 tests, pero TASK-162 encontro `404` en API publicada.

## Objetivo

Confirmar que la API publicada contiene los endpoints de auth propia y que ya no responden `404`:

- `GET /api/me`.
- `POST /api/company-auth/login`.
- `POST /api/company-auth/logout`.
- `POST /api/company-invitations/accept`.

## Alcance

- Verificar que GitHub Actions/API deploy haya corrido despues del commit con TASK-160.
- Si hace falta, esperar/revisar workflow de deploy API.
- Ejecutar smoke seguro contra API publicada, sin tokens reales ni passwords reales.
- Validar que `404` desaparecio y que errores esperados sean controlados (`401`, `400`, `200 valid=false`, etc.).
- No usar ni imprimir `INTERNAL_ADMIN_TOKEN` salvo que sea estrictamente necesario para diagnostico interno, y nunca pegarlo en handoff.

## Entregable

Crear o actualizar `tasks/TASK-164-HANDOFF.md` con:

- Resultado.
- Commit/run validado si aplica.
- Respuestas publicadas observadas.
- Riesgos o bloqueos.
