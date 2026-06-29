Equipo: Diseno / UX
Modo de ejecucion: Comunicaciones / UX
Tarea: TASK-516 - Disenar panel de configuracion de correos y campanas para empresas

Resultado:
- Se define UX del centro de comunicaciones para empresas con tres superficies: configuracion, campanas y clientes/preferencias.
- La experiencia debe dejar claro que operativos y promocionales son canales distintos.
- No se implemento codigo en esta tarea.

Estructura propuesta:
- Seccion principal: `Comunicaciones`.
- Tabs o bloques:
  1. Configuracion
  2. Campanas
  3. Clientes y preferencias
  4. Historial

Configuracion:
- Switches esperados:
  - Bienvenida al registrar cliente.
  - Compra registrada.
  - Canje/redencion registrada.
  - Beneficio usado.
  - Membresia activada/renovada.
  - Campanas promocionales.
  - Incluir puntos disponibles por defecto.
- Estados:
  - Promociones deshabilitadas si no existe dominio custom/bajas/cuotas.
  - Mostrar motivo operativo compacto, no tecnico.

Campanas:
- Campos:
  - Nombre interno.
  - Asunto.
  - Mensaje.
  - Incluir puntos disponibles.
  - Filtro de destinatarios.
- Acciones:
  - Guardar borrador.
  - Previsualizar.
  - Preparar destinatarios.
  - Enviar con confirmacion.
- Antes de enviar:
  - resumen de destinatarios;
  - costo estimado;
  - aviso de baja promocional;
  - confirmacion explicita.

Preview:
- Debe mostrar:
  - asunto;
  - remitente visible;
  - empresa;
  - cuerpo;
  - variables resueltas;
  - footer de baja si es promocional.
- Debe soportar preview con cliente de ejemplo.

Variables visibles:
- `customer.name`
- `company.name`
- `points.currentBalance`
- `transaction.pointsEarned`
- `transaction.pointsRedeemed`
- `transaction.amount`
- `transaction.date`
- `promotion.title`
- `promotion.validUntil`
- `membership.planName`
- `benefit.name`

Clientes/preferencias:
- Listado con:
  - nombre;
  - email;
  - puntos;
  - estado promocional: suscrito, baja, suprimido, sin email.
- Filtros:
  - suscritos;
  - dados de baja;
  - sin email/no aptos.
- Copy para baja:
  - "La baja solo aplica a promociones. El cliente conserva sus puntos, beneficios e historial."

Historial:
- Tabla con:
  - fecha;
  - tipo;
  - destinatario;
  - estado;
  - campana/evento;
  - detalle de fallo resumido.
- Estados visibles:
  - En cola.
  - Enviado.
  - Entregado.
  - Rebotado.
  - Suprimido.
  - Bloqueado.
  - Fallo.

Microcopy recomendado:
- Configuracion operativa:
  - "Estos correos acompañan acciones del programa y no deben bloquear la operacion."
- Promociones:
  - "Las campanas se envian solo a clientes suscritos y siempre incluyen baja."
- Puntos disponibles:
  - "Los puntos se toman como snapshot al preparar el envio."
- Envio:
  - "Revisa destinatarios, costo estimado y baja antes de enviar."

Verificacion ejecutada:
- Lectura de `tasks/TASK-510-HANDOFF.md`, `tasks/TASK-511-HANDOFF.md`, `tasks/TASK-512-HANDOFF.md`, `tasks/TASK-514-HANDOFF.md` y `tasks/TASK-515-HANDOFF.md`.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.

Riesgos o pendientes:
- Falta definir pantalla de confirmacion final cuando el envio real exista.
- Falta definir comportamiento para empresas sin dominio promocional habilitado.
- Falta QA de accesibilidad y responsive cuando se implemente.

Siguiente recomendado:
- Web Dev puede implementar UI local con datos mock y estados deshabilitados para envio real.
