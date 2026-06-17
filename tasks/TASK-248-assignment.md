# TASK-248 - Implementar UI de configuracion de membresias

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Web Dev

## Contexto

TASK-243 definio UX de membresias y TASK-247 implementa API de configuracion de planes/beneficios.

Esta tarea implementa solo la configuracion de membresias:

- listar/crear/editar planes;
- listar/crear/editar beneficios.

No incluye activar membresia a cliente ni registrar usos todavia.

Depende de TASK-247.

## Objetivo

Agregar seccion `Membresias` en la Web para configurar planes y beneficios cuando la empresa tenga membresias habilitadas.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-243-HANDOFF.md`, `tasks/TASK-247-HANDOFF.md` y handoffs recientes de menu/empresa si hacen falta.
- Agregar navegacion `Membresias` solo si la empresa tiene `loyalty_memberships_enabled`.
- Si no esta habilitado, no mostrar `Membresias` en menu de empresa.
- Implementar vista `Membresias > Planes` o equivalente simple:
  - lista de planes;
  - formulario crear/editar plan;
  - activar/inactivar plan.
- Implementar gestion de beneficios por plan:
  - lista de beneficios;
  - crear/editar beneficio;
  - activar/inactivar beneficio.
- Usar copy de TASK-243.
- Manejar estados vacio/carga/error.
- No implementar activacion de membresia a cliente ni uso de beneficios en esta tarea.
- Mantener `Admin empresas` fuera del menu normal.
- No romper `Puntos`/operacion actual, `Mi empresa`, `Reportes`, `/company-registration`, `/admin-companies` ni `/login`.
- No usar `localStorage` ni `sessionStorage`.

## Entregable

Crear o actualizar `tasks/TASK-248-HANDOFF.md` con:

- Resultado.
- Pantallas/secciones agregadas.
- Integracion API.
- Pruebas ejecutadas.
- Riesgos o pendientes para QA.
