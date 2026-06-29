Equipo: QA
Tarea validada: TASK-556 - Validar correos operativos publicados
Ambiente: Web/API publicadas de Punto Club (`https://puntoclubcr.com/` y `https://func-puntoclub-prod-br-001.azurewebsites.net/api`), Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`, HTTP read-only y Playwright/headless contra assets publicados con mock forzado para evitar datos reales y envios reales.
Resultado: aprobado con observaciones

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `tasks/TASK-552-HANDOFF.md`, `tasks/TASK-553-HANDOFF.md`, `tasks/TASK-554-HANDOFF.md` y `tasks/TASK-555-HANDOFF.md`.
- Nota de proceso: `docs/OPERATING_STATUS.md` y `docs/PROJECT_OPERATING_RULES.md` no existen en este workspace al momento de la QA.
- HTTP read-only publicado:
  - `GET https://puntoclubcr.com/?task556=http`
  - `GET https://puntoclubcr.com/app?task556=http`
  - `GET https://puntoclubcr.com/src/app.js?task556=http`
  - `GET https://puntoclubcr.com/src/customerApi.js?task556=http`
  - `GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/companies/6/operational-email-settings?task556=read`
- Playwright/headless sobre URL publicada con `PUNTO_CLUB_USE_MOCK_API=true` interceptado en `app-config.js`, sin API real para operaciones:
  - login mock de empresa;
  - `Mi empresa > Comunicaciones`;
  - settings de bienvenida, compra y canje;
  - validacion negativa de `reply-to`;
  - guardado mock de settings;
  - `Enviar campañas` separado y con envio real bloqueado;
  - registro de cliente con correo;
  - registro de compra;
  - canje/redencion;
  - smoke responsive mobile de comunicaciones y bloqueo de campañas.

Hallazgos:
- Web publicada responde `200` en `/` y `/app` y contiene los marcadores publicados esperados:
  - `company-operational-email-form`;
  - `company-email-welcome-enabled`;
  - `company-email-purchase-enabled`;
  - `company-email-redemption-enabled`;
  - `company-email-reply-to`;
  - `communication-send-button`;
  - `Envío real bloqueado`.
- JS publicado responde `200` y contiene integracion de settings operativos:
  - `getOperationalEmailSettings`;
  - `updateOperationalEmailSettings`.
- API publicada read-only para `companyId=6` responde `200` con:
  - `welcomeEnabled=true`;
  - `purchaseEnabled=true`;
  - `redemptionEnabled=true`;
  - `replyToEmail=null`.
- UI publicada con mock limpio carga settings de correos operativos activos:
  - bienvenida `true`;
  - compra `true`;
  - canje/redencion `true`;
  - `reply-to=hola@cafecentral.test`.
- Negativo de `reply-to`: `correo-invalido` queda bloqueado con mensaje `Ingresa un correo reply-to válido.` y error general `Revisa los datos ingresados.`.
- Guardado mock de settings responde `Correos operativos actualizados.`.
- Promociones/campanas siguen bloqueadas:
  - panel muestra copy de promociones bloqueadas;
  - `#communication-send-button.disabled=true`;
  - texto del boton: `Envío real bloqueado`.
- Flujo publicado con mock no rompe operaciones base:
  - registro de cliente: `Cliente registrado: QA Operativo ...`;
  - compra: `Compra registrada. Puntos ganados: 500.`;
  - canje/redencion: `Puntos redimidos: 100.`.
- Responsive mobile publicado:
  - `Mi empresa > Comunicaciones` carga el panel correcto;
  - bienvenida/compra/canje cargan activos tras esperar settings;
  - `reply-to=hola@cafecentral.test`;
  - `Enviar campañas` mantiene envio real bloqueado;
  - sin overflow horizontal detectado.

P0/P1:
- No se encontraron P0/P1 abiertos.

P2/P3:
- No se encontraron P2/P3 abiertos en el alcance ejecutado.

Evidencia:
- HTTP Web:
  - `/`: `status=200`, marcadores de correos operativos y `Envío real bloqueado` presentes.
  - `/app`: `status=200`, marcadores de correos operativos y `Envío real bloqueado` presentes.
  - `/src/app.js`: `status=200`, contiene `getOperationalEmailSettings` y `updateOperationalEmailSettings`.
  - `/src/customerApi.js`: `status=200`, contiene settings `welcomeEnabled`, `purchaseEnabled`, `redemptionEnabled` y metodos de API.
- HTTP API read-only:
  - `GET /api/companies/6/operational-email-settings` -> `200`.
  - Respuesta: `{"companyId":"6","welcomeEnabled":true,"purchaseEnabled":true,"redemptionEnabled":true,"replyToEmail":null,...}`.
- Playwright desktop publicado con mock:
  - login OK, `authStatus=owner@mock.test`;
  - settings limpios: `welcome=true`, `purchase=true`, `redemption=true`, `replyTo=hola@cafecentral.test`;
  - `reply-to` invalido bloqueado;
  - settings guardados en mock;
  - campañas bloqueadas;
  - cliente/compra/canje OK;
  - `pageErrors=[]`, `consoleErrors=[]`, `hasOverflow=false`.
- Playwright mobile publicado con mock:
  - `panelVisible=true`;
  - `welcome=true`;
  - `purchase=true`;
  - `redemption=true`;
  - `replyTo=hola@cafecentral.test`;
  - `companyError=""`;
  - campañas bloqueadas;
  - `errors=[]`, `logs=[]`, `overflow=false`.

Uso DB cloud: No. QA no se conecto a Azure SQL ni ejecuto consultas SQL. Se uso HTTP publico read-only contra Web/API publicadas y Playwright con mock forzado para evitar escrituras reales y envios reales. No se ejecuto envio real de correo porque no hubo aprobacion explicita de Product Owner con mailbox controlado.

Riesgos o pendientes:
- No se ejecutaron registros reales de cliente, compra ni canje contra API productiva para evitar disparar correos operativos reales sin aprobacion explicita.
- La validacion de que cliente/compra/canje no se rompen se cubrio contra assets publicados con mock, y queda respaldada por QA local/API de TASK-552 y smoke read-only publicado de TASK-555.
- El endpoint publicado muestra los tres switches activos para `companyId=6`; antes de cualquier prueba real con datos productivos, confirmar mailbox controlado, empresa objetivo y volumen permitido.
- Sin delivery events, la evidencia disponible confirma aceptacion/fallo inmediato, no entrega final en bandeja.

Siguiente recomendado:
- Product / Architect / Release puede procesar TASK-556 como QA publicado aprobado con observaciones.
- Si Product Owner quiere evidencia de entrega real, crear una tarea separada con mailbox controlado, datos de prueba aprobados y alcance explicito de envio real limitado.
