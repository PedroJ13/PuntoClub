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
- Product / Architect / Release libera tareas por ronda moviendolas a `Ready` o `Assigned`.
- El chat responsable puede mover solo su tarea asignada, respetando el alcance.
- Un chat solo puede tomar tareas en `Ready` o `Assigned` si estan asignadas a su equipo y no tienen dependencias pendientes.
- Las tareas con dependencias pendientes deben quedarse en `Blocked` hasta que Product / Architect / Release las libere.
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

## Rondas y dependencias

- `Round` indica la ronda de trabajo sugerida.
- `Depende de` indica tareas o condiciones que deben terminar antes.
- Una automatizacion de chat debe ignorar tareas con `Depende de` pendiente.
- Product / Architect / Release es quien mueve tareas de rondas futuras desde `Blocked` hacia `Ready` o `Assigned`.
- El numero de ronda no autoriza por si solo tomar una tarea; manda el estado del tablero.

## Inbox

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Ready

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Assigned

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |
| `TASK-116` - Definir contratos API para registro e invitacion de empresas | Backend API | P1 | Round 2 | `TASK-113`, `TASK-114`, `TASK-115` | `tasks/TASK-116-assignment.md` |
| `TASK-117` - Reorganizar UI con menu lateral por secciones | Web Dev | P1 | Round 2 | `TASK-113` | `tasks/TASK-117-assignment.md` |

## In Progress

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Needs Review

| Tarea | Equipo | Prioridad | Round | Depende de | Handoff |
| --- | --- | --- | --- | --- | --- |

## QA

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Blocked

| Tarea | Equipo | Prioridad | Round | Depende de | Motivo |
| --- | --- | --- | --- | --- | --- |
| `TASK-118` - Validar menu lateral publicado | QA | P1 | Round 3 | `TASK-117` | Espera implementacion Web publicada. |
| `TASK-119` - Decidir arquitectura de registro multiempresa e invitaciones | Product / Architect / Release | P1 | Round 3 | `TASK-113`, `TASK-114`, `TASK-115`, `TASK-116` | Espera handoffs de diseno, infra, SQL y contratos API. |

## Done

| Tarea | Equipo | Prioridad | Round | Depende de | Handoff |
| --- | --- | --- | --- | --- | --- |
| `TASK-102` - Aplicar migracion SQL de auditoria operativa | SQL DEV | MVP bloqueante | - | - | `tasks/TASK-102-HANDOFF.md` |
| `TASK-103` - Exponer lectura API de auditoria operativa | Backend API | MVP bloqueante | - | - | `tasks/TASK-103-HANDOFF.md` |
| `TASK-104` - Alinear UI de auditoria operativa | Web Dev | MVP bloqueante | - | - | `tasks/TASK-104-HANDOFF.md` |
| `TASK-105` - Revalidar auditoria operativa publicada | QA | MVP bloqueante | - | - | `tasks/TASK-105-HANDOFF.md` |
| `TASK-106` - Revisar responses 5xx recientes en Application Insights | Backend API | P1 | - | - | `tasks/TASK-106-HANDOFF.md` |
| `TASK-107` - Revisar modelo SQL de configuracion de empresa piloto | SQL DEV | P1 | Round 1 | - | `tasks/TASK-107-HANDOFF.md` |
| `TASK-108` - Implementar API de configuracion de empresa piloto | Backend API | P1 | Round 2 | `TASK-107` | `tasks/TASK-108-HANDOFF.md` |
| `TASK-109` - Crear pantalla de configuracion de empresa piloto | Web Dev | P1 | Round 3 | `TASK-108`, `TASK-112` | `tasks/TASK-109-HANDOFF.md` |
| `TASK-110` - Validar configuracion de empresa publicada | QA | P1 | Round 4 | `TASK-108`, `TASK-109`, `TASK-112` | `tasks/TASK-110-HANDOFF.md` |
| `TASK-111` - Decidir entrada a multiempresa controlado | Product / Architect / Release | P1 | Round 5 | `TASK-110` | `tasks/TASK-111-HANDOFF.md` |
| `TASK-112` - Ampliar auditoria para cambios de configuracion de empresa | SQL DEV | P1 | Round 2 | `TASK-107` | `tasks/TASK-112-HANDOFF.md` |
| `TASK-113` - Disenar navegacion lateral y flujo empresa/invitacion | Diseno / UX | P1 | Round 1 | - | `tasks/TASK-113-HANDOFF.md` |
| `TASK-114` - Evaluar email, auth y subida de logo para empresas | Infra / Azure | P1 | Round 1 | - | `tasks/TASK-114-HANDOFF.md` |
| `TASK-115` - Disenar modelo SQL para registro de empresas e invitaciones | SQL DEV | P1 | Round 1 | - | `tasks/TASK-115-HANDOFF.md` |

## Formato sugerido de fila

```md
| `TASK-###` - Titulo corto | Equipo/chat | MVP bloqueante/P1/P2/post-MVP | Round 1 | - | Nota breve o link a handoff |
```
