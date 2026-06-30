Equipo: QA
Tarea validada: TASK-572 - Validar promociones MVP en ambiente publicado sin envio real
Ambiente: Publicado `https://puntoclubcr.com` contra `https://func-puntoclub-prod-br-001.azurewebsites.net/api`; navegador in-app sin sesion activa; smoke API publicado acotado sobre `companyId=6`; no se enviaron correos reales.
Resultado: no aprobado
Checks ejecutados:
- Lectura de `AGENTS.md`, `chat-start/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/AZURE_SQL_COST_GUARDRAILS.md` y `tasks/TASK-571-HANDOFF.md`.
- `tasks/TASK-572.md` / `tasks/TASK-572-assignment.md`: no existen; se uso el alcance pegado por el usuario.
- Navegador en `https://puntoclubcr.com` y `/app`: redirige a `/login`, muestra `Sesion no iniciada`; no habia sesion real/controlada disponible.
- Assets publicados:
  - Home/index/app-config/app.js/customerApi.js responden 200.
  - `app-config.js` publicado apunta a API publicada, `PUNTO_CLUB_USE_MOCK_API=false` y `PUNTO_CLUB_COMPANY_ID="1"`.
  - `index.html` contiene `Envio real bloqueado`.
  - `app.js` contiene `PROMOTIONAL_SEND_BLOCKED` y accion `data-promotional-unsubscribe-id`.
  - `customerApi.js` contiene `sendPromotionalCampaign`, `PROMOTIONAL_SEND_BLOCKED` y `unsubscribePromotionalCustomer`.
- API publicada sin sesion:
  - `GET /api/companies/1/promotional-campaigns?limit=10&status=all` -> 404 `COMPANY_NOT_FOUND`.
  - `GET /api/companies/6/promotional-campaigns?limit=10&status=all` -> 200.
  - `POST /api/companies/6/promotional-campaigns` -> 201, creo campana QA controlada `campaignId=1`.
  - `POST /api/companies/6/promotional-campaigns/1/preview` -> 200, `sendBlocked=true`, `blockReason=feature_flag_disabled`, incluye linea de puntos.
  - `GET /api/companies/6/promotional-recipients?limit=10&status=subscribed` -> 200, devolvio destinatarios elegibles.
  - `PUT /api/companies/6/promotional-campaigns/1/recipients` con un `customerId` elegible -> 500 `INTERNAL_ERROR`.
  - `POST /api/companies/6/promotional-campaigns/1/send` -> 423 `PROMOTIONAL_SEND_BLOCKED`.
Hallazgos:
- P0: Endpoints publicados de promociones aceptan operaciones sin sesion real/controlada. Sin cookie/sesion activa se pudo listar destinatarios promocionales de `companyId=6` y crear una campana QA en ambiente real. Esto expone/modifica datos de empresa por companyId de ruta y contradice el alcance de validar flujo autenticado por empresa.
- P1: Seleccion de destinatarios publicada falla con `500 INTERNAL_ERROR` al intentar guardar un destinatario elegible en la campana QA `campaignId=1`. Bloquea el flujo MVP de seleccion de destinatarios.
- P1: No se pudo validar el flujo Web autenticado completo porque el navegador no tenia sesion real/controlada y `/app` redirige a `/login`. Sin esa sesion no se puede aprobar que Web use la empresa correcta ni descartar el problema de `companyId` publico.
- P1: `app-config.js` publicado conserva `PUNTO_CLUB_COMPANY_ID="1"`, pero el endpoint de promociones con company 1 responde `COMPANY_NOT_FOUND`. Si Web cae al companyId publico, promociones fallan antes de operar.
- OK parcial: El envio real permanece bloqueado: preview reporta `feature_flag_disabled`, UI/assets contienen bloqueo y `/send` responde 423 `PROMOTIONAL_SEND_BLOCKED`.
P0/P1:
- P0 abierto: acceso/modificacion de promociones y lectura de destinatarios sin sesion autenticada.
- P1 abierto: seleccion de destinatarios falla con 500 en API publicada.
- P1 abierto: flujo Web autenticado no validado por falta de sesion real/controlada en el navegador.
- P1 abierto: riesgo de fallo por `PUNTO_CLUB_COMPANY_ID="1"` publicado contra API que responde `COMPANY_NOT_FOUND`.
P2/P3:
- P3 documental: no existe archivo fuente `tasks/TASK-572.md`.
Evidencia:
- `https://puntoclubcr.com/app` -> `https://puntoclubcr.com/login`, texto visible `Sesion no iniciada`.
- `app-config.js` publicado: API real, mock false, companyId publico `1`.
- API company 1: 404 `COMPANY_NOT_FOUND`.
- API company 6: listado de campanas 200; creacion de campana QA 201 (`campaignId=1`); preview 200 con `sendBlocked=true`; listado de recipients 200; seleccion recipients 500 `INTERNAL_ERROR`; send 423 `PROMOTIONAL_SEND_BLOCKED`.
- No se pegan datos personales de destinatarios en este handoff.
Uso DB cloud: Si. Motivo: la tarea exige validar ambiente publicado con persistencia real. Alcance: smoke API corto via Azure Functions publicado; se creo una campana QA controlada `campaignId=1`, se consultaron listados/preview y se intento seleccion de destinatario; no se abrio conexion SQL directa y no se enviaron correos.
Riesgos o pendientes:
- Queda una campana QA real creada en `companyId=6` (`campaignId=1`) por la prueba; no se debe borrar sin tarea/decision explicita.
- Backend/API debe proteger endpoints de promociones con sesion de empresa y dejar de aceptar companyId de ruta sin autenticacion para datos reales.
- Backend/API debe corregir el 500 de seleccion de destinatarios y devolver respuesta controlada si aplica.
- Web/Infra deben revisar `app-config.js` publicado o confirmar por QA con sesion que el contexto autenticado prevalece y no usa companyId 1.
- Requiere nueva QA publicada con sesion real/controlada despues de corregir P0/P1.
Siguiente recomendado: No liberar promociones publicadas para uso operativo. Crear tarea Backend/API urgente para seguridad de endpoints promocionales y 500 de seleccion; luego reintentar QA Web publicado con sesion real/controlada.
