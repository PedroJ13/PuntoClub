Equipo: Product / Architect / Release
Modo de ejecucion: Release decision
Tarea completada: TASK-701 - Decidir cambio Web a api.puntoclubcr.com

Resultado:
- Se revisaron `TASK-696` a `TASK-700`.
- Se aprueba publicar cambio Web de configuracion para apuntar la API a `https://api.puntoclubcr.com`.
- No se aprueban cambios API, SQL, ACS, feature flags ni UI.
- No se autoriza envio real de correos.

Handoffs procesados:
- `tasks/TASK-696-HANDOFF.md`
- `tasks/TASK-697-HANDOFF.md`
- `tasks/TASK-698-HANDOFF.md`
- `tasks/TASK-699-HANDOFF.md`
- `tasks/TASK-700-HANDOFF.md`

Evidencia de Infra:
- `api.puntoclubcr.com` existe en DNS.
- `api.puntoclubcr.com` fue agregado como hostname custom en `func-puntoclub-prod-br-001`.
- Certificado administrado App Service creado y asociado con SNI.
- HTTPS funcional.
- `GET https://api.puntoclubcr.com/api/me` sin sesion responde `401 UNAUTHORIZED`.
- CORS estricto:
  - `https://puntoclubcr.com`
  - `https://www.puntoclubcr.com`
  - `supportCredentials=true`
  - sin wildcard.

Decision:
- Publicar cambio en `app/app-config.js`:
  - de `https://func-puntoclub-prod-br-001.azurewebsites.net`
  - a `https://api.puntoclubcr.com`

Alcance aprobado:
- Solo configuracion Web.
- Mantener `credentials: include`.
- No modificar copy/UX.
- No modificar backend.

Riesgos aceptados:
- `azurewebsites.net` debe mantenerse disponible como fallback operativo hasta que QA valide login con el nuevo dominio.
- Si QA detecta fallo de sesion, se debe revisar CORS/cookie/domain antes de revertir.
- CORS actual no permite localhost; si se necesita QA local contra API publicada, debe pedirse ajuste temporal de Infra.

Uso Azure SQL:
- No.
- Motivo: decision de release Web sin cambios de datos ni migraciones.

Siguiente recomendado:
- Ejecutar `TASK-702`: actualizar `app/app-config.js`, commit/push y verificar workflow Web.
- Luego ejecutar `TASK-703`: QA login normal/incognito con API same-site.
