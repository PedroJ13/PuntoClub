Equipo: QA
Tarea validada: TASK-686 - Validar login publicado en normal e incognito
Ambiente: Publicado, https://puntoclubcr.com contra https://func-puntoclub-prod-br-001.azurewebsites.net/api. Fecha/hora QA: 2026-07-02 07:48:25 -06:00.
Resultado: no aprobado

Checks ejecutados:
- Leidos AGENTS.md, chat-start/QA.md, codex-project-templates/QA.md, docs/README.md, docs/MVP_RELEASE_STATUS.md, docs/QA_TEST_PLAN.md y handoffs TASK-683, TASK-684, TASK-685.
- Se intento leer codex-project-templates/CHAT_MODEL.md, codex-project-templates/PROJECT_TOOLING_ONBOARDING.md, docs/OPERATING_STATUS.md y docs/PROJECT_OPERATING_RULES.md, pero no existen en este checkout.
- Probe publico de https://puntoclubcr.com/ devuelve 200.
- Probe publico de https://puntoclubcr.com/app-config.js confirma API publicada en func-puntoclub-prod-br-001.azurewebsites.net.
- Probe publico de bundle https://puntoclubcr.com/src/app.js busco el mensaje/codigo esperado de TASK-685: `SESSION_NOT_PERSISTED`, `No pudimos conservar`, `conservar la sesi`, `bloqueando cookies`.
- Probe publico de GET https://func-puntoclub-prod-br-001.azurewebsites.net/api/me sin cookie.
- Se comparo con el archivo local app/src/app.js, donde si existe `SESSION_NOT_PERSISTED` y el mensaje especifico de sesion no persistida.
- No se escribieron credenciales, cookies, tokens ni passwords. No se ejecuto envio real ni cambios operativos.

Hallazgos:
- P1: El bundle publicado no contiene la correccion de TASK-685 para sesion no persistida. En local app/src/app.js si existe `SESSION_NOT_PERSISTED` y el copy `No pudimos conservar la sesión en este navegador...`, pero en https://puntoclubcr.com/src/app.js no aparece ninguno de esos textos/codigos. Si el navegador/incognito bloquea la cookie cross-site, la version publicada no puede garantizar el mensaje correcto pedido por TASK-686.
- Sin severidad: GET /api/me sin cookie responde 401 controlado con `UNAUTHORIZED / Authentication is required.`, consistente con sesion ausente.
- Limitacion QA: no se completo login real normal/incognito porque no se deben solicitar ni registrar credenciales, y la sesion real no estaba disponible para automatizacion en este cierre. Ademas, el navegador interno no respondio de forma estable a la lectura automatizada; se evitaron acciones que pudieran alterar una sesion real.

P0/P1:
- P1 abierto: correccion de mensaje de sesion no persistida no publicada en el bundle servido por puntoclubcr.com.

P2/P3:
- Ninguno nuevo.

Evidencia:
- https://puntoclubcr.com/ status 200.
- https://puntoclubcr.com/app-config.js contiene `func-puntoclub-prod-br-001.azurewebsites.net`.
- https://puntoclubcr.com/src/app.js status 200, longitud observada 333185, sin `SESSION_NOT_PERSISTED`, sin `No pudimos conservar`, sin `bloqueando cookies`.
- app/src/app.js local contiene `SESSION_NOT_PERSISTED` en lineas cercanas a 4781 y 7734, y el copy especifico en linea cercana a 7736.
- GET /api/me sin cookie devuelve 401 con body `{"error":{"code":"UNAUTHORIZED","message":"Authentication is required."}}`.

Uso DB cloud: No. Se hicieron probes HTTP publicados contra Web/API; no se consulto Azure SQL ni se abrieron conexiones directas a base de datos.

Riesgos o pendientes:
- Pendiente publicar/revalidar el bundle que contiene TASK-685 antes de repetir login normal/incognito.
- Pendiente validar con sesion real/controlada: login normal, acceso al panel, persistencia tras refresh, logout, login en incognito y mensaje correcto ante sesion no persistida/expirada.
- Sigue vigente el riesgo arquitectonico de TASK-684: Web en puntoclubcr.com y API en azurewebsites.net dependen de cookies cross-site/third-party, especialmente fragiles en incognito.

Siguiente recomendado:
- Web/Release debe confirmar deploy del bundle que contiene `SESSION_NOT_PERSISTED` y el mensaje especifico de cookies. Luego repetir QA publicado con Product Owner iniciando sesion manualmente en normal e incognito, sin compartir credenciales.
