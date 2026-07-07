# TASK-838 - Handoff

Nombre del Equipo: Product / Architect / Release
Modo: Release decision
Fecha: 2026-07-07

Resultado:
- Decision aprobada: publicar API/Web para persistencia visible de logo de empresa.
- Se revisaron los handoffs TASK-834, TASK-835, TASK-836 y TASK-837.
- Alcance confirmado:
  - Backend/API corrigio `GET /api/companies/{companyId}/settings` para incluir metadata privada de logo:
    - `logoUrl`;
    - `logoContentType`;
    - `logoUpdatedAt`.
  - `logoUrl` se deriva de `logo_blob_path` y expone la ruta controlada `/api/my-company/logo`.
  - `updateCompanySettings` preserva metadata privada de logo en su respuesta.
  - Web limpia el mensaje del bloque Logo antes de recargar empresa para no dejar `Logo actualizado` junto a `Sin logo cargado`.
  - QA publicada TASK-837 no aprobo porque el fix API/Web aun no estaba publicado.

Decision:
- Aprobado avanzar con TASK-839 para commit y push controlado API/Web.

Restricciones:
- No cambiar SQL.
- No cambiar Storage.
- No cambiar ACS, sender ni flags.
- No subir, reemplazar ni borrar logos durante release.
- Mantener fuera archivos no relacionados y handoffs antiguos no solicitados.

Uso Azure SQL:
- No en esta decision.
- TASK-835 intento lectura directa y quedo bloqueada por firewall antes de ejecutar SELECT.

Riesgos o pendientes:
- Requiere QA publicada posterior para confirmar que, despues de subir logo, `Actualizar`, refresh y logout/login conservan logo visible.
- Puede quedar un logo QA subido durante TASK-837, pero no se borro ni reemplazo durante esta decision.

Siguiente recomendado:
- Ejecutar TASK-839.
- Despues, ejecutar QA publicada TASK-840.
