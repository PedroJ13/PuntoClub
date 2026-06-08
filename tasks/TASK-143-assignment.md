# TASK-143 - Corregir fallback/rewrite de Static Web Apps para rutas profundas

Equipo responsable: Web Dev

## Contexto

TASK-141 implemento localmente la vista publica `/company-invitations/accept?token=...`.
TASK-142 no aprobo porque en el frontend publicado estas rutas responden 404 de Azure Static Web Apps:

- `/company-invitations/accept`
- `/company-invitations/accept?token=...`

En `app/` no se observa `staticwebapp.config.json`, por lo que falta configurar fallback/rewrite para rutas profundas.

## Objetivo

Agregar la configuracion minima de Azure Static Web Apps para que rutas profundas sirvan `index.html` y la app pueda manejar la pantalla de invitacion.

## Alcance

1. Agregar o ajustar `app/staticwebapp.config.json`.
2. Configurar fallback/rewrite a `/index.html` para rutas no encontradas.
3. Asegurar que assets existentes siguen cargando:
   - `/styles.css`
   - `/src/app.js`
   - `/src/customerApi.js`
   - `/app-config.js`
4. Validar localmente la estructura del JSON.
5. Si es posible, probar local/preview que `/company-invitations/accept?token=...` carga la app y no 404.

## Fuera de alcance

- No implementar Entra login.
- No implementar `POST /api/company-invitations/accept`.
- No tocar API.
- No mover el flujo operativo existente.

## Validacion esperada

- `app/staticwebapp.config.json` valido.
- `node --check app/src/app.js`.
- `node --check app/src/customerApi.js`.
- Smoke local o explicacion clara si no se puede simular Static Web Apps.

## Entrega

Actualizar `tasks/TASK-143-HANDOFF.md`.
