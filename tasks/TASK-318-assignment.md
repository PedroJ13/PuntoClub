# TASK-318 - Corregir smoke API por empresa piloto inexistente

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API + SQL validacion
Round: 54
Depende de: TASK-317
Estado: Assigned
Prioridad: P1 release-blocker

## Objetivo

Resolver el fallo actual del workflow `Deploy Punto Club API`, donde el smoke test ya alcanza la API/DB pero falla porque `GET /companies/1/settings` devuelve `404 COMPANY_NOT_FOUND`.

## Contexto

El ultimo reintento del workflow cambio de error:

Antes:

```text
GET /companies/1/settings expected 200, got 500: INTERNAL_ERROR
```

Ahora:

```text
GET /companies/1/settings expected 200, got 404: {"error":{"code":"COMPANY_NOT_FOUND","message":"Company was not found."}}
```

Esto indica que Azure SQL/API ya responden, pero el smoke test esta usando `PILOT_COMPANY_ID=1` y esa empresa no existe o no esta activa en la base actual.

Smoke test afectado:

- `api/scripts/smoke-test.js`
- default: `const companyId = process.env.PILOT_COMPANY_ID || '1';`

## Documentos a leer

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `tasks/TASK-314-HANDOFF.md`
- `tasks/TASK-317-HANDOFF.md` si existe
- `.github/workflows/azure-functions-api.yml`
- `api/scripts/smoke-test.js`
- scripts/seed/migraciones relacionados con empresas piloto

## Alcance

1. Confirmar en Azure SQL que empresas existen actualmente y cuales estan `active`, sin exponer secretos.
2. Decidir la correccion mas segura:
   - Opcion A: restaurar/crear una empresa piloto estable con `id=1` si el modelo/proyecto lo requiere.
   - Opcion B: configurar `PILOT_COMPANY_ID` del workflow con un `companyId` real y activo.
   - Opcion C: ajustar el smoke test para descubrir/usar una empresa activa de smoke de forma controlada, si es mas robusto.
3. No borrar datos ni cambiar empresas reales sin aprobacion explicita.
4. Aplicar la solucion minima y documentarla.
5. Reintentar `Deploy Punto Club API`.
6. Confirmar que el smoke test pasa o documentar el nuevo error exacto.

## Criterios de aceptacion

- El smoke API no depende de una empresa inexistente.
- `GET /companies/{PILOT_COMPANY_ID}/settings` responde 200 en workflow.
- Workflow `Deploy Punto Club API` termina en success o queda un nuevo bloqueo claramente documentado.
- No se exponen connection strings, tokens ni datos sensibles.
- No se crean empresas duplicadas innecesarias.

## Handoff esperado

Crear o actualizar `tasks/TASK-318-HANDOFF.md` con:

- Resultado: corregido, bloqueado o requiere decision.
- Empresa usada por smoke (`companyId` y nombre no sensible).
- Solucion aplicada: seed/config/workflow/smoke.
- Workflow run URL y estado final.
- Si falla, endpoint exacto, status y mensaje redaccionado.
