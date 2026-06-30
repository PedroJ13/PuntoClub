Equipo: Diseno / UX
Modo de ejecucion: Comunicaciones / Promociones
Tarea completada: TASK-564 - Definir UX y copy de promociones, baja y confirmacion

Resultado:
- Se definio flujo UX MVP para promociones dentro de `Enviar campanas`.
- Se mantiene separacion clara entre correos operativos y promociones.
- Se confirma que la baja promocional no elimina puntos, membresias, beneficios ni historial.
- Se mantiene envio real bloqueado visual y funcionalmente.

Flujo UX definido:
1. Crear borrador
- Campos visibles:
  - nombre interno;
  - asunto;
  - mensaje;
  - incluir puntos disponibles.
- CTA: `Guardar borrador`.
- Copy de apoyo: `Crea un borrador promocional, selecciona hasta 5 clientes elegibles y revisa el preview. El envio real sigue bloqueado.`

2. Preview
- Muestra asunto, cuerpo renderizado y bloque de puntos si aplica.
- Footer obligatorio:
  - `Recibes este correo porque aceptas promociones de {empresa} en Punto Club. Puedes dejar de recibir promociones sin perder tus puntos, beneficios, membresias ni historial.`

3. Seleccion de destinatarios
- Seleccion manual con checkbox.
- Maximo MVP visible: 5 destinatarios.
- Estados visibles:
  - `Suscrito`;
  - `Baja promocional`;
  - `No apto`.
- Copy de apoyo:
  - `Seleccion manual de destinatarios elegibles. La baja promocional no elimina puntos, beneficios ni historial.`

4. Envio real bloqueado
- Boton principal permanece:
  - `Envio real bloqueado`
- Copy de bloqueo:
  - `El envio real requiere feature flag, baja promocional activa y decision explicita de publicacion.`
- Al intentar accion de envio:
  - `El envio real de promociones sigue bloqueado hasta una decision explicita.`

5. Baja promocional
- Mensaje de baja:
  - `Baja promocional registrada. Tus puntos, beneficios e historial se mantienen.`
- Regla UX:
  - Nunca presentar baja como eliminacion de cuenta, puntos o membresias.

Verificacion ejecutada:
- Revision de copy aplicado en `app/index.html` y `app/src/app.js`.
- `npx prettier --check` sobre Web: OK.
- `node --check app/src/app.js`: OK.

Uso Azure SQL:
- No.
- Motivo: tarea de UX/copy local.

Riesgos o pendientes:
- Antes de envio real falta pantalla/modal de confirmacion final con resumen y decision explicita de release.
- Falta QA visual local del flujo completo.
