# MVP Release Status

## Estado actual

Fase: arranque MVP.

Decision confirmada: fase 1 sera uso real piloto con empresas, no solo demo.

Persistencia recomendada y aceptada para plan inicial: Azure SQL Database minima.

## Tablero operativo

### Ahora

- TASK-008: SQL DEV prepara script ejecutable con seed minimo para piloto/QA.
- TASK-009: Backend/API implementa primera base API contra SQL.
- TASK-010: Web Dev implementa busqueda/listado y registro de cliente.

### Siguiente

- TASK-011: Infra / Azure prepara recursos production piloto.
- TASK-012: QA valida SQL/API base cuando exista ambiente.

### Bloqueado

- QA end-to-end depende de SQL/API base y ambiente disponible.

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

## Riesgos principales

- Tratar el piloto como demo visual y dejar fuera integridad de datos.
- Disenar multiempresa autoservicio completo demasiado pronto.
- No definir reglas SQL antes de contratos API.
- No estimar costos minimos de Azure SQL, Functions y Static Web Apps.

## Siguiente paso recomendado

Continuar TASK-008, TASK-009 y TASK-010. Backend/API debe aplicar `PILOT_COMPANY_ID` server-side.
