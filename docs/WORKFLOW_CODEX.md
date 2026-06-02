# Workflow Codex

## Regla central

Product / Architect / Release coordina. Cada chat especializado trabaja tareas pequenas con un unico owner principal.

## Flujo

1. Crear tarea en `tasks/TASK-###.md`.
2. Asignar equipo responsable.
3. El equipo lee `AGENTS.md`, su `chat-start/*.md`, la tarea y docs necesarios.
4. El equipo ejecuta o propone dentro del alcance.
5. El equipo crea `tasks/TASK-###-HANDOFF.md`.
6. Product / Architect / Release procesa el handoff y actualiza release status, backlog o decision log.

## Chats

- `chat-start/PRODUCT_ARCHITECT_RELEASE.md`
- `chat-start/INFRA.md`
- `chat-start/SQL_DEV.md`
- `chat-start/BACKEND_API.md`
- `chat-start/WEB_DEV.md`
- `chat-start/QA.md`
- `chat-start/DISENO_UX.md`

## Git

- Rama principal: `main`.
- Ramas de trabajo: `codex/<tema-corto>` cuando aplique.
- Commits pequenos y descriptivos.
- Revisar `git status` y `git diff --stat` antes de cerrar.
