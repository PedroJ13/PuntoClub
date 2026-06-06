# TASK-072 - Auditar integridad SQL pre-piloto

## Equipo

SQL DEV

## Contexto

El flujo cliente + compra + redencion ya fue aprobado en ambiente publicado. Antes de uso real piloto conviene auditar la integridad de datos acumulados de QA/piloto en Azure SQL.

Base de datos existente, no crear otra:

```text
sqlserver-pj13-brazil/sql-db-puntoclub
```

## Objetivo

Confirmar que las reglas SQL criticas del MVP estan aplicadas y que los datos actuales no tienen inconsistencias de saldo, duplicados o referencias cruzadas.

## Alcance

- Confirmar existencia de objetos:
  - `dbo.Companies`;
  - `dbo.Customers`;
  - `dbo.Purchases`;
  - `dbo.Redemptions`;
  - `dbo.CustomerPointBalances`;
  - `dbo.RegisterRedemption`.
- Confirmar indices/restricciones criticas:
  - factura unica por empresa;
  - telefono unico por empresa;
  - email unico por empresa cuando existe;
  - monto de compra positivo;
  - puntos ganados positivos;
  - puntos redimidos positivos;
  - FK de compra/redencion a cliente por empresa.
- Ejecutar queries de auditoria:
  - facturas duplicadas por empresa;
  - telefonos duplicados por empresa;
  - emails duplicados por empresa;
  - compras con monto/puntos invalidos;
  - redenciones con puntos invalidos;
  - saldos negativos;
  - redenciones que superan puntos ganados por cliente;
  - compras/redenciones con cliente inexistente o empresa distinta.
- Reportar conteos actuales:
  - empresas;
  - clientes;
  - compras;
  - redenciones;
  - clientes con saldo positivo;
  - clientes con saldo cero.

## No tocar

- No borrar datos.
- No modificar schema sin tarea nueva.
- No crear base de datos.
- No imprimir secretos ni connection strings.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-072-HANDOFF.md
```

Incluye:

- Objetos encontrados/no encontrados.
- Resultado de cada auditoria.
- Conteos actuales.
- Hallazgos P0/P1/P2 si existen.
- Recomendacion concreta si hay que corregir datos o schema antes del piloto.
