# Task Board

## Proposito

Tablero operativo versionado para coordinar tareas por etapa y por equipo/chat.

Product / Architect / Release mantiene la creacion de tareas, prioridad y asignacion. Los chats responsables pueden mover la tarea asignada cuando la toman, la liberan, la bloquean o entregan handoff.

## Equipos

| Equipo/chat | Archivo de arranque | Uso |
| --- | --- | --- |
| Product / Architect / Release | `chat-start/PRODUCT_ARCHITECT_RELEASE.md` | Crea tareas, prioriza, asigna, procesa handoffs y mantiene este tablero. |
| Infra / Azure | `chat-start/INFRA.md` | Azure, deploy, secretos, ambientes, costos. |
| SQL DEV | `chat-start/SQL_DEV.md` | Modelo SQL, migraciones, integridad, indices, seeds. |
| Backend API | `chat-start/BACKEND_API.md` | Endpoints, validaciones, contratos, seguridad server-side. |
| Web Dev | `chat-start/WEB_DEV.md` | UI, formularios, estados, integracion API. |
| Diseno / UX | `chat-start/DISENO_UX.md` | Flujos, copy, errores, claridad operativa. |
| QA | `chat-start/QA.md` | Validacion, regresion, severidad, cierre de calidad. |
| Pulso | `codex-project-templates/PULSO_PROYECTO.md` | Salud del proyecto, riesgos, prioridades, lectura ejecutiva. |
| PO Test | `tasks/PO_TEST_*.md` | Prueba como usuario/Product Owner; reporta hallazgos. |

## Reglas de uso

- Cada tarea debe existir como `tasks/TASK-###.md` o `tasks/TASK-###-assignment.md`.
- Una tarea debe aparecer una sola vez en el tablero.
- Product / Architect / Release crea y prioriza tareas.
- El chat responsable puede mover solo su tarea asignada, respetando el alcance.
- Si una tarea se bloquea, moverla a `Blocked` y escribir el motivo corto.
- Al terminar, crear o actualizar `tasks/TASK-###-HANDOFF.md` y mover a `Needs Review` o `QA`, segun corresponda.
- Product / Architect / Release decide cuando una tarea pasa a `Done`.
- No usar el tablero para guardar secretos, tokens, connection strings ni passwords.

## Etapas

- `Inbox`: idea o tarea pendiente de triage.
- `Ready`: tarea clara y lista para asignar o ejecutar.
- `Assigned`: tarea asignada a un equipo/chat, aun no tomada.
- `In Progress`: el equipo/chat ya la tomo.
- `Needs Review`: hay handoff y Product / Architect / Release debe procesarlo.
- `QA`: requiere validacion de QA o PO Test.
- `Blocked`: no puede avanzar sin decision, acceso, secreto, ambiente o tarea previa.
- `Done`: cerrada por Product / Architect / Release.

## Inbox

| Tarea | Equipo | Prioridad | Nota |
| --- | --- | --- | --- |

## Ready

| Tarea | Equipo | Prioridad | Nota |
| --- | --- | --- | --- |

## Assigned

| Tarea | Equipo | Prioridad | Nota |
| --- | --- | --- | --- |

## In Progress

| Tarea | Equipo | Prioridad | Nota |
| --- | --- | --- | --- |

## Needs Review

| Tarea | Equipo | Prioridad | Handoff |
| --- | --- | --- | --- |

## QA

| Tarea | Equipo | Prioridad | Nota |
| --- | --- | --- | --- |

## Blocked

| Tarea | Equipo | Prioridad | Motivo |
| --- | --- | --- | --- |
| `TASK-102` - Aplicar migracion SQL de auditoria operativa | SQL DEV | MVP bloqueante | Firewall Azure SQL bloquea IP `200.229.6.103`; migracion no aplicada. |
| `TASK-105` - Revalidar auditoria operativa publicada | QA | MVP bloqueante | API publicada responde `404` para `/audit/events`; requiere migracion SQL y redeploy API. |

## Done

| Tarea | Equipo | Prioridad | Handoff |
| --- | --- | --- | --- |
| `TASK-103` - Exponer lectura API de auditoria operativa | Backend API | MVP bloqueante | `tasks/TASK-103-HANDOFF.md` |
| `TASK-104` - Alinear UI de auditoria operativa | Web Dev | MVP bloqueante | `tasks/TASK-104-HANDOFF.md` |
| `TASK-106` - Revisar responses 5xx recientes en Application Insights | Backend API | P1 | `tasks/TASK-106-HANDOFF.md` |

## Formato sugerido de fila

```md
| `TASK-###` - Titulo corto | Equipo/chat | MVP bloqueante/P1/P2/post-MVP | Nota breve o link a handoff |
```
