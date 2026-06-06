# TASK-079 - Retirar regla temporal SQL de auditoria

## Equipo

Infra / Azure

## Contexto

TASK-077 creo una regla temporal de firewall para permitir auditoria SQL desde la IP:

```text
200.229.6.103
```

Regla temporal:

```text
tmp-task077-sql-audit-200-229-6-103
```

TASK-078 completo la auditoria SQL pre-piloto y no encontro P0/P1 de integridad. La regla temporal ya no deberia permanecer activa.

## Objetivo

Retirar la regla temporal de firewall creada para la auditoria y confirmar que el estado operativo queda documentado.

## Alcance

- Eliminar la regla:

```text
tmp-task077-sql-audit-200-229-6-103
```

- Confirmar que ya no aparece al listar reglas del servidor SQL.
- No tocar otras reglas existentes.
- No tocar schema ni datos.
- No imprimir secretos.

## Recursos

```text
SQL Server: sqlserver-pj13-brazil
SQL DB: sql-db-puntoclub
Resource group: resource_group_main
```

## No tocar

- No eliminar `AllowAllWindowsAzureIps` en esta tarea.
- No crear reglas nuevas.
- No cambiar connection strings.
- No cambiar recursos de API/frontend.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-079-HANDOFF.md
```

Incluye:

- Regla eliminada.
- Evidencia de que ya no aparece en firewall.
- Confirmacion de que no se tocaron otras reglas.
- Riesgos pendientes si los hay.
