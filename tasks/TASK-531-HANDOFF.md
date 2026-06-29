Equipo: Web Dev
Modo de ejecucion: Comunicaciones / UI ajuste local
Tarea: TASK-531 - Corregir label del menu lateral a Enviar campanas y normalizar formato

Resultado:
- Se cambio el label del menu lateral principal de `Comunicaciones` a `Enviar campañas`.
- Se mantuvo la seccion funcional existente con `data-section-target="communications"` y `data-section="communications"`.
- No se habilito envio real ni se cambio comportamiento de campanas.
- No fue necesario modificar `app/styles.css` para este ajuste.

Archivos cambiados:
- `app/index.html`
- `tasks/TASK-531-HANDOFF.md`

Detalle:
- `app/index.html`:
  - el boton del menu lateral principal que apunta a `communications` ahora muestra `Enviar campañas`.
  - la navegacion secundaria interna de la seccion conserva `Enviar campañas`, `Configuracion`, `Clientes` e `Historial`.
  - el boton `communication-send-button` sigue deshabilitado.

Verificacion ejecutada:
- `node --check app/src/app.js`
- Validacion estatica con Node:
  - confirma que el menu lateral `data-section-target="communications"` muestra `Enviar campañas`.
  - confirma que la seccion `data-section="communications"` sigue existiendo.
  - confirma que `communication-send-button` mantiene `disabled`.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- No hubo deploy.

Riesgos o pendientes:
- Pendiente QA visual local para confirmar el label en desktop/mobile.
- Hay cambios previos no publicados de TASK-528/TASK-529 en el mismo working tree; esta tarea solo agrega el cambio puntual de label y su handoff.

Siguiente recomendado:
- QA local puede validar que el menu lateral abre la misma seccion y que el envio real permanece bloqueado.

Movimiento de tablero sugerido:
- TASK-531 a Done / Needs Review.
