# TASK-231 HANDOFF - Confirmar deploy Web de ajustes visuales empresa/admin/logo

Estado: Completado.

## Resultado

Se publico en `main` el cambio Web de TASK-226/TASK-227/TASK-228 para registro publico de empresa, mejoras del panel interno y logo/fallback de empresa activa.

La Web publicada ya sirve el bundle con:

- ruta/logica publica `/company-registration`;
- estado post-exito con `Solicitud recibida` y `Enviar otra solicitud`;
- logo opcional en registro;
- envio Web con `FormData` usando `payload` y `file`;
- panel `Admin empresas` separado;
- token interno colapsable despues de acceso valido;
- drawer de detalle;
- modal de confirmacion in-app;
- identidad visual de empresa activa en encabezado.

## Commit/deploy/Web version

- Commit publicado: `3f75e55`
- Commit completo local: `3f75e55` en `main`
- Mensaje: `Deploy company registration UX updates`
- Remote: `origin/main`
- Workflow esperado por configuracion: `Deploy Punto Club frontend`

## Checks publicados ejecutados

Ambiente:

- Web: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`

Status HTTP:

- `/company-registration`: `200`
- `/src/app.js`: `200`
- `/src/customerApi.js`: `200`

Marcadores confirmados en bundle publicado:

- `isCompanyRegistrationRoute`: encontrado.
- `Enviar otra solicitud`: encontrado.
- `registrationLogoFileInput`: encontrado.
- `admin-confirmation-modal`: encontrado.
- `activeCompanyIdentity`: encontrado.
- `FormData` con `formData.append("payload", ...)`: encontrado.

Marcadores de riesgo:

- `window.confirm`: no encontrado en `app.js` publicado.
- `localStorage`: no encontrado en `app.js`/`customerApi.js` publicados.
- `sessionStorage`: no encontrado en `app.js`/`customerApi.js` publicados.

## Rutas/pantallas verificadas

- `/company-registration`
  - Responde 200 y sirve el shell publicado con logica publica de registro.

- Bundle de `Admin empresas`
  - Contiene modal in-app y logica de drawer.
  - No conserva `window.confirm`.

- Bundle de identidad visual
  - Contiene `activeCompanyIdentity` y logica de logo/fallback.

## Validaciones locales previas

- `node --check app/src/app.js` - OK.
- `node --check app/src/customerApi.js` - OK.

## Riesgos o pendientes para QA

- No se ejecuto QA visual con navegador porque la herramienta Browser no estuvo disponible en este turno.
- QA debe validar interaccion real en desktop/mobile:
  - que `/company-registration` abra directamente el registro publico sin menu operativo;
  - que el formulario desaparezca tras exito;
  - que el logo opcional se vea y envie correctamente;
  - que `Admin empresas` colapse token y abra drawer/modal;
  - que login/logout refresque logo/fallback de empresa activa.
- Flujo positivo admin con token real y aprobacion real sigue condicionado a recibir token interno por canal seguro.
