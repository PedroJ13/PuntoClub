Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea: TASK-554 - Decidir publicacion de correos operativos API Web

Resultado:
- Se revisaron TASK-545 a TASK-553.
- Se confirma que la migracion SQL de correos operativos fue aplicada en Azure SQL.
- Se confirma que la regla temporal de firewall SQL fue retirada y el lock fue restaurado.
- Se confirma que QA local aprobo el paquete sin P0/P1/P2/P3 abiertos.
- Se aprueba publicar API/Web para correos operativos controlados.

Decision:
- Aprobado para release API/Web controlado.
- Alcance limitado a correos operativos:
  - bienvenida al registrar cliente;
  - confirmacion de compra;
  - confirmacion de canje/redencion.
- Promociones/campanas masivas siguen bloqueadas y fuera de este release.
- El sender sigue siendo Azure/ACS actual de Punto Club.
- Los envios son best-effort: no deben bloquear cliente, compra ni canje si ACS falla.

Evidencia revisada:
- TASK-545:
  - definio alcance MVP real de correos operativos por empresa.
  - dejo promociones/campanas fuera.
- TASK-546:
  - preparo migracion SQL minima.
  - tablas: settings, eventos, mensajes e intentos operativos.
- TASK-547:
  - implemento API/settings, plantillas y envio best-effort.
  - `npm test` reportado: 141 OK.
- TASK-548:
  - conecto `Mi empresa > Comunicaciones` a configuracion real.
  - mantuvo promociones bloqueadas.
- TASK-549:
  - QA local aprobo con observacion P3 de formato.
- TASK-550:
  - aplico migracion en Azure SQL.
  - creo objetos requeridos.
  - dejo regla temporal neutralizada por lock.
- TASK-551:
  - normalizo formato Web.
- TASK-552:
  - QA local revalido sin P0/P1/P2/P3.
  - Prettier limpio.
  - API tests 141/141.
  - smoke local con mocks OK.
- TASK-553:
  - retiro regla temporal `tmp-task550-operational-emails-200-229-6-68`.
  - restauro lock `puntoclub-sqlserver-cannotdelete`.

Verificacion adicional ejecutada por Product / Architect / Release:
- `git status --short --branch`
  - cambios locales esperados API/Web/SQL/handoffs.
  - `debug.log` sigue no trackeado y debe quedar fuera.
- `git diff --name-only`
  - cambios tracked en API/Web esperados.
- `npx prettier --check app/index.html app/src/app.js app/src/customerApi.js app/styles.css`
  - Resultado: `All matched files use Prettier code style!`
- `node --check` focal:
  - `app/src/app.js`
  - `app/src/customerApi.js`
  - `api/src/functions/operationalEmailSettings.js`
  - `api/src/lib/operationalEmails.js`
  - Resultado: OK.
- `npm test` en `api/`
  - Resultado: 141 tests OK.

Alcance aprobado para commit/publicacion:
- API:
  - `api/package.json`
  - `api/src/functions/customers.js`
  - `api/src/functions/purchases.js`
  - `api/src/functions/redemptions.js`
  - `api/src/functions/operationalEmailSettings.js`
  - `api/src/lib/notifier.js`
  - `api/src/lib/operationalEmails.js`
  - `api/src/lib/repository.js`
  - `api/src/lib/validators.js`
  - `api/test/operational-emails.test.js`
- Web:
  - `app/index.html`
  - `app/src/app.js`
  - `app/src/customerApi.js`
- SQL/trazabilidad:
  - `database/migrations/20260629_operational_emails.sql`
  - handoffs TASK-545 a TASK-554.

Archivos a excluir:
- `debug.log`

Publicacion requerida:
- Push controlado a `main`.
- Verificar workflow API.
- Verificar workflow Web.
- Si los workflows estan separados, esperar ambos.
- Confirmar que endpoints publicados existen:
  - `GET /api/companies/{companyId}/operational-email-settings`
  - `PATCH /api/companies/{companyId}/operational-email-settings`
- Confirmar que Web publicada contiene panel real de correos operativos.

QA publicado requerido:
- Validar settings publicados con sesion de empresa.
- Validar que promociones sigan bloqueadas.
- Validar que registro cliente, compra y canje no se rompen.
- Ejecutar envio real solo si Product Owner aprueba mailbox y datos de prueba controlados.
- En primera QA publicada, se permite validar sin envio real si se confirma que ACS queda best-effort y no se activan switches para empresas reales sin decision explicita.

Uso cloud/SQL:
- No se uso Azure SQL en esta tarea de decision.
- Se reviso evidencia de TASK-550/TASK-553 donde si se uso Azure SQL/control plane.
- No se enviaron correos reales.

Riesgos o pendientes:
- Aunque la migracion ya esta aplicada, el codigo API/Web aun no esta publicado hasta ejecutar el release.
- El uso real de correos puede consumir el limite bajo del Azure Managed Domain; mantener volumen piloto controlado.
- Sin integracion de delivery events, el sistema registra aceptacion/fallo inmediato, no entrega final.
- Switches por empresa deben activarse de forma consciente; evitar activar por defecto en empresas reales hasta QA publicado.

Siguiente recomendado:
- Crear TASK-555 para commit/push controlado y verificacion de workflows API/Web.
- Crear TASK-556 para QA publicado de correos operativos.

Movimiento de tablero sugerido:
- TASK-554 a Done.
