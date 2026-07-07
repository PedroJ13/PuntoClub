# TASK-838 - Handoff

Nombre del Equipo: Product / Architect / Release
Modo: Release decision
Fecha: 2026-07-07

Resultado:
- Decision aprobada: publicar API/Web para persistencia visible de logo de empresa.
- Se revisaron los handoffs TASK-834, TASK-835, TASK-836 y TASK-837.
- Actualizacion posterior: TASK-835 ya fue completada con consulta read-only de Azure SQL y confirmo que Aurisbel tiene metadata de logo persistida.
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
- Aprobado publicar API/Web.
- Publicacion ya ejecutada en commit `9e86733cb16a44e2ebb7dd5bf04d0bf0d7a06367`.
- Workflows verificados:
  - Deploy Punto Club frontend: success.
  - Deploy Punto Club API: success.

Restricciones:
- No cambiar SQL.
- No cambiar Storage.
- No cambiar ACS, sender ni flags.
- No subir, reemplazar ni borrar logos durante release.
- Mantener fuera archivos no relacionados y handoffs antiguos no solicitados.

Uso Azure SQL:
- No para la decision de release.
- TASK-835 si uso Azure SQL en modo read-only, con regla temporal retirada y lock restaurado, para confirmar metadata de logo de Aurisbel.

Riesgos o pendientes:
- Requiere QA publicada posterior para confirmar que, despues de subir logo, `Actualizar`, refresh y logout/login conservan logo visible.
- Puede quedar un logo QA subido durante TASK-837, pero no se borro ni reemplazo durante esta decision.

Siguiente recomendado:
- Ejecutar QA publicada posterior a `9e86733`.
