# TASK-486 - Definir condiciones del primer dry-run real legacy

Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Preparacion
Estado: Ready
Prioridad: P1 decision previa a datos reales
Depende de: TASK-485

## Objetivo

Procesar el cierre local de TASK-480 a TASK-485 y definir las condiciones exactas para un primer dry-run real de migracion legacy, sin ejecutar todavia archivos reales ni usar Azure SQL.

## Contexto

El paquete local de migracion legacy quedo preparado y aprobado localmente:

- TASK-480 definio escenarios y contrato.
- TASK-481 preparo staging SQL seguro de forma local/documental.
- TASK-482 preparo herramienta local de dry-run CSV.
- TASK-483 detecto un P1 por desalineacion de tipos.
- TASK-484 corrigio tipos canonicos y aliases.
- TASK-485 aprobo localmente la correccion, sin P0/P1 abiertos.

Antes de usar datos reales, Product / Architect / Release debe decidir el alcance operativo:

- si el primer archivo real sera convertido a CSV o si se requiere parser `.xlsx`;
- quien provee el archivo y donde se mantiene fuera del repo;
- que empresa/sistema legacy se valida primero;
- que escenario aplica: clientes, saldo compacto, historico completo, parcial con ajuste o archivos mixtos;
- que evidencia puede quedar en handoff sin exponer datos personales.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`
- `docs/TOOLS.md`
- `tasks/TASK-480-HANDOFF.md`
- `tasks/TASK-481-HANDOFF.md`
- `tasks/TASK-482-HANDOFF.md`
- `tasks/TASK-483-HANDOFF.md`
- `tasks/TASK-484-HANDOFF.md`
- `tasks/TASK-485-HANDOFF.md`

## Alcance

1. Confirmar que el P1 de TASK-483 queda cerrado por TASK-484/TASK-485.
2. Definir si el siguiente paso es:
   - dry-run real con archivo convertido a CSV; o
   - tarea separada para soporte `.xlsx` nativo antes de cualquier archivo real.
3. Definir reglas para manejar el archivo real:
   - no subirlo al repo;
   - no registrar datos personales en handoffs;
   - usar ubicacion temporal segura;
   - borrar outputs locales si contienen datos reales;
   - conservar solo resumen redaccionado.
4. Definir escenario de migracion esperado para el primer dry-run.
5. Crear la siguiente tarea tecnica solo si la decision queda clara:
   - Backend/API para ejecutar dry-run real controlado; o
   - Backend/API para agregar parser `.xlsx` local aprobado.

## Fuera de alcance

- No ejecutar el dry-run con archivo real.
- No abrir ni inspeccionar datos reales.
- No usar Azure SQL.
- No cargar staging real.
- No crear endpoints API.
- No publicar Web/API.
- No hacer deploy.

## Criterios de aceptacion

- Queda documentada la decision del siguiente paso.
- Quedan reglas explicitas de seguridad para el archivo real.
- Si se crea una tarea siguiente, incluye equipo, modo, alcance, fuera de alcance, uso de cloud/SQL y handoff esperado.
- No se exponen datos personales ni archivos reales.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, API real, servicios externos ni datos reales.

Esta tarea es de decision/preparacion.

## Handoff esperado

Crear o actualizar `tasks/TASK-486-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Decision tomada:
Archivos cambiados:
Reglas para datos reales:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```
