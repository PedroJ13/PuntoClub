# MVP Release Status

## Estado actual

Fase: arranque MVP.

Decision confirmada: fase 1 sera uso real piloto con empresas, no solo demo.

Persistencia recomendada y aceptada para plan inicial: Azure SQL Database minima.

## Tablero operativo

### Ahora

- TASK-007: Product / Architect / Release decide auth fase 1 y fuente confiable de companyId.
- TASK-008: SQL DEV prepara script ejecutable con seed minimo para piloto/QA.
- TASK-009: Backend/API implementa primera base API contra SQL.

### Siguiente

- TASK-010: Web Dev implementa busqueda/listado y registro de cliente.
- TASK-011: Infra / Azure prepara recursos production piloto.
- TASK-012: QA valida SQL/API base cuando exista ambiente.

### Bloqueado

- Implementacion end-to-end depende de auth fase 1.

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

## Riesgos principales

- Tratar el piloto como demo visual y dejar fuera integridad de datos.
- Disenar multiempresa autoservicio completo demasiado pronto.
- No definir reglas SQL antes de contratos API.
- No estimar costos minimos de Azure SQL, Functions y Static Web Apps.

## Siguiente paso recomendado

Resolver TASK-007 antes de cerrar implementacion API/Web, mientras SQL DEV y Backend/API pueden avanzar con base tecnica controlada.
