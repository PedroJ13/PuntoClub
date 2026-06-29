Equipo: Product / Architect / Release
Modo de ejecucion: Decision / Prueba visual email
Tarea: TASK-559 - Autorizar prueba visual real de correos operativos con DEMO 1

Resultado:
- Se reemplaza la empresa objetivo de TASK-557 para la prueba visual real.
- La prueba ya no se ejecutara con `eventos_aurisbel`.
- Se autoriza ejecutar la prueba real controlada con `DEMO 1`.
- Se autoriza usar el cliente existente de `DEMO 1` asociado al mailbox autorizado.

Autorizacion actualizada:
- Empresa objetivo:
  - `DEMO 1`
  - `companyId=6`
- Mailbox receptor autorizado:
  - `pj13eros@hotmail.com`
- Cliente autorizado:
  - cliente existente de `DEMO 1` asociado a `pj13eros@hotmail.com`
  - precheck read-only previo lo identifico como `Pedro Gutierrez`
- Correos operativos autorizados:
  - bienvenida/registro, solo si QA determina una forma segura de producirlo sin duplicar indebidamente datos;
  - confirmacion de compra;
  - confirmacion de canje/redencion.
- Volumen maximo autorizado:
  - maximo total: 3 correos reales.
  - no enviar a otros correos.

Decision sobre cliente:
- Se reutiliza el cliente existente de `DEMO 1` asociado a `pj13eros@hotmail.com`.
- No se crea un nuevo cliente con otro correo.
- Como el cliente ya existe, QA debe documentar si el correo de bienvenida no aplica o si requiere una accion separada para crear un cliente nuevo.
- Si no se puede generar bienvenida sin crear duplicado o alterar datos de forma confusa, QA debe marcar bienvenida como no ejecutada por cliente existente y completar compra/canje para revisar formato operativo.

Datos minimos recomendados para compra/canje:
- Compra:
  - factura/descripcion sugerida: `QA-EMAIL-559`
  - monto sugerido: `10000`
  - fecha: fecha del dia de ejecucion.
- Canje/redencion:
  - puntos a redimir: valor menor al saldo disponible del cliente despues de la compra.
  - nota sugerida: `QA correo operativo TASK-559`.

Precondiciones:
- Confirmar por API/Web publicada que `DEMO 1` tiene settings operativos activos:
  - bienvenida;
  - compra;
  - canje/redencion.
- Confirmar que el cliente objetivo pertenece a `DEMO 1`.
- Confirmar que el correo objetivo es `pj13eros@hotmail.com`.
- Mantener promociones y `Enviar campañas` bloqueados.

Limites de seguridad:
- No enviar a clientes reales distintos.
- No usar otro mailbox.
- No probar promociones/campanas.
- No activar envio masivo.
- No exponer tokens, cookies, passwords, connection strings ni headers sensibles.
- No publicar capturas sin redaccion.

Criterios de exito:
- Se reciben los correos operativos ejecutados en `pj13eros@hotmail.com`.
- Los correos muestran:
  - remitente/display name de Punto Club;
  - empresa relacionada `DEMO 1`;
  - datos principales de la accion;
  - puntos ganados o redimidos donde aplique;
  - saldo total donde aplique.
- Compra y canje quedan registrados correctamente.
- Si algun correo falla, la operacion principal no debe revertirse.

Uso cloud/SQL:
- No se uso Azure SQL en esta tarea de decision.
- No se envio correo en esta tarea de decision.
- La ejecucion real queda delegada a QA en una tarea separada.

Riesgos:
- Como el cliente ya existe, el correo de bienvenida podria no aplicar sin crear un cliente nuevo.
- El mailbox autorizado ya esta asociado a un cliente existente en `DEMO 1`; eso reduce riesgo de enviar a terceros, pero puede limitar la prueba de bienvenida.
- ACS Email usa Azure Managed Domain con limites bajos; mantener maximo 3 correos reales.

Siguiente recomendado:
- Crear/reabrir tarea QA para ejecutar prueba visual real con `DEMO 1`, cliente existente y mailbox `pj13eros@hotmail.com`.

Movimiento de tablero sugerido:
- TASK-559 a Done.
