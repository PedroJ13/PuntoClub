# TASK-182 - Proponer rate limiting y lockout para auth propia

Equipo responsable: Backend API

## Contexto

QA dejo como P2 heredado que auth propia MVP no tiene rate limiting/lockout. No bloquea el piloto controlado actual, pero debe planificarse antes de abrir uso mas amplio.

## Objetivo

Proponer una implementacion pequena y segura de rate limiting/lockout para login y creacion de acceso, alineada con Azure Functions y SQL existente.

## Alcance

- Revisar endpoints auth:
  - `POST /api/company-auth/login`;
  - `POST /api/company-invitations/accept`.
- Proponer reglas minimas:
  - por email;
  - por IP si es viable en Azure Functions;
  - ventana temporal;
  - respuesta y copy de error.
- Definir si requiere SQL nuevo, tabla nueva o mecanismo in-memory no recomendado para produccion serverless.
- No implementar codigo en esta tarea salvo que Product / Architect / Release lo pida despues.
- No tocar Azure.
- No exponer datos sensibles.

## Entregable

Crear o actualizar `tasks/TASK-182-HANDOFF.md` con:

- Recomendacion tecnica.
- Cambios necesarios por capa.
- Riesgos.
- Tareas sugeridas si se aprueba implementar.
