Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Prueba visual email
Tarea: TASK-557 - Definir prueba visual real de correos operativos

Resultado:
- Se autoriza una prueba visual real y controlada de correos operativos.
- El objetivo es revisar como llegan y como se ven los correos de bienvenida, compra y canje/redencion.
- La prueba queda limitada a un solo mailbox controlado y a una empresa objetivo.
- No se autoriza envio a clientes reales ni a otros correos.

Autorizacion explicita:
- Mailbox receptor autorizado:
  - `pj13eros@hotmail.com`
- Empresa objetivo:
  - `eventos_aurisbel`
- Cliente de prueba:
  - `Fatima Arraiz`
- Correos operativos autorizados:
  - bienvenida al registrar cliente;
  - confirmacion de compra;
  - confirmacion de canje/redencion.
- Volumen maximo autorizado:
  - 1 correo de bienvenida;
  - 1 correo de compra;
  - 1 correo de canje/redencion;
  - maximo total: 3 correos reales.

Datos minimos recomendados para la prueba:
- Cliente:
  - nombre: `Fatima Arraiz`
  - correo: `pj13eros@hotmail.com`
  - telefono: usar un valor de prueba si la UI/API lo requiere.
- Compra:
  - monto sugerido: `10000`
  - factura/descripcion: `QA-EMAIL-557`
  - fecha: fecha del dia de ejecucion.
- Canje/redencion:
  - puntos a redimir: valor menor al saldo disponible despues de la compra.
  - nota sugerida: `QA correo operativo TASK-557`.

Criterios de exito:
- Se recibe correo de bienvenida en `pj13eros@hotmail.com`.
- Se recibe correo de compra en `pj13eros@hotmail.com`.
- Se recibe correo de canje/redencion en `pj13eros@hotmail.com`.
- Los correos muestran:
  - marca Punto Club;
  - empresa relacionada;
  - datos principales de la accion;
  - puntos ganados o redimidos donde aplique;
  - saldo total donde aplique.
- Las operaciones de cliente, compra y canje quedan registradas correctamente.
- Si algun correo falla, la operacion de negocio no debe revertirse.

Limites de seguridad:
- No usar correos de clientes reales.
- No enviar a otros destinatarios.
- No probar promociones ni campanas.
- No activar envio masivo.
- No exponer tokens, connection strings, cookies, contrasenas ni headers sensibles en evidencia.
- No publicar capturas con datos sensibles sin redaccion.

Precondiciones para QA:
- Confirmar que la empresa objetivo corresponde a la cuenta/empresa publicada esperada.
- Confirmar que los switches de correos operativos estan activos para la empresa objetivo:
  - bienvenida;
  - compra;
  - canje/redencion.
- Si hay que cambiar settings, hacerlo solo para la empresa objetivo y documentarlo.
- Mantener `Enviar campañas` y promociones bloqueados.

Evidencia esperada:
- Handoff de QA con:
  - fecha/hora aproximada de ejecucion;
  - empresa usada;
  - cliente de prueba usado;
  - resultado de registro/compra/canje;
  - confirmacion de recepcion de cada correo;
  - observaciones visuales de subject, remitente, contenido y formato;
  - capturas o resumen redaccionado, sin exponer datos sensibles.

Uso cloud/SQL:
- No se uso Azure SQL en esta tarea de decision.
- No se envio correo en esta tarea de decision.
- La ejecucion real queda delegada a QA en una tarea separada.

Riesgos:
- ACS Email usa Azure Managed Domain con limites bajos; esta prueba queda dentro de volumen minimo.
- Sin delivery events completos, la evidencia principal sera recepcion en mailbox y logs/resultados disponibles.
- Si el cliente ya existe con ese correo en la empresa objetivo, QA debe evitar duplicar innecesariamente o documentar si reutiliza/crea un identificador de prueba.

Siguiente recomendado:
- Ejecutar TASK-558 con QA para realizar la prueba visual real controlada.

Movimiento de tablero sugerido:
- TASK-557 a Done.
