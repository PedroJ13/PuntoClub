# TASK-078 - Reintentar auditoria SQL pre-piloto

## Equipo

SQL DEV

## Contexto

TASK-072 quedo bloqueada por firewall de Azure SQL. TASK-077 debe habilitar una ruta segura/temporal o indicar un ambiente permitido para ejecutar la auditoria.

Base de datos existente, no crear otra:

```text
sqlserver-pj13-brazil/sql-db-puntoclub
```

## Objetivo

Reintentar la auditoria SQL pre-piloto de solo lectura cuando Infra/Release confirme acceso.

## Alcance

Ejecutar las auditorias definidas en TASK-072:

- existencia de objetos;
- indices/restricciones criticas;
- duplicados de factura/telefono/email por empresa;
- compras con monto/puntos invalidos;
- redenciones con puntos invalidos;
- saldos negativos;
- redenciones que superan puntos ganados por cliente;
- referencias invalidas o cruces empresa-cliente;
- conteos actuales de empresas/clientes/compras/redenciones/saldos.

## No tocar

- No borrar datos.
- No modificar schema.
- No modificar datos.
- No imprimir secretos ni connection strings.

## Dependencias

- TASK-077 completada o acceso equivalente confirmado.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-078-HANDOFF.md
```

Incluye:

- Resultado de cada auditoria.
- Conteos actuales.
- Hallazgos P0/P1/P2.
- Recomendacion concreta antes de piloto.
