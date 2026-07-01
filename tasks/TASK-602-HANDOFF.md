Equipo: Product / Architect / Release
Modo de ejecucion: Release closure
Tarea completada: TASK-602 - Cerrar release del nuevo flujo de campanas y envios

Resultado:
- Se procesaron los handoffs `TASK-600` y `TASK-601`.
- El release del nuevo flujo de campanas/plantillas y seleccion de destinatarios al enviar queda cerrado.
- API/Web estan publicados.
- QA Web aprobo el nuevo flujo sin envio real.
- `PROMOTIONAL_EMAIL_SEND_ENABLED` sigue en `false`.
- La prueba real de envio promocional queda pendiente para Product Owner en tarea/ventana controlada.

Estado publicado:
- Commit publicado:
  - `8e1f2ece98be147b47258c682f5b81870bfc7615`
  - `Release promotional campaign send flow`
- Workflows:
  - `Deploy Punto Club frontend`: success.
  - `Deploy Punto Club API`: success.
- Ambiente:
  - Web: `https://puntoclubcr.com`
  - API: `func-puntoclub-prod-br-001`

Validacion QA publicada:
- Resultado `TASK-601`: aprobado.
- Sesion real/controlada con `Aurisbel Pasteleria`.
- Pantalla `Enviar campanas` muestra:
  - `Campanas guardadas`;
  - `Preview`;
  - `Seleccionar destinatarios`.
- Guardar campana crea plantilla y no guarda destinatarios.
- Destinatarios se seleccionan al momento de enviar.
- `Seleccionar elegibles` respeta limite MVP de 5 y no marca dados de baja.
- `Con puntos` marca solo elegibles con puntos.
- `Limpiar seleccion` vuelve a `0 seleccionados de 5`.
- Dados de baja visibles con estado `Baja promocional` y checkbox deshabilitado.
- Con seleccion valida, boton muestra `Enviar a 5`.
- Responsive mobile 390x844 sin overflow horizontal observado.
- No se ejecuto envio real.

Confirmacion de flag:
- `PROMOTIONAL_EMAIL_SEND_ENABLED=false`.
- QA valido el flag publicado en modo read-only.
- No se cambio sender ni secretos en este cierre.

Datos de prueba:
- QA creo una campana publicada:
  - `QA TASK-601 704778`
- Queda como dato de prueba en ambiente publicado.

Uso Azure SQL:
- No directo desde esta tarea.
- Referencia: `TASK-601` uso ambiente publicado con sesion real/controlada y creo una campana QA; no hubo conexion SQL directa ni scripts SQL.

Uso ACS / correos reales:
- No.
- No se enviaron correos reales.

Riesgos o pendientes:
- La prueba real de envio promocional queda pendiente para PO.
- Mantener `PROMOTIONAL_EMAIL_SEND_ENABLED=false` hasta decision explicita.
- Si se requiere historial de multiples envios por una misma plantilla, crear tarea futura para modelo `PromotionalCampaignSends`.
- Pendiente de higiene git: commitear handoffs `TASK-600`, `TASK-601` y `TASK-602` si se desea trazabilidad remota.

Siguiente recomendado:
- Crear tarea de Infra para activar temporalmente `PROMOTIONAL_EMAIL_SEND_ENABLED=true` solo durante prueba PO.
- Crear tarea PO Test para ejecutar prueba real controlada desde la Web publicada.
