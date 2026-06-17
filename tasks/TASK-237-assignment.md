# TASK-237 - Retirar firewall temporal Azure SQL de limpieza desde cero

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: Infra

## Contexto

TASK-236 crea una regla temporal para desbloquear TASK-235.

Regla:

```text
tmp-task235-sql-cleanup-200-229-6-68
```

Debe retirarse despues de que TASK-235 complete la limpieza o si Product Owner decide cancelar el intento.

## Objetivo

Eliminar la regla temporal de firewall y verificar que ya no exista.

## Alcance

- Leer `AGENTS.md`, `tasks/TASK-235-HANDOFF.md` y `tasks/TASK-236-HANDOFF.md`.
- Confirmar que TASK-235 termino o que Product Owner autoriza retirar la regla.
- Retirar solo la regla:

```text
tmp-task235-sql-cleanup-200-229-6-68
```

- No modificar otras reglas.
- No imprimir secretos.

## Criterios de aceptacion

- La regla temporal ya no existe.
- No se modificaron otras reglas de firewall.

## Entregable

Crear o actualizar `tasks/TASK-237-HANDOFF.md` con:

- Resultado.
- Regla retirada.
- Verificacion posterior.
- Riesgos o pendientes.
