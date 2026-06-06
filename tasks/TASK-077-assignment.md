# TASK-077 - Desbloquear acceso SQL para auditoria pre-piloto

## Equipo

Infra / Azure

## Contexto

TASK-072 no pudo auditar Azure SQL porque el firewall bloqueo la IP cliente:

```text
200.229.6.103
```

Base de datos existente, no crear otra:

```text
sqlserver-pj13-brazil/sql-db-puntoclub
```

## Objetivo

Definir y ejecutar, si esta aprobado, una forma segura y temporal para que SQL DEV pueda correr la auditoria de lectura pre-piloto.

## Opciones aceptables

- Habilitar temporalmente la IP `200.229.6.103` en firewall del servidor SQL.
- Ejecutar la auditoria desde un ambiente/red ya permitido.
- Proponer alternativa equivalente que no exponga secretos ni deje acceso innecesario abierto.

## Reglas

- No imprimir connection strings, passwords ni secretos.
- No crear una base de datos nueva.
- No cambiar schema ni datos.
- No dejar reglas amplias nuevas sin justificacion.
- Si se crea una regla temporal, documentar:
  - nombre;
  - IP/rango;
  - motivo;
  - recomendacion de retiro.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-077-HANDOFF.md
```

Incluye:

- Decision tomada.
- Accion ejecutada o razon por la que no se ejecuto.
- Si SQL DEV puede reintentar TASK-072.
- Riesgos operativos.
- Si requiere apoyo del usuario.
