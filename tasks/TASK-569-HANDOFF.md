Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea: TASK-569 - Decidir preparacion de release MVP promociones sin envio real

Resultado:
- Se revisaron TASK-561 a TASK-568.
- Se confirma que QA local aprobo el MVP de promociones sin envio real.
- Se confirma que la baja promocional quedo validada end-to-end en Web/mock local.
- Se confirma que el envio real de promociones sigue bloqueado.
- Se aprueba avanzar a preparacion de release con dos pasos obligatorios:
  1. aplicar migracion SQL de promociones en Azure SQL;
  2. publicar API/Web sin habilitar envio real.

Decision:
- Aprobado avanzar a release tecnico de promociones MVP.
- El release debe incluir modelo SQL, API y Web.
- El envio real promocional debe permanecer bloqueado por feature flag y por backend.
- No se autoriza enviar promociones reales en esta decision.

Alcance aprobado:
- Campanas promocionales MVP:
  - crear/listar campanas;
  - detalle de campana;
  - preview;
  - listado de destinatarios elegibles;
  - seleccion manual de destinatarios;
  - limite MVP de hasta 5 destinatarios por campana;
  - baja promocional;
  - historial/resumen local/API;
  - envio bloqueado.
- Baja promocional:
  - registrar baja;
  - excluir cliente de destinatarios elegibles;
  - mostrar estado de baja;
  - mantener puntos, beneficios, membresias e historial.
- Sender:
  - se mantiene Punto Club/ACS como decision general;
  - no se envia desde correos de empresas.

Fuera de alcance:
- Envio real promocional.
- Campanas masivas.
- Imagenes/banner.
- HTML libre.
- Programacion futura.
- Segmentacion avanzada.
- Custom domain ACS.
- Event Grid/delivery events completos.

Evidencia revisada:
- TASK-561:
  - definio alcance MVP de promociones con baja, limites y envio bloqueado.
- TASK-562:
  - preparo migracion SQL `database/migrations/20260629_promotional_campaigns_mvp.sql`.
  - migracion aun no aplicada en Azure SQL.
- TASK-563:
  - implemento contratos API con envio bloqueado por feature flag.
  - `POST .../send` devuelve `PROMOTIONAL_SEND_BLOCKED`.
- TASK-564:
  - definio UX/copy de promociones, baja y confirmacion.
- TASK-565:
  - implemento UI local/API para crear campanas, preview, destinatarios e historial.
- TASK-566:
  - QA no aprobo inicialmente por P1: baja promocional no validable end-to-end en Web/mock.
- TASK-567:
  - Web conecto baja promocional en Web/mock.
- TASK-568:
  - QA local aprobo baja promocional end-to-end, seleccion, preview, historial y bloqueo de envio real.

Verificacion adicional ejecutada por Product / Architect / Release:
- `git status --short --branch`
  - cambios locales esperados de API/Web/SQL/handoffs.
  - `debug.log` sigue no trackeado y debe quedar fuera.
- `git diff --name-only`
  - cambios tracked en API/Web esperados.
- `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css api/src/functions/promotionalCampaigns.js api/src/lib/validators.js api/test/promotional-campaigns.test.js`
  - Resultado: `All matched files use Prettier code style!`
- `node --check`
  - `app/src/app.js`
  - `app/src/customerApi.js`
  - `api/src/functions/promotionalCampaigns.js`
  - `api/src/lib/validators.js`
  - Resultado: OK.

Condiciones antes de publicar:
- SQL DEV o Infra debe aplicar en Azure SQL:
  - `database/migrations/20260629_promotional_campaigns_mvp.sql`
- La aplicacion de SQL debe ser validada con metadatos/objetos creados.
- Si se usa firewall temporal, debe cerrarse o neutralizarse y documentarse.
- Despues de aplicar SQL, Product / Architect / Release puede ejecutar commit/push y esperar workflows API/Web.

Archivos esperados para futuro commit/release:
- API:
  - `api/package.json`
  - `api/src/functions/promotionalCampaigns.js`
  - `api/src/lib/repository.js`
  - `api/src/lib/validators.js`
  - `api/test/promotional-campaigns.test.js`
- Web:
  - `app/index.html`
  - `app/src/app.js`
  - `app/src/customerApi.js`
  - `app/styles.css`
- SQL:
  - `database/migrations/20260629_promotional_campaigns_mvp.sql`
- Trazabilidad:
  - handoffs TASK-561 a TASK-569.

Archivos a excluir:
- `debug.log`

QA posterior requerido:
- QA Web publicado debe validar:
  - assets Web publicados;
  - endpoints API publicados;
  - baja promocional publicada;
  - seleccion de destinatarios;
  - preview;
  - historial/resumen;
  - envio promocional real bloqueado.
- No se debe enviar ningun correo promocional real sin una decision posterior explicita.

Uso cloud/SQL:
- No se uso Azure SQL en esta tarea de decision.
- No se enviaron correos.
- Se reviso evidencia local y se ejecutaron checks locales.

Riesgos o pendientes:
- La migracion SQL aun no esta aplicada; publicar API antes de aplicar SQL causaria fallos en endpoints de promociones.
- El envio real debe permanecer bloqueado incluso despues del release tecnico.
- Usar Azure Managed Domain para promociones reales sigue siendo riesgoso; se mantiene solo para fase futura controlada si Product decide.

Siguiente recomendado:
- Crear tarea SQL DEV/Infra para aplicar migracion SQL de promociones.
- Luego crear tarea Product / Architect / Release para commit/push controlado API/Web.
- Luego QA Web publicado.

Movimiento de tablero sugerido:
- TASK-569 a Done.
