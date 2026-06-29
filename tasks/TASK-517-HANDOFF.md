Equipo: Diseno / UX
Modo de ejecucion: Email / Copy UX
Tarea: TASK-517 - Disenar plantillas de correos operativos y promocionales para clientes

Resultado:
- Se definen plantillas base para correos operativos y promocionales.
- Se separa copy operativo de copy promocional.
- Los promocionales deben incluir baja visible.
- No se implemento codigo ni envio real.

Lineamientos generales:
- Remitente visible operativo: `Punto Club`.
- Remitente visible promocional: `Punto Club - {company.name}` o `{company.name} via Punto Club`.
- Tono: claro, directo, sin urgencia artificial.
- No prometer entrega inmediata si el correo depende de proveedor.
- No incluir datos sensibles ni links con tokens salvo flujos de acceso/reset ya controlados.

Plantilla: Bienvenida
- Subject:
  - `Bienvenido a {company.name} en Punto Club`
- Preheader:
  - `Tu registro de cliente quedo activo.`
- Cuerpo:
  - `Hola {customer.name}, ya formas parte del programa de fidelizacion de {company.name}.`
  - `Cada compra participante puede sumar puntos y beneficios segun las reglas de la empresa.`
- CTA opcional:
  - `Ver mis beneficios` solo cuando exista portal de cliente.

Plantilla: Compra registrada
- Subject:
  - `Sumaste {transaction.pointsEarned} puntos en {company.name}`
- Preheader:
  - `Tu saldo actualizado es {points.currentBalance} puntos.`
- Cuerpo:
  - `Registramos tu compra por {transaction.amount}.`
  - `Puntos ganados: {transaction.pointsEarned}.`
  - `Saldo disponible: {points.currentBalance}.`
  - `Fecha: {transaction.date}.`

Plantilla: Canje/redencion
- Subject:
  - `Canjeaste {transaction.pointsRedeemed} puntos en {company.name}`
- Preheader:
  - `Tu saldo actualizado es {points.currentBalance} puntos.`
- Cuerpo:
  - `Registramos tu canje de puntos.`
  - `Puntos redimidos: {transaction.pointsRedeemed}.`
  - `Saldo disponible: {points.currentBalance}.`
  - `Fecha: {transaction.date}.`

Plantilla: Beneficio usado
- Subject:
  - `Usaste un beneficio de {membership.planName}`
- Preheader:
  - `{benefit.name} fue aplicado correctamente.`
- Cuerpo:
  - `Hola {customer.name}, registramos el uso de tu beneficio {benefit.name}.`
  - `Empresa: {company.name}.`
  - `Membresia: {membership.planName}.`

Plantilla: Membresia activada/renovada
- Subject:
  - `Tu membresia {membership.planName} esta activa`
- Preheader:
  - `Revisa la vigencia y beneficios disponibles.`
- Cuerpo:
  - `Hola {customer.name}, tu membresia {membership.planName} quedo activa en {company.name}.`
  - `Vigencia: {membership.startDate} a {membership.endDate}.`

Plantilla: Promocion con puntos disponibles
- Subject:
  - `{promotion.title} en {company.name}`
- Preheader:
  - `Tienes {points.currentBalance} puntos disponibles.`
- Cuerpo:
  - `Hola {customer.name}, {company.name} tiene una promocion para clientes de Punto Club.`
  - `{promotion.body}`
  - `Puntos disponibles al momento del envio: {points.currentBalance}.`
  - `Promocion valida hasta: {promotion.validUntil}.`
- Footer obligatorio:
  - `Recibes este correo porque aceptas promociones de {company.name} en Punto Club.`
  - `Puedes dejar de recibir promociones sin perder tus puntos, beneficios, membresias ni historial.`
  - Link: `Dejar de recibir promociones`.

Copy de baja:
- Titulo:
  - `Dejar de recibir promociones`
- Mensaje:
  - `La baja aplica solo a correos promocionales. Mantienes tus puntos, beneficios, membresias e historial.`
- Confirmacion:
  - `Listo. Ya no recibiras promociones de {company.name}. Los correos operativos importantes pueden seguir llegando.`

Variables permitidas:
- `customer.name`
- `company.name`
- `points.currentBalance`
- `transaction.pointsEarned`
- `transaction.pointsRedeemed`
- `transaction.amount`
- `transaction.date`
- `promotion.title`
- `promotion.body`
- `promotion.validUntil`
- `membership.planName`
- `membership.startDate`
- `membership.endDate`
- `benefit.name`

Verificacion ejecutada:
- Lectura de `tasks/TASK-510-HANDOFF.md`, `tasks/TASK-511-HANDOFF.md`, `tasks/TASK-512-HANDOFF.md`, `tasks/TASK-515-HANDOFF.md` y `tasks/TASK-516-HANDOFF.md`.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.

Riesgos o pendientes:
- Falta adaptar copy final a plantilla HTML real.
- Falta legal/compliance si se escalan promociones a volumen alto.
- Falta definir si habra portal publico de cliente para ver puntos.

Siguiente recomendado:
- Backend/API usar estas plantillas como base controlada.
- Web Dev mostrar preview con estas variables y footer de baja para promocionales.
