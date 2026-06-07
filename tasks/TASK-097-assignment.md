# TASK-097 - Disenar auditoria operativa minima en SQL

## Equipo

SQL DEV

## Contexto

El flujo cliente + compra + redencion + historial + reporte operativo ya esta publicado y aprobado. La siguiente fase operativa es agregar trazabilidad minima para operaciones criticas durante piloto real.

No hay autenticacion/usuarios todavia; por ahora la auditoria debe registrar lo disponible sin inventar identidad fuerte.

## Objetivo

Proponer el cambio SQL minimo para auditar operaciones criticas sin romper datos existentes.

## Alcance

- Disenar tabla de auditoria para eventos operativos.
- Eventos minimos:
  - cliente creado;
  - compra registrada;
  - redencion registrada;
  - intento rechazado por duplicado o saldo insuficiente si aplica.
- Campos recomendados:
  - id;
  - company_id;
  - event_type;
  - entity_type;
  - entity_id;
  - customer_id;
  - occurred_at UTC;
  - actor_label nullable;
  - source;
  - metadata JSON/texto.
- Recomendar indices minimos para consulta por empresa/fecha/cliente.
- Definir si el script puede aplicarse como `ALTER` no destructivo.

## No tocar

- No modificar datos reales.
- No aplicar cambios en Azure SQL.
- No cambiar API ni frontend.
- No proponer auth completa.

## Handoff esperado

Al terminar, actualiza:

```text
tasks/TASK-097-HANDOFF.md
```

Incluye SQL propuesto, supuestos, indices, riesgos y si requiere aprobacion de Infra/Azure antes de aplicar.
