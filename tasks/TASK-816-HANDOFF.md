Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-816 - Decidir publicacion de KPIs reales de comunicaciones

Resultado:
- Decision aprobada para publicar API/Web de KPIs reales del centro de comunicaciones.
- No se requiere migracion SQL.
- No se cambia ACS, sender ni flags.
- No se envian correos reales.

Handoffs revisados:
- TASK-812:
  - Definio KPIs reales: Operativos, Suscritos, Bajas y Promociones.
  - Confirmo que deben ser datos reales de la empresa autenticada, no placeholders.
- TASK-813:
  - Backend/API implemento `GET /api/companies/{companyId}/communications/summary`.
  - Endpoint valida empresa autenticada y no confia en `companyId` del frontend.
  - Calcula conteos server-side.
  - Suite API completa: 177/177 pass.
- TASK-814:
  - Web reemplazo KPIs estaticos por consumo del endpoint real.
  - Loading muestra `...`.
  - Error muestra `-` y evita numeros falsos.
- TASK-815:
  - QA local/mock aprobo.
  - Verifico que ya no aparecen placeholders antiguos `5`, `128`, `9`.
  - Verifico cambio dinamico de Suscritos/Bajas en mock.
  - Verifico responsive desktop/mobile.

Decision:
- Se autoriza ejecutar TASK-817.
- Publicar API/Web del paquete de KPIs reales.
- Verificar workflows API y Web hasta success.

Archivos esperados:
- `api/package.json`
- `api/src/functions/communicationsSummary.js`
- `api/src/lib/repository.js`
- `api/test/communications-summary.test.js`
- `api/test/repository-customer-search.test.js`
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `tasks/TASK-812-HANDOFF.md`
- `tasks/TASK-813-HANDOFF.md`
- `tasks/TASK-814-HANDOFF.md`
- `tasks/TASK-815-HANDOFF.md`
- `tasks/TASK-816-HANDOFF.md`

Exclusiones:
- `debug.log`
- `tmp/`
- `tasks/TASK-779-HANDOFF.md`
- `tasks/TASK-810-HANDOFF.md`
- `tasks/TASK-811-HANDOFF.md`
- archivos no relacionados

Condiciones:
- Ejecutar validaciones focales y/o suite API antes del commit.
- Pushear a `origin/main`.
- Verificar workflows API y Web hasta success.
- No enviar correos reales.

Uso Azure SQL:
- No.
- Motivo: decision de release API/Web sin migracion SQL.

P0/P1:
- Ninguno.

Riesgos o pendientes:
- Falta validar los KPIs contra ambiente publicado y datos reales despues del release.
- QA publicada debe confirmar que no aparecen placeholders y que los valores son coherentes.

Siguiente recomendado:
- Ejecutar TASK-817.
- Luego ejecutar QA publicada TASK-818.
