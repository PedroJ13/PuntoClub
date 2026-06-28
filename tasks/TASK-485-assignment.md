# TASK-485 - QA local de correccion de tipos legacy

Equipo: QA
Modo de ejecucion: QA local
Estado: Pending TASK-484
Prioridad: P1 QA local
Depende de: TASK-484

## Objetivo

Revalidar localmente el paquete de migracion legacy despues de la correccion de tipos de movimiento, confirmando que el P1 de TASK-483 queda cerrado.

## Contexto

TASK-483 no aprobo porque habia diferencia entre los tipos soportados por el plan y los tipos aceptados por la herramienta. TASK-484 debe corregir esa alineacion.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `docs/DATA_MIGRATION_LEGACY_SQL_STAGING.md`
- `docs/TOOLS.md`
- `tasks/TASK-483-HANDOFF.md`
- `tasks/TASK-484-HANDOFF.md`

## Alcance

1. Reejecutar los checks principales de TASK-483.
2. Validar explicitamente que son aceptados:
   - `purchase`;
   - `redemption`;
   - `points_adjustment_positive`;
   - `points_adjustment_negative`;
   - `legacy_balance_import`;
   - `legacy_balance_reconciliation`.
3. Validar que aliases permitidos son aceptados y normalizados:
   - `redeem`;
   - `balance_snapshot`.
4. Validar que un tipo desconocido sigue fallando de forma controlada.
5. Validar que `.xlsx` no queda aprobado como soporte nativo, pero el error es claro y sin stack trace innecesario si TASK-484 lo corrige.
6. Confirmar que no se usa Azure, Azure SQL ni datos reales.
7. Clasificar hallazgos P0/P1/P2/P3.

## Fuera de alcance

- No corregir codigo.
- No implementar parser `.xlsx`.
- No usar Azure SQL.
- No cargar archivos reales.
- No aprobar importacion productiva.
- No hacer deploy.

## Criterios de aceptacion

- El P1 de TASK-483 queda cerrado.
- No hay P0/P1 abiertos para ejecutar un dry-run futuro con archivo real convertido a CSV.
- Los casos sinteticos pasan o fallan de forma esperada.
- El handoff declara limitaciones sobre Excel, datos reales y SQL.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL, API real, servicios externos ni datos reales.

Validacion local con fixtures sinteticos.

## Handoff esperado

Crear o actualizar `tasks/TASK-485-HANDOFF.md` con:

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

