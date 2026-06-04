Equipo:
Infra / Azure

Tarea completada:
Creacion de Azure Static Web Apps para Punto Club, configuracion CORS de API estable para el hostname real, y preparacion de workflow GitHub Actions para publicar `app/`.

Confirmacion recibida del usuario:
```text
Confirmado
usa git hub
```

Metodo usado:
- GitHub Actions.
- Se creo el recurso Azure Static Web Apps.
- Se preparo workflow local en el repo.
- El deploy todavia no esta publicado desde GitHub porque falta cargar el deployment token como GitHub Secret y empujar/ejecutar el workflow.

Recursos creados:
- Static Web App: `swa-puntoclub-prod-001`
- Resource group: `resource_group_main`
- Region: `East US 2`
- Plan: `Free`
- Hostname real:

```text
https://calm-dune-075dc5c0f.7.azurestaticapps.net
```

API estable:
```text
https://func-puntoclub-prod-br-001.azurewebsites.net/api
```

CORS agregado en Azure Functions:
- Se agrego el hostname real de Static Web Apps:
  - `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Se mantuvieron origenes locales de prueba:
  - `http://127.0.0.1:4173`
  - `http://127.0.0.1:4175`
- No se uso wildcard `*`.

Configuracion CORS efectiva:

```json
{
  "allowedOrigins": [
    "http://127.0.0.1:4173",
    "http://127.0.0.1:4175",
    "https://calm-dune-075dc5c0f.7.azurestaticapps.net"
  ],
  "supportCredentials": false
}
```

Workflow preparado:
- Archivo creado:
  - `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml`
- Configuracion:
  - branch: `main`
  - app location: `app`
  - api location: vacio
  - output location: vacio
  - action: `Azure/static-web-apps-deploy@v1`
  - secret esperado: `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001`

Secret requerido en GitHub:
- Nombre:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001`
- Valor:
  - deployment token de `swa-puntoclub-prod-001`.
- No se imprimio ni se guardo el token en repo.

Comando seguro sugerido para cargar secret si `gh` esta disponible:

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

Alternativa sin `gh`:
- Abrir GitHub repo `PedroJ13/PuntoClub`.
- Ir a Settings -> Secrets and variables -> Actions.
- Crear repository secret `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001`.
- Pegar el deployment token de Azure Static Web Apps.
- Luego commitear/pushear el workflow o ejecutarlo manualmente con `workflow_dispatch`.

Evidencia de carga de UI:
- Verificado `GET https://calm-dune-075dc5c0f.7.azurestaticapps.net`: `200`.
- Estado actual: responde contenido default de Static Web Apps, no todavia la UI de `app/`, porque falta completar GitHub Secret + workflow run.

Verificacion ejecutada:
- Leidos `chat-start/INFRA.md`, `AGENTS.md`, `tasks/TASK-040-HANDOFF.md` y `tasks/TASK-043.md`.
- Creada `swa-puntoclub-prod-001`.
- Agregado hostname real a CORS de Azure Functions.
- Verificado CORS final con `az functionapp cors show`.
- Verificado que la SWA responde HTTP `200`.
- Creado workflow GitHub Actions sin tokens ni secretos.
- No se creo otra DB.
- No se reutilizo `puntoevento`.
- No se cambiaron contratos API.
- No se implementaron pantallas.

Resultado:
Infra dejo el recurso frontend estable creado y la integracion GitHub Actions preparada, pero la publicacion de `app/` queda bloqueada hasta cargar el GitHub Secret del deployment token y ejecutar el workflow.

Riesgos o pendientes:
- Bloqueante: falta configurar el GitHub Secret `AZURE_STATIC_WEB_APPS_API_TOKEN_SWA_PUNTOCLUB_PROD_001`.
- Bloqueante: falta commitear/pushear `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml` o crear el workflow en GitHub.
- La URL actual muestra contenido default hasta que GitHub Actions publique `app/`.
- El deployment token debe tratarse como secreto y no pegarse en docs, handoffs ni archivos versionados.
- CORS ya esta listo para el hostname real.

Siguiente recomendado:
Cargar el secret en GitHub, commitear y pushear el workflow a `main`, esperar el run de GitHub Actions y luego validar `https://calm-dune-075dc5c0f.7.azurestaticapps.net` cargando la UI real contra `https://func-puntoclub-prod-br-001.azurewebsites.net/api`.
