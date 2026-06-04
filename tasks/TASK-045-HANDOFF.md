Equipo:
Infra / Azure

Tarea completada:
Intento de completar GitHub Secret y deploy de Static Web Apps usando GitHub Actions.

Contexto:
- Static Web App: `swa-puntoclub-prod-001`
- URL publica: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- API estable: `https://func-puntoclub-prod-br-001.azurewebsites.net/api`
- Workflow preparado localmente:
  - `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`

Confirmacion recibida:
- El usuario pidio usar GitHub:

```text
usa git hub
```

Workflow revisado:
- Usa `Azure/static-web-apps-deploy@v1`.
- Publica `app/`.
- No usa API integrada de Static Web Apps.
- Espera el secret:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001`
- No contiene tokens ni secretos.

Deployment token:
- Confirmado que existe deployment token de `swa-puntoclub-prod-001`.
- No se imprimio el token.
- No se guardo en archivos.

GitHub Secret:
- El usuario creo manualmente el repository secret en GitHub.
- Secret configurado:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001`
- No se imprimio ni se guardo el token.
- Nota: desde este entorno no se pudo crear/actualizar automaticamente porque no esta instalado `gh`.

Commit/push:
- Listo para commit/push despues de confirmar el secret.
- Cambio local pendiente antes del commit:
  - `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`

URL publicada:
```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

Evidencia de carga:
- La URL responde `200`.
- Estado actual: carga pagina default de Azure Static Web Apps, no la UI real de Punto Club.
- Motivo: el workflow aun no se ejecuto con secret valido.

Confirmacion de `app-config.js`:
- `app/app-config.js` existe y no contiene secretos.
- Configura:
  - API base: `https://func-puntoclub-prod-br-001.azurewebsites.net`
  - company id: `1`
  - mock API: `false`

CORS:
- Ya esta agregado el hostname real de SWA en Azure Functions:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Tambien siguen permitidos origenes locales:
  - `http://127.0.0.1:4173`
  - `http://127.0.0.1:4175`

Pasos exactos para desbloquear:
1. Instalar o habilitar GitHub CLI `gh`, o crear el secret manualmente desde GitHub UI.
2. Cargar el secret:

```powershell
$token = az staticwebapp secrets list `
  --name swa-puntoclub-prod-001 `
  --resource-group resource_group_main `
  --query "properties.apiKey" `
  -o tsv

gh secret set AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001 `
  --repo PedroJ13/PuntoClub `
  --body "$token"
```

3. Commit/push del workflow:

```powershell
git add .github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml tasks/TASK-045-HANDOFF.md
git commit -m "Add Static Web Apps deploy workflow"
git push origin main
```

4. Esperar el run `Deploy Punto Club frontend`.
5. Validar que `https://calm-dune-075dc5c0f.7.azurestaticapps.net` cargue la UI real.

Resultado:
Secret configurado por el usuario. Queda subir el workflow a `main`, esperar GitHub Actions y validar que la URL cargue la UI real.

Riesgos o pendientes:
- No pegar el deployment token en chat, docs ni archivos versionados.
- La URL publica seguira mostrando default page hasta que GitHub Actions publique `app/`.
