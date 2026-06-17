# TASK-222 - Retirar regla temporal Azure SQL de limpieza

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Infra

## Contexto

TASK-221 creo una regla temporal de firewall en Azure SQL para desbloquear TASK-220.

Regla temporal:

```text
tmp-task221-sql-cleanup-200-229-6-68
```

Esta regla debe retirarse despues de que TASK-220 complete la limpieza controlada de datos.

## Objetivo

Retirar la regla temporal de firewall usada para TASK-220 y verificar que ya no exista.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `tasks/TASK-220-HANDOFF.md` y `tasks/TASK-221-HANDOFF.md`.
- Confirmar que TASK-220 termino o que Product Owner autoriza retirar la regla.
- Retirar la regla temporal `tmp-task221-sql-cleanup-200-229-6-68`.
- Verificar que la regla ya no aparece en el SQL Server.
- No cambiar otras reglas de firewall.
- No imprimir secretos.

## Criterios de aceptacion

- La regla temporal `tmp-task221-sql-cleanup-200-229-6-68` ya no existe.
- No se modificaron otras reglas de firewall.
- El handoff documenta comando/pasos usados y resultado.

## Entregable

Crear o actualizar `tasks/TASK-222-HANDOFF.md` con:

- Resultado.
- Regla retirada.
- Verificacion posterior.
- Riesgos o pendientes.
