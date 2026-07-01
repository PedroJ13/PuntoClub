Equipo: Web Dev
Modo de ejecucion: Auth / Estado de sesion
Tarea completada: TASK-643 - Evitar estado visual de empresa activa cuando la sesion ya no es valida

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-643-HANDOFF.md`

Implementacion:
- Se agrego `ensureCurrentSessionForOperations()`.
- Antes de abrir `Enviar campanas`, la Web llama `/me` mediante `refreshAuthIdentity({ silent: true })`.
- Si `/me` no valida sesion:
  - limpia `currentAuthIdentity`;
  - ejecuta `renderSignedOut()`;
  - redirige visualmente a `/login`;
  - muestra `Tu sesión expiró. Accede nuevamente a tu panel.`
- Se protegieron entradas visibles hacia `Enviar campanas`:
  - boton desde `Mi empresa`;
  - item principal de menu lateral `Enviar campanas`;
  - cambio de vista a `send` dentro de Comunicaciones.
- `loadCompanySettings()` ahora trata `UNAUTHORIZED`, `FORBIDDEN` o `COMPANY_NOT_FOUND` con una identidad local activa como sesion no valida, limpia estado local y manda a login.
- `renderCommunicationCampaignError()` reutiliza el mismo helper de sesion invalida.

Motivo:
- TASK-642 confirmo que el login puede devolver `200` y crear sesion server-side, pero los requests siguientes pueden llegar sin cookie valida.
- Antes de este ajuste, la UI podia conservar la empresa activa desde el body del login aunque el servidor ya no reconociera la sesion.

Reglas preservadas:
- No se cambiaron reglas backend.
- No se cambio flujo de envio.
- No se activaron ni desactivaron flags.
- No se enviaron correos.
- No se agregaron dependencias.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`

Uso Azure SQL:
- No.
- Motivo: ajuste Web local de estado de sesion; la evidencia SQL corresponde a TASK-642.

Riesgos o pendientes:
- Falta QA publicado con navegador real del PO.
- Si el navegador bloquea cookies cross-site, el usuario vera login nuevamente en vez de operar con estado visual falso.
- Solucion estructural posterior recomendada: usar API same-site bajo dominio `puntoclubcr.com` o proxy equivalente para no depender de cookies de terceros.
