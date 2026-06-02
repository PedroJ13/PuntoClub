# MVP Release Status

## Estado actual

Fase: arranque MVP.

Decision confirmada: fase 1 sera uso real piloto con empresas, no solo demo.

Persistencia recomendada y aceptada para plan inicial: Azure SQL Database minima.

Nota: el usuario ya creo una Azure SQL Database. No crear otra DB; usar `sqlserver-pj13-brazil/sql-db-puntoclub`.

## Tablero operativo

### Ahora

- TASK-016: Infra / Azure inventaria Azure SQL existente y prepara conexion segura.
- TASK-013: QA revalida SQL/API base cuando exista API conectada a SQL.

### Siguiente

- TASK-017: Backend/API ejecuta API contra Azure SQL existente y entrega comandos/URL QA.
- TASK-018: Web Dev revalida UI contra API real en ambiente disponible.

### Bloqueado

- QA SQL/API base bloqueado por falta de API ejecutable y base ejecutada.
- Creacion real de Azure bloqueada hasta confirmar suscripcion y region.
- Configuracion SQL/API depende de inventariar la Azure SQL Database existente.

### Hecho

- Repo GitHub `PedroJ13/PuntoClub` creado y conectado.
- Chat-start `SQL_DEV.md` creado.
- Decision de uso real piloto confirmada.
- TASK-001: MVP y arquitectura inicial definidos.
- TASK-002: Infra Azure propuso recursos y costo minimo.
- TASK-003: SQL DEV propuso modelo SQL inicial.
- TASK-004: Backend/API propuso contratos API MVP.
- TASK-005: Web Dev propuso pantallas MVP.
- TASK-006: QA preparo checklist MVP.
- TASK-007: Product / Architect / Release decidio auth fase 1 y fuente confiable de companyId.
- TASK-008: SQL DEV preparo seed minimo para empresa piloto.
- TASK-009: Backend/API implemento base API con pruebas unitarias.
- TASK-010: Web Dev implemento clientes y registro, con API real por defecto y mock opt-in.
- TASK-011: Infra / Azure preparo plan production piloto.
- TASK-012: QA intento validar SQL/API base; no aprobado por falta de API/ambiente.
- TASK-013: QA reintento validacion; no aprobado por falta de SQL/API real accesible.
- TASK-014: Infra / Azure preparo guia de recursos; pendiente ajustar con DB existente confirmada.
- TASK-015: Web Dev integro cliente HTTP real; pendiente validar contra API+SQL real.

## Riesgos principales

- Tratar el piloto como demo visual y dejar fuera integridad de datos.
- Disenar multiempresa autoservicio completo demasiado pronto.
- No definir reglas SQL antes de contratos API.
- No estimar costos minimos de Azure SQL, Functions y Static Web Apps.

## Siguiente paso recomendado

Priorizar TASK-016 y TASK-017. QA no debe repetir validacion hasta que exista API ejecutable conectada a `sqlserver-pj13-brazil/sql-db-puntoclub` con schema/seed aplicados.
