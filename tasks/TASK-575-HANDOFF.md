Equipo: Web Dev
Modo de ejecucion: Configuracion / Promociones
Tarea completada: TASK-575 - Revisar uso de empresa activa en promociones Web

Resultado:
- Se reviso el flujo Web de promociones frente al P1 de `app-config.js` con `PUNTO_CLUB_COMPANY_ID="1"`.
- `customerApi` ya soporta `setActiveCompanyId(identity.company.id)` cuando se renderiza la sesion.
- El riesgo encontrado era una carga prematura de promociones al inicializar `app/src/app.js`, antes de confirmar sesion.
- Se removio esa carga inicial.
- Ahora promociones se cargan despues de `loadCompanySettings`, dentro del flujo autenticado, cuando la empresa activa ya viene de la sesion.
- Si no hay sesion, no se dispara carga de promociones usando el `companyId` publico.
- El envio real promocional sigue bloqueado.

Archivo modificado:
- `app/src/app.js`

Detalle tecnico:
- Se quitaron llamadas iniciales a:
  - `loadPromotionalCampaigns()`
  - `loadPromotionalRecipients()`
- Se agregaron llamadas silenciosas despues de cargar empresa autenticada:
  - `loadPromotionalCampaigns({ silent: true })`
  - `loadPromotionalRecipients({ silent: true })`
- Las funciones aceptan `options.silent` para no mostrar errores de promociones fuera del momento correcto.

Verificacion ejecutada:
- `node --check app/src/app.js`
- `node --check app/src/customerApi.js`
- `npx prettier --check ...`
  - Resultado: OK.
- `npm test` API completo tambien se ejecuto por el bloque de seguridad:
  - Resultado: 150/150 OK.

Uso Azure SQL:
- No.
- Motivo: ajuste Web local sin consultar datos reales.

Riesgos o pendientes:
- Requiere publicar Web para que el bundle publicado deje de intentar promociones con `companyId=1` antes de sesion.
- QA debe validar en publicado que el flujo autenticado use la empresa de sesion y que sin sesion no pueda operar promociones.
