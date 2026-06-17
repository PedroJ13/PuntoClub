# TASK-306 - QA UX, copy, correos, iconos y polish publicados

Equipo: QA
Round: 44
Dependencias revisadas: TASK-303, TASK-304, TASK-305
Estado: Completed
Fecha: 2026-06-16

## Resultado

**No aprobado.**

La app publicada **no refleja** la pasada de UX/copy/iconos final en varias pantallas clave y no coincide con lo esperado por `NEXT_PHASE_UX_COPY_POLISH.md`.

No se observaron regresiones funcionales P0/P1 durante esta validación de contenido y vistas estáticas.

## Evidencia inspeccionada (publicado)

- URL validada: `https://calm-dune-075dc5c0f.7.azurestaticapps.net`
- Descarga de assets:
  - `app/index.html`
  - `app/src/app.js` (desde publicación)
  - `app/src/customerApi.js` (desde publicación)
  - `app/styles.css`

## Hallazgos

### P2 — Copy y labels legacy no actualizados

- `app/index.html` aún muestra textos legacy:
  - `Password` (label de acceso)
  - `Confirmar password`
  - `Iniciar sesion` y `Entrar` en login
  - `Busque o registre un cliente para iniciar la atencion.`
  - `Confirmar compra`, `Confirmar canje`, `Confirmar uso`
- `app/src/app.js` (publicado) mantiene mensajes con lenguaje legacy en estados y botones:
  - `Busque o registre...` y variantes con `Busque...` en mensajes de operaciones
  - `Entrando...`, `Las contraseñas no coinciden.` (en lugar de versión objetivo)
  - `Ya existe una empresa registrada con ese correo... Inicia sesion...` (sin ajustar a copy final de tono/acción en varias rutas de login/access)

### P2 — Copy de fuente de datos

- En `app/index.html` aparece:
  - `Mock local` en el estado de fuente (`#data-source-status`)
- En `app/src/customerApi.js` permanece `Mock local` / `API real` (UI de estado), que ya no debería ser visible en la experiencia publicada.

### P2 — Iconos de acciones incompletos

- No se encontró `data-icon` en `app/index.html` ni en `app/src/app.js` publicados.
- Sin esa marca no se puede validar la implementación de iconografía de botones del polish en publicada.

### P2 — Terminología recomendada no consistente en todos los flujos

- Aún se observan mensajes/acciones en español técnico con `Busque/Busque un...` en vez de `Busca...` en varios puntos principales del flujo.

## Riesgo

- El objetivo de tarea está incompleto en publicada, por lo que no está listo para pasar a cierre sin redeploy al estado final esperado de copy/iconos.

## Recomendación de cierre / siguiente paso

- Sincronizar publicación con la versión final de UI (incluyendo `TASK-303/304/305`), y revalidar:
  - `Password` → `Contraseña`
  - `Entrar` → `Iniciar sesion`
  - `Confirmar compra/canje/uso` → `Registrar compra`, `Redimir puntos`, `Aplicar beneficio`
  - `Busque ...` mensajes de empty/ayuda → formas finales (`Busca...`) y copy de errores de acción
  - estado de fuente `Mock local`/`API real` removido o alineado a publicación real
  - `data-icon` en acciones principales visibles

