# TASK-122 - Revisar migracion SQL contra contratos API multiempresa

## Equipo

Backend API

## Prioridad

P1

## Contexto

SQL DEV preparo la migracion `database/migrations/20260607_company_registration_invitations.sql` en TASK-121. Infra preparo la habilitacion Azure para email, auth y logos en TASK-120. Backend/API ya habia definido contratos en TASK-116.

Antes de implementar endpoints reales, Backend/API debe confirmar que contratos, migracion SQL y arquitectura de auth/email/logo calzan.

## Objetivo

Revisar la migracion SQL y ajustar el plan de implementacion API, sin escribir codigo.

## Alcance

- Leer:
  - `tasks/TASK-116-HANDOFF.md`
  - `tasks/TASK-120-HANDOFF.md`
  - `tasks/TASK-121-HANDOFF.md`
  - `database/migrations/20260607_company_registration_invitations.sql`
- Confirmar si la migracion soporta los contratos propuestos.
- Detectar gaps entre SQL y API, especialmente:
  - `address` requerido.
  - `external_subject` de Entra External ID.
  - estados de empresa, solicitudes e invitaciones.
  - logo privado por blob path.
  - eventos de auditoria.
  - reglas de unicidad.
- Proponer el orden de implementacion Backend/API en tareas pequenas.
- Indicar que endpoints pueden implementarse antes de tener Azure resources reales usando mocks/feature flags, y cuales no.
- Indicar validaciones y pruebas unitarias necesarias.

## Fuera de alcance

- Implementar codigo.
- Aplicar migraciones.
- Crear recursos Azure.
- Configurar secretos.

## Entregable

Crear `tasks/TASK-122-HANDOFF.md` con:

- Resultado de revision.
- Gaps o cambios recomendados.
- Orden de implementacion API propuesto.
- Riesgos.
- Dependencias bloqueantes antes de codificar.

## Validacion esperada

Product / Architect / Release debe poder usar el handoff para crear tareas de implementacion Backend/API sin ambiguedad.
