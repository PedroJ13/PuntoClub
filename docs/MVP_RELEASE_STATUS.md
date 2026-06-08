# MVP Release Status

## Estado actual

Fase: arranque MVP.

Decision confirmada: fase 1 sera uso real piloto con empresas, no solo demo.

Persistencia recomendada y aceptada para plan inicial: Azure SQL Database minima.

Nota: el usuario ya creo una Azure SQL Database. No crear otra DB; usar `sqlserver-pj13-brazil/sql-db-puntoclub`.

## Tablero operativo

### Ahora

- Fase de release: configuracion de empresa piloto aprobada.
- Nueva direccion explicita: reabrir camino a registro de empresas con menu lateral, invitacion por correo, password/acceso por empresa, logo upload y notificacion interna.
- Menu lateral publicado aprobado por QA.
- Infra y SQL completaron preparacion de multiempresa controlado sin crear recursos ni aplicar migracion.
- Backend/API y Diseno / UX completaron revision de migracion/contratos y copy de registro/invitacion.
- Contratos finales y base interna Backend/API multiempresa preparados.
- ACS Email, storage privado de logos y migracion SQL multiempresa quedaron listos; Entra External ID sigue pendiente.
- Email real para solicitudes, invitaciones internas, proteccion temporal de endpoints internos, UI de solicitud de empresa y pantalla publica de invitacion con fallback publicado quedaron validados. La aprobacion controlada ya genera invitacion real; QA aprobo la evidencia de invitacion valida en TASK-154 e Infra roto/reemitio el token expuesto en TASK-155. Decision nueva: Entra External ID queda pausado para el piloto y se avanza con auth propia MVP basada en password hash y sesiones server-side.

### Siguiente

- Opcion A completada: configuracion de empresa piloto publicada y aprobada.
- Opcion B/multiempresa se reabre por decision explicita del Product Owner, pero primero como fase de diseno/arquitectura.
- Round 1 liberado:
  - TASK-113: Diseno / UX define menu lateral y flujo empresa/invitacion.
  - TASK-114: Infra / Azure evalua email, auth y logo upload.
  - TASK-115: SQL DEV disena modelo para registro de empresas e invitaciones.
- Round 2 queda bloqueado hasta insumos de Round 1:
  - TASK-116: Backend API define contratos.
  - TASK-117: Web Dev reorganiza UI con menu lateral.
- Round 3 queda bloqueado hasta implementacion/contratos:
  - TASK-118: QA valida menu lateral publicado.
  - TASK-119: Product / Architect / Release decide arquitectura multiempresa/invitaciones.
- UX/colores quedan despues; prioridad actual es funcionalidad operativa.

### Bloqueado

- Crear acceso/login/password productivos avanzan con auth propia MVP. SQL, Backend y Web ya prepararon migracion/codigo local en TASK-159/TASK-160/TASK-161, pero QA no aprobo publicado en TASK-162 porque falta aplicar migracion Azure SQL y desplegar API/Web.
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
- TASK-111: Product / Architect / Release decidio no avanzar todavia a multiempresa controlado; mantener empresa piloto unica y usar evidencia de piloto para decidir Opcion B.
- Cambio posterior: Product Owner pidio reabrir multiempresa con registro/invite/password/logo/menu lateral. Se crean TASK-113 a TASK-119 para diseno y decision antes de implementar.
- TASK-113: Diseno / UX completo propuesta de menu lateral y flujo empresa/invitacion.
- TASK-114: Infra / Azure completo recomendacion de email, auth y storage/logo sin crear recursos.
- TASK-115: SQL DEV completo modelo propuesto para registro de empresas e invitaciones sin aplicar migracion.
- TASK-116: Liberada a Backend API para definir contratos API de registro/invitacion/acceso.
- TASK-117: Liberada a Web Dev para reorganizar UI con menu lateral por secciones.
- TASK-116: Backend API completo contratos API propuestos para registro/invitacion/acceso/logo.
- TASK-117: Web Dev completo reorganizacion local de UI con menu lateral por secciones; pendiente QA publicado.
- TASK-118: Liberada a QA para validar menu lateral publicado.
- TASK-119: Product / Architect / Release decidio avanzar a multiempresa controlado con ACS Email, Entra External ID y Blob Storage privado; SaaS completo sigue diferido.
- TASK-120: Liberada a Infra / Azure para preparar habilitacion Azure de email, auth y logos sin crear recursos sin aprobacion.
- TASK-121: Liberada a SQL DEV para preparar migracion versionada de registro/invitaciones/usuarios sin aplicarla.
- TASK-118: QA aprobo menu lateral publicado; Operaciones, Mi empresa, Reportes, Caja, Reporte, Auditoria y responsive sin P0/P1/P2/P3 nuevos.
- TASK-120: Infra / Azure completo preparacion de ACS Email, Entra External ID y Blob Storage privado; no creo recursos ni secretos.
- TASK-121: SQL DEV completo migracion versionada `database/migrations/20260607_company_registration_invitations.sql`; no aplicada en Azure SQL.
- TASK-122: Asignada a Backend API para revisar migracion SQL contra contratos API multiempresa.
- TASK-123: Asignada a Diseno / UX para definir copy y plantillas base de invitacion/correos.
- TASK-122: Backend API completo revision de migracion contra contratos; requiere ajustar contratos finales antes de codificar.
- TASK-123: Diseno / UX completo copy UI y plantillas base de invitacion/notificacion interna.
- TASK-124: Asignada a Backend API para actualizar contratos finales multiempresa controlado.
- TASK-125: Asignada a Backend API para preparar base interna sin providers Azure reales.
- TASK-126: Asignada a Product / Architect / Release para preparar decision de aprobaciones Azure.
- TASK-124: Backend API completo contratos finales multiempresa en `docs/API_CONTRACTS.md`.
- TASK-125: Backend API completo validadores, formatters y errores internos multiempresa; 40/40 tests pasaron.
- TASK-126: Product / Architect / Release preparo decision de aprobacion Azure para piloto.
- TASK-127: Asignada a Infra / Azure para crear recursos Azure aprobados de email/auth/logos.
- TASK-128: Asignada a SQL DEV para aplicar migracion SQL de registro/invitaciones/usuarios.
- TASK-129: Asignada a Backend API para implementar endpoints base de solicitudes de empresa.
- TASK-127: Infra / Azure completo ACS Email y storage privado de logos; Entra External ID queda pendiente/manual.
- TASK-128: SQL DEV aplico migracion de registro/invitaciones/usuarios en Azure SQL real con prevalidaciones; regla temporal retirada.
- TASK-129: Backend API implemento endpoints base de solicitudes de empresa y revision interna con feature flag; 45 tests pasaron.
- TASK-130: Asignada a Infra / Azure para configurar Microsoft Entra External ID.
- TASK-131: Asignada a Backend API para conectar solicitudes de empresa con email real ACS.
- TASK-132: Asignada a Backend API para implementar invitaciones internas con token hash.
- TASK-133: Asignada a QA para validar endpoints base de solicitudes de empresa publicados.
- TASK-130: Infra / Azure confirmo que Entra External ID sigue pendiente/manual; no crear apps en `Default Directory`.
- TASK-131: Backend API conecto solicitudes de empresa con ACS Email real y fallback seguro; 50 tests pasaron.
- TASK-132: Backend API implemento invitaciones internas con token hash, validate y resend con feature flag; 61 tests pasaron.
- TASK-133: QA aprobo endpoints base publicados de solicitud de empresa y regresion operativa sin P0/P1/P2/P3 nuevos.
- TASK-134: Asignada a Backend API para proteger endpoints internos con autorizacion temporal.
- TASK-135: Asignada a Infra / Azure para guiar configuracion manual de Entra External ID.
- TASK-136: Asignada a Web Dev para crear UI de solicitud de empresa.
- TASK-134: Backend API agrego autorizacion temporal por `x-puntoclub-admin-token` para endpoints internos de revision/invitacion; 70 tests pasaron.
- TASK-135: Infra / Azure preparo guia manual de Entra External ID y confirmo que no se deben crear apps en `Default Directory`.
- TASK-136: Web Dev creo UI de solicitud de empresa en `Mi empresa` con API real y mocks locales; pendiente deploy/QA publicado.
- TASK-137: Asignada a Infra / Azure para configurar app settings de autorizacion temporal interna.
- TASK-138: Asignada a QA para validar UI publicada de solicitud de empresa y endpoints internos cerrados.
- TASK-139: Asignada a Infra / Azure para acompanar configuracion manual de Entra External ID y entregar valores publicos seguros.
- TASK-137: Infra / Azure configuro `INTERNAL_ADMIN_TOKEN` y flags internos en Azure Functions; endpoints internos sin header responden 403.
- TASK-138: QA aprobo UI publicada de solicitud de empresa, seguridad interna sin token y regresion operativa; sin P0/P1/P2 abiertos, con P3 de latencia perceptible en submit.
- TASK-139: Infra / Azure marco Entra External ID bloqueado por intervencion manual del Product Owner; no crear apps en `Default Directory`.
- TASK-140: Asignada a Backend API para conectar aprobacion de solicitud con creacion/envio de invitacion owner.
- TASK-141: Asignada a Web Dev para crear pantalla publica de invitacion con validacion de token y estados.
- TASK-142: Asignada a QA para validar flujo publicado solicitud aprobada + invitacion despues de TASK-140/TASK-141.
- TASK-140: Backend API conecto aprobacion de solicitud con invitacion owner, token hash y respuesta no sensible; 72 tests pasaron.
- TASK-141: Web Dev creo pantalla publica `/company-invitations/accept?token=...` con validacion de token y estados locales.
- TASK-142: QA no aprobo por P1: ruta profunda publicada `/company-invitations/accept` devuelve 404 de Azure Static Web Apps; flujo operativo existente sigue OK.
- TASK-143: Asignada a Web Dev para agregar fallback/rewrite de Static Web Apps para rutas profundas.
- TASK-144: Asignada a QA para revalidar invitacion publicada despues de TASK-143.
- TASK-143: Web Dev agrego `app/staticwebapp.config.json` con `navigationFallback.rewrite` a `/index.html`; validado localmente con SWA CLI.
- TASK-144: QA no aprobo porque el fallback aun no estaba efectivo en el ambiente publicado; pendiente revalidar despues de commit/deploy del config.
- TASK-145: Asignada a QA para revalidar fallback publicado despues de subir `app/staticwebapp.config.json`.
- TASK-145: QA aprobo fallback publicado; `/company-invitations/accept` ya renderiza Punto Club y muestra estados controlados sin P0/P1/P2/P3.
- TASK-146: Asignada a Infra / Azure para ejecutar aprobacion controlada y generar invitacion real sin exponer secretos.
- TASK-147: Asignada a QA para validar invitacion real publicada si recibe link seguro fuera del repo.
- TASK-146: Infra / Azure aprobo solicitud QA `requestId=8`, creo empresa `companyId=2` e invitacion owner `invitationId=1` sin exponer token raw/hash/link.
- TASK-147: QA quedo bloqueado porque no recibio link real por canal seguro; rutas publicas siguen respondiendo 200 sin 404.
- TASK-148: Asignada a Infra / Azure para confirmar entrega ACS o reenviar invitacion real por canal seguro.
- TASK-149: Asignada a QA para reintentar validacion de invitacion real con link seguro despues de TASK-148.
- TASK-148: Infra / Azure reenvio invitacion real `invitationId=1`; App Insights muestra `resendCompanyInvitation` 200 sin excepciones visibles, pero sin confirmacion de delivery final de mailbox.
- TASK-149: QA quedo bloqueado porque no recibio el link real por canal seguro; rutas publicas `/` y `/company-invitations/accept` siguen respondiendo 200.
- TASK-150: Asignada a Infra / Azure para diagnosticar entregabilidad ACS y coordinar un mailbox confirmado para invitacion QA.
- TASK-151: Asignada a QA para reintentar validacion de invitacion real solo despues de link seguro confirmado.
- TASK-150: Infra / Azure confirmo señales ACS agregadas de `SendMail 202` y `Delivered/Success`; no hay evidencia de error API/ACS, pero el link no fue entregado a QA.
- TASK-151: QA quedo bloqueado; vio evidencia/capturas de correo y pantalla en `Validando invitacion...`, pero no evidencia final de invitacion valida sin token visible.
- TASK-152: Asignada a PO Test para abrir el ultimo link desde el mailbox real y documentar evidencia redaccionada sin token.
- TASK-153: Asignada a QA para revisar evidencia de PO Test y cerrar o mantener bloqueo de invitacion real.
- TASK-154: Asignada a QA para cerrar validacion de invitacion real con evidencia del Product Owner, sin reproducir token.
- TASK-155: Asignada a Infra / Azure para rotar/reemitir la invitacion cuyo token quedo expuesto en captura.
- TASK-154: QA aprobo la pantalla publica de invitacion real con evidencia redaccionada; sin P0/P1 para invitacion.
- TASK-155: Infra / Azure roto/reemitio la invitacion expuesta via resend seguro; no expuso token ni link.
- TASK-156: Asignada a Infra / Azure para completar Microsoft Entra External ID y entregar valores publicos seguros.
- TASK-157: Asignada a Backend API; bloqueada hasta TASK-156 para preparar integracion con Entra.
- TASK-158: Asignada a Web Dev; bloqueada hasta TASK-156/TASK-157 para conectar Crear acceso/login.
- TASK-156: Infra / Azure quedo bloqueado porque no hay external tenant accesible/confirmado; no creo apps en Default Directory.
- TASK-157: Backend API quedo bloqueado hasta recibir valores reales de Entra External ID; no implemento JWT con datos inferidos.
- TASK-158: Web Dev quedo bloqueado hasta Entra + Backend; mantuvo Crear acceso deshabilitado de forma segura.
- Decision posterior: Product Owner aprueba pausar Entra External ID para piloto y avanzar con auth propia MVP, siguiendo patron multiempresa logico probado en otro proyecto.
- TASK-159: Asignada a SQL DEV para preparar migracion SQL de password hash y sesiones server-side.
- TASK-160: Asignada a Backend API para implementar auth propia MVP de empresa.
- TASK-161: Asignada a Web Dev para activar Crear acceso/login con auth propia MVP.
- TASK-162: Asignada a QA para validar invitacion -> crear password -> login -> panel empresa.
- TASK-159: SQL DEV preparo migracion 20260608_company_local_auth_sessions.sql; no aplicada en Azure SQL.
- TASK-160: Backend API implemento auth propia MVP localmente; 79 tests pasaron, pendiente deploy/migracion.
- TASK-161: Web Dev implemento Crear acceso/login localmente; pendiente deploy publicado.
- TASK-162: QA no aprobo publicado por endpoints 404, web anterior y migracion SQL pendiente.
- TASK-163: Asignada a SQL DEV para aplicar migracion SQL de auth propia en Azure SQL.
- TASK-164: Asignada a Backend API para confirmar deploy publicado de endpoints auth propia.
- TASK-165: Asignada a Web Dev para confirmar deploy publicado de Web auth propia.
- TASK-166: Asignada a QA para revalidar auth propia publicada end-to-end.
- TASK-163: SQL DEV aplico y valido migracion de auth propia en Azure SQL; regla temporal retirada.
- TASK-164: Backend API confirmo deploy publicado de endpoints auth propia; ya no responden 404.
- TASK-165: Web Dev confirmo deploy publicado de Crear acceso/login auth propia.
- TASK-166: QA valido negativos y publicacion, pero no aprobo E2E por falta de invitacion fresca segura; token real visto en captura se considera comprometido.
- TASK-167: Asignada a Infra / Azure para reemitir invitacion fresca sin exponer token.
- TASK-168: Asignada a QA para reintentar E2E auth propia con invitacion fresca.
- TASK-167: Infra / Azure reemitio invitacion fresca, ACS mostro delivery success y no expuso token/link.
- TASK-168: QA sigue bloqueado porque no recibio el link fresco por canal seguro; checks negativos publicados siguen OK.

## Riesgos principales

- Tratar el piloto como demo visual y dejar fuera integridad de datos.
- Disenar multiempresa autoservicio completo demasiado pronto sin cerrar auth/email/storage.
- No definir reglas SQL antes de contratos API.
- No estimar costos minimos de Azure SQL, Functions y Static Web Apps.

## Siguiente paso recomendado

Product Owner debe abrir el ultimo correo posterior a `2026-06-08T22:13:46.829Z` y ejecutar o compartir por canal seguro el link fresco sin exponer token. Reintentar QA E2E de auth propia publicada cuando QA tenga ese link. Entra External ID queda diferido.

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
- Menu lateral publicado con Operaciones, Mi empresa y Reportes: aprobado por QA en TASK-118.
- Solicitud publica de empresa y endpoints internos cerrados sin token: aprobado por QA en TASK-138.
- Pantalla publica de invitacion y fallback de rutas profundas: aprobado por QA en TASK-145. Invitacion real valida aprobada por QA en TASK-154 y token expuesto rotado/reemitido por Infra en TASK-155.
- API deploy: workflow `Deploy Punto Club API` tuvo primer run real exitoso y fue aprobado por QA en TASK-057.
- Nota: las pruebas crean datos reales de QA en la empresa piloto.







