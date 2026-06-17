# TASK-235 - Limpiar base para prueba desde cero

Equipo responsable: Ejecucion Tecnica

Modo de ejecucion: SQL DEV / Data

## Contexto

Product Owner quiere comenzar una prueba desde cero:

- 0 empresas;
- 0 clientes;
- 0 compras;
- 0 redenciones;
- 0 solicitudes/invitaciones/sesiones previas.

La base existente es `sqlserver-pj13-brazil/sql-db-puntoclub`. No crear otra base de datos.

Esta tarea elimina datos funcionales reales/de prueba. Debe ejecutarse con maxima precaucion y sin tocar estructura.

## Objetivo

Dejar la base funcional limpia para probar el flujo completo desde cero:

1. solicitud publica de empresa;
2. aprobacion interna;
3. invitacion;
4. creacion de acceso;
5. login;
6. operacion con clientes/compras/redenciones.

## Alcance

- Leer `AGENTS.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/DATA_MODEL.md`, `tasks/TASK-220-HANDOFF.md` y handoffs recientes si hace falta.
- Confirmar acceso SQL a `sql-db-puntoclub`.
- Antes de borrar:
  - ejecutar conteos por tabla afectada;
  - documentar que el objetivo es dejar `0` empresas y `0` clientes;
  - no imprimir secretos, hashes, tokens, connection strings ni links tokenizados.
- Limpiar datos funcionales en orden seguro respetando FKs:
  - sesiones;
  - limites/intentos auth;
  - invitaciones;
  - solicitudes de empresa;
  - auditoria operativa;
  - redenciones;
  - compras;
  - clientes;
  - usuarios de empresa;
  - empresas.
- No borrar:
  - tablas;
  - constraints;
  - indices;
  - vistas;
  - stored procedures;
  - migraciones;
  - usuarios SQL;
  - configuracion Azure;
  - secretos.
- Si existen referencias a logo en Storage, no borrar blobs fisicos salvo que Product Owner lo pida en otra tarea; esta tarea solo limpia SQL.
- Si el firewall bloquea acceso SQL, dejar bloqueado con IP observada y SQL propuesto sin ejecutar.

## Criterios de aceptacion

- `dbo.Companies` queda con `0` filas.
- `dbo.CompanyUsers` queda con `0` filas.
- `dbo.CompanySessions` queda con `0` filas.
- `dbo.CompanyInvitations` queda con `0` filas.
- `dbo.CompanyRegistrationRequests` queda con `0` filas.
- `dbo.Customers` queda con `0` filas.
- `dbo.Purchases` queda con `0` filas.
- `dbo.Redemptions` queda con `0` filas.
- `dbo.OperationalAuditEvents` queda con `0` filas.
- `dbo.AuthAttemptLimits` queda con `0` filas.
- La estructura de DB queda intacta.

## Entregable

Crear o actualizar `tasks/TASK-235-HANDOFF.md` con:

- Resultado: completado, bloqueado o no aprobado.
- Conteos antes/despues.
- SQL ejecutado o resumen seguro del procedimiento.
- Validacion posterior.
- Riesgos o pendientes.
- Si se creo regla temporal de firewall, indicar nombre y si queda pendiente retirarla.
