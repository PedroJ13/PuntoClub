# Plantillas Chat-Start Codex

Estas plantillas son genericas y no pertenecen a un proyecto especifico.

## Uso

1. Copiar los `.md` necesarios al repo del proyecto, normalmente en `chat-start/`.
2. Reemplazar variables `{{...}}` por rutas y conceptos reales del proyecto.
3. Borrar secciones que no aplican.
4. Agregar una linea de skill si existe un skill especifico del proyecto.

## Variables comunes

- `{{PROJECT_NAME}}`
- `{{DOCS_README}}`
- `{{WORKFLOW_DOC}}`
- `{{RELEASE_STATUS_DOC}}`
- `{{MVP_CRITERIA_DOC}}`
- `{{BACKLOG_DOC}}`
- `{{DECISION_LOG_DOC}}`
- `{{ARCHITECTURE_DOC}}`
- `{{DATA_MODEL_DOC}}`
- `{{API_CONTRACTS_DOC}}`
- `{{QA_TEST_PLAN_DOC}}`
- `{{UX_RECOMMENDATIONS_DOC}}`
- `{{OPTIONAL_SKILL_LINE}}`

## Plantillas disponibles

- `PRODUCT_ARCHITECT_RELEASE.md`
- `BACKEND_API.md`
- `SQL_DEV.md`
- `WEB_DEV.md`
- `INFRA.md`
- `QA.md`
- `DISENO_UX.md`
- `PULSO_PROYECTO.md`

## Regla base

Mantener los chat-start cortos. El objetivo es orientar al agente, no duplicar toda la documentacion del proyecto.
## Flujo de tareas recomendado

1. Product / Architect / Release crea o asigna una tarea pequena.
2. El chat responsable lee su plantilla, el task `.md` y solo los documentos necesarios.
3. El chat responsable ejecuta el alcance de la tarea.
4. El chat responsable crea o actualiza `tasks/TASK-###-HANDOFF.md`.
5. Product / Architect / Release procesa el handoff y actualiza estado, backlog o decisiones.

