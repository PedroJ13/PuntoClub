# MVP Release Status

## Estado actual

Fase: arranque MVP.

Decision confirmada: fase 1 sera uso real piloto con empresas, no solo demo.

Persistencia recomendada y aceptada para plan inicial: Azure SQL Database minima.

## Tablero operativo

### Ahora

- TASK-009: Backend/API implementa primera base API contra SQL.
- TASK-010: Web Dev implementa busqueda/listado y registro de cliente.
- TASK-013: QA revalida SQL/API base cuando Backend/API entregue TASK-009.

### Siguiente

- TASK-014: Infra / Azure prepara creacion real de recursos cuando se confirme suscripcion/region.
- TASK-015: Web Dev integra cliente contra API real cuando TASK-009 este aprobado.

### Bloqueado

- QA SQL/API base bloqueado por falta de API ejecutable y base ejecutada.
- Creacion real de Azure bloqueada hasta confirmar suscripcion y region.

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
- TASK-011: Infra / Azure preparo plan production piloto.
- TASK-012: QA intento validar SQL/API base; no aprobado por falta de API/ambiente.

## Riesgos principales

- Tratar el piloto como demo visual y dejar fuera integridad de datos.
- Disenar multiempresa autoservicio completo demasiado pronto.
- No definir reglas SQL antes de contratos API.
- No estimar costos minimos de Azure SQL, Functions y Static Web Apps.

## Siguiente paso recomendado

Priorizar TASK-009. QA no debe repetir validacion hasta que exista API ejecutable y schema/seed ejecutados en una base accesible.
