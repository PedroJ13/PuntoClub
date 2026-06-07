# TASK-112 - Ampliar auditoria para cambios de configuracion de empresa

## Equipo

SQL DEV

## Contexto

TASK-107 confirmo que `dbo.Companies` ya soporta configuracion basica de empresa piloto sin migracion sobre la tabla.

Product / Architect / Release decide que los cambios de configuracion de empresa deben auditarse en esta fase. Para eso `dbo.OperationalAuditEvents` debe aceptar:

- `event_type = 'company.settings.updated'`
- `entity_type = 'company'`

## Objetivo

Aplicar una migracion SQL no destructiva para permitir eventos de auditoria de cambios de configuracion de empresa.

## Alcance

- Crear migracion SQL en `database/migrations/` o aplicar SQL equivalente si el patron actual lo permite.
- Ampliar `CK_OperationalAuditEvents_event_type` para incluir `company.settings.updated`.
- Ampliar `CK_OperationalAuditEvents_entity_type` para incluir `company`.
- Validar constraints despues de aplicar.
- No modificar datos existentes.
- No cambiar `dbo.Companies`.
- Retirar cualquier regla temporal de firewall si se usa.

## SQL base recomendado

Usar como referencia el SQL propuesto en:

```text
tasks/TASK-107-HANDOFF.md
```

## No tocar

- No cambiar API.
- No cambiar frontend.
- No crear empresas.
- No imprimir secretos.

## Dependencias

- TASK-107 completada.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-112-HANDOFF.md
```

Incluye migracion aplicada/no aplicada, evidencia de constraints, regla temporal usada/retirada si aplica y riesgos pendientes.
