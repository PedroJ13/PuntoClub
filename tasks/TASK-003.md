# TASK-003 - Proponer modelo SQL inicial

## Estado

Asignada a SQL DEV.

## Contexto

Punto Club fase 1 sera uso real piloto. Se requiere persistencia confiable para empresas, clientes, compras, puntos y redenciones.

## Objetivo

Proponer el modelo SQL inicial y reglas de integridad para Azure SQL Database.

## Alcance

- Revisar `docs/DATA_MODEL.md` y `tasks/TASK-001.md`.
- Proponer tablas MVP:
  - Companies
  - Customers
  - Purchases
  - Redemptions
- Definir tipos de datos para SQL Server.
- Definir claves primarias y foraneas.
- Definir restricciones:
  - factura unica por empresa
  - customer pertenece a company
  - amount y points positivos
  - points_percentage valido
- Proponer indices iniciales.
- Decidir si redencion contra saldo se valida en SQL, API o ambos.
- Proponer script inicial `database/schema.sql` si corresponde.

## No tocar

- No implementar API.
- No decidir recursos Azure.
- No cambiar alcance MVP.
- No guardar connection strings.

## Verificacion

- El modelo debe soportar busqueda por telefono, nombre o email.
- El modelo debe impedir factura duplicada por empresa.
- El modelo debe soportar saldo calculado por compras menos redenciones.
- Debe reportar riesgos de concurrencia o consistencia.

## Handoff esperado

Crear `tasks/TASK-003-HANDOFF.md` con:

```text
Equipo:
Tarea completada:
Archivos cambiados:
SQL agregado o modificado:
Verificacion ejecutada:
Resultado:
Riesgos o pendientes:
Siguiente recomendado:
```
