Equipo: Backend/API
Modo de ejecucion: Promociones / Contratos
Tarea completada: TASK-595 - Ajustar contratos API para separar campana y envio promocional

Resultado:
- Se ajusto el contrato de envio promocional para recibir destinatarios en el payload del envio.
- La campana queda como contenido/plantilla.
- El endpoint de envio prepara la seleccion al momento de enviar y luego ejecuta el flujo ACS bajo feature flag.
- No se envia a clientes no seleccionados.
- Se mantiene `confirmSend`.
- Se mantiene Azure/ACS actual.
- Se mantiene `PROMOTIONAL_EMAIL_SEND_ENABLED` como feature flag.

Contrato actualizado:
- `POST /api/companies/{companyId}/promotional-campaigns/{campaignId}/send`
- Body requerido:

```json
{
  "confirmSend": true,
  "customerIds": [123, 456]
}
```

Validaciones:
- Requiere sesion de empresa.
- Requiere que `companyId` de ruta coincida con empresa de sesion.
- Requiere `confirmSend: true`.
- Requiere `customerIds` no vacio.
- Requiere maximo 5 destinatarios.
- Rechaza duplicados y ids invalidos.
- Revalida elegibilidad server-side al preparar recipients.
- Omitidos/dados de baja/suppressed no reciben correo.
- Si un cliente no esta seleccionado en `customerIds`, no entra al envio.

Compatibilidad:
- `PUT /recipients` se mantiene disponible, pero el flujo nuevo ya no depende de guardar destinatarios antes.
- `replacePromotionalCampaignRecipients` permite preparar un nuevo envio para campanas en `draft`, `ready`, `sent` o `failed`; no permite tocar `sending` ni `cancelled`.

Archivos modificados:
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/src/lib/validators.js`
- `api/test/promotional-campaigns.test.js`

Verificacion ejecutada:
- `node --test test/promotional-campaigns.test.js test/errors.test.js`
  - Resultado: 21/21 OK.
- `npm test` en `api/`
  - Resultado: 154/154 OK.
- `node --check` en archivos API/Web tocados
  - Resultado: OK.
- `npx prettier --check ...`
  - Resultado: OK.

Uso Azure SQL:
- No.
- Motivo: contrato y tests locales; no se consulto ni modifico DB real.

Uso ACS / correos reales:
- No.
- Motivo: tests con mocks; no se llamo ACS real.

Riesgos o pendientes:
- El modelo SQL aun reutiliza `PromotionalCampaignRecipients` como registro del envio asociado a la campana; no se creo tabla nueva de envios.
- Si se requiere historial de multiples envios por una misma plantilla con detalle independiente, se recomienda tarea SQL/API posterior para `PromotionalCampaignSends`.
- Requiere deploy API antes de usar el nuevo contrato publicado.
