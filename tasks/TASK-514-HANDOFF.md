Equipo: Backend/API
Modo de ejecucion: Contratos / Comunicaciones
Tarea: TASK-514 - Definir contratos API para centro de comunicaciones de empresa

Resultado:
- Se definen contratos API propuestos para configuracion de correos, campanas, preview, envio, destinatarios, bajas y historial.
- No se implementaron endpoints en esta tarea.
- Todos los endpoints privados deben derivar `companyId` desde sesion server-side, no desde el frontend.

Contratos propuestos:

1. `GET /api/my-company/communication-settings`
- Devuelve switches de correos operativos/promocionales.
- Response:
```json
{
  "operational": {
    "welcomeEnabled": false,
    "purchaseEnabled": false,
    "redemptionEnabled": false,
    "benefitEnabled": false,
    "membershipEnabled": false
  },
  "promotional": {
    "campaignsEnabled": false,
    "includePointsDefault": false
  },
  "replyToEmail": "contacto@empresa.test",
  "limits": {
    "campaignMaxRecipients": 20,
    "dailyPromotionalLimit": 50
  }
}
```

2. `PATCH /api/my-company/communication-settings`
- Actualiza configuracion por empresa.
- Validaciones:
  - `replyToEmail` debe ser email valido o null.
  - `campaignsEnabled=true` solo permitido si Infra habilito dominio/promociones y existen bajas.
  - Auditar cambio.

3. `GET /api/my-company/communication-customers?preference=promotional_active|promotional_unsubscribed|all&search=...`
- Lista clientes con email y preferencia promocional.
- Response incluye `pointsBalance`, `promotionalEmailsEnabled`, `emailSuppressed`, `lastEmailStatus`.
- No debe devolver clientes de otra empresa.

4. `POST /api/my-company/communication-campaigns`
- Crea borrador de campana promocional.
- Body:
```json
{
  "name": "Promo de julio",
  "subject": "Promo especial para clientes frecuentes",
  "bodyText": "Texto controlado de campana",
  "includePointsSnapshot": true
}
```

5. `GET /api/my-company/communication-campaigns`
- Lista campanas de la empresa con estado, conteos y fechas.

6. `GET /api/my-company/communication-campaigns/{campaignId}`
- Detalle de campana, destinatarios y resultados agregados.

7. `POST /api/my-company/communication-campaigns/{campaignId}/preview`
- Genera preview sin enviar.
- Body opcional: `customerId` para preview personalizado.
- Response:
```json
{
  "subject": "Promo especial para clientes frecuentes",
  "html": "<html redaccionado>",
  "text": "Texto plano",
  "variables": {
    "customer.name": "María",
    "company.name": "Empresa Demo",
    "points.currentBalance": 1250
  }
}
```

8. `POST /api/my-company/communication-campaigns/{campaignId}/recipients`
- Reemplaza seleccion de destinatarios del borrador.
- Body:
```json
{
  "filter": "promotional_active",
  "customerIds": ["1", "2"],
  "includePointsSnapshot": true
}
```
- Debe tomar snapshot de puntos al preparar/enviar, segun decision final.

9. `POST /api/my-company/communication-campaigns/{campaignId}/send`
- Envia campana o la deja en cola.
- Reglas:
  - requiere estado `draft` o `scheduled`;
  - requiere confirmacion explicita `confirmSend=true`;
  - bloquea si no hay baja promocional;
  - bloquea si excede cuotas;
  - idempotency key obligatoria por request.

10. `POST /api/my-company/customers/{customerId}/communication-preferences`
- Actualiza preferencias de cliente desde panel empresa.
- Body:
```json
{
  "promotionalEmailsEnabled": false,
  "source": "company_panel"
}
```

11. `GET /api/public/email-preferences/unsubscribe?token=...`
- Valida token de baja sin exponer datos innecesarios.

12. `POST /api/public/email-preferences/unsubscribe`
- Confirma baja promocional.
- Body: `{ "token": "...", "reason": "optional" }`.
- Nunca desactiva correos operativos criticos.

13. `GET /api/my-company/communication-email-messages?category=&status=&from=&to=&campaignId=`
- Historial de resultados por mensaje.
- Incluye estado, fecha, plantilla/campana, destinatario redaccionado si aplica y error resumido.

14. `POST /api/internal/acs-email-events`
- Endpoint interno/webhook para delivery events si se usa Event Grid/WebHook.
- Debe validar firma/origen segun mecanismo elegido.
- Registra delivered, failed, bounced, suppressed, blocked/spam cuando aplique.

Errores propuestos:
- `COMMUNICATIONS_DISABLED`
- `PROMOTIONS_DISABLED`
- `UNSUBSCRIBE_REQUIRED`
- `CUSTOM_DOMAIN_REQUIRED`
- `DAILY_LIMIT_EXCEEDED`
- `CAMPAIGN_RECIPIENT_LIMIT_EXCEEDED`
- `CUSTOMER_NOT_SUBSCRIBED`
- `EMAIL_SUPPRESSED`
- `CAMPAIGN_NOT_EDITABLE`
- `IDEMPOTENCY_KEY_REQUIRED`

Seguridad:
- Endpoints privados requieren sesion de empresa.
- Unsubscribe publico usa token aleatorio con hash persistido.
- No guardar ni loggear tokens planos.
- No devolver provider payload completo al frontend.
- No enviar a multiples destinatarios visibles en el mismo correo promocional.

Verificacion ejecutada:
- Lectura de `tasks/TASK-510-HANDOFF.md`, `tasks/TASK-511-HANDOFF.md`, `tasks/TASK-512-HANDOFF.md` y `tasks/TASK-513-HANDOFF.md`.
- No se ejecuto API local.
- No se enviaron correos.

Uso cloud/SQL:
- No se uso Azure.
- No se uso Azure SQL.

Riesgos o pendientes:
- Falta implementar persistencia y migracion SQL.
- Falta definir Event Grid vs polling/SDK status como mecanismo final de delivery events.
- Falta QA de rate limits y que promociones no afecten operativos.

Siguiente recomendado:
- Backend/API TASK futuro: implementar contratos con mocks/tests locales despues de migracion SQL.
- QA debe validar bloqueos server-side de promociones sin bajas/dominio/cuotas.
