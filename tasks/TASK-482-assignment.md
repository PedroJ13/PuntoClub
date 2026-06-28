# TASK-482 - Preparar herramienta local de carga Excel/CSV legacy con dry-run

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Estado: Pending TASK-480/TASK-481
Prioridad: P1 preparacion migracion
Depende de: TASK-480, TASK-481

## Objetivo

Crear una herramienta local y segura para leer Excel/CSV legacy, normalizar datos, generar reportes de validacion y preparar archivos de staging sin cargar datos reales automaticamente.

## Contexto

Los datos pueden llegar en Excel o CSV. Antes de tocar Azure SQL o tablas productivas, necesitamos una forma reproducible de:

- leer archivos;
- normalizar columnas;
- detectar errores;
- generar resumen por cliente;
- generar staging o SQL/CSV intermedio;
- correr dry-run sin secretos ni datos productivos.

## Documentos a leer

- `AGENTS.md`
- `docs/README.md`
- `docs/OPERATING_STATUS.md`
- `docs/PROJECT_OPERATING_RULES.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MIGRATION_LEGACY_PLAN.md`
- `docs/TOOLS.md`
- `tasks/TASK-480-HANDOFF.md`
- `tasks/TASK-481-HANDOFF.md`

## Alcance

1. Crear carpeta de herramientas locales para migracion, por ejemplo `tools/migration/`.
2. Crear plantillas vacias o sinteticas para:
   - clientes CSV;
   - movimientos CSV;
   - archivo compacto cliente + saldo;
   - README de columnas.
3. Crear script local de dry-run que:
   - acepte CSV y, si es viable, Excel `.xlsx`;
   - no requiera Azure SQL;
   - no use secretos;
   - valide encabezados;
   - normalice telefono/correo/nombre para matching;
   - detecte duplicados;
   - clasifique errores y warnings;
   - genere reporte local `summary.json` o `.md`;
   - genere archivo intermedio para staging, sin aplicar cambios productivos.
4. Incluir fixtures sinteticos pequenos para probar:
   - caso feliz historico;
   - caso saldo compactado;
   - duplicados;
   - movimientos sin cliente;
   - fechas invalidas.
5. Documentar comandos de uso en un README local o en `docs/TOOLS.md`.

## Fuera de alcance

- No cargar datos reales.
- No subir archivos reales al repo.
- No conectar con Azure SQL productiva.
- No exponer datos sensibles.
- No crear endpoint publico de importacion.
- No aplicar cambios a clientes o movimientos productivos.

## Criterios de aceptacion

- Existe herramienta local reproducible para dry-run.
- Existen plantillas/fixtures sinteticos.
- El script genera reporte claro de errores/warnings/resumen.
- El script falla de forma entendible ante columnas faltantes o archivo invalido.
- La documentacion explica como usarlo sin Azure ni secretos.
- No se agregan datos reales al repo.

## Uso de cloud / SQL / servicios externos

No usar Azure, Azure SQL ni servicios externos.

Todo debe correr localmente con datos sinteticos.

## Handoff esperado

Crear o actualizar `tasks/TASK-482-HANDOFF.md` con:

```text
Equipo:
Modo de ejecucion:
Tarea:
Resultado:
Archivos cambiados:
Verificacion ejecutada:
Evidencia:
Uso cloud/SQL:
Riesgos o pendientes:
Siguiente recomendado:
Movimiento de tablero sugerido:
```

