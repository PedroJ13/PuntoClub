# MVP Release Status

## Estado actual

Fase: arranque MVP.

Decision confirmada: fase 1 sera uso real piloto con empresas, no solo demo.

Persistencia recomendada y aceptada para plan inicial: Azure SQL Database minima.

Nota: el usuario ya creo una Azure SQL Database. No crear otra DB; usar `sqlserver-pj13-brazil/sql-db-puntoclub`.

## Tablero operativo

### Ahora

- TASK-028: Backend/API reintenta API real y smoke test con regla temporal de firewall.

### Siguiente

- TASK-029: QA revalida SQL/API real.
- TASK-030: Web Dev revalida UI contra API real.

### Bloqueado

- QA SQL/API base bloqueado por falta de API ejecutable y base ejecutada.
- API/QA/Web end-to-end bloqueados por conectividad/firewall local hacia Azure SQL.
- Backend/API local usa servidor local de desarrollo porque Azure Functions Core Tools no esta disponible.

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
- TASK-016: Infra / Azure inventario Azure SQL existente y plan seguro de conexion.
- TASK-017: Backend/API preparo API local, dependencias y smoke test; bloqueado para SQL real por falta de secreto/DB aplicada.
- TASK-018: Web Dev revalido UI parcialmente; no aprobado end-to-end por falta de API real.
- TASK-019: Infra / Azure aplico `database/schema.sql` y `database/seed.sql` en Azure SQL existente.
- TASK-020: Backend/API intento levantar API real; bloqueado por falta de usuario runtime, `SQL_CONNECTION_STRING` y Azure Functions Core Tools/API desplegada.
- TASK-021: QA reintento validacion real; no aprobado por falta de API real.
- TASK-022: Web Dev reintento validacion real; no aprobado por falta de API real.
- TASK-023: Infra / Azure creo `puntoclub_app_user`, configuro `api/local.settings.json` ignorado por git y confirmo permisos minimos.
- TASK-024: Backend/API logro smoke test real una vez con regla temporal de firewall, pero no queda repetible para QA.
- TASK-025: QA no aprobo; endpoints reales fallan con `500 INTERNAL_ERROR` por conectividad SQL/firewall.
- TASK-026: Web Dev no aprobo; UI maneja error controlado, pero no valida flujo real por conectividad SQL/firewall.
- TASK-027: Infra / Azure definio ruta repetible: regla temporal por IP local para desbloqueo inmediato; Azure Functions como ruta estable posterior.

## Riesgos principales

- Tratar el piloto como demo visual y dejar fuera integridad de datos.
- Disenar multiempresa autoservicio completo demasiado pronto.
- No definir reglas SQL antes de contratos API.
- No estimar costos minimos de Azure SQL, Functions y Static Web Apps.

## Siguiente paso recomendado

Priorizar TASK-028 con regla temporal de firewall por IP local y limpieza obligatoria. QA no debe repetir validacion hasta que Backend/API entregue smoke test real repetible.
