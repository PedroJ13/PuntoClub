Equipo: Web Dev
Modo de ejecucion: Comunicaciones / Promociones
Tarea completada: TASK-567 - Conectar baja promocional en Web y mock local

Resultado:
- Se agrego en `app/src/customerApi.js` el metodo:
  - `unsubscribePromotionalCustomer(payload)`
- En API real llama:
  - `POST /api/companies/{companyId}/promotional-unsubscribe`
- En mock local registra la baja promocional por cliente y actualiza preferencias.
- La baja mock excluye al cliente de destinatarios elegibles `subscribed`.
- Si el cliente estaba seleccionado en una campana, se quita de la seleccion y de destinatarios pendientes mock.
- El envio real de promociones sigue bloqueado.

UI:
- En la lista de clientes de `Enviar campanas`, cada cliente suscrito muestra accion controlada:
  - `Dar de baja`
- Al registrar baja:
  - se muestra confirmacion;
  - se refresca la lista actual;
  - el cliente deja de aparecer como suscrito/elegible;
  - puntos, beneficios e historial se mantienen segun copy.

Archivos modificados:
- `app/src/customerApi.js`
- `app/src/app.js`
- `app/styles.css`

Verificacion ejecutada:
- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- `npx prettier --check app/src/customerApi.js app/src/app.js app/styles.css`
  - Resultado: OK.

Uso Azure SQL:
- No.
- Motivo: tarea Web local/mock; no se consulto base real.

Riesgos o pendientes:
- La baja real depende de que el endpoint API de promociones este publicado y de que la migracion SQL de promociones este aplicada.
- Falta QA local visual del flujo completo.
- Envio real permanece bloqueado por alcance.
