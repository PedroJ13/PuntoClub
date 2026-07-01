Equipo: Web Dev
Modo de ejecucion: Auth / Promociones
Tarea completada: TASK-631 - Corregir manejo frontend de autenticacion en campanas promocionales

Archivos cambiados:
- `app/src/app.js`
- `tasks/TASK-631-HANDOFF.md`

Implementacion:
- Se actualizo `renderCommunicationCampaignError` para manejar errores de autenticacion en promociones.
- Si el API devuelve `UNAUTHORIZED` o `FORBIDDEN` en flujos de campanas, la Web ahora:
  - limpia `currentAuthIdentity`;
  - ejecuta `renderSignedOut()`;
  - redirige visualmente a `/login`;
  - muestra `Tu sesión expiró. Accede nuevamente a tu panel.`
- Esto aplica a los flujos que ya llaman `renderCommunicationCampaignError`, incluyendo:
  - listar campanas;
  - guardar campana;
  - seleccionar campana;
  - preview;
  - listar destinatarios;
  - baja promocional desde panel;
  - envio promocional.

Contrato frontend revisado:
- `createPromotionalCampaign` usa `credentials: "include"`.
- `listPromotionalCampaigns` usa `credentials: "include"`.
- `previewPromotionalCampaign` usa `credentials: "include"`.
- `listPromotionalRecipients` usa `credentials: "include"`.
- `selectPromotionalCampaignRecipients` usa `credentials: "include"`.
- `sendPromotionalCampaign` usa `credentials: "include"`.
- La URL base publicada apunta a `https://func-puntoclub-prod-br-001.azurewebsites.net`.
- La empresa activa se actualiza con `api.setActiveCompanyId(identity.company.id)` al autenticar.

Reglas preservadas:
- No se cambiaron reglas backend.
- No se cambiaron contratos API.
- No se activo ni desactivo envio real.
- No se cambiaron flags.
- No se enviaron correos.
- No se agregaron dependencias.

Verificacion ejecutada:
- `node --check app\src\app.js`
- `node --check app\src\customerApi.js`
- Revision de diff limitado a `app/src/app.js`.

Uso Azure SQL:
- No.
- Motivo: ajuste local de manejo frontend de autenticacion; no requiere DB real.

Riesgos o pendientes:
- Falta QA publicado con sesion real/controlada de Aurisbel para confirmar que, ante sesion expirada, la pantalla redirige a login en vez de dejar error generico.
- Si con sesion recien iniciada el POST sigue devolviendo `401`, se requiere evidencia de cookies/headers del navegador real o nueva tarea Backend/Infra para inspeccion mas profunda de sesion.
