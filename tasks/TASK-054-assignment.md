# TASK-054 - Preparar deploy repetible de API o renovar paquete antes de expiracion SAS

## Equipo

Infra / Azure

## Contexto

TASK-052 identifico un riesgo P1: `WEBSITE_RUN_FROM_PACKAGE` de Azure Functions usa un SAS privado con expiracion cercana.

Dato reportado por Infra:

```text
Function App: func-puntoclub-prod-br-001
Package actual: /function-releases/api-task039-20260603152441.zip
SAS expira: 2026-06-10T21:28Z
```

Si el SAS expira sin reemplazo, la API estable podria fallar en reinicios, cold starts o scale.

## Objetivo

Dejar definida y, si es posible, ejecutada una ruta segura para que el deploy de API sea repetible o para renovar el paquete antes de la expiracion.

## Alcance

- Revisar opciones seguras:
  - GitHub Actions con Azure OIDC/federated credentials;
  - GitHub Secret con publish profile o deployment credentials;
  - renovacion controlada del paquete/SAS como medida temporal.
- Recomendar una opcion para este piloto.
- Si se puede ejecutar sin exponer secretos:
  - preparar workflow o procedimiento;
  - redeployar/renovar paquete;
  - ejecutar smoke test contra API estable.
- Si requiere decision/apoyo del usuario:
  - indicar exactamente que permiso, secret o accion falta.
- Mantener `local.settings.json`, connection strings, SAS y tokens fuera del repo.

## No tocar

- No imprimir SAS completo, tokens, passwords ni connection strings.
- No borrar paquete actual hasta confirmar reemplazo funcional.
- No cambiar firewall SQL sin confirmacion explicita.
- No crear recursos nuevos salvo aprobacion explicita.
- No romper la API estable.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-054-HANDOFF.md
```

Incluye:

- Opcion recomendada.
- Si se ejecuto renovacion/deploy, evidencia del smoke test.
- Nueva fecha de expiracion si sigue usando SAS.
- Si se propone GitHub Actions, archivos creados/cambiados y secrets requeridos.
- Apoyo requerido del usuario, si aplica.
