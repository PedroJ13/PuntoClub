Equipo: QA
Modo de ejecucion: Datos / Validacion post-limpieza publicada
Tarea completada: TASK-760 - Revalidar limpieza promocional aplicada

Ambiente:
- Web publicada: `https://puntoclubcr.com/app?cb=task760`
- API publicada: `https://api.puntoclubcr.com/api`
- Azure SQL: `sqlserver-pj13-brazil.database.windows.net` / `sql-db-puntoclub`
- Sesion real/controlada: Aurisbel Pasteleria (`company_id = 8`)

Archivos cambiados:
- `tasks/TASK-760-HANDOFF.md`

Evidencia local generada:
- `tmp/task760/task760-readonly-validation.json`
- `tmp/task760/task760-after-ui-readonly-validation.json`

Verificacion ejecutada:
- Lectura de `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `chat-start/QA.md`, `docs/QA_TEST_PLAN.md`, `docs/AZURE_SQL_COST_GUARDRAILS.md` y `tasks/TASK-759-HANDOFF.md`.
- Apertura de Web publicada con cache-buster.
- Confirmacion de sesion real/controlada en UI publicada.
- Navegacion a `Enviar campanas`.
- Validacion visual de pantalla:
  - modulo `Enviar campanas` disponible;
  - cuatro subnavs visibles: `Enviar campanas`, `Crear / actualizar campanas`, `Clientes`, `Historial`;
  - selector/lista de campanas disponible;
  - panel `Seleccionar destinatarios` disponible.
- Accion segura sin envio:
  - click en `Seleccionar elegibles`;
  - contador subio a `5 seleccionados de 5`;
  - no aparecio copy de bloqueo por destinatario ya enviado/incluido;
  - no se hizo click en `Enviar campana`;
  - click en `Limpiar seleccion`;
  - contador volvio a `0 seleccionados de 5`;
  - boton exacto `Enviar campana` quedo deshabilitado.
- Validacion read-only en Azure SQL antes/despues de la prueba UI:
  - `dbo.PromotionalCampaignRecipients`;
  - campanas afectadas por TASK-759;
  - clientes elegibles;
  - preferencias promocionales;
  - eventos de baja promocional;
  - conteos de clientes, compras, canjes, membresias e imagenes.

Resultado:
- Aprobado QA para el alcance de TASK-760.
- `dbo.PromotionalCampaignRecipients` quedo en `0` antes y despues de la validacion UI.
- Las campanas afectadas por TASK-759 siguen en `draft`, con `recipient_count = 0`.
- La UI publicada permite seleccionar destinatarios elegibles para nuevas pruebas:
  - `Seleccionar elegibles` llevo la seleccion a `5 seleccionados de 5`.
  - No se observo bloqueo visible de `ya enviado` / `ya incluido`.
- La seleccion fue limpiada al cierre:
  - `0 seleccionados de 5`.
  - `Enviar campana` deshabilitado.
- No se enviaron correos reales.
- No se crearon nuevos recipients ni envios durante QA.

Validacion de datos:
- Clientes `company_id = 8`:
  - total clientes: `10`;
  - clientes con email valido: `10`;
  - clientes elegibles para seleccion promocional: `10`;
  - clientes sin email valido: `0`;
  - clientes dados de baja: `0`;
  - clientes suprimidos: `0`;
  - saldo total de puntos observado: `2641`.
- Preferencias promocionales:
  - `subscribed`: `2`.
- Bajas promocionales:
  - eventos totales: `2`;
  - eventos con `recipient_id`: `0`;
  - eventos sin `recipient_id`: `2`.
- Conteos operativos observados para `company_id = 8`:
  - `Customers`: `10`;
  - `Purchases`: `11`;
  - `Redemptions`: `1`;
  - `MembershipPlans`: `0`;
  - `CustomerMemberships`: `0`;
  - `MembershipTransactions`: `0`;
  - `MembershipBenefitUsages`: `0`;
  - `PromotionalCampaignImages`: `7`.

P0/P1:
- Ninguno abierto.

P2/P3:
- Ninguno nuevo.

Uso Azure SQL:
- Si.
- Motivo: TASK-760 pidio validar post-limpieza aplicada en ambiente publicado/real.
- Alcance: SELECTs read-only agregados y validacion post-UI corta.

Firewall / locks:
- Se creo regla temporal estrecha:
  - `tmp-task760-qa-readonly-200-229-6-68`
  - IP: `200.229.6.68`
- Para retirar la regla fue necesario retirar temporalmente el lock del SQL Server:
  - `puntoclub-sqlserver-cannotdelete`
- Se elimino la regla temporal.
- Verificacion final de la regla temporal: `[]`.
- Se restauro el lock del servidor con nivel `CanNotDelete` y la nota original.

Riesgos o pendientes:
- La evidencia local evita datos personales innecesarios. La validacion UI mostro datos reales en pantalla, pero no se copiaron al handoff.
- No se hizo prueba de envio real por restriccion explicita de TASK-760.

Siguiente recomendado:
- Product / Architect / Release puede cerrar el bloque de limpieza promocional.
- Si se requiere una prueba de envio real posterior, abrir tarea separada con destinatarios controlados y autorizacion explicita del Product Owner.
