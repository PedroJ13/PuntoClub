# TASK-887 - Handoff

Nombre del Equipo: Web Dev
Modo: Staging / Identidad visual ambiente
Fecha: 2026-07-09

## Estado

Completada.

Se agrego una marca visual discreta `STAGING` que solo aparece cuando la Web usa configuracion staging.

## Cambios realizados

Archivos:

```txt
app/index.html
app/src/config.js
app/src/app.js
app/styles.css
```

Detalle:

- `app/src/config.js` ahora lee `window.PUNTO_CLUB_ENVIRONMENT`.
- `app/index.html` incluye el nodo `#environment-badge` oculto por defecto.
- `app/src/app.js` activa el badge solo si:
  - `PUNTO_CLUB_ENVIRONMENT` es `staging`, o
  - la API base contiene senales de staging.
- `app/styles.css` define un badge fijo, pequeno, no interactivo y visible sobre la UI.

## Validacion local

```txt
node --check app/src/app.js
node --check app/src/config.js
git diff --check
```

Resultado: sin errores.

## Validacion publicada staging

URL:

```txt
https://calm-coast-0fabaec0f.7.azurestaticapps.net
```

Checks HTTP:

```txt
homeStatus=200
hasBadgeMarkup=true
configHasStagingApi=true
configHasEnvironment=true
configHasProdApi=false
appHasBadgeSetup=true
cssHasBadge=true
```

Validacion visual headless:

```txt
desktop 1366x768: badge visible, texto STAGING, sin salir del viewport
mobile 390x844: badge visible, texto STAGING, sin salir del viewport
```

## Restricciones respetadas

- No se cambio API.
- No se cambio SQL.
- No se cambio ACS.
- No se cambio sender.
- No se cambiaron flags productivos.
- No se envio correo.
- El badge no depende de dominio productivo y no debe aparecer con `PUNTO_CLUB_ENVIRONMENT=production`.

## Riesgo / nota

Si alguien publica staging sin `PUNTO_CLUB_ENVIRONMENT="staging"` pero con una API staging reconocible, el fallback por URL igualmente muestra el badge. Si en el futuro se usa un dominio staging sin `staging`/`stg` en la URL, mantener la variable explicita.

