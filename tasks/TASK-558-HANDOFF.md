Equipo: QA
Tarea validada: TASK-558 - Ejecutar prueba visual real de correos operativos
Ambiente: Web/API publicadas de Punto Club (`https://puntoclubcr.com/` y `https://func-puntoclub-prod-br-001.azurewebsites.net/api`), Windows/PowerShell en `C:\Work\Productos Digitales\PuntoClub`, HTTP read-only publicado e intento de verificacion de sesion en navegador. No se ejecuto envio real.
Resultado: bloqueado

Checks ejecutados:
- Lectura de contexto disponible: `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/AZURE_SQL_COST_GUARDRAILS.md`, `docs/SQL_AZURE_CONNECTION_NOTES.md`, `tasks/TASK-556-HANDOFF.md` y `tasks/TASK-557-HANDOFF.md`.
- Confirmada autorizacion de TASK-557:
  - empresa objetivo: `eventos_aurisbel`;
  - cliente autorizado: `Fatima Arraiz`;
  - mailbox receptor autorizado: `pj13eros@hotmail.com`;
  - maximo autorizado: 3 correos reales, uno de bienvenida, uno de compra y uno de canje/redencion.
- Precheck HTTP read-only contra API publicada:
  - `GET /api/companies/6/settings?task558=precheck`;
  - `GET /api/companies/6/operational-email-settings?task558=precheck`;
  - `GET /api/companies/6/customers?search=Fatima%20Arraiz&task558=precheck`;
  - `GET /api/companies/6/customers?search=pj13eros%40hotmail.com&task558=precheck`.
- Intento de consulta Azure SQL read-only acotada para ubicar `eventos_aurisbel`:
  - no se ejecuto consulta porque `api/local.settings.json` no existe en este workspace y no hay `SQL_CONNECTION_STRING` local disponible.
- Verificacion de sesion en navegador publicado:
  - `https://puntoclubcr.com/app?task558=session-check`;
  - lectura de estado visible sin extraer cookies ni secretos.

Hallazgos:
- `companyId=6`, unico id publicado previamente validado por API sin sesion, no corresponde a la empresa autorizada:
  - nombre devuelto por API: `DEMO 1`;
  - estado: `active`;
  - email redaccionado: `***@outlook.com`.
- Settings operativos de `companyId=6` estan activos:
  - `welcomeEnabled=true`;
  - `purchaseEnabled=true`;
  - `redemptionEnabled=true`;
  - `replyToEmail=null`.
- Busqueda read-only en `companyId=6`:
  - `Fatima Arraiz`: sin resultados.
  - mailbox autorizado: existe un cliente distinto asociado a ese correo en `DEMO 1`.
- Navegador publicado no tiene sesion autenticada:
  - `authStatus=Sesión no iniciada`;
  - `activeCompanyName=Empresa`.
- No hay forma segura en este workspace de confirmar o activar settings de `eventos_aurisbel` ni de operar como esa empresa sin:
  - sesion autenticada de la empresa objetivo; o
  - credencial/canal seguro ya configurado fuera del chat; o
  - consulta SQL read-only habilitada por Infra/SQL DEV.

P0/P1:
- P1 abierto: la prueba real no puede ejecutarse de forma segura porque no se pudo confirmar/acceder a la empresa objetivo `eventos_aurisbel`. Enviar usando `companyId=6` habria enviado correos desde/para datos de `DEMO 1`, fuera de la autorizacion de TASK-557.

P2/P3:
- No se encontraron P2/P3 adicionales.

Evidencia:
- TASK-557 autoriza solo:
  - `eventos_aurisbel`;
  - `Fatima Arraiz`;
  - `pj13eros@hotmail.com`;
  - maximo 3 correos reales.
- API publicada read-only:
  - `GET /api/companies/6/settings` -> `200`, `name=DEMO 1`, `status=active`, `pointsPercentage=5`.
  - `GET /api/companies/6/operational-email-settings` -> `200`, switches operativos `true/true/true`.
  - `GET /api/companies/6/customers?search=Fatima%20Arraiz` -> `200`, `items=[]`.
  - `GET /api/companies/6/customers?search=<mailbox autorizado>` -> `200`, existe cliente distinto en `DEMO 1`.
- SQL local:
  - intento read-only no ejecutado por falta de `api/local.settings.json`;
  - no se imprimio ni solicito `SQL_CONNECTION_STRING`.
- Navegador:
  - URL publicada abre en datos reales, pero sin sesion;
  - estado visible: `Sesión no iniciada`.
- Envios reales:
  - bienvenida: no ejecutado;
  - compra `QA-EMAIL-557`: no ejecutada;
  - canje/redencion: no ejecutado.

Uso DB cloud: No. No se conecto a Azure SQL ni se ejecutaron consultas SQL porque no habia conexion local segura disponible. Se uso HTTP publico read-only contra API publicada. No se enviaron correos reales.

Riesgos o pendientes:
- No ejecutar esta prueba contra `companyId=6` porque no corresponde a `eventos_aurisbel`.
- El mailbox autorizado ya aparece asociado a un cliente distinto en `DEMO 1`; reutilizarlo ahi generaria evidencia fuera de alcance y potencial confusion.
- Falta una via segura para operar la empresa objetivo:
  - Product Owner puede iniciar sesion en la Web publicada como `eventos_aurisbel` y avisar que el navegador queda listo; o
  - Infra/SQL DEV puede entregar a QA el `companyId` correcto y confirmar settings activos por handoff, sin exponer secretos; o
  - crear una tarea de Infra/SQL DEV para consulta read-only acotada y/o habilitar temporalmente acceso seguro.

Siguiente recomendado:
- Desbloquear con una sesion publicada autenticada de `eventos_aurisbel` o con handoff de Infra/SQL DEV que confirme `companyId`, settings activos y cliente de prueba autorizado.
- Reabrir/crear revalidacion QA para ejecutar exactamente los 3 correos reales autorizados y capturar evidencia visual redaccionada desde el mailbox controlado.
