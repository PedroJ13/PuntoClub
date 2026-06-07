# TASK-107 - Revisar modelo SQL de configuracion de empresa piloto

## Equipo

SQL DEV

## Contexto

Product / Architect / Release decidio avanzar con Opcion A: configuracion de empresa piloto.

El sistema sigue en modo empresa piloto unica con `PILOT_COMPANY_ID`; no se implementa multiempresa controlado ni SaaS completo en esta fase.

## Objetivo

Confirmar si el modelo SQL actual soporta editar configuracion basica de la empresa piloto y proponer migracion minima si falta algun campo o constraint.

## Alcance

- Revisar tabla `dbo.Companies`.
- Confirmar soporte para:
  - nombre;
  - email;
  - telefono;
  - logo URL o campo equivalente si existe;
  - porcentaje de puntos;
  - estado.
- Revisar constraints actuales para porcentaje de puntos, estado y unicidad necesaria.
- Evaluar si hace falta agregar evento de auditoria para cambios de configuracion, por ejemplo `company.settings.updated`.
- Proponer migracion no destructiva solo si hace falta.
- No aplicar cambios en Azure SQL salvo que la tarea lo indique explicitamente; esta tarea es de revision/propuesta.

## No tocar

- No cambiar datos reales.
- No crear empresa nueva.
- No cambiar auth ni multiempresa.
- No imprimir secretos.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-107-HANDOFF.md
```

Incluye columnas actuales, gaps, SQL propuesto si aplica, riesgos y recomendacion para Backend/API.
