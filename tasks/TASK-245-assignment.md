# TASK-245 - Definir contratos API de membresias MVP

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Backend/API

## Contexto

Product / Architect / Release decide iniciar Round 1 de membresias.

Decision de alcance:

- Prioridad: `P2 recomendable`, preparado ahora como siguiente bloque funcional.
- MVP de membresias: registra usos de beneficios controlables.
- Aviso de vencimiento por correo: diferido; la API solo debe exponer estado/alerta interna.

No implementar endpoints todavia salvo que Product / Architect / Release lo pida despues. Esta tarea es de contratos.

## Objetivo

Definir contratos API MVP para configurar planes/beneficios, activar membresia a cliente, consultar estado y registrar uso de beneficios.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/API_CONTRACTS.md`, `docs/NEXT_PHASE_MEMBERSHIPS.md`, `tasks/TASK-243-HANDOFF.md` y `tasks/TASK-244-HANDOFF.md`.
- Definir endpoints propuestos para:
  - listar/crear/editar/activar/inactivar planes de membresia;
  - listar/crear/editar beneficios de un plan;
  - activar membresia para cliente;
  - consultar membresias activas/vencidas de cliente;
  - consultar beneficios disponibles/usados;
  - registrar uso de beneficio controlable;
  - reportar alerta interna de vencimiento/proximo vencimiento.
- Mantener contexto por sesion de empresa autenticada.
- No aceptar `companyId` editable desde cliente como fuente confiable.
- Definir validaciones y errores:
  - plan inactivo;
  - cliente inexistente;
  - membresia vencida;
  - beneficio ya usado en periodo;
  - beneficio no controlable;
  - cantidad invalida.
- Definir respuesta segura sin exponer datos de otras empresas.
- No incluir envio automatico de correo de vencimiento en MVP.

## Entregable

Crear o actualizar `tasks/TASK-245-HANDOFF.md` con:

- Contratos API propuestos.
- Payloads y respuestas ejemplo.
- Validaciones/errores.
- Reglas de seguridad por sesion/empresa.
- Dependencias SQL/Data.
- Riesgos o pendientes para Web Dev/QA.
