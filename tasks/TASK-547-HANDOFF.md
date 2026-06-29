Equipo: Backend/API
Modo de ejecucion: Comunicaciones / Correos operativos
Tarea completada: TASK-547 - Implementar API y envio best-effort de correos operativos

Archivos cambiados:
- `api/package.json`
- `api/src/functions/customers.js`
- `api/src/functions/purchases.js`
- `api/src/functions/redemptions.js`
- `api/src/functions/operationalEmailSettings.js`
- `api/src/lib/notifier.js`
- `api/src/lib/operationalEmails.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/operational-emails.test.js`
- `tasks/TASK-547-HANDOFF.md`

Contrato/API:
- Nuevo `GET /api/companies/{companyId}/operational-email-settings`.
- Nuevo `PATCH /api/companies/{companyId}/operational-email-settings`.
- Payload:
  - `welcomeEnabled: boolean`
  - `purchaseEnabled: boolean`
  - `redemptionEnabled: boolean`
  - `replyToEmail: string | null`

Implementacion:
- Plantillas server-side para:
  - bienvenida al registrar cliente;
  - compra registrada con puntos ganados y saldo total;
  - canje registrado con puntos redimidos y saldo total.
- Envio best-effort via ACS actual:
  - no bloquea creacion de cliente;
  - no bloquea registro de compra;
  - no bloquea registro de canje;
  - si ACS falla, registra intento fallido y devuelve la operacion principal.
- Idempotencia por evento:
  - `welcome:customer:{customerId}`;
  - `purchase:{purchaseId}`;
  - `redemption:{redemptionId}`.
- Logging:
  - evento operativo;
  - mensaje;
  - intento.
- `sendEmailViaAcs` ahora soporta `replyTo` opcional cuando el mensaje lo incluye.

Verificacion ejecutada:
- `npm test` en `api/`: 141 tests OK.
- `node --check` para archivos API modificados.
- Pruebas nuevas:
  - template welcome usa reply-to y destinatario cliente.
  - template purchase incluye puntos ganados y saldo total.
  - best-effort envia con adapter inyectado y registra intento.
  - idempotencia evita reenvio en evento duplicado.

Resultado:
- API local lista para usar settings reales y envio operativo best-effort.
- No se enviaron correos reales.
- No se uso ACS real.

Riesgos o pendientes:
- Requiere aplicar migracion SQL de TASK-546 antes de uso real.
- Falta smoke publicado tras aplicar SQL y publicar API.
- No incluye promociones/campanas masivas por alcance.

Siguiente recomendado:
- Aplicar migracion SQL.
- Publicar API.
- Validar en ambiente publicado con ACS configurado y un correo controlado.
