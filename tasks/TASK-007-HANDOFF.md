Equipo:
Product / Architect / Release

Tarea completada:
TASK-007 - Decidir auth fase 1 y fuente confiable de companyId.

Archivos cambiados:
- docs/DECISION_LOG.md
- docs/ARCHITECTURE.md
- docs/API_CONTRACTS.md
- tasks/TASK-007-HANDOFF.md

Decision:
Fase 1 operara en modo empresa piloto unica. La fuente confiable de `companyId` sera configuracion server-side de ambiente, por ejemplo `PILOT_COMPANY_ID=1`.

Resultado:
Se mantienen rutas `/api/companies/{companyId}` para compatibilidad futura, pero Backend/API debe validar que el `companyId` del path coincide con `PILOT_COMPANY_ID`. Si no coincide, debe responder `404 COMPANY_NOT_FOUND`.

Verificacion ejecutada:
- Revisado `tasks/TASK-007.md`.
- Actualizados `docs/DECISION_LOG.md`, `docs/ARCHITECTURE.md` y `docs/API_CONTRACTS.md`.
- Confirmado que la decision desbloquea Backend/API y Web Dev sin implementar auth completa.

Riesgos o pendientes:
- El MVP no resuelve usuarios, roles, invitaciones ni multiempresa autoservicio.
- El acceso a la app piloto debe limitarse operativamente con Azure Static Web Apps o proceso controlado.
- Auth SaaS completa queda post-MVP o P1 segun necesidad del piloto.

Siguiente recomendado:
Backend/API puede cerrar TASK-009 validando `companyId` contra `PILOT_COMPANY_ID`. Web Dev puede continuar TASK-010 usando un `companyId` configurado no editable, sin tratarlo como control de seguridad.
