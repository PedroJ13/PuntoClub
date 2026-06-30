Equipo: Web Dev
Modo de ejecucion: Promociones / UI envio
Tarea completada: TASK-596 - Implementar UI de campanas guardadas y seleccion de destinatarios al enviar

Resultado:
- Se implemento UI local del nuevo flujo de promociones.
- `Enviar campanas` ahora muestra campanas guardadas, permite elegir una, revisar preview y seleccionar destinatarios al momento de enviar.
- Se quitaron las acciones visibles de guardar destinatarios como paso separado.
- La seleccion viaja al API en el envio con `customerIds` y `confirmSend: true`.
- El envio real sigue dependiendo del feature flag del servidor.

Cambios Web:
- Lista de `Campanas guardadas`.
- Seleccion explicita de campana.
- Preview asociado a la campana elegida.
- Lista de clientes visible dentro del flujo de envio.
- Filtro `Todos` para mostrar elegibles y no elegibles juntos.
- Checks por cliente.
- Acciones rapidas:
  - `Seleccionar elegibles`;
  - `Con puntos`;
  - `Limpiar seleccion`.
- Dados de baja/no aptos visibles y deshabilitados con motivo claro.
- Boton final `Enviar a N`.
- Confirmacion previa antes del envio real.

Archivos modificados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `npx prettier --check api/src/functions/promotionalCampaigns.js api/src/lib/repository.js api/src/lib/validators.js api/test/promotional-campaigns.test.js app/index.html app/src/app.js app/src/customerApi.js app/styles.css`
  - Resultado: OK.
- Suite API completa ejecutada por contrato compartido:
  - `npm test` en `api/` -> 154/154 OK.

Uso Azure SQL:
- No.
- Motivo: implementacion local Web/API con tests y mock; no se consulto DB real.

Uso ACS / correos reales:
- No.
- Motivo: no se ejecuto envio real.

Riesgos o pendientes:
- Requiere QA local visual/funcional.
- Requiere publicacion posterior API/Web para estar disponible en `puntoclubcr.com`.
- Como `PROMOTIONAL_EMAIL_SEND_ENABLED` fue activado previamente en Azure, no publicar este cambio hasta que Product/Release confirme la ventana de prueba y QA.
