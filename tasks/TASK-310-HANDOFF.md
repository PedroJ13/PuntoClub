# TASK-310 - Handoff

Equipo: Ejecucion Tecnica  
Modo de ejecucion: Web Dev / Release  
Estado: Bloqueado en este entorno por conectividad  
Fecha: 2026-06-16

## Resultado

No se pudo completar publicación/validación desde este entorno porque la URL de Azure Static Web Apps no fue alcanzable.  
No hubo cambios funcionales nuevos en esta tarea; se trabajó en validación de estado y evidencias de consistencia local para cerrar publicación.

## Método de publicación esperado

- Workflow: `.github/workflows/azure-static-web-apps-swa-puntoclub-prod-001.yml` (`Deploy Punto Club frontend`)
- Triggers:
  - push a `main` con cambios en `app/**`
  - `workflow_dispatch`
- Flujo: publicar y luego validar con cache busting en:
  - `/index.html`
  - `/src/app.js`
  - `/src/customerApi.js`
  - `/styles.css`

## Checks locales ejecutados

- Verificación de copy legado en fuentes:
  - `app/index.html`
  - `app/src/app.js`
  - `app/src/customerApi.js`
  - `app/styles.css`
- `rg -n "Confirmar password|Confirmar compra|Confirmar canje|Confirmar uso|Mock local|API real|Entrar|Busque o registre un cliente para iniciar la atencion|Busque un cliente existente|Iniciar sesion|Confirmar contraseña"`  
  Resultado: sin términos legacy críticos visibles en UI; el copy activo muestra `Iniciar sesion`, `Confirmar contraseña` y acciones ya alineadas.
- Verificación de iconos en acciones:
  - `rg -o "data-icon" ... | Measure-Object`
  - Resultado: `48` ocurrencias en assets web.
- Verificación de prohibiciones:
  - `rg -n "window\.confirm|localStorage|sessionStorage"`  
  Resultado: sin hallazgos en `app/index.html`, `app/src/app.js`, `app/src/customerApi.js`.
- Sintaxis JS:
  - `node --check app/src/app.js` OK
  - `node --check app/src/customerApi.js` OK
  - `node --check api/src/lib/notifier.js` OK

## Validación publicada intentada

Intentos de acceso a:
- `https://calm-dune-075dc5c0f.7.azurestaticapps.net/`
- `https://calm-dune-075dc5c0f.7.azurestaticapps.net/index.html`
- `https://calm-dune-075dc5c0f.7.azurestaticapps.net/src/app.js`
- `https://calm-dune-075dc5c0f.7.azurestaticapps.net/src/customerApi.js`
- `https://calm-dune-075dc5c0f.7.azurestaticapps.net/styles.css`

Error repetido:  
`No connection could be made because the target machine actively refused it. (127.0.0.1:9)`

## Bloqueo y pasos concretos

- Bloqueo: este entorno no logra conectarse a los endpoints de publicación (SWA/API), por lo que no se puede confirmar deploy ni artefactos publicados.
- Acción para desbloquear:
  1. Ejecutar `workflow_dispatch` de `Deploy Punto Club frontend` (o push a `main` con cambios en `app/`).
  2. Repetir validación de URL publicada con cache busting en los 4 assets.
  3. Confirmar presencia de `data-icon` y copy de salida final (`Iniciar sesion`, `Confirmar contraseña`, sin `Mock local`/`API real`).

