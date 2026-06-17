# TASK-236 - Habilitar firewall temporal Azure SQL para limpieza desde cero

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Infra

## Contexto

TASK-235 quedo bloqueada porque Azure SQL rechazo la conexion directa desde la IP local:

```text
200.229.6.68
```

Base objetivo:

- SQL Server: `sqlserver-pj13-brazil`
- Database: `sql-db-puntoclub`
- Resource group conocido: `resource_group_main`

## Objetivo

Crear una regla temporal y acotada de firewall para permitir que TASK-235 limpie la base funcional desde cero.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md` y `tasks/TASK-235-HANDOFF.md`.
- Confirmar resource group y servidor antes de modificar firewall.
- Crear regla temporal para una sola IP:

```text
tmp-task235-sql-cleanup-200-229-6-68
```

- IP inicial/final:

```text
200.229.6.68
```

- No habilitar rangos amplios.
- No cambiar otras reglas.
- No imprimir secretos.
- Documentar comando de retiro para TASK-237.

## Criterios de aceptacion

- La regla existe en `sqlserver-pj13-brazil`.
- La regla permite solo `200.229.6.68`.
- Se valida conexion minima a `sql-db-puntoclub` sin consultar datos sensibles.

## Entregable

Crear o actualizar `tasks/TASK-236-HANDOFF.md` con:

- Resultado.
- Resource group confirmado.
- Regla creada.
- IP permitida.
- Validacion minima.
- Comando/pasos para retirar la regla.
- Riesgos o pendientes.
