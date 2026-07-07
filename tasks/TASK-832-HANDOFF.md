# TASK-832 - Handoff

Nombre del Equipo: Product / Architect / Release
Modo: Release decision
Fecha: 2026-07-07

Resultado:
- Decision aprobada: publicar Web para fallback robusto de logo de empresa.
- Se revisaron los handoffs TASK-829, TASK-830 y TASK-831.
- Alcance confirmado:
  - TASK-829 quedo bloqueada por firewall antes de ejecutar SELECT en Azure SQL.
  - TASK-830 corrigio fallback Web cuando falla la carga de imagen de logo.
  - En `Mi empresa > Logo`, si `/api/my-company/logo` no carga, se oculta la imagen y se muestra mensaje claro.
  - En el encabezado superior derecho, si el logo falla al cargar, se oculta la imagen y vuelve el fallback de iniciales.
  - QA publicada valido Aurisbel sin logo visible, con fallback consistente `AP`, sin errores visibles.

Decision:
- Aprobado avanzar con TASK-833 para commit y push controlado Web.
- Alcance de publicacion: Web/UI solamente.

Restricciones:
- No cambiar API.
- No cambiar SQL.
- No cambiar Storage.
- No cambiar ACS, sender ni flags.
- No subir, reemplazar ni borrar logos.
- Mantener fuera archivos no relacionados y handoffs antiguos no solicitados.

Uso Azure SQL:
- No en esta decision.
- Se proceso evidencia de TASK-829, donde el intento read-only fue bloqueado por firewall antes de ejecutar consulta.

Riesgos o pendientes:
- Si Aurisbel deberia tener logo real, queda pendiente diagnostico de metadata/blob desde un entorno permitido o una ventana SQL aprobada.
- El release actual solo mejora el comportamiento visual/fallback ante ausencia o fallo de logo.

Siguiente recomendado:
- Ejecutar TASK-833.
