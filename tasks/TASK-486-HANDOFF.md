Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Preparacion
Tarea: TASK-486 - Definir condiciones del primer dry-run real legacy
Resultado: completada

Decision tomada:
- El primer dry-run real legacy se hara con CSV.
- Si el proveedor entrega `.xlsx`, primero se convierte a CSV.
- No se agrega parser `.xlsx` nativo antes del primer dry-run, salvo que el proveedor no pueda entregar/exportar CSV.
- El archivo real y sus outputs no deben guardarse ni commitearse en el repo.
- La evidencia de handoff debe ser redaccionada, sin PII.

Archivos cambiados:
- `docs/DATA_MIGRATION_FIRST_REAL_DRY_RUN.md`
- `tasks/TASK-486-HANDOFF.md`
- `tasks/TASK-487-assignment.md`

Reglas para datos reales:
- No subir archivos reales al repo.
- No pegar datos personales en chats, docs, tareas ni handoffs.
- Usar ruta segura fuera del repo, preferida: `C:\Work\SecureInputs\PuntoClub\legacy\<empresa>\<batch>\`.
- Ejecutar solo dry-run local; no Azure SQL, no API real, no staging productivo.
- Registrar solo conteos, tipos de errores/warnings y ejemplos redaccionados.
- Borrar o conservar temporalmente outputs reales solo con decision explicita del responsable.
- Rechazar el archivo si contiene passwords, tarjetas, documentos sensibles no necesarios o datos de otra empresa.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se uso API real.
- No se usaron datos reales.
- La tarea fue documental y local.

Riesgos o pendientes:
- P2: `.xlsx` sigue sin soporte nativo; requiere conversion a CSV o tarea posterior.
- P2: aun no se conoce el formato real del proveedor legacy.
- P2: antes del dry-run real se debe confirmar empresa destino, sistema legacy y escenario.
- P3: la ruta segura propuesta puede ajustarse si el Product Owner define otra ubicacion local privada.

Siguiente recomendado:
- Ejecutar TASK-487 cuando exista archivo real convertido a CSV y el Product Owner confirme empresa destino, source system y escenario.
- Si el proveedor solo entrega `.xlsx`, crear una tarea separada para parser `.xlsx` antes de TASK-487.

Movimiento de tablero sugerido:
- Mover TASK-486 a Needs Review / Done.

