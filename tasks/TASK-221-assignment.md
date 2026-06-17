# TASK-221 - Habilitar acceso temporal Azure SQL para limpieza controlada

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Infra

## Contexto

TASK-220 quedo bloqueada porque Azure SQL rechazo la conexion directa desde el cliente actual por firewall.

Error observado:

```text
Client with IP address '200.229.6.68' is not allowed to access the server.
```

La base existente del proyecto es:

- Servidor: `sqlserver-pj13-brazil`
- Base: `sql-db-puntoclub`

No crear otra base de datos ni modificar recursos no relacionados.

## Objetivo

Crear una regla temporal y acotada de firewall en Azure SQL para permitir que SQL DEV / Data retome TASK-220 desde la IP `200.229.6.68`.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md` y `tasks/TASK-220-HANDOFF.md`.
- Confirmar el resource group correcto del SQL Server antes de ejecutar cambios.
- Crear una regla temporal de firewall para la IP `200.229.6.68`.
- Usar un nombre claramente temporal, por ejemplo `tmp-task221-sql-cleanup-200-229-6-68`.
- No cambiar configuraciones globales de seguridad si no es necesario.
- No activar acceso publico amplio.
- No imprimir secretos.
- Documentar como retirar la regla al finalizar TASK-220.

## Criterios de aceptacion

- Existe una regla temporal para `200.229.6.68` en el SQL Server correcto.
- La regla queda documentada con nombre exacto.
- Se confirma que la regla es acotada a una sola IP.
- Se entrega instruccion de retiro para cuando TASK-220 finalice.

## Entregable

Crear o actualizar `tasks/TASK-221-HANDOFF.md` con:

- Resultado.
- Resource group confirmado.
- Nombre de regla creada.
- IP permitida.
- Comando o pasos seguros usados.
- Comando o pasos para retirar la regla.
- Riesgos o pendientes.
