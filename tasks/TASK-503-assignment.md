# TASK-503 - QA local de restauracion selectiva post-stash

Equipo: QA
Modo de ejecucion: QA local
Estado: Pending TASK-502
Prioridad: P1 QA local
Depende de: TASK-502

## Objetivo

Validar localmente que la restauracion selectiva de TASK-502 no reintrodujo archivos indebidos, datos sensibles, logs temporales ni cambios API no deseados.

## Contexto

TASK-502 debe recuperar trazabilidad y paquete de migracion legacy desde `stash@{0}` sin aplicar el stash completo. QA debe confirmar que el workspace quedo ordenado antes de cualquier commit.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `tasks/TASK-501-HANDOFF.md`
- `tasks/TASK-502-HANDOFF.md`

## Alcance

1. Revisar `git status --short`.
2. Confirmar que no se restauraron:
   - `.tmp-http-5195.err.log`;
   - `.tmp-http-5195.out.log`;
   - `debug.log`.
3. Confirmar que no hay cambios `api/**`.
4. Confirmar que `node_modules/`, `playwright-report/` y `test-results/` no estan staged ni listos para commit.
5. Revisar que `tools/migration/**` y `database/tools/**` contienen solo fixtures sinteticos o scripts, no datos reales.
6. Ejecutar checks locales disponibles si aplica:
   - `node --check tools/migration/dry-run-legacy-import.mjs` si existe;
   - `npm run migration:dry-run` con fixture sintetico si el script existe;
   - `git diff --check`.
7. Reportar P0/P1/P2/P3.

## Fuera de alcance

- No corregir codigo.
- No aplicar stash.
- No borrar archivos.
- No hacer commit.
- No hacer push.
- No usar Azure SQL.
- No hacer deploy.

## Criterios de aceptacion

- No hay P0/P1 abiertos.
- No se reintroducen logs temporales.
- No hay cambios API.
- No hay datos reales en fixtures de migracion.
- El paquete queda listo para decision de commit separado.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, GSC, Cloudflare ni servicios externos.

Validacion local solamente.

## Handoff esperado

Crear o actualizar `tasks/TASK-503-HANDOFF.md` con:

```text
Equipo: QA
Tarea validada:
Ambiente:
Resultado:
Checks ejecutados:
P0/P1:
P2/P3:
Evidencia:
Limitaciones:
Uso cloud/SQL:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

