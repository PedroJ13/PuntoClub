# Automation State - Punto Club

Estado operativo para automatizaciones del proyecto.

## Ejecucion Tecnica

```text
active_task:
active_mode:
status: idle
last_seen_task_number: 1002
last_check_at: 2026-07-12T19:05:00Z
```

## Reglas

- Si `status` es `working`, el watcher no debe tomar otra tarea.
- Si `active_task` tiene valor, el watcher debe revisar esa tarea antes de considerar otra.
- El watcher solo puede auto-ejecutar tareas con `Auto-execute: Yes`.
- El watcher no debe auto-ejecutar tareas de SQL, deploy, Azure SQL, auth, secrets, settings productivos, campañas/correos reales o produccion salvo aprobacion explicita en la tarea.
- Al terminar una tarea, el chat responsable debe dejar handoff y volver el estado a `idle`.

## QA

```text
active_task:
status: idle
last_seen_task_number:
last_check_at:
```

## Reglas QA

- Si QA tiene `status` en `working`, el watcher QA no debe tomar otra tarea.
- QA solo puede tomar tareas dependientes cuando el handoff tecnico requerido existe.
- QA no debe auto-ejecutar pruebas con secretos, datos reales, correos/campanas, Azure SQL o acciones admin reales sin aprobacion explicita.
