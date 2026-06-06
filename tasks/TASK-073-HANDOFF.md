Equipo:
Web Dev

Tarea completada:
TASK-073 - Mostrar historial resumido de cliente en UI.

Cambios realizados:
- Agregue accion `Historial` en cada resultado de cliente.
- Integre `GET /api/companies/{companyId}/customers/{customerId}/activity` desde el frontend.
- Agregue panel de historial en `Operacion`, con resumen de puntos ganados, redimidos y actuales.
- Muestro compras como puntos positivos con fecha, factura y monto.
- Muestro redenciones como puntos negativos con fecha y nota.
- Agregue estado vacio para clientes sin movimientos.
- Despues de registrar compra o canje, la UI vuelve al historial actualizado del cliente seleccionado.
- Agregue manejo de error de historial con mensaje claro: `No se pudo cargar el historial. Intente de nuevo.`
- Extendi el mock local para soportar historial de compras y redenciones sin cambiar contratos API.
- No se carga historial automaticamente al abrir la app.

Archivos cambiados:
- `app/index.html`
- `app/src/app.js`
- `app/src/customerApi.js`
- `app/styles.css`
- `tasks/TASK-073-HANDOFF.md`

Evidencia de historial con compra y redencion:
- Cliente creado en prueba real: `Task 073 Cliente 71214637`, telefono `+50673214637`.
- Factura: `T073-P-71214637`, monto `2000`.
- Historial despues de canje:
  - Resumen: ganados `100`, redimidos `25`, actuales `75`.
  - Canje: `06/06/2026 - Canje TASK-073 71214637 -25 pts`.
  - Compra: `06/06/2026 - Factura T073-P-71214637 - CRC 2 000,00 +100 pts`.

Evidencia de historial vacio o cliente sin movimientos:
- Antes de registrar movimientos para `Task 073 Cliente 71214637`, el panel mostro:
  - `Sin movimientos para este cliente.`
  - Resumen: ganados `0`, redimidos `0`, actuales `0`.

Evidencia de actualizacion de historial despues de compra/redencion:
- Despues de compra:
  - Mensaje: `Compra registrada. Pts. ganados: 100.`
  - Historial mostro la factura `T073-P-71214637` con `+100 pts`.
- Despues de redencion:
  - Mensaje: `Canje registrado. Pts. redimidos: 25.`
  - Historial mostro el canje `Canje TASK-073 71214637` con `-25 pts` y balance actual `75`.

Evidencia desktop/mobile sin overflow:
- Desktop medido en navegador: viewport `1265x800`, `scrollWidth=1265`, `clientWidth=1265`, `overflowX=false`, sin elementos fuera de pantalla.
- Mobile medido en navegador: viewport `375x780`, `scrollWidth=375`, `clientWidth=375`, `overflowX=false`, sin elementos fuera de pantalla.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `rg -n "Zona|zona" app` sin resultados.
- Servidor local: `python -m http.server 4175 --bind 127.0.0.1` desde `app`.
- Navegador local en `http://127.0.0.1:4175` contra API configurada.
- Flujo validado: buscar cliente inexistente, registrar cliente, abrir historial vacio, registrar compra, verificar historial actualizado, registrar canje, verificar historial actualizado.
- Recarga inicial validada: `#history-panel` queda oculto, titulo `Operacion`, sin texto de historial.
- Consola del navegador: sin errores.

Resultado:
Completado localmente. La UI muestra historial resumido bajo demanda, lo actualiza despues de compra/redencion y mantiene el layout responsive sin overflow horizontal.

Riesgos o pendientes:
- Pendiente deploy para validar en URL publicada.
- QA debe validar TASK-075 despues del despliegue.

Siguiente recomendado:
Deploy frontend y ejecutar QA publicado de TASK-075.
