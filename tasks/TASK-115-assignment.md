# TASK-115 - Disenar modelo SQL para registro de empresas e invitaciones

## Equipo

SQL DEV

## Prioridad

P1

## Round

Round 1

## Depende de

Ninguna.

## Contexto

Punto Club tiene empresa piloto unica y configuracion editable. Product Owner pide avanzar hacia registro de empresas con invitacion por correo, creacion de password/acceso y panel propio.

Se requiere disenar la persistencia antes de implementar API o UI.

## Objetivo

Proponer el modelo SQL minimo para soportar registro de empresas, invitaciones y usuarios/accesos por empresa, sin aplicar migraciones.

## Alcance

- Revisar el modelo actual solo en lo necesario.
- Proponer tablas/cambios para:
  - Empresas en estado pendiente/activa/inactiva si aplica.
  - Solicitud o registro de empresa.
  - Invitaciones con token/hash, expiracion, estado y correo.
  - Usuarios/miembros de empresa o referencia externa de identidad.
  - Metadata de logo si corresponde.
- Definir constraints, indices y unicidad:
  - Email empresa.
  - Nombre si aplica.
  - Invitaciones activas.
  - Relacion usuario-empresa.
- Definir datos auditables y eventos recomendados.
- Indicar impacto sobre `PILOT_COMPANY_ID` y separacion por `companyId`.

## Fuera de alcance

- Aplicar SQL en Azure.
- Crear seeds productivos.
- Implementar auth/password.
- Cambiar API.

## Entregable

Crear `tasks/TASK-115-HANDOFF.md` con:

- Propuesta de modelo.
- Scripts SQL propuestos en bloque o archivo sugerido, pero no aplicado.
- Decisiones abiertas.
- Riesgos de integridad/seguridad.

## Validacion esperada

El handoff debe permitir que Backend/API defina contratos y que Product / Architect / Release decida si se implementa multiempresa controlado.
