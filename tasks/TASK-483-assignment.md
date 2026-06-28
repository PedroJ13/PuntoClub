# TASK-483 - QA local del paquete de migracion legacy

Equipo: QA
Modo de ejecucion: QA local
Estado: Pending TASK-481/TASK-482
Prioridad: P1 QA local
Depende de: TASK-481, TASK-482

## Objetivo

Validar localmente que el paquete de migracion legacy permite preparar y revisar archivos Excel/CSV con datos sinteticos, sin tocar Azure SQL ni datos reales.

## Contexto

SQL DEV y Backend/API deben entregar staging, scripts, plantillas y herramienta de dry-run. QA debe confirmar que el flujo es reproducible y que los errores salen claros antes de usar archivos reales.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `docs/TOOLS.md`
- `tasks/TASK-481-HANDOFF.md`
- `tasks/TASK-482-HANDOFF.md`

## Alcance

1. Ejecutar comandos locales documentados para el paquete de migracion.
2. Validar al menos estos casos sinteticos:
   - clientes + historico correcto;
   - clientes + saldo compactado;
   - cliente duplicado;
   - movimiento sin cliente;
   - fecha invalida;
   - columnas faltantes;
   - tipo de movimiento desconocido.
3. Confirmar que el dry-run no requiere Azure SQL ni secretos.
4. Confirmar que no se agregan datos reales ni archivos sensibles al repo.
5. Revisar que los reportes de validacion sean entendibles para Product/PO.
6. Clasificar hallazgos P0/P1/P2/P3.

## Fuera de alcance

- No corregir codigo.
- No usar Azure SQL productiva.
- No cargar datos reales.
- No hacer deploy.
- No aprobar importacion final a produccion.

## Criterios de aceptacion

- QA puede ejecutar el flujo local desde cero con fixtures sinteticos.
- Los casos felices generan resumen correcto.
- Los casos con error fallan de forma controlada y entendible.
- No hay P0/P1 abiertos para preparar un dry-run con archivo real en una tarea futura.
- El handoff declara limitaciones y siguiente paso.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL ni servicios externos.

La validacion debe ser local y con fixtures sinteticos.

## Handoff esperado

Crear o actualizar `tasks/TASK-483-HANDOFF.md` con:

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

