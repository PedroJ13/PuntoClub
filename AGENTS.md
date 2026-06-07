# Punto Club Agents

## Proyecto

Punto Club es una plataforma web para que empresas fidelicen clientes con puntos acumulados segun ventas.

Fase 1 sera un uso real piloto, no solo una demo visual. El MVP debe cuidar persistencia, integridad de datos y operacion basica desde el inicio.

## Regla de contexto

- Leer solo lo necesario para la tarea.
- Empezar por `AGENTS.md`, `docs/README.md` y `docs/MVP_RELEASE_STATUS.md`.
- Leer docs tecnicos especificos solo si la tarea los necesita.
- Mantener tareas pequenas y verificables.
- No mezclar frontend, backend, infra, SQL y QA en un mismo cambio salvo decision explicita.

## Roles

- Product / Architect / Release: prioridades, decisiones, backlog, release status y tareas.
- Infra: Azure Static Web Apps, Azure Functions, Azure SQL, secretos, despliegue y costos.
- SQL DEV: modelo relacional, scripts SQL, migraciones, integridad, indices y seeds.
- Backend/API: endpoints, validaciones, contratos, seguridad server-side e integracion con SQL.
- Web Dev: UI operativa, formularios, estados, responsive e integracion API.
- Diseno / UX: claridad de flujos, copy, errores, confirmaciones y coherencia.
- QA: checklist, pruebas, regresion, severidad y cierre de release.
- Pulso: salud del proyecto, riesgos, prioridades y lectura ejecutiva.
- PO Test: validacion como Product Owner o usuario real; no recibe tareas de implementacion.

## Flujo de tareas

1. Product / Architect / Release crea una tarea `tasks/TASK-###.md`.
2. Product / Architect / Release registra o mueve la tarea en `docs/TASK_BOARD.md`.
3. El chat responsable lee su `chat-start/*.md`, la tarea y solo los docs necesarios.
4. El chat responsable puede mover su tarea asignada en `docs/TASK_BOARD.md` cuando la toma, libera, bloquea o entrega handoff.
5. El chat responsable ejecuta el alcance.
6. El chat responsable crea `tasks/TASK-###-HANDOFF.md`.
7. Product / Architect / Release procesa el handoff y actualiza docs si corresponde.

## Herramientas locales

- Azure Functions Core Tools (`func`) esta disponible para ejecutar y validar la API localmente.
- Backend/API e Infra pueden usar `func start` dentro de `api/` cuando una tarea requiera prueba local de Azure Functions.
- QA puede usar la API local levantada con `func` solo cuando la tarea indique validar ambiente local.

## Tablero operativo

- El tablero versionado vive en `docs/TASK_BOARD.md`.
- Product / Architect / Release es owner del tablero.
- Los equipos/chats pueden mover solo tareas asignadas a su equipo y deben dejar nota breve cuando bloquean o liberan una tarea.
- Las etapas son `Inbox`, `Ready`, `Assigned`, `In Progress`, `Needs Review`, `QA`, `Blocked` y `Done`.
- Product / Architect / Release libera tareas por ronda moviendolas a `Ready` o `Assigned`.
- Los chats solo toman tareas de su equipo que esten en `Ready` o `Assigned` y no tengan dependencias pendientes en `Depende de`.
- Las tareas de rondas futuras o con dependencias pendientes deben quedarse en `Blocked`.

## Seguridad

- No guardar tokens, passwords, connection strings ni secretos en archivos.
- No exponer datos de una empresa a otra.
- No relajar restricciones de integridad para desbloquear un caso puntual.
- No borrar datos sin tarea explicita, respaldo y decision documentada.
