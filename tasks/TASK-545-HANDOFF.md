Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Correos operativos
Tarea: TASK-545 - Definir alcance MVP real de correos operativos por empresa

Resultado:
- Se define el alcance MVP real para habilitar correos operativos por empresa.
- Se confirma que este paquete NO incluye promociones, campanas masivas ni envio manual de marketing.
- Se mantiene Azure/ACS Email actual como sender por costos y simplicidad operativa.
- Se recomienda avanzar primero con bienvenida, compra y canje/redencion.

Decision principal:
- Los correos operativos deben implementarse como confirmaciones automaticas asociadas a eventos del programa.
- Deben ser best-effort: si falla el correo, no se revierte ni bloquea el registro de cliente, compra o canje.
- Deben quedar configurables por empresa desde `Mi empresa > Comunicaciones`.
- Deben registrar intento/resultado para diagnostico basico.

Alcance MVP aprobado:
1. Correo al registrar cliente
- Trigger: cliente creado exitosamente con email valido.
- Setting por empresa: `welcomeEnabled`.
- Template key: `customer_welcome`.
- Variables:
  - nombre de cliente;
  - nombre de empresa;
  - email/contacto de empresa si existe;
  - fecha de registro;
  - saldo inicial de puntos, si aplica.
- Regla:
  - no enviar si el cliente no tiene email;
  - no bloquear el registro si falla el envio.

2. Correo al registrar compra
- Trigger: compra creada exitosamente.
- Setting por empresa: `purchaseEnabled`.
- Template key: `purchase_registered`.
- Variables:
  - nombre de cliente;
  - nombre de empresa;
  - monto de compra;
  - puntos ganados;
  - saldo total de puntos despues de la compra;
  - fecha de compra;
  - numero de factura si existe;
  - contacto de empresa si existe.
- Regla:
  - usar snapshot del saldo despues de confirmar la compra;
  - no bloquear compra si falla el envio.

3. Correo al registrar canje/redencion
- Trigger: canje/redencion creado exitosamente.
- Setting por empresa: `redemptionEnabled`.
- Template key: `redemption_registered`.
- Variables:
  - nombre de cliente;
  - nombre de empresa;
  - puntos redimidos;
  - saldo total de puntos despues del canje;
  - fecha del canje;
  - nota del canje si existe;
  - contacto de empresa si existe.
- Regla:
  - usar snapshot del saldo despues de confirmar el canje;
  - no bloquear canje si falla el envio.

Configuracion por empresa:
- Ubicacion esperada en UI: `Mi empresa > Comunicaciones`.
- Switches MVP:
  - `Enviar bienvenida al registrar cliente`.
  - `Enviar confirmacion de compra`.
  - `Enviar confirmacion de canje`.
- Campo opcional:
  - `replyToEmail`, usando correo de empresa/contacto si existe y pasa validacion.
- Defaults recomendados:
  - Para empresas existentes: apagado inicialmente si se quiere evitar envios inesperados en produccion.
  - Para piloto controlado: Product Owner puede activar manualmente por empresa despues de QA.
  - Para empresas nuevas: apagado por defecto hasta que la empresa lo configure o hasta decision posterior.

Sender / remitente:
- Mantener sender actual de Azure/ACS Email usado por Punto Club.
- Display name: `Punto Club`.
- No enviar desde el dominio/correo de cada empresa en MVP.
- El correo debe dejar claro en subject/cuerpo la empresa relacionada.
- `reply-to` puede ser el correo de empresa/contacto solo si esta validado.

Plantillas:
- Usar plantillas controladas server-side.
- No permitir HTML libre de la empresa para operativos.
- Mantener formato consistente con correos actuales de Punto Club.
- Incluir copy claro:
  - `Este correo confirma una accion registrada en Punto Club.`
  - No incluir baja promocional como si fuera marketing.
  - Para soporte/respuesta, mostrar contacto de la empresa cuando este disponible.

Persistencia minima requerida:
- Configuracion por empresa para los tres switches y reply-to.
- Registro de evento operativo con idempotencia.
- Registro de mensaje/intento con:
  - company_id;
  - customer_id;
  - tipo/template;
  - email destino;
  - subject;
  - payload/snapshot redaccionable;
  - estado: `skipped`, `queued`, `accepted`, `failed`;
  - provider_message_id si ACS lo devuelve;
  - error resumido si falla.
- No se requiere en este MVP consumir eventos de delivery/rebote en tiempo real; queda recomendado para fase siguiente.

Idempotencia:
- Bienvenida: `customer.welcome:{companyId}:{customerId}`.
- Compra: `purchase.registered:{companyId}:{purchaseId}`.
- Canje: `redemption.registered:{companyId}:{redemptionId}`.
- Si el evento ya existe, no duplicar envio.

Reglas de skip:
- Setting desactivado.
- Cliente sin email.
- Email invalido.
- Email suprimido por hard bounce si ya existe esa marca.
- ACS/configuracion de email no disponible.
- Error de render de plantilla.

Estados esperados:
- `skipped`: no se intenta enviar por regla conocida.
- `queued` o `accepted`: ACS acepto o se dejo en cola segun implementacion.
- `failed`: fallo al intentar enviar.
- No prometer `delivered` hasta que exista integracion formal con eventos de entrega.

Contrato API recomendado:
- `GET /api/my-company/communication-settings`
  - devuelve switches operativos y reply-to.
- `PATCH /api/my-company/communication-settings`
  - actualiza switches operativos y reply-to.
  - debe auditar cambios.
- `GET /api/my-company/communication-email-messages?category=operational&from=&to=&status=`
  - historial basico de correos operativos.
  - puede quedar para una segunda subfase si el MVP necesita reducir alcance.

UI recomendada:
- En `Mi empresa > Comunicaciones`:
  - mostrar seccion `Correos operativos`.
  - mostrar switches para bienvenida, compra y canje.
  - mostrar estado informativo: `Se envian con Punto Club y no bloquean la operacion si fallan`.
  - mostrar `reply-to` editable o usar correo de empresa como default validado.
  - guardar configuracion real por API.
- No habilitar `Enviar campañas` desde este paquete.
- Mantener cualquier seccion promocional como pausada/bloqueada.

QA minimo requerido:
- Configuracion:
  - leer settings por empresa;
  - activar/desactivar switches;
  - persistencia despues de refresh/login.
- Registro de cliente:
  - con setting activo y email valido: se intenta enviar;
  - sin email o setting apagado: se registra skip o no se intenta, segun diseño final.
- Compra:
  - compra se guarda aunque ACS falle;
  - puntos/saldo del correo usan snapshot correcto.
- Canje:
  - canje se guarda aunque ACS falle;
  - puntos/saldo del correo usan snapshot correcto.
- Seguridad:
  - una empresa no puede leer/configurar comunicaciones de otra;
  - no se exponen secretos ni connection strings;
  - no se loguean tokens ni payloads sensibles.
- Publicado:
  - envio real controlado solo con mailbox aprobado por Product Owner y volumen minimo.

Fuera de alcance:
- Promociones/campanas masivas.
- Seleccion manual de clientes para marketing.
- Baja promocional.
- Custom domain para promociones.
- Event Grid/delivery events completos.
- Scheduler de vencimiento de membresias.
- Editor HTML libre.
- Imagenes/banner.
- Segmentacion avanzada.

Dependencias y tareas recomendadas:
- SQL DEV:
  - preparar migracion minima para configuracion por empresa y log de mensajes/eventos operativos.
- Backend/API:
  - implementar settings, plantillas operativas y envio best-effort para bienvenida/compra/canje.
  - usar ACS actual y mocks/tests para fallos.
- Web Dev:
  - conectar `Mi empresa > Comunicaciones` a settings reales.
  - mostrar switches reales y estado de guardado.
- QA:
  - validar local con mocks de ACS.
  - validar publicado con prueba controlada y pocos correos reales.
- Infra:
  - confirmar que ACS actual y limites del Azure Managed Domain son suficientes para piloto operativo bajo.
  - no habilitar promociones.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- Tarea documental/de decision.

Riesgos:
- El Azure Managed Domain tiene limites bajos; si el piloto genera muchos registros/compras/canjes por hora, puede limitar envios operativos.
- Si se activan switches por defecto en empresas existentes, se podrian enviar correos inesperados; por eso se recomienda activacion controlada.
- Sin delivery events no se sabra entrega final, solo aceptacion/fallo inmediato.
- Correos operativos no deben confundirse con promociones para evitar reclamos de spam.

Siguiente recomendado:
- Crear tareas separadas para SQL DEV, Backend/API, Web Dev y QA local.
- No publicar ni habilitar envio real hasta tener QA local y decision de prueba controlada.

Movimiento de tablero sugerido:
- TASK-545 a Done.
