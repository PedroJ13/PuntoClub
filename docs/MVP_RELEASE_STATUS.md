# MVP Release Status

## Estado actual

Fase: arranque MVP.

Decision confirmada: fase 1 sera uso real piloto con empresas, no solo demo.

Persistencia recomendada y aceptada para plan inicial: Azure SQL Database minima.

Nota: el usuario ya creo una Azure SQL Database. No crear otra DB; usar `sqlserver-pj13-brazil/sql-db-puntoclub`.

## Tablero operativo

### Ahora

- Web Dev corrige copy puntual de busqueda sin resultados para quitar referencia a `zona 2`.

### Siguiente

- QA revalida copy publicado sin referencias a zonas.

### Bloqueado

- No hay bloqueos de ambiente reportados para este ajuste.
- TASK-068 no aprobo por P1 de copy: mensaje sin resultados menciona `zona 2`.
- No hay bloqueos P0/P1 abiertos para deploy API repetible.

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
- TASK-028: Backend/API ejecuto smoke test real dos veces contra Azure SQL con regla temporal.
- TASK-029: QA aprobo SQL/API real con observaciones P2.
- TASK-030: Web Dev aprobo UI de clientes contra API real local con regla temporal.
- TASK-031: Backend/API alineo ids bigint como string y timestamp UTC de redencion.
- TASK-032: Infra / Azure creo Azure Functions estable en `https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
- TASK-033: QA aprobo API estable con observaciones P2.
- TASK-034: Web Dev no aprobo UI contra API estable por CORS ausente.
- TASK-035: Infra / Azure habilito CORS para origenes locales de prueba.
- TASK-036: Backend/API implemento `GET /settings` en codigo local; falta redeploy en Azure Functions.
- TASK-037: Web Dev aprobo UI de clientes contra API estable con CORS.
- TASK-038: QA aprobo smoke UI/API del flujo clientes desde navegador.
- TASK-039: Backend/API redeployo Azure Functions y `GET /settings` ya responde `200` en URL estable.
- TASK-040: Infra / Azure preparo plan de Static Web Apps sin crear recurso.
- TASK-041: QA aprobo API estable despues del redeploy, con observaciones P2/P3.
- TASK-042: Web Dev / QA no pudo aprobar frontend publicado porque no existe Static Web Apps de Punto Club.
- TASK-043: Infra / Azure creo `swa-puntoclub-prod-001`, configuro CORS real y preparo workflow GitHub Actions; falta GitHub Secret/deploy.
- TASK-044: Web Dev / QA no aprobo frontend publicado porque la SWA muestra pagina default, no la UI de Punto Club.
- TASK-045: Infra / Azure completo GitHub Secret/deploy con apoyo del usuario y subio workflow de Static Web Apps.
- TASK-046: Web Dev / QA aprobo frontend publicado para PO Test del flujo clientes.
- TASK-047: Web Dev ajusto flujo local para registrar compra desde cliente, mostrar puntos y evitar busqueda inicial automatica.
- TASK-048: QA no aprobo porque el frontend publicado todavia no reflejaba TASK-047.
- TASK-049: QA aprobo flujo publicado cliente + compra despues del deploy, sin P0/P1.
- TASK-050: Web Dev implemento redencion/canje local contra API estable, pendiente revalidacion publicada.
- TASK-051: QA no aprobo porque el frontend publicado todavia no reflejaba TASK-050.
- TASK-052: Infra / Azure identifico riesgos operativos pre-piloto; principal P1 es deploy API/SAS con expiracion.
- TASK-053: QA aprobo flujo publicado cliente + compra + redencion despues del deploy, sin P0/P1.
- TASK-054: Infra / Azure renovo temporalmente `WEBSITE_RUN_FROM_PACKAGE`; nuevo SAS expira `2027-06-05T21:31Z`.
- TASK-055: Infra / Azure preparo OIDC y workflow GitHub Actions para deploy API, pendiente primer run.
- TASK-056: QA marco no ejecutable porque aun no habia deploy/run API que validar.
- TASK-057: QA aprobo API estable despues del primer run real exitoso del workflow API.
- TASK-058: Web Dev reorganizo UI local por menu/paneles para registrar cliente, compra y redencion.
- TASK-059: QA no aprobo porque la URL publicada todavia no reflejaba TASK-058.
- TASK-060: QA aprobo UI publicada con menu/paneles para cliente, compra y redencion, sin P0/P1.
- TASK-063: Web Dev rediseño localmente la pantalla web en una sola vista por zonas, sin menu.
- TASK-064: QA no aprobo porque la URL publicada todavia no reflejaba TASK-063.
- TASK-065: QA aprobo pantalla web por zonas publicada, sin P0/P1.
- TASK-066: Asignada a Web Dev para ajustar layout segun hallazgos de PO Test.
- TASK-067: QA no aprobo porque la URL publicada todavia servia la version anterior con labels `Zona X`.
- TASK-068: QA confirmo layout y flujo publicados, pero no aprobo por copy `Sin resultados. Registre el cliente en la zona 2.`
- TASK-069: Asignada a Web Dev para quitar referencia a zonas en copy sin resultados.
- TASK-070: Asignada a QA para revalidar copy publicado sin referencias a zonas.

## Riesgos principales

- Tratar el piloto como demo visual y dejar fuera integridad de datos.
- Disenar multiempresa autoservicio completo demasiado pronto.
- No definir reglas SQL antes de contratos API.
- No estimar costos minimos de Azure SQL, Functions y Static Web Apps.

## Siguiente paso recomendado

Completar TASK-069, desplegar y ejecutar TASK-070.

## Listo para probar

- Flujo: Clientes + registrar compra + redimir puntos en pantalla web por zonas.
- Ambiente: frontend publicado `https://calm-dune-075dc5c0f.7.azurestaticapps.net` contra API estable `https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
- Estado: layout publicado validado en TASK-068, pendiente correccion puntual de copy por referencia a `zona 2`.
- API deploy: workflow `Deploy Punto Club API` tuvo primer run real exitoso y fue aprobado por QA en TASK-057.
- Nota: las pruebas crean datos reales de QA en la empresa piloto.
