Equipo: Product / Architect / Release
Modo de ejecucion: Comunicaciones / Definicion funcional
Tarea: TASK-510 - Definir modelo funcional del centro de comunicaciones para clientes

Resultado:
- Se define el centro de comunicaciones para clientes como una capacidad nueva del producto, no como correos sueltos por evento.
- Se separan correos operativos/transaccionales de correos promocionales/campanas.
- Se define que los clientes pueden darse de baja de promociones sin perder puntos, membresias, beneficios ni historial.
- Se define que los correos operativos criticos no se tratan como marketing y pueden permanecer activos mientras el cliente participe en el programa.
- Se confirma que el registro actual de cliente no envia correo; esto debe cubrirse como evento operativo futuro.

Modelo funcional:
- El centro de comunicaciones debe permitir a cada empresa:
  - configurar correos operativos;
  - crear campanas/promociones;
  - previsualizar correos antes de enviar;
  - seleccionar destinatarios;
  - incluir o no datos de puntos disponibles;
  - revisar historico de envios;
  - ver clientes activos para promociones y clientes dados de baja de promociones.
- El sistema debe mantener una separacion clara entre:
  - eventos operativos generados por acciones del programa;
  - mensajes promocionales creados por la empresa.

Correos operativos:
- Eventos operativos iniciales recomendados:
  - bienvenida al registrar cliente, si tiene correo;
  - compra registrada, con puntos ganados y saldo total;
  - canje/redencion registrada, con puntos redimidos y saldo total;
  - uso efectivo de beneficio limitado, donde aplique;
  - membresia activada/renovada/vencimiento futuro, si el modulo de membresias lo requiere.
- Reglas:
  - no deben bloquear la transaccion si falla el correo;
  - deben registrarse como intento de envio con estado;
  - deben evitar exponer datos sensibles;
  - deben usar plantillas controladas, no contenido libre de la empresa.

Correos promocionales:
- Casos esperados:
  - promocion puntual: "Manana 2x1 en helados";
  - anuncio de beneficio;
  - campaña para clientes con puntos disponibles;
  - recordatorio para aprovechar puntos o membresia.
- Deben soportar:
  - subject;
  - cuerpo;
  - imagen/banner opcional alojado por Punto Club;
  - fecha/hora de envio o envio inmediato;
  - vista previa;
  - destinatarios segun filtros simples;
  - opcion de incluir puntos disponibles.

Preferencias / baja:
- Decision:
  - la baja aplica a correos promocionales/marketing;
  - la baja no elimina cliente, puntos, membresias, beneficios ni historial;
  - la baja no debe impedir correos operativos criticos.
- Preferencias minimas por cliente:
  - `promotionalEmailsEnabled`;
  - fecha de baja promocional;
  - origen de la baja;
  - opcion futura para reactivacion.
- Copy base recomendado:
  - "Puedes dejar de recibir promociones sin perder tus puntos ni beneficios."

Configuracion por empresa:
- Cada empresa debe poder configurar:
  - enviar correo de bienvenida al registrar cliente: si/no;
  - enviar correo por compra: si/no;
  - enviar correo por canje/redencion: si/no;
  - enviar correo por uso de beneficio: si/no;
  - permitir campanas promocionales: si/no, sujeto a limites;
  - incluir puntos disponibles en promociones: default si/no;
  - reply-to de empresa, si esta validado como correo de contacto.
- La configuracion debe tener valores por defecto conservadores y auditables.

Variables disponibles:
- Variables iniciales recomendadas:
  - `customer.name`;
  - `company.name`;
  - `points.currentBalance`;
  - `transaction.pointsEarned`;
  - `transaction.pointsRedeemed`;
  - `transaction.amount`;
  - `transaction.date`;
  - `promotion.title`;
  - `promotion.validUntil`;
  - `membership.planName`;
  - `benefit.name`.
- Para promociones, `points.currentBalance` debe usarse como snapshot al momento de preparar/enviar, no como valor dinamico ambiguo despues del envio.

Alcance MVP:
- Definir modelo y contratos antes de construir UI/envios masivos.
- Priorizar primero:
  1. configuracion por empresa;
  2. preferencias/baja promocional;
  3. correo de bienvenida;
  4. correo por compra/canje;
  5. campana promocional simple con preview;
  6. historial basico de envios.

Fuera de MVP:
- Envio directo desde dominios/correos de cada empresa.
- Segmentacion avanzada por comportamiento.
- Automatizaciones complejas.
- A/B testing.
- Adjuntos pesados.
- Editor HTML libre sin controles.
- Envio masivo sin limites diarios.

Tareas recomendadas:
- TASK-512 Infra: evaluar ACS Email para operativos/promocionales, costos, limites, reputacion y bajas.
- TASK-513 SQL DEV: disenar modelo SQL de comunicaciones, preferencias, campanas, destinatarios, estados y snapshots.
- TASK-514 Backend/API: definir contratos API del centro de comunicaciones.
- TASK-515 Backend/API: definir eventos operativos que enviaran correo.
- TASK-516 Diseno / UX: disenar panel de configuracion y campanas.
- TASK-517 Diseno / UX: disenar plantillas/copy.
- TASK-518 Web Dev: implementar UI local cuando contratos esten aprobados.
- TASK-519 QA: validar localmente modelo/UX/envios simulados.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.
- Tarea documental.

Riesgos o pendientes:
- Riesgo de spam si se habilitan promociones sin limites y sin baja.
- Riesgo de costos si se permite envio masivo sin cuotas por empresa.
- Riesgo de reputacion si los correos promocionales afectan el dominio usado para correos operativos.
- Pendiente decidir detalles de infraestructura y dominio remitente en TASK-511/TASK-512.

Movimiento de tablero sugerido:
- TASK-510 a Done / Needs Review.
