Equipo:
Web Dev

Tarea completada:
TASK-050 - Implementar redencion/canje de puntos desde cliente.

Fecha:
2026-06-05

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-050-HANDOFF.md`

Ambiente probado:
- Local: `http://127.0.0.1:4175`
- API estable usada por `app-config.js`: `https://func-puntoclub-prod-br-001.azurewebsites.net`
- URL publicada objetivo: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

Cambios realizados:
- Se agrego panel `Redimir puntos` para el cliente seleccionado.
- Cada fila de cliente mantiene `Registrar compra` y ahora agrega `Redimir puntos`.
- El panel de canje muestra:
  - cliente seleccionado,
  - puntos actuales,
  - fecha de canje con valor por defecto de hoy,
  - puntos a redimir,
  - nota opcional.
- Se integro endpoint existente:
  - `POST /api/companies/{companyId}/redemptions`
- Al redimir puntos se refresca el saldo del cliente seleccionado y de la fila visible.
- Se agrego manejo de errores para:
  - validaciones de API,
  - puntos requeridos/mayor que cero,
  - saldo insuficiente `INSUFFICIENT_POINTS`,
  - cliente inexistente `CUSTOMER_NOT_FOUND`.
- Mock local actualizado para soportar redenciones y saldo insuficiente sin cambiar contratos.
- El flujo de compra existente se mantiene en la misma pantalla.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- Navegador local contra API estable.
- Consola del navegador sin errores criticos.
- Responsive:
  - desktop `1280x800`
  - mobile `390x780`

Evidencia de redimir puntos exitosamente:
- Cliente usado:
  - `Task 050 Cliente 88292197`
  - telefono `+50688292197`
  - email `task050-88292197@example.com`
- Primero se registro compra para generar saldo:
  - factura `T050-P-88342211`
  - monto `2000`
  - resultado `Compra registrada. Puntos ganados: 100.`
  - puntos actuales antes de canje: `100`
- Canje ejecutado:
  - puntos redimidos `25`
  - nota `Canje QA TASK-050`
  - mensaje `Canje registrado. Puntos redimidos: 25.`

Evidencia de saldo actualizado:
- Antes del canje:
  - tarjeta/lista: `Puntos actuales 100`
- Despues del canje:
  - tarjeta de compra: `Puntos actuales 75`
  - tarjeta de canje: `Puntos actuales 75`
  - fila de cliente: `Puntos 75`

Evidencia de saldo insuficiente:
- Intento de canje:
  - puntos `999999`
  - nota `Canje insuficiente QA`
- Resultado visible:
  - `El cliente no tiene puntos suficientes para este canje.`
- El saldo visible se mantuvo en `75`.

Evidencia de validaciones de redencion:
- Se envio canje con fecha vacia y puntos `0`.
- Resultado visible:
  - general: `Revise los campos marcados.`
  - fecha: `La fecha de canje es requerida.`
  - puntos: `Los puntos a redimir deben ser un entero mayor que 0.`

Confirmacion de compra sin regresion:
- Desde el mismo cliente seleccionado se registro compra correctamente.
- Mensaje visible:
  - `Compra registrada. Puntos ganados: 100.`
- El saldo se refresco a `Puntos actuales 100` antes de ejecutar el canje.
- La fila conserva ambas acciones:
  - `Registrar compra`
  - `Redimir puntos`

Responsive:
- Desktop `1280x800`:
  - `scrollWidth 1265`
  - sin overflow horizontal
  - sin controles fuera de pantalla
  - formulario de redencion visible al seleccionar cliente
- Mobile `390x780`:
  - `scrollWidth 375`
  - sin overflow horizontal
  - sin controles fuera de pantalla
  - formulario de redencion visible al seleccionar cliente

Resultado:
Aprobado en ambiente local contra API estable. Listo para commit/deploy a Static Web Apps y posterior QA en URL publicada.

Riesgos o pendientes:
- La URL publicada `https://calm-dune-075dc5c0f.7.azurestaticapps.net` no refleja estos cambios hasta que se suban a GitHub y corra el deploy de Static Web Apps.
- Las pruebas crean datos reales de QA en la empresa piloto.
- No se implemento historial completo, login/auth ni cambios de contrato API.
- No se tocaron secretos ni recursos Azure.

Siguiente recomendado:
- Commit/deploy de estos cambios.
- TASK-051: QA valida en URL publicada el flujo cliente + compra + redencion.
