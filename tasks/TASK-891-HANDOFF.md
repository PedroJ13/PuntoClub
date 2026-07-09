# TASK-891 - Handoff

Nombre del Equipo: Product / Architect / Release
Modo: Release decision
Fecha: 2026-07-09

## Estado

Completada.

## Decision

Se aprueba publicar el paquete de hardening staging phase 1 y seguridad de correos, con commit/push controlado.

Aunque el objetivo principal es staging, el paquete modifica archivos bajo `api/**` y `app/**`. En el repo actual, un push a `main` dispara workflows productivos de API y Web. Por lo tanto, este release debe tratarse como API/Web Release, no solo como commit documental.

## Insumos revisados

- `tasks/TASK-886-HANDOFF.md`
- `tasks/TASK-887-HANDOFF.md`
- `tasks/TASK-888-HANDOFF.md`
- `tasks/TASK-889-HANDOFF.md`
- `tasks/TASK-890-HANDOFF.md`
- `.github/workflows/azure-functions-api-staging.yml`
- `.github/workflows/azure-static-web-apps-swa-puntoclub-stg-001.yml`
- `.github/workflows/azure-functions-api.yml`
- `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`

## Alcance aprobado

Incluye:

- Workflows staging manuales `workflow_dispatch`.
- Generacion de `app-config.js` staging desde workflow.
- Guard contra API productiva en config staging.
- Marca visual `STAGING` solo en ambiente staging.
- Endpoint `GET /api/health` sin SQL.
- `EMAIL_SEND_MODE=disabled` como bloqueo global de emails cuando se configure en staging.
- Ajustes de tests asociados.
- Handoffs de staging phase 1.

## Confirmaciones

- Los workflows staging nuevos son manuales (`workflow_dispatch`) y no se disparan por push.
- Los workflows productivos existentes si se disparan por push a `main` cuando cambian `api/**` o `app/**`.
- La marca `STAGING` no debe aparecer en produccion porque produccion no define `PUNTO_CLUB_ENVIRONMENT=staging`.
- `EMAIL_SEND_MODE=disabled` no debe afectar produccion mientras no se configure esa variable en Function App productiva.
- `GET /api/health` no toca SQL ni secretos.
- Staging queda con correos/campanas bloqueados por app settings.

## Riesgos aceptados

- El push desplegara API/Web productivos por los workflows existentes.
- Se requiere smoke productivo posterior para confirmar que:
  - produccion no muestra badge `STAGING`;
  - `app-config.js` productivo sigue apuntando a `https://api.puntoclubcr.com`;
  - API productiva responde `/api/health`;
  - login productivo no se rompio;
  - correos productivos no quedaron globalmente bloqueados por error de app setting.

## Condiciones para publicar

El commit/push debe:

- incluir los cambios API/Web/workflows de TASK-886, TASK-887, TASK-889 y TASK-890;
- incluir handoffs TASK-872 a TASK-891 que correspondan al bloque staging;
- excluir `debug.log`, `tmp/` y handoffs antiguos no relacionados salvo decision explicita;
- no cambiar SQL, ACS, sender, DNS ni flags productivos;
- no enviar correos reales durante release;
- verificar workflows API/Web productivos hasta success;
- si se ejecutan workflows staging manuales, verificar success y smokes seguros.

## Pendientes fuera de este release

- TASK-888 diagnostico logo staging; no aplica fix en este release.
- Admin positivo staging sigue pendiente si Product/Infra desea validarlo con token staging.
- SQL staging phase 2 queda pendiente.

## Uso Azure SQL

No se uso Azure SQL en esta tarea.

## Secretos

No se leyeron, copiaron ni expusieron secretos.
