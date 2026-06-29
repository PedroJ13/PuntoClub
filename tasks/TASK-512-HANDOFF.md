Equipo: Infra
Modo de ejecucion: Email / Deliverability / Costos
Tarea: TASK-512 - Evaluar envio controlado de correos operativos y promocionales con ACS Email

Resultado:
- Se evalua ACS Email como proveedor viable para correos operativos controlados de Punto Club.
- No se recomienda habilitar campanas promocionales masivas sobre el sender actual `DoNotReply@...azurecomm.net`.
- El recurso actual usa Azure Managed Domain, aceptado para piloto, pero Microsoft lo documenta como orientado a pruebas y con limites bajos sin aumento disponible.
- Para promociones reales se recomienda crear/verificar dominio o subdominio propio, separar reputacion operativa/promocional y exigir bajas, rebotes, cuotas y monitoreo antes de enviar.

Estado actual relevante:
- ACS Email ya existe segun `tasks/TASK-127-HANDOFF.md`:
  - Email Communication Service: `email-puntoclub-prod-001`.
  - ACS: `acs-puntoclub-prod-001`.
  - Dominio: Azure Managed Domain.
  - Sender actual: `DoNotReply@f498d337-b16d-4f08-a895-611680362680.azurecomm.net`.
  - Display name: `Punto Club`.
- El producto ya uso ACS para solicitudes, invitaciones y reset/correos transaccionales.
- TASK-510 separo correos operativos de promocionales.
- TASK-511 decidio usar sender Punto Club en MVP, no dominios/correos de cada empresa.

Costos ACS Email verificados:
- Precio publicado por Azure Communication Services Email:
  - USD 0.00025 por email enviado.
  - USD 0.00012 por MB transferido.
- Formula estimada:
  - `costo = emails * 0.00025 + emails * tamanoMB * 0.00012`.
- Ejemplos con email promedio de 0.2 MB:
  - 1,000 emails: USD 0.274.
  - 10,000 emails: USD 2.74.
  - 50,000 emails: USD 13.70.
  - 100,000 emails: USD 27.40.
  - 1,000,000 emails: USD 274.00.
- Ejemplos con email promedio de 0.5 MB:
  - 1,000 emails: USD 0.31.
  - 10,000 emails: USD 3.10.
  - 50,000 emails: USD 15.50.
  - 100,000 emails: USD 31.00.
- Observacion:
  - El costo unitario es bajo; el riesgo principal no es costo puro, sino entregabilidad, reputacion, rebotes, bajas y envio accidental masivo.

Limites ACS Email verificados:
- Azure Managed Domain:
  - Send Email: 5 emails/minuto por suscripcion.
  - Send Email: 10 emails/hora por suscripcion.
  - No tiene aumento de limite disponible.
- Custom Domain:
  - Send Email: 30 emails/minuto por suscripcion.
  - Send Email: 100 emails/hora por suscripcion.
  - Puede solicitar aumento de limite.
- Limites de tamano:
  - Maximo 50 recipients por email.
  - Maximo 10 MB por request incluyendo adjuntos.
  - Base64 aumenta tamano aproximadamente 33%, por lo que el tamano practico seguro es menor.
- Escalamiento:
  - Microsoft indica que ACS Email puede soportar alto volumen, pero requiere aumento aprobado, dominio custom verificado, buena reputacion y manejo de failure rate.
  - Microsoft recomienda subir volumen gradualmente durante 2 a 4 semanas.
  - Solicitudes de aumento pueden tardar hasta 72 horas.

Evaluacion por tipo de correo:
- Operativos criticos:
  - Aprobado para piloto controlado con ACS actual si el volumen es bajo.
  - Ejemplos: bienvenida, compra registrada, canje/redencion, uso de beneficio, reset de password.
  - Deben ser best-effort: nunca bloquear compra, canje o registro si falla el correo.
  - Deben registrarse como intento con estado, motivo de fallo y correlation id sin PII innecesaria.
- Promocionales:
  - No aprobar en produccion sobre Azure Managed Domain.
  - Requieren custom domain/subdomain, baja visible, preferencias por cliente, limites por empresa y observabilidad de rebotes/quejas.
  - Deben estar apagados por feature flag hasta completar SQL/API/UX/QA del centro de comunicaciones.

Recomendacion de dominios/remitentes:
- Mantener sender actual para operativos de piloto de bajo volumen.
- Antes de promociones, configurar dominio propio verificado.
- Recomendacion preferida:
  - Dominio/subdominio operativo: `mail.puntoclubcr.com` o `notify.puntoclubcr.com`.
  - Dominio/subdominio promocional separado: `promo.puntoclubcr.com`.
- Motivo:
  - Separar reputacion promocional de correos criticos.
  - Permitir pausar promociones sin afectar reset, invitaciones o confirmaciones operativas.
  - Facilitar monitoreo y politicas por canal.

Protecciones requeridas antes de promociones:
- Baja promocional:
  - Link visible de baja en cada promocional.
  - Centro/preferencia que explique que la baja no elimina puntos, beneficios, membresias ni historial.
  - La baja debe bloquear futuros envios promocionales de forma server-side.
  - La baja no debe bloquear correos operativos criticos.
- Rebotes y supresion:
  - Consumir eventos de delivery de ACS via Event Grid o mecanismo equivalente.
  - Registrar estados terminales: Delivered, Failed, Bounced, Suppressed, FilteredSpam, Quarantined cuando esten disponibles.
  - Hard bounce: marcar email como no apto para promociones y evitar reintentos automaticos.
  - Soft bounce: aplicar backoff y limite de reintentos.
  - No depender solo de la managed suppression list de ACS; Punto Club debe tener supresion propia persistente.
- Quejas/spam:
  - Monitorear spam/abuse reports y failure rate.
  - Pausar campanas si suben rebotes, bloqueos o quejas.
  - Mantener listas sanas; no importar correos sin consentimiento operativo/comercial verificable.
- Proteccion de correos criticos:
  - Cola/logica separada para operativos vs promocionales.
  - Feature flag independiente para promociones.
  - Circuit breaker: si promocionales tienen alto fallo, apagar solo promociones.
  - Presupuesto/cuota diaria por empresa y global.
  - Idempotency key por campana/destinatario para evitar duplicados.
  - Confirmacion explicita antes de enviar campana.

Limites iniciales recomendados para Punto Club:
- Mientras se use Azure Managed Domain:
  - Operativos: maximo 5/min y 10/hora global, respetando limites de ACS.
  - Promocionales: deshabilitados.
- Con custom domain sin aumento:
  - Operativos: maximo 30/min y 100/hora global.
  - Promocionales piloto: maximo 20 destinatarios por campana, 50 por empresa/dia y 100 global/dia.
  - Enviar por lotes, no un email con multiples destinatarios visibles.
- Con custom domain y aumento aprobado:
  - Subir gradualmente por 2 a 4 semanas.
  - Mantener failure rate objetivo interno menor a 1%; investigar antes de llegar a 2%.
  - Revisar entregabilidad y costos antes de liberar mas empresas.

Manejo de volumen/costos:
- Agregar limites configurables:
  - `EMAIL_OPERATIONAL_DAILY_LIMIT_GLOBAL`
  - `EMAIL_PROMOTIONAL_DAILY_LIMIT_GLOBAL`
  - `EMAIL_PROMOTIONAL_DAILY_LIMIT_PER_COMPANY`
  - `EMAIL_CAMPAIGN_MAX_RECIPIENTS`
  - `EMAIL_PROMOTIONS_ENABLED=false` por defecto.
- Registrar costo estimado por campana:
  - destinatarios * costo unitario estimado segun tamano.
- Bloquear envio si:
  - no existe baja promocional activa;
  - no hay preferencias modeladas;
  - no hay dominio custom para promociones;
  - no hay job/log de resultados por destinatario;
  - se excede cuota empresa/global.

Riesgos:
- P1: Promociones sobre Azure Managed Domain pueden agotar limite rapido y afectar correos criticos.
- P1: Promociones sin baja clara pueden dañar reputacion y abrir riesgo legal/operativo.
- P1: Reintentar hard bounces o emails invalidos daña sender reputation.
- P1: Usar un solo dominio/sender para todo mezcla reputacion promocional con resets/invitaciones/operativos.
- P2: Azure Managed Domain luce menos profesional y tiene menos capacidad que dominio propio.
- P2: Sin eventos/logs por destinatario, no se podra explicar entregabilidad ni limpiar listas.
- P2: Campanas con imagenes grandes suben MB transferidos y probabilidad de spam.

Decision recomendada:
- Aprobar ACS Email para correos operativos controlados de bajo volumen.
- No aprobar campanas promocionales hasta completar:
  1. custom domain/subdominio propio verificado;
  2. modelo SQL de preferencias, bajas, supresion y envios;
  3. eventos de delivery/rebote via ACS/Event Grid o alternativa equivalente;
  4. limites globales/por empresa/por campana;
  5. feature flag y circuit breaker para promociones;
  6. QA local/publicado con envios simulados y un envio real controlado.

Fuentes oficiales consultadas:
- Azure Communication Services pricing:
  - https://azure.microsoft.com/en-us/pricing/details/communication-services/
- Service limits for Azure Communication Services:
  - https://learn.microsoft.com/en-us/azure/communication-services/concepts/service-limits
- Quota increase for email domains:
  - https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/email-quota-increase
- Sender reputation and managed suppression list:
  - https://learn.microsoft.com/en-us/azure/communication-services/concepts/email/sender-reputation-managed-suppression-list
- Handle ACS Email events:
  - https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/email/handle-email-events
- Email Insights:
  - https://learn.microsoft.com/en-us/azure/communication-services/concepts/analytics/insights/email-insights

Verificacion ejecutada:
- Lectura de contexto local:
  - `AGENTS.md`
  - `chat-start/INFRA.md`
  - `docs/README.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/ARCHITECTURE.md`
  - `docs/DATA_MODEL.md`
  - `docs/BACKLOG.md`
  - `docs/DECISION_LOG.md`
  - `tasks/TASK-510-HANDOFF.md`
  - `tasks/TASK-511-HANDOFF.md`
  - `tasks/TASK-120-HANDOFF.md`
  - `tasks/TASK-127-HANDOFF.md`
  - `tasks/TASK-131-HANDOFF.md`
  - `tasks/TASK-150-HANDOFF.md`
- Consulta read-only a documentacion oficial Microsoft/Azure.
- No se consulto ni modifico configuracion Azure real.
- No se envio correo.

Uso cloud/SQL:
- Cloud: si, solo lectura HTTP a documentacion oficial de Microsoft/Azure.
- Azure portal/CLI/resource changes: no.
- Azure SQL: no.
- ACS real: no se envio correo ni se cambio configuracion.

Pendientes:
- Confirmar si Product quiere usar `puntoclubcr.com` para un custom domain de email o un subdominio dedicado.
- Crear tarea Infra separada si se aprueba configurar dominio custom ACS Email.
- Crear tarea SQL DEV para preferencias, bajas, supresion, campanas, destinatarios y estados de envio.
- Crear tarea Backend/API para contratos, colas/idempotencia, Event Grid y circuit breaker.
- Crear tarea QA para validar que promociones no afectan correos criticos.

Movimiento de tablero sugerido:
- TASK-512 a Done / Needs Review.
