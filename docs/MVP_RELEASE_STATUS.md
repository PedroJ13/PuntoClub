# MVP Release Status

## Estado actual

Fase: arranque MVP.

Decision confirmada: fase 1 sera uso real piloto con empresas, no solo demo.

Persistencia recomendada y aceptada para plan inicial: Azure SQL Database minima.

Nota: el usuario ya creo una Azure SQL Database. No crear otra DB; usar `sqlserver-pj13-brazil/sql-db-puntoclub`.

## Tablero operativo

### Ahora

- Fase de producto: configuracion de empresa piloto.

### Siguiente

- Esperar deploy de API y frontend con TASK-093/TASK-094.
- Opcion A elegida: configuracion de empresa piloto.
- Preparar ajustes de empresa sin activar multiempresa controlado ni SaaS completo.
- UX/colores quedan despues; prioridad actual es funcionalidad operativa.

### Bloqueado

- No hay bloqueos P0/P1 abiertos para el flujo cliente + compra + redencion en pantalla web por zonas.
- No hay bloqueos P0/P1 abiertos para historial publicado.
- No hay bloqueos P0/P1 abiertos para integridad SQL auditada.
- Regla temporal SQL `tmp-task077-sql-audit-200-229-6-103` retirada en TASK-079.
- No hay bloqueos P0/P1 abiertos para deploy API repetible.
- No hay P2/P3 abiertos conocidos despues de TASK-085.

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
- TASK-070: QA no aprobo porque la URL publicada todavia servia el copy anterior con `zona 2`.
- TASK-071: Asignada a QA para revalidar copy publicado despues del commit/deploy de TASK-069.
- TASK-071: QA aprobo copy publicado sin referencias a zonas y flujo sin resultado + registro + compra + redencion, sin P0/P1.
- TASK-072: Asignada a SQL DEV para auditar integridad SQL pre-piloto.
- TASK-073: Asignada a Web Dev para mostrar historial resumido de cliente en UI.
- TASK-074: Asignada a Infra / Azure para checklist operativo pre-piloto.
- TASK-075: Asignada a QA para validar historial publicado despues de TASK-073.
- TASK-072: SQL DEV no pudo auditar por firewall Azure SQL; requiere acceso temporal o ambiente permitido.
- TASK-073: Web Dev implemento historial resumido localmente; pendiente deploy.
- TASK-074: Infra / Azure completo checklist operativo pre-piloto.
- TASK-075: QA no aprobo porque la URL publicada todavia no tenia historial.
- TASK-076: Asignada a QA para revalidar historial publicado despues del commit/deploy de TASK-073.
- TASK-077: Asignada a Infra / Azure para desbloquear acceso SQL seguro/temporal.
- TASK-078: Asignada a SQL DEV para reintentar auditoria SQL despues de TASK-077.
- TASK-076: QA aprobo historial publicado, sin P0/P1.
- TASK-077: Infra / Azure creo regla temporal SQL `tmp-task077-sql-audit-200-229-6-103`.
- TASK-078: SQL DEV completo auditoria SQL pre-piloto; sin P0/P1 de integridad.
- TASK-079: Asignada a Infra / Azure para retirar regla temporal SQL de auditoria.
- TASK-079: Infra / Azure retiro regla temporal SQL de auditoria.
- TASK-080: Asignada a Infra / Azure para evaluar endurecimiento operativo SQL pre-piloto.
- TASK-081: Asignada a QA para regresion MVP publicada pre-piloto.
- TASK-080: Infra / Azure recomendo mantener estado actual para piloto controlado con runbook; cambios de firewall/SKU requieren aprobacion separada.
- TASK-081: QA aprobo regresion MVP publicada sin P0/P1, con P3 de mensaje persistente de duplicado.
- TASK-082: Asignada a Web Dev para limpiar mensaje persistente de duplicado.
- TASK-083: Asignada a QA para validar correccion P3 publicada.
- TASK-084: Asignada a Infra / Azure para preparar runbook de calentamiento SQL.
- TASK-082: Web Dev corrigio localmente mensaje persistente de duplicado.
- TASK-083: QA no aprobo porque la URL publicada todavia tenia el comportamiento anterior.
- TASK-084: Infra / Azure preparo runbook de calentamiento SQL.
- TASK-085: Asignada a QA para revalidar limpieza P3 despues del commit/deploy de TASK-082.
- TASK-085: QA aprobo correccion publicada del mensaje persistente; sin P0/P1/P2/P3.
- TASK-086: Asignada a PO Test para preparar guion de piloto operativo.
- TASK-087: Asignada a QA para smoke operativo pre-sesion.
- TASK-088: Asignada a Pulso para analizar senales post-piloto.
- TASK-089: Asignada a Product / Architect / Release para preparar backlog post-piloto.
- TASK-089: Product / Architect / Release preparo estructura de backlog post-piloto inmediato.
- TASK-086: PO Test preparo guion de piloto operativo.
- TASK-087: QA aprobo smoke operativo pre-sesion; ambiente listo despues de calentamiento SQL.
- TASK-090: Asignada a PO Test para ejecutar y documentar sesion piloto controlada.
- TASK-091: Asignada a Product / Architect / Release para decidir continuidad despues del piloto.
- TASK-092: Asignada a SQL DEV para disenar consultas de reporte operativo.
- TASK-093: Asignada a Backend API para implementar endpoint de reporte operativo.
- TASK-094: Asignada a Web Dev para implementar pantalla de reporte y export CSV.
- TASK-095: Asignada a QA para validar reporte operativo publicado.
- TASK-092: SQL DEV diseno consultas de reporte operativo; sin cambios SQL.
- TASK-093: Backend API implemento endpoint de reporte operativo localmente y lo probo contra Azure SQL real; pendiente deploy publicado.
- TASK-094: Web Dev implemento pantalla de reporte y export CSV localmente; pendiente deploy publicado.
- TASK-095: QA no aprobo porque API/frontend publicados aun no tenian reporte.
- TASK-096: Asignada a QA para revalidar reporte operativo publicado despues del deploy.
- TASK-096: QA aprobo reporte operativo publicado, export CSV, validaciones API, responsive y regresion de caja; sin P0/P1.
- TASK-097: Asignada a SQL DEV para disenar auditoria operativa minima.
- TASK-098: Asignada a Infra / Azure para revisar observabilidad operativa.
- TASK-099: Asignada a Backend API para implementar auditoria operativa.
- TASK-100: Asignada a Web Dev para agregar consulta operativa de auditoria.
- TASK-101: Asignada a QA para validar auditoria operativa publicada.
- TASK-097: SQL DEV diseno auditoria operativa minima.
- TASK-098: Infra / Azure reviso observabilidad; detecto 6 responses 5xx recientes y recomendo triage.
- TASK-099: Backend API implemento escritura best-effort de auditoria y migracion SQL; migracion no aplicada.
- TASK-100: Web Dev preparo UI local de auditoria; pendiente endpoint/contracto publicado.
- TASK-101: QA no aprobo porque UI publicada no tenia auditoria y `/audit/events` respondia 404.
- TASK-102: Asignada a SQL DEV para aplicar migracion SQL de auditoria.
- TASK-103: Asignada a Backend API para exponer lectura API de auditoria.
- TASK-104: Asignada a Web Dev para alinear/desplegar UI de auditoria.
- TASK-105: Asignada a QA para revalidar auditoria publicada.
- TASK-106: Asignada a Backend API para revisar responses 5xx recientes en Application Insights.
- TASK-102: SQL DEV no pudo aplicar migracion por firewall Azure SQL; requiere apoyo Infra/usuario para acceso temporal.
- TASK-103: Backend API implemento endpoint de lectura `/audit/events`; pendiente redeploy publicado.
- TASK-104: Web Dev alineo UI con contrato final; UI de auditoria ya aparece publicada segun QA.
- TASK-105: QA no aprobo auditoria publicada porque API estable responde `404` para `/audit/events`.
- TASK-106: Backend API clasifico 5xx recientes como calentamiento/conectividad SQL transitoria; no requiere tarea de codigo por ahora.
- TASK-102: SQL DEV aplico y valido migracion SQL de auditoria operativa; regla temporal de firewall retirada.
- TASK-105: QA aprobo auditoria operativa publicada; eventos, rechazos, UI, Caja y Reporte sin P0/P1/P2/P3.
- TASK-107: Asignada a SQL DEV para revisar modelo SQL de configuracion de empresa piloto.
- TASK-108: Bloqueada hasta TASK-107; Backend API implementara settings editables.
- TASK-109: Bloqueada hasta TASK-108; Web Dev creara pantalla de configuracion.
- TASK-110: Bloqueada hasta TASK-108/TASK-109; QA validara publicado.
- TASK-111: Bloqueada hasta TASK-110; Product / Architect / Release decidira si avanzar a multiempresa controlado.
- TASK-107: SQL DEV confirmo que `dbo.Companies` soporta settings basicos sin migracion; recomendo ampliar auditoria si se registra `company.settings.updated`.
- Decision: auditar cambios de configuracion de empresa en esta fase.
- TASK-108: Liberada a Backend API para implementar PATCH settings y auditoria.
- TASK-112: Liberada a SQL DEV para ampliar constraints de auditoria para settings.
- TASK-108: Backend API implemento `PATCH /settings`, validaciones y auditoria best-effort.
- TASK-112: SQL DEV aplico migracion de auditoria para `company.settings.updated` y `entity_type=company`.
- TASK-109: Liberada a Web Dev para crear pantalla de configuracion de empresa piloto.
- TASK-109: Web Dev implemento pantalla local de configuracion de empresa piloto.
- TASK-110: Liberada a QA para validar configuracion publicada despues de deploy.
- TASK-110: QA aprobo configuracion de empresa publicada; settings editables, validaciones, compras futuras, historicos, auditoria, Caja y Reporte sin P0/P1.
- TASK-111: Liberada a Product / Architect / Release para decidir si avanzar a multiempresa controlado.

## Riesgos principales

- Tratar el piloto como demo visual y dejar fuera integridad de datos.
- Disenar multiempresa autoservicio completo demasiado pronto.
- No definir reglas SQL antes de contratos API.
- No estimar costos minimos de Azure SQL, Functions y Static Web Apps.

## Siguiente paso recomendado

Ejecutar TASK-111 para decidir entrada a multiempresa controlado.

## Listo para probar

- Flujo: Clientes + registrar compra + redimir puntos en pantalla web por zonas.
- Ambiente: frontend publicado `https://calm-dune-075dc5c0f.7.azurestaticapps.net` contra API estable `https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
- Estado: aprobado por QA en TASK-071, sin P0/P1.
- Historial: aprobado por QA en TASK-076, sin P0/P1.
- Auditoria SQL pre-piloto: completada por SQL DEV en TASK-078, sin P0/P1.
- Regla temporal SQL de auditoria: retirada en TASK-079.
- Regresion MVP publicada: aprobada por QA en TASK-081, sin P0/P1.
- Runbook SQL: documentado en `docs/PILOT_RUNBOOK.md`.
- Correccion P3 mensaje duplicado: aprobada por QA en TASK-085.
- Estado pre-piloto: listo para piloto controlado.
- Backlog post-piloto: estructura preparada en `docs/POST_PILOT_BACKLOG.md`.
- Guion piloto: preparado en TASK-086.
- Smoke pre-sesion: aprobado por QA en TASK-087.
- Reporte operativo basico + export CSV: aprobado publicado por QA en TASK-096.
- Auditoria operativa publicada: aprobada por QA en TASK-105.
- Configuracion de empresa piloto: aprobada por QA en TASK-110.
- API deploy: workflow `Deploy Punto Club API` tuvo primer run real exitoso y fue aprobado por QA en TASK-057.
- Nota: las pruebas crean datos reales de QA en la empresa piloto.
