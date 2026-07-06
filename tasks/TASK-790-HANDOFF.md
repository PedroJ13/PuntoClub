Equipo: Backend/API
Modo de ejecucion: Hotfix / Cumpleanos
Tarea completada: TASK-790 - Corregir filtro publicado de destinatarios cumpleaneros

Resultado:
- Corregido el flujo de destinatarios de campanas de cumpleanos para que no liste clientes no cumpleaneros.
- El endpoint de destinatarios ahora puede recibir `campaignId` y fuerza `birthdayOnly` cuando la campana seleccionada es tipo `cumpleanos`.
- El repositorio refuerza el filtro birthday-only para devolver solo clientes que cumplen anos hoy, con email valido y suscripcion promocional activa.
- El cliente Web/API ahora envia `birthdayOnly=true` y `campaignId` al endpoint correcto de destinatarios promocionales.
- Mock local alineado con la regla real para evitar falsos positivos en QA local.
- No se cambio SQL real.
- No se cambio ACS, sender ni flags.
- No se enviaron correos reales.

Causa raiz:
- En Web, `birthdayOnly` habia quedado aplicado por error al endpoint de historial de correos operativos y no al endpoint real de destinatarios promocionales.
- El backend aceptaba `birthdayOnly`, pero no inferia la regla desde el tipo de campana cuando el frontend no enviaba el parametro.
- El filtro SQL birthday-only validaba mes/dia de cumpleanos, pero no reforzaba email valido ni suscripcion promocional activa cuando `status=all`.

Archivos cambiados:
- `api/src/lib/validators.js`
- `api/src/functions/promotionalCampaigns.js`
- `api/src/lib/repository.js`
- `api/test/validators.test.js`
- `api/test/promotional-campaigns.test.js`
- `api/test/repository-customer-search.test.js`
- `app/src/customerApi.js`
- `app/src/app.js`
- `tasks/TASK-790-HANDOFF.md`

Detalle tecnico:
- `validatePromotionalRecipientQuery` ahora acepta `campaignId` opcional y lo valida como entero positivo.
- `listPromotionalRecipients` resuelve la campana por empresa autenticada y activa `birthdayOnly` si `campaign_type = 'cumpleanos'`.
- `repository.listPromotionalRecipients` exige, cuando `birthdayOnly = true`:
  - `birth_month` y `birth_day` iguales al dia actual.
  - `email` no nulo.
  - `email` con formato minimo `LIKE '%_@_%._%'`.
  - preferencia promocional `subscribed`.
- `app/src/customerApi.js` envia los parametros al endpoint correcto y el mock filtra cumpleaneros elegibles.
- `app/src/app.js` envia `campaignId` al cargar destinatarios para que Backend/API pueda aplicar la regla por tipo de campana aunque falte `birthdayOnly`.

Validaciones locales:
- `npx prettier --write api/src/lib/validators.js api/src/functions/promotionalCampaigns.js api/src/lib/repository.js app/src/customerApi.js app/src/app.js api/test/validators.test.js api/test/promotional-campaigns.test.js api/test/repository-customer-search.test.js`
- `node --check api/src/lib/validators.js`
- `node --check api/src/functions/promotionalCampaigns.js`
- `node --check api/src/lib/repository.js`
- `node --check app/src/customerApi.js`
- `node --check app/src/app.js`
- `node --check api/test/validators.test.js`
- `node --check api/test/promotional-campaigns.test.js`
- `node --check api/test/repository-customer-search.test.js`
- `node --test api/test/validators.test.js api/test/promotional-campaigns.test.js api/test/repository-customer-search.test.js`
- `npx prettier --check api/src/lib/validators.js api/src/functions/promotionalCampaigns.js api/src/lib/repository.js app/src/customerApi.js app/src/app.js api/test/validators.test.js api/test/promotional-campaigns.test.js api/test/repository-customer-search.test.js`
- `git diff --check`

Resultado de validaciones:
- Sintaxis OK.
- Tests focales: 62/62 pass.
- Prettier OK.
- `git diff --check` sin errores; solo avisos LF/CRLF.

Uso Azure SQL:
- No.
- Motivo: la tarea era hotfix local de contrato/filtro Backend/API y consumo Web; no requeria consultar ni modificar datos reales.

Riesgos o pendientes:
- Requiere publicacion API/Web para que el ambiente publicado deje de mostrar los 19 destinatarios.
- Requiere QA publicada posterior con una campana tipo `cumpleanos` y la alerta de cumpleaneros del dia.
- Si Product decide mostrar no elegibles deshabilitados dentro del flujo birthday-only, se debe definir una variante explicita de UI/contrato; esta correccion prioriza que campanas de cumpleanos no devuelvan destinatarios no cumpleaneros ni clientes sin email/suscripcion.

Siguiente recomendado:
- Crear tarea de release controlado para publicar API/Web del hotfix.
- Ejecutar QA publicada confirmando que la alerta de 2 cumpleaneros corresponde a 2 destinatarios elegibles o al conteo definido por producto.
