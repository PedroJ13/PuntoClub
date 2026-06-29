Equipo: Web Dev
Modo de ejecucion: Comunicaciones / Configuracion operativa
Tarea completada: TASK-548 - Conectar Mi empresa Comunicaciones a configuracion real de correos operativos

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `tasks/TASK-548-HANDOFF.md`

Pantalla/flujo:
- En `Mi empresa > Comunicaciones` se reemplazo el estado visual/mock por formulario real.
- Campos conectados:
  - bienvenida al registrar cliente;
  - compra registrada;
  - canje o redencion;
  - reply-to opcional.
- Promociones/campanas quedan bloqueadas visualmente.
- `Enviar campañas` sigue como item principal separado y su boton de envio real sigue deshabilitado.

Detalle:
- `app/index.html`:
  - agrega `company-operational-email-form`.
  - agrega switches `company-email-welcome-enabled`, `company-email-purchase-enabled`, `company-email-redemption-enabled`.
  - agrega input `company-email-reply-to`.
  - mantiene bloque de promociones como locked.
- `app/src/customerApi.js`:
  - agrega `getOperationalEmailSettings`.
  - agrega `updateOperationalEmailSettings`.
  - agrega mock local equivalente.
- `app/src/app.js`:
  - carga settings operativos junto con settings de empresa.
  - renderiza switches y reply-to.
  - valida reply-to en frontend.
  - guarda settings por API.
  - muestra estados/error propios del panel de comunicaciones.

Verificacion ejecutada:
- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- `npx prettier --check app/index.html app/styles.css`
- Validacion estatica con Node:
  - existe formulario de correos operativos.
  - existe reply-to.
  - existen metodos API web.
  - existen funciones de carga/guardado en app.
  - `communication-send-button` sigue `disabled`.
- `npm test` en `api/`: 141 tests OK.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos reales.
- No hubo deploy.

Riesgos o pendientes:
- Para usar contra datos reales se requiere aplicar migracion SQL de TASK-546 y publicar API de TASK-547.
- Falta QA visual local con sesion real/mock para confirmar copy y estados del panel.
- Las campanas promocionales permanecen bloqueadas por alcance.

Siguiente recomendado:
- QA local debe validar guardar switches y reply-to en mock/API local.
- Luego planificar migracion SQL + publicacion API/Web.

Movimiento de tablero sugerido:
- TASK-548 a Done / Needs Review.
