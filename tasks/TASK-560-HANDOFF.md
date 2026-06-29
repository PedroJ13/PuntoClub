Equipo: QA
Tarea validada: TASK-560 - Ejecutar prueba visual real de correos operativos con DEMO 1
Ambiente: Web/API publicadas de Punto Club (`https://puntoclubcr.com/` y `https://func-puntoclub-prod-br-001.azurewebsites.net/api`), empresa `DEMO 1` (`companyId=6`), cliente existente autorizado asociado a `pj13eros@hotmail.com`. Ejecucion real controlada por autorizacion de TASK-559.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `tasks/TASK-558-HANDOFF.md` y `tasks/TASK-559-HANDOFF.md`.
- Confirmada autorizacion de TASK-559:
  - empresa objetivo `DEMO 1`, `companyId=6`;
  - cliente existente autorizado asociado a `pj13eros@hotmail.com`;
  - maximo 3 correos reales;
  - no enviar a otros correos;
  - bienvenida solo si no duplica datos.
- Precheck HTTP read-only:
  - `GET /api/companies/6/settings`;
  - `GET /api/companies/6/operational-email-settings`;
  - `GET /api/companies/6/customers?search=<mailbox autorizado>`;
  - `GET /api/companies/6/customers/102/balance`;
  - `GET /api/companies/6/customers/102/activity`.
- Ejecucion real autorizada:
  - `POST /api/companies/6/purchases` con factura `QA-EMAIL-559`, monto `10000`, fecha `2026-06-29`, cliente `102`;
  - `POST /api/companies/6/redemptions` con `100` puntos, nota `QA correo operativo TASK-559`, cliente `102`.
- Verificacion posterior:
  - balance despues de compra;
  - balance despues de canje;
  - actividad del cliente;
  - recepcion visual de correos mediante capturas proporcionadas por el Product Owner/mailbox controlado.

Hallazgos:
- `DEMO 1` esta activa y corresponde a `companyId=6`.
- Settings operativos publicados estaban activos antes de ejecutar:
  - `welcomeEnabled=true`;
  - `purchaseEnabled=true`;
  - `redemptionEnabled=true`;
  - `replyToEmail=null`.
- Cliente autorizado encontrado:
  - `customerId=102`;
  - nombre mostrado por API: `Pedro Gutierrez`;
  - correo coincide con el mailbox autorizado.
- Bienvenida no se ejecuto:
  - el cliente ya existia;
  - crear otro cliente para forzar bienvenida habria duplicado datos o requerido otro correo, fuera del alcance seguro definido por TASK-559.
- Compra real:
  - API respondio `201`;
  - compra creada con `id=98`;
  - factura `QA-EMAIL-559`;
  - puntos ganados `500`.
- Canje real:
  - API respondio `201`;
  - canje creado con `id=70`;
  - puntos redimidos `100`;
  - saldo final `400`.
- Recepcion de correo de compra confirmada por captura:
  - remitente/display name visible: Punto Club;
  - empresa: `DEMO 1`;
  - titulo: `Puntos ganados`;
  - monto: `₡10 000,00`;
  - puntos ganados: `500`;
  - saldo total: `500 puntos`;
  - formato legible en tema oscuro.
- Recepcion de correo de canje confirmada por captura:
  - remitente/display name visible: Punto Club;
  - empresa: `DEMO 1`;
  - titulo: `Canje registrado`;
  - puntos redimidos: `100`;
  - saldo total: `400 puntos`;
  - formato legible en tema oscuro.
- No se ejecutaron promociones ni campanas.
- No se enviaron correos a otros destinatarios desde esta QA.

P0/P1:
- No se encontraron P0/P1 abiertos.

P2/P3:
- P3: el remitente se visualiza como `Punto Club<DoNotReply@...>` sin espacio entre display name y direccion. No bloquea la prueba, pero conviene pulir el formato visible del remitente si ACS/configuracion lo permite.
- P3: el subject no fue verificable con las capturas entregadas; se valido remitente, contenido y apariencia del cuerpo.

Evidencia:
- Precheck:
  - `GET /api/companies/6/settings` -> `200`, `name=DEMO 1`, `status=active`, `pointsPercentage=5`.
  - `GET /api/companies/6/operational-email-settings` -> `200`, switches `true/true/true`.
  - `GET /api/companies/6/customers?search=<mailbox autorizado>` -> `200`, cliente `102`.
  - Balance inicial cliente `102`: `pointsEarned=0`, `pointsRedeemed=0`, `pointsBalance=0`.
  - Actividad inicial cliente `102`: `items=[]`.
- Compra:
  - `POST /api/companies/6/purchases` -> `201`.
  - Respuesta: `id=98`, `invoiceNumber=QA-EMAIL-559`, `amount=10000`, `pointsEarned=500`.
  - Balance despues de compra: `pointsEarned=500`, `pointsRedeemed=0`, `pointsBalance=500`.
- Canje:
  - `POST /api/companies/6/redemptions` -> `201`.
  - Respuesta: `id=70`, `pointsRedeemed=100`, `balanceAfter=400`.
  - Balance final: `pointsEarned=500`, `pointsRedeemed=100`, `pointsBalance=400`.
  - Actividad final contiene compra `QA-EMAIL-559` y canje `id=70`.
- Capturas recibidas del mailbox controlado:
  - correo de canje: `codex-clipboard-b7473389-1f54-4509-9519-efe9cb0c6606.png`;
  - correo de compra: `codex-clipboard-960aa847-f597-45e3-9fc5-b51ae8d974ff.png`.

Uso DB cloud: Si, motivo y alcance: se uso la API publicada contra datos reales autorizados de `DEMO 1` para crear una compra y un canje del cliente `102`, lo cual escribe en la base cloud por el flujo normal de la aplicacion y dispara correos operativos reales best-effort. No se hizo conexion SQL directa, no se ejecutaron consultas SQL manuales y no se imprimieron secretos.

Riesgos o pendientes:
- Bienvenida queda no ejecutada/no aplicable en esta prueba porque el cliente ya existia y TASK-559 pidio reutilizarlo.
- Si se requiere validar bienvenida real, crear tarea separada con autorizacion explicita para un cliente nuevo controlado y confirmar si puede usarse el mismo mailbox sin generar confusion de datos.
- El remitente visible tiene un detalle menor de formato (`Punto Club<...>`).
- No se valido subject por falta de vista/listado de asunto en las capturas compartidas.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-560 como QA real controlada aprobada con observaciones.
- Si se desea cierre visual completo de email, crear ajuste menor para remitente/subject y una revalidacion focal con mailbox controlado.
