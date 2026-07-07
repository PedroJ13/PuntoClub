Equipo: QA
Tarea validada: TASK-815 - Validar KPIs reales de comunicaciones
Ambiente: Local/mock en `http://127.0.0.1:4176`, API tests locales, Playwright local headless desktop/mobile. No Azure SQL.
Resultado: aprobado

Checks ejecutados:
- Lectura de handoffs previos TASK-812, TASK-813 y TASK-814 para confirmar definicion funcional, endpoint y cambios Web.
- Sintaxis:
  - `node --check api/src/functions/communicationsSummary.js`
  - `node --check api/src/lib/repository.js`
  - `node --check app/src/app.js`
  - `node --check app/src/customerApi.js`
- Tests focales:
  - `node --test api/test/communications-summary.test.js api/test/repository-customer-search.test.js`
- Regresion API:
  - `npm --prefix api test`
- Limpieza de diff:
  - `git diff --check`
- UI local/mock:
  - Login mock local.
  - Navegacion a `Enviar campanas`.
  - Lectura de KPIs en desktop.
  - Baja promocional mock desde pestaña `Clientes`.
  - Revalidacion de KPIs despues de cambio de preferencia.
  - Responsive basico desktop `1265x720` y mobile `390x844`.
- Revision de fallback seguro en Web:
  - `renderCommunicationsSummaryLoading()` muestra `...`.
  - `renderCommunicationsSummaryError()` vuelve a `-`.
  - No se detectan numeros falsos en error/carga por codigo.

Hallazgos:
- Los KPIs ya no muestran los placeholders estaticos antiguos `5`, `128`, `9`.
- En mock local inicial los KPIs renderizan datos coherentes:
  - Operativos: `3`
  - Suscritos: `2`
  - Bajas: `0`
  - Promociones: `Pausadas`
- El resumen cambia con datos mock reales: al registrar una baja promocional, `Suscritos` cambia de `2` a `1` y `Bajas` de `0` a `1`.
- Los tests validan que el endpoint exige sesion, rechaza companyId distinto y usa la empresa de la sesion.
- Los tests validan que `Suscritos` cuenta clientes con email valido y estado efectivo `subscribed`, y que `Bajas` cuenta `unsubscribed`.
- `Promociones` refleja el flag como `Pausadas`/`Activas` segun contrato de TASK-812/TASK-813.
- Desktop y mobile mantienen los 4 KPIs visibles sin overflow; mobile reporto contenedor dentro de viewport (`left=27`, `right=363`, viewport `390`).
- No se enviaron correos reales.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno abierto.

Evidencia:
- Tests focales: 8/8 pass.
- Suite API completa: 177/177 pass.
- `git diff --check`: sin errores; solo avisos LF/CRLF existentes en archivos tocados por otras tareas.
- Desktop mock: KPIs `3 / 2 / 0 / Pausadas`, sin errores visibles.
- Mobile mock: KPIs `3 / 2 / 0 / Pausadas`, 4 tarjetas visibles, sin overflow.
- Baja mock: antes `Suscritos=2`, `Bajas=0`; despues `Suscritos=1`, `Bajas=1`; mensaje visible `Baja promocional registrada. Tus puntos, beneficios e historial se mantienen.`

Uso DB cloud: No

Riesgos o pendientes:
- No se valido contra Azure SQL ni ambiente publicado por alcance explicito local/mock.
- La validacion de error de API fue por lectura de codigo del fallback Web, no por simulacion browser de endpoint fallando.
- El archivo `tasks/TASK-815.md` no existe en el workspace; se uso la asignacion pegada por el usuario como alcance.

Siguiente recomendado:
- Product / Architect / Release puede procesar el handoff. Siguiente paso natural: publicar API/Web de TASK-813/TASK-814 y abrir QA publicada si corresponde.
