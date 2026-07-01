Equipo: QA
Tarea validada: TASK-644 - Reproducir sesion expirada en campanas promocionales publicadas
Ambiente: Publicado `https://puntoclubcr.com/app` con sesion real/controlada abierta por Product Owner en navegador interno. Empresa visible: `Aurisbel Pasteleria`. No se ejecuto envio real.
Resultado: aprobado con observaciones
Checks ejecutados:
- Lectura de `AGENTS.md`, `codex-project-templates/QA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`.
- `tasks/TASK-644.md`: no existe en workspace; se uso el alcance pegado por el Product Owner.
- Lectura de handoffs previos `TASK-641-HANDOFF.md`, `TASK-642-HANDOFF.md`, `TASK-643-HANDOFF.md`.
- Validacion publicada con sesion real/controlada.
- Confirmacion de empresa/sesion visible antes de entrar a promociones.
- Apertura de `Enviar campanas`.
- Verificacion de listado de campanas.
- Intento de creacion de campana QA publicada.
- Verificacion posterior de estado visual en otros modulos (`Reportes` y `Atender cliente`).
- No se seleccionaron destinatarios ni se presiono `Enviar`.
Hallazgos:
- Sesion inicial visible a las `2026-07-01T21:42:53.324Z` / `2026-07-01 15:42:53 CR`.
- Empresa visible: `Aurisbel Pasteleria`; usuario visible: `eventos.aurisbel@gmail.com`; indicador `Datos reales`.
- Al abrir `Enviar campanas` a las `2026-07-01T21:43:14.093Z` / `15:43:14 CR`, la pantalla no redirigio a login.
- El listado de campanas cargo correctamente con 6 opciones iniciales.
- No se mostro `Authentication is required`.
- No se mostro `Tu sesion expiro. Accede nuevamente a tu panel.`.
- Se intento guardar una campana QA a las `2026-07-01T21:43:38.861Z` / `15:43:38 CR`.
- El guardado finalizo observado a las `2026-07-01T21:43:45.380Z` / `15:43:45 CR`.
- La campana `QA TASK-644 942218` quedo creada, listada y seleccionada.
- El preview mostro el asunto/cuerpo de la campana creada.
- La UI no redirigio a login despues del guardado.
- Despues del intento, otros modulos siguieron mostrando la empresa activa:
  - `Reportes`: `Aurisbel Pasteleria`, usuario visible, sin login.
  - `Atender cliente`: `Aurisbel Pasteleria`, usuario visible, sin login.
- No se reprodujo el estado de sesion expirada en esta corrida.
P0/P1:
- Ninguno abierto observado en esta corrida.
P2/P3:
- P3 documental: no existe archivo local `tasks/TASK-644.md`; se uso el alcance del chat.
- Observacion diagnostica: el caso de sesion expirada reportado en TASK-642 no se reprodujo durante esta sesion controlada; la sesion publicada se mantuvo operativa para listar y crear campana.
Evidencia:
- Sesion: `authStatus=eventos.aurisbel@gmail.com`, `company=Aurisbel Pasteleria`, `dataSource=Datos reales`.
- Listado inicial de campanas: `optionCount=6`; seleccion inicial `QA TASK-616 917797 - QA TASK-616 sin envio real 917797`.
- Campana creada: `QA TASK-644 942218 - QA TASK-644 sesion publicada 942218`.
- Resultado visible post-guardado:
  - `hasCreatedOption=true`;
  - `selectedIsCreated=true`;
  - `optionCount=7`;
  - `loginVisible=false`;
  - `hasAuthRequired=false`;
  - `hasExpiredMessage=false`;
  - `campaignError=""`.
- Preview post-guardado: `QA TASK-644 sesion publicada 942218` y cuerpo QA visibles.
- Otros modulos post-guardado:
  - `reportsState.activeSection=reports`, `company=Aurisbel Pasteleria`, `loginVisible=false`;
  - `operationsState.activeSection=operations`, `company=Aurisbel Pasteleria`, `loginVisible=false`.
Uso DB cloud: Si, indirecto. La validacion fue en ambiente publicado con datos reales y creo una campana QA en la empresa autenticada. No se consulto Azure SQL directamente ni se ejecutaron comandos SQL.
Riesgos o pendientes:
- La campana QA `QA TASK-644 942218` queda como dato de prueba publicado.
- Si el Product Owner vuelve a reproducir sesion expirada, registrar hora exacta y navegador usado para correlacionar con logs/API.
- El problema de cookies cross-site descrito en TASK-642 puede depender de politica del navegador/sesion; esta corrida no lo reprodujo.
Siguiente recomendado: Product / Architect / Release puede procesar el handoff. Si se requiere forzar el caso vencido en publicado, abrir tarea especifica para invalidar sesion controladamente o probar en navegador/perfil donde se bloqueen cookies de terceros.
