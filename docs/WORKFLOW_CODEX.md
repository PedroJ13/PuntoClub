# Workflow Codex

## Regla central

Product / Architect / Release coordina. Cada chat especializado trabaja tareas pequenas con un unico owner principal.

## Flujo

1. Crear tarea en `tasks/TASK-###.md`.
2. Registrar o mover la tarea en `docs/TASK_BOARD.md`.
3. Asignar equipo responsable.
4. El equipo lee `AGENTS.md`, su `chat-start/*.md`, la tarea y docs necesarios.
5. El equipo mueve la tarea a `In Progress` cuando la toma, si la tarea lo pide o si el usuario lo autoriza.
6. El equipo ejecuta o propone dentro del alcance.
7. El equipo crea `tasks/TASK-###-HANDOFF.md`.
8. El equipo mueve la tarea a `Needs Review`, `QA` o `Blocked`, segun resultado.
9. Product / Architect / Release procesa el handoff y actualiza release status, backlog, decision log y tablero.

## Chats reales del proyecto

- Product / Architect / Release: coordinacion, decisiones, backlog y release.
- SQL DEV: base de datos, modelo SQL, migraciones, integridad e indices.
- Pulso: salud del proyecto, riesgos, prioridades y lectura ejecutiva.
- QA: pruebas formales, regresion, severidad y cierre de calidad.
- Backend API: endpoints, contratos, validaciones server-side e integracion con SQL.
- Infra / Azure: recursos Azure, deploy, secretos, ambientes y costos.
- Diseno / UX: flujos, claridad, copy, errores y experiencia.
- Web Dev: frontend, pantallas, formularios e integracion con API.
- PO Test: pruebas como Product Owner o usuario real. No recibe tareas de implementacion; reporta hallazgos para triage.

## Chat-starts

- `chat-start/PRODUCT_ARCHITECT_RELEASE.md`
- `chat-start/INFRA.md`
- `chat-start/SQL_DEV.md`
- `chat-start/BACKEND_API.md`
- `chat-start/WEB_DEV.md`
- `chat-start/QA.md`
- `chat-start/DISENO_UX.md`

## Tablero operativo

- Archivo: `docs/TASK_BOARD.md`.
- Product / Architect / Release crea tareas, asigna equipo, define prioridad y decide cierre en `Done`.
- Cada chat puede tomar/liberar solo la tarea asignada a su equipo.
- Si hay bloqueo, mover a `Blocked` y escribir motivo concreto.
- Si hay handoff, enlazar `tasks/TASK-###-HANDOFF.md` en el tablero.

## Git

- Rama principal: `main`.
- Ramas de trabajo: `codex/<tema-corto>` cuando aplique.
- Commits pequenos y descriptivos.
- Revisar `git status` y `git diff --stat` antes de cerrar.

## Herramientas locales

- Azure Functions Core Tools (`func`) esta disponible para API local.
- Cuando una tarea toque API local, Backend/API o Infra pueden levantar `api/` con `func start`.
- QA puede validar contra `http://localhost:7071/api` si la tarea pide ambiente local y la API fue levantada con `func`.
