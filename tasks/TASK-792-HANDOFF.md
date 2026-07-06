Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-792 - Decidir publicacion del fix destinatarios cumpleaneros

Resultado:
- Decision aprobada para publicar API/Web del fix de destinatarios cumpleaneros.
- No se cambio SQL.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Handoffs revisados:
- TASK-785:
  - QA publicada no aprobo.
  - La alerta publicada indicaba `2 clientes cumplen años hoy`.
  - El flujo dedicado de cumpleaños mostraba 19 tarjetas de destinatarios.
  - El selector de campañas ya mostraba solo campañas tipo `cumpleanos`.
- TASK-790:
  - Backend/Web corrigieron el envio de `campaignId` y `birthdayOnly`.
  - API refuerza el filtro por tipo de campaña `cumpleanos`.
  - Backend fuerza `birthdayOnly` cuando la campaña seleccionada es tipo `cumpleanos`.
  - Repositorio exige cumpleanos del dia, email valido y suscripcion promocional activa para flujo birthday-only.
  - Tests focales locales: 62/62 pass.
- TASK-791:
  - QA local/mock aprobo.
  - Alerta y destinatarios del flujo de cumpleaños coinciden.
  - No cumpleañeros no aparecen en el flujo de cumpleaños.
  - Flujo comun conserva destinatarios normales.

Decision:
- Se autoriza ejecutar TASK-793.
- Se aprueba publicar API/Web del fix.
- El alcance de publicacion debe limitarse a los cambios de TASK-790 y handoffs relacionados.

Archivos esperados en TASK-793:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`
- `api/test/repository-customer-search.test.js`
- `api/test/validators.test.js`
- `app/src/app.js`
- `app/src/customerApi.js`
- `tasks/TASK-785-HANDOFF.md`
- `tasks/TASK-789-HANDOFF.md`
- `tasks/TASK-790-HANDOFF.md`
- `tasks/TASK-791-HANDOFF.md`
- `tasks/TASK-792-HANDOFF.md`

Exclusiones:
- `debug.log`
- `tmp/`
- `tasks/TASK-779-HANDOFF.md`
- archivos no relacionados

Condiciones:
- Ejecutar validaciones focales antes del commit.
- Pushear a `origin/main`.
- Verificar workflows API y Web hasta success.
- Si un workflow falla, documentar el error y crear tarea correctiva.
- No retomar QA publicada de cumpleaños hasta tener API/Web success.

Uso Azure SQL:
- No.
- Motivo: decision de release; no se ejecuto SQL desde esta tarea.

P0/P1:
- P1 de TASK-785 queda pendiente hasta publicacion y QA publicada posterior.

Siguiente recomendado:
- Ejecutar TASK-793.
- Si TASK-793 aprueba, repetir QA publicada focal de cumpleanos.
