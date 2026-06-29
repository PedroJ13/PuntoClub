Equipo: Backend/API
Modo de ejecucion: Email / Clientes
Tarea: TASK-515 - Definir eventos operativos que enviaran correo a clientes

Resultado:
- Se definen los eventos operativos iniciales que pueden generar correo a clientes.
- Los envios operativos son best-effort y no deben bloquear transacciones de negocio.
- No se implemento codigo ni se enviaron correos.

Eventos operativos definidos:

1. Bienvenida al registrar cliente
- Trigger: cliente creado con email valido.
- Template key: `customer_welcome`.
- Variables:
  - `customer.name`
  - `company.name`
  - `company.contact`
- Regla:
  - enviar solo si `operational_welcome_enabled=true`.
  - no enviar si cliente no tiene email.

2. Compra registrada
- Trigger: compra creada exitosamente.
- Template key: `purchase_registered`.
- Variables:
  - `customer.name`
  - `company.name`
  - `transaction.amount`
  - `transaction.pointsEarned`
  - `points.currentBalance`
  - `transaction.date`
  - `purchase.invoiceNumber`
- Regla:
  - calcular saldo despues de confirmar la compra.
  - guardar snapshot de saldo usado en el correo.
  - si el correo falla, la compra sigue confirmada.

3. Canje/redencion registrada
- Trigger: redencion creada exitosamente.
- Template key: `redemption_registered`.
- Variables:
  - `customer.name`
  - `company.name`
  - `transaction.pointsRedeemed`
  - `points.currentBalance`
  - `transaction.date`
  - `redemption.note`
- Regla:
  - calcular saldo despues de confirmar redencion.
  - guardar snapshot de saldo usado en el correo.
  - si el correo falla, la redencion sigue confirmada.

4. Beneficio limitado usado
- Trigger: uso efectivo de beneficio registrado.
- Template key: `benefit_used`.
- Variables:
  - `customer.name`
  - `company.name`
  - `benefit.name`
  - `benefit.usedQuantity`
  - `benefit.remainingQuantity`
  - `membership.planName`
- Regla:
  - enviar solo si modulo beneficio/membresia esta activo y setting operativo habilitado.

5. Membresia activada/renovada/vencimiento futuro
- Trigger: activacion o renovacion de membresia; vencimiento futuro queda para tarea separada si requiere scheduler.
- Template keys:
  - `membership_activated`
  - `membership_renewed`
  - `membership_expiring_soon`
- Variables:
  - `customer.name`
  - `company.name`
  - `membership.planName`
  - `membership.startDate`
  - `membership.endDate`

Reglas no bloqueantes:
- Cada transaccion guarda primero el dato principal.
- Luego crea `CommunicationOperationalEvents` con `idempotency_key`.
- El envio se procesa best-effort o por cola.
- Errores de ACS no revierten cliente, compra, redencion, beneficio ni membresia.
- El endpoint responde exito de negocio aunque el correo quede `queued`, `skipped` o `failed`.
- El frontend puede mostrar la transaccion como completada sin prometer entrega del email.

Idempotencia:
- Bienvenida: `customer.welcome:{companyId}:{customerId}`.
- Compra: `purchase.registered:{companyId}:{purchaseId}`.
- Redencion: `redemption.registered:{companyId}:{redemptionId}`.
- Beneficio: `benefit.used:{companyId}:{benefitUsageId}`.
- Membresia: `membership.updated:{companyId}:{customerMembershipId}:{eventKind}`.

Estados sugeridos:
- Evento operativo: `pending`, `queued`, `sent`, `skipped`, `failed`.
- Mensaje email: `queued`, `accepted`, `delivered`, `failed`, `bounced`, `suppressed`, `blocked`.

Controles:
- Respetar setting por empresa.
- No respetar baja promocional para operativos criticos, pero si respetar email suprimido por hard bounce cuando aplique.
- No incluir informacion sensible.
- No enviar si email de cliente es invalido o esta vacio.
- Registrar snapshot de puntos para compra/canje.

Verificacion ejecutada:
- Lectura de `tasks/TASK-510-HANDOFF.md`, `tasks/TASK-511-HANDOFF.md`, `tasks/TASK-512-HANDOFF.md`, `tasks/TASK-513-HANDOFF.md` y `tasks/TASK-514-HANDOFF.md`.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.
- No se enviaron correos.

Riesgos o pendientes:
- Falta scheduler si se desea vencimiento futuro de membresia.
- Falta decidir si todos los operativos tendran unsubscribe/preference footer informativo o solo identidad/contacto.
- Falta implementar cola o procesamiento asincrono real.

Siguiente recomendado:
- Backend/API implementa primero bienvenida/compra/canje con tests locales y ACS mock.
- QA valida que errores de envio no rompen operaciones.
